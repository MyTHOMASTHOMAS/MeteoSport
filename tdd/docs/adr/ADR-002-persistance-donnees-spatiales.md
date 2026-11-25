# ADR-002 — Persistance des données, géométries et historique interne des pluies

**Statut :** proposé
**Date :** 25/11/2026
**Décidé par :** <à compléter>

---

## Contexte

L'application doit conserver, sur le poste de démonstration, trois familles de
données de nature différente.

**1. Données relationnelles**

- *Comptes* : identifiant, mot de passe non réversible, rôle, attestation d'âge,
  date d'acceptation des CGU (`SPEC-AUTH-01`), compteur d'échecs et blocage
  portés par le compte (`SPEC-AUTH-04`), profil et classement des sports
  (`REQ-015`), consentement et historique de ses dates d'octroi et de retrait
  (`SPEC-AUTH-05` cas 7). La suppression d'un compte efface immédiatement et
  définitivement ses données personnelles (`SPEC-AUTH-10`). Les sessions serveur
  qu'il faut pouvoir fermer sur tous les appareils (`SPEC-AUTH-10` AC-4) relèvent
  d'`ADR-004`.
- *Référentiels* (`REQ-032`, `SPEC-REF-01` à `05`) : sentiers, spots, points
  d'eau rattachés à un ou plusieurs sentiers, critères de sécurité des sentiers
  pilotes, composition **ordonnée** des parcours pilotes, alias de sources
  (identifiants donnés par les sources, uniques : `SPEC-REF-04` AC-10). Chaque
  élément est identifié par l'identifiant que lui donne sa source (`SPEC-REF-04`).
- *Administration* : forçages d'état avec auteur, date, motif et durée fixée ou
  sans limite (`REQ-021`, `R-08`, `SPEC-ADMIN-02`), saisie manuelle de l'état
  faute de source (`SPEC-ADMIN-02` AC-4) ; alertes rattachées à une ou plusieurs
  activités, avec une durée (`REQ-022`, `R-11`, `SPEC-ADMIN-03`).
- *Données externes datées* : dernier état reçu pour chaque sentier, conservé
  même périmé (`SPEC-REF-06` cas 3) ; données marines de chaque spot
  (`SPEC-REF-06` AC-5) ; informations reçues sans correspondance, consignées pour
  l'équipe (`SPEC-REF-06` AC-2).

**2. Géométries avec altitudes**

Tracés des sentiers (chaque point porte son altitude ; un tracé incomplet est
refusé à l'import : `SPEC-REF-01` cas 5, `SPEC-REF-04` cas 9), jonctions, points
d'eau, positions des spots, emprises des zones météo avec plage d'altitude
éventuelle (`SPEC-METEO-02`).

**3. Séries temporelles par zone et par heure**

- Historique interne des pluies (`R-10`, `SPEC-METEO-05`) : un créneau reçu
  plusieurs fois ne garde que la donnée la plus récente (AC-5), les données
  plus anciennes que la durée de conservation paramétrée sont supprimées (AC-6),
  l'historique n'est jamais affiché (AC-4).
- Prévisions reçues, dont la dernière prévision conservée pour les créneaux déjà
  écoulés d'un itinéraire (`SPEC-METEO-04` AC-4). La nature des pluies
  conservées dans l'historique (pluie observée ou dernière prévision reçue)
  n'est pas encore tranchée (`SPEC-METEO-05`).

**Opérations spatiales demandées par les specs**

- vérifier à l'import qu'un élément est situé à La Réunion (`SPEC-REF-04` cas 2) ;
- refuser un point d'eau trop éloigné du tracé de son sentier (`SPEC-REF-03`
  cas 3) ;
- refuser au démarrage un paramétrage dont deux zones se chevauchent, un
  chevauchement étant **un même point, position et altitude comprises,
  appartenant à deux zones**, y compris quand une zone en contient une autre
  (commune entière + secteur de cette commune) (`SPEC-METEO-02` cas 3, AC-3) ;
- rattacher chaque point d'un tracé à au plus une zone, selon sa position et son
  altitude (AC-1), et couper un tracé à chaque changement de zone (cas 5) ;
- trouver les sentiers et points d'eau proches d'une position (routage,
  parcours proche : `ADR-007`).

**Contraintes**

- coût nul, outils gratuits (`REQ-102`) ;
- démonstration de bout en bout en local, sans mise en ligne (`REQ-111`) ;
- tests automatisés reproductibles, y compris sur un poste neuf (`ADR-001`) ;
- une zone peut être retirée du paramétrage alors qu'un spot ou un critère la
  désigne encore, **sans bloquer le démarrage** (`SPEC-METEO-02` AC-5) ;
- une mise à jour d'un sentier par import conserve son forçage et ses alertes
  (`SPEC-REF-04` AC-5).

**Ordre de grandeur des volumes** (hypothèse équipe, découpage météo non encore
fixé) : quelques centaines de sentiers, une centaine de zones météo au plus.
Historique des pluies : 100 zones × 24 h × 30 jours ≈ 72 000 lignes. Prévisions :
100 zones × 72 créneaux ≈ 7 200 lignes par type de donnée. Les volumes sont
faibles : aucune option n'est éliminée pour une raison de performance.

## Options envisagées

### Option A — PostgreSQL + extension PostGIS

| | |
|---|---|
| Ce qu'elle apporte | Un seul moteur pour les trois familles de données. Types géométriques 3D (`LINESTRING Z`, `POINT Z`), index spatiaux, fonctions de position, distance, intersection et découpage d'un tracé selon des seuils d'altitude (`ST_LocateBetweenElevations`). Contraintes d'intégrité : clés étrangères, unicité des alias, unicité `(zone, créneau)` avec écrasement par la donnée la plus récente. Transactions sûres avec écritures concurrentes (requêtes utilisateurs et rafraîchissement météo en parallèle). Libre et gratuit. |
| Ce qu'elle coûte | Un service à installer et à démarrer en local : en pratique un conteneur, ce qui ajoute une dépendance à l'outillage retenu par `ADR-001`. Les tests d'intégration ont besoin d'une base réelle (conteneur de test). Une compétence SQL spatial est nécessaire dans l'équipe. |
| Ce qu'elle rend difficile plus tard | Peu de choses. Elle laisse ouverte l'extension pgRouting pour `ADR-007` et le passage à un hébergement réel si la démonstration convainc. Risque : laisser migrer de la logique métier dans le SQL, au détriment des moteurs purs d'`ADR-008`. |

### Option B — SQLite + extension SpatiaLite

| | |
|---|---|
| Ce qu'elle apporte | Base dans un simple fichier, sans serveur : rien à installer, démarrage instantané, tests sur base en mémoire très rapides. Fonctions spatiales comparables à PostGIS pour la plupart des besoins listés. Libre et gratuit. |
| Ce qu'elle coûte | Le chargement de l'extension SpatiaLite dépend de la plateforme et du pilote du langage : fragile sous Windows et selon le framework retenu (`ADR-001`). Un seul écrivain à la fois : acceptable pour une démo mono-utilisateur, à surveiller avec le rafraîchissement météo en tâche de fond. Outillage 3D moins mûr (découpage par altitude à écrire). |
| Ce qu'elle rend difficile plus tard | Le passage à plusieurs utilisateurs simultanés ou à un hébergement réel impose une migration de moteur. Pas d'équivalent de pgRouting : le routage serait forcément codé dans l'application. |

### Option C — Base relationnelle sans extension spatiale, géométries calculées dans le code

| | |
|---|---|
| Ce qu'elle apporte | Les géométries sont stockées sous forme de texte (GeoJSON) ; tous les calculs spatiaux sont faits par une bibliothèque de géométrie dans l'application. Cohérent avec l'esprit d'`ADR-008` : les calculs restent des fonctions testables sans base. Le choix du moteur de base devient libre. |
| Ce qu'elle coûte | Pas d'index spatial : chaque recherche de proximité charge toutes les géométries en mémoire (tenable aux volumes actuels). Les contrôles d'import (position, distance point d'eau – tracé), de chevauchement et le découpage par zone sont à écrire et à tester par l'équipe au lieu d'être fournis. Aucune garantie en base qu'une géométrie stockée est valide. |
| Ce qu'elle rend difficile plus tard | Toute croissance du référentiel ou toute nouvelle requête spatiale ajoute du code maison. Revenir vers une base spatiale impose de reprendre le stockage et les requêtes. |

## Décision

Nous retenons **PostgreSQL avec PostGIS** comme base unique pour les données
relationnelles, les géométries avec altitudes et les séries temporelles par
zone, lancé localement par le moyen retenu dans `ADR-001`.

## Raisons

- **Les contrôles spatiaux sont des exigences, pas un confort.** Le contrôle de
  position à l'import (`SPEC-REF-04` cas 2), la distance d'un point d'eau à son
  tracé (`SPEC-REF-03` cas 3), le refus des zones qui se chevauchent
  (`SPEC-METEO-02` AC-3) et le découpage d'un tracé par zone (AC-1, cas 5)
  s'écrivent en quelques requêtes PostGIS. Avec l'option C, chacun devient du
  code à écrire et à prouver.
- **Les altitudes font partie de la géométrie.** Les coordonnées Z des tracés
  sont stockées nativement. Le rattachement à une zone combine un test sur
  l'emprise et une comparaison avec la plage d'altitude ; la coupure d'un tracé
  à une limite d'altitude située entre deux de ses points est fournie par
  PostGIS au lieu d'être une interpolation maison.
- **La base garantit ce qui est stable.** Unicité des alias (`SPEC-REF-04`
  AC-10), unicité `(zone, créneau)` qui garantit qu'un créneau ne garde que la
  donnée la plus récente (`SPEC-METEO-05` AC-5), effacement des données
  personnelles d'un compte en cascade (`SPEC-AUTH-10`). Ce qui peut légitimement
  devenir invalide (références aux zones météo) n'est volontairement pas confié
  à la base : voir « Conséquences acceptées ».
- **Pas besoin d'une base dédiée aux séries temporelles.** Aux volumes estimés,
  une table indexée sur `(zone, créneau)` et une suppression périodique
  suffisent ; une extension comme TimescaleDB serait un coût sans gain.
- **SpatiaLite écartée pour sa fragilité d'installation**, pas pour ses
  fonctions : la démo doit se lancer sur un poste neuf sans manipulation
  (`REQ-111`), et le chargement de l'extension est le point qui casse le plus
  souvent selon la plateforme.
- **Coût nul respecté** (`REQ-102`) : PostgreSQL et PostGIS sont libres et
  gratuits.

## Conséquences acceptées

**Lancement et outillage**

- Un service PostgreSQL doit tourner pour lancer l'application et les tests
  d'intégration : le lancement local défini par `ADR-001` doit l'inclure
  (conteneur fourni avec la bonne version de PostGIS).
- Un outil de migration de schéma versionné est nécessaire ; son choix suit le
  framework d'`ADR-001`.
- Si `ADR-004` retient des sessions serveur, elles sont stockées dans cette base.

**Ce que la base garantit, et ce qu'elle ne garantit pas**

- **Les références aux zones météo ne sont pas des clés étrangères.** Un spot
  (secteur de pluie), un critère de sécurité et l'historique des pluies désignent
  une zone par son identifiant. Une clé étrangère bloquerait le rechargement du
  paramétrage ou effacerait la référence, alors que les specs demandent de
  démarrer et de signaler la référence devenue invalide (`SPEC-METEO-02` AC-5,
  `SPEC-REF-02` cas 6, `SPEC-REF-05` cas 6). Ces références sont contrôlées par
  l'application au démarrage. L'historique d'une zone retirée n'est plus
  alimenté ni utilisé (`SPEC-METEO-05` cas 5) et disparaît avec la purge.
- **La cascade à la suppression d'un compte ne vise que ses données
  personnelles** (profil, attestation, consentement et son historique,
  classement, sessions). Les forçages créés par un administrateur ne sont pas
  effacés avec son compte. Ce que devient la mention de l'auteur quand ce compte
  est supprimé n'est pas défini : `R-08` exige l'auteur, `SPEC-AUTH-10` efface
  les données du compte, et la conservation au-delà relève de `ZO-26`. Point à
  remonter dans `SPEC-ADMIN-02`.

**Import des référentiels** (format : `ADR-007`)

- Un import **met à jour** l'élément existant, repéré par l'identifiant de sa
  source ; il ne le supprime jamais pour le recréer. Sinon, la cascade effacerait
  le forçage et les alertes que `SPEC-REF-04` AC-5 impose de conserver.
- Un élément retiré par un import explicite de retrait (`SPEC-REF-04` cas 13)
  est **marqué comme retiré**, avec sa date, et n'est plus proposé ni
  recommandé ; il n'est pas supprimé physiquement. Le sort de ses alertes,
  forçages et alias reste non défini dans la spec ; le marqueur évite de le
  trancher par accident.
- Le contrôle « position à La Réunion » demande un contour de référence de l'île,
  importé avec les référentiels. Aucune spec n'en fixe la source : à documenter
  avec le catalogue des sources (`REQ-113`).

**Zones météo et découpage des tracés**

- **Source de vérité des zones** : le paramétrage (`ADR-003`). La base en garde
  une copie rechargée au démarrage, pour les requêtes spatiales.
- **Test de chevauchement** : deux zones se chevauchent si l'intérieur de leurs
  emprises a une surface commune, inclusion comprise, **et** si leurs plages
  d'altitude se recouvrent. Le test d'intersection des intérieurs est
  nécessaire : `ST_Overlaps` ne détecte pas l'inclusion d'une zone dans une
  autre. Les plages d'altitude sont comparées en intervalles semi-ouverts
  `[min, max[`, la limite appartenant au secteur supérieur (`SPEC-METEO-02`
  cas 1).
- **Point situé exactement sur la frontière entre deux emprises** : non traité
  par `SPEC-METEO-02`, qui ne règle que la limite d'altitude. Selon le test
  retenu, ce point appartiendrait à deux zones (contraire à AC-1) ou à aucune.
  Règle à fixer dans la spec avant l'implémentation ; le choix du test spatial
  en découle.
- **Frontière avec `ADR-008`** : la base stocke et retrouve ; elle ne décide pas.
  Le découpage de chaque tracé en portions par zone (coupure au point exact où le
  tracé franchit une emprise ou une limite d'altitude) ne change qu'au
  déploiement : il est calculé à l'import ou au démarrage, stocké, puis lu par
  les moteurs comme une entrée. Le découpage par créneau horaire, qui dépend de
  l'allure (`SPEC-METEO-04` cas 6), reste dans les moteurs de calcul.

**Coordonnées**

- Stockage en WGS 84 (`EPSG:4326`, celui du GPX, `ADR-010`) ; longueurs et
  distances calculées en projection locale RGR92 / UTM 40S (`EPSG:2975`). Les
  altitudes sont celles fournies par le référentiel importé.

**Séries temporelles**

- Prévisions reçues et historique des pluies suivent le même modèle : une ligne
  par zone, créneau et type de donnée, avec sa date de mise à jour (`REQ-104`) ;
  une réception ultérieure du même créneau remplace la précédente. Si
  `SPEC-METEO-05` retient la dernière prévision reçue comme pluie conservée,
  l'historique est tiré de ces mêmes lignes.
- La purge de l'historique des pluies est une tâche planifiée de l'application
  (suppression des créneaux plus anciens que la durée paramétrée), testée par
  `CASE-METEO-24`. Elle n'utilise pas d'extension de planification de la base.
- Les durées de conservation restent ouvertes (historique des pluies :
  `SPEC-METEO-05` ; données personnelles : `ZO-26`) : le schéma ne les code pas
  en dur, elles viennent du paramétrage.

## Ce qui nous ferait revenir dessus

- Le lancement local de PostgreSQL ne fonctionne pas de façon fiable sur le poste
  de démonstration du client, ou `ADR-001` écarte la conteneurisation →
  réévaluer l'option B (SQLite + SpatiaLite).
- Le stack retenu par `ADR-001` n'a pas de pilote PostGIS correct (types
  géométriques mal gérés) → réévaluer l'option C.
- Le découpage météo réel ou la durée de conservation des pluies font dépasser
  quelques millions de lignes d'historique → réévaluer une solution dédiée aux
  séries temporelles.
- La logique de calcul se met à dépendre de requêtes SQL spatiales au point de
  rendre les jeux de référence d'`ADR-008` non reproductibles sans base →
  recentrer la base sur le stockage.
