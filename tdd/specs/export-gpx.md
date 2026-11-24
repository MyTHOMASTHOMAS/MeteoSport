# Spécifications — Export GPX

**Domaine :** `GPX`
**Source :** `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3 du 24/11/2026), `tdd/docs/cr/cr-001.md` (Q19, Q27 ; §5.3 arbitrage `AMB-08`)

Pré-requis commun à toutes les spécifications du domaine : l'utilisateur est connecté avec un compte authentifié (R-16) et un itinéraire est affiché (trajet choisi et, le cas échéant, trajet conseillé).

Principe commun : sur le terrain, en zone sans réseau, le fichier `.gpx` est le seul support disponible (contrainte 6, CR-001/Q27). L'application ne fait que produire ce fichier à télécharger : aucune synchronisation directe avec une montre ou un GPS (CR-001/Q19).

Domaines voisins auxquels ce domaine renvoie :

- `TRAIL` : trajet choisi, trajet conseillé, ajustement, parcours proche, aller-retour (REQ-003, REQ-008, REQ-010 ; `SPEC-TRAIL-02`, `SPEC-TRAIL-03`, `SPEC-TRAIL-04`, `SPEC-TRAIL-07`).
- `REF` : géométrie des sentiers et altitudes ; points d'eau importés dans le référentiel des sentiers (hypothèse de `SPEC-CALC-05` : REQ-032 ne cite ni les points d'eau ni les altitudes).
- `CALC` : points d'eau et avertissement de la règle R-09 (`SPEC-CALC-05`), verdict (`SPEC-CALC-06`), tronçon sans altitude (`SPEC-CALC-01`).
- `ARCH` : fonctionnement uniquement connecté (REQ-109), paramètres (REQ-115). Ce domaine introduit des paramètres absents de la liste de REQ-115, à reprendre dans `ARCH` : nombre maximal de points d'une trace, tolérance d'écart de la simplification, tolérance de distance (`SPEC-GPX-03`).
- `AUTH` : cloisonnement des données (REQ-105), export RGPD distinct de l'export GPX (REQ-019).

---

## SPEC-GPX-01 — Validation du tracé retenu

**Exigence :** REQ-011 (avec règles R-01, R-02, R-04, R-16, R-19 ; arbitrage `AMB-08`, CR-001/§5.3)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> L'utilisateur valide un seul tracé parmi ceux affichés : le trajet choisi ou, s'il est
> affiché, le trajet conseillé. Seul un tracé validé peut être téléchargé. Toute modification
> du trajet choisi, du trajet conseillé ou des critères de la recherche après validation annule
> cette validation, quel que soit le tracé validé.

### Portée

- Couvre le choix du tracé à valider entre le trajet choisi et le trajet conseillé.
- Couvre la validation d'un trajet choisi qui contient un sentier fermé ou désactivé.
- Couvre la validation d'un tracé, trajet choisi ou trajet conseillé, dont le verdict n'est pas favorable ou dont le secteur est sous vigilance officielle majeure.
- Couvre la relecture de l'état des sentiers et du verdict au moment de la validation.
- Couvre la validation d'un parcours proche proposé faute d'itinéraire valide (`SPEC-TRAIL-03`).
- Couvre l'annulation de la validation quand un tracé ou les critères changent.
- Ne couvre pas la construction du trajet choisi et la suggestion de trace → `SPEC-TRAIL-02`, `SPEC-TRAIL-04`.
- Ne couvre pas le calcul du trajet conseillé → `SPEC-TRAIL-07`.
- Ne couvre pas la production du fichier → `SPEC-GPX-02`.
- Ne couvre pas un historique des tracés validés ni leur reprise sur un autre appareil → non demandé (seuls le profil et le classement des sports suivent l'utilisateur, CR-001/§5.2 n° 17).

### Scénarios nominaux

```gherkin
Scénario : Validation du trajet choisi
  Étant donné un trajet choisi « La Possession → Mafate » affiché, sans trajet conseillé
  Quand l'utilisateur valide le trajet choisi
  Alors le trajet choisi devient le tracé validé
  Et le téléchargement du fichier .gpx devient possible

Scénario : Validation du trajet conseillé
  Étant donné un trajet choisi dont le sentier « S2 » est désactivé
  Et un trajet conseillé affiché à côté
  Quand l'utilisateur valide le trajet conseillé
  Alors le trajet conseillé devient le tracé validé
  Et le fichier .gpx téléchargé correspond au trajet conseillé

Scénario : Validation d'un trajet choisi qui contient un sentier désactivé
  Étant donné un trajet choisi dont le sentier « S2 » est désactivé par sa règle « radier submersible »
  Et un trajet conseillé affiché à côté
  Quand l'utilisateur valide le trajet choisi
  Alors l'application lui rappelle l'alerte de « S2 » et le verdict du trajet choisi
  Et elle lui demande de confirmer son choix
  Quand il confirme
  Alors le trajet choisi devient le tracé validé

Scénario : Modification après validation
  Étant donné un tracé validé
  Quand l'utilisateur ajuste le trajet choisi
  Alors la validation est annulée
  Et le téléchargement n'est plus possible tant qu'un tracé n'est pas de nouveau validé
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Téléchargement demandé sans tracé validé | Aucun fichier ; un message invite à valider un tracé. |
| 2 | L'utilisateur valide le trajet choisi, puis le trajet conseillé | Un seul tracé validé à la fois : le dernier validé remplace le précédent. |
| 3 | Aucun itinéraire valide, parcours proche proposé (`SPEC-TRAIL-03`) | Le parcours proche se valide comme un trajet choisi. |
| 4 | Aucun itinéraire valide et aucun parcours proche | Aucun tracé affiché, donc aucune validation possible. |
| 5 | Sortie en aller-retour | La validation porte sur la sortie entière, aller et retour. |
| 6 | Changement de l'heure de départ ou d'un autre critère après validation | La validation est annulée ; les calculs sont refaits (`SPEC-TRAIL-07`, cas limite 5). |
| 7 | État d'un sentier du tracé modifié entre l'affichage et la validation (forçage par l'administrateur, nouvelle donnée) | L'état et le verdict sont relus au moment de la validation. Trajet choisi : l'utilisateur est averti du nouvel état avant de confirmer. Trajet conseillé : s'il emprunte désormais un sentier désactivé, la validation est refusée et le trajet conseillé est recalculé (R-02, `SPEC-TRAIL-07`) (hypothèse). |
| 8 | Verdict « défavorable » ou « à risque », ou vigilance officielle majeure sur le secteur, que le tracé soit le trajet choisi ou le trajet conseillé | La validation reste possible après confirmation ; le verdict et, le cas échéant, l'alerte prioritaire sont rappelés (hypothèse). |
| 9 | Session expirée au moment de valider | Aucune validation (R-16) ; l'utilisateur est invité à se reconnecter. |
| 10 | Trajet conseillé validé, puis ajustement du trajet choisi | La validation est annulée, même si le tracé validé n'a pas été ajusté : le trajet conseillé dépend du trajet choisi et peut être recalculé (`SPEC-TRAIL-07`). |

### Ce qui n'est pas défini

- *24/11/2026* — Validation d'un trajet choisi qui contient un sentier fermé ou désactivé : le CDC garde ce sentier dans le trajet choisi avec une alerte (R-02) et permet de valider le trajet choisi (REQ-011), sans dire si une confirmation est exigée. Hypothèse retenue : validation autorisée après confirmation explicite ; l'utilisateur garde la main sur son trajet choisi (cohérent avec `SPEC-TRAIL-02`).
- *24/11/2026* — Validation quand le verdict est « défavorable » ou « à risque », ou en cas de vigilance officielle majeure (R-19). Hypothèse retenue : autorisée, avec le même rappel et la même confirmation que ci-dessus, pour le trajet choisi comme pour le trajet conseillé : le trajet conseillé n'est pas forcément favorable, et sous vigilance majeure aucune sortie ne l'est (R-19).
- *24/11/2026* — Changement d'état d'un sentier entre l'affichage et la validation. Hypothèse retenue : l'état et le verdict sont relus au moment de la validation. Si un sentier du trajet choisi est devenu fermé ou désactivé, l'utilisateur en est averti avant de confirmer. Si un sentier du trajet conseillé est devenu désactivé, ce trajet ne respecte plus R-02 : sa validation est refusée et il est recalculé.
- *24/11/2026* — Ajustement du trajet conseillé : non tranché dans `SPEC-TRAIL-07`. S'il devient ajustable, son ajustement annule aussi la validation (règle).
- *24/11/2026* — Conservation du tracé validé (retéléchargement plus tard dans la journée, après déconnexion). Hypothèse retenue : le tracé validé n'est pas conservé au-delà de la session de préparation.

### Critères d'acceptation

- [ ] AC-1 — L'utilisateur peut valider le trajet choisi ou, s'il est affiché, le trajet conseillé ; un seul tracé est validé à la fois (`CASE-GPX-01`).
- [ ] AC-2 — Sans tracé validé, aucun fichier ne peut être téléchargé (`CASE-GPX-02`).
- [ ] AC-3 — Valider un trajet choisi qui contient un sentier fermé ou désactivé, ou un tracé (trajet choisi ou trajet conseillé) dont le verdict n'est pas favorable ou dont le secteur est sous vigilance officielle majeure, exige une confirmation après rappel des alertes et du verdict (`CASE-GPX-03`).
- [ ] AC-4 — Toute modification du trajet choisi, du trajet conseillé ou des critères après validation annule la validation, quel que soit le tracé validé (`CASE-GPX-04`).
- [ ] AC-5 — Un parcours proche (`SPEC-TRAIL-03`) se valide comme un trajet choisi (`CASE-GPX-05`).
- [ ] AC-6 — L'état des sentiers et le verdict sont relus au moment de la validation ; un trajet conseillé qui emprunte désormais un sentier désactivé ne peut pas être validé (`CASE-GPX-06`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| La portée et AC-3 limitaient la confirmation au trajet choisi, alors que le cas limite 8 vaut pour tout tracé et que, sous vigilance majeure, le trajet conseillé n'est jamais favorable non plus (R-19). | Acceptée | Portée, cas limite 8, hypothèse et AC-3 étendus au trajet conseillé. |
| Le cas limite 7 renvoyait « à fixer » alors qu'une hypothèse était retenue ; celle-ci ne traitait pas le trajet conseillé, qu'un sentier désactivé rend contraire à R-02. | Acceptée | Cas limite 7 et hypothèse réécrits ; AC-6 ajouté. |
| Le scénario « Modification après validation » ne vise que le trajet choisi ; l'effet sur un trajet conseillé validé n'était pas dit, et `SPEC-TRAIL-07` laisse ouvert l'ajustement du trajet conseillé. | Acceptée | Règle et AC-4 explicités ; cas limite 10 et hypothèse ajoutés. |
| La validation d'un parcours proche figure dans la portée sans critère d'acceptation. | Acceptée | AC-5 ajouté. |

---

## SPEC-GPX-02 — Production et téléchargement du fichier `.gpx`

**Exigence :** REQ-011 (avec règles R-01, R-07, R-09 ; R-14 par extension ; exigences REQ-105, REQ-109)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> À partir du tracé validé, l'application produit un fichier `.gpx` que l'utilisateur
> télécharge. Le fichier reproduit fidèlement le tracé validé, dans l'ordre du parcours, aller
> et retour compris, avec l'altitude de chaque point quand le référentiel la fournit ; seule la
> simplification de `SPEC-GPX-03` peut s'en écarter, dans la tolérance paramétrée. Il rappelle
> qu'il s'agit d'une aide indicative, préparée à une date et une heure données. Il ne contient
> aucune donnée personnelle.

### Portée

- Couvre le contenu du fichier : la trace, l'altitude de ses points, le nom du parcours et la date de préparation.
- Couvre l'enchaînement de l'aller et du retour dans une sortie en aller-retour.
- Couvre les points d'eau du parcours, l'avertissement de la règle R-09 et l'indisponibilité de leur source (hypothèse, voir « Ce qui n'est pas défini »).
- Couvre la mention d'aide indicative et le rappel de vérifier l'état des sentiers et la météo avant le départ (déduit de R-14, voir « Ce qui n'est pas défini »).
- Couvre la relecture de l'état des sentiers au moment du téléchargement.
- Couvre l'absence de données personnelles dans le fichier et dans son nom.
- Couvre l'échec du téléchargement sans connexion (REQ-109).
- Couvre le refus de télécharger le tracé validé d'un autre utilisateur (REQ-105).
- Ne couvre pas la conformité au format standard, la simplification d'une trace trop longue et l'import sur les appareils → `SPEC-GPX-03`.
- Ne couvre pas la géométrie et les altitudes des sentiers → domaine `REF` (REQ-032).
- Ne couvre pas la synchronisation directe avec une montre → hors périmètre (CR-001/Q19).
- Ne couvre pas la consultation de l'application hors connexion → hors périmètre (CR-001/Q27).
- Ne couvre pas l'export des données du compte → domaine `AUTH` (REQ-019).

### Scénarios nominaux

```gherkin
Scénario : Téléchargement d'un tracé en aller simple
  Étant donné un tracé validé « La Possession → Mafate » en aller simple
  Quand l'utilisateur télécharge le fichier .gpx
  Alors un fichier .gpx est téléchargé
  Et il contient une trace unique qui suit les sentiers du tracé validé, dans l'ordre, du départ à l'arrivée
  Et chaque point de la trace porte sa position et son altitude

Scénario : Téléchargement d'un tracé en aller-retour
  Étant donné un tracé validé « Roche Écrite » en aller-retour
  Quand l'utilisateur télécharge le fichier .gpx
  Alors la trace contient l'aller puis le retour
  Et elle se termine au point de départ

Scénario : Informations portées par le fichier
  Étant donné un tracé validé « La Possession → Mafate »
  Quand l'utilisateur télécharge le fichier .gpx le 24/11/2026 à 07h20
  Alors le fichier porte le nom du parcours, formé du départ et de l'arrivée du tracé validé
  Et la date et l'heure de préparation « 24/11/2026 07h20 »
  Et la mention que le tracé est une aide indicative, qu'il ne contient ni l'état des sentiers ni la météo, et qu'ils doivent être vérifiés avant le départ

Scénario : Points d'eau sur le parcours
  Étant donné un tracé validé pour lequel l'application affiche deux points d'eau (SPEC-CALC-05)
  Quand l'utilisateur télécharge le fichier .gpx
  Alors le fichier contient deux points de passage, un par point d'eau affiché, à leur position
  Et chacun porte l'avertissement : disponibilité variable, emporter toute sa réserve d'eau

Scénario : Aucune donnée personnelle
  Étant donné un utilisateur dont l'âge, le poids, la taille, la VMA et le classement des sports favoris sont renseignés
  Quand il télécharge le fichier .gpx de son tracé validé
  Alors ni le fichier ni son nom ne contiennent son adresse électronique, son âge, son poids, sa taille, sa VMA, son classement des sports favoris ni aucun identifiant de son compte
  Et le fichier ne contient aucun temps de parcours ni aucune heure de passage estimés
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Connexion perdue au moment du téléchargement | Aucun fichier, même partiel ; le message de REQ-109 invite à se reconnecter. |
| 2 | Tracé validé qui contient un sentier fermé ou désactivé (validé après confirmation) | Le fichier est produit ; sa mention d'aide indicative nomme en plus les sentiers signalés fermés ou désactivés à la date de préparation (hypothèse). |
| 3 | Lieu de départ saisi à distance du premier sentier (ex. « La Possession ») | La trace ne contient que des tronçons du référentiel ; aucun segment n'est inventé pour rejoindre le lieu saisi (R-01). |
| 4 | Deux téléchargements successifs du même tracé validé | Fichiers identiques, hormis la date et l'heure de préparation. |
| 5 | Tracé validé sans point d'eau connu | Aucun point de passage « point d'eau » ; la mention d'aide indicative rappelle d'emporter toute sa réserve d'eau. |
| 6 | Point de la géométrie sans altitude dans le référentiel | Exception à AC-3 : le point est exporté sans altitude ; aucune altitude n'est supposée (principe de R-07 appliqué au référentiel interne, comme `SPEC-CALC-01` cas limite 5). Le référentiel doit garantir les altitudes à l'import (domaine `REF`). |
| 7 | Tentative de télécharger le tracé validé d'un autre utilisateur (lien recopié) | Refusée (REQ-105). |
| 8 | Source des points d'eau indisponible ou périmée (`SPEC-CALC-05`, cas limite 4) | Aucun point de passage « point d'eau » ; la mention indique que les points d'eau ne sont pas disponibles et reprend l'avertissement de la règle R-09 ; aucun point d'eau n'est supposé (R-07). |
| 9 | Sentier du tracé devenu fermé ou désactivé entre la validation et le téléchargement | La validation est annulée ; aucun fichier n'est produit ; l'utilisateur doit valider de nouveau le tracé (`SPEC-GPX-01`, cas limite 7) (hypothèse). |
| 10 | Tracé issu de la suggestion par distance (`SPEC-TRAIL-04`), sans arrivée saisie, ou trajet conseillé situé dans un autre secteur | Le nom du parcours et le nom du fichier reprennent le départ et l'arrivée du tracé validé, pas les lieux saisis. |

### Ce qui n'est pas défini

- *24/11/2026* — Présence des points d'eau dans le fichier (question renvoyée par `SPEC-CALC-05`). Hypothèse retenue : oui, les mêmes points d'eau que ceux affichés par `SPEC-CALC-05`, y compris ceux proches du tracé, en points de passage dont le nom contient « indicatif » et dont la description reprend l'avertissement de la règle R-09. Risque : certaines montres n'affichent que le nom, et R-09 exige que l'avertissement accompagne toujours les points d'eau.
- *24/11/2026* — Forme de l'aller-retour dans le fichier : une trace continue, une trace en deux segments, ou deux traces. Hypothèse retenue : une trace continue, la forme la plus largement reconnue par les montres.
- *24/11/2026* — Heures estimées de passage dans le fichier. Hypothèse retenue : non ; elles dépendent du profil et deviennent fausses si le départ est décalé.
- *24/11/2026* — État des sentiers, météo et alertes dans le fichier. Hypothèse retenue : non, car ces informations seraient figées à l'heure de préparation ; seule la mention d'aide indicative et la liste des sentiers signalés (cas limite 2) y figurent.
- *24/11/2026* — Date de préparation portée par le fichier : date de validation ou date de production. Hypothèse retenue : date et heure de production du fichier, au téléchargement. L'état des sentiers est relu à ce moment (cas limite 9), si bien que la liste des sentiers signalés correspond à cette date.
- *24/11/2026* — Mention d'aide indicative dans le fichier : le CDC ne l'exige pas ; R-14 ne vise que les conditions d'utilisation acceptées à l'inscription. Hypothèse retenue : la mention figure dans le fichier, par extension de R-14, parce que le fichier est seul sur le terrain (contrainte 6). Texte exact à aligner sur le modèle de CGU (`ZO-12`).
- *24/11/2026* — Nom du fichier. Hypothèse retenue : `meteosport_<départ>_<arrivée>_<AAAA-MM-JJ>.gpx`, sans accent ni espace, sans donnée personnelle. Le départ et l'arrivée sont ceux du tracé validé (cas limite 10) : en suggestion par distance, l'arrivée est l'extrémité de la trace ; en aller-retour, le point de demi-tour.

### Critères d'acceptation

- [ ] AC-1 — Le fichier suit le tracé validé sentier par sentier, dans l'ordre du parcours, sans aucun tronçon hors référentiel ; seule la simplification de `SPEC-GPX-03` peut s'en écarter, dans la tolérance paramétrée (`CASE-GPX-07`).
- [ ] AC-2 — En aller-retour, la trace contient l'aller puis le retour et se termine au point de départ (`CASE-GPX-08`).
- [ ] AC-3 — Chaque point de la trace porte l'altitude du référentiel ; un point sans altitude dans le référentiel est exporté sans altitude, jamais avec une altitude supposée (`CASE-GPX-09`).
- [ ] AC-4 — Le fichier porte le nom du parcours, formé du départ et de l'arrivée du tracé validé, la date et l'heure de préparation et la mention d'aide indicative (`CASE-GPX-10`).
- [ ] AC-5 — Le fichier contient les points d'eau affichés par `SPEC-CALC-05`, chacun avec l'avertissement de la règle R-09 ; si leur source est indisponible, la mention le dit et aucun point d'eau n'est supposé (`CASE-GPX-11`).
- [ ] AC-6 — Ni le fichier ni son nom ne contiennent de donnée personnelle ni de temps estimé (`CASE-GPX-12`).
- [ ] AC-7 — Sans connexion, aucun fichier n'est produit et un message invite à se reconnecter (`CASE-GPX-13`).
- [ ] AC-8 — La mention d'aide indicative nomme les sentiers du tracé signalés fermés ou désactivés à la date de préparation ; un sentier devenu fermé ou désactivé depuis la validation annule celle-ci et aucun fichier n'est produit (`CASE-GPX-14`).
- [ ] AC-9 — Le téléchargement du tracé validé d'un autre utilisateur est refusé (`CASE-GPX-15`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Le cas limite 6 renvoyait à `SPEC-CALC-01` cas limite 3 (profil partiel) au lieu du cas limite 5 (tronçon sans altitude). | Acceptée | Renvoi corrigé. |
| La règle et AC-3 imposaient une altitude à chaque point, ce que contredisent le cas limite 6 et `SPEC-GPX-03` cas limite 5. | Acceptée | Exception ajoutée à la règle, au cas limite 6 et à AC-3. |
| R-07 vise les sources de données, pas le référentiel interne ; elle n'apporte rien au cas limite 3. | Acceptée | Cas limite 3 limité à R-01 ; cas limite 6 formulé comme `SPEC-CALC-01`. |
| La mention d'aide indicative était présentée comme exigée par R-14, qui ne vise que les conditions d'utilisation. | Acceptée | Présentée comme une extension de R-14 ; hypothèse ajoutée. |
| La date portée par le fichier était tantôt celle de la validation (scénario), tantôt celle de la production (cas limite 4) ; l'état des sentiers n'était pas relu au téléchargement. | Acceptée | Date de production retenue ; cas limite 9, hypothèse et AC-8 ajoutés. |
| La fidélité « sentier par sentier » (AC-1) contredit la simplification de `SPEC-GPX-03`, dont les segments s'écartent du référentiel dans la tolérance. | Acceptée | Règle et AC-1 renvoient à la tolérance de `SPEC-GPX-03`. |
| Les points d'eau du fichier n'étaient pas alignés sur `SPEC-CALC-05` : points proches du tracé, source indisponible. | Acceptée | Scénario, hypothèse et AC-5 alignés ; cas limite 8 ajouté. |
| Le nom du parcours suppose une arrivée saisie, absente en suggestion par distance et différente des lieux saisis pour un trajet conseillé dans un autre secteur. | Acceptée | Cas limite 10 ajouté ; nom tiré du tracé validé. |
| Le scénario sur les données personnelles cite un nom que le compte ne contient pas (REQ-015, REQ-016) et oublie le classement des sports. | Acceptée | Liste alignée sur le CDC. |
| Les cas limites 2 et 7 (REQ-105, citée dans l'en-tête) n'avaient aucun critère d'acceptation. | Acceptée | AC-8 et AC-9 ajoutés. |

---

## SPEC-GPX-03 — Conformité au format standard et import sur les appareils de test

**Exigence :** REQ-110 (objectif 4 du CDC ; avec règle R-01)
**Statut :** revue IA faite
**Version :** v2 (24/11/2026)

### Règle

> Le fichier `.gpx` produit respecte le format GPX standard et s'importe sans erreur sur chacun
> des appareils de test de l'équipe : le tracé s'y affiche, fidèle au tracé validé, et peut
> être suivi. Une trace trop longue pour les appareils est simplifiée sans s'écarter du tracé
> au-delà d'une tolérance fixée, ni en position ni en distance.

### Portée

- Couvre le contrôle de conformité de chaque fichier au schéma public du format.
- Couvre le refus de remettre un fichier non conforme.
- Couvre la restitution des noms accentués (« Roche Écrite », « Piton des Neiges »…) et des caractères spéciaux.
- Couvre la simplification d'une trace dont le nombre de points dépasse ce que les appareils acceptent.
- Couvre l'import, par l'équipe, des fichiers du panel pilote sur chaque appareil de test.
- Ne couvre pas le contenu du fichier → `SPEC-GPX-02`.
- Ne couvre pas le transfert du fichier sur la montre (câble, application du fabricant) → hors application.
- Ne couvre pas la compatibilité avec des appareils autres que ceux de test → non demandé (aucune marque imposée, CR-001/Q19).

### Scénarios nominaux

```gherkin
Scénario : Conformité au schéma du format
  Étant donné les fichiers produits pour les trois parcours du panel pilote, en aller simple et en aller-retour
  Quand chaque fichier est contrôlé contre le schéma public du format GPX 1.1
  Alors aucun écart n'est relevé

Scénario : Noms accentués
  Étant donné un tracé validé « Roche Écrite »
  Quand son fichier .gpx est importé sur un appareil de test
  Alors le nom du parcours s'affiche « Roche Écrite », sans caractère altéré

Scénario : Import sur un appareil de test
  Étant donné le fichier .gpx du parcours « La Possession → Mafate »
  Quand l'équipe l'importe sur chaque appareil de test
  Alors l'import se termine sans erreur sur chaque appareil
  Et le tracé affiché suit les sentiers du parcours
  Et la distance affichée par l'appareil est égale à celle que l'application affiche pour le tracé validé, à la tolérance de distance près

Scénario : Simplification d'une trace longue
  Étant donné un tracé validé d'environ 50 km dont la géométrie dépasse le nombre maximal de points paramétré
  Quand le fichier .gpx est produit
  Alors la trace compte au plus le nombre maximal de points
  Et l'écart entre la trace simplifiée et le tracé du référentiel ne dépasse pas la tolérance d'écart paramétrée
  Et la distance de la trace simplifiée ne s'écarte pas de celle du tracé du référentiel de plus de la tolérance de distance
  Et le départ, l'arrivée, le point de demi-tour d'un aller-retour et les jonctions entre sentiers restent des points de la trace
  Et les points de passage des points d'eau ne sont pas modifiés
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Fichier produit non conforme au schéma | Le fichier n'est pas proposé au téléchargement ; un message signale l'erreur ; aucune version non conforme n'est remise (hypothèse). |
| 2 | Import refusé par un appareil de test | La recette échoue pour cet appareil ; l'anomalie est corrigée avant la démonstration au client. |
| 3 | Trace sous le nombre maximal de points | Aucune simplification : tous les points du référentiel sont exportés. |
| 4 | Caractères spéciaux dans un nom (`&`, `<`, `>`, apostrophe, guillemet) | Échappés là où le format l'exige (`&` et `<` dans tout texte ; apostrophe et guillemet seulement dans une valeur d'attribut) ; le nom s'affiche sans altération à l'import. |
| 5 | Point sans altitude (`SPEC-GPX-02`, cas limite 6) | Le fichier reste conforme : l'altitude est facultative dans le format. |

### Ce qui n'est pas défini

- *24/11/2026* — Liste des appareils de test de l'équipe (marques, modèles, application ou logiciel d'import). L'objectif 4 du CDC s'y réfère sans la fixer, et le client n'a imposé aucune marque (CR-001/Q19).
- *24/11/2026* — Version du format. Hypothèse retenue : GPX 1.1, version publiée la plus largement reconnue.
- *24/11/2026* — Nombre maximal de points et tolérance d'écart de la simplification. Hypothèse retenue : deux paramètres ; le nombre maximal est fixé au plus petit plafond constaté sur les appareils de test, la tolérance d'écart à 10 m. Ces paramètres sont absents de REQ-115 : à reprendre dans `ARCH`.
- *24/11/2026* — Tolérance de distance entre la trace exportée, la distance affichée par l'appareil et celle de l'application. Hypothèse retenue : 2 %, paramétrable.
- *24/11/2026* — Conflit entre le nombre maximal de points et les tolérances : sur un sentier en lacets, une simplification à 10 m peut raccourcir la distance de plus de 2 %. Hypothèse retenue : le nombre maximal de points prime, sinon l'import échoue ; la perte de distance est mesurée sur les jeux de référence du panel pilote et, si elle dépasse la tolérance, les deux tolérances sont revues à la recette.
- *24/11/2026* — Contrôle de conformité à chaque production de fichier, ou seulement par les tests automatisés. Hypothèse retenue : les deux ; le contrôle à la production protège l'utilisateur d'un fichier inutilisable en zone sans réseau.

### Critères d'acceptation

- [ ] AC-1 — Chaque fichier produit sur les jeux de référence est conforme au schéma public du format GPX 1.1 (`CASE-GPX-16`).
- [ ] AC-2 — Les noms accentués et les caractères spéciaux sont restitués sans altération à l'import (`CASE-GPX-17`).
- [ ] AC-3 — Le fichier de chaque parcours du panel pilote, en aller simple et en aller-retour, s'importe sans erreur sur chaque appareil de test, avec une distance égale à celle de l'application à la tolérance de distance près (`CASE-GPX-18`).
- [ ] AC-4 — Une trace trop longue est simplifiée sous le nombre maximal de points, dans la tolérance d'écart et la tolérance de distance ; le départ, l'arrivée, le point de demi-tour et les jonctions restent des points de la trace, et les points d'eau ne sont pas modifiés (`CASE-GPX-19`).
- [ ] AC-5 — Un fichier non conforme au schéma n'est jamais remis ; un message signale l'erreur (`CASE-GPX-20`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Sur les sentiers en lacets, la simplification à 10 m (AC-4) peut raccourcir la distance au-delà des 2 % exigés par AC-3. | Acceptée | Tolérance de distance ajoutée à la règle, au scénario de simplification et à AC-4 ; hypothèse sur le conflit ajoutée. |
| Les points d'eau sont des points de passage, pas des points de la trace : la simplification ne peut pas les « conserver ». Le point de demi-tour d'un aller-retour n'était pas protégé. | Acceptée | Scénario et AC-4 reformulés. |
| L'apostrophe n'est pas un caractère réservé dans le texte d'un élément. | Acceptée | Cas limite 4 précisé. |
| R-07 ne concerne pas la conformité ; la simplification relève de R-01. | Acceptée | En-tête corrigé. |
| Le refus d'un fichier non conforme (cas limite 1) n'avait aucun critère d'acceptation. | Acceptée | Portée complétée ; AC-5 ajouté. |
| Les nouveaux paramètres (nombre maximal de points, tolérances) ne figurent pas dans REQ-115. | Acceptée | Listés dans l'en-tête du domaine pour `ARCH`. |
