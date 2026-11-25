# ADR-007 — Import des référentiels, graphe des sentiers et moteur de routage

**Statut :** proposé
**Date :** 25/11/2026
**Décidé par :** équipe projet

---

## Contexte

Les sentiers officiels balisés et les spots de pêche forment deux référentiels
internes, chargés par import (`REQ-032`). Seuls ces sentiers peuvent être
proposés : le trajet choisi comme le trajet conseillé n'empruntent que des
sentiers du référentiel (`R-01`).

Ce que les specs demandent au référentiel et au routage :

- **Import** (`SPEC-REF-04`) — lancé par l'équipe projet ; contrôle élément par
  élément (champs, position à La Réunion, tracé avec altitudes complètes, points
  d'eau proches du tracé, critères de sécurité réservés au panel pilote, zone
  météo existante, cohérence du panel pilote, alias uniques) ; refus motivé sans
  bloquer les éléments valides ; fichier illisible refusé en entier ; mise à
  jour sans doublon en conservant forçages et alertes ; retrait par un import
  explicite de retrait ; compte rendu. Le format est laissé à l'équipe.
- **Sentiers** (`SPEC-REF-01`) — tracé avec altitudes, longueur, dénivelés,
  cotation officielle, appartenance au panel pilote ; enchaînement de deux
  sentiers **seulement par un point de jonction commun** (AC-3, hypothèse de
  modélisation).
- **Trajet choisi** (`SPEC-TRAIL-02`, `REQ-003`) — le plus court en distance
  parmi les itinéraires qui respectent le dénivelé accepté et la difficulté
  maximale ; l'état des sentiers n'entre pas dans la construction ;
  ajustement par l'utilisateur, refusé s'il sort du référentiel ou rend le trajet
  discontinu.
- **Aucun itinéraire valide** (`SPEC-TRAIL-03`) — nommer chaque contrainte
  bloquante (départ et arrivée non reliés, dénivelé, difficulté, point hors
  référentiel, plage de distance ou de durée) et proposer un parcours proche :
  même départ, arrivée relâchée, puis dénivelé le plus proche.
- **Suggestion par distance ou par niveau** (`SPEC-TRAIL-04`, `REQ-010`) — depuis
  un point de départ, trace dont la longueur est la plus proche du milieu de la
  plage saisie, ou dont la durée estimée tombe dans la plage du palier de VMA.
- **Trajet conseillé** (`SPEC-TRAIL-07`, `REQ-008`) — uniquement sur le panel
  pilote (3 parcours et leurs variantes déclarées, `REQ-023`), sentiers
  disponibles à leur heure estimée de passage, aller et retour ; départage par
  verdict, alertes, puis proximité du départ.
- **Météo par tronçon** (`R-03`, `SPEC-METEO-02` cas limite 5, `SPEC-METEO-04`)
  — un tronçon qui traverse plusieurs zones est découpé en autant de tronçons ;
  chaque tronçon reçoit la météo de sa zone à son heure estimée de passage, et
  deux météos en aller-retour.

Contraintes transverses : backend Express 5 / TypeScript (`ADR-001`) ;
découpage météo en GeoJSON lu au démarrage (`ADR-003`) ; résultats déterministes
et reproductibles (`REQ-107`) ; coût nul (`REQ-102`) ; fin de cycle le
09/12/2026. Le graphe du panel pilote et des sentiers chargés au-delà compte de
quelques dizaines à quelques centaines de sentiers.

## Options envisagées

### Format d'import

#### Option F1 — GeoJSON

| | |
|---|---|
| Ce qu'elle apporte | Format ouvert standard, éditable et vérifiable visuellement dans des outils SIG libres ; géométries 3D natives (altitude en 3ᵉ coordonnée) ; même format que le découpage météo (`ADR-003`). |
| Ce qu'elle coûte | Les données sans géométrie (composition des parcours pilotes, retraits) tiennent dans des entités sans géométrie, moins naturelles à éditer. |
| Ce qu'elle rend difficile plus tard | Rien de notable : la plupart des sources se convertissent en GeoJSON. |

#### Option F2 — GPX pour les tracés, CSV pour les attributs

| | |
|---|---|
| Ce qu'elle apporte | Format des tracés de randonnée publiés ; CSV éditable en tableur. |
| Ce qu'elle coûte | Plusieurs fichiers à garder cohérents par identifiant ; jonctions et points d'eau mal représentés ; deux analyseurs à écrire. |
| Ce qu'elle rend difficile plus tard | Ajouter un attribut structuré (liste de critères, alias multiples). |

#### Option F3 — JSON propre au projet

| | |
|---|---|
| Ce qu'elle apporte | Structure libre, validée par schéma. |
| Ce qu'elle coûte | Aucun outil pour éditer ou visualiser les tracés. |
| Ce qu'elle rend difficile plus tard | Échanger les données avec une source ou un outil externe. |

### Moteur de routage

#### Option R1 — Graphe en mémoire et algorithmes en TypeScript dans le backend

| | |
|---|---|
| Ce qu'elle apporte | Routage exclusivement sur le référentiel (`R-01`) ; contraintes propres au projet (dénivelé cumulé, difficulté maximale, énumération par distance) codées directement ; calcul déterministe et testable unitairement (`REQ-107`) ; aucun service supplémentaire. |
| Ce qu'elle coûte | Algorithmes à écrire et à tester par l'équipe ; graphe à reconstruire au démarrage. |
| Ce qu'elle rend difficile plus tard | Passer à l'échelle d'un très grand réseau (île entière à grain fin) sans optimisation. |

#### Option R2 — pgRouting dans une base PostgreSQL / PostGIS

| | |
|---|---|
| Ce qu'elle apporte | Algorithmes de plus court chemin éprouvés, exécutés dans la base. |
| Ce qu'elle coûte | Impose PostgreSQL / PostGIS à `ADR-002` ; la contrainte de dénivelé cumulé et l'énumération bornée par distance ne sont pas fournies et resteraient à écrire en SQL ; tests plus lourds (base nécessaire). |
| Ce qu'elle rend difficile plus tard | Changer de base de données. |

#### Option R3 — Moteur de routage externe (OSRM, GraphHopper)

| | |
|---|---|
| Ce qu'elle apporte | Moteur performant et maintenu. |
| Ce qu'elle coûte | Conteneur supplémentaire ; conçu pour router sur OpenStreetMap, il faudrait lui fournir un réseau limité au référentiel pour respecter `R-01` ; contraintes de dénivelé cumulé et de difficulté maximale hors de son modèle. |
| Ce qu'elle rend difficile plus tard | Faire évoluer les règles de construction, enfermées dans la configuration du moteur. |

## Décision

Nous retenons le **GeoJSON** pour l'import (option F1), avec des **jonctions
déclarées** dans les fichiers, et un **graphe en mémoire avec des algorithmes
écrits en TypeScript** dans le backend (option R1) ; le découpage des sentiers
en tronçons par zone météo est **précalculé au démarrage**.

### Import

1. **Fichiers.** GeoJSON en WGS 84 (longitude, latitude, altitude en mètres),
   un fichier par nature d'élément :
   - `sentiers` — `LineString` à 3 coordonnées : identifiant, nom, cotation
     officielle, appartenance au panel pilote, identifiants des jonctions par
     lesquelles il passe, alias de sources, critères de sécurité (sentiers
     pilotes seulement) ;
   - `jonctions` — `Point` : identifiant ;
   - `points-eau` — `Point` : identifiant, sentier de rattachement ;
   - `parcours-pilotes` — entités sans géométrie : identifiant, nom, liste
     ordonnée des sentiers, variantes déclarées ;
   - `spots` — `Point` : identifiant, nom, commune facultative, zone de pluie,
     alias de sources ;
   - `retraits` — entités sans géométrie : nature et identifiant de l'élément à
     retirer (`SPEC-REF-04`, cas limite 13).
2. **Contrôles.** Schémas de validation dans le backend (`ADR-001`), puis
   contrôles de cohérence de `SPEC-REF-04` : altitude présente sur chaque
   sommet, position dans l'emprise de La Réunion, jonction située sur le tracé
   de chaque sentier qui la cite (à une tolérance près), point d'eau à moins de
   la distance maximale du tracé, zone météo existante dans le découpage
   (`ADR-003`), cohérence panel pilote / parcours, unicité des identifiants et
   des alias. Longueur et dénivelés sont **calculés** à partir du tracé, jamais
   lus dans le fichier.
3. **Exécution.** Script en ligne de commande lancé par l'équipe projet. Fichier
   illisible : rien n'est écrit. Sinon, les éléments valides sont écrits en une
   transaction ; les forçages et alertes rattachés sont conservés. Le compte
   rendu (ajoutés, mis à jour, retirés, refusés avec motif, absents du fichier)
   est affiché et écrit dans un fichier.
4. **Prise en compte.** Le backend reconstruit graphe et découpage à son
   démarrage ; un import est suivi d'un redémarrage du backend, comme une
   modification du découpage météo (`ADR-003`).

### Graphe

5. **Nœuds** : les jonctions déclarées et les extrémités de chaque sentier.
   **Arêtes** : les portions d'un sentier entre deux nœuds consécutifs le long de
   son tracé ; chaque arête garde l'identifiant de son sentier, sa géométrie 3D,
   sa longueur, son dénivelé positif et négatif dans chaque sens, et la
   cotation du sentier. Deux sentiers qui se croisent sans jonction déclarée ne
   communiquent pas (`SPEC-REF-01` AC-3).
6. **Points saisis.** Un départ ou une arrivée est projeté sur l'arête la plus
   proche ; au-delà d'une distance maximale paramétrée (`ADR-003`), la contrainte
   « point hors référentiel » est renvoyée (`SPEC-TRAIL-03`, cas limite 3).

### Algorithmes

7. **Trajet choisi** (`SPEC-TRAIL-02`). Les arêtes dont la cotation dépasse la
   difficulté maximale sont écartées ; puis une recherche du plus court chemin
   sous contrainte de dénivelé (étiquettes non dominées distance / dénivelé
   cumulé) donne le plus court itinéraire qui respecte le dénivelé accepté. Les
   égalités sont départagées par un ordre stable des identifiants (`REQ-107`).
8. **Contrainte bloquante et parcours proche** (`SPEC-TRAIL-03`). En cas
   d'échec, la recherche est relancée en levant une contrainte à la fois
   (connexité seule, sans dénivelé, sans difficulté) pour nommer chaque
   contrainte bloquante et le dénivelé minimal nécessaire ; le parcours proche
   garde le départ et vise le nœud atteignable le plus proche de l'arrivée.
9. **Suggestion par distance ou par niveau** (`SPEC-TRAIL-04`). Énumération en
   profondeur des chemins simples depuis le départ, élaguée dès que la longueur,
   le dénivelé ou la difficulté sortent des bornes, et plafonnée par un nombre
   maximal de chemins explorés (paramètre `ADR-003`). Par distance : le chemin le
   plus proche du milieu de la plage ; par niveau : la durée de chaque candidat
   est calculée par le moteur de calcul (`ADR-008`).
10. **Trajet conseillé** (`SPEC-TRAIL-07`). Pas de recherche libre : les
    candidats sont les parcours pilotes et leurs variantes déclarées dans
    l'import. Chacun est évalué (heures de passage, état et règles de chaque
    sentier à son heure, aller et retour, verdict) puis filtré et classé selon
    `SPEC-TRAIL-07`.
11. **Ajustement** (`SPEC-TRAIL-02`). Le remplacement d'un sentier est accepté
    seulement si le trajet résultant reste une suite d'arêtes du graphe reliées
    par des nœuds communs.

### Découpage par zone météo

12. Au démarrage, après chargement du graphe et du découpage météo, chaque arête
    est découpée en tronçons par zone : intersection avec les emprises, puis
    coupure aux limites d'altitude, le point de coupure étant interpolé entre
    deux sommets du tracé. Chaque tronçon porte sa zone (ou l'absence de zone,
    `SPEC-METEO-02` cas limite 2), sa position le long de l'arête et ses
    dénivelés. Ce découpage reste en mémoire jusqu'au prochain démarrage.
13. À chaque recherche, le moteur de calcul attribue une heure de passage à
    chaque tronçon du trajet, aller et retour séparément (`SPEC-METEO-04`).

## Raisons

- **`R-01` impose de router sur le référentiel et rien d'autre.** Un moteur
  externe (R3) route sur OpenStreetMap ; le restreindre au référentiel revient à
  lui fournir notre propre graphe, sans profiter de ses atouts.
- **Les contraintes sont propres au projet.** Plus court chemin sous plafond de
  dénivelé cumulé, énumération par plage de distance, candidats déclarés du
  trajet conseillé : aucun moteur ni pgRouting ne les fournit ; il faudrait les
  écrire de toute façon. Les écrire en TypeScript les garde testables sans base
  (`REQ-107`) et laisse `ADR-002` libre de son choix de base.
- **La taille du graphe le permet.** Quelques centaines d'arêtes : une recherche
  par étiquettes et une énumération plafonnée restent instantanées.
- **Jonctions déclarées.** Elles appliquent l'hypothèse de `SPEC-REF-01` sans
  créer de fausse connexion entre deux sentiers qui se croisent sans communiquer
  (pont, ravine) ; elles sont contrôlées à l'import.
- **GeoJSON.** Les tracés 3D, les jonctions, les points d'eau et les spots sont
  des géométries ; un format SIG ouvert permet de les vérifier visuellement et
  partage l'outillage du découpage météo.
- **Découpage précalculé.** Zones et référentiel ne changent qu'au redémarrage
  (`ADR-003`, point 4 ci-dessus) : un calcul unique évite de refaire les
  intersections à chaque recherche.

## Conséquences acceptées

- **Algorithmes à écrire et à tester** par l'équipe : plus court chemin sous
  contrainte, diagnostic des contraintes bloquantes, énumération bornée,
  projection d'un point, découpage par zone. Chacun reçoit des jeux de référence
  (`REQ-107`).
- **Plafond d'exploration.** La suggestion par distance peut ne pas examiner
  tous les chemins sur un grand réseau ; le plafond est un paramètre, et un
  plafond atteint est journalisé.
- **Redémarrage après chaque import.** Simple à opérer pour l'équipe, qui lance
  seule les imports (`SPEC-REF-04`).
- **Saisie des jonctions.** Chaque jonction doit être déclarée et citée par les
  sentiers qui y passent ; un oubli rend deux sentiers non enchaînables, ce qui
  se voit au compte rendu et aux tests du panel pilote.
- **Nouveaux paramètres** à ajouter au catalogue d'`ADR-003` : distance maximale
  d'un point saisi au référentiel, tolérance de position d'une jonction sur un
  tracé, nombre maximal de chemins explorés.
- **Source des tracés et altitudes non tranchée ici** : elle relève du catalogue
  des sources (`REQ-113`). L'import exige seulement des tracés complets en
  altitude.
- **Dépendances** : stockage des géométries (`ADR-002`) ; paramètres
  (`ADR-003`) ; durée, heures de passage et verdict par les moteurs de calcul
  (`ADR-008`) ; tracé exporté (`ADR-010`).

## Ce qui nous ferait revenir dessus

- Le référentiel chargé dépasse quelques milliers d'arêtes et les recherches
  deviennent perceptiblement lentes : on reconsidère pgRouting (R2) ou une
  optimisation de l'énumération.
- Le plafond d'exploration fait régulièrement manquer une trace pourtant
  présente dans la plage de distance : on change d'algorithme de suggestion.
- La saisie manuelle des jonctions devient la principale source d'erreurs
  d'import : on ajoute une détection automatique, soumise à confirmation.
- Le client demande de modifier les référentiels depuis l'espace
  d'administration : le rechargement à chaud du graphe devient nécessaire.
