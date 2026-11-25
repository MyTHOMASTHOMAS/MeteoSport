# Spécifications — Trail : recherche, routage et trajet conseillé

**Domaine :** `TRAIL`
**Source :** `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3 du 24/11/2026), `tdd/docs/cr/cr-001.md` (§5 arbitrages validés)

Pré-requis commun à toutes les spécifications du domaine : l'utilisateur est connecté avec un compte authentifié (R-16).
R-16 s'applique à `SPEC-TRAIL-01` à `SPEC-TRAIL-07` ; il n'est pas répété dans chaque en-tête.

Domaines voisins auxquels ce domaine renvoie :

- `CALC` : temps de parcours et heures estimées de passage (REQ-005), verdict (REQ-029), explications (REQ-009).
- `METEO` : prévisions par zone, fraîcheur et indisponibilité des sources (REQ-007, REQ-103, REQ-104). La clause de REQ-002 « en aller-retour, la météo de chaque passage est affichée séparément » relève du domaine `METEO`. Elle est couverte par `SPEC-METEO-04` (`sources-meteo.md`, AC-2 : en aller-retour, chaque passage a sa propre prévision). `TRAIL` fournit les deux passages distincts (`SPEC-TRAIL-01`, AC-5).
- `REF` : référentiel des sentiers, cotations, critères de sécurité du panel pilote (REQ-023, REQ-032).
- `ADMIN` : forçage de l'état d'un sentier, création et retrait des alertes (REQ-021, REQ-022, REQ-026). L'affichage des alertes en cours sur le trajet choisi et le trajet conseillé est couvert par `SPEC-TRAIL-05` (REQ-026 partiel, R-11). L'affichage sur la page de chaque sentier (REQ-026) n'est pas couvert par `TRAIL` ; le domaine porteur de cette page reste à décider (ARB-009, ouvert).
- `ARCH` : paramétrage de l'âge maximal des données (REQ-115).
- `GPX` : validation et export du tracé retenu (REQ-011).

**Traçabilité des arbitrages :** ARB-001 à ARB-006, cités dans ce fichier, ne figurent pas dans `out/validation-specs/arbitrages.md` ; ces décisions ne sont pas tracées à ce jour (ARB-008, ouvert). ARB-007 et suivants renvoient à ce fichier.

---

## SPEC-TRAIL-01 — Saisie des critères d'une recherche départ → arrivée

**Exigence :** REQ-001, REQ-002 (avec règles R-16, R-18 ; contrainte 4)
**Statut :** revue IA faite
**Version :** v4 (24/11/2026)

### Règle

> L'utilisateur prépare une sortie trail à la journée, pour le jour même. Il saisit un point
> de départ, un point d'arrivée, une heure de départ pré-remplie avec l'heure courante, le type
> de sortie (aller simple ou aller-retour) et le dénivelé qu'il accepte.

### Portée

- Couvre la saisie et le contrôle des critères de la recherche départ → arrivée.
- Couvre le choix entre aller simple et aller-retour, et le dénivelé accepté.
- Couvre la saisie facultative d'une difficulté maximale, filtre cité par REQ-008 (hypothèse, voir « Ce qui n'est pas défini »).
- Couvre la date de la recherche, fixée au jour même.
- Couvre, en aller-retour, la distinction des deux passages (aller et retour) sur chaque sentier.
- Ne couvre pas la construction de l'itinéraire → `SPEC-TRAIL-02`.
- Ne couvre pas le second mode de recherche par distance ou niveau → `SPEC-TRAIL-04`.
- Ne couvre pas le calcul des heures estimées de passage, aller et retour → `SPEC-CALC-01`.
- Ne couvre pas l'affichage de la météo de chaque passage → domaine `METEO` (REQ-007 ; clause aller-retour de REQ-002 → `SPEC-METEO-04`).
- Ne couvre pas les sorties sur plusieurs jours, les étapes et les gîtes → hors périmètre.
- Ne couvre pas une recherche pour un autre jour que le jour même → hors périmètre.

### Scénarios nominaux

```gherkin
Scénario : Ouverture du formulaire de recherche
  Étant donné un utilisateur connecté
  Et qu'il est 07h12 le 24/11/2026
  Quand il ouvre la recherche d'itinéraire trail
  Alors l'heure de départ est pré-remplie avec 07h12
  Et la date de la sortie est le 24/11/2026, sans possibilité d'en choisir une autre

Scénario : Heure pré-remplie non modifiée
  Étant donné un utilisateur qui a ouvert le formulaire à 07h12
  Et qu'il n'a pas modifié l'heure de départ pré-remplie
  Quand il lance la recherche à 07h15
  Alors la recherche est acceptée
  Et l'heure de départ transmise est 07h15

Scénario : Recherche en aller simple
  Étant donné un utilisateur connecté sur le formulaire de recherche
  Quand il saisit le départ « La Possession », l'arrivée « Mafate »
  Et qu'il choisit « aller simple » et un dénivelé accepté de 2 500 m
  Et qu'il lance la recherche
  Alors la recherche est transmise avec ces critères et la date du jour

Scénario : Recherche en aller-retour
  Étant donné un utilisateur connecté sur le formulaire de recherche
  Quand il choisit « aller-retour » entre « La Possession » et « Mafate »
  Et qu'il lance la recherche
  Alors la recherche est transmise avec le type « aller-retour »
  Et chaque sentier emprunté figure deux fois dans l'itinéraire : un passage aller et un passage retour
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Départ ou arrivée non renseigné | La recherche n'est pas lancée ; le champ manquant est signalé. |
| 2 | Départ identique à l'arrivée en aller simple | La recherche n'est pas lancée ; un message invite à choisir l'aller-retour ou un autre point d'arrivée. |
| 3 | Heure de départ modifiée par l'utilisateur et antérieure à l'heure courante | Refusée avec un message (non prévu par REQ-001 ; à valider à la recette). L'heure pré-remplie non modifiée n'est jamais refusée : elle est remise à l'heure courante au lancement (hypothèse, voir « Ce qui n'est pas défini »). |
| 4 | Dénivelé accepté nul, négatif ou non numérique | Refusé avec un message. |
| 5 | Tentative de choisir une autre date (paramètre forcé, ancien lien) | La date est ramenée au jour même (R-18). |
| 6 | Départ ou arrivée hors de La Réunion | Refusé : seuls les points de La Réunion sont acceptés (contrainte 4). |
| 7 | Utilisateur non connecté | Aucun accès au formulaire (R-16). |
| 8 | Heure estimée d'arrivée après le coucher du soleil ou après minuit | Signalée à l'utilisateur ; la recherche n'est pas refusée (hypothèse, voir « Ce qui n'est pas défini »). Le signalement « après le coucher du soleil » est une proposition de l'équipe, hors CDC, à valider à la recette (ARB-002). |

### Ce qui n'est pas défini

- *24/11/2026* — Forme de saisie du départ et de l'arrivée (lieu nommé, point sur une carte, point d'accès du référentiel) et règle de rattachement d'un lieu comme « La Possession » à un point d'entrée sur un sentier du référentiel.
- *24/11/2026* — Heure de départ déjà passée : refus ou acceptation. Hypothèse retenue : une heure saisie par l'utilisateur et antérieure à l'heure courante est refusée, la recherche sert à préparer une sortie à venir. L'heure pré-remplie non modifiée est remise à l'heure courante au lancement, pour ne pas refuser la valeur proposée par l'application quand quelques minutes se sont écoulées.
- *24/11/2026* — Aller-retour : retour par le même tracé inversé, ou boucle possible. Hypothèse retenue : même tracé inversé.
- *24/11/2026* — Dénivelé accepté : dénivelé positif cumulé maximal, sur l'aller seul ou sur toute la sortie en aller-retour. Hypothèse retenue : dénivelé positif cumulé sur toute la sortie. Caractère obligatoire du champ : hypothèse retenue, obligatoire dans le mode départ → arrivée (REQ-002 : « l'utilisateur choisit … le dénivelé accepté ») ; facultatif dans le mode `SPEC-TRAIL-04` (REQ-010 ne le cite pas).
- *24/11/2026* — REQ-008 cite des « filtres choisis par l'utilisateur (difficulté…) » qui n'apparaissent pas dans REQ-001 et REQ-002. Hypothèse retenue : les filtres sont le type de sortie, le dénivelé accepté et une difficulté maximale facultative, exprimée dans l'échelle de cotation officielle (`SPEC-TRAIL-06`). Ces filtres s'appliquent au trajet choisi construit (`SPEC-TRAIL-02`) et au trajet conseillé (`SPEC-TRAIL-07`).
- *24/11/2026* — Sortie dont l'heure de fin estimée dépasse la journée : à signaler, refuser ou accepter. Hypothèse retenue, alignée sur `SPEC-CALC-01` (cas limite 6) : une arrivée estimée après minuit est signalée comme hors du cadre d'une sortie à la journée (REQ-002, R-18) ; une arrivée estimée après le coucher du soleil est signalée pour la sécurité — proposition de l'équipe, hors CDC, à valider à la recette : ni le CDC ni REQ-032 ne prévoient la donnée « heure du coucher du soleil » (ARB-002). Dans les deux cas, la recherche n'est pas refusée : l'utilisateur garde la main sur son trajet choisi.
- *24/11/2026* — Météo de chaque passage en aller-retour (clause de REQ-002). Elle relève du domaine `METEO` et est couverte par `SPEC-METEO-04` (AC-2), `sources-meteo.md` ayant été rétabli dans le dépôt le 25/11/2026. `TRAIL` fournit seulement les deux passages distincts (AC-5) ; aucun AC météo n'est ajouté dans `TRAIL` (doublon du domaine `METEO`).

### Critères d'acceptation

- [ ] AC-1 — À l'ouverture, l'heure de départ vaut l'heure courante et la date est celle du jour, non modifiable ; une heure pré-remplie non modifiée est remise à l'heure courante au lancement (`CASE-TRAIL-01`).
- [ ] AC-2 — L'utilisateur peut choisir aller simple ou aller-retour, saisir un dénivelé accepté et, s'il le souhaite, une difficulté maximale ; ces critères sont transmis à la recherche (`CASE-TRAIL-02`).
- [ ] AC-3 — Une date autre que celle du jour n'est jamais prise en compte (`CASE-TRAIL-03`).
- [ ] AC-4 — Une saisie incomplète ou invalide (départ, arrivée, dénivelé absent ou invalide, heure modifiée déjà passée — ce dernier refus non prévu par REQ-001, à valider à la recette) bloque la recherche avec un message (`CASE-TRAIL-04`).
- [ ] AC-5 — En aller-retour, chaque sentier emprunté figure dans l'itinéraire avec deux passages distincts, aller et retour (`CASE-TRAIL-05`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Le cas limite 3 refuse une heure passée, alors que l'heure pré-remplie devient passée dès la minute suivante : la valeur proposée par l'application serait refusée. | Acceptée | Heure pré-remplie non modifiée remise à l'heure courante au lancement ; scénario, cas limite 3, hypothèse, AC-1 et AC-4 mis à jour. |
| Le scénario aller-retour et AC-5 vérifiaient les heures de passage, qui relèvent de `SPEC-CALC-01` (doublon de son scénario « Aller-retour »), hors de la portée annoncée. | Acceptée | Scénario et AC-5 limités à la distinction des deux passages ; renvoi à `SPEC-CALC-01` ajouté dans la portée. |
| Le dépassement de la journée restait ouvert sans hypothèse, alors que `SPEC-CALC-01` renvoie à cette spec avec une hypothèse. | Acceptée | Hypothèse alignée sur `SPEC-CALC-01` ; cas limite 8 ajouté. |
| Les filtres de REQ-008 ne sont définis nulle part : AC-3 de `SPEC-TRAIL-07` n'est pas testable. | Acceptée | Hypothèse : type de sortie, dénivelé accepté, difficulté maximale facultative ; portée et AC-2 mis à jour. |
| La clause de REQ-002 sur la météo de chaque passage n'est couverte par aucune spec existante. | Acceptée | Renvoi explicite au domaine `METEO` dans la portée et dans la liste des domaines voisins. |
| La contrainte 4 est utilisée (cas limite 6) sans être citée. | Acceptée | Ajoutée dans l'en-tête. |
| Validation itération 1 (A-01) : la clause aller-retour de REQ-002 serait orpheline. | Partiellement acceptée | Elle est portée par `SPEC-METEO-04` (version versionnée de `sources-meteo.md`, absente localement : ARB-001). Renvoi précisé ; pas d'AC météo dans `TRAIL` (doublon). |
| Validation itération 1 (A-12, A-13) : refus d'une heure passée et coucher du soleil absents du CDC. | Acceptée | Marqués « à valider à la recette » ; donnée « coucher du soleil » inscrite dans ARB-002. |
| Validation itération 2 (C-01, V-01, critique) : `SPEC-METEO-04` n'existe plus dans le dépôt (`7e4094f`). | Acceptée | Renvois de l'en-tête et de la portée corrigés : clause aller-retour de REQ-002 non couverte à ce jour (ARB-001, ARB-002) ; entrée datée ajoutée ; pas d'AC météo ajouté dans `TRAIL` (rejet de A-01 maintenu). |
| Validation itération 2 (V-02) : le caractère obligatoire du dénivelé accepté était laissé ouvert alors qu'AC-4 le rendait obligatoire. | Acceptée | Hypothèse explicitée (obligatoire en départ → arrivée, facultatif en mode `SPEC-TRAIL-04`) ; AC-4 précisé. |

---

## SPEC-TRAIL-02 — Construction du trajet choisi sur sentiers officiels balisés

**Exigence :** REQ-003 (avec règles R-01, R-02)
**Statut :** revue IA faite
**Version :** v3 (24/11/2026)

### Règle

> À partir des critères saisis, l'application construit le trajet choisi en n'empruntant que
> des sentiers officiels balisés du référentiel interne. L'utilisateur peut ajuster ce trajet,
> toujours sur des sentiers du référentiel. Un sentier fermé ou désactivé n'est pas retiré du
> trajet choisi : il y reste affiché avec une alerte.

### Portée

- Couvre la construction du trajet choisi entre le départ et l'arrivée, dans la limite du dénivelé accepté et, si elle est saisie, de la difficulté maximale (hypothèse de `SPEC-TRAIL-01`, « Ce qui n'est pas défini », dérivée de REQ-008).
- Couvre l'ajustement du trajet choisi par l'utilisateur.
- Couvre le maintien d'un sentier fermé ou désactivé dans le trajet choisi, avec une alerte.
- Ne couvre pas le cas où aucun itinéraire valide n'existe → `SPEC-TRAIL-03`.
- Ne couvre pas la détermination de l'état de chaque sentier → `SPEC-TRAIL-05`.
- Ne couvre pas le trajet conseillé → `SPEC-TRAIL-07`.
- Ne couvre pas le calcul du temps de parcours et des heures de passage → domaine `CALC`.
- Ne couvre pas les sentiers absents du référentiel interne et les tracés hors sentiers → hors périmètre.

### Scénarios nominaux

```gherkin
Scénario : Construction d'un trajet choisi sur le référentiel
  Étant donné un référentiel de sentiers qui relie « La Possession » à « Mafate »
  Et une recherche en aller simple avec un dénivelé accepté de 2 500 m
  Quand l'application construit le trajet choisi
  Alors chaque tronçon du trajet appartient à un sentier officiel balisé du référentiel
  Et le dénivelé positif cumulé du trajet ne dépasse pas 2 500 m
  Et la liste des sentiers empruntés est affichée dans l'ordre du parcours

Scénario : Sentier fermé conservé dans le trajet choisi
  Étant donné un trajet choisi qui emprunte le sentier « S2 »
  Et que le sentier « S2 » est fermé
  Quand le trajet choisi est affiché
  Alors le sentier « S2 » reste dans le trajet choisi
  Et une alerte signale qu'il est fermé

Scénario : Ajustement du trajet par l'utilisateur
  Étant donné un trajet choisi affiché
  Quand l'utilisateur remplace un sentier par un autre sentier du référentiel qui relie les mêmes points
  Alors le trajet choisi est mis à jour
  Et l'état des sentiers, la difficulté et les heures de passage sont recalculés
  Et la météo, le verdict, le trajet conseillé, les quantités d'eau et de nourriture et l'équipement sont recalculés
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Ajustement qui fait passer par un tracé absent du référentiel | Refusé ; le trajet choisi reste inchangé (R-01). |
| 2 | Ajustement qui fait dépasser le dénivelé accepté | Le trajet est mis à jour et le dépassement est signalé (hypothèse, voir « Ce qui n'est pas défini »). |
| 3 | Plusieurs itinéraires possibles entre départ et arrivée | Un seul trajet choisi est proposé, selon un critère de sélection à fixer (voir « Ce qui n'est pas défini »). |
| 4 | Trajet choisi entièrement hors panel pilote | Le trajet est construit normalement ; seul le trajet conseillé est indisponible (`SPEC-TRAIL-07`). |
| 5 | Ajustement qui rend le trajet discontinu (départ et arrivée non reliés) | Refusé ; le trajet choisi reste inchangé. |
| 6 | Itinéraire le plus adapté aux critères qui passe par un sentier fermé, alors qu'un autre itinéraire entièrement ouvert existe | L'état des sentiers n'entre pas dans la construction : l'itinéraire le plus adapté aux critères est retenu, le sentier fermé y est signalé par une alerte et déclenche le trajet conseillé (hypothèse, voir « Ce qui n'est pas défini »). |

### Ce qui n'est pas défini

- *24/11/2026* — Critère de choix entre plusieurs itinéraires possibles (le plus court, le moins de dénivelé, le plus de sentiers du panel pilote…). Hypothèse retenue : le plus court en distance parmi ceux qui respectent le dénivelé accepté et la difficulté maximale.
- *24/11/2026* — Forme de l'ajustement : remplacement d'un sentier, ajout d'un point de passage, choix d'une variante proposée.
- *24/11/2026* — Ajustement qui dépasse le dénivelé accepté : refus ou simple avertissement. Hypothèse retenue : avertissement, l'utilisateur garde la main sur son trajet choisi.
- *24/11/2026* — Prise en compte de l'état des sentiers dans la construction du trajet choisi. Hypothèse retenue : non. Le trajet choisi répond aux critères de l'utilisateur ; la réponse de sécurité est le trajet conseillé, affiché à côté (CR-001/§5.2 n° 6, R-02).

### Critères d'acceptation

- [ ] AC-1 — Tout tronçon du trajet choisi appartient à un sentier du référentiel interne (`CASE-TRAIL-06`).
- [ ] AC-2 — Le trajet construit respecte le dénivelé accepté et, si elle est saisie, la difficulté maximale (`CASE-TRAIL-07`).
- [ ] AC-3 — Un sentier fermé ou désactivé reste dans le trajet choisi et porte une alerte (`CASE-TRAIL-08`).
- [ ] AC-4 — Un ajustement valide met à jour le trajet et déclenche le recalcul de l'état, de la difficulté, des heures de passage, de la météo, du verdict, du trajet conseillé, des quantités et de l'équipement (`CASE-TRAIL-09`).
- [ ] AC-5 — Un ajustement hors référentiel ou discontinu est refusé, sans modifier le trajet (`CASE-TRAIL-10`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| La spec ne dit pas si la construction évite les sentiers fermés quand un autre itinéraire existe. | Acceptée | Hypothèse ajoutée (l'état n'entre pas dans la construction) ; cas limite 6 ajouté. |
| La liste des recalculs après ajustement oublie la météo, le verdict, le trajet conseillé, les quantités et l'équipement. | Acceptée | Scénario d'ajustement et AC-4 complétés. |
| La difficulté maximale retenue comme filtre dans `SPEC-TRAIL-01` doit aussi borner la construction. | Acceptée | Portée, hypothèse de choix et AC-2 mis à jour. |

---

## SPEC-TRAIL-03 — Aucun itinéraire valide : contrainte bloquante et parcours proche

**Exigence :** REQ-003, REQ-010 (cas sans trace dans la plage de distance) (avec règle R-01 ; décision CR-001/§5.2 n° 11, ex-ZO-21, close et intégrée à REQ-003)
**Statut :** revue IA faite
**Version :** v4 (24/11/2026)

### Règle

> Quand aucun itinéraire sur les sentiers du référentiel ne satisfait les critères saisis,
> l'application ne construit pas de trajet approximatif : elle indique quelle contrainte bloque
> et propose un parcours proche réalisable.

### Portée

- Couvre l'identification de la contrainte bloquante : départ et arrivée non reliés par le référentiel, dénivelé accepté insuffisant, difficulté maximale trop basse, point hors référentiel, et, dans le mode de `SPEC-TRAIL-04`, aucune trace dans la plage de distance ou dans la plage de durée du niveau.
- Couvre la proposition d'un parcours proche réalisable, qui respecte la règle R-01.
- Couvre le cas où aucun parcours proche n'existe.
- Ne couvre pas la construction nominale → `SPEC-TRAIL-02`.
- Ne couvre pas le trajet conseillé déclenché par un sentier désactivé → `SPEC-TRAIL-07`.

### Scénarios nominaux

```gherkin
Scénario : Dénivelé accepté insuffisant
  Étant donné que le seul itinéraire du référentiel entre « A » et « B » a un dénivelé positif de 1 800 m
  Et une recherche entre « A » et « B » avec un dénivelé accepté de 1 000 m
  Quand l'application cherche un itinéraire
  Alors elle indique que le dénivelé accepté est la contrainte bloquante
  Et elle indique le dénivelé minimal nécessaire, 1 800 m
  Et elle propose un parcours proche réalisable qui respecte 1 000 m de dénivelé

Scénario : Départ et arrivée non reliés par le référentiel
  Étant donné qu'aucun enchaînement de sentiers du référentiel ne relie « A » à « C »
  Quand l'utilisateur lance une recherche entre « A » et « C »
  Alors l'application indique que les deux points ne sont pas reliés par des sentiers officiels balisés
  Et elle propose un parcours proche réalisable depuis « A »

Scénario : Aucune trace dans la plage de distance
  Étant donné que les traces du référentiel depuis « A » mesurent au plus 32 km
  Quand l'utilisateur demande une suggestion de 40 à 50 km depuis « A »
  Alors l'application indique que la distance souhaitée est la contrainte bloquante
  Et elle propose la trace de 32 km, la plus proche de la plage saisie
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Plusieurs contraintes bloquantes simultanées | Toutes les contraintes bloquantes sont indiquées. |
| 2 | Aucun parcours proche réalisable | La contrainte bloquante est indiquée ; un message dit qu'aucun parcours proche n'a été trouvé ; aucun tracé n'est affiché (cas non prévu par REQ-003 ; application de R-01 : aucun tracé hors référentiel). |
| 3 | Point de départ trop éloigné de tout sentier du référentiel | La contrainte « départ hors référentiel » est indiquée. |
| 4 | Parcours proche dont un sentier est désactivé | Le parcours proche est affiché comme un trajet choisi, avec l'alerte du sentier (`SPEC-TRAIL-02`, AC-3). Si ce sentier fait partie du panel pilote, il déclenche un trajet conseillé comme pour tout trajet choisi (`SPEC-TRAIL-07`). |

### Ce qui n'est pas défini

- *24/11/2026* — Définition d'un « parcours proche » : même départ et arrivée la plus proche, dénivelé le plus proche, ou même secteur. Hypothèse retenue : on garde le départ et on relâche d'abord l'arrivée, puis on cherche le parcours au dénivelé le plus proche sous la limite acceptée.
- *24/11/2026* — Parcours proche dans le mode de suggestion par distance (`SPEC-TRAIL-04`). Hypothèse retenue : on garde le départ et on propose, parmi les traces qui respectent le dénivelé accepté et la difficulté maximale s'ils sont saisis, la trace du référentiel dont la longueur est la plus proche de la plage saisie (sens de « réalisable », REQ-003).
- *24/11/2026* — Distance maximale entre un lieu saisi et le sentier le plus proche avant de déclarer le point hors référentiel.

### Critères d'acceptation

- [ ] AC-1 — Avec un dénivelé accepté insuffisant, l'application nomme cette contrainte, indique le dénivelé minimal nécessaire et propose un parcours proche (`CASE-TRAIL-11`).
- [ ] AC-2 — Avec un départ et une arrivée non reliés, l'application le dit et propose un parcours proche sur sentiers du référentiel (`CASE-TRAIL-12`).
- [ ] AC-3 — Sans parcours proche, seul le message est affiché, sans tracé inventé (`CASE-TRAIL-13`).
- [ ] AC-4 — Quand plusieurs contraintes bloquent, toutes sont indiquées (`CASE-TRAIL-38`).
- [ ] AC-5 — Un départ trop éloigné de tout sentier du référentiel est signalé comme « départ hors référentiel » (`CASE-TRAIL-39`).
- [ ] AC-6 — Quand la difficulté maximale saisie est trop basse pour tout itinéraire, l'application nomme cette contrainte et propose un parcours proche (`CASE-TRAIL-40`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| `SPEC-TRAIL-04` (cas limite 1) renvoie ici pour la contrainte « distance », que la portée ne couvrait pas ; l'hypothèse de parcours proche (relâcher l'arrivée) ne s'applique pas à ce mode. | Acceptée | Contrainte « distance » ajoutée à la portée, scénario et hypothèse propres au mode par distance ajoutés, REQ-010 cité dans l'en-tête. Le critère reste vérifié par `SPEC-TRAIL-04`, AC-4. |
| La difficulté maximale (`SPEC-TRAIL-01`) peut aussi être une contrainte bloquante. | Acceptée | Ajoutée à la portée. |
| Le cas limite 4 ne dit pas si un sentier désactivé du parcours proche déclenche un trajet conseillé. | Acceptée | Cas limite 4 complété. |
| Validation itération 2 (C-11) : R-07 (sources de données) cité à tort pour le refus d'un tracé inventé. | Acceptée (ajustée) | Fondement réduit à R-01 ; REQ-003 non cité, ce cas n'y étant pas prévu. |
| Validation itération 2 (C-12, V-04) : cas limites 1 et 3 et contrainte « difficulté maximale » sans AC ; contrainte « niveau » absente. | Acceptée | AC-4 (`CASE-TRAIL-38`), AC-5 (`CASE-TRAIL-39`), AC-6 (`CASE-TRAIL-40`) ajoutés ; plage de durée du niveau ajoutée à la portée. |

---

## SPEC-TRAIL-04 — Suggestion de trace par distance ou par niveau

**Exigence :** REQ-010 (avec REQ-001 pour l'heure de départ, REQ-002 pour le type de sortie, REQ-005 pour la durée estimée via `SPEC-CALC-01` ; règles R-01, R-02, R-03, R-17, R-18, R-20)
**Statut :** revue IA faite
**Version :** v5 (25/11/2026)

### Règle

> Second mode de recherche : depuis un point de départ, l'application suggère une trace sur
> sentiers officiels balisés qui correspond à une distance souhaitée (par exemple 40 à 50 km)
> ou à un niveau souhaité. La trace suggérée devient le trajet choisi et suit ensuite les mêmes
> règles que dans le mode départ → arrivée.

### Portée

- Couvre la saisie d'un point de départ, d'une heure de départ, du type de sortie (aller simple ou aller-retour) et d'une distance ou d'un niveau souhaité, pour le jour même.
- Couvre la suggestion d'une trace sur sentiers du référentiel (R-01).
- Couvre la saisie facultative du dénivelé accepté et de la difficulté maximale.
- Couvre l'usage du niveau déduit de la VMA par paliers, ou d'un niveau par défaut signalé quand la VMA est absente (niveau par défaut : `SPEC-CALC-02`, déduit de la VMA par défaut, R-17, R-20).
- Ne couvre pas la construction départ → arrivée → `SPEC-TRAIL-02`.
- Ne couvre pas l'état des sentiers et le trajet conseillé, identiques aux deux modes → `SPEC-TRAIL-05`, `SPEC-TRAIL-07`.
- Ne couvre pas la contrainte bloquante et la trace proche quand aucune trace ne convient → `SPEC-TRAIL-03`.
- Ne couvre pas le calcul des paliers de VMA → domaine `CALC` et paramétrage `ARCH` (REQ-115).

### Scénarios nominaux

```gherkin
Scénario : Suggestion par distance
  Étant donné un utilisateur connecté
  Quand il choisit le mode « suggestion par distance »
  Et qu'il saisit le départ « La Possession », l'heure de départ 07h12 et une distance de 40 à 50 km
  Et qu'il lance la recherche
  Alors l'application suggère une trace sur sentiers du référentiel
  Et la longueur de la trace est comprise entre 40 et 50 km
  Et la trace devient le trajet choisi

Scénario : Suggestion par niveau, VMA renseignée
  Étant donné un utilisateur dont la VMA le place au palier « confirmé » (palier d'exemple de `SPEC-CALC-02`)
  Quand il demande une suggestion par niveau depuis « La Possession »
  Et qu'il n'a saisi aucune difficulté maximale
  Alors l'application suggère une trace dont la durée estimée, sur toute la sortie, est comprise dans la plage de durée cible du palier « confirmé »
  Et le palier de VMA n'agit pas sur la cotation de la trace (R-20)

Scénario : Suggestion par niveau, VMA absente
  Étant donné un utilisateur sans VMA dans son profil
  Quand il demande une suggestion par niveau
  Alors l'application utilise le niveau par défaut
  Et elle l'avertit qu'une valeur par défaut est utilisée
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Aucune trace du référentiel dans la plage de distance | Comportement de `SPEC-TRAIL-03` : la contrainte « distance » est indiquée et la trace à la distance la plus proche de la plage est proposée. |
| 2 | Distance minimale supérieure à la distance maximale | Saisie refusée avec un message. |
| 3 | Distance nulle, négative ou non numérique | Saisie refusée avec un message. |
| 4 | Distance et niveau saisis ensemble | À fixer (voir « Ce qui n'est pas défini »). |
| 5 | Plusieurs traces conviennent | Une seule trace est suggérée. Par distance : celle dont la longueur est la plus proche du milieu de la plage. Par niveau : critère à fixer avec la correspondance niveau → traces (voir « Ce qui n'est pas défini »). |
| 6 | Heure de départ absente, invalide ou modifiée et déjà passée | Mêmes règles que `SPEC-TRAIL-01` (cas limite 3 et AC-1). |
| 7 | Aucune trace dont la durée estimée est dans la plage du palier | Comportement de `SPEC-TRAIL-03` : la contrainte « niveau » est indiquée et la trace dont la durée estimée est la plus proche de la plage est proposée. |

### Ce qui n'est pas défini

- *24/11/2026* — Forme de la distance : une valeur avec tolérance, ou une plage saisie par l'utilisateur. Hypothèse retenue : une plage minimum–maximum, sans tolérance paramétrable. Le « environ » de REQ-010 est couvert par la proposition de la trace la plus proche (`SPEC-TRAIL-03`) quand aucune trace n'est dans la plage.
- *24/11/2026* — Trace suggérée : aller simple vers une arrivée choisie par l'application, boucle, ou aller-retour. Hypothèse retenue : l'utilisateur choisit aussi aller simple ou aller-retour (REQ-002), ce qui rend applicable le filtre « type de sortie » du trajet conseillé (`SPEC-TRAIL-07`, AC-3) ; la distance saisie porte sur toute la sortie ; en aller-retour, le retour se fait par le même tracé inversé (`SPEC-TRAIL-01`).
- *24/11/2026* — Correspondance entre le niveau de l'utilisateur (paliers de VMA, R-20) et les traces suggérées. R-20 dit que le profil influe sur le temps de parcours, pas sur la difficulté : le niveau doit-il filtrer par cotation, par distance ou par durée estimée ? Hypothèse retenue, conforme à R-20 : le niveau (palier de VMA) borne la **durée estimée** de la trace sur toute la sortie (aller et retour en aller-retour ; calculée par `CALC`, REQ-005), jamais sa cotation, selon une correspondance paramétrable palier → **plage de durée cible [durée min ; durée max]**. Le palier n'agit jamais sur la cotation (R-20) ; seule une difficulté maximale saisie par l'utilisateur peut écarter une trace par sa cotation. Ce paramètre ne figure pas dans la liste de REQ-115 (ARB-002).
- *24/11/2026* — « Niveau souhaité » : choisi librement par l'utilisateur, ou toujours déduit de sa VMA. Hypothèse retenue : toujours déduit de la VMA (R-20), ou niveau par défaut signalé sans VMA (R-17) ; l'utilisateur ne choisit pas son niveau. Cette lecture restreint le mot « souhaité » de REQ-010 : hypothèse en attente de l'arbitrage ARB-011.
- *24/11/2026* — Combinaison distance + niveau dans une même demande.
- *24/11/2026* — Critère de choix entre plusieurs traces. Le critère de `SPEC-TRAIL-02` (le plus court) n'a pas de sens pour une plage de distance : il retiendrait toujours une trace proche du minimum. Hypothèse retenue : par distance, la trace la plus proche du milieu de la plage.
- *24/11/2026* — Critères de ce mode nécessaires aux règles communes. REQ-010 ne cite que la distance ou le niveau, mais l'état des sentiers et le trajet conseillé dépendent des heures de passage (R-02, R-03). Hypothèse retenue : l'heure de départ est saisie comme dans `SPEC-TRAIL-01` (pré-remplie avec l'heure courante) ; le dénivelé accepté et la difficulté maximale sont facultatifs dans ce mode.
- *24/11/2026* — Prise en compte de l'état des sentiers dans la suggestion. Hypothèse retenue : non, comme pour la construction du trajet choisi (`SPEC-TRAIL-02`, « Ce qui n'est pas défini ») ; une trace suggérée qui emprunte un sentier désactivé suit `SPEC-TRAIL-05` et `SPEC-TRAIL-07`.

### Critères d'acceptation

- [ ] AC-1 — Une suggestion par distance renvoie une trace sur sentiers du référentiel dont la longueur est dans la plage saisie (`CASE-TRAIL-14`).
- [ ] AC-2 — La trace suggérée par niveau a une durée estimée (`SPEC-CALC-01`), sur toute la sortie, comprise dans la plage de durée cible du palier de VMA de l'utilisateur (paramètre à valider à la recette, ARB-002) ; le palier de VMA n'agit jamais sur la cotation (R-20) ; seule une difficulté maximale saisie par l'utilisateur (`SPEC-TRAIL-01`) peut écarter une trace par sa cotation (`CASE-TRAIL-15`).
- [ ] AC-3 — Sans VMA, le niveau par défaut (`SPEC-CALC-02`, déduit de la VMA par défaut, R-17) est utilisé et l'utilisateur en est averti (`CASE-TRAIL-16`).
- [ ] AC-4 — Sans trace possible dans la plage, la contrainte est indiquée et une trace proche est proposée (`CASE-TRAIL-17`).
- [ ] AC-5 — L'heure de départ est pré-remplie, saisie et contrôlée comme dans le mode départ → arrivée, le type de sortie (aller simple ou aller-retour) est choisi par l'utilisateur, et tous deux servent au calcul des heures de passage de la trace suggérée ; le dénivelé accepté et la difficulté maximale, s'ils sont saisis, sont transmis comme filtres (`CASE-TRAIL-33`).
- [ ] AC-6 — Une plage de distance invalide (minimum supérieur au maximum, valeur nulle, négative ou non numérique) est refusée avec un message (`CASE-TRAIL-41`).
- [ ] AC-7 — Quand plusieurs traces conviennent, la trace suggérée par distance est celle dont la longueur est la plus proche du milieu de la plage (hypothèse) (`CASE-TRAIL-42`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Le cas limite 1 renvoie à `SPEC-TRAIL-03`, qui ne couvrait pas la contrainte « distance ». | Acceptée | Portée de `SPEC-TRAIL-03` complétée ; renvoi ajouté dans la portée. |
| Le cas limite 5 reprend le critère « le plus court », sans objet pour une plage de distance. | Acceptée | Critère propre au mode distance (milieu de la plage) ; critère du mode niveau laissé ouvert. |
| La portée et les scénarios supposent un niveau déduit de la VMA, alors que la question restait ouverte sans hypothèse. | Acceptée | Hypothèse ajoutée, avec réserve sur le mot « souhaité » de REQ-010. |
| Aucune heure de départ n'est saisie dans ce mode : les heures de passage, l'état des sentiers et le trajet conseillé ne peuvent pas être calculés. | Acceptée | Heure de départ ajoutée (portée, scénario, cas limite 6, hypothèse, AC-5 → `CASE-TRAIL-33`, numéro ajouté à la suite). |
| Validation itération 1 (A-16, critique) : AC-2 « tient compte du palier » n'est pas testable. | Acceptée | Hypothèse conforme à R-20 (niveau → durée cible, jamais cotation) ; scénario et AC-2 réécrits ; paramètre « durée cible par palier » inscrit dans ARB-002. |
| Validation itération 1 (A-15, A-17, V-05) : tolérance de distance, type de sortie, état des sentiers dans la suggestion. | Acceptée (A-15 sans tolérance) | Tolérance rejetée (hors REQ-115) ; type de sortie ajouté (portée, hypothèse, AC-5) ; hypothèse sur l'état des sentiers alignée sur `SPEC-TRAIL-02`. |
| Validation itération 2 (C-03, C-04, V-04) : « compatible avec la durée cible » sans oracle ; contradiction avec la difficulté maximale facultative ; cas sans trace dans la plage de durée. | Acceptée | Plage de durée cible [min ; max] sur toute la sortie (hypothèse, AC-2, scénario ; ARB-002 mis à jour) ; formulation R-20 corrigée ; cas limite 7 ajouté. |
| Validation itération 2 (C-05) : « niveau par défaut » absent du CDC. | Partiellement acceptée | Terme conservé (défini dans `SPEC-CALC-02`, déduit de la VMA par défaut, R-17) ; renvoi ajouté dans la portée et AC-3. |
| Validation itération 2 (C-06 a, C-15 a, V-06) : filtres facultatifs absents de la portée et d'AC-5 ; REQ-005 non cité ; cas limites 2, 3 et 5 sans AC. | Acceptée | Portée et AC-5 complétés ; REQ-005 ajouté à l'en-tête ; AC-6 (`CASE-TRAIL-41`) et AC-7 (`CASE-TRAIL-42`) ajoutés. |
| Validation du 25/11/2026, nouvelle session (C-3, C-14) : « niveau souhaité » restreint sans arbitrage ; origine du palier « confirmé ». | Acceptée (v5) | Hypothèse maintenue, en attente d'ARB-011 (qui porte aussi le critère de choix par niveau) ; origine du palier précisée dans le scénario. |

---

## SPEC-TRAIL-05 — État de chaque sentier emprunté

**Exigence :** REQ-004, REQ-026 (partiel : affichage sur le trajet choisi et le trajet conseillé ; avec `ADMIN`) (avec règles R-02, R-03, R-06, R-07, R-08, R-11 ; REQ-103, REQ-104)
**Statut :** revue IA faite
**Version :** v8 (25/11/2026)

### Règle

> Pour chaque sentier emprunté, l'application affiche son état (ouvert, fermé, ou désactivé par
> une règle de sécurité) et la date de cette information. Un sentier est disponible par défaut.
> Il est désactivé quand il est déclaré fermé ou quand l'une de ses règles de sécurité est
> déclenchée, à partir des données qu'elle utilise. Les données de prévision sont celles de la
> zone météo traversée, à l'heure estimée de passage (R-03). Un état forcé par
> l'administrateur remplace l'information reçue automatiquement.

Au sens de R-02, un sentier *désactivé* est un sentier affiché « fermé » ou « désactivé par une règle de sécurité » (REQ-004). Une alerte rattachée par l'administrateur (R-11) s'affiche sans désactiver le sentier : seule une fermeture (source ou forçage) ou une règle de sécurité le désactive (R-02). Une alerte R-11 est affichée si elle est en cours à l'instant de l'affichage, même si elle expire avant l'heure estimée de passage (arbitrage ARB-005, question a, 25/11/2026).

Au sens de R-08, l'« information reçue automatiquement » que remplace un forçage est l'état reçu de la source ; les règles de sécurité continuent de s'appliquer à un sentier forcé, y compris forcé « ouvert » (arbitrage ARB-004, 25/11/2026 : lecture restrictive). L'administrateur ne peut donc pas lever par un forçage une désactivation par règle de sécurité. Ordre de priorité : l'état forcé en cours remplace l'état reçu de la source ; les règles de sécurité sont ensuite évaluées sur cet état. Un état « ouvert » (reçu ou forcé) dont une règle est déclenchée est affiché « désactivé par une règle de sécurité » (cas limite 7) ; un état « fermé » (reçu ou forcé) reste affiché « fermé », la règle déclenchée étant mentionnée dans l'alerte (cas limite 6).

**Primauté d'une désactivation établie (R-02, R-08).** Une fermeture connue (état « fermé » reçu d'une source disponible et à jour, ou forçage « fermé » en cours) ou une règle de sécurité déclenchée désactive toujours le sentier, même si une autre information manque. Un forçage en cours remplace l'état d'une source indisponible ou périmée. Une règle déclenchée désactive aussi un sentier dont l'état de la source est inconnu. L'information manquante reste signalée (R-07). L'état inconnu ne s'applique qu'en l'absence de fermeture connue et de règle déclenchée. Le sort d'un dernier état « fermé » devenu périmé n'est pas tranché (ARB-012).

**Traçabilité :** les décisions ARB-003, ARB-004 et ARB-005 appliquées dans cette spec sont non tracées à ce jour (ARB-008, ouvert), y compris l'acceptation de l'enjeu de sécurité ci-dessous, dont le validateur n'est pas identifié.

Sentier à *état inconnu* (arbitrage ARB-003, 25/11/2026) : ce terme désigne, dans cette spec et dans `SPEC-TRAIL-07`, un sentier, sans fermeture connue ni règle déclenchée, dont la source d'état est indisponible ou périmée sans forçage en cours, ou dont une règle de sécurité n'est pas évaluable. Une règle est non évaluable quand une donnée qu'elle utilise manque ou est périmée (prévision, pluie récente, rattachement d'un tronçon à une zone météo), ou quand l'heure de passage qui lui est nécessaire n'est pas estimable (hypothèse, voir « Ce qui n'est pas défini »). L'état est affiché « inconnu — source indisponible » (ou la règle « non évaluable ») : c'est la forme du message R-07 / REQ-103, pas un quatrième état métier. Le message nomme le sentier et son secteur (R-07, REQ-103) et invite l'utilisateur à vérifier l'état avant de partir ; aucun état ni aucune valeur n'est inventé. Le sentier n'est pas désactivé au sens de R-02 : dans le trajet choisi, il ne déclenche pas de trajet conseillé (question a) ; il écarte tout candidat au trajet conseillé qui l'emprunte (question b, `SPEC-TRAIL-07`). L'exclusion d'un candidat à état inconnu est plus stricte que la disponibilité par défaut de R-02 : c'est un choix de prudence à valider (ARB-008). L'enjeu de sécurité de la question a est accepté : l'utilisateur peut partir sur un sentier réellement fermé sans alternative proposée ; le message d'indisponibilité est la seule protection.

### Portée

- Couvre la détermination de l'état effectif d'un sentier pour un passage donné.
- Couvre l'ordre de priorité entre état forcé par l'administrateur, état reçu de la source et règles de sécurité.
- Couvre l'affichage de l'état et de sa date, et l'alerte sur un sentier fermé ou désactivé.
- Couvre le cas d'une source d'état, ou d'une donnée utilisée par une règle, indisponible ou périmée (R-07).
- Ne couvre pas le rattachement d'un tronçon à une zone météo → domaine `METEO` (R-03, REQ-108 ; spec non rédigée, ARB-007).
- Couvre l'affichage, pour chaque sentier emprunté par le trajet choisi ou le trajet conseillé, des alertes en cours que l'administrateur y a rattachées (ex. : éboulement signalé, travaux) (REQ-026, R-11).
- Ne couvre pas la saisie du forçage par l'administrateur → domaine `ADMIN` (REQ-021).
- Ne couvre pas le contenu et les seuils des règles de sécurité de chaque sentier → domaine `REF` (REQ-023).
- Ne couvre pas la collecte des états et des prévisions → domaine `METEO`.
- Ne couvre pas le paramétrage de l'âge maximal d'une donnée → domaine `ARCH` (REQ-115).
- Ne couvre pas la création, la modification et le retrait de ces alertes → domaine `ADMIN` (REQ-022).

### Scénarios nominaux

```gherkin
Scénario : Sentier ouvert sans règle déclenchée
  Étant donné un sentier « S1 » déclaré ouvert par la source le 24/11/2026 à 06h00
  Et qu'aucune de ses règles de sécurité n'est déclenchée à l'heure estimée de passage
  Quand le trajet choisi est affiché
  Alors « S1 » est affiché « ouvert », avec la date « 24/11/2026 06h00 »

Scénario : Sentier désactivé par une règle de sécurité
  Étant donné un sentier « S2 » du panel pilote avec une règle « radier submersible »
  Et que la pluie prévue sur sa zone à l'heure estimée de passage dépasse le seuil de cette règle
  Quand le trajet choisi est affiché
  Alors « S2 » est affiché « désactivé par une règle de sécurité »
  Et l'alerte indique la règle déclenchée et l'heure de passage concernée
  Et la date affichée est celle de la prévision météo utilisée

Scénario : État forcé par l'administrateur
  Étant donné un sentier « S3 » déclaré ouvert par la source
  Et que l'administrateur a forcé « S3 » à l'état fermé jusqu'au 25/11/2026
  Quand le trajet choisi est affiché le 24/11/2026
  Alors « S3 » est affiché « fermé », avec la date du forçage

Scénario : Alerte administrateur sur un sentier emprunté
  Étant donné un sentier « S4 » déclaré ouvert par la source
  Et que l'administrateur a rattaché à « S4 » l'alerte « éboulement signalé », en cours jusqu'au 26/11/2026
  Quand le trajet choisi qui emprunte « S4 » est affiché le 24/11/2026
  Alors l'alerte « éboulement signalé » est affichée pour « S4 »
  Et « S4 » reste affiché « ouvert » et n'est pas désactivé

Scénario : Alerte administrateur sur un sentier du trajet conseillé
  Étant donné un trajet conseillé qui emprunte le sentier « S4 »
  Et une alerte en cours rattachée par l'administrateur à « S4 »
  Quand le trajet conseillé est affiché
  Alors l'alerte est affichée pour « S4 »

Scénario : Forçage « ouvert » et règle de sécurité déclenchée (arbitrage ARB-004)
  Étant donné un sentier « S2 » du panel pilote déclaré fermé par la source
  Et que l'administrateur a forcé « S2 » à l'état ouvert
  Et que la pluie prévue à l'heure estimée de passage dépasse le seuil de sa règle « radier submersible »
  Quand le trajet choisi est affiché
  Alors « S2 » est affiché « désactivé par une règle de sécurité »
  Et l'alerte nomme la règle, l'heure de passage et mentionne le forçage « ouvert » et sa date

Scénario : Forçage « fermé » et source d'état indisponible
  Étant donné un sentier « S8 » dont la source d'état est indisponible
  Et que l'administrateur a forcé « S8 » à l'état fermé, forçage en cours
  Quand le trajet choisi est affiché
  Alors « S8 » est affiché « fermé », avec la date du forçage
  Et « S8 » est désactivé

Scénario : Règle déclenchée et source d'état indisponible
  Étant donné un sentier « S9 » du panel pilote dont la source d'état est indisponible, sans forçage
  Et qu'une de ses règles de sécurité est déclenchée
  Quand le trajet choisi est affiché
  Alors « S9 » est affiché « désactivé par une règle de sécurité »
  Et un message signale que la source d'état est indisponible

Scénario : Règle déclenchée et autre règle non évaluable
  Étant donné un sentier « S10 » du panel pilote avec deux règles de sécurité
  Et que la première est déclenchée
  Et qu'une donnée utilisée par la seconde est indisponible
  Quand le trajet choisi est affiché
  Alors « S10 » est désactivé
  Et l'alerte nomme la règle déclenchée
  Et la seconde règle est affichée « non évaluable »
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Forçage arrivé à expiration | L'état reçu de la source s'applique de nouveau. |
| 1 bis | Forçage sans limite (REQ-021), puis retiré par l'administrateur | L'état reçu de la source s'applique de nouveau dès le retrait (R-08). |
| 2 | Aller-retour : règle non déclenchée à l'aller, déclenchée au retour | Le sentier est désactivé pour la sortie ; l'alerte précise le passage concerné (retour). |
| 3 | Source d'état du sentier indisponible ou périmée, sans forçage en cours ni règle déclenchée | État affiché « inconnu — source indisponible », avec un message d'indisponibilité qui invite l'utilisateur à vérifier l'état du sentier avant de partir ; aucun état inventé (R-07, REQ-103). Le sentier n'est pas désactivé : il ne déclenche pas de trajet conseillé (`SPEC-TRAIL-07`, cas limite 8) et il écarte tout candidat au trajet conseillé qui l'emprunte (`SPEC-TRAIL-07`, cas limite 3) (arbitrage ARB-003). |
| 4 | Aucune règle déclenchée ni fermeture connue, et donnée utilisée par une règle indisponible ou périmée, par exemple la prévision météo de la zone d'un sentier, y compris pour un passage estimé après la fin de l'horizon horaire de la source (par exemple une arrivée tardive, `SPEC-TRAIL-01` cas limite 8) | La règle est affichée « non évaluable », avec le même message d'indisponibilité et la même invitation à vérifier avant de partir ; aucune valeur de remplacement (R-07, REQ-103). Même traitement que le cas limite 3 (arbitrage ARB-003). |
| 5 | Sentier hors panel pilote | Pas de règle de sécurité ; état ouvert ou fermé uniquement (R-06, REQ-023, R-19). |
| 6 | Sentier fermé et règle déclenchée en même temps | L'état « fermé » est affiché, la règle déclenchée est mentionnée dans l'alerte. |
| 7 | Sentier forcé « ouvert » par l'administrateur (ex. : déclaré fermé par la source, radier réparé) dont une règle de sécurité est déclenchée | Affiché « désactivé par une règle de sécurité » : le forçage ne lève pas la désactivation. L'alerte nomme la règle déclenchée et l'heure de passage concernée, et mentionne que le sentier est forcé « ouvert » par l'administrateur, avec la date du forçage (arbitrage ARB-004 : lecture restrictive). Sans règle déclenchée, le sentier est affiché « ouvert » (le forçage remplace l'état reçu, AC-2). |
| 8 | Alerte administrateur expirée ou retirée | Elle n'est plus affichée (R-11). |
| 9 | Alerte administrateur sans limite de durée (R-11, REQ-022) | Affichée tant qu'elle n'est pas retirée par l'administrateur. |
| 10 | Alerte administrateur en cours à l'affichage, qui expire avant l'heure estimée de passage sur le sentier | Affichée (arbitrage ARB-005, question a). |
| 11 | Source d'état indisponible, et forçage « fermé » en cours ou règle de sécurité déclenchée | Le sentier est désactivé : « fermé » avec le forçage, sinon « désactivé par une règle de sécurité ». Avec la règle seule, l'indisponibilité de la source reste signalée (R-02, R-07, R-08). |
| 12 | Sentier fermé (source à jour ou forçage en cours) ou règle déclenchée, et une autre règle non évaluable | Le sentier reste désactivé ; la règle non évaluable est signalée (R-02, R-07). |
| 13 | Heure de passage non estimable (par exemple après un tronçon sans altitude, `SPEC-CALC-01` cas limite 5) | Toute règle qui a besoin de cette heure est « non évaluable » ; sans fermeture connue ni autre règle déclenchée, le sentier suit le cas limite 4 (hypothèse). |

### Ce qui n'est pas défini

- *24/11/2026* — Date affichée pour un sentier désactivé par une règle de sécurité (REQ-004, REQ-104). Hypothèse retenue : la date de la prévision météo utilisée pour évaluer la règle ; pour une règle fondée sur d'autres données (pluie récente), la date de chaque donnée utilisée.
- *25/11/2026* — Heure de passage non estimable. Hypothèse retenue, par prudence : la règle qui en a besoin est non évaluable (R-07 : aucune valeur inventée).
- *25/11/2026* — Dernier état « fermé » reçu puis périmé : affichage du dernier état daté et effet sur la désactivation (ARB-012). Dans l'attente, une source périmée sans forçage ni règle déclenchée suit le cas limite 3.
- *25/11/2026* — Absence de toute source automatique d'état (CDC §1) : vaut-elle « source indisponible », et quels sont le statut et la péremption d'une saisie manuelle ? (ARB-010)

### Critères d'acceptation

- [ ] AC-1 — Chaque sentier emprunté affiche son état et la date de l'information ; pour une désactivation par règle, la date de la prévision ou de la donnée utilisée (REQ-004, REQ-104) (`CASE-TRAIL-18`).
- [ ] AC-2 — Un état forcé par l'administrateur prime sur l'état reçu de la source tant que le forçage est en cours (durée non expirée et non retiré) ; il ne prime pas sur les règles de sécurité (AC-7) (`CASE-TRAIL-19`).
- [ ] AC-3 — Une règle de sécurité déclenchée à partir des données qu'elle utilise, pour un passage aller ou retour, désactive le sentier et produit une alerte qui la nomme, même si l'état de la source est inconnu ou si une autre règle n'est pas évaluable (R-02) (`CASE-TRAIL-20`).
- [ ] AC-4 — Une source d'état indisponible ou périmée, ou une règle de sécurité non évaluable, produit un message d'indisponibilité qui nomme le sentier et son secteur, sans état ni valeur inventés. En l'absence de fermeture connue (source à jour ou forçage en cours) et de règle déclenchée, le message invite à vérifier l'état avant de partir et le sentier n'est pas désactivé ; sinon, il reste désactivé (R-02, R-07, R-08, REQ-103 ; arbitrage ARB-003) (`CASE-TRAIL-21`).
- [ ] AC-5 — Un sentier hors panel pilote n'est jamais désactivé par une règle de sécurité (`CASE-TRAIL-22`).
- [ ] AC-6 — Toute alerte en cours à l'affichage, rattachée par l'administrateur à un sentier emprunté, s'affiche sur le trajet choisi et, le cas échéant, sur le trajet conseillé, même si elle expire avant l'heure estimée de passage (arbitrage ARB-005, question a) ; elle ne désactive pas le sentier et ne déclenche pas de trajet conseillé ; une alerte expirée ou retirée ne s'affiche plus ; une alerte sans limite reste affichée jusqu'à son retrait (REQ-026, R-11) (`CASE-TRAIL-34`).
- [ ] AC-7 — Un sentier forcé « ouvert » dont une règle de sécurité est déclenchée à l'heure estimée de passage est affiché « désactivé par une règle de sécurité » ; l'alerte nomme la règle et mentionne le forçage et sa date (arbitrage ARB-004 : lecture restrictive) (`CASE-TRAIL-35`).
- [ ] AC-8 — Toute donnée de prévision utilisée par une règle de sécurité est celle de la zone météo traversée par le tronçon, à son heure estimée de passage, aller ou retour ; si le rattachement du tronçon à une zone ou la prévision manque, la règle est non évaluable (R-03, R-07) (`CASE-TRAIL-45`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| L'hypothèse sur l'état inconnu ne dit pas s'il déclenche un trajet conseillé ; c'est un point de sécurité. | Acceptée | Hypothèse ajoutée, à confirmer à la recette ; cas limite correspondant ajouté dans `SPEC-TRAIL-07`. |
| R-03 (météo de la zone à l'heure de passage) est utilisée sans être citée. | Acceptée | Ajoutée dans l'en-tête, avec R-07 déjà utilisée. |
| L'âge maximal d'une donnée était renvoyé au domaine `METEO`, alors que son paramétrage relève de `ARCH` (REQ-115). | Acceptée | Portée corrigée. |
| Validation itération 1 (A-02, critique) : aucune spec ne garantit l'affichage des alertes administrateur sur l'itinéraire (REQ-026, R-11) ; exemple « Réserve marine » hors sujet (pêche). | Acceptée | Portée, scénario, cas limite 8 et AC-6 (`CASE-TRAIL-34`) ajoutés ; distinction alerte R-11 / désactivation R-02 posée sous la règle. |
| Validation itération 1 (V-01, critique) : un forçage « ouvert » lève-t-il une désactivation par règle ? | Hypothèse prudente maintenue | Cas limite 7 et AC-7 (`CASE-TRAIL-35`) ajoutés ; point ouvert en ARB-004. |
| Validation itération 1 (A-05, A-10, A-11, A-19, V-03, V-06) : traçabilité REQ-103/104, état inconnu, hors panel, retrait du forçage, date d'une désactivation par règle, horizon horaire. | Acceptée | En-tête, cas limites 1 bis, 4, 5, hypothèses et AC-1, AC-2, AC-4 complétés ; état inconnu renvoyé à ARB-003. |
| ARB-003 (en attente) : appliquer l'hypothèse retenue en attendant l'arbitrage — (a) un sentier à état inconnu ne déclenche pas le trajet conseillé, message et invitation à vérifier ; (b) un candidat qui en emprunte un est écarté. | Acceptée (v4) | Cas limites 3 et 4, hypothèses et AC-4 alignés sur ARB-003 ; règle non évaluable traitée comme un état inconnu ; enjeu de sécurité rappelé. |
| ARB-004 (en attente) : appliquer l'hypothèse retenue en attendant l'arbitrage — lecture restrictive : le forçage remplace l'état reçu de la source, les règles de sécurité continuent de s'appliquer ; l'alerte mentionne le forçage. | Acceptée (v5) | Lecture de R-08 et ordre de priorité posés sous la règle ; cas limite 7, hypothèse, AC-2 et AC-7 alignés sur ARB-004 ; enjeu rappelé. |
| Validation itération 2 (C-08, V-05) : alerte R-11 non montrée sur le trajet conseillé ; alerte sans limite absente ; instant d'évaluation d'une alerte non fixé. | Acceptée (v6) | Scénario « trajet conseillé » ajouté ; cas limite 9 et AC-6 complétés ; hypothèse datée (ARB-005). |
| Validation itération 2 (C-10, C-13, C-14) : pas de scénario pour le cas limite 7 ; renvoi elliptique du cas limite 4 ; puce « Couvre » mal placée. | Acceptée (v6) | Scénario « Forçage « ouvert » et règle de sécurité déclenchée » ajouté ; renvoi reformulé (conservé) ; portée réordonnée. |
| Validation itération 2 (C-15 b) : R-19 cité à tort au cas limite 5. | Rejetée | R-19 est la seule phrase du CDC qui pose qu'un sentier hors panel n'a pas de règles propres (grille générale seule) ; citation conservée. |
| Arbitrage humain du 25/11/2026 : ARB-003, ARB-004 et ARB-005 (question a) tranchés ; les hypothèses en place sont validées telles quelles. | Acceptée (v7) | Décisions posées sous la règle (état inconnu, lecture restrictive du forçage, instant d'évaluation d'une alerte) ; entrées correspondantes retirées de « Ce qui n'est pas défini » ; cas limites 3, 4 et 7, scénario « Forçage « ouvert » », AC-4 et AC-7 renvoient à la décision ; cas limite 10 ajouté et AC-6 précisé (ARB-005 a). |
| Validation du 25/11/2026, nouvelle session (A-1, critique) : l'état inconnu empêchait de désactiver un sentier fermé ou dont une règle est déclenchée. | Acceptée (v8) | Primauté d'une désactivation établie (R-02, R-08) ; définition de l'état inconnu, cas limites 3, 4, 11 et 12, trois scénarios, AC-3 et AC-4 alignés. |
| Idem (A-2, critique) : seules les règles déclenchées par la météo prévue désactivaient un sentier. | Acceptée (v8) | Règle étendue aux données utilisées par chaque règle (R-02, R-06) ; AC-1, AC-3, AC-4 et date affichée alignés. |
| Idem (C-2, critique) : aucun AC ne vérifiait la zone météo du tronçon (R-03). | Acceptée (v8) | AC-8 (`CASE-TRAIL-45`) ajouté ; rattachement renvoyé à `METEO`. |
| Idem (A-6, C-6, C-7, C-4) : heure non estimable, exclusion plus stricte que R-02, secteur, décisions non tracées. | Acceptée (v8) | Hypothèse prudente (cas limite 13) ; réserves ajoutées sous la règle ; message avec sentier et secteur. |

---

## SPEC-TRAIL-06 — Difficulté du parcours

**Exigence :** REQ-006 (avec règle R-20)
**Statut :** revue IA faite
**Version :** v4 (25/11/2026)

### Règle

> La difficulté affichée est la cotation officielle enregistrée dans le référentiel des
> sentiers. Le profil de l'utilisateur n'a aucun effet sur la difficulté : il n'influe que sur
> le temps de parcours.

### Portée

- Couvre l'affichage de la cotation officielle de chaque sentier emprunté.
- Couvre l'affichage d'une difficulté pour l'ensemble du parcours.
- Couvre l'indépendance de la difficulté vis-à-vis du profil.
- Ne couvre pas l'enregistrement des cotations → domaine `REF` (REQ-032).
- Ne couvre pas le temps de parcours → domaine `CALC` (REQ-005).

### Scénarios nominaux

```gherkin
Scénario : Difficulté d'un parcours de plusieurs sentiers
  Étant donné un trajet choisi qui emprunte « S1 » coté « moyen » et « S2 » coté « difficile »
  Quand le trajet choisi est affiché
  Alors « S1 » affiche la cotation « moyen » et « S2 » la cotation « difficile »
  Et la difficulté du parcours affichée est « difficile », avec la mention « difficulté déduite de la cotation officielle la plus élevée des sentiers empruntés »

Scénario : Difficulté indépendante du profil
  Étant donné deux utilisateurs aux VMA différentes
  Quand ils affichent le même trajet choisi
  Alors la difficulté affichée est identique pour les deux
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Sentier sans cotation dans le référentiel | Affiché « cotation non renseignée » ; aucune cotation déduite. |
| 2 | Parcours dont un seul sentier est sans cotation | La difficulté du parcours est calculée sur les sentiers cotés et le manque est signalé (hypothèse, voir « Ce qui n'est pas défini »). |
| 3 | Profil vide (valeurs par défaut) | Aucun effet sur la difficulté. |

### Ce qui n'est pas défini

- *24/11/2026* — Règle d'agrégation de la difficulté d'un parcours de plusieurs sentiers. Hypothèse retenue : la cotation la plus élevée parmi les sentiers empruntés, affichée avec la mention « difficulté déduite de la cotation officielle la plus élevée des sentiers empruntés ». REQ-032 ne prévoit de cotation que par sentier, pas par parcours : une règle d'agrégation est nécessaire pour REQ-006. À valider à la recette.
- *24/11/2026* — Échelle de cotation officielle utilisée (nombre et libellés des niveaux) : à fixer avec le domaine `REF`.
- *24/11/2026* — Difficulté d'un parcours dont un sentier n'est pas coté : calculée sur les sentiers cotés, ou non affichée. Hypothèse retenue : calculée sur les sentiers cotés, avec un signalement du manque, car la difficulté réelle peut être plus élevée que celle affichée.

### Critères d'acceptation

- [ ] AC-1 — Chaque sentier emprunté affiche sa cotation officielle et le parcours affiche une difficulté globale, égale à la cotation la plus élevée des sentiers empruntés et accompagnée de la mention « difficulté déduite » (`CASE-TRAIL-23`).
- [ ] AC-2 — La difficulté est identique quel que soit le profil (`CASE-TRAIL-24`).
- [ ] AC-3 — Une cotation absente est signalée, jamais déduite (`CASE-TRAIL-25`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Le cas limite 2 est marqué « hypothèse » sans entrée datée dans « Ce qui n'est pas défini ». | Acceptée | Entrée ajoutée, avec la limite de cette hypothèse. |
| Validation itération 1 (A-18) : primauté d'une cotation officielle de parcours. | Rejetée partiellement | REQ-032 ne prévoit pas de cotation de parcours ; agrégation par maximum conservée, mention « difficulté déduite » ajoutée. |
| Validation du 25/11/2026, nouvelle session (C-18) : l'agrégation par maximum est une hypothèse rendue obligatoire par AC-1. | Acceptée (v4) | « À valider à la recette » ajouté. |

---

## SPEC-TRAIL-07 — Trajet conseillé

**Exigence :** REQ-008 (avec règles R-01, R-02, R-03, R-04, R-06, R-07, R-19 ; REQ-103)
**Statut :** revue IA faite
**Version :** v7 (25/11/2026)

### Règle

> Quand un sentier du trajet choisi est désactivé, l'application affiche à côté un trajet
> conseillé. Ce trajet n'emprunte que des sentiers officiels balisés du panel pilote,
> disponibles à leur heure estimée de passage, et respecte les filtres choisis par
> l'utilisateur. Il peut se situer dans un autre secteur. L'adaptation se fait pendant la
> préparation seulement, en changeant de tracé, jamais en proposant un autre horaire.

Décisions d'arbitrage du 25/11/2026 (ARB-003, ARB-005 et ARB-006 : décisions non tracées à ce jour, ARB-008) :

- *Sentier à état inconnu* (au sens de `SPEC-TRAIL-05` ; ARB-003) : dans le trajet choisi, il ne déclenche pas de trajet conseillé, puisqu'il n'est pas désactivé au sens de R-02 ; le message d'indisponibilité invite à vérifier l'état avant de partir (question a). Un candidat qui l'emprunte, à l'aller ou au retour, est écarté : « disponible à l'heure estimée de passage » (AC-2) exige un état connu et toutes les règles évaluées (question b). L'enjeu de sécurité de la question a est accepté : l'utilisateur peut partir sur un sentier réellement fermé sans alternative proposée.
- *Candidat qui emprunte un sentier sous alerte R-11 en cours* (ARB-005, question b) : il est admissible, puisqu'une alerte R-11 ne désactive pas un sentier (R-02) ; l'alerte est affichée (`SPEC-TRAIL-05`, AC-6) ; à verdict égal, un candidat sans alerte est préféré.
- *Plage de distance ou de durée du mode `SPEC-TRAIL-04`* (ARB-006) : elle n'est pas un filtre du trajet conseillé ; seuls les filtres de `SPEC-TRAIL-01` s'appliquent. Un utilisateur qui demande 40 à 50 km peut recevoir un trajet conseillé nettement plus court, dans un autre secteur ; l'écart est à expliquer (REQ-009), mais `SPEC-CALC-07` ne traite pas à ce jour l'écart de distance ou de durée.

### Portée

- Couvre le déclenchement du trajet conseillé par un sentier désactivé du trajet choisi.
- Couvre les contraintes du trajet conseillé : sentiers du panel pilote, aucun sentier désactivé, filtres de l'utilisateur (`SPEC-TRAIL-01`).
- Couvre l'affichage côte à côte du trajet choisi et du trajet conseillé.
- Couvre les messages d'absence de trajet conseillé : « trajet conseillé non disponible pour ce parcours » (sentier désactivé hors panel pilote, REQ-008) et « aucun trajet conseillé disponible » (aucun candidat valide).
- Couvre l'absence de proposition d'un autre horaire de départ (R-04).
- Ne couvre pas l'explication en langage courant de l'écart entre les deux trajets → domaine `CALC` (REQ-009).
- Ne couvre pas le verdict favorable / défavorable / à risque et l'alerte de vigilance officielle → domaine `CALC` (REQ-029).
- Ne couvre pas la validation et l'export du tracé retenu → domaine `GPX` (REQ-011).
- Ne couvre pas l'adaptation pendant la sortie → hors périmètre.
- Ne couvre pas un trajet conseillé hors sentiers balisés ou hors panel pilote → hors périmètre.

### Scénarios nominaux

```gherkin
Scénario : Trajet conseillé dans le même secteur
  Étant donné un trajet choisi « La Possession → Mafate » qui emprunte le sentier « S2 »
  Et que « S2 » est désactivé par sa règle « radier submersible » à l'heure estimée de passage
  Et qu'une variante du panel pilote évite « S2 » et respecte les filtres de l'utilisateur
  Quand le trajet choisi est affiché
  Alors un trajet conseillé est affiché à côté du trajet choisi
  Et le trajet conseillé n'emprunte pas « S2 »
  Et tous ses sentiers sont disponibles à leur heure estimée de passage

Scénario : Trajet conseillé dans un autre secteur
  Étant donné un trajet choisi « La Possession → Mafate » dont un sentier est désactivé
  Et qu'aucune variante du secteur de Mafate n'est entièrement disponible
  Et que le parcours « Roche Écrite » est disponible et respecte les filtres de l'utilisateur
  Quand le trajet choisi est affiché
  Alors le trajet conseillé proposé est le parcours « Roche Écrite »

Scénario : Aucun sentier désactivé
  Étant donné un trajet choisi dont tous les sentiers sont disponibles
  Quand le trajet choisi est affiché
  Alors aucun trajet conseillé n'est affiché

Scénario : Sentier fermé par la source dans le panel pilote
  Étant donné un trajet choisi qui emprunte le sentier « S5 » du panel pilote
  Et que « S5 » est déclaré fermé par la source
  Et qu'une variante du panel pilote évite « S5 » et respecte les filtres de l'utilisateur
  Quand le trajet choisi est affiché
  Alors un trajet conseillé qui n'emprunte pas « S5 » est affiché à côté du trajet choisi

Scénario : Trajet choisi hors panel pilote
  Étant donné un trajet choisi hors panel pilote dont un sentier est fermé
  Quand le trajet choisi est affiché
  Alors un message indique que le trajet conseillé n'est pas disponible pour ce parcours

Scénario : Sentier à état inconnu dans le trajet choisi (arbitrage ARB-003, question a)
  Étant donné un trajet choisi qui emprunte le sentier « S6 » du panel pilote
  Et que la source d'état de « S6 » est indisponible
  Et qu'aucun sentier du trajet choisi n'est fermé ni désactivé par une règle de sécurité
  Quand le trajet choisi est affiché
  Alors « S6 » est affiché « inconnu — source indisponible »
  Et un message invite l'utilisateur à vérifier l'état de « S6 » avant de partir
  Et aucun trajet conseillé n'est affiché

Scénario : Candidat écarté pour un sentier à état inconnu (arbitrage ARB-003, question b)
  Étant donné un trajet choisi « La Possession → Mafate » en aller-retour qui emprunte le sentier « S2 »
  Et que « S2 » est désactivé par sa règle « radier submersible » à l'heure estimée de passage
  Et que la variante V1 du panel pilote évite « S2 » mais emprunte le sentier « S7 »
  Et que la prévision météo de la zone de « S7 » est indisponible à l'heure estimée de passage du retour
  Et qu'aucune autre variante du secteur de Mafate n'est entièrement disponible
  Et que le parcours « Roche Écrite » est disponible et respecte les filtres de l'utilisateur
  Quand le trajet choisi est affiché
  Alors la variante V1 n'est pas proposée comme trajet conseillé
  Et le trajet conseillé proposé est le parcours « Roche Écrite »
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Aucun candidat du panel pilote disponible et conforme aux filtres | Message « aucun trajet conseillé disponible » ; le trajet choisi reste affiché avec ses alertes. |
| 2 | Sentier du candidat disponible à l'aller mais désactivé au retour | Le candidat est écarté. |
| 3 | Candidat dont un sentier a un état inconnu (source indisponible) ou une règle non évaluable (prévision indisponible), à l'aller ou au retour | Le candidat est écarté (arbitrage ARB-003, question b ; `SPEC-TRAIL-05`, cas limites 3 et 4). |
| 4 | Un départ plus tôt rendrait le trajet choisi praticable | Aucun autre horaire n'est proposé (R-04). |
| 5 | L'utilisateur modifie lui-même son heure de départ | Recalcul complet ; c'est sa saisie, pas une proposition de l'application. |
| 6 | Trajet choisi partiellement dans le panel pilote | Le trajet conseillé est calculé dès qu'un sentier désactivé du trajet choisi appartient au panel pilote ; si le seul sentier désactivé est hors panel, le message « trajet conseillé non disponible » s'affiche (hypothèse, voir « Ce qui n'est pas défini »). |
| 7 | Verdict « à risque » sans aucun sentier désactivé | Aucun trajet conseillé ; le verdict relève du domaine `CALC`. |
| 8 | Trajet choisi dont un sentier a un état inconnu ou une règle non évaluable, sans aucun sentier désactivé | Aucun trajet conseillé ; le message d'indisponibilité reste affiché et invite l'utilisateur à vérifier l'état du sentier avant de partir (arbitrage ARB-003, question a ; `SPEC-TRAIL-05`, cas limites 3 et 4). |
| 9 | Vigilance officielle majeure sur le secteur (R-19) | L'alerte prioritaire s'affiche (domaine `CALC`). Le trajet conseillé n'est affiché que si un sentier du trajet choisi est désactivé, et il n'est jamais présenté comme favorable (hypothèse, voir « Ce qui n'est pas défini »). |
| 10 | Deux candidats au même verdict, dont l'un emprunte un sentier sous alerte R-11 en cours | Les deux sont admissibles ; le candidat sans alerte est proposé (arbitrage ARB-005, question b). Si seul le candidat sous alerte existe, il est proposé et l'alerte est affichée. |
| 11 | Mode `SPEC-TRAIL-04` : candidat dont la longueur ou la durée estimée sort de la plage demandée | Le candidat reste admissible : la plage n'est pas un filtre du trajet conseillé. S'il est retenu, l'écart avec la demande est à expliquer (REQ-009 ; non couvert à ce jour par `SPEC-CALC-07`) (arbitrage ARB-006). |

### Ce qui n'est pas défini

- *24/11/2026* — Critère de choix entre plusieurs trajets conseillés possibles. Hypothèse retenue : on considère d'abord les candidats qui gardent le départ et l'arrivée, sinon tous les candidats ; parmi eux, celui au meilleur verdict (calculé par `SPEC-CALC-06`, REQ-029, R-19) ; à verdict égal, un candidat sans alerte R-11 en cours (arbitrage ARB-005, question b) ; puis, y compris en vigilance officielle majeure où aucun candidat n'est favorable, le plus proche du point de départ. Hypothèse en attente de l'arbitrage ARB-013 : avec cet ordre, un candidat « à risque » qui garde le départ et l'arrivée l'emporte sur un candidat « favorable » qui ne les garde pas. Aucun AC ne vérifie la sélection par le verdict (R-19) hors départage à verdict égal (AC-10) ; il sera ajouté après la décision.
- *25/11/2026* — Verdict minimal d'un trajet conseillé : un candidat dont tous les sentiers sont disponibles mais jugé « à risque » (grille générale ou vigilance) est-il proposé avec un avertissement, ou écarté ? (ARB-013)
- *24/11/2026* — Distance maximale acceptable pour un trajet conseillé situé dans un autre secteur. Hypothèse retenue : aucun plafond de distance ; le panel pilote est limité aux 3 parcours (REQ-023) et à leurs variantes déclarées (hypothèse ci-dessous), tout parcours du panel est candidat et le départage suit l'hypothèse ci-dessus.
- *24/11/2026* — Trajet choisi mêlant sentiers du panel pilote et sentiers hors panel : le trajet conseillé est-il calculé ? Hypothèse retenue (lecture de « ailleurs » de REQ-008 = sentier désactivé hors panel) : calculé dès qu'un sentier désactivé appartient au panel pilote ; si le seul sentier désactivé est hors panel, message « trajet conseillé non disponible ». Autre lecture possible (« ailleurs » = candidats hors panel) : un sentier désactivé hors panel déclencherait un trajet conseillé pris dans le panel. À valider à la recette.
- *24/11/2026* — Filtres que respecte le trajet conseillé. Hypothèse retenue : ceux de `SPEC-TRAIL-01`, soit le type de sortie, le dénivelé accepté et la difficulté maximale s'ils sont saisis (le dénivelé est facultatif dans le mode `SPEC-TRAIL-04`).
- *24/11/2026* — Le trajet conseillé est-il ajustable par l'utilisateur comme le trajet choisi ?
- *24/11/2026* — Contenu du panel pilote. Le CDC le définit comme 3 parcours (REQ-023), pas comme un ensemble de sentiers : une « variante » dans le même secteur n'existe que si le référentiel la déclare. Hypothèse retenue : le panel pilote comprend les sentiers des 3 parcours et leurs variantes déclarées dans le référentiel, chacune déclarée avec ses critères de sécurité, proposés par l'équipe et validés à la recette comme ceux des 3 parcours (R-06, REQ-023 ; domaine `REF`).
- *24/11/2026* — Trajet conseillé pendant une vigilance officielle majeure : affiché ou non. Hypothèse retenue : affiché selon les règles habituelles, avec l'alerte prioritaire, et jamais jugé favorable (R-19).

### Critères d'acceptation

- [ ] AC-1 — Un sentier du panel pilote désactivé au sens de R-02 (affiché « fermé » ou « désactivé par une règle de sécurité », `SPEC-TRAIL-05`) dans le trajet choisi déclenche l'affichage d'un trajet conseillé à côté du trajet choisi (`CASE-TRAIL-26`).
- [ ] AC-2 — Le trajet conseillé n'emprunte que des sentiers du panel pilote disponibles à leur heure estimée de passage, aller et retour (`CASE-TRAIL-27`).
- [ ] AC-3 — Le trajet conseillé respecte les filtres de `SPEC-TRAIL-01` (type de sortie ; dénivelé accepté et difficulté maximale s'ils sont saisis), même s'il change de secteur (`CASE-TRAIL-28`).
- [ ] AC-4 — Quand le trajet choisi compte au moins un sentier désactivé au sens de R-02 et qu'aucun de ces sentiers désactivés n'appartient au panel pilote, le message « trajet conseillé non disponible pour ce parcours » s'affiche (REQ-008, cas limite 6) (`CASE-TRAIL-29`).
- [ ] AC-5 — Sans sentier désactivé, aucun trajet conseillé ni message « trajet conseillé non disponible » n'est affiché (`CASE-TRAIL-30`).
- [ ] AC-6 — Sans candidat valide, le message « aucun trajet conseillé disponible » s'affiche et aucun tracé n'est inventé (`CASE-TRAIL-31`).
- [ ] AC-7 — L'application ne propose jamais d'autre horaire de départ (`CASE-TRAIL-32`).
- [ ] AC-8 — Un sentier à état inconnu ou dont une règle n'est pas évaluable, dans un trajet choisi sans sentier désactivé, ne déclenche pas de trajet conseillé ; le message d'indisponibilité invite à vérifier l'état avant de partir (arbitrage ARB-003, question a) (`CASE-TRAIL-36`).
- [ ] AC-9 — Un candidat au trajet conseillé dont un sentier est à état inconnu ou a une règle non évaluable, à l'aller ou au retour, est écarté (arbitrage ARB-003, question b) (`CASE-TRAIL-37`).
- [ ] AC-10 — Un candidat qui emprunte un sentier sous alerte R-11 en cours est admissible et l'alerte est affichée ; à verdict égal, un candidat sans alerte lui est préféré (arbitrage ARB-005, question b) (`CASE-TRAIL-43`).
- [ ] AC-11 — En mode `SPEC-TRAIL-04`, la plage de distance ou de durée demandée n'écarte aucun candidat au trajet conseillé ; seuls les filtres de `SPEC-TRAIL-01` s'appliquent (arbitrage ARB-006) (`CASE-TRAIL-44`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| L'hypothèse de choix « sinon meilleur verdict, sinon le plus proche » rend le troisième critère inapplicable : dès qu'un candidat existe, l'un a le meilleur verdict. | Acceptée | Réécrite : le plus proche départage à verdict égal. |
| AC-3 n'est pas testable tant que les filtres ne sont pas définis. | Acceptée | Hypothèse des filtres reprise de `SPEC-TRAIL-01` ; AC-3 précisé. |
| Le panel pilote est défini comme 3 parcours : la « variante du panel pilote » du scénario 1 suppose des variantes déclarées dans le référentiel. | Acceptée | Hypothèse ajoutée, à porter dans le domaine `REF`. |
| Aucun cas ne traite l'état inconnu sans sentier désactivé, ni la vigilance officielle majeure (R-19). | Acceptée | Cas limites 8 et 9 ajoutés ; R-19 citée dans l'en-tête ; hypothèse sur la vigilance ajoutée. |
| Validation itération 1 (A-06, A-09, A-20, A-21, V-04) : R-03/R-07 non cités, sens de « désactivé », trajet mixte, distance d'un autre secteur, départage par verdict. | Acceptée | En-tête complété ; AC-1 et AC-4 précisés ; scénario « sentier fermé par la source » ajouté ; cas limite 6 et hypothèses datées (à valider à la recette) ; renvoi à `SPEC-CALC-06`. |
| ARB-003 (en attente) : appliquer l'hypothèse retenue en attendant l'arbitrage, et rendre testables les cas limites 3 et 8, qui n'avaient pas de critère d'acceptation. | Acceptée (v4) | Cas limites 3 et 8 étendus à la règle non évaluable ; hypothèse datée ajoutée ; scénarios « Sentier à état inconnu dans le trajet choisi » et « Candidat écarté pour un sentier à état inconnu » ajoutés ; AC-8 (`CASE-TRAIL-36`) et AC-9 (`CASE-TRAIL-37`) ajoutés, numéros à la suite ; REQ-103 cité dans l'en-tête. |
| Validation itération 2 (C-02, critique) : AC-4 était vrai sans aucun sentier désactivé et contredisait AC-5. | Acceptée (v5) | AC-4 restreint au cas « au moins un sentier désactivé, aucun dans le panel » ; AC-5 complété. |
| Validation itération 2 (C-06 b-c, C-07, V-03, V-07) : filtres facultatifs, distance du mode 04, aller-retour du scénario « Candidat écarté », deux messages d'absence confondus, candidat portant une alerte R-11. | Acceptée (v5) | AC-3 et hypothèse des filtres précisés ; hypothèses datées (ARB-005, ARB-006) ; scénario déclaré en aller-retour ; portée et AC-6 distinguent les deux messages. |
| Arbitrage humain du 25/11/2026 : ARB-003, ARB-005 (question b) et ARB-006 tranchés ; les hypothèses en place sont validées telles quelles. | Acceptée (v6) | Décisions posées sous la règle ; entrées correspondantes retirées de « Ce qui n'est pas défini » ; critère de choix complété (verdict, puis absence d'alerte R-11, puis proximité) ; cas limites 3 et 8, scénarios « état inconnu », AC-8 et AC-9 renvoient à la décision ; cas limites 10 et 11, AC-10 (`CASE-TRAIL-43`) et AC-11 (`CASE-TRAIL-44`) ajoutés, numéros à la suite. |
| Validation du 25/11/2026, nouvelle session (C-20, A-4) : ordre de départage et verdict minimal non bornés ; sélection par verdict non testée. | En attente (v7) | Soumis à ARB-013 ; aucun AC ajouté avant la décision. |
| Idem (A-7, C-21, A-8, C-4) : explication promise absente de `SPEC-CALC-07`, validation des critères des variantes, définition du panel, décisions non tracées. | Acceptée (v7) | Promesse reformulée (à reprendre à l'audit de `calculs.md`) ; critères des variantes à valider ; définition du panel alignée ; réserve ARB-008 ajoutée. |
