# ADR-010 — Génération, simplification de trace et validation GPX 1.1

**Statut :** proposé
**Date :** 26/11/2026
**Décidé par :** équipe projet

---

## Contexte

Sur le terrain, en zone sans réseau, le fichier `.gpx` est le seul support de
l'utilisateur : l'application ne fonctionne que connectée (`REQ-109`,
`CR-001/Q27`) et ne se synchronise avec aucune montre (`CR-001/Q19`).
L'utilisateur valide un tracé et le télécharge (`REQ-011`) ; le fichier respecte
le format standard (`REQ-110`).

Ce que les specs fixent déjà :

- **Validation** (`SPEC-GPX-01`) — un seul tracé validé à la fois (trajet
  choisi, trajet conseillé ou parcours proche) ; toute modification du trajet
  ou des critères l'annule ; état des sentiers et verdict relus à la
  validation ; tracé validé non conservé au-delà de la session de préparation
  (hypothèse).
- **Contenu** (`SPEC-GPX-02`) — une trace continue qui suit le tracé validé
  sentier par sentier, sans tronçon hors référentiel (`R-01`) ; aller puis
  retour, fin au point de départ ; altitude du référentiel sur chaque point, et
  aucun point avec une altitude supposée ; nom du parcours (départ et arrivée
  du tracé validé), date et heure de production ; mention d'aide indicative,
  qui nomme les sentiers signalés fermés ou désactivés ; points d'eau affichés
  par `SPEC-CALC-05` en points de passage, avec l'avertissement de `R-09`, ou
  mention de leur indisponibilité ; aucune donnée personnelle, aucun temps
  estimé ; nom de fichier `meteosport_<départ>_<arrivée>_<AAAA-MM-JJ>.gpx`.
  État des sentiers relu au téléchargement : un sentier devenu fermé ou
  désactivé annule la validation (cas limite 9). Refus du tracé d'un autre
  utilisateur (`REQ-105`). Aucun fichier partiel sans connexion.
- **Conformité** (`SPEC-GPX-03`) — GPX 1.1 ; contrôle contre le schéma public
  à chaque production **et** dans les tests ; aucun fichier non conforme remis ;
  caractères accentués et spéciaux restitués ; simplification d'une trace qui
  dépasse le nombre maximal de points, dans une tolérance d'écart (10 m,
  hypothèse) et une tolérance de distance (2 %, hypothèse), en gardant départ,
  arrivée, point de demi-tour et jonctions ; points d'eau non modifiés ; en cas
  de conflit, **le nombre maximal de points prime**.

Décisions déjà prises : backend Express 5 / TypeScript (`ADR-001`) ;
géométries en WGS 84 (`ADR-002`) ; sessions serveur dans PostgreSQL
(`ADR-004`) ; nombre maximal de points et tolérances en paramètres (`ADR-003`) ;
graphe des sentiers et jonctions (`ADR-007`) ; points d'eau, état des sentiers
et verdict calculés par les moteurs (`ADR-008`).

## Options envisagées

### Écriture du XML

#### Option S1 — Bibliothèque de construction XML (xmlbuilder2)

| | |
|---|---|
| Ce qu'elle apporte | Arbre XML construit élément par élément, encodage UTF-8 et échappement des caractères réservés pris en charge (`SPEC-GPX-03` cas limite 4) ; licence MIT, sans module natif. L'équipe garde la main sur le contenu GPX. |
| Ce qu'elle coûte | Une dépendance ; le modèle GPX (ordre des éléments imposé par le schéma) est à écrire par l'équipe. |
| Ce qu'elle rend difficile plus tard | Rien de notable. |

#### Option S2 — Bibliothèque GPX dédiée

| | |
|---|---|
| Ce qu'elle apporte | Modèle GPX prêt à l'emploi. |
| Ce qu'elle coûte | Moins de contrôle sur le texte des points de passage et des métadonnées ; paquets peu maintenus. |
| Ce qu'elle rend difficile plus tard | Corriger un écart au schéma situé dans la bibliothèque. |

#### Option S3 — Gabarit texte écrit à la main

| | |
|---|---|
| Ce qu'elle apporte | Aucune dépendance. |
| Ce qu'elle coûte | Échappement et encodage à la charge de l'équipe : première cause de fichiers invalides. |
| Ce qu'elle rend difficile plus tard | Faire évoluer le contenu sans casser la conformité. |

### Simplification

#### Option D1 — Douglas-Peucker par morceaux, tolérance relevée jusqu'au plafond

| | |
|---|---|
| Ce qu'elle apporte | Écart maximal à la trace d'origine garanti par construction (la tolérance) ; points clés protégés en coupant la trace à leur niveau ; algorithme connu et simple à tester. |
| Ce qu'elle coûte | Si la tolérance d'écart ne suffit pas à passer sous le plafond, elle doit être relevée, donc dépassée. |
| Ce qu'elle rend difficile plus tard | Viser un nombre exact de points. |

#### Option D2 — Visvalingam-Whyatt

| | |
|---|---|
| Ce qu'elle apporte | Atteint exactement le plafond ; rendu visuel souvent plus naturel. |
| Ce qu'elle coûte | L'écart maximal n'est pas borné par l'algorithme : il faut le mesurer après coup pour vérifier `SPEC-GPX-03` AC-4. |
| Ce qu'elle rend difficile plus tard | Expliquer à la recette pourquoi un point a disparu. |

### Validation contre le schéma

#### Option V1 — xmllint compilé en WebAssembly

| | |
|---|---|
| Ce qu'elle apporte | Le validateur de référence (libxml2) sans module natif à compiler dans l'image Docker ; même résultat en test et en production. |
| Ce qu'elle coûte | Quelques dizaines de millisecondes par fichier ; paquet moins répandu que les liaisons natives. |
| Ce qu'elle rend difficile plus tard | Rien de notable. |

#### Option V2 — Liaison native libxmljs2

| | |
|---|---|
| Ce qu'elle apporte | Plus rapide. |
| Ce qu'elle coûte | Compilation native dans l'image Node, source fréquente d'échecs de build ; maintenance irrégulière. |
| Ce qu'elle rend difficile plus tard | Monter de version de Node. |

#### Option V3 — xmllint du système, appelé en sous-processus

| | |
|---|---|
| Ce qu'elle apporte | Outil standard. |
| Ce qu'elle coûte | Dépend du contenu de l'image ; un processus lancé à chaque téléchargement ; tests différents selon le poste. |
| Ce qu'elle rend difficile plus tard | Exécuter les tests hors conteneur. |

### Conservation du tracé validé

#### Option T1 — Dans la session serveur

| | |
|---|---|
| Ce qu'elle apporte | Disparaît avec la session (`SPEC-GPX-01`, hypothèse) ; accessible seulement par son titulaire, sans identifiant dans l'URL (`REQ-105`, `ADR-004`). |
| Ce qu'elle coûte | Une donnée de plus dans la session. |
| Ce qu'elle rend difficile plus tard | Retélécharger après reconnexion (non demandé). |

#### Option T2 — Table dédiée avec expiration

| | |
|---|---|
| Ce qu'elle apporte | Survit à une reconnexion. |
| Ce qu'elle coûte | Une table et une purge de plus, pour un besoin que `SPEC-GPX-01` écarte. |
| Ce qu'elle rend difficile plus tard | Rien de notable. |

#### Option T3 — Tracé renvoyé par le navigateur

| | |
|---|---|
| Ce qu'elle apporte | Aucun stockage. |
| Ce qu'elle coûte | Le serveur doit tout revérifier ; un tracé fabriqué côté client devient possible. |
| Ce qu'elle rend difficile plus tard | Garantir qu'un fichier correspond à un tracé réellement validé. |

## Décision

Nous retenons la production du fichier **dans le backend, à chaque
téléchargement**, à partir du tracé validé **gardé dans la session serveur** ; le
XML est écrit avec **xmlbuilder2**, la trace simplifiée par **Douglas-Peucker par
morceaux**, et chaque fichier **validé contre le schéma XSD GPX 1.1 avec xmllint
en WebAssembly** avant d'être remis.

### Validation et conservation

1. **Tracé validé.** À la validation (`SPEC-GPX-01`), le backend relit l'état
   des sentiers et le verdict (`ADR-008`) : un trajet conseillé qui emprunte
   désormais un sentier désactivé est refusé et recalculé (AC-6) ; un trajet
   choisi avec un sentier fermé ou désactivé, ou un verdict non favorable,
   n'est validé qu'avec la confirmation explicite de l'utilisateur, transmise
   par la requête de validation (AC-3). La session reçoit alors une description
   du tracé : type (trajet choisi, trajet conseillé, parcours proche), liste
   ordonnée des arêtes du graphe avec leur sens de parcours (`ADR-007`),
   positions de départ et d'arrivée projetées sur leur arête, aller simple ou
   aller-retour, et une empreinte des critères de la recherche. Aucune géométrie
   n'est copiée : elle est relue dans le référentiel au téléchargement. La trace
   commence et finit sur le référentiel ; aucun segment n'est ajouté pour
   rejoindre un lieu saisi à distance (`R-01`, `SPEC-GPX-02` cas limite 3).
2. **Annulation.** Toute modification du trajet choisi, du trajet conseillé ou
   des critères retire le tracé validé de la session (`SPEC-GPX-01` AC-4). Un
   seul tracé validé à la fois. Il disparaît avec la session (déconnexion,
   expiration, suppression du compte, `ADR-004`).
3. **Accès.** La route de téléchargement ne prend aucun identifiant : elle
   exporte le tracé validé de la session courante, ce qui rend impossible le
   téléchargement du tracé d'un autre utilisateur (`REQ-105`, même principe que
   les routes « mon compte » d'`ADR-004`).

### Production

4. **Relecture.** Au téléchargement, le backend relit l'état de chaque sentier
   du tracé et le verdict par les moteurs (`ADR-008`). Si un sentier est devenu
   fermé ou désactivé depuis la validation, la validation est annulée et aucun
   fichier n'est produit (`SPEC-GPX-02` cas limite 9).
5. **Contenu** (GPX 1.1, ordre imposé par le schéma) :
   - attribut `creator` : nom de l'application ;
   - `metadata` : nom du parcours (départ et arrivée du tracé validé),
     description (mention d'aide indicative, rappel de vérifier l'état des
     sentiers et la météo, sentiers signalés fermés ou désactivés, rappel
     d'emporter toute sa réserve d'eau, indisponibilité des points d'eau le cas
     échéant, date et heure de préparation en heure de La Réunion), et élément
     `time` de production au format date-heure du schéma ;
   - `wpt` : un point de passage par point d'eau affiché (`SPEC-CALC-05`),
     position inchangée, nom contenant « indicatif », description reprenant
     l'avertissement de `R-09` ;
   - `trk` : une seule trace, un seul segment continu : l'aller, puis le retour
     en aller-retour ; `ele` quand le référentiel fournit l'altitude, absent
     sinon (`SPEC-GPX-02` cas limite 6, `SPEC-GPX-03` cas limite 5) ; aucun
     élément `time` sur les points (aucun temps estimé).
6. **Aucune donnée personnelle.** Le générateur ne reçoit que le tracé, les
   points d'eau, les états des sentiers et la date de production ; il n'a pas
   accès au profil ni au compte. Le nom du fichier suit
   `meteosport_<départ>_<arrivée>_<AAAA-MM-JJ>.gpx`, translittéré sans accent
   ni espace.
7. **Encodage.** UTF-8 déclaré ; échappement par la bibliothèque. Le texte
   affiché (noms accentués) n'est jamais translittéré dans le contenu du
   fichier, seulement dans son nom.

### Simplification

8. **Déclenchement.** Seulement si le nombre de points de la trace complète
   dépasse le plafond paramétré (`ADR-003`) ; sinon tous les points du
   référentiel sont exportés (`SPEC-GPX-03` cas limite 3).
9. **Méthode.** La trace de l'aller est projetée en UTM 40 Sud pour mesurer les
   écarts en mètres, puis coupée aux points protégés : départ, arrivée (point
   de demi-tour en aller-retour) et jonctions entre sentiers. Chaque morceau est
   simplifié par Douglas-Peucker à la tolérance d'écart paramétrée. Les points
   conservés gardent leur position et leur altitude d'origine. La méthode est
   déterministe : deux téléchargements du même tracé validé donnent des fichiers
   identiques, hormis la date de préparation (`SPEC-GPX-02` cas limite 4).
10. **Plafond.** Si le total dépasse encore le plafond, la tolérance est relevée
    par recherche dichotomique jusqu'à passer sous le plafond ; le plafond prime
    (`SPEC-GPX-03`, hypothèse). En aller-retour, le retour est l'aller simplifié
    parcouru en sens inverse : chaque sens dispose de la moitié du plafond.
11. **Contrôle.** Après simplification, l'écart maximal effectif et l'écart de
    distance avec le tracé du référentiel sont mesurés. Un dépassement de l'une
    des tolérances est journalisé avec le parcours concerné ; le fichier est
    remis (le plafond prime) et le cas alimente la revue des tolérances à la
    recette (`SPEC-GPX-03`).

### Validation contre le schéma

12. **Schéma embarqué.** Le schéma XSD officiel GPX 1.1 est versionné dans le
    dépôt ; il n'est jamais téléchargé à l'exécution.
13. **À chaque production.** Le fichier est validé avec xmllint en WebAssembly
    avant d'être envoyé. En cas d'écart, aucun fichier n'est remis, un message
    signale l'erreur à l'utilisateur et l'écart est journalisé (`SPEC-GPX-03`
    AC-5).
14. **Dans les tests.** Les jeux de référence du panel pilote (aller simple et
    aller-retour, trace longue, noms accentués et caractères spéciaux, points
    sans altitude, sans point d'eau, points d'eau indisponibles) produisent des
    fichiers validés par le même outil, et comparés au tracé de référence
    (`SPEC-GPX-03` AC-1, AC-2, AC-4).
15. **Envoi.** Le fichier n'est envoyé qu'une fois entièrement produit et
    validé, avec un en-tête de téléchargement : pas de fichier partiel
    (`SPEC-GPX-02` cas limite 1).

## Raisons

- **Backend plutôt que navigateur.** La relecture de l'état des sentiers au
  téléchargement, le refus du tracé d'un autre utilisateur et la validation
  contre le schéma exigent le serveur ; un fichier produit dans le navigateur
  pourrait être remis sans ces contrôles.
- **Session plutôt que table.** `SPEC-GPX-01` ne conserve pas le tracé au-delà
  de la session : la session serveur d'`ADR-004` a exactement cette durée de
  vie, et son cloisonnement règle `REQ-105` sans contrôle supplémentaire.
- **xmlbuilder2.** L'échappement et l'encodage sont la cause la plus courante
  d'un GPX invalide ; une bibliothèque les règle, sans module natif dans
  l'image Docker (`ADR-001`), tout en laissant l'équipe écrire le contenu exigé
  par `SPEC-GPX-02`.
- **Douglas-Peucker par morceaux.** `SPEC-GPX-03` exprime ses exigences en
  écart maximal et en points protégés : c'est exactement ce que garantit
  Douglas-Peucker sur des morceaux coupés aux points clés. La relève de la
  tolérance applique la priorité du plafond sans changer d'algorithme.
- **Validation par libxml2 en WebAssembly.** Le contrôle à chaque production est
  exigé (`SPEC-GPX-03`) ; c'est le validateur de référence, sans compilation
  native, identique en test et en production.

## Conséquences acceptées

- **Coût de chaque téléchargement** : relecture des états, verdict,
  simplification et validation XSD à chaque fois. Acceptable pour un fichier
  produit à la demande d'un utilisateur ; aucun fichier n'est mis en cache.
- **Tolérance d'écart dépassable** quand le plafond l'impose. Le dépassement est
  mesuré et journalisé ; les tolérances et le plafond sont revus à la recette
  sur les appareils de test, comme prévu par `SPEC-GPX-03`.
- **Plafond à fixer sur les appareils de test**, dont la liste n'est pas définie
  (`SPEC-GPX-03`, « Ce qui n'est pas défini »).
- **Deux dépendances** (xmlbuilder2, xmllint en WebAssembly) et le schéma XSD à
  versionner dans le dépôt ; licences à vérifier avant l'ajout (`REQ-102` :
  aucun coût).
- **Tracé perdu à la déconnexion** : l'utilisateur doit valider de nouveau
  après une reconnexion (hypothèse de `SPEC-GPX-01`).
- **Texte de la mention d'aide indicative et de l'avertissement** à aligner sur
  le modèle de CGU (`SPEC-GPX-02`, `SPEC-CALC-05`) ; il est rédigé par les
  textes types, jamais par l'IA (`ADR-009`).
- **Points d'eau visibles sans avertissement sur certaines montres**, qui
  n'affichent que le nom d'un point de passage : le mot « indicatif » dans le
  nom limite ce risque, sans l'éliminer (`SPEC-GPX-02`).

## Ce qui nous ferait revenir dessus

- Un appareil de test refuse un fichier pourtant conforme au schéma (trace trop
  longue, extension attendue, trace en un seul segment) : on adapte la forme du
  fichier (segments, plafond) pour cet appareil.
- La simplification dépasse souvent la tolérance de distance sur les sentiers en
  lacets du panel pilote : on essaie Visvalingam-Whyatt (D2) ou une
  simplification qui préserve la longueur.
- xmllint en WebAssembly se révèle trop lent ou mal maintenu : validation à la
  production remplacée par l'outil du système (V3), les tests gardant le même
  schéma.
- Le client demande de retrouver un tracé validé après reconnexion ou sur un
  autre appareil : on passe à une table dédiée (T2).
