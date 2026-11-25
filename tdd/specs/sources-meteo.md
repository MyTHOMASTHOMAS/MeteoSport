# Spécifications — Sources externes, météo et fraîcheur

**Domaine :** `METEO`

---

## SPEC-METEO-01 — Catalogue des sources de données

**Exigence :** REQ-102, REQ-113 (avec contraintes 2 et 3 du CDC §7)
**Renvois :** hébergement à coût nul REQ-102 → `SPEC-ARCH-nn` ; critères de pêche REQ-024 → `SPEC-PECHE-nn` ; vigilances officielles R-19 → `SPEC-CALC-nn` ; état des sentiers CR-001/Q36 → `SPEC-REF-06`, `SPEC-ADMIN-nn` ; données marines CR-001/Q09 → `SPEC-REF-06`, `SPEC-PECHE-nn`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Chaque source de données externe est gratuite et documentée : producteur, données
> fournies, fréquence de mise à jour, quotas, conditions d'utilisation et justification
> de sa fiabilité. Aucune source payante n'est admise, et l'usage prévu reste sous les
> quotas de chaque source.

### Portée

- Couvre la liste des types de données externes nécessaires et la source retenue pour chacun : prévisions météo (pluie, vent, température, ensoleillement), vigilances officielles (R-19), état des sentiers (CR-001/Q36), données marines (houle, marée, vent côtier ; CR-001/Q09), données astronomiques du solunaire (phases et position de la lune, lever et coucher du soleil ; REQ-024).
- Le solunaire figure au catalogue même s'il est calculé par l'application à partir de règles astronomiques publiques : la fiche documente alors la méthode et sa référence au lieu d'un producteur. Le calcul du critère solunaire pour un spot relève de `SPEC-PECHE-nn`.
- Couvre la fiche documentaire de chaque source et l'estimation du nombre d'appels comparé aux quotas.
- Chaque source retenue couvre le territoire de La Réunion (contrainte 4 du CDC §7, CR-001/Q05).
- Couvre le cas d'un type de donnée sans source gratuite.
- Ne couvre pas le choix technique des services ni leur mode d'accès → hors spécification.
- Ne couvre pas l'usage des données dans les calculs → `SPEC-CALC-nn`, `SPEC-PECHE-nn`.
- Ne couvre pas les données calculées sans source externe (heure de passage, clarté estimée de l'eau) → `SPEC-CALC-nn`, `SPEC-PECHE-nn`.

### Scénarios nominaux

```gherkin
Scénario : Source documentée
  Étant donné une source de prévisions météo retenue
  Quand on consulte le catalogue des sources
  Alors sa fiche indique le producteur, les données fournies, la fréquence de mise à jour, les quotas, les conditions d'utilisation et la justification de sa fiabilité
  Et son coût est nul

Scénario : Usage sous les quotas
  Étant donné le découpage météo paramétré et la fréquence de mise à jour de chaque source
  Quand on estime le nombre d'appels quotidiens nécessaires
  Alors cette estimation est inférieure au quota de chaque source

Scénario : Type de donnée sans source gratuite
  Étant donné un type de donnée pour lequel aucune source gratuite n'a été trouvée
  Quand le catalogue est établi
  Alors ce type est marqué « sans source »
  Et les calculs qui l'utilisent le retirent et signalent ce retrait (REQ-024)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Seule une source payante fournit une donnée | Source refusée ; la donnée est traitée comme « sans source » |
| 2 | Quota d'une source atteint en cours de journée | Plus aucun appel jusqu'au renouvellement du quota ; les données concernées suivent `SPEC-METEO-06` |
| 3 | Source qui met à jour ses données toutes les 3 heures | Ses données ne sont pas redemandées avant leur prochaine mise à jour prévue, pour économiser le quota |
| 4 | Conditions d'utilisation qui interdisent l'usage prévu (public, mention de source…) | Source refusée, ou mentions exigées affichées dans l'application |
| 5 | Changement des conditions d'une source après sa sélection | La fiche est mise à jour ; si la source devient payante, elle est retirée |

### Ce qui n'est pas défini

- *24/11/2026* — Sources retenues pour chaque type de donnée : à choisir par l'équipe et à présenter au client (REQ-113 : revue de la liste avec le client).
- *24/11/2026* — Source automatique de l'état des sentiers : non identifiée ; à défaut, saisie manuelle par l'administrateur (CDC §1, CR-001/Q36).
- *24/11/2026* — Disponibilité d'une source gratuite pour la houle et la marée à La Réunion : à vérifier ; sinon retrait signalé du critère (REQ-024).
- *24/11/2026* — Solunaire : calcul interne à partir de règles astronomiques publiques, ou source gratuite. Hypothèse retenue = calcul interne, qui ne consomme aucun quota. À confirmer.

### Critères d'acceptation

- [ ] AC-1 — Chaque source utilisée a une fiche complète dans le catalogue (`CASE-METEO-01`).
- [ ] AC-2 — Aucune source du catalogue n'est payante (`CASE-METEO-02`).
- [ ] AC-3 — L'estimation des appels quotidiens reste sous le quota de chaque source pour le découpage paramétré (`CASE-METEO-03`).
- [ ] AC-4 — Un type de donnée sans source gratuite est marqué comme tel (`CASE-METEO-04`).
- [ ] AC-5 — Une donnée n'est pas redemandée avant sa prochaine mise à jour prévue par la source (`CASE-METEO-05`).
- [ ] AC-6 — Les critères vent, houle, marée, solunaire et pluie de REQ-024 ont chacun une source, une méthode de calcul documentée (solunaire calculé en interne) ou la mention « sans source ». La clarté estimée de l'eau, calculée à partir des pluies récentes (R-10), n'a pas de source externe à cataloguer : sa méthode relève de `SPEC-PECHE-nn` (`CASE-METEO-06`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-METEO-02 — Découpage géographique météo

**Exigence :** REQ-108 (avec règle R-03)
**Renvois :** rattachement indirect des sentiers et spots aux zones REQ-032 (partiel : « les données externes (météo…) sont rattachées aux éléments de ces référentiels »), par la zone de R-03 ← `SPEC-REF-06` ; sentiers et spots eux-mêmes REQ-032 → `SPEC-REF-01`, `SPEC-REF-02` ; critères de sécurité propres à chaque sentier R-06, consignés pour le panel pilote REQ-023 → `SPEC-REF-05` ; mécanisme technique de paramétrage → `SPEC-ARCH-nn`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> La météo est obtenue par zone. Les zones sont des communes, des secteurs d'altitude
> ou des stations météo. Le découpage et ses limites se paramètrent au déploiement,
> sans modifier l'application, pour rester sous les quotas des sources.

### Portée

- Couvre la définition d'une zone météo : identifiant, nom, type (commune, secteur d'altitude, station), emprise géographique, plage d'altitude éventuelle.
- Couvre l'attribution d'une zone à chaque point d'un tracé de sentier, selon sa position et son altitude, et donc à chaque tronçon d'itinéraire.
- Couvre les zones désignées par les spots (secteur de pluie) et par les critères de sécurité du panel pilote (`SPEC-REF-02`, `SPEC-REF-05`).
- Ne couvre pas les sentiers et les spots eux-mêmes → `SPEC-REF-01`, `SPEC-REF-02`.
- Ne couvre pas le mécanisme technique de paramétrage → `SPEC-ARCH-nn`.

### Scénarios nominaux

```gherkin
Scénario : Attribution d'une zone selon l'altitude
  Étant donné une commune découpée en deux secteurs d'altitude : en dessous et au-dessus de 1 500 m
  Et un tronçon de sentier situé dans cette commune à 1 800 m
  Quand l'application attribue une zone à ce tronçon
  Alors le tronçon est rattaché à la zone « secteur d'altitude au-dessus de 1 500 m »

Scénario : Modification du découpage au déploiement
  Étant donné un découpage paramétré
  Quand on modifie la limite d'altitude d'un secteur dans le paramétrage
  Et que l'application est redémarrée
  Alors les tronçons sont rattachés selon la nouvelle limite, sans modification de l'application
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Point exactement sur une limite d'altitude | Rattaché à la zone du secteur d'altitude supérieur (limite incluse dans ce secteur) — hypothèse de modélisation retenue par l'équipe |
| 2 | Point qui n'appartient à aucune zone | Météo indisponible pour ce point ; aucune zone voisine n'est utilisée à sa place. Le message suit la nomenclature de `SPEC-METEO-06` (ligne « hors découpage ») : il nomme le sentier et la portion concernée, sans terme générique |
| 3 | Deux zones se chevauchent : un même point (position et altitude) appartient à deux zones | Paramétrage refusé au démarrage, avec le motif. Une commune découpée en secteurs d'altitude n'est pas un chevauchement tant que les plages d'altitude ne se recouvrent pas ; une commune entière et un secteur de cette même commune qui se recouvrent sont refusés |
| 4 | Zone supprimée ou renommée dans le paramétrage alors qu'un spot ou un critère de sécurité la désigne | Paramétrage accepté au démarrage ; chaque référence devenue invalide est signalée à l'équipe, avec la liste des éléments concernés. Les conséquences relèvent des référentiels : clarté de l'eau indisponible pour le spot (`SPEC-REF-02`, cas limite 6), sentier pilote désactivé par prudence pour un critère (`SPEC-REF-05`, cas limite 6) |
| 5 | Tronçon qui traverse plusieurs zones | Découpé en autant de tronçons que de zones traversées |

### Ce qui n'est pas défini

- *24/11/2026* — Découpage initial (zones et limites) pour le panel pilote et la côte : à proposer par l'équipe selon les sources et leurs quotas (`SPEC-METEO-01`).
- *25/11/2026* — Point exactement sur une limite d'altitude : le CDC (R-03, REQ-108) ne dit rien ; hypothèse de modélisation retenue par l'équipe = secteur supérieur, limite incluse.
- *25/11/2026* — Définition du chevauchement (cas limite 3) : recouvrement d'un même point (position et altitude) par deux zones, de types identiques ou différents (R-03, REQ-108) ; déduction de AC-1, le CDC ne la formule pas.
- *25/11/2026* — Zone désignée par un spot ou un critère puis retirée du découpage (cas limite 4) : le CDC ne dit rien. Décision de l'équipe du 25/11/2026 = le paramétrage n'est pas bloqué ; la référence invalide rend la donnée non évaluable dans le référentiel concerné (`SPEC-REF-02`, `SPEC-REF-05`). Un contrôle bloquant au paramétrage a été écarté. Mode de signalement à l'équipe : non défini.
- *24/11/2026* — Choix du type de zone selon la partie de l'île (commune, secteur d'altitude ou station) : décidé par zone dans le paramétrage ; règle de choix à documenter.

### Critères d'acceptation

- [ ] AC-1 — Chaque point d'un tracé est rattaché à au plus une zone, selon sa position et son altitude (`CASE-METEO-07`).
- [ ] AC-2 — Modifier le découpage dans le paramétrage change le rattachement sans modifier l'application (`CASE-METEO-08`).
- [ ] AC-3 — Un paramétrage dont deux zones se chevauchent est refusé au démarrage (`CASE-METEO-09`).
- [ ] AC-4 — Un point sans zone n'emprunte jamais la météo d'une zone voisine (`CASE-METEO-10`).
- [ ] AC-5 — Une zone retirée du découpage alors qu'un spot ou un critère la désigne ne bloque pas le démarrage ; la référence invalide est signalée à l'équipe (`CASE-METEO-33`, numéroté en fin de chaîne pour ne pas décaler les cas existants).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-METEO-03 — Prévisions sur 3 jours

**Exigence :** REQ-031 (avec règle R-18)
**Renvois :** recherche et recommandation bornées au jour même R-18 → `SPEC-TRAIL-nn`, `SPEC-PECHE-nn` ; zones d'un itinéraire REQ-031 → `SPEC-TRAIL-nn` ; spot de pêche REQ-031 → `SPEC-PECHE-nn` ; date de mise à jour des prévisions REQ-104 → `SPEC-METEO-06`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'application affiche les prévisions météo du jour même, du lendemain et du
> surlendemain, heure par heure et par jour, pour les zones d'un itinéraire ou pour
> le spot de pêche consulté. La recherche et la recommandation restent limitées au jour même.

### Portée

- Couvre les données prévues affichées : pluie, vent, température, ensoleillement, et pour un spot les données marines disponibles (extension de l'équipe, voir « Ce qui n'est pas défini »).
- Couvre les deux vues : heure par heure et synthèse par jour.
- Ne couvre pas la recherche ou la recommandation pour un autre jour → hors périmètre (R-18).
- Ne couvre pas l'affichage de l'historique météo → hors périmètre (CR-001/Q13).
- Ne couvre pas la météo à l'heure de passage sur un itinéraire → `SPEC-METEO-04`.

### Scénarios nominaux

```gherkin
Scénario : Prévisions d'un spot
  Étant donné un spot de pêche rattaché à une zone météo
  Quand l'utilisateur consulte ses prévisions
  Alors il voit les prévisions heure par heure et la synthèse par jour pour aujourd'hui, demain et après-demain
  Et chaque prévision indique sa date de mise à jour

Scénario : Prévisions d'un itinéraire
  Étant donné un itinéraire qui traverse trois zones météo
  Quand l'utilisateur consulte les prévisions
  Alors il voit les prévisions des trois zones, sur les 3 jours
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | La source ne couvre pas tout le surlendemain | Les heures non couvertes sont affichées comme indisponibles, sans extrapolation |
| 2 | Consultation tard le soir | Les heures passées du jour même ne sont plus affichées comme prévisions — hypothèse, voir « Ce qui n'est pas défini » |
| 3 | Donnée marine sans source gratuite | Affichée comme non disponible, avec le motif (`SPEC-METEO-01`) |
| 4 | Changement de jour pendant la consultation | Au rechargement, « aujourd'hui » désigne le nouveau jour |

### Ce qui n'est pas défini

- *24/11/2026* — Contenu exact de la synthèse par jour (minimum, maximum, cumul de pluie…) : à proposer par l'équipe.
- *24/11/2026* — Fuseau horaire : hypothèse retenue = heure de La Réunion pour tous les affichages et calculs.
- *25/11/2026* — Données marines dans les prévisions d'un spot : REQ-031 ne parle que de « prévisions météo ». Leur affichage sur 3 jours est une extension de l'équipe, justifiée par leur usage dans la recommandation (REQ-024) ; il dépend de leur disponibilité gratuite (`SPEC-METEO-01`). À valider à la recette.
- *25/11/2026* — Heures passées du jour même (cas limite 2) : REQ-031 et R-18 ne prescrivent pas de retirer les créneaux écoulés de la vue des prévisions. Hypothèse de l'équipe = ils ne sont plus affichés comme prévisions. À valider à la recette.

### Critères d'acceptation

- [ ] AC-1 — Les prévisions couvrent le jour même, le lendemain et le surlendemain, heure par heure et par jour (`CASE-METEO-11`).
- [ ] AC-2 — Les prévisions sont disponibles pour chaque zone d'un itinéraire et pour un spot (`CASE-METEO-12`).
- [ ] AC-3 — Une heure non couverte par la source est indiquée comme indisponible (`CASE-METEO-13`).
- [ ] AC-4 — Les heures passées du jour même ne sont plus affichées comme prévisions dans la vue horaire ; les créneaux écoulés d'un tronçon d'itinéraire relèvent de `SPEC-METEO-04` (AC-4) (`CASE-METEO-14`).
- [ ] AC-5 — Après un changement de jour, « aujourd'hui » désigne le nouveau jour au rechargement (`CASE-METEO-15`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-METEO-04 — Météo à l'heure de passage

**Exigence :** REQ-007 (avec règle R-03)
**Renvois :** saisie et affichage séparé en aller-retour REQ-002 → `SPEC-TRAIL-nn` ; calcul de l'heure de passage REQ-005 → `SPEC-CALC-nn` ; verdict exploitant la météo REQ-029 → `SPEC-CALC-nn` ; recherche bornée au jour même R-18 (cas limite 2) → `SPEC-TRAIL-nn` ; non-adaptation pendant la sortie R-04 → `SPEC-TRAIL-nn`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> La météo d'un tronçon est celle prévue, pour la zone qu'il traverse, à l'heure
> estimée de passage sur ce tronçon. En aller-retour, chaque passage a sa propre météo.

### Portée

- Couvre la sélection de la prévision horaire de la zone à l'heure estimée de passage.
- Couvre l'aller-retour : un tronçon emprunté deux fois a deux heures de passage et deux météos.
- Ne couvre pas le calcul de l'heure de passage → `SPEC-CALC-nn`.
- Ne couvre pas le verdict qui exploite cette météo → `SPEC-CALC-nn`.
- Ne couvre pas l'adaptation pendant la sortie → hors périmètre (R-04).

### Scénarios nominaux

```gherkin
Scénario : Météo d'un tronçon à l'heure de passage
  Étant donné un départ à 6 h
  Et un tronçon dans la zone « Cirque de Mafate » avec un passage estimé à 9 h 20
  Quand la météo de l'itinéraire est établie
  Alors ce tronçon affiche la prévision de la zone « Cirque de Mafate » pour le créneau de 9 h

Scénario : Aller-retour
  Étant donné un aller-retour qui passe sur le même tronçon à 8 h puis à 14 h
  Quand la météo de l'itinéraire est établie
  Alors le tronçon affiche séparément la prévision de 8 h et celle de 14 h
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Heure de passage entre deux créneaux horaires | Prévision du créneau qui contient l'heure de passage (créneau commencé) — hypothèse de modélisation retenue |
| 2 | Heure de passage après minuit (sortie qui finit tard) | Prévision du lendemain utilisée pour ce tronçon ; la recherche reste celle du jour même (R-18) ; au-delà de la période couverte (J+2) : cas limite 3 |
| 3 | Heure de passage hors de la période couverte par la source | Météo indisponible pour ce tronçon, signalée (`SPEC-METEO-06`) |
| 4 | Heure de départ déjà passée | Calcul fait sur l'heure saisie ; les créneaux passés utilisent les dernières prévisions reçues, avec leur date : valeur de la dernière prévision reçue (jamais une observation), rattachée à un tronçon d'itinéraire et non à une vue horaire (décision de l'équipe du 25/11/2026). Ce n'est pas un historique météo affiché (REQ-029) |
| 5 | Tronçon sans zone | Météo indisponible pour ce tronçon (`SPEC-METEO-02`) ; message selon la nomenclature de `SPEC-METEO-06` (ligne « hors découpage ») |
| 6 | Traversée d'une même zone sur plusieurs créneaux horaires (par exemple de 9 h 20 à 12 h 10 dans « Cirque de Mafate ») | Coupée en tronçons par créneau : prévisions de 9 h, 10 h, 11 h et 12 h de la zone, chacune sur la portion parcourue pendant ce créneau (R-03, REQ-007) — hypothèse de découpage, voir « Ce qui n'est pas défini » |

### Ce qui n'est pas défini

- *25/11/2026* — Créneau retenu entre deux créneaux horaires (créneau commencé) : hypothèse de modélisation, non définie par R-03 / REQ-007.
- *25/11/2026* — Départ déjà passé (cas limite 4) : le CDC ne dit rien. Décision de l'équipe du 25/11/2026 = dernière prévision reçue conservée pour les créneaux écoulés, rattachée au tronçon, jamais une observation ; elle n'est pas présentée dans la vue horaire de `SPEC-METEO-03` (cas limite 2), ce qui préserve l'interdiction d'afficher un historique (CDC §6, REQ-029). Usage dans les calculs : `SPEC-CALC-nn`.
- *25/11/2026* — Itinéraires en boucle ou passages multiples hors aller-retour : non prévus par le CDC (REQ-002) ; R-03 s'applique par tronçon et par heure de passage.
- *25/11/2026* — Pas de découpage des tronçons pour la météo : R-03 et REQ-007 demandent la prévision « heure par heure » à l'heure estimée de passage. Hypothèse retenue = un tronçon est coupé à chaque changement de zone et à chaque changement de créneau horaire ; chaque tronçon porte la prévision de sa zone pour le créneau où il est parcouru (cas limite 6). Une traversée de 3 heures dans une même zone donne donc au moins 3 tronçons et 3 prévisions. Position des coupures selon l'allure : `SPEC-CALC-nn`.

### Critères d'acceptation

- [ ] AC-1 — Chaque tronçon affiche la prévision de sa zone au créneau de son heure de passage (`CASE-METEO-16`).
- [ ] AC-2 — En aller-retour, chaque passage a sa propre prévision (`CASE-METEO-17`).
- [ ] AC-3 — Un passage hors période couverte est signalé comme indisponible (`CASE-METEO-18`).
- [ ] AC-4 — Pour un départ déjà passé, les tronçons des créneaux écoulés portent la dernière prévision reçue avec sa date, jamais une observation, et cette prévision n'apparaît pas dans la vue horaire (décision de l'équipe du 25/11/2026) (`CASE-METEO-32`, numéroté en fin de chaîne pour ne pas décaler les cas existants).
- [ ] AC-5 — Une traversée d'une même zone sur plusieurs créneaux horaires affiche une prévision par créneau parcouru (`CASE-METEO-34`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-METEO-05 — Historique interne des pluies récentes

**Exigence :** R-10 (arbitrage CR-001/§5.1 : historique constitué en interne)
**Renvois :** cumul consommé par l'estimation de la clarté de l'eau REQ-024 → `SPEC-PECHE-nn` ; mention de pluie récente dans le verdict REQ-029 → `SPEC-CALC-nn` ; critères de sécurité du panel pilote R-06 → `SPEC-REF-05`, `SPEC-CALC-nn` ; non-affichage de l'historique météo (CDC §6, CR-001/Q13)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'application constitue un historique interne des pluies en conservant, zone par
> zone, les données reçues des sources météo. Elle en tire des cumuls de pluie par
> zone et par période. Cet historique n'est jamais affiché à l'utilisateur.

### Portée

- Couvre la conservation des pluies reçues, par zone et par heure.
- Couvre le calcul d'un cumul de pluie sur une période donnée, pour une zone, et son caractère disponible ou non.
- Couvre les trous dans l'historique.
- Ne couvre pas l'interprétation du cumul, qui reste dans les domaines qui l'utilisent :
  - déclenchement des critères des sentiers pilotes (R-06) → `SPEC-REF-05` pour leur contenu, `SPEC-CALC-nn` pour leur évaluation ;
  - verdict et mention d'une pluie récente parmi les critères qui posent problème (REQ-029) → `SPEC-CALC-nn` ;
  - estimation de la clarté de l'eau (REQ-024, R-10) → `SPEC-PECHE-nn`.
- Ne couvre pas l'affichage de l'historique → hors périmètre (CR-001/Q13).

### Scénarios nominaux

```gherkin
Scénario : Cumul de pluie sur 24 heures
  Étant donné l'historique d'une zone complet sur les dernières 24 heures
  Et 12 mm de pluie répartis sur ces 24 heures
  Quand on demande le cumul sur 24 heures pour cette zone
  Alors le cumul vaut 12 mm
  Et la période couverte est indiquée

Scénario : Constitution de l'historique
  Étant donné des données de pluie reçues pour une zone à 10 h
  Quand ces données sont reçues
  Alors elles sont conservées dans l'historique de cette zone pour ce créneau
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Trou d'une ou plusieurs heures dans la période demandée | Cumul déclaré indisponible, sans estimation ; le domaine utilisateur en tire la conséquence (par exemple clarté affichée comme indisponible, R-10) |
| 2 | Première mise en service : historique plus court que la période demandée | Cumul indisponible jusqu'à ce que l'historique couvre la période |
| 3 | Même créneau reçu plusieurs fois | Seule la donnée la plus récente est conservée |
| 4 | Données plus anciennes que la durée de conservation paramétrée | Supprimées de l'historique |
| 5 | Zone retirée du découpage | Son historique n'est plus alimenté ni utilisé |

### Ce qui n'est pas défini

- *24/11/2026* — Nature des pluies conservées (pluie observée si une source gratuite la fournit, sinon dernière prévision reçue pour l'heure écoulée) : à décider avec le catalogue des sources (`SPEC-METEO-01`).
- *24/11/2026* — Période des « pluies récentes » et durée de conservation de l'historique : à fixer avec les critères du panel pilote (REQ-023, validation à la recette) et l'estimation de la clarté (R-10). La durée de conservation est un paramètre technique interne, hors liste fermée de REQ-115.

### Critères d'acceptation

- [ ] AC-1 — Les pluies reçues sont conservées par zone et par heure (`CASE-METEO-19`).
- [ ] AC-2 — Le cumul sur une période complète est exact (`CASE-METEO-20`).
- [ ] AC-3 — Un trou dans la période rend le cumul indisponible, sans estimation (`CASE-METEO-21`).
- [ ] AC-4 — L'historique n'est affiché sur aucun écran (`CASE-METEO-22`).
- [ ] AC-5 — Avant que l'historique couvre la période demandée (mise en service), le cumul est indisponible ; un créneau reçu plusieurs fois ne conserve que la donnée la plus récente (`CASE-METEO-23`).
- [ ] AC-6 — Les données plus anciennes que la durée de conservation sont supprimées de l'historique (`CASE-METEO-24`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-METEO-06 — Fraîcheur et indisponibilité des données

**Exigence :** REQ-103, REQ-104 (avec règle R-07 ; vigilances officielles de R-19 par extension de l'équipe, REQ-104 ne les citant pas)
**Renvois :** paramétrage de l'âge maximal REQ-115 → `SPEC-ARCH-nn` ; écran général d'absence de connexion REQ-109 → `SPEC-ARCH-nn` ; vigilance officielle majeure R-19 → `SPEC-CALC-nn` ; exploitation de l'indisponibilité dans les calculs et le comparateur → `SPEC-CALC-nn`, `SPEC-PECHE-nn`, `SPEC-COMP-nn`
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Chaque information externe affichée indique sa date de mise à jour. Si une source
> est indisponible, ou si sa donnée dépasse l'âge maximal paramétré pour son type,
> l'application l'indique clairement pour le secteur concerné et n'invente aucune
> valeur de remplacement.

Le **secteur** de R-07 désigne l'élément auquel la donnée manquante est rattachée, et le message le nomme :

| Type de donnée | Secteur indiqué à l'utilisateur |
|---|---|
| Prévisions météo, vigilances | La zone météo, par son nom, et les tronçons ou le spot qui en dépendent |
| Météo d'un point hors découpage (aucune zone, `SPEC-METEO-02`) | Le sentier et la portion concernée (ou le spot), avec la mention « hors des zones météo couvertes » : il n'y a pas de nom de zone à afficher |
| Données marines | Le spot de pêche |
| État d'un sentier | Le sentier |

Les pluies récentes forment un cumul interne non affiché (`SPEC-METEO-05`) : leur indisponibilité se répercute sur l'estimation de la clarté (« clarté indisponible », R-10, secteur : le spot) ou sur l'évaluabilité des critères de sécurité (secteur : le sentier), sans message d'historique dédié.

Tout message d'indisponibilité affiché à l'utilisateur reprend cette nomenclature. Les termes génériques comme « ce secteur » ou « cette zone » non nommée sont proscrits.

### Portée

- Couvre l'horodatage de chaque information externe : météo, données marines, état des sentiers (REQ-104) et, par extension de l'équipe, vigilances officielles (R-19 ; voir « Ce qui n'est pas défini »).
- Couvre l'âge maximal paramétrable par type de donnée.
- Couvre le message d'indisponibilité par secteur, selon le tableau ci-dessus, et l'absence d'extrapolation.
- Couvre l'indisponibilité d'une source externe alors que l'utilisateur est connecté (R-07, REQ-103).
- Ne couvre pas l'effet d'une donnée indisponible sur le verdict ou la recommandation → `SPEC-CALC-nn`, `SPEC-PECHE-nn`, `SPEC-COMP-nn`.
- Ne couvre pas l'absence de connexion internet de l'utilisateur (mode avion, zone sans réseau) : écran d'indisponibilité général qui invite à se reconnecter (REQ-109) → `SPEC-ARCH-nn`.

### Scénarios nominaux

```gherkin
Scénario : Donnée à jour
  Étant donné un âge maximal de 6 heures pour les prévisions météo
  Et une prévision mise à jour il y a 2 heures pour une zone
  Quand elle est affichée
  Alors elle s'affiche avec sa date de mise à jour

Scénario : Donnée périmée
  Étant donné un âge maximal de 6 heures pour les prévisions météo
  Et une dernière prévision reçue il y a 9 heures pour une zone
  Quand la météo de cette zone est demandée
  Alors un message indique que les prévisions ne sont pas disponibles pour cette zone, nommée
  Et la date de la dernière mise à jour est indiquée
  Et aucune valeur n'est présentée comme prévision courante

Scénario : Source indisponible
  Étant donné la source de données marines indisponible
  Quand l'utilisateur consulte un spot de pêche
  Alors un message indique que les données marines ne sont pas disponibles pour ce spot
  Et les autres données disponibles du spot restent affichées
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Donnée exactement à l'âge maximal | Encore à jour (limite incluse) — hypothèse, voir « Ce qui n'est pas défini » |
| 2 | Une seule zone d'un itinéraire est périmée | Message pour cette zone seulement ; les autres zones restent affichées |
| 3 | Valeur manquante pour une heure dans une donnée à jour | Indiquée comme manquante pour cette heure, sans interpolation |
| 4 | Âge maximal modifié dans le paramétrage | Appliqué aux affichages suivants, sans modifier l'application |
| 5 | Source des vigilances officielles indisponible | Message explicite ; l'absence de vigilance n'est jamais présentée comme confirmée |
| 6 | Source qui ne fournit pas de date de mise à jour | La date de réception par l'application est affichée, et précisée comme telle — hypothèse de repli équipe (REQ-104, REQ-113) |
| 7 | L'utilisateur n'a pas de connexion internet | Pas de message par secteur : l'écran général d'absence de connexion s'affiche (REQ-109, `SPEC-ARCH-nn`) |
| 8 | L'utilisateur est connecté mais une source externe ne répond pas | Message par secteur selon la règle ; jamais l'écran d'absence de connexion |

### Ce qui n'est pas défini

- *24/11/2026* — Âge maximal de chaque type de donnée (paramétrable, REQ-115) : valeurs à proposer par l'équipe selon la fréquence de mise à jour des sources retenues.
- *25/11/2026* — Date de réception affichée faute de date de mise à jour fournie par la source : hypothèse de repli équipe, sous réserve de la revue des métadonnées des sources (REQ-113).
- *25/11/2026* — Horodatage et âge maximal appliqués aussi aux vigilances : extension équipe (R-19, R-07) ; REQ-104 cite météo, données marines et état des sentiers.
- *25/11/2026* — Âge maximal unique par type de donnée, quel que soit l'horizon de prévision (jour, lendemain, surlendemain) : suit R-07 et REQ-115, qui ne distinguent pas par horizon.
- *24/11/2026* — Libellés exacts des messages d'indisponibilité : à proposer par l'équipe.
- *25/11/2026* — Donnée exactement à l'âge maximal (cas limite 1) : R-07 parle de « l'âge au-delà duquel une donnée n'est plus à jour » ; la limite incluse dans la validité est une déduction de l'équipe. À valider à la recette.

### Critères d'acceptation

- [ ] AC-1 — Chaque information externe affichée porte sa date de mise à jour (`CASE-METEO-25`).
- [ ] AC-2 — Au-delà de l'âge maximal, la donnée n'est plus présentée comme courante et un message s'affiche pour la zone, le spot ou le sentier concerné (`CASE-METEO-26`).
- [ ] AC-3 — En coupant chaque source, un message explicite s'affiche et aucune valeur n'est inventée (`CASE-METEO-27`).
- [ ] AC-4 — L'indisponibilité d'une zone ou d'une source n'empêche pas l'affichage des autres (`CASE-METEO-28`).
- [ ] AC-5 — Modifier l'âge maximal dans le paramétrage change le comportement sans modifier l'application (`CASE-METEO-29`).
- [ ] AC-6 — Chaque message d'indisponibilité nomme la zone, le spot ou le sentier concerné selon la nomenclature, y compris pour un point hors découpage, sans terme générique (`CASE-METEO-30`).
- [ ] AC-7 — Une source externe en panne et une absence de connexion de l'utilisateur produisent deux affichages distincts (`CASE-METEO-31`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |
