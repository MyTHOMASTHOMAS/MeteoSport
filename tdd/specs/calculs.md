# Spécifications — Moteurs de calcul et explications

**Domaine :** `CALC`
**Source :** `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3 du 24/11/2026), `tdd/docs/cr/cr-001.md` (§5 arbitrages validés)

Pré-requis commun à toutes les spécifications du domaine : l'utilisateur est connecté avec un compte authentifié (R-16).

Principe commun : le temps de parcours, le niveau, les quantités d'eau et de nourriture, la liste d'équipement et le verdict sont calculés par des **règles fixes**, jamais par une IA (R-05, CR-001/Q21). Seule la rédaction des explications en langage courant (`SPEC-CALC-07`) peut faire appel à une IA, et seulement si elle est gratuite.

Vocabulaire : le « niveau » désigne toujours le niveau de l'utilisateur (`SPEC-CALC-02`). Le verdict prend une « valeur » : favorable, défavorable ou à risque, de la moins grave à la plus grave dans cet ordre (R-19 les appelle « niveaux »).

Domaines voisins auxquels ce domaine renvoie :

- `TRAIL` : trajet choisi, trajet conseillé, état et désactivation des sentiers (REQ-003, REQ-004, REQ-008). Le domaine `TRAIL` utilise en retour les heures estimées de passage et le verdict calculés ici.
- `METEO` : prévisions par zone à l'heure de passage, historique des pluies récentes, vigilances officielles, fraîcheur et indisponibilité des sources (REQ-007, REQ-103, REQ-104, R-03, R-07, R-10).
- `REF` : règles de sécurité de chaque sentier du panel pilote, cotations, altitudes des tronçons, points d'eau (REQ-023, REQ-032).
- `AUTH` : profil facultatif (âge, poids, taille, VMA), consentement et retrait (REQ-016, REQ-018, REQ-019, R-13, R-17).
- `ARCH` : paramètres sans modification de l'application (REQ-115) : paliers de VMA, valeurs par défaut du profil, âge maximal des données. Ce domaine introduit d'autres paramètres absents de la liste de REQ-115, à reprendre dans `ARCH` : pourcentage de VMA de l'allure, durée de la pluie récente, distance maximale d'un point d'eau au tracé, délai d'attente de l'IA.
- `ADMIN` : état d'un sentier forcé par l'administrateur, alertes (REQ-021, REQ-022, R-08).
- `GPX` : contenu du fichier `.gpx` (REQ-011).
- `COMP` : réutilise le verdict côté trail pour le score comparatif (REQ-028).

---

## SPEC-CALC-01 — Temps de parcours et heures estimées de passage

**Exigence :** REQ-005 (avec règles R-03, R-05, R-17, R-20 ; exigences REQ-107, REQ-115)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> Le temps de parcours est estimé par une règle fixe, à partir de la VMA de l'utilisateur,
> et corrigé par le dénivelé de chaque tronçon. Sans VMA, une allure par défaut s'applique et
> l'utilisateur en est averti. Le calcul donne aussi l'heure estimée de passage sur chaque
> tronçon, à partir de l'heure de départ saisie.

### Portée

- Couvre le temps estimé de chaque tronçon et du parcours entier, pour le trajet choisi comme pour le trajet conseillé.
- Couvre l'heure estimée de passage sur chaque tronçon, à l'aller et au retour.
- Couvre l'allure de randonnée comme l'allure de trail.
- Couvre l'allure par défaut et l'avertissement quand la VMA est absente (R-17).
- Ne couvre pas la saisie et le contrôle de la VMA → domaine `AUTH` (REQ-016).
- Ne couvre pas la météo prévue à l'heure de passage → domaine `METEO` (REQ-007, R-03).
- Ne couvre pas la difficulté du parcours → `SPEC-TRAIL-06`.
- Ne couvre pas le niveau déduit de la VMA → `SPEC-CALC-02`.
- Ne couvre pas le recalcul pendant la sortie → hors périmètre (R-04).

### Scénarios nominaux

```gherkin
Scénario : Temps de parcours avec VMA renseignée
  Étant donné un utilisateur dont la VMA est renseignée
  Et un trajet choisi composé de 3 tronçons
  Quand le temps de parcours est calculé
  Alors un temps estimé est donné pour chaque tronçon et pour le parcours entier
  Et le temps du parcours entier est la somme des temps des tronçons
  Et aucun avertissement de valeur par défaut n'est affiché

Scénario : Correction par le dénivelé
  Étant donné deux tronçons de même longueur
  Et que le premier est plat et que le second a 500 m de dénivelé positif
  Quand le temps de parcours est calculé pour le même utilisateur
  Alors le temps estimé du second tronçon est supérieur à celui du premier

Scénario : VMA absente
  Étant donné un utilisateur sans VMA dans son profil
  Quand le temps de parcours est calculé
  Alors l'allure déduite de la VMA par défaut paramétrée est utilisée
  Et l'utilisateur est averti que le temps de parcours n'est pas personnalisé

Scénario : Allure de randonnée et allure de trail
  Étant donné un premier utilisateur dont la VMA le place au palier de niveau le plus bas
  Et un second utilisateur dont la VMA le place au palier de niveau le plus haut
  Quand le temps de parcours d'un même trajet est calculé pour chacun
  Alors le temps du premier est calculé avec l'allure de randonnée
  Et le temps du second est calculé avec l'allure de trail

Scénario : Heures estimées de passage
  Étant donné une heure de départ à 06h00
  Et un premier tronçon estimé à 1h30 et un second tronçon estimé à 2h00
  Quand les heures de passage sont calculées
  Alors le premier tronçon est parcouru de 06h00 à 07h30
  Et le second tronçon est parcouru de 07h30 à 09h30
  Et l'heure estimée d'arrivée est 09h30

Scénario : Aller-retour
  Étant donné une sortie en aller-retour
  Quand les heures de passage sont calculées
  Alors le retour commence à l'heure estimée d'arrivée de l'aller
  Et chaque tronçon a une heure estimée de passage à l'aller et une au retour
  Et le temps du retour tient compte du dénivelé dans le sens du retour
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Tronçon en descente (dénivelé négatif) | La correction propre à la descente s'applique si la règle validée en prévoit une ; le temps estimé n'est jamais nul ni négatif. |
| 2 | VMA modifiée dans le profil | Les temps sont recalculés au prochain affichage ; pour une même VMA, le résultat est identique (`SPEC-CALC-08`). |
| 3 | Profil partiel : poids renseigné, VMA absente | L'allure par défaut s'applique ; l'avertissement nomme la VMA comme donnée remplacée. |
| 4 | Ajustement du trajet par l'utilisateur | Recalcul complet des temps et des heures de passage (`SPEC-TRAIL-02`, AC-4). |
| 5 | Tronçon sans altitude dans le référentiel | Exception à AC-1 : aucune altitude n'est supposée (principe de R-07 appliqué au référentiel interne). Le temps de ce tronçon, les heures de passage suivantes et le temps total ne sont pas estimés ; le manque est signalé, et les calculs qui en dépendent (quantités, équipement, verdict) l'indiquent aussi (hypothèse). Le référentiel doit garantir les altitudes à l'import (domaine `REF`). |
| 6 | Heure estimée d'arrivée après le coucher du soleil ou après minuit | Signalé à l'utilisateur ; traitement à fixer avec `SPEC-TRAIL-01` (« Ce qui n'est pas défini »). |

### Ce qui n'est pas défini

- *24/11/2026* — Règle de calcul et référence publique citée (`ZO-05`, validation à la recette). Hypothèse retenue : principe de l'effort équivalent (distance augmentée du dénivelé positif converti en distance, avec une correction propre à la descente si la référence retenue en prévoit une), allure égale à un pourcentage paramétrable de la VMA.
- *24/11/2026* — Valeur par défaut quand la VMA est absente : R-17 et REQ-115 parlent d'une valeur par défaut du profil, REQ-005 d'une « allure par défaut ». Hypothèse retenue : un seul paramètre, la VMA par défaut, dont découlent l'allure (`SPEC-CALC-01`) et le niveau (`SPEC-CALC-02`), pour qu'ils restent cohérents.
- *24/11/2026* — Choix entre allure de randonnée et allure de trail : déduite du niveau (`SPEC-CALC-02`), choisie par l'utilisateur, ou les deux affichées. Hypothèse retenue : déduite du niveau ; l'allure par défaut est une allure de randonnée.
- *24/11/2026* — R-17 parle de « profil » : l'âge, le poids ou la taille interviennent-ils dans le temps de parcours ? Hypothèse retenue : seule la VMA intervient.
- *24/11/2026* — Pauses et ravitaillements inclus ou non dans le temps estimé. Hypothèse retenue : non inclus, et l'affichage le précise.
- *24/11/2026* — Effet de la météo prévue (pluie, boue) sur l'allure. Hypothèse retenue : aucun effet sur le temps ; la météo agit sur le verdict (`SPEC-CALC-06`).
- *24/11/2026* — Définition de « l'heure de passage » d'un tronçon (entrée, milieu ou plage entrée–sortie). Hypothèse retenue : plage entrée–sortie, transmise au domaine `METEO`.
- *24/11/2026* — Précision d'affichage. Hypothèse retenue : arrondi aux 5 minutes à l'affichage seulement, calcul non arrondi.
- *24/11/2026* — Tronçon sans altitude (cas limite 5) : effet sur les calculs en aval. Hypothèse retenue : aucun calcul n'est fait à partir d'un temps manquant, et le manque est signalé à chaque étape.
- *24/11/2026* — Sens de « fin de la journée » (cas limite 6) : coucher du soleil ou minuit. Hypothèse retenue : une arrivée après le coucher du soleil est signalée pour la sécurité ; une arrivée après minuit sort du cadre d'une sortie à la journée (`SPEC-TRAIL-01`). L'heure du coucher du soleil vient d'une source à retenir (domaine `METEO`). Le signalement « après le coucher du soleil » est une proposition de l'équipe, hors CDC, à valider à la recette : la donnée n'est prévue ni par le CDC ni par REQ-032 (ARB-002) ; décision alignée sur `SPEC-TRAIL-01`.

### Critères d'acceptation

- [ ] AC-1 — Un temps estimé est donné pour chaque tronçon et pour le parcours ; le total est la somme des tronçons, sauf le cas d'un tronçon sans altitude (cas limite 5) (`CASE-CALC-01`).
- [ ] AC-2 — À longueur égale, un dénivelé positif augmente le temps estimé ; aucun temps n'est nul ni négatif (`CASE-CALC-02`).
- [ ] AC-3 — Sans VMA, l'allure par défaut s'applique et l'utilisateur en est averti (`CASE-CALC-03`).
- [ ] AC-4 — Les heures de passage se cumulent depuis l'heure de départ saisie, à l'aller puis au retour (`CASE-CALC-04`).
- [ ] AC-5 — La règle de calcul couvre une allure de randonnée et une allure de trail (`CASE-CALC-05`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| « Allure par défaut » (REQ-005) et « niveau par défaut » (`SPEC-CALC-02`) sont deux paramètres qui peuvent devenir incohérents ; R-17 et REQ-115 parlent d'une valeur par défaut du profil. | Acceptée | Hypothèse d'une seule VMA par défaut, dont découlent l'allure et le niveau. |
| AC-5 (allure de randonnée et de trail) n'a pas de scénario nominal. | Acceptée | Scénario « Allure de randonnée et allure de trail » ajouté. |
| Le cas limite 1 renvoie à une correction de descente que l'hypothèse de calcul ne prévoit pas. | Acceptée | Hypothèse et cas limite 1 alignés. |
| Le cas limite 5 contredit AC-1, ne dit rien des calculs en aval et applique R-07, qui vise les sources externes, au référentiel interne. | Acceptée | Cas limite 5 réécrit, AC-1 précisé, hypothèse ajoutée. |
| « Fin de la journée » est ambigu (coucher du soleil ou minuit). | Acceptée | Cas limite 6 précisé, hypothèse ajoutée. |
| R-03 (heure de passage) et REQ-115 (paramètres) ne sont pas cités. | Acceptée | Ajoutés dans l'en-tête. |

---

## SPEC-CALC-02 — Niveau de l'utilisateur par paliers de VMA

**Exigence :** REQ-010 (partiel, avec `SPEC-TRAIL-04`), REQ-115 (partiel, avec le domaine `ARCH`) (avec règles R-17, R-20)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> Le niveau de l'utilisateur se déduit de sa VMA, par paliers paramétrables. Sans VMA, un
> niveau par défaut s'applique et l'utilisateur en est averti. Le niveau n'a aucun effet sur
> la difficulté d'un sentier, qui reste sa cotation officielle.

### Portée

- Couvre la correspondance entre une VMA et un palier de niveau.
- Couvre le niveau par défaut et l'avertissement quand la VMA est absente (R-17).
- Couvre l'effet d'un changement des paliers paramétrés.
- Ne couvre pas l'usage du niveau pour suggérer une trace → `SPEC-TRAIL-04`.
- Ne couvre pas la difficulté d'un sentier → `SPEC-TRAIL-06`.
- Ne couvre pas le mécanisme de paramétrage → domaine `ARCH` (REQ-115).

### Scénarios nominaux

```gherkin
Scénario : VMA comprise dans un palier
  Étant donné des paliers paramétrés « débutant » de 0 à moins de 11 km/h, « intermédiaire » de 11 à moins de 14 km/h et « confirmé » à partir de 14 km/h
  Et un utilisateur dont la VMA est 15 km/h
  Quand son niveau est calculé
  Alors son niveau est « confirmé »

Scénario : VMA égale à une borne
  Étant donné les mêmes paliers
  Et un utilisateur dont la VMA est 14 km/h
  Quand son niveau est calculé
  Alors son niveau est « confirmé »

Scénario : VMA absente
  Étant donné un utilisateur sans VMA dans son profil
  Quand son niveau est calculé
  Alors le niveau déduit de la VMA par défaut paramétrée est utilisé
  Et l'utilisateur est averti qu'un niveau par défaut est utilisé

Scénario : Paliers modifiés par paramétrage
  Étant donné les paliers « intermédiaire » de 11 à moins de 14 km/h et « confirmé » à partir de 14 km/h
  Et un utilisateur dont la VMA est 13,5 km/h, donc de niveau « intermédiaire »
  Quand la borne basse du palier « confirmé » est paramétrée à 13 km/h
  Alors le niveau de l'utilisateur devient « confirmé » sans modification de l'application
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | VMA égale à la borne entre deux paliers | Rattachée au palier supérieur, dont elle est la borne basse (hypothèse, voir « Ce qui n'est pas défini »). |
| 2 | VMA inférieure au premier palier ou supérieure au dernier | Rattachée respectivement au premier ou au dernier palier. |
| 3 | Consentement retiré : VMA effacée | Le niveau par défaut s'applique et l'utilisateur en est averti (R-13). |
| 4 | Deux utilisateurs de même VMA | Même niveau (`SPEC-CALC-08`). |

### Ce qui n'est pas défini

- *24/11/2026* — Nombre, libellés et bornes des paliers (`ZO-05`, validation à la recette). Les valeurs des scénarios sont des exemples.
- *24/11/2026* — Borne inclusive ou exclusive. Hypothèse retenue : la borne basse d'un palier lui appartient, la borne haute appartient au palier suivant.
- *24/11/2026* — Niveau par défaut : le plus bas ou un niveau intermédiaire. Hypothèse retenue : le plus bas, par prudence. Il découle de la VMA par défaut (`SPEC-CALC-01`), paramétrée dans le premier palier.
- *24/11/2026* — Usage exact du niveau dans la suggestion de trace (filtre par distance, par durée estimée ou par cotation) : voir `SPEC-TRAIL-04`.

### Critères d'acceptation

- [ ] AC-1 — Une VMA renseignée donne le palier paramétré correspondant ; une VMA égale à une borne relève du palier dont c'est la borne basse (`CASE-CALC-06`).
- [ ] AC-2 — Sans VMA, le niveau déduit de la VMA par défaut s'applique et l'utilisateur en est averti (`CASE-CALC-07`).
- [ ] AC-3 — Une modification des paliers change le niveau calculé sans modifier l'application (`CASE-CALC-08`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Bornes contradictoires : « au-delà de 14 » (> 14), l'hypothèse « borne basse comprise » (≥ 14) et AC-1 « bornes comprises » ; le scénario « Paliers modifiés » part d'une VMA de 14 classée « intermédiaire ». | Acceptée | Paliers écrits « de … à moins de … », VMA du scénario 3 passée à 13,5 km/h, AC-1 réécrit, scénario « VMA égale à une borne » ajouté. |
| Le niveau par défaut est un paramètre séparé de l'allure par défaut. | Acceptée | Le niveau par défaut découle de la VMA par défaut (`SPEC-CALC-01`). |
| REQ-010 et REQ-115 sont citées mais rattachées à `TRAIL` et `ARCH` dans le sommaire. | Acceptée | Couverture marquée « partiel » ici et ajoutée au sommaire. |

---

## SPEC-CALC-03 — Quantités d'eau et de nourriture

**Exigence :** REQ-013 (avec règles R-03, R-05, R-07, R-09, R-13, R-17)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> Les quantités d'eau et de nourriture à emporter sont calculées par des règles fixes, à
> partir du profil (ou des valeurs par défaut signalées), de la durée estimée du parcours et
> de la météo prévue. La chaleur prévue augmente la quantité d'eau. Les points d'eau du
> parcours ne réduisent jamais la quantité d'eau à emporter.

### Portée

- Couvre le calcul de la quantité d'eau et de la quantité de nourriture pour un itinéraire.
- Couvre la correction de la quantité d'eau par la chaleur prévue aux heures de passage.
- Couvre les valeurs par défaut et l'avertissement quand le profil est incomplet (R-17).
- Couvre l'indépendance des quantités vis-à-vis des points d'eau (R-09).
- Ne couvre pas la durée estimée → `SPEC-CALC-01`.
- Ne couvre pas la liste d'équipement → `SPEC-CALC-04`.
- Ne couvre pas l'affichage des points d'eau → `SPEC-CALC-05`.
- Ne couvre pas la collecte des températures prévues → domaine `METEO`.

### Scénarios nominaux

```gherkin
Scénario : Quantités avec profil complet
  Étant donné un utilisateur dont l'âge, le poids, la taille et la VMA sont renseignés
  Et un itinéraire d'une durée estimée de 5h00
  Quand les quantités sont calculées
  Alors une quantité d'eau et une quantité de nourriture sont affichées
  Et aucun avertissement de valeur par défaut n'est affiché

Scénario : La chaleur augmente la quantité d'eau
  Étant donné le même utilisateur et le même itinéraire
  Et que la température prévue aux heures de passage relève d'une tranche de température supérieure dans le second calcul
  Quand les quantités sont calculées dans les deux cas
  Alors la quantité d'eau du second calcul est supérieure à celle du premier

Scénario : Une durée plus longue augmente les quantités
  Étant donné le même utilisateur et la même météo prévue
  Quand les quantités sont calculées pour une durée de 3h00 puis de 6h00
  Alors les quantités d'eau et de nourriture pour 6h00 sont supérieures à celles pour 3h00

Scénario : Profil incomplet
  Étant donné un utilisateur sans poids dans son profil
  Quand les quantités sont calculées
  Alors le poids par défaut paramétré est utilisé
  Et l'utilisateur est averti que les quantités ne sont pas personnalisées
  Et l'avertissement nomme le poids comme donnée remplacée

Scénario : Points d'eau sans effet sur la quantité
  Étant donné deux itinéraires de même durée et de même météo prévue
  Et que seul le second passe par des points d'eau
  Quand les quantités sont calculées
  Alors la quantité d'eau est identique pour les deux itinéraires
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Température prévue indisponible ou périmée pour une zone traversée | Aucune température n'est supposée (R-07). La quantité de base est affichée comme un minimum, avec un message indiquant que la correction de chaleur n'a pas pu être appliquée (hypothèse). |
| 2 | Aller-retour | La durée prise en compte est celle de l'aller et du retour. |
| 3 | Températures différentes selon les zones traversées | La correction est calculée tronçon par tronçon, selon la température prévue à l'heure de passage (hypothèse). |
| 4 | Consentement retiré : données de forme effacées | Les valeurs par défaut s'appliquent et l'utilisateur en est averti (R-13). |
| 5 | Arrondi des quantités | Toujours arrondies au-dessus, jamais en dessous du besoin calculé. |
| 6 | VMA absente, poids renseigné | La durée estimée repose sur la VMA par défaut (`SPEC-CALC-01`) : l'utilisateur est averti que les quantités ne sont pas personnalisées et l'avertissement nomme la VMA (hypothèse, R-17). |
| 7 | Deux températures plus ou moins élevées, mais dans la même tranche | Même quantité d'eau : une température plus élevée ne diminue jamais la quantité. |

### Ce qui n'est pas défini

- *24/11/2026* — Formules et références publiques citées (`ZO-05`, validation à la recette). Hypothèse retenue : eau en litres par heure selon des tranches de température, ajustée au poids ; nourriture en kilocalories par heure selon le poids et la durée.
- *24/11/2026* — Données du profil qui interviennent (âge, poids, taille, VMA). Hypothèse retenue : le poids directement, et la VMA au travers de la durée estimée (`SPEC-CALC-01`) ; l'âge et la taille ne servent pas.
- *24/11/2026* — Avertissement quand l'âge ou la taille manquent, alors qu'ils ne servent pas aux quantités. Hypothèse retenue : aucun avertissement sur les quantités ; l'absence est signalée au niveau du profil (domaine `AUTH`, R-17).
- *24/11/2026* — « Chaleur » : température seule ou indice de chaleur (température et humidité). Le climat de La Réunion est humide. Hypothèse retenue : température seule.
- *24/11/2026* — Unités et forme d'affichage (litres, kilocalories, équivalents en portions). Hypothèse retenue : litres arrondis au quart de litre supérieur, kilocalories arrondies à la centaine supérieure.
- *24/11/2026* — Quantités calculées pour le trajet choisi, le trajet conseillé ou le seul tracé validé. L'objectif 3 du CDC vise « un itinéraire validé ». Hypothèse retenue : pour chaque trajet affiché, ce qui couvre l'itinéraire validé ; à confirmer à la recette.

### Critères d'acceptation

- [ ] AC-1 — Pour un itinéraire, une quantité d'eau et une quantité de nourriture sont affichées (`CASE-CALC-09`).
- [ ] AC-2 — À entrées égales, une température prévue dans une tranche supérieure augmente la quantité d'eau ; une température plus élevée ne la diminue jamais (`CASE-CALC-10`).
- [ ] AC-3 — Une durée plus longue augmente les quantités (`CASE-CALC-11`).
- [ ] AC-4 — Une donnée absente du profil est remplacée par sa valeur par défaut et l'avertissement la nomme (`CASE-CALC-12`).
- [ ] AC-5 — La présence de points d'eau ne modifie jamais la quantité d'eau (`CASE-CALC-13`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Avec un calcul par tranches de température, une température plus élevée dans la même tranche ne change pas la quantité : le scénario « chaleur » et AC-2 échoueraient. | Acceptée | Scénario et AC-2 formulés par tranche ; cas limite 7 ajouté. |
| Sans VMA, la durée n'est pas personnalisée, donc les quantités non plus (R-17), mais aucun avertissement n'est prévu. | Acceptée | Cas limite 6 et hypothèse sur les données du profil ajoutés. |
| La durée est citée comme une donnée du profil. | Acceptée | Hypothèse reformulée. |
| L'objectif 3 du CDC (« itinéraire validé ») n'est pas repris dans l'hypothèse sur les trajets concernés. | Acceptée | Hypothèse complétée. |

---

## SPEC-CALC-04 — Liste d'équipement selon la météo prévue

**Exigence :** REQ-012 (avec règles R-03, R-07 ; règles fixes selon CR-001/§5.2 n° 4)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> L'application propose une liste d'équipement déduite de la météo prévue sur l'ensemble du
> parcours, aux heures estimées de passage. Elle suit une grille fixe (pluie, ensoleillement,
> température, vent), proposée par l'équipe et validée à la recette. Un équipement est proposé
> dès qu'une zone traversée remplit sa condition.

### Portée

- Couvre la correspondance entre les conditions prévues et les équipements de la grille.
- Couvre la prise en compte de toutes les zones traversées, aux heures de passage, aller et retour.
- Couvre l'indication du motif de chaque équipement proposé.
- Couvre le cas d'une prévision indisponible pour une zone (R-07).
- Ne couvre pas le contenu chiffré de la grille → validation à la recette (`ZO-06`).
- Ne couvre pas les quantités d'eau et de nourriture → `SPEC-CALC-03`.
- Ne couvre pas le verdict sur les conditions → `SPEC-CALC-06`.

### Scénarios nominaux

```gherkin
Scénario : Pluie prévue sur une zone traversée
  Étant donné un itinéraire qui traverse les zones « Z1 » et « Z2 »
  Et que de la pluie est prévue sur « Z2 » à l'heure estimée de passage
  Quand la liste d'équipement est calculée
  Alors elle contient un vêtement de pluie
  Et le motif indique la pluie prévue sur « Z2 » et l'heure de passage

Scénario : Fort ensoleillement
  Étant donné qu'un fort ensoleillement est prévu sur une zone traversée à l'heure de passage
  Quand la liste d'équipement est calculée
  Alors elle contient une casquette et des lunettes de soleil

Scénario : Température basse en altitude
  Étant donné un itinéraire vers le Piton des Neiges
  Et qu'une température sous le seuil de froid de la grille est prévue sur la zone du sommet à l'heure de passage
  Quand la liste d'équipement est calculée
  Alors elle contient une couche chaude

Scénario : Vent fort
  Étant donné qu'un vent au-dessus du seuil de la grille est prévu sur une zone traversée à l'heure de passage
  Quand la liste d'équipement est calculée
  Alors elle contient un coupe-vent
  Et le motif indique le vent prévu, la zone et l'heure de passage
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Même équipement déclenché par plusieurs zones | L'équipement apparaît une seule fois ; le motif cite toutes les zones concernées. |
| 2 | Prévision indisponible ou périmée pour une zone | La liste est calculée sur les zones disponibles ; un message nomme la zone sans prévision ; aucune condition n'est supposée (R-07). |
| 3 | Condition remplie seulement au retour | L'équipement est proposé ; le motif précise le passage concerné. |
| 4 | Aucune condition de la grille remplie | Seule la liste de base est affichée (hypothèse, voir « Ce qui n'est pas défini »). |
| 5 | Vigilance officielle majeure sur le secteur | La liste est affichée ; l'alerte prioritaire relève du verdict (`SPEC-CALC-06`). |

### Ce qui n'est pas défini

- *24/11/2026* — Contenu et seuils de la grille d'équipement (`ZO-06`, validation à la recette).
- *24/11/2026* — Liste de base toujours proposée, quelles que soient les conditions (lampe frontale, couverture de survie, trousse de secours…). Hypothèse retenue : oui, liste fixe validée à la recette.
- *24/11/2026* — Mesure de « l'ensoleillement » : indice UV, couverture nuageuse ou durée d'ensoleillement, selon les sources gratuites retenues (domaine `METEO`).
- *24/11/2026* — Liste calculée pour le trajet choisi, le trajet conseillé ou le seul tracé validé. L'objectif 3 du CDC vise « un itinéraire validé ». Hypothèse retenue : pour chaque trajet affiché, ce qui couvre l'itinéraire validé ; à confirmer à la recette.

### Critères d'acceptation

- [ ] AC-1 — Chaque condition de la grille remplie sur une zone traversée, à l'heure de passage, ajoute l'équipement correspondant avec son motif (`CASE-CALC-14`).
- [ ] AC-2 — Toutes les zones et tous les passages, aller et retour, sont pris en compte (`CASE-CALC-15`).
- [ ] AC-3 — Un équipement déclenché plusieurs fois n'apparaît qu'une fois (`CASE-CALC-16`).
- [ ] AC-4 — Une zone sans prévision est signalée et aucune condition n'est supposée (`CASE-CALC-17`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| R-05 ne cite pas l'équipement ; R-03 (météo de la zone à l'heure de passage) fonde le calcul mais n'est pas citée. | Acceptée | En-tête corrigé. |
| Le vent fait partie de la grille (REQ-012) mais aucun scénario ne le couvre. | Acceptée | Scénario « Vent fort » ajouté. |
| « Au sommet » ne correspond pas au découpage en zones (R-03). | Acceptée | Remplacé par « sur la zone du sommet ». |
| L'objectif 3 du CDC (« itinéraire validé ») n'est pas repris dans l'hypothèse sur les trajets concernés. | Acceptée | Hypothèse complétée. |

---

## SPEC-CALC-05 — Points d'eau potable, à titre indicatif

**Exigence :** REQ-014 (avec règles R-07, R-09 ; exigence REQ-104)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> L'application affiche les points d'eau potable du référentiel situés sur le parcours, à titre
> indicatif. Ils sont toujours accompagnés d'un avertissement : leur disponibilité peut varier,
> il faut emporter toute sa réserve d'eau. Ils ne modifient jamais la quantité d'eau calculée.

### Portée

- Couvre l'affichage des points d'eau situés sur le parcours, aller et retour.
- Couvre l'avertissement de la règle R-09, présent à chaque affichage.
- Couvre le cas d'un parcours sans point d'eau connu.
- Ne couvre pas l'import des points d'eau → domaine `REF` (REQ-032, voir « Ce qui n'est pas défini »).
- Ne couvre pas la quantité d'eau → `SPEC-CALC-03`.
- Ne couvre pas la présence des points d'eau dans le fichier `.gpx` → domaine `GPX`.

### Scénarios nominaux

```gherkin
Scénario : Points d'eau sur le parcours
  Étant donné un itinéraire qui passe par deux points d'eau du référentiel
  Quand l'itinéraire est affiché
  Alors les deux points d'eau sont affichés à leur position sur le parcours
  Et l'avertissement indique que leur disponibilité peut varier et qu'il faut emporter toute sa réserve d'eau

Scénario : Aucun point d'eau connu
  Étant donné un itinéraire qui ne passe par aucun point d'eau du référentiel
  Quand l'itinéraire est affiché
  Alors un message indique qu'aucun point d'eau n'est connu sur ce parcours
  Et il rappelle d'emporter toute sa réserve d'eau
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Point d'eau proche du tracé sans être dessus | Affiché s'il est à moins d'une distance maximale paramétrable du tracé (hypothèse). |
| 2 | Point d'eau situé sur un sentier fermé ou désactivé | Affiché avec l'état du sentier ; l'avertissement reste présent. |
| 3 | L'utilisateur a déjà consulté l'avertissement | L'avertissement reste affiché ; il n'est jamais masqué. |
| 4 | Source des points d'eau indisponible ou périmée | Aucun point d'eau n'est affiché ; un message le dit, avec l'avertissement de la règle R-09 ; aucune donnée n'est supposée (R-07). |

### Ce qui n'est pas défini

- *24/11/2026* — Origine des points d'eau : REQ-032 ne cite que les sentiers et les spots de pêche. Hypothèse retenue : les points d'eau sont importés dans le référentiel des sentiers (domaine `REF`) depuis une source gratuite, avec la date de mise à jour de cette source, affichée à l'utilisateur (REQ-104).
- *24/11/2026* — Distance maximale entre un point d'eau et le tracé pour qu'il soit affiché.
- *24/11/2026* — Inclusion des points d'eau dans le fichier `.gpx` (points de passage) : tranchée dans `SPEC-GPX-02`. Hypothèse retenue : les mêmes points d'eau que ceux affichés ici, chacun avec l'avertissement de la règle R-09 ; si la source est indisponible, le fichier le dit.
- *24/11/2026* — Texte exact de l'avertissement : à valider avec le modèle de CGU (`ZO-12`).

### Critères d'acceptation

- [ ] AC-1 — Les points d'eau du référentiel situés sur le parcours sont affichés à leur position, avec la date de mise à jour de leur source (`CASE-CALC-18`).
- [ ] AC-2 — Tout affichage de points d'eau, ou de leur absence, porte l'avertissement de la règle R-09 (`CASE-CALC-19`).
- [ ] AC-3 — Sans point d'eau connu, un message le dit et rappelle d'emporter toute sa réserve (`CASE-CALC-20`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| REQ-032 ne cite pas les points d'eau ; s'ils viennent d'une source externe, REQ-104 impose d'afficher leur date de mise à jour, et R-07 s'applique si la source manque. | Acceptée | Hypothèse sur l'origine, cas limite 4 et AC-1 complétés. |

---

## SPEC-CALC-06 — Verdict sur les conditions d'un itinéraire

**Exigence :** REQ-029 (avec règles R-02, R-03, R-05, R-06, R-07, R-10, R-19)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> Pour un itinéraire, l'application donne un verdict à trois valeurs : favorable, défavorable
> ou à risque. Il combine les règles de sécurité propres à chaque sentier et une grille
> générale (pluie, vent, chaleur), évaluées sur chaque zone à l'heure estimée de passage, ainsi
> que la pluie récente. L'application indique les critères qui posent problème, sans afficher
> d'historique météo. Hors panel pilote, seule la grille générale s'applique et le verdict porte
> la mention « indicatif, sentier non calibré ». En cas de vigilance officielle majeure sur le
> secteur, une alerte prioritaire s'affiche et aucune sortie n'est jugée favorable.

### Portée

- Couvre le calcul du verdict pour le trajet choisi et pour le trajet conseillé.
- Couvre la liste des critères qui posent problème, avec la zone et l'heure de passage.
- Couvre la pluie récente comme critère, sans affichage de l'historique (R-10).
- Couvre la mention « indicatif, sentier non calibré » hors panel pilote.
- Couvre l'alerte prioritaire et le plafond du verdict en cas de vigilance officielle majeure.
- Couvre le cas d'une donnée indisponible ou périmée (R-07).
- Ne couvre pas la désactivation d'un sentier et l'affichage de son état → `SPEC-TRAIL-05`.
- Ne couvre pas le contenu et les seuils des règles de chaque sentier → domaine `REF` (REQ-023).
- Ne couvre pas la collecte des prévisions, des vigilances et de l'historique des pluies → domaine `METEO`.
- Ne couvre pas l'explication en langage courant → `SPEC-CALC-07`.
- Ne couvre pas le score comparatif trail / pêche → domaine `COMP` (REQ-028).

### Scénarios nominaux

```gherkin
Scénario : Verdict favorable
  Étant donné un itinéraire du panel pilote
  Et qu'aucune règle de ses sentiers ni aucun critère de la grille générale n'est déclenché aux heures de passage
  Et qu'aucune vigilance officielle majeure ne concerne le secteur
  Quand le verdict est calculé
  Alors le verdict est « favorable »
  Et aucun critère n'est signalé comme posant problème

Scénario : Verdict défavorable par la grille générale
  Étant donné un itinéraire du panel pilote
  Et que le vent prévu sur la zone « Z2 » à 10h00 dépasse le seuil d'inconfort de la grille générale, sans atteindre son seuil de danger
  Quand le verdict est calculé
  Alors le verdict est « défavorable »
  Et le critère « vent » est signalé pour la zone « Z2 » à 10h00

Scénario : Verdict à risque par une règle du sentier
  Étant donné un itinéraire qui emprunte le sentier « S2 » du panel pilote
  Et que la règle « radier submersible » de « S2 » est déclenchée à l'heure estimée de passage
  Quand le verdict est calculé
  Alors le verdict est « à risque »
  Et la règle « radier submersible » de « S2 » est signalée comme critère posant problème

Scénario : Pluie récente sur un sentier du panel pilote
  Étant donné un itinéraire qui emprunte le sentier « S3 » du panel pilote
  Et que « S3 » a une règle « boue » fondée sur la pluie récente
  Et que le cumul des pluies récentes sur sa zone dépasse le seuil de cette règle
  Quand le verdict est calculé
  Alors le verdict est « à risque »
  Et la règle « boue » de « S3 » est signalée, avec la pluie récente pour motif
  Et aucun historique météo n'est affiché

Scénario : Pluie récente hors panel pilote
  Étant donné un itinéraire dont aucun sentier n'appartient au panel pilote
  Et que le cumul des pluies récentes sur une zone traversée dépasse le seuil de la grille générale
  Quand le verdict est calculé
  Alors le critère « pluie récente » de la grille générale est signalé
  Et aucun historique météo n'est affiché

Scénario : Itinéraire hors panel pilote
  Étant donné un itinéraire dont aucun sentier n'appartient au panel pilote
  Quand le verdict est calculé
  Alors le verdict repose sur la seule grille générale
  Et il porte la mention « indicatif, sentier non calibré »

Scénario : Vigilance officielle majeure
  Étant donné une vigilance officielle majeure en cours sur le secteur de l'itinéraire
  Et qu'aucun autre critère n'est déclenché
  Quand le verdict est calculé
  Alors une alerte prioritaire s'affiche avant le verdict
  Et le verdict est « à risque »
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Plusieurs critères de valeurs différentes | La valeur la plus grave l'emporte (favorable < défavorable < à risque) ; tous les critères déclenchés sont listés. |
| 2 | Aller-retour : critère déclenché seulement au retour | Pris en compte ; le critère précise le passage concerné (retour). |
| 3 | Prévision indisponible ou périmée pour une zone | Le critère est affiché « non évaluable ». Le verdict vaut au moins « défavorable », jamais « favorable », et porte la mention « verdict incomplet » (hypothèse, R-07). |
| 4 | Historique des pluies récentes manquant | Le critère « pluie récente » est affiché « non évaluable », sans estimation (R-07, R-10) ; même effet sur le verdict que le cas 3. |
| 5 | Vigilance officielle majeure sur un autre secteur | Aucun effet sur le verdict de l'itinéraire. |
| 6 | Itinéraire mêlant sentiers du panel pilote et sentiers hors panel | Les règles propres s'appliquent aux sentiers du panel ; la mention « indicatif, sentier non calibré » s'applique aux autres (hypothèse). |
| 7 | Trajet choisi et trajet conseillé affichés ensemble | Chacun a son propre verdict. |
| 8 | Sentier du trajet déclaré fermé (sans règle déclenchée) | Le verdict est « à risque » (hypothèse, voir « Ce qui n'est pas défini »). |
| 9 | Source des vigilances officielles indisponible ou périmée | Un message le dit pour le secteur et invite à consulter les bulletins officiels ; l'absence de vigilance n'est pas supposée. Le verdict vaut au moins « défavorable », jamais « favorable », et porte la mention « verdict incomplet » (hypothèse, R-07, R-19). |

### Ce qui n'est pas défini

- *24/11/2026* — Grille générale chiffrée : seuils de pluie, de vent et de chaleur pour chaque niveau (`ZO-17`, validation à la recette).
- *24/11/2026* — Frontière entre « défavorable » et « à risque ». Hypothèse retenue : « à risque » quand une règle de sécurité d'un sentier est déclenchée, qu'un seuil de danger de la grille est dépassé, qu'un sentier est fermé ou qu'une vigilance majeure est en cours ; « défavorable » quand seul un seuil d'inconfort de la grille est dépassé.
- *24/11/2026* — Valeur imposée par une vigilance officielle majeure : « défavorable » ou « à risque ». Hypothèse retenue : « à risque ».
- *24/11/2026* — Définition d'une « vigilance officielle majeure » (types et niveaux concernés) et du « secteur » : à fixer avec le domaine `METEO`. Hypothèse retenue : vigilances de niveau orange et rouge, et alertes cycloniques, sur les communes traversées.
- *24/11/2026* — Période prise en compte pour la « pluie récente ». Hypothèse retenue : 48 heures, paramétrable.
- *24/11/2026* — Verdict quand une donnée manque : mention « verdict incomplet » ou quatrième état « non évaluable ». Hypothèse retenue : mention, sans quatrième valeur (R-19 en fixe trois).
- *24/11/2026* — Valeur du verdict quand une donnée manque (prévision, pluies récentes, vigilances) et qu'aucun autre critère n'est déclenché. Hypothèse retenue : « défavorable » au minimum ; un autre critère plus grave l'emporte.
- *24/11/2026* — Pluie récente hors panel pilote : R-19 limite la grille générale à la pluie, au vent et à la chaleur prévus, alors que REQ-029 fait de la pluie récente un critère de tout itinéraire. Hypothèse retenue : la grille générale comprend un critère « pluie récente », avec ses propres seuils (`ZO-17`).

### Critères d'acceptation

- [ ] AC-1 — Le verdict prend l'une des trois valeurs : favorable, défavorable ou à risque ; la valeur la plus grave des critères l'emporte (`CASE-CALC-21`).
- [ ] AC-2 — Chaque critère déclenché est listé avec sa zone, son heure et son passage, aller ou retour (`CASE-CALC-22`).
- [ ] AC-3 — Les règles propres au sentier s'appliquent sur le panel pilote, en plus de la grille générale (`CASE-CALC-23`).
- [ ] AC-4 — Hors panel pilote, seule la grille générale s'applique et la mention « indicatif, sentier non calibré » est affichée (`CASE-CALC-24`).
- [ ] AC-5 — Une vigilance officielle majeure sur le secteur affiche une alerte prioritaire et empêche le verdict « favorable » (`CASE-CALC-25`).
- [ ] AC-6 — La pluie récente est un critère du verdict ; aucun historique n'est affiché (`CASE-CALC-26`).
- [ ] AC-7 — Une donnée indisponible ou périmée rend son critère « non évaluable », sans valeur inventée ; le verdict vaut alors au moins « défavorable » et porte la mention « verdict incomplet » (`CASE-CALC-27`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Avec une donnée manquante, le verdict « n'est pas favorable » sans que sa valeur soit fixée : CASE-CALC-27 n'est pas testable. | Acceptée | « Défavorable » au minimum ; cas limites 3 et 4, AC-7 et hypothèse mis à jour. |
| Le cas d'une source de vigilances indisponible n'est pas traité. | Acceptée | Cas limite 9 ajouté. |
| Hors panel pilote, la pluie récente n'est jamais évaluée, alors que REQ-029 l'exige ; le scénario « Pluie récente » signale le critère et non la règle du sentier, à l'inverse du scénario « radier ». | Acceptée | Scénario du panel pilote réécrit, scénario hors panel ajouté, hypothèse ajoutée. |
| « Seuil défavorable » ne correspond pas aux seuils d'inconfort et de danger de l'hypothèse. | Acceptée | Scénario harmonisé. |
| L'ordre des valeurs du verdict est implicite ; « niveau » désigne aussi le niveau de l'utilisateur. | Acceptée | Ordre explicité au cas limite 1 ; « valeur » utilisé pour le verdict. |
| Le scénario « Vigilance » ne reprend pas l'hypothèse « à risque ». | Acceptée | Scénario précisé. |
| R-02 (sentier fermé) et R-03 (heure de passage) ne sont pas citées. | Acceptée | Ajoutées dans l'en-tête. |

---

## SPEC-CALC-07 — Explications en langage courant

**Exigence :** REQ-009 (avec règle R-05 ; exigence REQ-102)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> L'application explique en langage courant pourquoi le trajet conseillé diffère du trajet
> choisi et pourquoi les conditions sont jugées favorables ou non. Les explications
> reformulent les résultats déjà calculés par les règles fixes : elles n'en produisent aucun.
> Elles sont rédigées par une IA seulement si elle est gratuite, sinon par des textes types.

### Portée

- Couvre l'explication de l'écart entre le trajet conseillé et le trajet choisi.
- Couvre l'explication du verdict et des critères qui posent problème.
- Couvre le choix entre une IA gratuite et des textes types, et le passage aux textes types quand l'IA n'est pas disponible.
- Couvre le contrôle que l'explication reste fidèle aux résultats calculés.
- Ne couvre pas le calcul du verdict → `SPEC-CALC-06`.
- Ne couvre pas le calcul du trajet conseillé → `SPEC-TRAIL-07`.
- Ne couvre pas le choix d'une IA gratuite → décision d'architecture (domaine `ARCH`, ADR à rédiger).
- Ne couvre pas l'explication des quantités et de l'équipement → non demandé par REQ-009.

### Scénarios nominaux

```gherkin
Scénario : Explication d'un verdict défavorable
  Étant donné un verdict « défavorable » dont le critère est le vent sur la zone « Z2 » à 10h00
  Quand l'explication est affichée
  Alors elle reprend la valeur « défavorable »
  Et elle cite le vent, la zone « Z2 » et l'heure 10h00
  Et elle ne contient aucune valeur absente des résultats calculés

Scénario : Explication du trajet conseillé
  Étant donné un trajet choisi dont le sentier « S2 » est désactivé par sa règle « radier submersible »
  Et un trajet conseillé qui évite « S2 »
  Quand l'explication est affichée
  Alors elle indique que le trajet conseillé évite « S2 »
  Et elle cite la règle « radier submersible » et l'heure de passage concernée

Scénario : Aucune IA gratuite disponible
  Étant donné qu'aucune IA gratuite n'est activée
  Quand une explication est demandée
  Alors l'explication est construite à partir des textes types
  Et elle contient les mêmes informations : valeur du verdict, critères, zones, heures, sentiers évités

Scénario : IA indisponible ou quota épuisé
  Étant donné qu'une IA gratuite est activée
  Et qu'elle ne répond pas ou que son quota gratuit est épuisé
  Quand une explication est demandée
  Alors l'explication est construite à partir des textes types
  Et l'affichage n'est ni bloqué ni retardé au-delà du délai paramétré
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Texte rédigé par l'IA qui contredit le verdict calculé (autre valeur, critère absent) | Le texte est écarté ; les textes types s'appliquent (hypothèse). |
| 2 | Texte rédigé par l'IA qui contient une valeur absente des résultats (seuil, quantité, durée) | Le texte est écarté ; les textes types s'appliquent (hypothèse). |
| 3 | Critère « non évaluable » ou verdict incomplet | L'explication dit quelle donnée manque, sans rien supposer à sa place (R-07). |
| 4 | Pas de trajet conseillé | Seul le verdict est expliqué. |
| 5 | Itinéraire hors panel pilote | L'explication reprend la mention « indicatif, sentier non calibré ». |
| 6 | Verdict favorable | L'explication indique brièvement qu'aucun critère ne pose problème. |
| 7 | Vigilance officielle majeure | L'explication mentionne la vigilance en premier. |
| 8 | Sentier évité parce qu'il est déclaré fermé, sans règle déclenchée | L'explication indique la fermeture et la date de cette information, sans citer de règle. |
| 9 | Trajet conseillé situé dans un autre secteur | L'explication indique qu'aucune variante du secteur du trajet choisi n'était disponible (`SPEC-TRAIL-07`). |

### Ce qui n'est pas défini

- *24/11/2026* — Existence d'une IA gratuite compatible avec la contrainte de 0 € et les quotas (REQ-102) : à trancher par une décision d'architecture. Hypothèse retenue : les textes types sont la base livrée ; l'IA est une option activable par paramètre.
- *24/11/2026* — Données transmises à l'IA. Hypothèse retenue : uniquement les résultats calculés (valeur du verdict, critères, zones, heures, sentiers), jamais les données du profil ni aucune donnée personnelle.
- *24/11/2026* — Méthode de contrôle de fidélité d'un texte rédigé par l'IA (cas limites 1 et 2).
- *24/11/2026* — Mention signalant un texte rédigé automatiquement. Hypothèse retenue : mention discrète « texte rédigé automatiquement ».
- *24/11/2026* — Délai maximal d'attente de l'IA avant de passer aux textes types.

### Critères d'acceptation

- [ ] AC-1 — L'explication du verdict reprend sa valeur et chaque critère posant problème, avec zone et heure (`CASE-CALC-28`).
- [ ] AC-2 — L'explication du trajet conseillé nomme les sentiers évités et le motif de leur désactivation : la règle de sécurité déclenchée ou la fermeture du sentier (`CASE-CALC-29`).
- [ ] AC-3 — Sans IA gratuite activée, ou si elle ne répond pas, les textes types s'appliquent sans bloquer l'affichage (`CASE-CALC-30`).
- [ ] AC-4 — Une explication ne contient aucun résultat ni aucune valeur qui ne vienne des règles fixes (`CASE-CALC-31`).
- [ ] AC-5 — Aucune donnée du profil n'est transmise à l'IA (`CASE-CALC-32`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| AC-2 ne parle que d'une règle, alors qu'un sentier peut être désactivé parce qu'il est fermé (R-02). | Acceptée | AC-2 élargi ; cas limite 8 ajouté. |
| L'explication d'un trajet conseillé situé dans un autre secteur n'est pas prévue. | Acceptée | Cas limite 9 ajouté. |
| « Niveau » est ambigu entre le niveau de l'utilisateur et la valeur du verdict. | Acceptée | « Valeur du verdict » utilisé partout. |

---

## SPEC-CALC-08 — Règles fixes, citées et reproductibles

**Exigence :** REQ-107, REQ-115 (avec règles R-05, R-20 ; exigence REQ-012)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> Le temps de parcours, le niveau, les quantités d'eau et de nourriture, la liste d'équipement
> et le verdict sont calculés par des règles fixes, validées par le client. Les règles du temps,
> des quantités et du verdict sont tirées de références publiques citées (R-05) ; les paliers de
> niveau et la grille d'équipement sont proposés par l'équipe et validés à la recette (R-20,
> REQ-012). Pour les mêmes entrées et les mêmes paramètres, ils donnent toujours le même
> résultat. Aucune IA n'intervient dans ces calculs.

### Portée

- Couvre la reproductibilité de chaque calcul de `SPEC-CALC-01` à `SPEC-CALC-04` et `SPEC-CALC-06`.
- Couvre la vérification par des jeux de données de référence.
- Couvre la citation de la référence publique des règles visées par R-05 (temps, quantités, verdict).
- Couvre la date de validation par le client de chaque règle du domaine.
- Couvre l'effet d'un changement de paramètre.
- Ne couvre pas le texte des explications, qui peut varier d'une rédaction à l'autre → `SPEC-CALC-07`.
- Ne couvre pas le mécanisme de paramétrage → domaine `ARCH` (REQ-115).

### Scénarios nominaux

```gherkin
Scénario : Mêmes entrées, même résultat
  Étant donné un itinéraire, une heure de départ, un profil, des prévisions et des paramètres fixés
  Quand le temps, le niveau, les quantités, l'équipement et le verdict sont calculés deux fois, à des moments différents
  Alors les deux calculs donnent des résultats identiques

Scénario : Jeu de données de référence
  Étant donné un jeu de données de référence avec ses résultats attendus, validés à la recette
  Quand chaque calcul est exécuté sur ce jeu
  Alors chaque résultat est égal au résultat attendu

Scénario : Changement de paramètre
  Étant donné un résultat calculé avec un jeu de paramètres
  Quand la VMA par défaut est modifiée par paramétrage
  Alors le temps de parcours d'un utilisateur sans VMA change en conséquence
  Et celui d'un utilisateur avec VMA reste identique

Scénario : Référence citée
  Étant donné une règle de calcul du temps, des quantités ou du verdict
  Quand on consulte sa documentation
  Alors elle cite sa référence publique et la date de sa validation par le client

Scénario : Règle validée à la recette
  Étant donné les paliers de niveau ou la grille d'équipement
  Quand on consulte leur documentation
  Alors elle indique la date de leur validation par le client à la recette
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | IA indisponible ou désactivée | Aucun calcul n'est modifié ; seule la rédaction des explications change de mode. |
| 2 | Heure courante différente entre deux calculs | Elle n'intervient que par les entrées explicites (heure de départ saisie, prévisions reçues). |
| 3 | Prévisions mises à jour entre deux calculs | Les entrées diffèrent, le résultat peut différer ; la date de la prévision utilisée est affichée (REQ-104). |
| 4 | Deux utilisateurs aux profils identiques | Mêmes résultats. |

### Ce qui n'est pas défini

- *24/11/2026* — Liste des références publiques retenues pour chaque règle (`ZO-05`, validation à la recette).
- *24/11/2026* — Lieu où sont consignées les références et les dates de validation (document de règles, ADR, référentiel). Hypothèse retenue : un document de règles de calcul dans `docs/`, cité par les CASE.
- *24/11/2026* — Tolérance d'égalité pour les résultats non entiers dans les jeux de référence. Hypothèse retenue : égalité stricte avant arrondi d'affichage.

### Critères d'acceptation

- [ ] AC-1 — Deux calculs sur les mêmes entrées et les mêmes paramètres donnent des résultats identiques (`CASE-CALC-33`).
- [ ] AC-2 — Chaque calcul donne le résultat attendu sur les jeux de données de référence (`CASE-CALC-34`).
- [ ] AC-3 — Un changement de paramètre modifie le résultat sans modifier l'application, et seulement pour les calculs qui l'utilisent (`CASE-CALC-35`).
- [ ] AC-4 — Chaque règle du temps, des quantités et du verdict cite sa référence publique ; chaque règle du domaine porte sa date de validation par le client (`CASE-CALC-36`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| AC-4 exige une référence publique pour toutes les règles ; R-05 ne l'exige que pour le temps, les quantités et la sécurité. Pour la grille d'équipement, REQ-012 demande seulement une validation à la recette. | Acceptée | Règle, portée, scénarios et AC-4 limités à R-05 ; validation à la recette pour les paliers et la grille. |
| Le scénario « Mêmes entrées » oublie le niveau, alors que la portée l'inclut. | Acceptée | Niveau ajouté. |
| Le paramètre par défaut est une VMA par défaut (`SPEC-CALC-01`). | Acceptée | Scénario « Changement de paramètre » aligné. |
