# Spécifications — Pêche

**Domaine :** `PECHE`

Sources : `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3) — exigences `REQ-024`, `REQ-025`, `REQ-031` (référentiels internes `REQ-032`) ; règles `R-10`, `R-18` ; précondition `R-16`. Périmètre domaine : `tdd/specs/sommaire.md` (`PECHE`).

---

## SPEC-PECHE-01 — Saisie du créneau et du point de départ

**Exigence :** REQ-025 (avec R-18)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Pour obtenir une recommandation de spot de pêche, l'utilisateur saisit son créneau disponible et son point de départ. La recommandation porte sur le jour même. Le créneau est le temps passé sur place ; le trajet n'en fait pas partie. La distance entre le point de départ et chaque spot entre dans la recommandation.

*(Complément décision produit)* : Le créneau saisi comporte une **heure de début** et une **durée** sur place, formant la fenêtre `[début ; début + durée]` sur le jour même. La durée sert à la **faisabilité** (temps sur place + trajet compatibles) ; elle n'introduit pas de pondération chiffrée face aux critères de REQ-024. Le classement des spots s'appuie sur les critères de `SPEC-PECHE-02` (REQ-024) croisés sur cette fenêtre, et sur la distance (REQ-025).

### Portée

- Couvre la saisie du créneau disponible et du point de départ.
- Couvre le fait que la recommandation est bornée au jour même (R-18).
- Couvre la définition du créneau comme durée sur place, trajet en plus (REQ-025).
- Couvre la saisie d'une heure de début du créneau sur le jour même ; la fenêtre horaire sur place est `[début ; début + durée]` (décision produit).
- Couvre le rôle de la durée : filtre de faisabilité (temps sur place + trajet), sans formule de poids face aux critères REQ-024 (décision produit).
- Couvre la prise en compte de la distance point de départ → spot dans la recommandation, sur la base de la position précise de chaque spot du référentiel interne (REQ-025, REQ-032).
- Ne couvre pas le chargement ni l'import du référentiel des spots de pêche → domaine `REF` (REQ-032).
- Ne couvre pas l'évaluation des critères météo / marins des spots → `SPEC-PECHE-02` (croisement sur la fenêtre du créneau).
- Ne couvre pas l'affichage des alertes en cours rattachées au spot (page ou recommandation) → domaine `ADMIN` (`SPEC-ADMIN-04`, REQ-026, REQ-027, R-11).
- Ne couvre pas le score comparatif trail / pêche → domaine `COMP` (REQ-028, R-12).
- Ne couvre pas la pêche en bateau et en kayak → hors périmètre (CDC §6).
- Ne couvre pas une recommandation pour un autre jour que le jour même → hors périmètre (CDC §6 ; R-18).

### Scénarios nominaux

```gherkin
Scénario : Recommandation de pêche pour le jour même
  Étant donné un utilisateur authentifié (R-16)
  Et des spots de pêche présents dans le référentiel interne (REQ-032)
  Quand l'utilisateur saisit un créneau (heure de début et durée sur place) et un point de départ
  Alors l'application produit une recommandation portant sur le jour même
  Et le créneau saisi est interprété comme le temps passé sur place, trajet en plus
  Et la fenêtre sur place est [début ; début + durée]
  Et la durée sert à la faisabilité, sans pondération inventée face aux critères REQ-024
  Et la distance entre le point de départ et chaque spot entre dans la recommandation
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Recommandation de pêche hors du jour même | Non couverte : la recommandation porte sur le jour même (REQ-025, R-18 ; CDC §6 hors périmètre) |
| 2 | Rôle de la durée du créneau | Filtre de faisabilité (temps sur place + trajet) ; pas de poids chiffré face à vent/houle/marée/etc. (REQ-024) |
| 3 | Heure de début absente du CDC littéral | Imposée par décision produit pour croiser les critères horaires REQ-024 sur la fenêtre du créneau |

### Ce qui n'est pas défini

- *24/11/2026* — Formule ou pondération exacte de la distance dans le calcul de recommandation (REQ-025 dit seulement que la distance « entre dans la recommandation »).
- *24/11/2026* — Format UI exact de saisie (au-delà de : heure de début, durée sur place, point de départ).
- *25/11/2026* — Comportement si le créneau disponible ou le point de départ ne sont pas saisis (REQ-025 les suppose saisis, sans modalité d'erreur ni de blocage).
- *25/11/2026* — Seuil exact de « faisabilité » trajet + durée (ex. coupe-horaire de fin de journée) au-delà du principe de filtre.

### Critères d'acceptation

- [ ] AC-1 — Après saisie d'un créneau et d'un point de départ, la recommandation produite porte sur le jour même (`CASE-PECHE-01`).
- [ ] AC-2 — Le créneau utilisé est le temps sur place, sans y inclure le trajet (`CASE-PECHE-01`).
- [ ] AC-3 — La distance entre le point de départ et chaque spot du référentiel entre dans la recommandation (`CASE-PECHE-01`).
- [ ] AC-4 — Le créneau comporte une heure de début et une durée ; la fenêtre sur place est [début ; début + durée] (`CASE-PECHE-01`).
- [ ] AC-5 — La durée sert à la faisabilité et n'introduit pas de pondération chiffrée face aux critères REQ-024 (`CASE-PECHE-01`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Précondition « utilisateur authentifié » | Acceptée | CDC R-16 : toute utilisation exige un compte authentifié |
| Cas « demande pour un autre jour » formulé comme parcours UI | Refusée / reformulée | Le CDC exclut la recommandation hors jour même ; il ne décrit pas d'écran de saisie d'une autre date |
| Heure de début / rôle de la durée | Acceptée | Décision produit : début + durée = fenêtre ; durée = faisabilité ; classement via REQ-024 + distance |

---

## SPEC-PECHE-02 — Identification des spots aux meilleures conditions

**Exigence :** REQ-024 (avec R-10)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'application identifie les spots de pêche aux meilleures conditions selon le vent, la houle, la marée, le solunaire, la pluie et la clarté estimée de l'eau, et indique les critères qui l'expliquent. Elle ne distingue pas les techniques de pêche. Un critère sans source gratuite est retiré du calcul et ce retrait est signalé. La clarté de l'eau est une estimation à partir des pluies récentes (historique interne) ; si la donnée de pluie manque, la clarté est affichée comme indisponible, sans estimation.

### Portée

- Couvre l'identification des spots du référentiel aux meilleures conditions selon : vent, houle, marée, solunaire, pluie, clarté estimée (REQ-024).
- Les critères horaires sont croisés sur la fenêtre du créneau saisie en `SPEC-PECHE-01` ([début ; début + durée] sur place).
- Couvre l'indication des critères qui expliquent la recommandation (REQ-024).
- Couvre l'absence de distinction de technique de pêche (REQ-024 ; CDC §6 hors périmètre).
- Couvre le retrait signalé d'un critère sans source gratuite (REQ-024).
- Couvre l'estimation de la clarté via les pluies récentes et le cas « indisponible » si la donnée de pluie manque (R-10).
- Ne couvre pas le chargement du référentiel des spots (position précise) → domaine `REF` (REQ-032).
- Ne couvre pas la constitution ni la conservation de l'historique interne des pluies récentes à partir des données reçues des sources météo → domaine `METEO` (R-10 phrase 2 ; catalogue des sources : REQ-113).
- Ne couvre pas l'affichage des alertes sur la page ou la recommandation → domaine `ADMIN` (`SPEC-ADMIN-04`, REQ-026, REQ-027, R-11).
- Ne couvre pas la mesure directe de la clarté de l'eau → hors périmètre (CDC §6).
- Ne couvre pas la carte précise des zones réglementées en mer → hors périmètre (CDC §6).

### Scénarios nominaux

```gherkin
Scénario : Spots recommandés avec critères expliqués
  Étant donné un utilisateur authentifié (R-16) ayant saisi un créneau et un point de départ
  Et des spots de pêche dans le référentiel interne (REQ-032)
  Et des sources gratuites disponibles pour les critères retenus
  Quand l'application calcule la recommandation de pêche
  Alors elle identifie les spots aux meilleures conditions selon le vent, la houle, la marée, le solunaire, la pluie et la clarté estimée de l'eau
  Et elle indique les critères qui expliquent cette identification
  Et elle ne distingue pas les techniques de pêche

Scénario : Clarté estimée à partir des pluies récentes
  Étant donné un utilisateur authentifié (R-16)
  Et un spot de pêche du référentiel interne (REQ-032)
  Et que l'historique interne des pluies récentes est disponible
  Quand l'application évalue la clarté de l'eau pour ce spot
  Alors la clarté est présentée comme une estimation fondée sur les pluies récentes sur les bassins versants côtiers
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Un critère (ex. houle, marée ou solunaire) n'a pas de source gratuite | Ce critère est retiré du calcul et le retrait est signalé (REQ-024) |
| 2 | La donnée de pluie manque pour estimer la clarté | La clarté est affichée comme indisponible ; aucune estimation n'est produite (R-10) |
| 3 | Un spot n'est pas dans le référentiel interne | Il n'est pas proposé (CDC §6 ; REQ-032) |

### Ce qui n'est pas défini

- *24/11/2026* — Pondération et seuils qui définissent « meilleures conditions » à partir des critères listés (REQ-024 les nomme sans formule).
- *24/11/2026* — Liste concrète des sources gratuites retenues pour le vent, la houle, la marée, le solunaire et la pluie (REQ-024 impose le retrait si absente ; le catalogue relève du domaine `METEO`, REQ-113).
- *24/11/2026* — Fenêtre exacte des « pluies récentes » (durée) pour R-10 (non chiffrée dans le CDC).

### Critères d'acceptation

- [ ] AC-1 — L'identification des spots s'appuie sur les critères listés dans REQ-024 (vent, houle, marée, solunaire, pluie, clarté estimée) et affiche les critères qui l'expliquent (`CASE-PECHE-02`).
- [ ] AC-2 — Aucune segmentation par technique de pêche n'apparaît (`CASE-PECHE-02`).
- [ ] AC-3 — Un critère sans source gratuite est absent du calcul et ce retrait est signalé à l'utilisateur (`CASE-PECHE-02`).
- [ ] AC-4 — Si la donnée de pluie manque, la clarté s'affiche « indisponible » sans valeur inventée (`CASE-PECHE-02`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| AC « uniquement sur les critères REQ-024 » | Refusée / reformulée | REQ-025 fait aussi entrer la distance dans la recommandation ; « uniquement » était une extrapolation |
| Exigence SPEC-02 citant la distance (REQ-025) | Refusée / retirée | La distance est couverte par `SPEC-PECHE-01` |

---

## SPEC-PECHE-03 — Prévisions météo consultables pour un spot

**Exigence :** REQ-031 (avec R-18)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'application affiche les prévisions météo des 3 prochains jours, du jour même au surlendemain, heure par heure et par jour, pour le spot de pêche consulté. La recommandation d'activité reste bornée au jour même ; les prévisions des jours suivants restent consultables.

### Portée

- Couvre l'affichage des prévisions sur 3 jours (jour même au surlendemain), heure par heure et par jour, pour un spot de pêche consulté (REQ-031).
- Couvre la distinction entre recommandation (jour même) et consultation des prévisions (3 jours) (R-18).
- Ne couvre pas les prévisions le long d'un itinéraire trail → domaines `TRAIL` / `METEO` (REQ-007, REQ-031).
- Ne couvre pas l'affichage des alertes en cours rattachées au spot consulté → domaine `ADMIN` (`SPEC-ADMIN-04`, REQ-026, REQ-027, R-11).
- Ne couvre pas la gestion de l'indisponibilité, des données périmées ni l'horodatage de mise à jour des prévisions affichées → domaine `METEO` (R-07, REQ-103, REQ-104).
- Ne couvre pas l'affichage d'un historique météo à l'utilisateur → hors périmètre (CDC §6).

### Scénarios nominaux

```gherkin
Scénario : Consultation des prévisions sur un spot
  Étant donné un utilisateur authentifié (R-16)
  Et un spot de pêche du référentiel interne consulté (REQ-032)
  Quand l'utilisateur consulte les prévisions météo de ce spot
  Alors l'application affiche les prévisions du jour même au surlendemain
  Et ces prévisions sont présentées heure par heure et par jour
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | L'utilisateur consulte les jours suivants | Les prévisions restent consultables sur 3 jours ; cela ne transforme pas la recommandation en recherche multi-jours (R-18 ; CDC §6) |

### Ce qui n'est pas défini

- *24/11/2026* — Découpage météo exact rattaché à un spot (communes, secteurs, stations) : paramétrable au déploiement (REQ-108), hors détail de cette spécification.

### Critères d'acceptation

- [ ] AC-1 — Sur un spot consulté, les prévisions couvrent du jour même au surlendemain, heure par heure et par jour (`CASE-PECHE-03`).
- [ ] AC-2 — Aucun historique météo n'est affiché à l'utilisateur dans ce parcours (`CASE-PECHE-03`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| — | — | — |
