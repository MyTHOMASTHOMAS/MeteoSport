# Spécifications — Pêche

**Domaine :** `PECHE`

Sources : `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3) — exigences `REQ-024`, `REQ-025` ; `REQ-031` (facette affichage sur le spot consulté ; capacité → `METEO`) ; règles `R-10` (estimation de la clarté et cas indisponible ; historique interne des pluies → `METEO`), `R-18` (recommandation jour même et prévisions 3 jours — cadrage transverse `ARCH`) ; précondition `R-16` (compte authentifié → `AUTH`) ; références `REQ-026` (réalisation UI de l'affichage des alertes en cours ; garantie et gestion → `ADMIN`), `REQ-027` (affichage de l'invitation réglementaire sur alertes littoral ; création → `ADMIN`), `REQ-032` (référentiel des spots → `REF`), `REQ-104` (facette affichage de la date de mise à jour sur chaque information externe présentée ; capacité → `METEO`), `R-11` (réalisation UI de l'affichage des alertes en cours sur page spot et recommandation ; gestion et garantie → `ADMIN`), contrainte 4 (territoire La Réunion uniquement — cadrage transverse `ARCH` / `REF`), contrainte 10 (réglementation du littoral signalée par des alertes — affichage de l'invitation `REQ-027` ; création → `ADMIN`). Périmètre domaine : `tdd/specs/sommaire.md` (`PECHE`).

---

## SPEC-PECHE-01 — Saisie du créneau et du point de départ

**Exigence :** REQ-025 (avec R-18)
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> Pour obtenir une recommandation de spot de pêche, l'utilisateur saisit son créneau disponible et son point de départ. La recommandation porte sur le jour même. Le créneau est le temps passé sur place ; le trajet n'en fait pas partie. La distance entre le point de départ et chaque spot entre dans la recommandation.

### Portée

- Couvre la saisie du créneau disponible et du point de départ (`REQ-025`).
- Couvre le fait que la recommandation est bornée au jour même (`REQ-025`, `R-18`).
- Couvre la définition du créneau comme temps passé sur place, trajet en plus (`REQ-025`).
- Couvre la prise en compte de la distance point de départ → spot dans la recommandation, sur la base de la position précise de chaque spot du référentiel interne (`REQ-025`, `REQ-032`), comme critère entrant dans la recommandation sans filtre dur d'exclusion automatique.
- Ne propose que des spots du référentiel interne situés à La Réunion (`REQ-032`, contrainte 4).
- Couvre, dans toute recommandation qui propose un spot, la réalisation UI de l'affichage des alertes en cours rattachées à ce spot (`REQ-026`, `R-11`), y compris les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) qui invitent à vérifier la réglementation locale sur place (`REQ-027`, contrainte 10) ; ne couvre pas la création, la modification ni le retrait des alertes → domaine `ADMIN` (`SPEC-ADMIN-03`, `SPEC-ADMIN-04`).
- Couvre, sur l'écran de recommandation, la réalisation UI de l'affichage de la date de mise à jour de chaque information externe présentée (météo et données marines — `REQ-104`) ; ne couvre pas la collecte ni la gestion de l'indisponibilité, des données périmées ou de l'âge maximal → domaines `METEO` / `ARCH` (`R-07`, `REQ-103`, `REQ-115`).
- Ne couvre pas le chargement ni l'import du référentiel des spots de pêche → domaine `REF` (`REQ-032`).
- Ne couvre pas l'évaluation des critères météo / marins des spots → `SPEC-PECHE-02`.
- Ne couvre pas le score comparatif trail / pêche → domaine `COMP` (`REQ-028`, `R-12`).
- Ne couvre pas la pêche en bateau et en kayak → hors périmètre (CDC §6).
- Ne couvre pas une recommandation pour un autre jour que le jour même → hors périmètre (CDC §6 ; `R-18`).

### Scénarios nominaux

```gherkin
Scénario : Recommandation de pêche pour le jour même
  Étant donné un utilisateur authentifié (R-16)
  Et des spots de pêche présents dans le référentiel interne à La Réunion (REQ-032, contrainte 4)
  Quand l'utilisateur saisit son créneau disponible et son point de départ
  Alors l'application produit une recommandation portant sur le jour même (REQ-025, R-18)
  Et le créneau saisi représente le temps passé sur place, trajet en plus (REQ-025)
  Et la distance entre le point de départ et chaque spot entre dans la recommandation (REQ-025)
  Et chaque information externe affichée sur la recommandation indique sa date de mise à jour (REQ-104)

Scénario : Affichage des alertes en cours dans la recommandation de spot
  Étant donné un utilisateur authentifié (R-16)
  Et un spot de pêche du référentiel interne proposé dans une recommandation
  Et une ou plusieurs alertes en cours qui lui sont rattachées (dont une alerte réglementaire du littoral : présence de la Réserve naturelle marine ou risque requin)
  Quand la recommandation est affichée
  Alors les alertes en cours rattachées au spot proposé sont affichées (REQ-026, R-11)
  Et toute alerte réglementaire du littoral invite à vérifier la réglementation locale sur place (REQ-027, contrainte 10)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Recommandation de pêche hors du jour même | Non couverte : la recommandation porte sur le jour même (`REQ-025`, `R-18` ; CDC §6 hors périmètre) |
| 2 | Spot absent du référentiel interne ou hors de La Réunion | Non proposé : seuls les spots du référentiel interne (`REQ-032`) situés à La Réunion (contrainte 4) sont proposés |
| 3 | Aucune alerte en cours rattachée au spot proposé | Pas d'alerte affichée pour ce spot (`REQ-026`) |

### Ce qui n'est pas défini

- *24/11/2026* — Formule ou pondération exacte de la distance face aux critères `REQ-024` (la distance entre dans la recommandation sans filtre d'exclusion automatique, `REQ-025`).
- *25/11/2026* — Calage horaire du créneau disponible : calé à partir de l'heure courante par défaut (analogie avec `REQ-001`) pour la durée sur place saisie.
- *24/11/2026* — Format UI exact de saisie du créneau disponible et du point de départ (au-delà de : créneau disponible sur place et point de départ selon `REQ-025`).
- *25/11/2026* — Comportement si le créneau disponible ou le point de départ ne sont pas saisis (`REQ-025` les suppose saisis, sans modalité d'erreur ni de blocage).

### Critères d'acceptation

- [ ] AC-1 — Après saisie d'un créneau disponible et d'un point de départ, la recommandation produite porte sur le jour même (`REQ-025`, `R-18`) (`CASE-PECHE-01`).
- [ ] AC-2 — Le créneau utilisé représente le temps passé sur place, trajet en plus (`REQ-025`) (`CASE-PECHE-01`).
- [ ] AC-3 — La distance entre le point de départ et chaque spot du référentiel interne situé à La Réunion entre dans la recommandation (`REQ-025`, `REQ-032`, contrainte 4) (`CASE-PECHE-01`).
- [ ] AC-4 — Dans toute recommandation qui propose un spot, les alertes en cours qui lui sont rattachées sont affichées (`REQ-026`, `R-11`), et les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) invitent à vérifier la réglementation locale sur place (`REQ-027`, contrainte 10) (`CASE-PECHE-01`).
- [ ] AC-5 — Chaque information externe affichée sur l'écran de recommandation (météo, données marines) indique sa date de mise à jour (`REQ-104`) (`CASE-PECHE-01`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Précondition « utilisateur authentifié » | Acceptée | CDC `R-16` : toute utilisation exige un compte authentifié |
| Cas « demande pour un autre jour » formulé comme parcours UI | Refusée / reformulée | Le CDC exclut la recommandation hors jour même ; il ne décrit pas d'écran de saisie d'une autre date |
| Heure de début / rôle de la durée | Acceptée (cadrage souple) | Calage temporel à partir de l'heure courante par analogie avec `REQ-001` pour évaluer les critères météo du jour même ; distance maintenue comme critère d'entrée sans filtre dur |

---

## SPEC-PECHE-02 — Identification des spots aux meilleures conditions

**Exigence :** REQ-024 (avec R-10)
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> L'application identifie les spots de pêche aux meilleures conditions selon le vent, la houle, la marée, le solunaire, la pluie et la clarté estimée de l'eau, et indique les critères qui l'expliquent. Elle ne distingue pas les techniques de pêche. Un critère sans source gratuite est retiré du calcul et ce retrait est signalé. La clarté de l'eau est estimée à partir des pluies récentes sur les bassins versants côtiers et présentée comme une estimation ; la constitution de l'historique des pluies relève de `METEO` (`R-10` phrase 2). Si la donnée de pluie manque, la clarté est affichée comme indisponible, sans estimation.

### Portée

- Couvre l'identification des spots du référentiel situés à La Réunion aux meilleures conditions selon : vent, houle, marée, solunaire, pluie, clarté estimée (`REQ-024`, `REQ-032`, contrainte 4).
- Couvre l'indication des critères qui expliquent la recommandation (`REQ-024`).
- Couvre l'absence de distinction de technique de pêche (`REQ-024` ; CDC §6 hors périmètre).
- Couvre le retrait signalé d'un critère sans source gratuite (`REQ-024`).
- Couvre l'estimation de la clarté à partir des pluies récentes sur les bassins versants côtiers, sa présentation explicite comme une estimation, et le cas « indisponible » sans estimation si la donnée de pluie manque (`R-10`).
- L'évaluation des critères de `REQ-024` (susceptibles de varier dans le temps) s'effectue sur le créneau disponible débutant à l'heure courante (analogie `REQ-001`) pour le jour même.
- Lorsque cette identification propose des spots à l'utilisateur, la réalisation UI de l'affichage des alertes en cours rattachées (dont les alertes réglementaires du littoral — présence de la Réserve naturelle marine, risque requin — invitant à vérifier la réglementation locale sur place — `REQ-026`, `REQ-027`, `R-11`, contrainte 10) est couverte via `SPEC-PECHE-01` (AC-4) ; la création, la modification et le retrait des alertes relèvent du domaine `ADMIN` (`SPEC-ADMIN-03`, `SPEC-ADMIN-04`).
- Couvre l'affichage de la date de mise à jour sur toute information externe présentée pour expliquer les critères de recommandation (météo et données marines — `REQ-104`) ; ne couvre pas la collecte ni la détection d'indisponibilité ou de péremption → domaines `METEO` / `ARCH` (`R-07`, `REQ-103`, `REQ-113`, `REQ-115`).
- Ne couvre pas le chargement du référentiel des spots (position précise) → domaine `REF` (`REQ-032`).
- Ne couvre pas la constitution ni la conservation de l'historique interne des pluies récentes à partir des données reçues des sources météo → domaine `METEO` (`R-10` phrase 2 ; catalogue des sources : `REQ-113`).
- Ne couvre pas la mesure directe de la clarté de l'eau → hors périmètre (CDC §6).
- Ne couvre pas la carte précise des zones réglementées en mer → hors périmètre (CDC §6).

### Scénarios nominaux

```gherkin
Scénario : Spots recommandés avec critères expliqués
  Étant donné un utilisateur authentifié (R-16) ayant saisi un créneau et un point de départ
  Et des spots de pêche dans le référentiel interne à La Réunion (REQ-032, contrainte 4)
  Et des sources gratuites disponibles pour les critères retenus
  Quand l'application calcule la recommandation de pêche
  Alors elle identifie les spots aux meilleures conditions selon le vent, la houle, la marée, le solunaire, la pluie et la clarté estimée de l'eau
  Et elle indique les critères qui expliquent cette identification
  Et elle ne distingue pas les techniques de pêche
  Et chaque information externe affichée pour expliquer ces critères indique sa date de mise à jour (REQ-104)

Scénario : Clarté estimée à partir des pluies récentes
  Étant donné un utilisateur authentifié (R-16)
  Et un spot de pêche du référentiel interne (REQ-032)
  Et que l'historique interne des pluies récentes est disponible
  Quand l'application évalue la clarté de l'eau pour ce spot
  Alors la clarté est présentée comme une estimation fondée sur les pluies récentes sur les bassins versants côtiers (R-10)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Un critère (ex. houle, marée ou solunaire) n'a pas de source gratuite | Ce critère est retiré du calcul et le retrait est signalé (`REQ-024`) |
| 2 | La donnée de pluie manque pour estimer la clarté | La clarté est affichée comme indisponible ; aucune estimation n'est produite (`R-10`) |
| 3 | Un spot n'est pas dans le référentiel interne ou est hors de La Réunion | Il n'est pas proposé (CDC §6 ; `REQ-032`, contrainte 4) |

### Ce qui n'est pas défini

- *24/11/2026* — Pondération et seuils qui définissent « meilleures conditions » à partir des critères listés (`REQ-024` les nomme sans formule).
- *24/11/2026* — Liste concrète des sources gratuites retenues pour le vent, la houle, la marée, le solunaire et la pluie (`REQ-024` impose le retrait si absente ; le catalogue relève du domaine `METEO`, `REQ-113`).
- *24/11/2026* — Fenêtre exacte des « pluies récentes » (durée) pour `R-10` (non chiffrée dans le CDC).
- *25/11/2026* — Mode de croisement temporel des critères de `REQ-024` : évalués sur la durée saisie à compter de l'heure courante pour le jour même.

### Critères d'acceptation

- [ ] AC-1 — L'identification des spots s'appuie sur les critères listés dans `REQ-024` (vent, houle, marée, solunaire, pluie, clarté estimée) et affiche les critères qui l'expliquent (`CASE-PECHE-02`).
- [ ] AC-2 — Aucune segmentation par technique de pêche n'apparaît (`CASE-PECHE-02`).
- [ ] AC-3 — Un critère sans source gratuite est absent du calcul et ce retrait est signalé à l'utilisateur (`CASE-PECHE-02`).
- [ ] AC-4 — Si la donnée de pluie manque, la clarté s'affiche « indisponible » sans valeur inventée (`R-10`) (`CASE-PECHE-02`).
- [ ] AC-5 — Lorsque la donnée de pluie est disponible, la clarté de l'eau est présentée comme une estimation fondée sur les pluies récentes sur les bassins versants côtiers, sans être présentée comme une mesure directe (`R-10` ; CDC §6) (`CASE-PECHE-02`).
- [ ] AC-6 — Toute information externe affichée pour expliquer les critères de recommandation (météo, données marines) indique sa date de mise à jour (`REQ-104`) (`CASE-PECHE-02`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| AC « uniquement sur les critères REQ-024 » | Refusée / reformulée | `REQ-025` fait aussi entrer la distance dans la recommandation ; « uniquement » était une extrapolation |
| Exigence SPEC-02 citant la distance (REQ-025) | Refusée / retirée | La distance est couverte par `SPEC-PECHE-01` |

---

## SPEC-PECHE-03 — Prévisions météo consultables pour un spot

**Exigence :** REQ-031 (avec R-18)
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> L'application affiche les prévisions météo des 3 prochains jours, du jour même au surlendemain, heure par heure et par jour, pour le spot de pêche consulté. La recommandation d'activité reste bornée au jour même ; les prévisions des jours suivants restent consultables.

### Portée

- Couvre l'affichage des prévisions sur 3 jours (jour même au surlendemain), heure par heure et par jour, pour un spot de pêche consulté du référentiel interne situé à La Réunion (`REQ-031`, `REQ-032`, contrainte 4).
- Couvre la distinction entre recommandation (jour même) et consultation des prévisions (3 jours) (`R-18`).
- Couvre la réalisation UI de l'affichage des alertes en cours rattachées au spot de pêche consulté (`REQ-026`, `R-11`), y compris les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) qui invitent à vérifier la réglementation locale sur place (`REQ-027`, contrainte 10) ; ne couvre pas la création, la modification ni le retrait des alertes → domaine `ADMIN` (`SPEC-ADMIN-03`, `SPEC-ADMIN-04`).
- Couvre la réalisation UI de l'affichage de la date de mise à jour de chaque information externe présentée sur la page du spot (prévisions météo et données marines — `REQ-104`, capacité → `METEO`).
- Ne couvre pas la détection d'indisponibilité, la gestion des données périmées ni le paramétrage de l'âge maximal des données → domaines `METEO` / `ARCH` (`R-07`, `REQ-103`, `REQ-115`).
- Ne couvre pas les prévisions le long d'un itinéraire trail → domaines `TRAIL` / `METEO` (`REQ-007`, `REQ-031`).
- Ne couvre pas l'affichage d'un historique météo à l'utilisateur → hors périmètre (CDC §6).

### Scénarios nominaux

```gherkin
Scénario : Consultation des prévisions sur un spot
  Étant donné un utilisateur authentifié (R-16)
  Et un spot de pêche du référentiel interne situé à La Réunion consulté (REQ-032, contrainte 4)
  Quand l'utilisateur consulte les prévisions météo de ce spot
  Alors l'application affiche les prévisions du jour même au surlendemain
  Et ces prévisions sont présentées heure par heure et par jour
  Et chaque information externe affichée indique sa date de mise à jour (REQ-104)

Scénario : Affichage des alertes en cours sur la page d'un spot consulté
  Étant donné un utilisateur authentifié (R-16)
  Et un spot de pêche du référentiel interne situé à La Réunion consulté (REQ-032, contrainte 4)
  Et une ou plusieurs alertes en cours qui lui sont rattachées (dont une alerte réglementaire du littoral : présence de la Réserve naturelle marine ou risque requin)
  Quand l'utilisateur consulte la page de ce spot
  Alors les alertes en cours rattachées au spot sont affichées (REQ-026, R-11)
  Et toute alerte réglementaire du littoral invite à vérifier la réglementation locale sur place (REQ-027, contrainte 10)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | L'utilisateur consulte les jours suivants | Les prévisions restent consultables sur 3 jours ; cela ne transforme pas la recommandation en recherche multi-jours (`R-18` ; CDC §6) |
| 2 | Aucune alerte en cours rattachée au spot consulté | Pas d'alerte affichée pour ce spot (`REQ-026`) |

### Ce qui n'est pas défini

- *24/11/2026* — Découpage météo exact rattaché à un spot (communes, secteurs, stations) : paramétrable au déploiement (`REQ-108`), hors détail de cette spécification.

### Critères d'acceptation

- [ ] AC-1 — Sur un spot consulté, les prévisions couvrent du jour même au surlendemain, heure par heure et par jour (`REQ-031`, `R-18`) (`CASE-PECHE-03`).
- [ ] AC-2 — Aucun historique météo n'est affiché à l'utilisateur dans ce parcours (CDC §6) (`CASE-PECHE-03`).
- [ ] AC-3 — Sur la page d'un spot consulté, les alertes en cours qui lui sont rattachées sont affichées (`REQ-026`, `R-11`), et les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) invitent à vérifier la réglementation locale sur place (`REQ-027`, contrainte 10) (`CASE-PECHE-03`).
- [ ] AC-4 — Chaque prévision météo ou donnée externe affichée sur la page du spot indique sa date de mise à jour (`REQ-104`) (`CASE-PECHE-03`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| — | — | — |
