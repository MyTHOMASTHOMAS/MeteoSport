# Spécifications — Référentiels internes

**Domaine :** `REF`

---

## SPEC-REF-01 — Référentiel des sentiers officiels balisés

**Exigence :** REQ-032 (avec règle R-01)
**Renvois :** construction d'itinéraire REQ-003 → `SPEC-TRAIL-nn` ; affichage de l'état et de sa date REQ-004 → `SPEC-TRAIL-nn` ; cotation officielle consommée par REQ-006 / R-20 → `SPEC-TRAIL-nn`, `SPEC-CALC-nn` ; disponibilité par défaut R-02 → `SPEC-TRAIL-nn` ; trajet conseillé limité au panel pilote REQ-008 → `SPEC-TRAIL-nn` ; absence d'information sans valeur inventée R-07 → `SPEC-METEO-nn`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les sentiers officiels balisés forment un référentiel interne. Seuls les sentiers
> de ce référentiel peuvent être proposés à l'utilisateur. Chaque sentier porte son
> tracé, sa cotation officielle et son appartenance éventuelle au panel pilote.

### Portée

- Couvre les informations portées par chaque sentier : identifiant interne, nom, tracé avec altitudes, longueur, dénivelés positif et négatif, cotation officielle, appartenance au panel pilote.
- Couvre les points de jonction entre sentiers, qui permettent d'enchaîner plusieurs sentiers dans un itinéraire (hypothèse de modélisation, voir « Ce qui n'est pas défini »).
- Couvre l'état initial d'un sentier à son entrée dans le référentiel. Le vocabulaire suit REQ-004 et R-02 ; il est défini ici une seule fois et repris par `SPEC-REF-06` :
  - **état** : ouvert ou fermé (information externe ou forçage administrateur) ;
  - **indicateur de vérification** : vérifié (une information d'état datée a été reçue et n'est pas périmée, ou l'état est fixé par un forçage administrateur actif ou une saisie manuelle, sans péremption tant qu'il est actif : `SPEC-REF-06`) ou non vérifié (aucune information, source indisponible ou information périmée). Ce n'est pas un troisième état ;
  - **désactivé** : fermé, ou une règle de sécurité est déclenchée ;
  - **disponible** : non désactivé (R-02 : « disponible par défaut »).
  À son entrée, un sentier est **ouvert par défaut, non vérifié** : état « ouvert », indicateur « non vérifié », sans date d'information. Ce couple est une déduction de R-02 (disponible par défaut) et de R-07 (aucune valeur inventée).
- Ne couvre pas le chargement du référentiel → `SPEC-REF-04`.
- Ne couvre pas les points d'eau → `SPEC-REF-03`.
- Ne couvre pas les critères de sécurité du panel pilote → `SPEC-REF-05`.
- Ne couvre pas la construction de l'itinéraire → `SPEC-TRAIL-nn`.
- Ne couvre pas le forçage de l'état d'un sentier par l'administrateur → `SPEC-ADMIN-nn`.
- Ne couvre pas les sentiers non balisés ou hors de La Réunion → hors périmètre (CR-001/Q05, Q16).

### Scénarios nominaux

```gherkin
Scénario : Consultation d'un sentier du référentiel
  Étant donné le sentier « Roche Écrite » présent dans le référentiel avec sa cotation officielle
  Quand l'application a besoin de ses informations
  Alors elle obtient son tracé avec altitudes, sa longueur, ses dénivelés et sa cotation officielle
  Et elle sait qu'il appartient au panel pilote

Scénario : Enchaînement de deux sentiers
  Étant donné deux sentiers du référentiel qui partagent un point de jonction
  Quand un itinéraire doit passer de l'un à l'autre
  Alors le passage se fait par ce point de jonction

Scénario : Un sentier absent du référentiel n'existe pas pour l'application
  Étant donné un sentier balisé sur le terrain mais absent du référentiel
  Quand l'application recherche des sentiers dans ce secteur
  Alors ce sentier n'est jamais proposé
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Sentier sans point de jonction avec un autre | Il reste utilisable seul (départ et arrivée sur ce sentier) |
| 2 | Sentier nouvellement entré dans le référentiel | Ouvert par défaut, non vérifié : utilisable dans un itinéraire (R-02), mais l'absence d'information d'état est signalée à l'affichage (R-07, `SPEC-REF-06`) |
| 3 | Sentier hors panel pilote | Utilisable dans un itinéraire (trajet choisi, R-01, REQ-003) ; jamais dans un trajet conseillé (REQ-008) ; aucun critère de sécurité propre (`SPEC-REF-05`) |
| 4 | Deux sentiers portant le même nom | Distingués par leur identifiant interne |
| 5 | Sentier sans altitude sur une partie du tracé | Refusé à l'import (`SPEC-REF-04`, cas limite 9) : les altitudes sont nécessaires au temps de parcours et au découpage météo |
| 6 | Information externe d'état déjà reçue lors du chargement du sentier | Elle remplace l'état par défaut dès son rattachement, avec sa date (`SPEC-REF-06`) |
| 7 | Forçage administrateur au moment du chargement | Impossible pour un sentier nouveau : un forçage ne porte que sur un sentier déjà présent. Pour un sentier mis à jour, le forçage existant est conservé (`SPEC-REF-04`) |

### Ce qui n'est pas défini

- *24/11/2026* — Échelle de la cotation officielle (libellés, nombre de niveaux) : reprise telle que publiée par la source officielle retenue, à documenter avec les sources (`SPEC-METEO-nn`, REQ-113).
- *24/11/2026* — Liste des sentiers chargés au-delà du panel pilote : à fixer par l'équipe, selon les sources gratuites disponibles (REQ-102).
- *24/11/2026* — Tracé avec altitudes, longueur et dénivelés : REQ-032 n'impose au sentier que sa cotation officielle. Ces données sont une déduction équipe, nécessaires au calcul du temps de parcours (REQ-005 → `SPEC-CALC-nn`) et au rattachement des tronçons aux zones météo (R-03 → `SPEC-METEO-nn`).
- *24/11/2026* — Couple « état / indicateur de vérification » : déduction de R-02 et R-07 (le CDC n'emploie pas les termes « vérifié » ni « confirmé »). À confirmer à la recette.
- *24/11/2026* — Points de jonction entre sentiers : ni REQ-032 ni REQ-003 n'imposent de structure de graphe. La notion de point de jonction, et la contrainte selon laquelle deux sentiers ne s'enchaînent que par un point de jonction commun (scénario « Enchaînement », AC-3, `SPEC-REF-03` cas limite 2), sont une hypothèse de modélisation de l'équipe. Elle ne doit pas empêcher l'ajustement d'itinéraire demandé par REQ-003 ; à confirmer avec `SPEC-TRAIL-nn`.
- *24/11/2026* — Appartenance au panel pilote : portée à la fois par le sentier (AC-2) et par la composition des parcours pilotes (`SPEC-REF-05`). Leur cohérence est contrôlée à l'import (`SPEC-REF-04`, cas limite 14) ; choix d'équipe, non écrit au CDC.

### Critères d'acceptation

- [ ] AC-1 — Chaque sentier du référentiel porte un identifiant, un nom, un tracé avec altitudes, une longueur, des dénivelés et une cotation officielle (`CASE-REF-01`).
- [ ] AC-2 — Les sentiers du panel pilote sont identifiés comme tels (`CASE-REF-02`).
- [ ] AC-3 — Deux sentiers peuvent être enchaînés seulement par un point de jonction commun (hypothèse de modélisation, voir « Ce qui n'est pas défini ») (`CASE-REF-03`).
- [ ] AC-4 — Un sentier absent du référentiel n'est jamais proposé (`CASE-REF-04`).
- [ ] AC-5 — Un sentier entre dans le référentiel à l'état « ouvert », avec l'indicateur « non vérifié » et sans date d'information (`CASE-REF-05`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-02 — Référentiel des spots de pêche

**Exigence :** REQ-032
**Renvois :** position précise consommée par le calcul de distance REQ-025 → `SPEC-PECHE-nn` ; secteur de pluie consommé par REQ-024 / R-10 → `SPEC-PECHE-nn` ; découpage météo R-03 / REQ-108 → `SPEC-METEO-nn` ; alertes rattachées (Réserve naturelle marine, risque requin) R-11 / REQ-026, REQ-027 → `SPEC-ADMIN-nn`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les spots de pêche forment un référentiel interne. Seuls les spots de ce référentiel
> peuvent être recommandés. Chaque spot porte une position précise, sans distinction
> de technique de pêche.

### Portée

- Couvre les informations portées par chaque spot : identifiant interne, nom, position précise (REQ-032) et, de façon facultative, commune (information descriptive ; la position fait foi).
- Couvre la désignation, pour chaque spot, du secteur de pluie qui sert à estimer la clarté de l'eau (R-10). Dans l'hypothèse retenue (voir « Ce qui n'est pas défini »), ce secteur est une zone du découpage météo paramétré (R-03, REQ-108) ; R-10 parle de « bassins versants côtiers » sans les relier explicitement à ce découpage. Le spot y fait seulement référence ; la zone elle-même n'appartient pas aux référentiels → `SPEC-METEO-nn`.
- Couvre l'absence de distinction entre techniques (bord, chasse sous-marine) : un seul type « spot de pêche » (CR-001/Q08 ; arbitrage CR-001/§5.1).
- Ne couvre pas le chargement du référentiel → `SPEC-REF-04`.
- Ne couvre pas l'évaluation des conditions d'un spot → `SPEC-PECHE-nn`.
- Ne couvre pas les alertes rattachées aux spots (Réserve naturelle marine, risque requin) → `SPEC-ADMIN-nn`.
- Ne couvre pas la cartographie des zones réglementées en mer → hors périmètre (CR-001/Q32).

### Scénarios nominaux

```gherkin
Scénario : Consultation d'un spot du référentiel
  Étant donné un spot de pêche à Saint-Paul présent dans le référentiel
  Quand l'application a besoin de ses informations
  Alors elle obtient son identifiant interne, son nom, sa position précise et, si elle est renseignée, sa commune
  Et le secteur de pluie qui lui est rattaché

Scénario : Un spot absent du référentiel n'est jamais recommandé
  Étant donné un lieu de pêche connu mais absent du référentiel
  Quand l'application recommande des spots
  Alors ce lieu n'apparaît jamais
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Deux spots très proches l'un de l'autre | Deux spots distincts, chacun avec son identifiant |
| 2 | Spot dont la position est hors de La Réunion | Refusé à l'import (`SPEC-REF-04`, cas limite 2) |
| 3 | Spot sans secteur de pluie rattaché | Accepté ; la clarté de l'eau est affichée comme indisponible pour ce spot (R-10) |
| 4 | Spot utilisé pour la chasse sous-marine et la pêche du bord | Un seul spot, sans attribut de technique |
| 5 | Spot sans commune renseignée | Accepté : la commune est facultative, la position précise fait foi (REQ-032) |
| 6 | Secteur de pluie désigné par le spot supprimé ou renommé dans le découpage météo après l'import | Traité comme le cas 3 : clarté de l'eau indisponible, sans valeur inventée (R-07, R-10). La référence invalide est signalée à l'équipe (voir « Ce qui n'est pas défini ») |
| 7 | Spot situé à La Réunion mais à l'intérieur des terres (hors littoral) | Accepté : le contrôle d'import ne vérifie que la position à La Réunion, aucun critère « littoral » n'est appliqué (`SPEC-REF-04`, cas limite 2) |

### Ce qui n'est pas défini

- *24/11/2026* — Définition du « secteur de pluie » d'un spot (bassin versant côtier, R-10) : hypothèse retenue = une zone du découpage météo paramétré, dont les pluies récentes servent à estimer la clarté. Le spot désigne cette zone par son identifiant. Le découpage relève de `SPEC-METEO-nn`.
- *24/11/2026* — Liste initiale des spots chargés : à proposer par l'équipe ; côtes concernées : toute l'île (CR-001/Q09).
- *25/11/2026* — Commune du spot : REQ-032 n'exige que la position précise. Décision de l'équipe du 25/11/2026 = commune facultative, information descriptive seulement.
- *24/11/2026* — Mode de signalement à l'équipe d'une zone référencée devenue invalide après l'import (cas limite 6) : non défini. Pour un spot, la conséquence reste la clarté indisponible ; la désactivation par prudence décidée pour les critères des sentiers pilotes (`SPEC-REF-05` cas limite 6) ne s'applique pas aux spots.
- *25/11/2026* — Position d'un spot à l'intérieur des terres (cas limite 7) : le CDC ne définit pas de critère « littoral ». Décision de l'équipe du 25/11/2026 = contrôle limité à la position à La Réunion (`SPEC-REF-04`, cas limite 2).

### Critères d'acceptation

- [ ] AC-1 — Chaque spot porte un identifiant, un nom et une position précise ; la commune est facultative (`CASE-REF-06`).
- [ ] AC-2 — Aucun spot ne porte d'attribut de technique de pêche (`CASE-REF-07`).
- [ ] AC-3 — Un spot absent du référentiel n'est jamais recommandé (`CASE-REF-08`).
- [ ] AC-4 — Un spot sans secteur de pluie est accepté et signalé comme sans estimation de clarté (`CASE-REF-09`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-03 — Points d'eau des sentiers

**Exigence :** REQ-032 (structure du référentiel des sentiers ; supporte l'affichage des points d'eau de REQ-014, porté par `CALC`)
**Renvois :** affichage des points d'eau et avertissement REQ-014 / R-09 → `SPEC-CALC-nn`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les points d'eau potable sont enregistrés dans le référentiel des sentiers, avec
> leur position et le ou les sentiers sur lesquels ils se trouvent. Ils ont un statut
> strictement indicatif.

### Portée

- Couvre les informations d'un point d'eau : identifiant, position, un ou plusieurs sentiers de rattachement, nom éventuel.
- Couvre leur caractère indicatif, porté dans le référentiel.
- Ne couvre pas l'affichage des points d'eau et de l'avertissement R-09 → `SPEC-CALC-nn`.
- Ne couvre pas le décompte des points d'eau le long d'un itinéraire (point partagé compté une seule fois) → `SPEC-TRAIL-nn`, `SPEC-CALC-nn`.
- Ne couvre pas les abris, gîtes et échappatoires → hors périmètre (CR-001/Q17).
- Ne couvre pas la vérification de la disponibilité réelle de l'eau → hors périmètre (CR-001/Q35).

### Scénarios nominaux

```gherkin
Scénario : Points d'eau d'un sentier
  Étant donné un sentier du référentiel qui compte deux points d'eau
  Quand l'application demande les points d'eau de ce sentier
  Alors elle obtient les deux points avec leur position
  Et chacun est marqué comme indicatif
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Sentier sans point d'eau | Aucun point d'eau renvoyé ; ce n'est pas une erreur |
| 2 | Point d'eau situé au point de jonction de deux sentiers | Rattaché aux deux sentiers, sous un seul identifiant ; son décompte dans un itinéraire relève de `SPEC-TRAIL-nn` / `SPEC-CALC-nn` |
| 3 | Point d'eau sans sentier de rattachement, ou trop éloigné du tracé de son sentier | Refusé à l'import (`SPEC-REF-04`, cas limite 8) |

### Ce qui n'est pas défini

- *24/11/2026* — Points d'eau enregistrés dans le référentiel des sentiers et chargés par import : déduction de l'équipe. REQ-014 demande seulement leur affichage sur le parcours ; ni REQ-014 ni REQ-032 ne disent qu'ils font partie du référentiel. À confirmer avec le client.
- *24/11/2026* — Distance maximale entre un point d'eau et le tracé de son sentier : à proposer par l'équipe.
- *24/11/2026* — Source des points d'eau : à choisir parmi les sources gratuites et à documenter (REQ-102, REQ-113).

### Critères d'acceptation

- [ ] AC-1 — Chaque point d'eau est rattaché à au moins un sentier et porte une position (`CASE-REF-10`).
- [ ] AC-2 — Tout point d'eau est marqué comme indicatif (`CASE-REF-11`).
- [ ] AC-3 — Chaque point d'eau porte un identifiant unique, qui permet son rattachement non ambigu à un ou plusieurs sentiers (`CASE-REF-12`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-04 — Chargement des référentiels par import

**Exigence :** REQ-032, REQ-023 (avec règle R-01 ; arbitrage CR-001/§5.3 : référentiels internes chargés par import)
**Renvois :** forçage d'état conservé R-08 / REQ-021 → `SPEC-ADMIN-nn` ; alertes conservées R-11 / REQ-022 → `SPEC-ADMIN-nn` ; composition et critères des parcours pilotes R-06 → `SPEC-REF-05` ; existence des zones météo R-03 / REQ-108 → `SPEC-METEO-nn`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les référentiels des sentiers (avec leurs points d'eau, les critères de sécurité et
> la composition des parcours pilotes) et des spots de pêche sont chargés par import,
> avec les identifiants que leur donnent les sources. Un import contrôle chaque
> élément, refuse ceux qui sont incomplets ou incohérents, et rend compte de ce qui
> a été ajouté, mis à jour, retiré ou refusé. L'import est lancé par l'équipe projet ;
> un élément n'est retiré que par un import explicite de retrait.

### Portée

- Couvre le contrôle des éléments importés : champs obligatoires, position à La Réunion, cohérence du tracé (altitudes comprises), points d'eau, critères de sécurité des sentiers pilotes (zone météo existante ; critères refusés sur un sentier hors panel), composition des parcours pilotes.
- Couvre le chargement, avec chaque sentier ou spot, des identifiants que lui donnent les sources (alias). Ils forment la table de correspondance utilisée par `SPEC-REF-06`.
- Couvre l'ajout, la mise à jour d'un élément déjà présent et le compte rendu d'import.
- Couvre la conservation, lors d'une mise à jour, de l'état forcé et des alertes d'un sentier, et des alertes d'un spot (le forçage d'état ne concerne que les sentiers, R-08).
- Couvre le retrait d'un sentier ou d'un spot par un import explicite de retrait, lancé par l'équipe projet (décision de l'équipe du 25/11/2026).
- Ne couvre pas le lancement de l'import par l'administrateur : l'import est réservé à l'équipe projet en v1 (décision de l'équipe du 25/11/2026) → hors périmètre.
- Ne couvre pas le contenu de chaque référentiel → `SPEC-REF-01`, `SPEC-REF-02`, `SPEC-REF-03`, `SPEC-REF-05`.
- Ne couvre pas la modification des sentiers depuis l'espace d'administration → hors périmètre (REQ-023 : statuts et alertes seulement).

### Scénarios nominaux

```gherkin
Scénario : Premier import des sentiers
  Étant donné un référentiel des sentiers vide
  Et un fichier d'import de 3 sentiers valides
  Quand l'import est lancé
  Alors les 3 sentiers sont ajoutés
  Et le compte rendu indique 3 ajoutés, 0 mis à jour, 0 retiré, 0 refusé

Scénario : Nouvel import d'un sentier déjà présent
  Étant donné le sentier « Roche Écrite » déjà présent dans le référentiel
  Quand un import contient ce même sentier avec une cotation corrigée
  Alors le sentier est mis à jour, sans doublon
  Et le compte rendu l'indique comme mis à jour

Scénario : Élément refusé
  Étant donné un fichier d'import contenant un sentier sans cotation officielle
  Quand l'import est lancé
  Alors ce sentier est refusé avec le motif « cotation officielle manquante »
  Et les autres sentiers valides du fichier sont chargés
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Élément sans identifiant, sans nom ou sans position (la commune d'un spot est facultative, `SPEC-REF-02`) | Refusé avec le motif |
| 2 | Position hors de La Réunion | Refusée avec le motif |
| 3 | Sentier marqué « panel pilote » sans critère de sécurité | Refusé avec le motif : un sentier pilote ne peut pas être calibré sans critères (`SPEC-REF-05`, au moins un critère : décision de l'équipe du 25/11/2026) |
| 4 | Même identifiant deux fois dans un fichier | Les deux occurrences sont refusées, motif « doublon » ; un élément déjà présent garde son contenu antérieur (choix d'équipe, voir « Ce qui n'est pas défini ») |
| 5 | Mise à jour d'un sentier dont l'état est forcé par l'administrateur, ou d'un spot qui porte des alertes | Sentier : le forçage et les alertes rattachées sont conservés (R-08, R-11). Spot : les alertes rattachées sont conservées (R-11) |
| 6 | Élément présent dans le référentiel mais absent du nouveau fichier | Non supprimé automatiquement ; signalé dans le compte rendu |
| 7 | Fichier illisible ou vide | Import refusé en entier ; référentiel inchangé |
| 8 | Point d'eau sans sentier de rattachement, ou trop éloigné du tracé de son sentier | Point d'eau refusé avec le motif (`SPEC-REF-03`) |
| 9 | Sentier sans altitude sur une partie du tracé | Refusé avec le motif (`SPEC-REF-01`) |
| 10 | Critère de sécurité dont la zone météo n'existe pas dans le découpage paramétré | Critère refusé avec le motif (`SPEC-REF-05`) |
| 11 | Parcours pilote qui référence un sentier absent du référentiel et du fichier | Composition refusée avec le motif (`SPEC-REF-05`) |
| 12 | Même identifiant de source (alias) porté par deux éléments | Les deux alias sont refusés, motif « correspondance ambiguë » ; les éléments eux-mêmes sont chargés |
| 13 | Retrait d'un élément du référentiel | Par un import explicite de retrait, lancé par l'équipe projet, qui désigne l'élément par son identifiant ; jamais par simple absence du fichier (cas 6). L'élément retiré n'est plus proposé ni recommandé, et le compte rendu le liste comme retiré (décision de l'équipe du 25/11/2026). Sort des alertes, forçages et alias rattachés : voir « Ce qui n'est pas défini » |
| 14 | Incohérence entre l'appartenance au panel pilote et la composition des parcours pilotes : sentier marqué « panel pilote » absent de tout parcours pilote, ou sentier d'un parcours pilote non marqué | Refusé avec le motif « incohérence panel pilote » : le sentier marqué pilote sans parcours est refusé ; la composition qui cite un sentier non marqué est refusée (choix d'équipe, voir « Ce qui n'est pas défini ») |
| 15 | Retrait d'un sentier qui appartient à un parcours pilote | Refusé avec le motif : la composition du panel pilote est fermée (`SPEC-REF-05`, cas limite 4) et le retrait la rendrait incohérente (cas 14) |
| 16 | Sentier non pilote porteur de critères de sécurité | Refusé avec le motif « critères réservés au panel pilote » (`SPEC-REF-05`, cas limite 5 ; REQ-023, R-19) |

### Ce qui n'est pas défini

- *25/11/2026* — Personne qui lance l'import : REQ-032 cite le persona « Équipe projet, administrateur », REQ-023 limite l'espace d'administration aux statuts et aux alertes. Décision de l'équipe du 25/11/2026 = import par l'équipe projet seulement, lors de l'installation et des mises à jour du référentiel.
- *25/11/2026* — Retrait d'un sentier ou d'un spot : non demandé par le CDC. Décision de l'équipe du 25/11/2026 = retrait par l'équipe projet via un import explicite de retrait (cas limite 13). Restent non définis : le sort des alertes, forçages et alias rattachés à l'élément retiré, et le refus du retrait d'un sentier pilote (cas limite 15), choix d'équipe par cohérence avec le panel fermé. Pour information : la seule mesure prévue au CDC est le forçage d'un sentier à « fermé » par l'administrateur (R-08, REQ-021). Elle n'équivaut pas à un retrait : un sentier fermé est exclu du trajet conseillé mais reste affiché avec une alerte dans le trajet choisi (R-02), et elle ne s'applique pas aux spots.
- *24/11/2026* — Cohérence entre l'appartenance au panel pilote et la composition des parcours pilotes (cas limite 14) : refus de l'élément incohérent, choix d'équipe par prudence, non écrit au CDC.
- *24/11/2026* — Doublon d'identifiant dans un fichier (cas limite 4) : refus des deux occurrences, choix d'équipe par prudence, non écrit au CDC.
- *24/11/2026* — Doublon d'alias (cas limite 12) : refus des deux alias, choix d'équipe par prudence (une information de source ambiguë n'est rattachée à aucun élément, `SPEC-REF-06`), non écrit au CDC.
- *24/11/2026* — Format du fichier d'import : choix technique de l'équipe, hors spécification.

### Critères d'acceptation

- [ ] AC-1 — Un import valide ajoute les éléments et produit un compte rendu exact (`CASE-REF-13`).
- [ ] AC-2 — Un nouvel import met à jour un élément existant sans le dupliquer (`CASE-REF-14`).
- [ ] AC-3 — Un élément invalide est refusé avec son motif, sans bloquer les éléments valides (`CASE-REF-15`).
- [ ] AC-4 — Un sentier pilote sans critère de sécurité est refusé (`CASE-REF-16`).
- [ ] AC-5 — Une mise à jour d'un sentier conserve son forçage d'état et ses alertes ; une mise à jour d'un spot conserve ses alertes (`CASE-REF-17`).
- [ ] AC-6 — Un fichier illisible laisse le référentiel inchangé (`CASE-REF-18`).
- [ ] AC-7 — Un point d'eau sans sentier de rattachement ou trop éloigné du tracé est refusé avec son motif (`CASE-REF-19`).
- [ ] AC-8 — Un sentier sans altitude sur une partie de son tracé est refusé avec son motif (`CASE-REF-20`).
- [ ] AC-9 — Un critère dont la zone météo n'existe pas, ou un parcours pilote qui référence un sentier absent, est refusé avec son motif (`CASE-REF-21`).
- [ ] AC-10 — Les alias de source sont chargés avec leur élément ; un même alias porté par deux éléments est refusé (`CASE-REF-22`).
- [ ] AC-11 — Un sentier marqué pilote absent de tout parcours pilote, ou une composition de parcours pilote qui cite un sentier non marqué, est refusé avec le motif « incohérence panel pilote » (`CASE-REF-23`).
- [ ] AC-12 — Un import explicite de retrait retire l'élément désigné, qui n'est plus proposé ni recommandé et figure comme retiré dans le compte rendu ; le retrait d'un sentier pilote est refusé (décision de l'équipe du 25/11/2026) (`CASE-REF-24`).
- [ ] AC-13 — Un sentier non pilote porteur de critères de sécurité est refusé avec le motif « critères réservés au panel pilote » (`CASE-REF-25`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-05 — Critères de sécurité du panel pilote

**Exigence :** REQ-023 (avec règle R-06)
**Renvois :** calcul du trajet conseillé REQ-008 / R-06 → `SPEC-TRAIL-nn` ; désactivation d'un sentier R-02 → `SPEC-TRAIL-nn` ; zones du découpage météo paramétré R-03 / REQ-108 et indisponibilité R-07 → `SPEC-METEO-nn` ; grille générale hors panel R-19 → `SPEC-CALC-nn`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Chaque sentier des parcours du panel pilote (La Possession → Mafate, Roche Écrite,
> Piton des Neiges) porte ses propres critères de sécurité. Un critère décrit une
> sensibilité du terrain et la condition qui désactive le sentier. Les critères sont
> proposés par l'équipe, validés à la recette et consignés dans le référentiel.

### Portée

- Couvre la composition des 3 parcours pilotes en sentiers du référentiel ; le panel est fermé (arbitrage CR-001/§5.3).
- Couvre le contenu d'un critère : sensibilité (radier submersible, boue, ravine…), donnée observée (par exemple pluie cumulée), seuil, période, zone météo concernée.
- Couvre le fait qu'un critère déclenché désactive le sentier (R-02).
- La zone météo d'un critère est une référence à une zone du découpage météo paramétré (R-03, REQ-108). Les zones elles-mêmes ne font pas partie des référentiels → `SPEC-METEO-nn`.
- Ne couvre pas l'évaluation des critères à partir de la météo → `SPEC-CALC-nn`.
- Ne couvre pas le calcul du trajet conseillé → `SPEC-TRAIL-nn`.
- Ne couvre pas la modification des critères depuis l'espace d'administration → hors périmètre (REQ-023).
- Ne couvre pas les sentiers hors panel pilote, qui n'ont pas de critères propres (R-19 : grille générale seule) → `SPEC-CALC-nn`.

### Scénarios nominaux

```gherkin
Scénario : Critère d'un radier submersible
  Étant donné un sentier du parcours La Possession → Mafate qui traverse un radier
  Et un critère « radier submersible : pluie cumulée sur 24 h supérieure ou égale au seuil, zone météo du radier »
  Quand l'application consulte les critères de ce sentier
  Alors elle obtient la sensibilité, la donnée observée, le seuil, la période et la zone météo

Scénario : Parcours pilote composé de sentiers
  Étant donné le parcours pilote « Piton des Neiges »
  Quand l'application consulte sa composition
  Alors elle obtient la liste ordonnée des sentiers du référentiel qui le forment
  Et chacun de ces sentiers est marqué comme appartenant au panel pilote
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Sentier pilote avec plusieurs critères | Chaque critère est indépendant ; un seul critère déclenché suffit à désactiver le sentier |
| 2 | Sentier commun à deux parcours pilotes | Un seul jeu de critères, partagé par les deux parcours |
| 3 | Critère dont la zone météo n'existe pas dans le découpage paramétré | Refusé à l'import (`SPEC-REF-04`, cas limite 10) |
| 4 | Ajout d'un 4e parcours au panel | Non prévu : le panel est fermé ; toute extension passe par une nouvelle décision client |
| 5 | Sentier hors panel pilote porteur de critères | Refusé à l'import : les critères sont réservés au panel pilote (REQ-023 ; R-19 : hors panel, grille générale seule) |
| 6 | Zone météo d'un critère supprimée ou renommée dans le découpage après l'import | Le critère n'est pas évaluable : il n'est jamais traité comme respecté et aucune valeur n'est inventée (R-07). Par prudence, le sentier est désactivé comme si le critère était déclenché (R-02 ; décision de l'équipe du 25/11/2026). La référence invalide est signalée à l'équipe. Évaluation et affichage → `SPEC-CALC-nn`, `SPEC-TRAIL-nn` |

### Ce qui n'est pas défini

- *24/11/2026* — Valeurs des seuils pour chaque sentier pilote : à proposer par l'équipe et à valider à la recette client (REQ-023, CR-001/§6 point 2).
- *25/11/2026* — Exigence d'au moins un critère par sentier pilote (AC-2, `SPEC-REF-04` cas limite 3) : R-06 et REQ-023 ne la fixent pas. Décision de l'équipe du 25/11/2026 = au moins un critère, sentier refusé à l'import sinon.
- *25/11/2026* — Zone référencée par un critère qui disparaît du découpage (cas limite 6) : décision de l'équipe du 25/11/2026 = critère non évaluable, sentier désactivé par prudence. Mode de signalement à l'équipe : non défini.
- *24/11/2026* — Liste exacte des sentiers qui forment chaque parcours pilote, notamment l'arrivée exacte du parcours La Possession → Mafate : à proposer par l'équipe et à valider avec le client.
- *24/11/2026* — Types de données observées utilisables dans un critère : la pluie est certaine (CR-001/Q34) ; le vent ou d'autres données restent à décider selon les sources gratuites disponibles (`SPEC-METEO-nn`).

### Critères d'acceptation

- [ ] AC-1 — Les 3 parcours pilotes sont décrits comme une liste ordonnée de sentiers du référentiel (`CASE-REF-26`).
- [ ] AC-2 — Chaque sentier pilote porte au moins un critère complet : sensibilité, donnée, seuil, période, zone (décision de l'équipe du 25/11/2026) (`CASE-REF-27`).
- [ ] AC-3 — Un sentier hors panel ne porte aucun critère (`CASE-REF-28`).
- [ ] AC-4 — Un sentier commun à deux parcours n'a qu'un jeu de critères (`CASE-REF-29`).
- [ ] AC-5 — Un critère dont la zone météo a disparu du découpage n'est jamais traité comme respecté et désactive le sentier (décision de l'équipe du 25/11/2026) (`CASE-REF-30`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-06 — Rattachement des données externes aux référentiels

**Exigence :** REQ-032
**Renvois :** état des sentiers REQ-004 → `SPEC-TRAIL-nn` ; forçage administrateur prioritaire R-08 / REQ-021 → `SPEC-ADMIN-nn` ; données marines des spots REQ-024 → `SPEC-PECHE-nn` ; fraîcheur et indisponibilité REQ-103, REQ-104, R-07 → `SPEC-METEO-nn` ; météo par zone R-03 → `SPEC-METEO-02`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les données externes propres à un élément des référentiels sont rattachées à cet
> élément par son identifiant interne : l'état d'un sentier à ce sentier, les données
> marines d'un spot à ce spot. Une donnée qui ne correspond à aucun élément n'est
> jamais affichée. Un état qu'aucune source n'a confirmé n'est jamais présenté comme vérifié.

### Portée

- Couvre la correspondance entre une information reçue d'une source et un sentier ou un spot du référentiel.
- Couvre le sort d'une information sans correspondance.
- Couvre l'indicateur « non vérifié » (défini dans `SPEC-REF-01`), quand aucune information d'état n'a été reçue ou que la source est indisponible ou périmée (R-07, REQ-103).
- Ne couvre pas la météo elle-même : son rattachement aux éléments des référentiels (REQ-032) est indirect, par la zone du découpage météo paramétré (R-03, REQ-108) que traverse un tronçon de sentier ou que désigne un spot (R-10). Les zones ne font pas partie des référentiels (REQ-032 n'en cite que deux : sentiers et spots) ; la correspondance élément → zone est portée par `SPEC-METEO-02` (hypothèse, voir « Ce qui n'est pas défini »).
- Ne couvre pas la collecte, la fraîcheur et l'indisponibilité des sources → `SPEC-METEO-nn`.
- Ne couvre pas le forçage par l'administrateur, qui prime sur l'information automatique → `SPEC-ADMIN-nn` (R-08).

### Scénarios nominaux

```gherkin
Scénario : État d'un sentier reçu d'une source
  Étant donné une information de fermeture reçue pour un sentier que le référentiel connaît
  Quand l'information est rattachée
  Alors le sentier du référentiel porte cet état et la date de l'information

Scénario : Information sans correspondance
  Étant donné une information de fermeture reçue pour un sentier absent du référentiel
  Quand l'information est traitée
  Alors elle n'est rattachée à aucun élément
  Et elle est consignée pour que l'équipe vérifie la correspondance

Scénario : Sentier sans information d'état
  Étant donné un sentier du référentiel pour lequel aucune information d'état n'a été reçue
  Quand sa fiche ou un itinéraire qui l'emprunte est affiché
  Alors le sentier reste utilisable dans un itinéraire (R-02)
  Et son état est affiché avec l'indicateur « non vérifié », sans date
  Et il n'est jamais présenté comme vérifié

Scénario : Données marines d'un spot reçues d'une source
  Étant donné des données marines reçues d'une source sous un alias porté par un spot du référentiel
  Quand l'information est rattachée
  Alors ce spot porte ces données et leur date de mise à jour
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Une information concerne plusieurs sentiers | Rattachée à chacun d'eux |
| 2 | Un sentier ne reçoit aucune information externe | Il garde son état « ouvert par défaut, non vérifié » : il reste utilisable (R-02), mais l'affichage indique qu'aucune information d'état n'est disponible (R-07), sans valeur inventée |
| 3 | Source d'état indisponible ou dernière information plus ancienne que l'âge maximal paramétré | L'état est affiché comme « non vérifié », avec la date de la dernière information si elle existe (REQ-103, REQ-104). Le dernier état reçu est conservé (une fermeture périmée reste « fermé ») et n'est pas remplacé par l'état par défaut (décision de l'équipe du 25/11/2026) |
| 4 | Information externe sur un sentier dont l'état est forcé | Conservée, mais le forçage reste affiché tant qu'il est actif (R-08) |
| 5 | Le nom d'un sentier diffère entre la source et le référentiel | La correspondance repose sur les alias chargés avec le référentiel (`SPEC-REF-04`), pas sur le nom |
| 6 | Deux informations d'état contradictoires reçues pour un même sentier (dates différentes) | Non défini : la règle de priorité (plus récente, source prioritaire) est à fixer avec les sources → `SPEC-METEO-nn` |
| 7 | Spot sans donnée marine reçue, ou donnée marine plus ancienne que l'âge maximal paramétré | Données marines affichées comme indisponibles ou périmées pour ce spot, sans valeur inventée, avec la date de la dernière information si elle existe (R-07, REQ-103, REQ-104) |
| 8 | État fixé par un forçage administrateur ou saisi à la main faute de source automatique | Affiché « vérifié », avec la date du forçage ou de la saisie, sans péremption tant que le forçage est actif ; le forçage prime sur l'information automatique (R-08 ; décision de l'équipe du 25/11/2026) |
| 9 | Fin d'un forçage administrateur | L'indicateur suit de nouveau la dernière information reçue d'une source et sa péremption (cas limite 3) ; « non vérifié » s'il n'y en a aucune |

### Ce qui n'est pas défini

- *24/11/2026* — Source automatique de l'état des sentiers : non identifiée ; à défaut, saisie manuelle par l'administrateur (CDC §1, CR-001/Q36).
- *24/11/2026* — Tenue de la table de correspondance entre identifiants des sources et identifiants internes : hypothèse retenue = alias portés par chaque sentier ou spot et chargés avec lui (`SPEC-REF-04`, cas limite 12, AC-10). Cela vaut aussi pour les données marines : les sources marines n'utilisant pas les identifiants internes des spots, la correspondance repose sur ces seuls alias. La nature des identifiants publiés par les sources marines est à documenter avec le catalogue des sources (REQ-113).
- *25/11/2026* — État affiché quand l'information d'état est périmée ou la source indisponible (cas limite 3) : le CDC impose seulement l'indicateur et la date (R-07, REQ-103, REQ-104). Décision de l'équipe du 25/11/2026 = dernier état reçu conservé, signalé « non vérifié » avec sa date.
- *25/11/2026* — Indicateur de vérification d'un état forcé par l'administrateur (R-08) ou saisi à la main faute de source (CDC §1) : non traité par le CDC. Décision de l'équipe du 25/11/2026 = « vérifié », sans péremption tant que le forçage ou la saisie est actif (cas limites 8 et 9). Retour à l'indicateur de la source à la fin du forçage (cas limite 9) : déduction de l'équipe.
- *24/11/2026* — REQ-032 demande que la météo soit rattachée aux éléments des référentiels. Hypothèse retenue : le rattachement est indirect, par la zone du découpage météo que traverse un tronçon (R-03) ou que désigne un spot (R-10), la correspondance étant portée par `SPEC-METEO-02`. À confirmer.
- *24/11/2026* — Priorité entre informations d'état contradictoires pour un même sentier (cas limite 6) : non définie ; R-08 ne traite que le forçage.

### Critères d'acceptation

- [ ] AC-1 — Une information externe est rattachée à chaque élément du référentiel qu'elle concerne, avec sa date ; un élément qui n'a reçu aucune information reste sans date (AC-4) (`CASE-REF-31`).
- [ ] AC-2 — Une information sans correspondance n'est jamais affichée et elle est consignée (`CASE-REF-32`).
- [ ] AC-3 — La correspondance ne dépend pas du nom affiché (`CASE-REF-33`).
- [ ] AC-4 — Sans information d'état reçue ou à jour, le sentier est affiché avec l'indicateur « non vérifié » et n'est jamais présenté comme vérifié (`CASE-REF-34`).
- [ ] AC-5 — Les données marines reçues pour un spot sont rattachées à ce spot par ses alias, avec leur date ; sans donnée reçue ou à jour, elles sont affichées comme indisponibles pour ce spot, sans valeur inventée (`CASE-REF-35`).
- [ ] AC-6 — Un état fixé par un forçage administrateur actif ou une saisie manuelle est affiché « vérifié » avec sa date, sans péremption ; à la fin du forçage, l'indicateur suit de nouveau la source (décision de l'équipe du 25/11/2026) (`CASE-REF-36`).
- [ ] AC-7 — Une information d'état périmée ou une source indisponible conserve le dernier état reçu, affiché « non vérifié » avec sa date (décision de l'équipe du 25/11/2026) (`CASE-REF-37`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |
