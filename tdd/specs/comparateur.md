# Spécifications — Comparateur d'activités

**Domaine :** `COMP`

Sources : `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3) — exigence `REQ-028` (et objectif 6) ; règles `R-12`, `R-18`, `R-19` ; précondition `R-16` ; références `REQ-017`, `REQ-025` (alignement sémantique du temps disponible sur le créneau), `REQ-026`, `REQ-032`, `REQ-115`, `R-11`. Périmètre domaine : `tdd/specs/sommaire.md` (`COMP`).

---

## SPEC-COMP-01 — Score comparatif trail / pêche pour le jour même

**Exigence :** REQ-028 (avec R-18)
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> À « Que voulez-vous faire aujourd'hui ? », l'application affiche un score comparatif justifié entre trail et pêche, pour le jour même, le temps disponible et le point de départ saisis. Côté trail, elle évalue les sentiers du panel pilote proches du point de départ.

### Portée

- Couvre l'entrée « Que voulez-vous faire aujourd'hui ? » avec saisie du temps disponible et du point de départ (REQ-028).
- Couvre l'interprétation du « temps disponible » dans le même sens que le « créneau » de REQ-025 (temps passé sur place, trajet en plus — source commune `Q12`).
- Couvre l'affichage d'un score comparatif justifié entre trail et pêche (REQ-028).
- Hors double défavorable (`SPEC-COMP-02`) et hors équivalence (`SPEC-COMP-03`), le livrable normatif est le score comparatif justifié entre trail et pêche (`REQ-028`), qui permet à l'utilisateur de connaître l'activité la plus propice (objectif 6) sans proposer de sentier ni de spot précis (l'affichage des alertes locales `REQ-026`/`R-11` n'est donc pas requis sur cet écran).
- Couvre le fait que la comparaison porte sur le jour même (REQ-028, R-18).
- Couvre, côté trail, l'évaluation des sentiers du panel pilote proches du point de départ (REQ-028).
- Côté pêche, le comparateur évalue les spots de pêche du référentiel interne (`REQ-032`) proches du point de départ (en miroir des sentiers du panel pilote côté trail, `REQ-028`).
- Ne couvre pas les flux complets de recommandation trail / pêche (`REQ-024`, `REQ-025`, `REQ-032` → `REF`) → domaines `TRAIL` / `PECHE` (l'écran comparateur se limitant au score global et au type d'activité sans recommander de point précis).
- Ne couvre pas la gestion des alertes en cours (`REQ-022`, `REQ-026`, `R-11`) → domaine `ADMIN` (`SPEC-ADMIN-04`) ; le comparateur ne proposant pas de sentier ni de spot précis, l'affichage des alertes rattachées s'effectue sur les pages de recommandation dédiées (`TRAIL` / `PECHE`).
- Ne couvre pas le calcul détaillé du verdict trail (`R-19` → `CALC`) ni le détail de la recommandation de spots de pêche → domaine `PECHE` (REQ-024, REQ-025).
- Ne couvre pas la recherche d'itinéraire trail (départ/arrivée, trajet conseillé) → domaine `TRAIL`.
- Ne couvre pas le classement des sports favoris à l'inscription → domaine `AUTH` (REQ-017) ; son usage pour départager est dans `SPEC-COMP-03` (`R-12`, seuil `REQ-115` → `ARCH`).
- Ne couvre pas une comparaison pour un autre jour que le jour même → hors périmètre (CDC §6 ; R-18).

### Scénarios nominaux

```gherkin
Scénario : Score comparatif pour le jour même
  Étant donné un utilisateur authentifié (R-16)
  Et des sentiers du panel pilote (REQ-028) et des spots de pêche des référentiels internes (REQ-032)
  Quand l'utilisateur demande « Que voulez-vous faire aujourd'hui ? »
  Et qu'il saisit un temps disponible et un point de départ
  Alors l'application affiche un score comparatif justifié entre trail et pêche (REQ-028)
  Et ce score justifié permet de savoir quelle activité (trail ou pêche) est la plus propice (objectif 6)
  Et cette comparaison porte sur le jour même
  Et côté trail, l'évaluation porte sur les sentiers du panel pilote proches du point de départ
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Comparaison d'activités hors du jour même | Non couverte : la recommandation d'activité porte sur le jour même (REQ-028, R-18 ; CDC §6 hors périmètre) |
| 2 | Interprétation du temps disponible | Temps passé sur place ; le trajet s'ajoute et n'est pas déduit du temps saisi (aligné sur le créneau REQ-025, source commune Q12) |
| 3 | Une activité mieux scorée que l'autre (hors double défavorable, hors équivalence) | Affichage du score comparatif justifié (REQ-028), indiquant le type d'activité le plus propice (objectif 6) sans recommander de point précis |

### Ce qui n'est pas défini

- *24/11/2026* — Formule de calcul des scores trail et pêche (REQ-028 exige un score comparatif justifié, sans formule).
- *24/11/2026* — Sens précis de « proches du point de départ » (distance ou critère géographique) pour les sentiers du panel pilote côté trail (REQ-028).
- *25/11/2026* — Périmètre des spots de pêche pour le score comparatif : évalué sur les spots proches du point de départ en miroir du trail (`REQ-028`).
- *25/11/2026* — Restitution comparateur : score comparatif justifié et type d'activité mieux placé sans point précis (dispensant `COMP` des alertes locales `REQ-026`/`R-11`).
- *25/11/2026* — Sens du « temps disponible » (`REQ-028`) : aligné sur la définition du « créneau » (`REQ-025`, temps sur place, trajet en plus).
- *24/11/2026* — Contenu exact de la « justification » du score (REQ-028 dit « justifié » sans modèle de texte).
- *25/11/2026* — Comportement si le temps disponible ou le point de départ ne sont pas saisis (REQ-028 les suppose saisis, sans modalité d'erreur ni de blocage).
- *25/11/2026* — Forme du « score comparatif justifié » (deux scores trail vs pêche, écart ou indicateur unique) (REQ-028, objectif 6).

### Critères d'acceptation

- [ ] AC-1 — Après saisie du temps disponible et du point de départ, un score comparatif justifié trail / pêche est affiché pour le jour même (`CASE-COMP-01`).
- [ ] AC-2 — Côté trail, l'évaluation porte sur les sentiers du panel pilote proches du point de départ (`CASE-COMP-01`).
- [ ] AC-3 — Hors double défavorable et hors équivalence, le score comparatif justifié affiché (`REQ-028`) permet de connaître l'activité la plus propice entre trail et pêche (objectif 6) (`CASE-COMP-01`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Précondition « utilisateur authentifié » | Acceptée | CDC R-16 : toute utilisation exige un compte authentifié |
| Inventer une formule de score | Refusée | Absente du CDC ; placée en « Ce qui n'est pas défini » |
| AC-2 avec « seuls » les sentiers pilotes | Refusée / reformulée | REQ-028 dit « elle évalue les sentiers du panel pilote proches », sans le mot « seuls » |
| Sens de « temps disponible » | Acceptée | Alignement sur le créneau REQ-025 (temps sur place, trajet en plus) via la source commune Q12 |
| Restitution sans point précis | Acceptée | Le comparateur restitue le type d'activité le plus propice et son score sans recommander de point précis (dispensant `COMP` de `REQ-026`/`R-11`) |
| Miroir pêche « spots proches du point de départ » | Acceptée | Application symétrique côté pêche du filtre géographique proche du départ de REQ-028 |

---

## SPEC-COMP-02 — Aucune sortie si trail et pêche sont défavorables

**Exigence :** REQ-028 (avec R-18, R-19)
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> Si les deux activités (trail et pêche) sont défavorables, l'application le dit et ne recommande aucune sortie.

Règle R-19 associée (vigilance officielle majeure) :

> En cas de vigilance officielle majeure sur le secteur, une alerte prioritaire s'affiche et aucune sortie n'est jugée favorable.

### Portée

- Couvre le cas où trail et pêche sont toutes deux défavorables (REQ-028) : l'application l'indique et ne recommande aucune sortie (REQ-028).
- Couvre l'articulation côté trail pour le cas double défavorable : seul le verdict `R-19` « défavorable » entre dans ce déclenchement ; un verdict « à risque » ne constitue pas un verdict défavorable pour `REQ-028`.
- Couvre la priorité du cas double défavorable (`REQ-028`) sur le départage par équivalence (`R-12`, `SPEC-COMP-03`) lorsque les deux activités sont défavorables.
- Couvre, en cas de vigilance officielle majeure sur le secteur, l'affichage d'une alerte prioritaire et le fait qu'aucune sortie n'est jugée favorable (`R-19`) ; l'effet distinct « ne recommande aucune sortie » (`REQ-028`) demeure réservé au cas où les deux activités sont évaluées défavorables.
- Couvre le maintien de l'affichage du score comparatif justifié à titre explicatif, y compris lorsqu'aucune sortie n'est recommandée (`REQ-028`) ou en cas de vigilance officielle majeure (`R-19`).
- Ne couvre pas le calcul détaillé du verdict à trois niveaux d'un itinéraire trail → domaine `CALC` (REQ-029, R-19).
- Ne couvre pas l'identification des spots aux meilleures conditions → domaine `PECHE` (REQ-024).

### Scénarios nominaux

```gherkin
Scénario : Les deux activités sont défavorables
  Étant donné un utilisateur authentifié (R-16) ayant saisi un temps disponible et un point de départ
  Et que l'évaluation du jour même juge le trail défavorable (R-19)
  Et que l'évaluation du jour même juge la pêche défavorable
  Quand l'application affiche le résultat de « Que voulez-vous faire aujourd'hui ? »
  Alors elle indique que les deux activités sont défavorables
  Et elle ne recommande aucune sortie

Scénario : Vigilance officielle majeure
  Étant donné un utilisateur authentifié (R-16) ayant saisi un temps disponible et un point de départ
  Et une vigilance officielle majeure sur le secteur (R-19)
  Quand l'application affiche le résultat de « Que voulez-vous faire aujourd'hui ? »
  Alors une alerte prioritaire s'affiche (R-19)
  Et aucune sortie n'est jugée favorable (R-19)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Une seule des deux activités est défavorable | Hors portée de cette spécification : REQ-028 ne décrit que le cas où les deux sont défavorables ; le score comparatif de `SPEC-COMP-01` s'applique autrement |
| 2 | Vigilance officielle majeure sur le secteur (R-19) | Alerte prioritaire affichée et aucune sortie n'est jugée favorable (R-19) ; le message « aucune sortie recommandée » (REQ-028) reste subordonné au double verdict défavorable |
| 3 | Les deux activités sont défavorables et l'écart des scores est inférieur au seuil R-12 | Le cas « aucune sortie recommandée » (`REQ-028`) prime : le départage `R-12` (`SPEC-COMP-03`) ne s'applique pas pour recommander une sortie |

### Ce qui n'est pas défini

- *24/11/2026* — Critères qui rendent l'activité pêche « défavorable » dans le comparateur (REQ-028 utilise le terme sans grille pêche dédiée ; R-19 porte sur le verdict d'itinéraire trail).
- *25/11/2026* — Distinction des statuts : un verdict trail « à risque » (`R-19`) ne déclenche pas le cas double défavorable de `REQ-028`.
- *25/11/2026* — Règle d'agrégation trail : l'activité trail est considérée défavorable pour `REQ-028` si tous les sentiers du panel pilote proches du point de départ sont défavorables sous `R-19`.
- *25/11/2026* — Maintien de l'affichage du score : le score comparatif justifié reste affiché à titre d'information même en cas de double verdict défavorable ou de vigilance majeure.
- *25/11/2026* — Modalités d'application du verdict `R-19` (rattaché à un itinéraire par `REQ-029` → `CALC`) à un sentier ou ensemble de sentiers du panel pilote évalués par le comparateur sans construction d'itinéraire (`REQ-028`, `R-19`).
- *25/11/2026* — Périmètre géographique du « secteur » (`R-19`) pour l'affichage de la vigilance officielle majeure depuis l'écran comparateur, en l'absence d'itinéraire construit (autour du point de départ saisi / autre) (voir aussi `CALC`, domaine primaire `R-19`).

### Critères d'acceptation

- [ ] AC-1 — Si trail (verdict `R-19` « défavorable ») et pêche sont tous deux défavorables, l'application l'indique (`CASE-COMP-02`).
- [ ] AC-2 — Dans ce cas, aucune sortie n'est recommandée, y compris si l'écart des scores est inférieur au seuil `R-12` (`CASE-COMP-02`).
- [ ] AC-3 — En cas de vigilance officielle majeure sur le secteur, une alerte prioritaire s'affiche et aucune sortie n'est jugée favorable (`R-19`) (`CASE-COMP-02`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Définir une grille « défavorable » pour la pêche | Refusée | Non écrite dans le CDC pour le comparateur ; listée en « Ce qui n'est pas défini » |
| Assimiler `à risque` (`R-19`) à `défavorable` (`REQ-028`) | Refusée | `R-19` distingue trois verdicts (`favorable`, `défavorable`, `à risque`) ; `REQ-028` ne vise que « défavorables » (distinction stricte maintenue) |
| Déclencher directement « aucune sortie recommandée » (`REQ-028`) sur vigilance majeure (`R-19`) | Refusée | `R-19` impose l'alerte prioritaire et qu'« aucune sortie n'est jugée favorable » (conservé), distinct de « ne recommande aucune sortie » (`REQ-028`) qui requiert le double défavorable |
| Maintenir l'affichage du score quand aucune sortie n'est recommandée | Acceptée | Le score comparatif justifié reste affiché à titre d'information explicative |

---

## SPEC-COMP-03 — Équivalence des scores et sports favoris

**Exigence :** REQ-028 (avec R-12)
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> En cas d'équivalence, la règle R-12 s'applique : quand l'écart entre les scores du trail et de la pêche est inférieur à un seuil paramétrable, seul l'ordre des sports favoris du profil les départage.

### Portée

- Couvre le cas d'équivalence entre les scores trail et pêche (REQ-028).
- Couvre le départage uniquement par l'ordre des sports favoris du profil lorsque l'écart est inférieur au seuil paramétrable (R-12), en désignant le type d'activité retenu selon cet ordre.
- Ne couvre pas le cas où les deux activités sont défavorables, qui prime et empêche toute recommandation de sortie → `SPEC-COMP-02` (REQ-028).
- Ne couvre pas la saisie ni la modification du classement des sports favoris → domaine `AUTH` (REQ-017).
- Ne couvre pas le mécanisme technique de paramétrage du seuil → domaine `ARCH` (REQ-115).

### Scénarios nominaux

```gherkin
Scénario : Équivalence départagée par les sports favoris
  Étant donné un utilisateur authentifié (R-16) ayant un classement des sports favoris renseigné
  Et que les deux activités ne sont pas toutes deux défavorables (REQ-028)
  Et que l'écart entre les scores trail et pêche est inférieur au seuil paramétrable
  Quand l'application produit le score comparatif de « Que voulez-vous faire aujourd'hui ? »
  Alors le départage s'effectue uniquement selon l'ordre des sports favoris du profil
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Écart entre scores supérieur ou égal au seuil paramétrable | R-12 ne s'applique pas : pas de départage par les sports favoris au titre de l'équivalence (R-12) |
| 2 | Écart inférieur au seuil paramétrable alors que trail et pêche sont toutes deux défavorables | R-12 ne s'applique pas pour recommander une sortie : le cas double défavorable (`REQ-028` → `SPEC-COMP-02`) prime |

### Ce qui n'est pas défini

- *24/11/2026* — Valeur du seuil d'équivalence (R-12 et REQ-115 : paramétrable, non chiffré dans le CDC).
- *24/11/2026* — Comportement si le classement des sports favoris est absent du profil (REQ-017 le prévoit à l'inscription ; R-12 suppose l'ordre du profil sans traiter l'absence).

### Critères d'acceptation

- [ ] AC-1 — Si l'écart des scores est inférieur au seuil paramétrable, le départage utilise uniquement l'ordre des sports favoris (`CASE-COMP-03`).
- [ ] AC-2 — Si l'écart n'est pas inférieur au seuil, le départage par sports favoris au titre de R-12 n'est pas appliqué (`CASE-COMP-03`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Fixer une valeur numérique de seuil | Refusée | CDC : seuil paramétrable, sans valeur |
| Étendre le départage à d'autres éléments du profil | Refusée | R-12 : seul l'ordre des sports favoris |
