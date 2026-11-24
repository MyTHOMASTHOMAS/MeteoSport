# Spécifications — Référentiels internes

**Domaine :** `REF`

---

## SPEC-REF-01 — Référentiel des sentiers officiels balisés

**Exigence :** REQ-032, REQ-006 (avec règles R-01, R-02, R-20)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les sentiers officiels balisés forment un référentiel interne. Seuls les sentiers
> de ce référentiel peuvent être proposés à l'utilisateur. Chaque sentier porte son
> tracé, sa cotation officielle et son appartenance éventuelle au panel pilote.

### Portée

- Couvre les informations portées par chaque sentier : identifiant interne, nom, tracé avec altitudes, longueur, dénivelés positif et négatif, cotation officielle, appartenance au panel pilote.
- Couvre les points de jonction entre sentiers, qui permettent d'enchaîner plusieurs sentiers dans un itinéraire.
- Couvre l'état initial d'un sentier à son entrée dans le référentiel. Le vocabulaire suit REQ-004 et R-02 :
  - **état** : ouvert ou fermé (information externe ou forçage administrateur) ;
  - **désactivé** : fermé, ou une règle de sécurité est déclenchée ;
  - **disponible** : non désactivé (R-02 : « disponible par défaut »).
  À son entrée, un sentier est **ouvert par défaut, non vérifié** : aucune source n'a encore confirmé son état et aucune date d'information n'existe.
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
| 5 | Sentier sans altitude sur une partie du tracé | Refusé à l'import (`SPEC-REF-04`) : les altitudes sont nécessaires au temps de parcours et au découpage météo |
| 6 | Information externe d'état déjà reçue lors du chargement du sentier | Elle remplace l'état par défaut dès son rattachement, avec sa date (`SPEC-REF-06`) |
| 7 | Forçage administrateur au moment du chargement | Impossible pour un sentier nouveau : un forçage ne porte que sur un sentier déjà présent. Pour un sentier mis à jour, le forçage existant est conservé (`SPEC-REF-04`) |

### Ce qui n'est pas défini

- *24/11/2026* — Échelle de la cotation officielle (libellés, nombre de niveaux) : reprise telle que publiée par la source officielle retenue, à documenter avec les sources (`SPEC-METEO-nn`, REQ-113).
- *24/11/2026* — Liste des sentiers chargés au-delà du panel pilote : à fixer par l'équipe, selon les sources gratuites disponibles (REQ-102).

### Critères d'acceptation

- [ ] AC-1 — Chaque sentier du référentiel porte un identifiant, un nom, un tracé avec altitudes, une longueur, des dénivelés et une cotation officielle (`CASE-REF-01`).
- [ ] AC-2 — Les sentiers du panel pilote sont identifiés comme tels (`CASE-REF-02`).
- [ ] AC-3 — Deux sentiers peuvent être enchaînés seulement par un point de jonction commun (`CASE-REF-03`).
- [ ] AC-4 — Un sentier absent du référentiel n'est jamais proposé (`CASE-REF-04`).
- [ ] AC-5 — Un sentier entre dans le référentiel à l'état « ouvert par défaut, non vérifié », sans date d'information (`CASE-REF-05`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-02 — Référentiel des spots de pêche

**Exigence :** REQ-032, REQ-024 (avec règle R-10)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les spots de pêche forment un référentiel interne. Seuls les spots de ce référentiel
> peuvent être recommandés. Chaque spot porte une position précise, sans distinction
> de technique de pêche.

### Portée

- Couvre les informations portées par chaque spot : identifiant interne, nom, position précise, commune.
- Couvre la désignation, pour chaque spot, du secteur de pluie qui sert à estimer la clarté de l'eau (R-10). Ce secteur est une zone du découpage météo paramétré (R-03, REQ-108). Le spot y fait seulement référence ; la zone elle-même n'appartient pas aux référentiels → `SPEC-METEO-nn`.
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
  Alors elle obtient son nom, sa position précise et sa commune
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
| 2 | Spot dont la position n'est pas sur le littoral réunionnais | Refusé à l'import (`SPEC-REF-04`) |
| 3 | Spot sans secteur de pluie rattaché | Accepté ; la clarté de l'eau est affichée comme indisponible pour ce spot (R-10) |
| 4 | Spot utilisé pour la chasse sous-marine et la pêche du bord | Un seul spot, sans attribut de technique |

### Ce qui n'est pas défini

- *24/11/2026* — Définition du « secteur de pluie » d'un spot (bassin versant côtier, R-10) : hypothèse retenue = une zone du découpage météo paramétré, dont les pluies récentes servent à estimer la clarté. Le spot désigne cette zone par son identifiant. Le découpage relève de `SPEC-METEO-nn`.
- *24/11/2026* — Liste initiale des spots chargés : à proposer par l'équipe ; côtes concernées : toute l'île (CR-001/Q09).

### Critères d'acceptation

- [ ] AC-1 — Chaque spot porte un identifiant, un nom, une position précise et une commune (`CASE-REF-06`).
- [ ] AC-2 — Aucun spot ne porte d'attribut de technique de pêche (`CASE-REF-07`).
- [ ] AC-3 — Un spot absent du référentiel n'est jamais recommandé (`CASE-REF-08`).
- [ ] AC-4 — Un spot sans secteur de pluie est accepté et signalé comme sans estimation de clarté (`CASE-REF-09`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-03 — Points d'eau des sentiers

**Exigence :** REQ-014, REQ-032 (avec règle R-09)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les points d'eau potable sont enregistrés dans le référentiel des sentiers, avec
> leur position et le sentier sur lequel ils se trouvent. Ils ont un statut
> strictement indicatif.

### Portée

- Couvre les informations d'un point d'eau : identifiant, position, sentier de rattachement, nom éventuel.
- Couvre leur caractère indicatif, porté dans le référentiel.
- Ne couvre pas l'affichage des points d'eau et de l'avertissement R-09 → `SPEC-CALC-nn`.
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
| 2 | Point d'eau situé au point de jonction de deux sentiers | Rattaché aux deux sentiers, compté une seule fois dans un itinéraire |
| 3 | Point d'eau trop éloigné du tracé de son sentier | Refusé à l'import (`SPEC-REF-04`) |

### Ce qui n'est pas défini

- *24/11/2026* — Distance maximale entre un point d'eau et le tracé de son sentier : à proposer par l'équipe.
- *24/11/2026* — Source des points d'eau : à choisir parmi les sources gratuites et à documenter (REQ-102, REQ-113).

### Critères d'acceptation

- [ ] AC-1 — Chaque point d'eau est rattaché à au moins un sentier et porte une position (`CASE-REF-10`).
- [ ] AC-2 — Tout point d'eau est marqué comme indicatif (`CASE-REF-11`).
- [ ] AC-3 — Un point d'eau partagé par deux sentiers n'apparaît qu'une fois dans un itinéraire (`CASE-REF-12`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-04 — Chargement des référentiels par import

**Exigence :** REQ-032, REQ-023 (avec règle R-01 ; arbitrage CR-001/§5.3 : référentiels internes chargés par import)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les référentiels des sentiers et des spots sont chargés par import. Un import
> contrôle chaque élément, refuse ceux qui sont incomplets ou incohérents, et rend
> compte de ce qui a été ajouté, mis à jour ou refusé. Ce chargement ne passe pas
> par l'espace d'administration.

### Portée

- Couvre le contrôle des éléments importés : champs obligatoires, position à La Réunion, cohérence du tracé, critères de sécurité des sentiers pilotes.
- Couvre l'ajout, la mise à jour d'un élément déjà présent et le compte rendu d'import.
- Couvre la conservation de l'état forcé par l'administrateur et des alertes lors d'une mise à jour.
- Ne couvre pas le contenu de chaque référentiel → `SPEC-REF-01`, `SPEC-REF-02`, `SPEC-REF-03`, `SPEC-REF-05`.
- Ne couvre pas la modification des sentiers depuis l'espace d'administration → hors périmètre (REQ-023 : statuts et alertes seulement).

### Scénarios nominaux

```gherkin
Scénario : Premier import des sentiers
  Étant donné un référentiel des sentiers vide
  Et un fichier d'import de 3 sentiers valides
  Quand l'import est lancé
  Alors les 3 sentiers sont ajoutés
  Et le compte rendu indique 3 ajoutés, 0 mis à jour, 0 refusé

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
| 1 | Élément sans identifiant, sans nom ou sans position | Refusé avec le motif |
| 2 | Position hors de La Réunion | Refusée avec le motif |
| 3 | Sentier marqué « panel pilote » sans critère de sécurité | Refusé avec le motif : un sentier pilote ne peut pas être calibré sans critères (`SPEC-REF-05`) |
| 4 | Même identifiant deux fois dans un fichier | Les deux occurrences sont refusées, motif « doublon » |
| 5 | Mise à jour d'un sentier dont l'état est forcé par l'administrateur | Le forçage et les alertes rattachées sont conservés (R-08, R-11) |
| 6 | Élément présent dans le référentiel mais absent du nouveau fichier | Non supprimé automatiquement ; signalé dans le compte rendu |
| 7 | Fichier illisible ou vide | Import refusé en entier ; référentiel inchangé |

### Ce qui n'est pas défini

- *24/11/2026* — Personne qui lance l'import et moment : hypothèse retenue = l'équipe projet, lors de l'installation et des mises à jour du référentiel. REQ-032 cite aussi l'administrateur ; à confirmer avec le client.
- *24/11/2026* — Retrait d'un sentier ou d'un spot du référentiel : non demandé ; hypothèse retenue = retrait explicite seulement, jamais par simple absence du fichier.
- *24/11/2026* — Format du fichier d'import : choix technique de l'équipe, hors spécification.

### Critères d'acceptation

- [ ] AC-1 — Un import valide ajoute les éléments et produit un compte rendu exact (`CASE-REF-13`).
- [ ] AC-2 — Un nouvel import met à jour un élément existant sans le dupliquer (`CASE-REF-14`).
- [ ] AC-3 — Un élément invalide est refusé avec son motif, sans bloquer les éléments valides (`CASE-REF-15`).
- [ ] AC-4 — Un sentier pilote sans critère de sécurité est refusé (`CASE-REF-16`).
- [ ] AC-5 — Une mise à jour conserve le forçage d'état et les alertes (`CASE-REF-17`).
- [ ] AC-6 — Un fichier illisible laisse le référentiel inchangé (`CASE-REF-18`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-05 — Critères de sécurité du panel pilote

**Exigence :** REQ-023 (avec règles R-02, R-06, R-19)
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
| 3 | Critère dont la zone météo n'existe pas dans le découpage paramétré | Refusé à l'import (`SPEC-REF-04`) |
| 4 | Ajout d'un 4e parcours au panel | Non prévu : le panel est fermé ; toute extension passe par une nouvelle décision client |
| 5 | Sentier hors panel pilote porteur de critères | Refusé à l'import : les critères sont réservés au panel pilote |

### Ce qui n'est pas défini

- *24/11/2026* — Valeurs des seuils pour chaque sentier pilote : à proposer par l'équipe et à valider à la recette (`ZO-07`, à valider à la recette selon CR-001/§6).
- *24/11/2026* — Liste exacte des sentiers qui forment chaque parcours pilote, notamment l'arrivée exacte du parcours La Possession → Mafate : à proposer par l'équipe et à valider avec le client.
- *24/11/2026* — Types de données observées utilisables dans un critère : la pluie est certaine (CR-001/Q34) ; le vent ou d'autres données restent à décider selon les sources gratuites disponibles (`SPEC-METEO-nn`).

### Critères d'acceptation

- [ ] AC-1 — Les 3 parcours pilotes sont décrits comme une liste ordonnée de sentiers du référentiel (`CASE-REF-19`).
- [ ] AC-2 — Chaque sentier pilote porte au moins un critère complet : sensibilité, donnée, seuil, période, zone (`CASE-REF-20`).
- [ ] AC-3 — Un sentier hors panel ne porte aucun critère (`CASE-REF-21`).
- [ ] AC-4 — Un sentier commun à deux parcours n'a qu'un jeu de critères (`CASE-REF-22`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-REF-06 — Rattachement des données externes aux référentiels

**Exigence :** REQ-032, REQ-004, REQ-103, REQ-104 (avec règles R-03, R-07)
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
- Couvre l'affichage d'un état non vérifié, quand aucune information d'état n'a été reçue ou que la source est indisponible ou périmée (R-07, REQ-103).
- Ne couvre pas la météo : elle est rattachée aux zones du découpage météo paramétré (R-03, REQ-108), que les tronçons traversent. Les zones ne font pas partie des référentiels (REQ-032 n'en cite que deux : sentiers et spots) → `SPEC-METEO-nn`.
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
  Et son état est affiché comme « non vérifié », sans date
  Et il n'est jamais affiché comme « ouvert » confirmé
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Une information concerne plusieurs sentiers | Rattachée à chacun d'eux |
| 2 | Un sentier ne reçoit aucune information externe | Il garde son état « ouvert par défaut, non vérifié » : il reste utilisable (R-02), mais l'affichage indique qu'aucune information d'état n'est disponible (R-07), sans valeur inventée |
| 3 | Source d'état indisponible ou dernière information plus ancienne que l'âge maximal paramétré | L'état est affiché comme « non vérifié », avec la date de la dernière information si elle existe (REQ-103, REQ-104) |
| 4 | Information externe sur un sentier dont l'état est forcé | Conservée, mais le forçage reste affiché tant qu'il est actif (R-08) |
| 5 | Le nom d'un sentier diffère entre la source et le référentiel | La correspondance repose sur la table de correspondance du référentiel, pas sur le nom |

### Ce qui n'est pas défini

- *24/11/2026* — Source automatique de l'état des sentiers : non identifiée ; à défaut, saisie manuelle par l'administrateur (CDC §1, CR-001/Q36).
- *24/11/2026* — Tenue de la table de correspondance entre identifiants des sources et identifiants internes : hypothèse retenue = portée par le référentiel et chargée avec lui (`SPEC-REF-04`).

### Critères d'acceptation

- [ ] AC-1 — Une information externe est rattachée à chaque élément du référentiel qu'elle concerne, avec sa date (`CASE-REF-23`).
- [ ] AC-2 — Une information sans correspondance n'est jamais affichée et elle est consignée (`CASE-REF-24`).
- [ ] AC-3 — La correspondance ne dépend pas du nom affiché (`CASE-REF-25`).
- [ ] AC-4 — Sans information d'état reçue ou à jour, le sentier est affiché « non vérifié » et jamais « ouvert » confirmé (`CASE-REF-26`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |
