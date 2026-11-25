# Spécifications — Administration et alertes

**Domaine :** `ADMIN`

Sources : `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3) — exigences `REQ-021`, `REQ-022`, `REQ-026`, `REQ-027`, `REQ-106` ; borne espace admin `REQ-023` (phrase 2) ; référentiels `REQ-032` (réf.) ; `REQ-004` (réf. état des sentiers) ; règles `R-08`, `R-11` ; références `R-02` (sentier désactivé : règle de sécurité ou fermeture ; effets trajet → `TRAIL`), `R-16` (précondition compte authentifié) ; CDC §1 (saisie manuelle d'état sans source automatique) ; contrainte 10 (réglementation du littoral signalée par des alertes). Périmètre domaine : `tdd/specs/sommaire.md` (`ADMIN`).

---

## SPEC-ADMIN-01 — Accès à l'espace d'administration

**Exigence :** REQ-106 ; borne d'espace : REQ-023 (phrase 2)
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> Seul le rôle administrateur accède à l'espace d'administration

### Portée

- Couvre le contrôle d'accès à l'espace d'administration réservé au rôle administrateur (REQ-106).
- Précondition d'authentification : toute utilisation exige un compte authentifié (`R-16` en référence, domaine primaire `AUTH`).
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
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> Seul un administrateur peut forcer ou corriger l'état d'un sentier, pour une durée fixée ou sans limite. Quand l'administrateur force l'état d'un sentier, cet état remplace l'information reçue automatiquement, pour la durée qu'il fixe ou jusqu'à ce qu'il le retire. Chaque forçage enregistre son auteur, sa date et son motif.

*(Complément contexte CDC §1)* : Si aucune source automatique n'est trouvée, l'administrateur saisit l'état à la main (CDC §1). Cette saisie initiale constitue une saisie simple de l'état sans remplacement d'information automatique au sens de R-08.

### Portée

- Couvre le forçage ou la correction de l'état d'un sentier par un administrateur (REQ-021).
- Couvre la durée fixée ou sans limite (REQ-021, R-08).
- Couvre le remplacement de l'information reçue automatiquement par l'état forcé (R-08).
- Couvre la cessation du remplacement à l'échéance de la durée fixée ou après retrait du forçage (R-08).
- Couvre la capacité de l'administrateur à saisir l'état à la main lorsqu'aucune source automatique n'est trouvée (CDC §1) : saisie simple de l'état (sans remplacement d'information automatique au sens de R-08).
- Couvre l'enregistrement de l'auteur, de la date et du motif de chaque forçage (R-08).
- Couvre, côté administration, la production d'un état de sentier (forçage, correction ou saisie manuelle — REQ-021, R-08, CDC §1) consommable ensuite par `REQ-004` / `R-02` côté `TRAIL` (affichage d'état ; signalement d'état fermé/désactivé sur le trajet choisi — `REQ-004`/`R-02` ; exclusion du trajet conseillé pour tout sentier désactivé au sens de `R-02`, par règle de sécurité ou fermeture) ; `ADMIN` ne spécifie ni la liste des valeurs d'état forçables (→ Ce qui n'est pas défini), ni ces effets d'affichage/routage.
- En l'absence de distinction dans le CDC, les deux verbes de REQ-021 (« forcer ou corriger ») relèvent du même mécanisme de remplacement de R-08, sans créer de second mécanisme non spécifié (→ Revue IA).
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
  Quand l'administrateur saisit l'état à la main
  Alors l'état saisi est enregistré (CDC §1)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Utilisateur non administrateur | Ne peut pas forcer ni corriger l'état d'un sentier (REQ-021) |
| 2 | Durée fixée de forçage écoulée | L'état forcé cesse de remplacer l'information reçue automatiquement (R-08) |
| 3 | Aucune source automatique d'état disponible | L'administrateur saisit l'état à la main (CDC §1 ; saisie initiale simple sans remplacement d'information automatique au sens de R-08) |
| 4 | Sentier absent du référentiel interne | Sentier absent du référentiel interne : hors périmètre (CDC §6 « Sentiers et spots absents des référentiels internes ») ; seuls les sentiers de REQ-032 sont opérables (dépendance domaine REF) |

### Ce qui n'est pas défini

- *24/11/2026* — Traitement de « forcer ou corriger » : alignement sur le mécanisme unique de remplacement de R-08 conformément au CDC.
- *25/11/2026* — Saisie manuelle d'état sans source automatique (CDC §1) : saisie simple conforme au texte littéral du CDC §1.
- *24/11/2026* — Liste exhaustive des valeurs d'état forçables (REQ-021 parle d'« état » ; REQ-004 cite ouvert, fermé, ou désactivé par une règle de sécurité pour l'affichage, sans lier explicitement chaque valeur au forçage).
- *24/11/2026* — Représentation technique de « sans limite » (R-08 : jusqu'à retrait par l'administrateur).
- *24/11/2026* — Comportement d'affichage d'état lorsqu'aucun forçage ni source automatique n'est disponible après cessation du forçage (hors R-08 ; renvoi R-07 / domaines METEO ou TRAIL sans inventer de valeur).

### Critères d'acceptation

- [ ] AC-1 — Seul un administrateur peut forcer ou corriger l'état d'un sentier (`CASE-ADMIN-02`).
- [ ] AC-2 — L'état forcé remplace l'information reçue automatiquement pour la durée fixée ou jusqu'au retrait par l'administrateur ; à l'échéance de la durée fixée ou après retrait, l'état forcé cesse de remplacer l'information reçue automatiquement (R-08) (`CASE-ADMIN-02`).
- [ ] AC-3 — Chaque forçage enregistre son auteur, sa date et son motif (R-08) (`CASE-ADMIN-02`).
- [ ] AC-4 — En l'absence de source automatique d'état, l'administrateur saisit l'état à la main (CDC §1) (`CASE-ADMIN-02`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Imposer les libellés ouvert / fermé / désactivé comme seules valeurs de forçage | Refusée | REQ-021 ne les énumère pas pour le forçage ; placé en « Ce qui n'est pas défini » |
| Distinction « forcer » vs « corriger » | Traitement conjoint | Traitement conjoint sous le mécanisme unique R-08 en l'absence de règle distincte dans le CDC |
| Saisie manuelle sans source (CDC §1) vs R-08 | Saisie simple | CDC §1 ne prescrit que la saisie à la main ; saisie simple sans remplacement de source R-08 |

---

## SPEC-ADMIN-03 — Création, modification et retrait des alertes

**Exigence :** REQ-022 (avec R-11)
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> L'administrateur crée, modifie et retire les alertes, les rattache à une ou plusieurs activités et fixe leur durée. L'administrateur rattache chaque alerte à une ou plusieurs activités précises (sentier ou spot de pêche), choisies une par une, pour une durée fixée ou sans limite.

### Portée

- Couvre la création, la modification et le retrait des alertes par l'administrateur (REQ-022).
- Couvre le rattachement obligatoire de chaque alerte à une ou plusieurs activités précises (sentier ou spot de pêche), choisies une par une (REQ-022, R-11).
- Couvre la durée des alertes (REQ-022 : l'administrateur fixe leur durée ; R-11 : durée fixée ou sans limite).
- Couvre la cessation du caractère « en cours » après retrait par l'administrateur (REQ-022) ou à l'échéance d'une durée fixée (R-11) ; après retrait ou à l'échéance, l'alerte n'est plus une alerte en cours et n'est plus affichée (R-11, REQ-026).
- Les alertes de cette spécification sont celles gérées par l'administrateur (REQ-022, R-11) ; elles sont distinctes du signalement d'état fermé ou désactivé sur un trajet (REQ-004, R-02 → domaine `TRAIL`) et de l'alerte prioritaire liée aux vigilances officielles (R-19 → domaine `CALC`).
- Ne couvre pas l'affichage des alertes sur les pages et recommandations → `SPEC-ADMIN-04`.
- Ne couvre pas le contenu particulier Réserve naturelle marine / risque requin au-delà du cas réglementaire littoral (REQ-027, R-11) → `SPEC-ADMIN-04`.
- Ne couvre pas une carte précise des zones réglementées en mer → hors périmètre (CDC §6).

### Scénarios nominaux

```gherkin
Scénario : Création d'une alerte rattachée à des activités
  Étant donné un administrateur authentifié (R-16)
  Et au moins un sentier ou un spot de pêche du référentiel interne (REQ-032)
  Quand l'administrateur crée une alerte
  Et la rattache à une ou plusieurs activités précises (sentier ou spot de pêche), choisies une par une
  Et fixe une durée fixée ou sans limite
  Alors l'alerte est créée avec ces rattachements et cette durée (REQ-022, R-11)

Scénario : Modification d'une alerte existante
  Étant donné un administrateur authentifié (R-16)
  Et une alerte existante rattachée à une activité précise (sentier ou spot de pêche)
  Quand l'administrateur modifie l'alerte (rattachement d'activité et/ou durée ; tout autre attribut de contenu demeure hors CDC — → Ce qui n'est pas défini)
  Alors les modifications sont enregistrées et l'alerte est mise à jour (REQ-022, R-11)

Scénario : Retrait d'une alerte
  Étant donné un administrateur authentifié (R-16)
  Et une alerte existante
  Quand l'administrateur retire l'alerte
  Alors l'alerte est retirée (REQ-022) et n'est plus une alerte en cours au sens de l'affichage (R-11, REQ-026)

Scénario : Fin d'une alerte à l'échéance de sa durée fixée
  Étant donné une alerte rattachée à une activité précise (sentier ou spot de pêche) pour une durée fixée
  Quand la durée fixée est écoulée
  Alors l'alerte n'est plus une alerte en cours au sens de l'affichage et n'est plus affichée (R-11, REQ-026)
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Utilisateur non administrateur | Ne peut pas créer, modifier ni retirer d'alerte (REQ-022, REQ-106 ; SPEC-ADMIN-01) |
| 2 | Durée fixée de l'alerte écoulée | À l'échéance de la durée fixée, l'alerte n'est plus une alerte en cours au sens de l'affichage et n'est plus affichée (R-11, REQ-026) |
| 3 | Activité absente des référentiels internes | Activité absente des référentiels internes : hors périmètre (CDC §6 « Sentiers et spots absents des référentiels internes ») ; seuls les sentiers et spots de REQ-032 sont opérables (dépendance domaine REF) |
| 4 | Tentative de rattacher une alerte à un secteur géographique global | Impossible : R-11 impose des activités précises (sentier ou spot de pêche) choisies une par une (pas de secteur géographique à part ; hors périmètre carte CDC §6) |
| 5 | Modification retirant le dernier rattachement d'activité | Impossible : R-11 exige qu'une alerte reste rattachée à une ou plusieurs activités précises (sentier ou spot de pêche ; pas de brouillon sans activité) |

### Ce qui n'est pas défini

- *24/11/2026* — Champs de contenu d'une alerte générique (titre, texte, sévérité, etc.) au-delà de l'existence de l'alerte, de son rattachement (REQ-022, R-11) et, pour les alertes réglementaires du littoral, de l'invitation obligatoire à vérifier la réglementation locale sur place (REQ-027 → SPEC-ADMIN-04).
- *24/11/2026* — Représentation technique de « sans limite » pour une alerte.
- *25/11/2026* — Statut d'alerte sans rattachement : exclu conformément à R-11 qui impose le rattachement direct de chaque alerte à des activités précises dès sa création.

### Critères d'acceptation

- [ ] AC-1 — L'administrateur peut créer, modifier et retirer des alertes (`CASE-ADMIN-03`).
- [ ] AC-2 — Chaque alerte est rattachée à une ou plusieurs activités précises (sentier ou spot de pêche), choisies une par une (REQ-022, R-11) (`CASE-ADMIN-03`).
- [ ] AC-3 — L'administrateur fixe une durée fixée ou sans limite lors de la création ou modification d'une alerte (REQ-022, R-11) (`CASE-ADMIN-03`).
- [ ] AC-4 — Après retrait par l'administrateur (REQ-022) ou à l'échéance d'une durée fixée, l'alerte n'est plus une alerte en cours au sens de l'affichage (R-11, REQ-026) (`CASE-ADMIN-03`).
- [ ] AC-5 — Un utilisateur non administrateur ne peut ni créer, ni modifier, ni retirer d'alerte (REQ-022, REQ-106) (`CASE-ADMIN-03`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Modèle de données alerte (sévérité, zone géographique) | Refusée | CDC : rattachement à des activités précises, sans secteur géographique à part (R-11) ; pas de schéma de champs imposé |
| Cas limite pour alerte sans activité | Refusée | Non conforme à R-11 qui impose le rattachement de chaque alerte à une ou plusieurs activités précises (pas de brouillon sans activité) |
| Types d'activité et attribution | Refusée | Non sourcée dans le CDC : R-11 rattache directement chaque alerte aux activités précises (sentier ou spot de pêche) sans couche intermédiaire de « types d'activité » ; la contrainte littoral → spots concernés relève de REQ-027 et CDC §1 (SPEC-ADMIN-04) |
| Fin automatique à l'échéance d'une durée fixée | Acceptée (reformulée) | À l'échéance de la durée fixée, l'alerte n'est plus une alerte en cours (R-11, REQ-026) et n'est plus affichée ; le terme « retirer » reste réservé à l'action de l'administrateur (REQ-022) |

---

## SPEC-ADMIN-04 — Affichage des alertes et alertes réglementaires du littoral

**Exigence :** REQ-026, REQ-027 (avec R-11 ; contrainte 10)
**Statut :** validée
**Version :** v1 (24/11/2026)

### Règle

> Chaque page de sentier ou de spot de pêche, et toute recommandation qui le propose, affiche les alertes en cours qui lui sont rattachées. *(REQ-026)*
> Les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) sont créées par l'administrateur sur les spots concernés et invitent à vérifier la réglementation locale sur place. *(REQ-027, contrainte 10)*
> La présence de la Réserve naturelle marine et le risque requin sont des alertes de ce type, sans traitement particulier. *(R-11)*

### Portée

- Couvre la garantie transverse d'obligation d'affichage des alertes en cours sur la page d'un sentier ou d'un spot de pêche, et dans toute recommandation qui le propose (REQ-026, R-11) ; la réalisation des écrans des pages sentier/spot et des recommandations relève des domaines `TRAIL`, `PECHE` et `COMP`.
- Les alertes visées par cette garantie d'affichage sont celles gérées par l'administrateur (REQ-022, R-11) ; cette obligation ne préjuge pas du signalement d'état fermé ou désactivé sur un trajet (REQ-004, R-02 → domaine `TRAIL`) ni de l'alerte prioritaire de vigilance officielle (R-19 → domaine `CALC`).
- Une alerte est « en cours » tant qu'elle n'a pas été retirée par l'administrateur et, si elle a une durée fixée, tant que cette durée n'est pas écoulée (à l'échéance, elle n'est plus une alerte en cours — `SPEC-ADMIN-03`, R-11, REQ-026).
- Couvre les alertes réglementaires du littoral (Réserve naturelle marine, risque requin) créées par l'administrateur sur les spots de pêche concernés (REQ-027, CDC §1, contrainte 10), conformément à R-11 (« sans traitement particulier » : même mécanisme d'alerte que les autres).
- Couvre l'invitation à vérifier la réglementation locale sur place (REQ-027).
- Couvre le fait que Réserve naturelle marine et risque requin sont des alertes de ce type, sans traitement particulier (R-11).
- Ne couvre pas la mécanique générale de création, modification et retrait des alertes qui relève de `SPEC-ADMIN-03` ; `SPEC-ADMIN-04` couvre la garantie d'affichage (REQ-026) et les obligations spécifiques aux alertes réglementaires du littoral (REQ-027, invitation à vérifier la réglementation locale, R-11).
- Ne couvre pas une carte précise des zones réglementées en mer → hors périmètre (CDC §6).

### Scénarios nominaux

```gherkin
Scénario : Affichage des alertes en cours sur une activité
  Étant donné un utilisateur authentifié (R-16)
  Et un sentier ou un spot de pêche
  Et une ou plusieurs alertes en cours qui lui sont rattachées
  Quand l'utilisateur consulte la page de cette activité
  Ou qu'une recommandation propose cette activité
  Alors les alertes en cours rattachées sont affichées (REQ-026, R-11)

Scénario : Alerte réglementaire du littoral sur des spots concernés
  Étant donné un administrateur authentifié (R-16)
  Et des spots de pêche concernés du référentiel interne (REQ-032)
  Quand l'administrateur crée une alerte Réserve naturelle marine ou risque requin rattachée à ces spots selon SPEC-ADMIN-03
  Alors l'alerte invite à vérifier la réglementation locale sur place (REQ-027)
  Et la Réserve naturelle marine et le risque requin sont des alertes de ce type au sens de R-11, sans traitement particulier

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
| 2 | Alerte retirée par l'administrateur | N'est plus une alerte en cours ; non affichée (REQ-022, R-11, REQ-026) |
| 3 | Durée fixée de l'alerte écoulée | À l'échéance de la durée fixée, l'alerte n'est plus une alerte en cours ; non affichée (R-11, REQ-026 ; `SPEC-ADMIN-03`) |
| 4 | Rattachement d'une alerte Réserve naturelle marine / risque requin à un sentier | Même mécanisme d'alerte que les autres (R-11 « sans traitement particulier ») ; le CDC situe la création normative sur les spots concernés (REQ-027, CDC §1) sans formuler d'interdiction ni de contrôle distinct |

### Ce qui n'est pas défini

- *24/11/2026* — Libellé exact du message d'invitation à vérifier la réglementation locale (REQ-027 impose l'invitation obligatoire, pas son texte exact).
- *24/11/2026* — Liste nominative des spots de pêche « concernés » par la Réserve naturelle marine ou le risque requin (CDC §1 situe la Réserve sur la côte ouest et REQ-027 cite les spots concernés, sans fournir la liste exhaustive dans le CDC ; aucun périmètre géographique arbitraire n'est inventé).

### Critères d'acceptation

- [ ] AC-1 — Sur la page d'un sentier ou d'un spot de pêche, les alertes en cours qui lui sont rattachées sont affichées (REQ-026, R-11) (`CASE-ADMIN-04`).
- [ ] AC-2 — Toute recommandation qui propose l'activité affiche ces alertes en cours (REQ-026, R-11) (`CASE-ADMIN-04`).
- [ ] AC-3 — Les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) sont créées par l'administrateur sur les spots de pêche concernés et invitent à vérifier la réglementation locale sur place lors de leur affichage sur la page du spot ou dans une recommandation (REQ-027, REQ-026, contrainte 10) (`CASE-ADMIN-04`).
- [ ] AC-4 — Réserve naturelle marine et risque requin sont des alertes de ce type, sans traitement particulier (R-11) (`CASE-ADMIN-04`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| Hardcoder Réserve naturelle marine / requin hors modèle d'alertes | Refusée | R-11 : sans traitement particulier ; R-15 supprimée |
| Délimiter la « côte ouest » en polygone | Refusée | Hors périmètre carte ; rattachement aux spots (CDC §6, R-11) |
| Rejet alerte littoral sur sentier | Refusée | R-11 impose « sans traitement particulier » (même mécanisme d'alerte que les autres) ; le CDC situe la création normative sur les spots de pêche concernés (REQ-027, CDC §1) sans formuler d'interdiction ni de contrôle distinct |
