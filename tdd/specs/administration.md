# Spécifications — Administration et alertes

**Domaine :** `ADMIN`

Sources : `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3) — exigences `REQ-021`, `REQ-022`, `REQ-026`, `REQ-027`, `REQ-106` (borne espace admin `REQ-023`, référentiels `REQ-032`) ; règles `R-08`, `R-11` ; précondition `R-16` ; CDC §1 (saisie manuelle d'état sans source automatique) ; contrainte 10 (réglementation du littoral signalée par des alertes). Périmètre domaine : `tdd/specs/sommaire.md` (`ADMIN`).

---

## SPEC-ADMIN-01 — Accès à l'espace d'administration

**Exigence :** REQ-106 ; borne d'espace : REQ-023 (phrase 2)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Seul le rôle administrateur accède à l'espace d'administration

### Portée

- Couvre le contrôle d'accès à l'espace d'administration réservé au rôle administrateur (REQ-106).
- L'espace d'administration se limite aux statuts des sentiers et aux alertes (borne REQ-023, phrase 2 — domaine ADMIN). La consignation des critères de sécurité du panel pilote relève du domaine REF (REQ-023, phrase 1).
- Ne couvre pas la création des comptes administrateur → non défini dans les exigences de ce domaine (CDC : comptes créés par l'équipe, parties prenantes).
- Ne couvre pas les opérations de forçage d'état ni la gestion des alertes → `SPEC-ADMIN-02`, `SPEC-ADMIN-03`.
- Ne couvre pas les critères de sécurité du panel pilote → exclus de l'espace d'administration (borne REQ-023, phrase 2 ; consignation → domaine REF, REQ-023, phrase 1).

### Scénarios nominaux

```gherkin
Scénario : Accès administrateur à l'espace d'administration
  Étant donné un utilisateur authentifié avec le rôle administrateur (R-16)
  Quand il accède à l'espace d'administration
  Alors l'accès est autorisé

Scénario : Périmètre fonctionnel de l'espace d'administration
  Étant donné un utilisateur authentifié avec le rôle administrateur (R-16)
  Quand il ouvre l'espace d'administration
  Alors seules les fonctions relatives aux statuts des sentiers et aux alertes sont proposées (REQ-023, phrase 2)
  Et aucune action portant sur les critères de sécurité du panel pilote n'est proposée (REQ-023, phrase 2)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Compte utilisateur ordinaire (sans rôle administrateur) | N'accède pas à l'espace d'administration (REQ-106 ; vérification CDC : test d'accès avec un compte utilisateur ordinaire) |

### Ce qui n'est pas défini

- *24/11/2026* — Modalités de création et d'attribution du rôle administrateur (hors texte de REQ-106 ; CDC parties prenantes : comptes créés par l'équipe).

### Critères d'acceptation

- [ ] AC-1 — Un compte avec le rôle administrateur accède à l'espace d'administration (`CASE-ADMIN-01`).
- [ ] AC-2 — Un compte utilisateur ordinaire n'accède pas à l'espace d'administration (`CASE-ADMIN-01`).
- [ ] AC-3 — L'espace d'administration reste limité aux statuts des sentiers et aux alertes (REQ-023, phrase 2) (`CASE-ADMIN-01`).
- [ ] AC-4 — L'espace d'administration ne propose pas d'écran ni d'action portant sur les critères de sécurité du panel pilote (borne REQ-023, phrase 2 ; consignation → domaine REF, REQ-023, phrase 1) (`CASE-ADMIN-01`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Précondition « utilisateur authentifié » | Acceptée | CDC R-16 : toute utilisation exige un compte authentifié |
| Spécifier le flux de création des comptes admin | Refusée | Non porté par REQ-106 ; noté en « Ce qui n'est pas défini » |
| Point final ajouté à la règle REQ-106 | Refusée / retiré | Alignement littéral sur le CDC |

---

## SPEC-ADMIN-02 — Forçage ou correction de l'état d'un sentier

**Exigence :** REQ-021 (avec R-08)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Seul un administrateur peut forcer ou corriger l'état d'un sentier, pour une durée fixée ou sans limite. Quand l'administrateur force l'état d'un sentier, cet état remplace l'information reçue automatiquement, pour la durée qu'il fixe ou jusqu'à ce qu'il le retire. Chaque forçage enregistre son auteur, sa date et son motif.

*(Complément contexte CDC §1)* : Si aucune source automatique n'est trouvée, l'administrateur saisit l'état à la main (CDC §1). Cette saisie n'est pas un remplacement d'information automatique au sens de R-08, mais elle applique les mêmes modalités opérationnelles : durée fixée ou sans limite, et journalisation (auteur, date, motif) — décision produit de cohérence avec REQ-021 / R-08.

### Portée

- Couvre le forçage ou la correction de l'état d'un sentier par un administrateur (REQ-021).
- Couvre la durée fixée ou sans limite (REQ-021, R-08).
- Couvre le remplacement de l'information reçue automatiquement par l'état forcé (R-08).
- Couvre la cessation du remplacement à l'échéance de la durée fixée ou après retrait du forçage (R-08).
- Couvre la capacité de l'administrateur à saisir l'état à la main lorsqu'aucune source automatique n'est trouvée (CDC §1) : saisie initiale (pas un remplacement d'information automatique), avec les mêmes modalités opérationnelles que R-08 (durée fixée ou sans limite, journalisation auteur/date/motif) — décision produit de cohérence avec REQ-021.
- Couvre l'enregistrement de l'auteur, de la date et du motif de chaque forçage et de chaque saisie manuelle sans source (R-08, alignement CDC §1).
- En l'absence de distinction dans le CDC, les scénarios appliquent le mécanisme de remplacement de R-08 aux deux verbes de REQ-021 (« forcer ou corriger ») à titre d'hypothèse de couverture, sans créer de second mécanisme non spécifié (→ Ce qui n'est pas défini, Revue IA et `out/validation-specs/arbitrages.md` [ARB-004]).
- Ne couvre pas l'accès à l'espace d'administration → `SPEC-ADMIN-01`.
- Ne couvre pas les règles de désactivation automatique d'un sentier ni le trajet conseillé → domaine `TRAIL` (R-02, REQ-008).
- Ne couvre pas la gestion des alertes → `SPEC-ADMIN-03`.

### Scénarios nominaux

```gherkin
Scénario : Forçage d'état avec durée fixée
  Étant donné un administrateur authentifié (R-16)
  Et un sentier du référentiel interne
  Quand l'administrateur force ou corrige l'état de ce sentier pour une durée fixée
  Alors l'état forcé remplace l'information reçue automatiquement pendant cette durée (REQ-021, R-08)
  Et le forçage enregistre son auteur, sa date et son motif

Scénario : Forçage d'état sans limite jusqu'au retrait
  Étant donné un administrateur authentifié (R-16)
  Et un sentier du référentiel interne
  Quand l'administrateur force ou corrige l'état de ce sentier sans limite de durée
  Alors l'état forcé remplace l'information reçue automatiquement jusqu'à ce que l'administrateur le retire (REQ-021, R-08)
  Et le forçage enregistre son auteur, sa date et son motif

Scénario : Retrait d'un forçage d'état
  Étant donné un administrateur authentifié (R-16)
  Et un sentier dont l'état fait l'objet d'un forçage en cours
  Quand l'administrateur retire ce forçage
  Alors l'état forcé cesse de remplacer l'information reçue automatiquement (R-08)

Scénario : Expiration de la durée de forçage
  Étant donné un sentier dont l'état fait l'objet d'un forçage pour une durée fixée
  Quand la durée de forçage fixée par l'administrateur est écoulée
  Alors l'état forcé cesse de remplacer l'information reçue automatiquement (R-08)

Scénario : Saisie manuelle d'état sans source automatique
  Étant donné un administrateur authentifié (R-16)
  Et un sentier du référentiel interne sans source automatique d'état
  Quand l'administrateur saisit l'état à la main pour une durée fixée ou sans limite
  Alors l'état saisi est enregistré pour cette durée ou jusqu'au retrait par l'administrateur (CDC §1, alignement REQ-021 / R-08)
  Et la saisie enregistre son auteur, sa date et son motif
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Utilisateur non administrateur | Ne peut pas forcer ni corriger l'état d'un sentier (REQ-021) |
| 2 | Durée fixée de forçage écoulée | L'état forcé cesse de remplacer l'information reçue automatiquement (R-08) |
| 3 | Aucune source automatique d'état disponible | L'administrateur saisit l'état à la main (CDC §1) pour une durée fixée ou sans limite, avec journalisation auteur/date/motif (alignement opérationnel REQ-021 / R-08 ; ce n'est pas un remplacement d'information automatique) |
| 4 | Sentier absent du référentiel interne | Sentier absent du référentiel interne : hors périmètre (CDC §6 « Sentiers et spots absents des référentiels internes ») ; seuls les sentiers de REQ-032 sont opérables (dépendance domaine REF) |

### Ce qui n'est pas défini

- *24/11/2026* — Distinction éventuelle entre « forcer » et « corriger » (REQ-021 associe les deux verbes à la même durée et renvoie à R-08, qui ne décrit que l'action où l'administrateur « force » l'état ; aucun mécanisme distinct n'est spécifié pour « corriger » ; voir out/validation-specs/arbitrages.md [ARB-004]).
- *24/11/2026* — Liste exhaustive des valeurs d'état forçables (REQ-021 parle d'« état » ; REQ-004 cite ouvert, fermé, ou désactivé par une règle de sécurité pour l'affichage, sans lier explicitement chaque valeur au forçage).
- *24/11/2026* — Représentation technique de « sans limite » (R-08 : jusqu'à retrait par l'administrateur).
- *24/11/2026* — Comportement d'affichage d'état lorsqu'aucun forçage ni source automatique n'est disponible après cessation du forçage (hors R-08 ; renvoi R-07 / domaines METEO ou TRAIL sans inventer de valeur).

### Critères d'acceptation

- [ ] AC-1 — Seul un administrateur peut forcer ou corriger l'état d'un sentier (`CASE-ADMIN-02`).
- [ ] AC-2 — L'état forcé remplace l'information reçue automatiquement pour la durée fixée ou jusqu'au retrait par l'administrateur ; à l'échéance de la durée fixée ou après retrait, l'état forcé cesse de remplacer l'information reçue automatiquement (R-08) (`CASE-ADMIN-02`).
- [ ] AC-3 — Chaque forçage et chaque saisie manuelle sans source enregistrent auteur, date et motif (`CASE-ADMIN-02`).
- [ ] AC-4 — En l'absence de source automatique d'état, l'administrateur saisit l'état à la main pour une durée fixée ou sans limite (CDC §1, alignement opérationnel REQ-021 / R-08) (`CASE-ADMIN-02`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Imposer les libellés ouvert / fermé / désactivé comme seules valeurs de forçage | Refusée | REQ-021 ne les énumère pas pour le forçage ; placé en « Ce qui n'est pas défini » |
| Distinction « forcer » vs « corriger » | Hypothèse de couverture | Traitement conjoint sous R-08 en l'absence de règle distincte dans le CDC ([ARB-004]) |
| Saisie manuelle sans source (CDC §1) vs R-08 | Acceptée | Décision produit : mêmes modalités (durée, journalisation) ; distinction sémantique conservée (saisie initiale ≠ remplacement d'une source) |

---

## SPEC-ADMIN-03 — Création, modification et retrait des alertes

**Exigence :** REQ-022 (avec R-11)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'administrateur crée, modifie et retire les alertes, les rattache à une ou plusieurs activités et fixe leur durée. L'administrateur rattache chaque alerte à une ou plusieurs activités précises (sentier ou spot de pêche), choisies une par une, pour une durée fixée ou sans limite.

### Portée

- Couvre la création, la modification et le retrait des alertes par l'administrateur (REQ-022).
- Couvre la sauvegarde et la réutilisation d'une alerte sans rattachement immédiat à une activité (décision produit).
- Couvre l'association d'une alerte à un ou plusieurs types d'activité (sentier, spot de pêche) : seuls les points d'activité de ces types peuvent recevoir l'alerte (décision produit ; cohérent avec REQ-027 pour les alertes réglementaires du littoral limitées aux spots).
- Couvre le rattachement à une ou plusieurs activités précises (sentier ou spot de pêche), choisies une par une (REQ-022, R-11), sous réserve de compatibilité de type : ce rattachement est requis pour l'affichage (REQ-026 → `SPEC-ADMIN-04`), pas pour la seule sauvegarde.
- Couvre la durée des alertes (REQ-022 : l'administrateur fixe leur durée ; R-11 : durée fixée ou sans limite).
- Couvre la cessation du caractère « en cours » à l'échéance d'une durée fixée (retrait automatique) ou après retrait explicite par l'administrateur (REQ-022, R-11, REQ-026).
- Les alertes de cette spécification sont celles gérées par l'administrateur (REQ-022, R-11) ; elles sont distinctes du signalement d'état fermé ou désactivé sur un trajet (REQ-004, R-02 → domaine `TRAIL`) et de l'alerte prioritaire liée aux vigilances officielles (R-19 → domaine `CALC`).
- Ne couvre pas l'affichage des alertes sur les pages et recommandations → `SPEC-ADMIN-04`.
- Ne couvre pas le contenu particulier Réserve naturelle marine / risque requin au-delà du cas réglementaire littoral (REQ-027, R-11) → `SPEC-ADMIN-04`.
- Ne couvre pas une carte précise des zones réglementées en mer → hors périmètre (CDC §6).

### Scénarios nominaux

```gherkin
Scénario : Création d'une alerte rattachée à des activités
  Étant donné un administrateur authentifié (R-16)
  Et au moins un sentier ou un spot de pêche dans les référentiels internes
  Quand l'administrateur crée une alerte
  Et l'associe à un ou plusieurs types d'activité
  Et la rattache à une ou plusieurs activités précises de ces types, choisies une par une
  Et fixe une durée fixée ou sans limite
  Alors l'alerte est créée avec ces types, ces rattachements et cette durée

Scénario : Sauvegarde d'une alerte liée à des types sans rattachement de point
  Étant donné un administrateur authentifié (R-16)
  Quand l'administrateur crée une alerte associée à un ou plusieurs types d'activité
  Et ne la rattache à aucun point d'activité
  Alors l'alerte est sauvegardée et réutilisable pour ces types
  Et elle n'est pas affichée tant qu'elle n'est pas associée à au moins un point d'activité compatible (REQ-026)

Scénario : Modification d'une alerte existante
  Étant donné un administrateur authentifié (R-16)
  Et une alerte existante rattachée à une activité
  Quand l'administrateur modifie le rattachement d'activité ou la durée de l'alerte
  Alors les modifications sont enregistrées et l'alerte est mise à jour (REQ-022, R-11)

Scénario : Retrait d'une alerte
  Étant donné un administrateur authentifié (R-16)
  Et une alerte existante
  Quand l'administrateur retire l'alerte
  Alors l'alerte est retirée (REQ-022) et n'est plus une alerte en cours au sens de l'affichage (R-11, REQ-026)

Scénario : Fin automatique d'une alerte à durée fixée
  Étant donné une alerte rattachée à une activité pour une durée fixée
  Quand la durée fixée est écoulée
  Alors l'alerte est retirée automatiquement et n'est plus une alerte en cours au sens de l'affichage (R-11, REQ-026)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Création ou conservation d'une alerte sans point d'activité rattaché | L'alerte peut être sauvegardée et réutilisée (avec ses types d'activité) ; elle n'est pas affichée tant qu'elle n'est pas associée à au moins un point compatible (REQ-026 → `SPEC-ADMIN-04`) |
| 2 | Tentative d'attribuer une alerte à un point dont le type n'est pas parmi les types de l'alerte | Attribution refusée : seuls les points des types d'activité liés à l'alerte peuvent la recevoir (décision produit ; ex. alerte réglementaire du littoral → spots uniquement, REQ-027) |
| 3 | Utilisateur non administrateur | Ne peut pas créer, modifier ni retirer d'alerte (REQ-022, REQ-106 ; SPEC-ADMIN-01) |
| 4 | Durée fixée de l'alerte écoulée | L'alerte est retirée automatiquement et n'est plus une alerte en cours au sens de l'affichage (R-11, REQ-026) |
| 5 | Activité absente des référentiels internes | Activité absente des référentiels internes : hors périmètre (CDC §6 « Sentiers et spots absents des référentiels internes ») ; seuls les sentiers et spots de REQ-032 sont opérables (dépendance domaine REF) |
| 6 | Tentative de rattacher une alerte à un secteur géographique global | Impossible : R-11 impose des activités précises choisies une par une (pas de secteur géographique à part ; hors périmètre carte CDC §6) |

### Ce qui n'est pas défini

- *24/11/2026* — Champs de contenu d'une alerte générique (titre, texte, sévérité, etc.) au-delà de l'existence de l'alerte, de son rattachement (REQ-022, R-11) et, pour les alertes réglementaires du littoral, de l'invitation obligatoire à vérifier la réglementation locale sur place (REQ-027 → SPEC-ADMIN-04).
- *24/11/2026* — Représentation technique de « sans limite » pour une alerte.

### Critères d'acceptation

- [ ] AC-1 — L'administrateur peut créer, modifier et retirer des alertes (`CASE-ADMIN-03`).
- [ ] AC-2 — Une alerte est liée à un ou plusieurs types d'activité ; elle peut être sauvegardée et réutilisée sans rattachement de point ; pour être affichée, elle doit être associée à une ou plusieurs activités précises de ces types, choisies une par une (REQ-022, R-11, REQ-026) (`CASE-ADMIN-03`).
- [ ] AC-3 — L'administrateur fixe une durée fixée ou sans limite lors de la création ou modification d'une alerte (REQ-022, R-11) (`CASE-ADMIN-03`).
- [ ] AC-4 — Après retrait par l'administrateur (REQ-022) ou à l'échéance d'une durée fixée, l'alerte n'est plus une alerte en cours au sens de l'affichage (R-11, REQ-026) (`CASE-ADMIN-03`).
- [ ] AC-5 — Un utilisateur non administrateur ne peut ni créer, ni modifier, ni retirer d'alerte (REQ-022, REQ-106) (`CASE-ADMIN-03`).
- [ ] AC-6 — Une alerte ne peut être attribuée qu'à des points d'activité dont le type figure parmi les types liés à l'alerte (`CASE-ADMIN-03`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Modèle de données alerte (severityrité, zone géographique) | Refusée | CDC : rattachement à des activités précises, sans secteur géographique à part (R-11) ; pas de schéma de champs imposé |
| Cas limite pour alerte sans activité | Acceptée | Décision produit : sauvegarde et réutilisation autorisées ; l'affichage exige l'association à un point d'activité (sentier ou spot) |
| Types d'activité et attribution | Acceptée | Décision produit : alerte liée à un ou plusieurs types ; attribution uniquement aux points de ces types (couvre REQ-027 littoral → spots) |
| Fin automatique à l'échéance d'une durée fixée | Acceptée | Décision produit : l'alerte est retirée automatiquement lorsque sa durée de vie est terminée |

---

## SPEC-ADMIN-04 — Affichage des alertes et alertes réglementaires du littoral

**Exigence :** REQ-026, REQ-027 (avec R-11)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Chaque page de sentier ou de spot de pêche, et toute recommandation qui le propose, affiche les alertes en cours qui lui sont rattachées. Les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) sont créées par l'administrateur sur les spots concernés et invitent à vérifier la réglementation locale sur place. La présence de la Réserve naturelle marine et le risque requin sont des alertes de ce type, sans traitement particulier.

### Portée

- Couvre l'affichage des alertes en cours sur la page d'un sentier ou d'un spot, et dans toute recommandation qui le propose (REQ-026, R-11).
- Seules les alertes associées à au moins un point d'activité (sentier ou spot de pêche) sont affichées ; une alerte sauvegardée sans rattachement n'apparaît pas (`SPEC-ADMIN-03`).
- Une alerte est « en cours » tant qu'elle n'a pas été retirée par l'administrateur et, si elle a une durée fixée, tant que cette durée n'est pas écoulée (retrait automatique à l'échéance — `SPEC-ADMIN-03`).
- Couvre les alertes réglementaires du littoral (Réserve naturelle marine, risque requin) créées par l'administrateur sur les spots concernés (REQ-027) : ces alertes sont liées au type d'activité spot de pêche et ne peuvent être attribuées qu'à des spots (`SPEC-ADMIN-03`).
- Couvre l'invitation à vérifier la réglementation locale sur place (REQ-027).
- Couvre le fait que Réserve naturelle marine et risque requin sont des alertes de ce type, sans traitement particulier (R-11).
- Ne couvre pas la mécanique générale de création, modification et retrait des alertes qui relève de `SPEC-ADMIN-03` ; `SPEC-ADMIN-04` couvre l'affichage (REQ-026) et les obligations spécifiques aux alertes réglementaires du littoral (REQ-027, invitation à vérifier la réglementation locale, R-11).
- Ne couvre pas une carte précise des zones réglementées en mer → hors périmètre (CDC §6).

### Scénarios nominaux

```gherkin
Scénario : Affichage des alertes en cours sur une activité
  Étant donné un utilisateur authentifié (R-16)
  Et un sentier ou un spot de pêche
  Et une ou plusieurs alertes en cours qui lui sont rattachées
  Quand l'utilisateur consulte la page de cette activité
  Ou qu'une recommandation propose cette activité
  Alors les alertes en cours rattachées sont affichées

Scénario : Alerte réglementaire du littoral sur un spot
  Étant donné un administrateur authentifié (R-16)
  Et des spots de pêche du référentiel
  Quand l'administrateur crée une alerte Réserve naturelle marine ou risque requin liée au type spot de pêche
  Et la rattache aux spots concernés
  Alors l'alerte invite à vérifier la réglementation locale sur place
  Et l'alerte est une alerte de ce type, sans traitement particulier (R-11)

Scénario : Affichage de l'invitation réglementaire du littoral sur un spot
  Étant donné un utilisateur authentifié (R-16)
  Et un spot de pêche avec une alerte en cours de type Réserve naturelle marine ou risque requin
  Quand l'utilisateur consulte la page de ce spot
  Ou qu'une recommandation propose ce spot
  Alors l'alerte affichée invite à vérifier la réglementation locale sur place (REQ-027, REQ-026, R-11)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Aucune alerte en cours rattachée à l'activité | Pas d'alerte affichée pour cette activité (REQ-026 : affiche les alertes en cours rattachées) |
| 2 | Alerte sauvegardée sans association à un point d'activité | Non affichée ; réutilisable après rattachement (`SPEC-ADMIN-03`, REQ-026) |
| 3 | Alerte retirée | N'est plus une alerte en cours ; non affichée (REQ-022, R-11, REQ-026) |
| 4 | Durée fixée de l'alerte écoulée | L'alerte n'est plus en cours (retrait automatique à l'échéance) ; non affichée (R-11, REQ-026 ; `SPEC-ADMIN-03`) |
| 5 | Tentative de rattacher une alerte réglementaire du littoral (Réserve naturelle marine, risque requin) à un sentier | Attribution refusée : l'alerte est liée au type spot de pêche uniquement (REQ-027, CDC §1 ; règle des types — `SPEC-ADMIN-03`) |

### Ce qui n'est pas défini

- *24/11/2026* — Libellé exact du message d'invitation à vérifier la réglementation locale (REQ-027 impose l'invitation obligatoire, pas son texte exact).
- *24/11/2026* — Liste nominative des spots de pêche « concernés » par la Réserve naturelle marine ou le risque requin (CDC §1 situe la Réserve sur la côte ouest et REQ-027 cite les spots concernés, sans fournir la liste exhaustive dans le CDC ; aucun périmètre géographique arbitraire n'est inventé).

### Critères d'acceptation

- [ ] AC-1 — Sur la page d'un sentier ou d'un spot, seules les alertes en cours qui lui sont rattachées sont affichées ; une alerte sans association à un point d'activité n'est pas affichée (`CASE-ADMIN-04`).
- [ ] AC-2 — Toute recommandation qui propose l'activité affiche ces alertes en cours (`CASE-ADMIN-04`).
- [ ] AC-3 — Les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) sont liées au type spot de pêche, créées sur les spots concernés, et invitent à vérifier la réglementation locale sur place lors de leur affichage sur la page du spot ou dans une recommandation (REQ-027, REQ-026) (`CASE-ADMIN-04`).
- [ ] AC-4 — Réserve naturelle marine et risque requin sont des alertes de ce type, sans traitement particulier (R-11) (`CASE-ADMIN-04`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Hardcoder Réserve naturelle marine / requin hors modèle d'alertes | Refusée | R-11 : sans traitement particulier ; R-15 supprimée |
| Délimiter la « côte ouest » en polygone | Refusée | Hors périmètre carte ; rattachement aux spots (CDC §6, R-11) |
| Rejet alerte littoral sur sentier | Acceptée | Décision produit : types d'activité ; attribution refusée si type incompatible (REQ-027) |
