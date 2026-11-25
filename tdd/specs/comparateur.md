# Spécifications — Comparateur d'activités

**Domaine :** `COMP`

Sources : `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3) — exigence `REQ-028` (référentiels internes `REQ-032`) ; règles `R-12`, `R-18` ; précondition `R-16`. Périmètre domaine : `tdd/specs/sommaire.md` (`COMP`).

---

## SPEC-COMP-01 — Score comparatif trail / pêche pour le jour même

**Exigence :** REQ-028 (avec R-18)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> À « Que voulez-vous faire aujourd'hui ? », l'application affiche un score comparatif justifié entre trail et pêche, pour le jour même, le temps disponible et le point de départ saisis. Côté trail, elle évalue les sentiers du panel pilote proches du point de départ.

*(Complément décision produit)* : Côté pêche, l'évaluation porte sur les spots du référentiel interne (REQ-032) proches du point de départ — miroir du périmètre trail de REQ-028.

### Portée

- Couvre l'entrée « Que voulez-vous faire aujourd'hui ? » avec saisie du temps disponible et du point de départ (REQ-028).
- Le « temps disponible » du comparateur est le temps passé sur place, trajet en plus — même sens que le « créneau » de REQ-025 (décision produit d'alignement CDC, source commune Q12).
- Couvre l'affichage d'un score comparatif justifié entre trail et pêche (REQ-028).
- Hors double défavorable (`SPEC-COMP-02`) et hors équivalence (`SPEC-COMP-03`), la restitution est le score comparatif justifié, avec indication du type d'activité mieux placé (trail ou pêche) ; le comparateur ne propose pas de sentier ni de spot précis (décision produit — limite les effets de bord REQ-026).
- Couvre le fait que la comparaison porte sur le jour même (REQ-028, R-18).
- Couvre, côté trail, l'évaluation des sentiers du panel pilote proches du point de départ (REQ-028).
- Couvre, côté pêche, l'évaluation des spots du référentiel interne (REQ-032) proches du point de départ — alignement miroir du trail (décision produit) ; distinct de la recommandation détaillée des meilleurs spots (REQ-024, REQ-025 → domaine `PECHE`).
- Ne couvre pas la recommandation concrète d'un sentier ou d'un spot → domaines `TRAIL` / `PECHE`.
- Ne couvre pas l'affichage des alertes en cours rattachées (activé seulement quand une recommandation propose un sentier ou un spot) → domaine `ADMIN` (`SPEC-ADMIN-04`, REQ-026, R-11).
- Ne couvre pas le détail de la recommandation de spots de pêche → domaine `PECHE` (REQ-024, REQ-025).
- Ne couvre pas la recherche d'itinéraire trail (départ/arrivée, trajet conseillé) → domaine `TRAIL`.
- Ne couvre pas le classement des sports favoris à l'inscription → domaine `AUTH` (REQ-017) ; son usage pour départager est dans `SPEC-COMP-03`.
- Ne couvre pas une comparaison pour un autre jour que le jour même → hors périmètre (CDC §6 ; R-18).

### Scénarios nominaux

```gherkin
Scénario : Score comparatif pour le jour même
  Étant donné un utilisateur authentifié (R-16)
  Et des sentiers du panel pilote (REQ-028) et des spots de pêche des référentiels internes (REQ-032)
  Quand l'utilisateur demande « Que voulez-vous faire aujourd'hui ? »
  Et qu'il saisit un temps disponible (temps sur place, trajet en plus) et un point de départ
  Alors l'application affiche un score comparatif justifié entre trail et pêche
  Et indique le type d'activité mieux placé (trail ou pêche), sans proposer de sentier ni de spot précis
  Et cette comparaison porte sur le jour même
  Et côté trail, l'évaluation porte sur les sentiers du panel pilote proches du point de départ
  Et côté pêche, l'évaluation porte sur les spots du référentiel interne proches du point de départ
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Comparaison d'activités hors du jour même | Non couverte : la recommandation d'activité porte sur le jour même (REQ-028, R-18 ; CDC §6 hors périmètre) |
| 2 | Interprétation du temps disponible | Temps passé sur place ; le trajet s'ajoute et n'est pas déduit du temps saisi (alignement REQ-025 / créneau) |
| 3 | Une activité mieux scorée que l'autre (hors double défavorable, hors équivalence) | Score comparatif justifié + type d'activité mieux placé ; pas de proposition de point précis ni d'affichage d'alertes REQ-026 sur cet écran |
| 4 | Périmètre des spots dans le score pêche | Spots du référentiel (REQ-032) proches du point de départ — miroir du trail ; pas tous les spots de l'île, ni uniquement les « meilleurs » de REQ-024 |

### Ce qui n'est pas défini

- *24/11/2026* — Formule de calcul des scores trail et pêche (REQ-028 exige un score comparatif justifié, sans formule).
- *24/11/2026* — Sens précis de « proches du point de départ » (distance ou critère géographique), commun au côté trail (REQ-028) et au côté pêche (alignement miroir).
- *24/11/2026* — Contenu exact de la « justification » du score (REQ-028 dit « justifié » sans modèle de texte).
- *25/11/2026* — Comportement si le temps disponible ou le point de départ ne sont pas saisis (REQ-028 les suppose saisis, sans modalité d'erreur ni de blocage).
- *25/11/2026* — Forme du « score comparatif justifié » (deux scores trail vs pêche, écart ou indicateur unique) (REQ-028, objectif 6).

### Critères d'acceptation

- [ ] AC-1 — Après saisie du temps disponible et du point de départ, un score comparatif justifié trail / pêche est affiché pour le jour même (`CASE-COMP-01`).
- [ ] AC-2 — Côté trail, l'évaluation porte sur les sentiers du panel pilote proches du point de départ (`CASE-COMP-01`).
- [ ] AC-3 — Le temps disponible saisi est le temps passé sur place ; le trajet s'ajoute (alignement REQ-025) (`CASE-COMP-01`).
- [ ] AC-4 — Hors double défavorable et hors équivalence, la restitution est le score comparatif justifié avec le type d'activité mieux placé, sans proposition de sentier ou de spot précis (`CASE-COMP-01`).
- [ ] AC-5 — Côté pêche, l'évaluation porte sur les spots du référentiel interne (REQ-032) proches du point de départ (`CASE-COMP-01`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Précondition « utilisateur authentifié » | Acceptée | CDC R-16 : toute utilisation exige un compte authentifié |
| Inventer une formule de score | Refusée | Absente du CDC ; placée en « Ce qui n'est pas défini » |
| AC-2 avec « seuls » les sentiers pilotes | Refusée / reformulée | REQ-028 dit « elle évalue les sentiers du panel pilote proches », sans le mot « seuls » |
| Sens de « temps disponible » | Acceptée | Décision produit : temps sur place, trajet en plus — alignement sur REQ-025 (source Q12 commune) |
| Forme de restitution hors double défavorable / équivalence | Acceptée | Décision produit : score justifié + type d'activité mieux placé, sans point précis (évite effets de bord REQ-026) |
| Périmètre spots pêche dans le score | Acceptée | Décision produit : spots du référentiel proches du départ — miroir du trail REQ-028 |

---

## SPEC-COMP-02 — Aucune sortie si trail et pêche sont défavorables

**Exigence :** REQ-028 (avec R-18)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Si les deux activités (trail et pêche) sont défavorables, l'application le dit et ne recommande aucune sortie.

*(Compléments décision produit)* :
- Côté trail, « défavorable » au sens du comparateur couvre les verdicts R-19 **défavorable** et **à risque** (seul « favorable » n'y entre pas).
- Une vigilance officielle majeure sur le secteur (R-19) déclenche directement le cas « aucune sortie recommandée », avec l'alerte prioritaire.
- Dans ces cas, le score comparatif justifié reste affiché (`SPEC-COMP-01`), en plus du message d'absence de recommandation.

### Portée

- Couvre le cas où trail et pêche sont toutes deux défavorables (REQ-028).
- Couvre l'absence de recommandation de sortie dans ce cas (REQ-028).
- Couvre l'articulation côté trail : verdict R-19 défavorable ou à risque ⇒ activité trail « défavorable » pour le comparateur (décision produit).
- Couvre le déclenchement du cas « aucune sortie recommandée » en cas de vigilance officielle majeure (R-19) (décision produit).
- Couvre le maintien de l'affichage du score comparatif justifié lorsque aucune sortie n'est recommandée (décision produit).
- Ne couvre pas le calcul détaillé du verdict à trois niveaux d'un itinéraire trail → domaine `CALC` (REQ-029, R-19).
- Ne couvre pas l'identification des spots aux meilleures conditions → domaine `PECHE` (REQ-024).

### Scénarios nominaux

```gherkin
Scénario : Les deux activités sont défavorables
  Étant donné un utilisateur authentifié (R-16) ayant saisi un temps disponible et un point de départ
  Et que l'évaluation du jour même juge le trail défavorable ou à risque (R-19)
  Et que l'évaluation du jour même juge la pêche défavorable
  Quand l'application affiche le résultat de « Que voulez-vous faire aujourd'hui ? »
  Alors elle indique que les deux activités sont défavorables
  Et elle affiche le score comparatif justifié
  Et elle ne recommande aucune sortie

Scénario : Vigilance officielle majeure
  Étant donné un utilisateur authentifié (R-16) ayant saisi un temps disponible et un point de départ
  Et une vigilance officielle majeure sur le secteur (R-19)
  Quand l'application affiche le résultat de « Que voulez-vous faire aujourd'hui ? »
  Alors une alerte prioritaire s'affiche
  Et aucune sortie n'est recommandée
  Et le score comparatif justifié reste affiché
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Une seule des deux activités est défavorable | Hors portée de cette spécification : REQ-028 ne décrit que le cas où les deux sont défavorables ; le score comparatif de `SPEC-COMP-01` s'applique autrement |
| 2 | Trail jugé « à risque » (R-19) | Compté « défavorable » pour le comparateur ; avec pêche défavorable ⇒ cas aucune sortie + score maintenu |
| 3 | Vigilance officielle majeure (R-19) | Déclenche directement « aucune sortie recommandée » + alerte prioritaire + score maintenu, sans attendre un double calcul défavorable trail/pêche |

### Ce qui n'est pas défini

- *24/11/2026* — Critères qui rendent l'activité pêche « défavorable » dans le comparateur (REQ-028 utilise le terme sans grille pêche dédiée ; R-19 porte sur le verdict d'itinéraire trail).

### Critères d'acceptation

- [ ] AC-1 — Si trail et pêche sont tous deux défavorables, l'application l'indique (`CASE-COMP-02`).
- [ ] AC-2 — Dans ce cas, aucune sortie n'est recommandée (`CASE-COMP-02`).
- [ ] AC-3 — Côté trail, les verdicts R-19 « défavorable » et « à risque » comptent comme défavorables pour le comparateur (`CASE-COMP-02`).
- [ ] AC-4 — Une vigilance officielle majeure déclenche « aucune sortie recommandée » avec alerte prioritaire (R-19) (`CASE-COMP-02`).
- [ ] AC-5 — Lorsque aucune sortie n'est recommandée, le score comparatif justifié reste affiché (`CASE-COMP-02`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Définir une grille « défavorable » pour la pêche | Refusée | Non écrite dans le CDC pour le comparateur ; listée en « Ce qui n'est pas défini » |
| Articulation défavorable / R-19 / vigilance / score | Acceptée | Décision produit : à risque = défavorable côté trail ; vigilance majeure ⇒ aucune sortie ; score maintenu |

---

## SPEC-COMP-03 — Équivalence des scores et sports favoris

**Exigence :** REQ-028 (avec R-12)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> En cas d'équivalence, la règle R-12 s'applique : quand l'écart entre les scores du trail et de la pêche est inférieur à un seuil paramétrable, seul l'ordre des sports favoris du profil les départage.

### Portée

- Couvre le cas d'équivalence entre les scores trail et pêche (REQ-028).
- Couvre le départage uniquement par l'ordre des sports favoris du profil lorsque l'écart est inférieur au seuil paramétrable (R-12).
- Ne couvre pas la saisie ni la modification du classement des sports favoris → domaine `AUTH` (REQ-017).
- Ne couvre pas le mécanisme technique de paramétrage du seuil → domaine `ARCH` (REQ-115).

### Scénarios nominaux

```gherkin
Scénario : Équivalence départagée par les sports favoris
  Étant donné un utilisateur authentifié (R-16) ayant un classement des sports favoris renseigné
  Et que l'écart entre les scores trail et pêche est inférieur au seuil paramétrable
  Quand l'application produit le score comparatif de « Que voulez-vous faire aujourd'hui ? »
  Alors le départage s'effectue uniquement selon l'ordre des sports favoris du profil
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Écart entre scores supérieur ou égal au seuil paramétrable | R-12 ne s'applique pas : pas de départage par les sports favoris au titre de l'équivalence (R-12) |

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
