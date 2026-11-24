# Spécifications — Comptes, profil et RGPD

**Domaine :** `AUTH`

---

## SPEC-AUTH-01 — Inscription

**Exigence :** REQ-015, REQ-017, REQ-018, REQ-020 (avec règles R-13, R-14, R-16)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Toute personne de 15 ans ou plus peut créer un compte. L'inscription n'aboutit
> qu'après acceptation des conditions d'utilisation, et comprend le recueil du
> consentement aux données de forme physique ainsi que le classement des sports favoris.

### Portée

- Couvre le parcours de création du compte : identifiant, mot de passe, attestation d'âge, acceptation des CGU, choix du consentement, classement des sports favoris.
- Couvre le refus de l'inscription quand une étape obligatoire manque.
- Ne couvre pas le détail du consentement et de son retrait → `SPEC-AUTH-05`.
- Ne couvre pas la saisie des données de profil → `SPEC-AUTH-06`.
- Ne couvre pas les règles de robustesse et de conservation du mot de passe → `SPEC-AUTH-04`.
- Ne couvre pas la création des comptes administrateurs, faite par l'équipe → `SPEC-ADMIN-nn`.
- Ne couvre pas la rédaction juridique des CGU et de la politique de confidentialité (modèle fourni par l'équipe, validé par le client : REQ-020 ; `ZO-12`, à valider à la recette selon CR-001/§6) → hors périmètre.

### Scénarios nominaux

```gherkin
Scénario : Inscription complète avec consentement
  Étant donné un visiteur sans compte
  Quand il saisit un identifiant et un mot de passe valides
  Et il atteste avoir 15 ans ou plus
  Et il accepte les conditions d'utilisation
  Et il donne son consentement aux données de forme physique
  Et il classe ses sports favoris : 1. trail, 2. pêche
  Alors son compte est créé
  Et il est connecté
  Et le formulaire de profil facultatif lui est proposé

Scénario : Inscription sans consentement aux données de forme
  Étant donné un visiteur sans compte
  Quand il complète l'inscription en acceptant les CGU
  Et il refuse le consentement aux données de forme physique
  Alors son compte est créé
  Et aucune donnée de forme physique ne peut être enregistrée
  Et les valeurs par défaut s'appliquent, avec un avertissement

Scénario : CGU non acceptées
  Étant donné un visiteur en cours d'inscription
  Quand il valide sans cocher l'acceptation des conditions d'utilisation
  Alors l'inscription est refusée
  Et un message indique que l'acceptation des CGU est obligatoire
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Le visiteur déclare avoir moins de 15 ans | Inscription refusée, message expliquant la limite d'âge ; aucune donnée conservée |
| 2 | Identifiant déjà utilisé par un autre compte | Inscription refusée avec un message neutre, sans révéler d'information sur le compte existant au-delà du nécessaire |
| 3 | Le visiteur abandonne le parcours avant la fin | Aucun compte créé, aucune donnée conservée |
| 4 | Le visiteur ne classe pas ses sports favoris | Classement par défaut paramétrable appliqué et signalé ; modifiable ensuite (`SPEC-AUTH-07`) |
| 5 | Le visiteur veut lire les CGU ou la politique de confidentialité avant d'accepter | Les deux documents sont consultables depuis le parcours sans perdre la saisie en cours |
| 6 | Tentative d'accès à une page de l'application sans compte | Redirection vers la connexion ou l'inscription (R-16) |

### Ce qui n'est pas défini

- *24/11/2026* — Mode de vérification des 15 ans : hypothèse retenue = attestation déclarative (case à cocher), distincte de l'âge du profil, qui reste facultatif. L'attestation est une condition d'éligibilité du compte et non une donnée de forme physique : elle est conservée avec le compte et n'est pas touchée par la modification, l'effacement de l'âge ou le retrait du consentement (`SPEC-AUTH-05`, `SPEC-AUTH-06`). À confirmer avec le client.
- *24/11/2026* — Nature de l'identifiant : hypothèse retenue = adresse électronique, nécessaire à la réinitialisation du mot de passe (`SPEC-AUTH-03`). Vérification de l'adresse à l'inscription : non demandée, non prévue.
- *24/11/2026* — Classement par défaut si l'utilisateur ne classe pas ses sports : hypothèse retenue = trail puis pêche, paramétrable.

### Critères d'acceptation

- [ ] AC-1 — Un visiteur qui remplit toutes les étapes obtient un compte et est connecté (`CASE-AUTH-01`).
- [ ] AC-2 — Sans acceptation des CGU, aucun compte n'est créé (`CASE-AUTH-02`).
- [ ] AC-3 — Une déclaration de moins de 15 ans bloque l'inscription (`CASE-AUTH-03`).
- [ ] AC-4 — Un identifiant déjà utilisé est refusé (`CASE-AUTH-04`).
- [ ] AC-5 — Un refus du consentement n'empêche pas l'inscription et aucune donnée de forme n'est enregistrée (`CASE-AUTH-05`).
- [ ] AC-6 — La date d'acceptation des CGU, l'attestation d'âge et le choix de consentement sont enregistrés avec le compte (`CASE-AUTH-06`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-02 — Connexion, déconnexion et accès authentifié

**Exigence :** REQ-015 (avec règle R-16)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Toute utilisation de l'application exige d'être connecté. Un utilisateur connecté
> retrouve son profil et son classement des sports sur tous ses appareils, et peut
> se déconnecter à tout moment.

### Portée

- Couvre la connexion par identifiant et mot de passe, la déconnexion et le maintien de la session.
- Couvre l'interdiction de toute consultation sans compte (R-16).
- Couvre la disponibilité du profil et du classement des sports sur plusieurs appareils (REQ-015 ; `ZO-24`, tranchée et validée par le client, CR-001/§5.2 n° 17 : « profil et classement des sports seulement »).
- Ne couvre pas le blocage après échecs → `SPEC-AUTH-04`.
- Ne couvre pas le mot de passe oublié → `SPEC-AUTH-03`.
- Ne couvre pas l'accès à l'espace d'administration → `SPEC-ADMIN-nn`.
- Ne couvre pas la synchronisation des recherches, itinéraires ou historiques de sortie → hors périmètre (`ZO-24`, tranchée : seuls profil et classement sont retrouvés).

### Scénarios nominaux

```gherkin
Scénario : Connexion réussie
  Étant donné un utilisateur inscrit
  Quand il saisit son identifiant et son mot de passe corrects
  Alors il accède à l'application
  Et son profil et son classement des sports sont chargés

Scénario : Même compte sur un second appareil
  Étant donné un utilisateur qui a renseigné sa VMA sur son smartphone
  Quand il se connecte depuis un autre appareil
  Alors il retrouve la même VMA et le même classement des sports

Scénario : Déconnexion
  Étant donné un utilisateur connecté
  Quand il se déconnecte
  Alors sa session est fermée sur cet appareil
  Et toute nouvelle page demandée le renvoie vers la connexion
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Identifiant inconnu ou mot de passe erroné | Même message générique dans les deux cas (« identifiant ou mot de passe incorrect ») |
| 2 | Lien direct vers une page interne sans session | Redirection vers la connexion, puis retour à la page demandée après connexion |
| 3 | Session expirée pendant l'utilisation | L'utilisateur est invité à se reconnecter ; aucune donnée d'un autre compte n'est affichée |
| 4 | Compte supprimé entre-temps | Connexion refusée avec le message générique |
| 5 | Pas de connexion internet | Écran d'indisponibilité (`SPEC-ARCH-nn`), aucune tentative de connexion hors ligne |

### Ce qui n'est pas défini

- *24/11/2026* — Durée de validité d'une session sans activité : à paramétrer, valeur à proposer par l'équipe.
- *24/11/2026* — Déconnexion de tous les appareils à la fois : non demandée, non prévue.

### Critères d'acceptation

- [ ] AC-1 — Avec des identifiants corrects, l'utilisateur accède à l'application (`CASE-AUTH-07`).
- [ ] AC-2 — Identifiant inconnu et mot de passe erroné produisent le même message (`CASE-AUTH-08`).
- [ ] AC-3 — Aucune page fonctionnelle n'est accessible sans session (`CASE-AUTH-09`).
- [ ] AC-4 — Après déconnexion, les pages internes ne sont plus accessibles (`CASE-AUTH-10`).
- [ ] AC-5 — Le profil et le classement modifiés sur un appareil sont retrouvés sur un autre (`CASE-AUTH-11`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-03 — Réinitialisation du mot de passe

**Exigence :** REQ-015, REQ-114
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Un utilisateur qui a oublié son mot de passe peut en définir un nouveau grâce à
> un lien à usage unique et à durée limitée envoyé à son adresse. L'ancien mot de
> passe cesse alors d'être valable.

### Portée

- Couvre la demande de réinitialisation, l'envoi du lien, la saisie du nouveau mot de passe.
- Couvre l'invalidation de l'ancien mot de passe et du lien utilisé.
- Ne couvre pas le changement de mot de passe depuis le profil, par un utilisateur connecté qui connaît son mot de passe actuel → en attente de confirmation client (voir « Ce qui n'est pas défini »). En attendant, un utilisateur connecté peut passer par ce parcours de réinitialisation.
- Ne couvre pas les règles de robustesse du mot de passe → `SPEC-AUTH-04`.

### Scénarios nominaux

```gherkin
Scénario : Réinitialisation réussie
  Étant donné un utilisateur inscrit avec l'adresse "julien@exemple.re"
  Quand il demande la réinitialisation pour cette adresse
  Alors un lien de réinitialisation lui est envoyé
  Quand il ouvre le lien et saisit un nouveau mot de passe valide
  Alors le nouveau mot de passe permet de se connecter
  Et l'ancien mot de passe est refusé

Scénario : Demande pour une adresse inconnue
  Étant donné aucune inscription avec l'adresse "inconnu@exemple.re"
  Quand une réinitialisation est demandée pour cette adresse
  Alors le même message de confirmation s'affiche que pour une adresse connue
  Et aucun lien n'est envoyé
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Lien expiré | Refus avec invitation à refaire une demande |
| 2 | Lien déjà utilisé | Refus, le lien ne fonctionne qu'une fois |
| 3 | Plusieurs demandes successives | Seul le dernier lien émis est valable |
| 4 | Nouveau mot de passe non conforme | Refus avec le motif, le lien reste valable jusqu'à expiration |
| 5 | Compte bloqué après échecs (`SPEC-AUTH-04`) | La réinitialisation réussie lève le blocage |

### Ce qui n'est pas défini

- *24/11/2026* — Changement de mot de passe depuis le profil connecté : REQ-015 ne cite que la création du compte, la connexion, la déconnexion et la réinitialisation du mot de passe ; CR-001/Q23 ne précise rien de plus. Question à poser au client : attend-il aussi cette fonction ? Si oui, elle fera l'objet d'une spec distincte.
- *24/11/2026* — Durée de validité du lien : à paramétrer, valeur à proposer par l'équipe.
- *24/11/2026* — Envoi du lien pendant la démonstration en local (sans service payant) : moyen de réception de test à définir avec l'architecture (`SPEC-ARCH-nn`).

### Critères d'acceptation

- [ ] AC-1 — Après réinitialisation, seul le nouveau mot de passe est accepté (`CASE-AUTH-12`).
- [ ] AC-2 — La réponse est identique pour une adresse connue et inconnue (`CASE-AUTH-13`).
- [ ] AC-3 — Un lien expiré ou déjà utilisé est refusé (`CASE-AUTH-14`).
- [ ] AC-4 — Seul le dernier lien émis est valable (`CASE-AUTH-15`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-04 — Sécurité des identifiants

**Exigence :** REQ-114 (avec REQ-115 pour le paramétrage)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Aucun mot de passe n'est conservé ni affiché en clair. Après un nombre paramétrable
> d'échecs de connexion consécutifs, la connexion au compte est bloquée pendant une
> durée paramétrable.

### Portée

- Couvre la conservation non réversible des mots de passe et leur non-affichage.
- Couvre la règle minimale de robustesse à la création et à la réinitialisation.
- Couvre le blocage temporaire après échecs consécutifs et sa levée.
- Ne couvre pas les attaques réseau, la protection de l'infrastructure → `SPEC-ARCH-nn`.
- Ne couvre pas l'authentification à plusieurs facteurs → hors périmètre.

### Scénarios nominaux

```gherkin
Scénario : Blocage après échecs consécutifs
  Étant donné un seuil de blocage paramétré à 5 échecs et une durée de 15 minutes
  Et un utilisateur inscrit
  Quand 5 tentatives consécutives échouent pour son compte
  Alors la connexion à ce compte est refusée pendant 15 minutes, même avec le bon mot de passe
  Et un message indique que le compte est temporairement bloqué

Scénario : Fin du blocage
  Étant donné un compte bloqué depuis plus de 15 minutes
  Quand l'utilisateur saisit le bon mot de passe
  Alors il est connecté
  Et le compteur d'échecs est remis à zéro

Scénario : Mot de passe jamais conservé en clair
  Étant donné un utilisateur inscrit avec un mot de passe
  Quand on consulte les données enregistrées pour ce compte
  Alors le mot de passe n'y figure pas en clair et ne peut pas être reconstitué
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Connexion réussie après 4 échecs (seuil 5) | Connexion acceptée, compteur remis à zéro |
| 2 | Échecs répartis sur plusieurs appareils | Ils comptent ensemble : le compteur est porté par le compte |
| 3 | Échecs sur un identifiant inconnu | Aucun compte bloqué ; même message générique qu'un compte existant |
| 4 | Mot de passe trop court à l'inscription | Refus avec le motif |
| 5 | Mot de passe dans un message, un export ou un journal | Interdit : il n'apparaît dans aucun affichage, export (`SPEC-AUTH-09`) ou journal |

### Ce qui n'est pas défini

- *24/11/2026* — Nombre d'échecs et durée du blocage (REQ-114 « à fixer ») : proposition 5 échecs, 15 minutes, paramétrables. À valider à la recette.
- *24/11/2026* — Règle de robustesse : proposition longueur minimale de 8 caractères. À valider.

### Critères d'acceptation

- [ ] AC-1 — Les mots de passe sont conservés sous forme non réversible (`CASE-AUTH-16`).
- [ ] AC-2 — Le compte est bloqué au seuil d'échecs et débloqué après la durée paramétrée (`CASE-AUTH-17`).
- [ ] AC-3 — Une connexion réussie remet le compteur à zéro (`CASE-AUTH-18`).
- [ ] AC-4 — Modifier le seuil ou la durée dans le paramétrage change le comportement sans modifier l'application (`CASE-AUTH-19`).
- [ ] AC-5 — Un mot de passe non conforme est refusé (`CASE-AUTH-20`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-05 — Consentement et politique de confidentialité

**Exigence :** REQ-018, REQ-019 (avec règles R-13, R-17 ; ZO-26, ZO-33)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Les données de forme physique (âge, poids, taille, VMA) ne sont enregistrées
> qu'avec un consentement explicite, recueilli dans le parcours de création du compte.
> Le retrait du consentement efface ces données ; les valeurs par défaut s'appliquent alors.

### Portée

- Couvre le recueil du consentement (non pré-coché) à l'inscription, et son octroi ultérieur depuis le profil.
- Couvre le retrait du consentement et l'effacement des données de forme.
- Couvre la consultation de la politique de confidentialité à tout moment.
- Ne couvre pas la saisie et le contrôle des valeurs du profil → `SPEC-AUTH-06`.
- Ne couvre pas la qualification juridique des données (ZO-33) ni la durée de conservation (ZO-26) → en attente client.

### Scénarios nominaux

```gherkin
Scénario : Retrait du consentement
  Étant donné un utilisateur ayant consenti et renseigné une VMA de 14 km/h et un poids de 70 kg
  Quand il retire son consentement depuis son profil
  Alors sa VMA, son poids, sa taille et son âge sont effacés
  Et la date du retrait est enregistrée
  Et les valeurs par défaut s'appliquent aux calculs, avec un avertissement
  Et son compte, son attestation d'âge et son classement des sports sont conservés

Scénario : Consentement donné après l'inscription
  Étant donné un utilisateur inscrit sans consentement
  Quand il donne son consentement depuis son profil
  Alors il peut saisir ses données de forme physique
  Et la date de ce consentement est enregistrée

Scénario : Consultation de la politique de confidentialité
  Étant donné un utilisateur connecté
  Quand il ouvre la politique de confidentialité depuis son compte
  Alors le document en vigueur s'affiche
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Case de consentement pré-cochée | Interdit : le consentement est un geste actif de l'utilisateur |
| 2 | Tentative de saisie d'une donnée de forme sans consentement | Champs non disponibles ; un message invite à consentir |
| 3 | Retrait du consentement sans aucune donnée saisie | Retrait enregistré, aucun effet sur les calculs (déjà aux valeurs par défaut) |
| 4 | Retrait puis nouveau consentement | Les données effacées ne reviennent pas ; l'utilisateur doit les ressaisir |
| 5 | Calcul en cours d'affichage au moment du retrait | Les calculs suivants utilisent les valeurs par défaut |
| 6 | Effacement de l'âge du profil (par retrait ou par l'utilisateur) | L'éligibilité du compte n'est pas remise en cause : elle repose sur l'attestation d'âge de l'inscription (`SPEC-AUTH-01`) |
| 7 | Historique du consentement après retrait | Les dates d'octroi et de retrait sont conservées comme preuve du consentement ; ce ne sont pas des données de forme physique, R-13 ne les vise pas. Elles sont effacées avec le compte (`SPEC-AUTH-10`) |

### Ce qui n'est pas défini

- *24/11/2026* — Durée de conservation des données personnelles (ZO-26) : à fixer par le client. Elle s'applique aussi à l'historique du consentement (dates d'octroi et de retrait), conservé tant que le compte existe.
- *24/11/2026* — Qualification RGPD de l'âge, du poids, de la taille et de la VMA en données de santé (ZO-33) : à trancher avec le client ; le consentement explicite est maintenu en attendant.
- *24/11/2026* — Contenu de la politique de confidentialité : modèle fourni par l'équipe, validé par le client (REQ-020 ; `ZO-12`, à valider à la recette selon CR-001/§6).

### Critères d'acceptation

- [ ] AC-1 — Le consentement n'est jamais pré-coché et sa date est enregistrée (`CASE-AUTH-21`).
- [ ] AC-2 — Sans consentement, aucune donnée de forme ne peut être enregistrée (`CASE-AUTH-22`).
- [ ] AC-3 — Le retrait efface les 4 données de forme et rétablit les valeurs par défaut signalées (`CASE-AUTH-23`).
- [ ] AC-4 — Le retrait ne supprime ni le compte, ni l'attestation d'âge, ni le classement des sports, et sa date est enregistrée (`CASE-AUTH-24`).
- [ ] AC-5 — La politique de confidentialité est consultable à l'inscription et depuis le compte (`CASE-AUTH-25`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-06 — Profil facultatif et valeurs par défaut

**Exigence :** REQ-016, REQ-115 (avec règles R-17, R-20)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'âge, le poids, la taille et la VMA sont facultatifs. Une saisie hors des plages
> plausibles est refusée. Une donnée absente est remplacée par une valeur par défaut
> paramétrable, et l'utilisateur en est averti.

### Portée

- Couvre la saisie, la modification et l'effacement de chacune des 4 données.
- Couvre le contrôle des plages plausibles fixées par l'équipe (REQ-016).
- Couvre la fourniture aux autres domaines de la valeur effective (saisie ou par défaut) et de son origine.
- Ne couvre pas l'usage de ces valeurs dans les calculs (temps, eau, nourriture, niveau) → `SPEC-CALC-nn`.
- Ne couvre pas le paramétrage technique des valeurs par défaut → `SPEC-ARCH-nn`.
- Ne couvre pas d'autres données de profil (Q20) ni l'apprentissage après sortie (Q22) → hors périmètre.

### Scénarios nominaux

```gherkin
Scénario : Saisie d'une VMA valide
  Étant donné un utilisateur ayant consenti aux données de forme
  Quand il saisit une VMA de 14 km/h
  Alors la VMA est enregistrée
  Et les calculs utilisent 14 km/h sans avertissement de valeur par défaut

Scénario : Saisie hors plage plausible
  Étant donné un utilisateur ayant consenti aux données de forme
  Quand il saisit un poids de 500 kg
  Alors la saisie est refusée
  Et un message indique la plage acceptée

Scénario : Profil partiellement renseigné
  Étant donné un utilisateur ayant renseigné son poids mais pas sa VMA
  Quand un calcul a besoin de la VMA
  Alors la VMA par défaut paramétrée est utilisée
  Et l'utilisateur est averti que sa VMA n'est pas renseignée
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Valeur exactement égale à une borne | Acceptée (bornes incluses) |
| 2 | Valeur non numérique ou négative | Refusée avec message |
| 3 | Valeur décimale (ex. VMA 13,5) | Acceptée pour le poids, la taille et la VMA ; âge en années entières |
| 4 | L'utilisateur efface une donnée déjà saisie | Donnée supprimée, valeur par défaut appliquée et signalée |
| 5 | Les 4 données absentes | Tous les calculs en valeurs par défaut ; un seul avertissement global suffit |
| 6 | Valeur par défaut modifiée dans le paramétrage | Les calculs suivants des utilisateurs sans saisie utilisent la nouvelle valeur |
| 7 | Âge du profil saisi sous 15 ans | Refusé comme hors plage ; l'attestation d'âge et le compte restent inchangés |
| 8 | Âge du profil effacé | Seule la valeur de calcul est concernée ; l'éligibilité du compte (attestation, `SPEC-AUTH-01`) ne change pas |

### Ce qui n'est pas défini

- *24/11/2026* — Plages plausibles (REQ-016, fixées par l'équipe) : proposition âge 15–100 ans, poids 30–250 kg, taille 120–230 cm, VMA 6–25 km/h. À valider à la recette.
- *24/11/2026* — Valeurs par défaut (paramétrables, REQ-115) : à proposer avec les règles de calcul (`SPEC-CALC-nn` ; `ZO-05`, règles de calcul à valider à la recette selon CR-001/§6).

### Critères d'acceptation

- [ ] AC-1 — Chacune des 4 données peut être saisie, modifiée et effacée (`CASE-AUTH-26`).
- [ ] AC-2 — Une valeur hors plage est refusée avec un message, bornes incluses acceptées (`CASE-AUTH-27`).
- [ ] AC-3 — Une donnée absente est remplacée par la valeur par défaut et l'utilisateur est averti (`CASE-AUTH-28`).
- [ ] AC-4 — Le profil indique, pour chaque donnée, si la valeur est saisie ou par défaut (`CASE-AUTH-29`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-07 — Classement des sports favoris

**Exigence :** REQ-017 (avec règle R-12)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'utilisateur classe ses sports favoris, trail et pêche, par ordre de préférence
> à l'inscription, et peut modifier ce classement dans son profil. Ce classement
> ne sert qu'à départager deux activités jugées équivalentes.

### Portée

- Couvre le classement ordinal (1er, 2e) des deux sports et sa modification.
- Ne couvre pas son usage dans le comparateur → `SPEC-COMP-nn`.
- Ne couvre pas l'ajout d'autres sports → hors périmètre (Q05).

### Scénarios nominaux

```gherkin
Scénario : Modification du classement
  Étant donné un utilisateur dont le classement est 1. trail, 2. pêche
  Quand il place la pêche en premier dans son profil
  Alors son classement devient 1. pêche, 2. trail
  Et ce classement est utilisé par les comparaisons suivantes
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Même rang donné aux deux sports | Refusé : chaque rang est unique |
| 2 | Aucun classement fourni | Classement par défaut paramétrable, signalé (`SPEC-AUTH-01`) |
| 3 | Retrait du consentement aux données de forme | Le classement est conservé : il ne relève pas des données de forme |

### Ce qui n'est pas défini

- *24/11/2026* — Possibilité de n'indiquer qu'un seul sport favori : non demandée ; hypothèse retenue = les deux sports sont toujours classés.

### Critères d'acceptation

- [ ] AC-1 — Le classement saisi à l'inscription est enregistré et modifiable dans le profil (`CASE-AUTH-30`).
- [ ] AC-2 — Deux sports ne peuvent pas avoir le même rang (`CASE-AUTH-31`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-08 — Cloisonnement des données

**Exigence :** REQ-105
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Un utilisateur ne peut consulter, modifier, exporter ou supprimer que ses propres
> données. L'administrateur n'a pas accès aux données de profil des utilisateurs.

### Portée

- Couvre chaque opération sur le compte, le profil, le consentement et le classement.
- Ne couvre pas les droits de l'administrateur sur les sentiers et les alertes → `SPEC-ADMIN-nn`.

### Scénarios nominaux

```gherkin
Scénario : Accès croisé refusé
  Étant donné deux utilisateurs A et B connectés chacun sur leur appareil
  Quand A tente de consulter le profil de B en désignant directement son compte
  Alors l'accès est refusé
  Et aucune donnée de B n'est renvoyée
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | A tente de modifier, exporter ou supprimer les données de B | Refusé pour chaque opération, données de B inchangées |
| 2 | A tente de retirer le consentement de B | Refusé |
| 3 | Un administrateur tente de consulter le profil d'un utilisateur | Refusé : l'espace d'administration est limité aux sentiers et aux alertes |
| 4 | Message d'erreur sur un compte d'autrui | Ne confirme pas l'existence du compte visé |

### Ce qui n'est pas défini

- *24/11/2026* — Accès de l'administrateur aux données utilisateur (support, assistance) : non demandé ; hypothèse retenue = aucun accès.

### Critères d'acceptation

- [ ] AC-1 — Pour chacune des opérations consulter, modifier, exporter, supprimer, un accès croisé entre deux comptes est refusé (`CASE-AUTH-32`).
- [ ] AC-2 — Un administrateur n'accède pas aux données de profil des utilisateurs (`CASE-AUTH-33`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-09 — Export des données personnelles

**Exigence :** REQ-019 (avec REQ-105)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'utilisateur peut télécharger à tout moment l'ensemble de ses données personnelles
> dans un format lisible et standard.

### Portée

- Couvre le contenu de l'export : identifiant, date d'inscription, attestation d'âge, date d'acceptation des CGU, historique du consentement (dates d'octroi et de retrait), données de forme renseignées, classement des sports.
- Ne couvre pas l'export `.gpx` des itinéraires → `SPEC-GPX-nn`.

### Scénarios nominaux

```gherkin
Scénario : Export complet
  Étant donné un utilisateur ayant consenti, renseigné sa VMA et classé ses sports
  Quand il demande l'export de ses données
  Alors il télécharge un fichier dans un format standard et lisible
  Et ce fichier contient son identifiant, son attestation d'âge, sa VMA, son classement des sports, la date d'acceptation des CGU et l'historique de son consentement
  Et il ne contient pas son mot de passe

Scénario : Export après retrait du consentement
  Étant donné un utilisateur qui a consenti le 24/11/2026 puis retiré son consentement le 30/11/2026
  Quand il demande l'export de ses données
  Alors le fichier contient la date d'octroi et la date de retrait du consentement
  Et il ne contient aucune donnée de forme physique
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Profil vide | Export produit ; les données absentes sont indiquées comme non renseignées, pas remplacées par les valeurs par défaut |
| 2 | Consentement retiré | L'export ne contient plus de données de forme ; il indique la date du retrait, conservée comme preuve du consentement (`SPEC-AUTH-05`, cas limite 7) |
| 3 | Demandes répétées | Chaque export reflète l'état courant des données |

### Ce qui n'est pas défini

- *24/11/2026* — Format exact de l'export (« standard », ZO-26) : à choisir par l'équipe parmi les formats ouverts courants.

### Critères d'acceptation

- [ ] AC-1 — L'export contient toutes les données personnelles du compte et aucune d'un autre compte (`CASE-AUTH-34`).
- [ ] AC-2 — L'export ne contient jamais le mot de passe (`CASE-AUTH-35`).
- [ ] AC-3 — Les données non renseignées apparaissent comme telles, sans valeur par défaut (`CASE-AUTH-36`).
- [ ] AC-4 — Après un retrait, l'export contient les dates d'octroi et de retrait du consentement et aucune donnée de forme (`CASE-AUTH-40`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-10 — Suppression du compte

**Exigence :** REQ-019 (avec REQ-105 ; ZO-26)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'utilisateur peut supprimer son compte. Après confirmation, son compte et toutes
> ses données personnelles sont effacés et il ne peut plus se connecter.

### Portée

- Couvre la demande, la confirmation explicite et l'effacement des données du compte.
- Couvre la fermeture des sessions ouvertes sur ses appareils.
- Ne couvre pas la conservation éventuelle de certaines données au-delà de la suppression (ZO-26) → en attente client.

### Scénarios nominaux

```gherkin
Scénario : Suppression confirmée
  Étant donné un utilisateur connecté
  Quand il demande la suppression de son compte
  Et il confirme en ressaisissant son mot de passe
  Alors son compte, son profil, son attestation d'âge, l'historique de son consentement et son classement sont effacés
  Et il est déconnecté
  Et une connexion avec ses anciens identifiants est refusée

Scénario : Suppression annulée
  Étant donné un utilisateur qui demande la suppression de son compte
  Quand il annule à l'étape de confirmation
  Alors son compte et ses données restent inchangés
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Mot de passe de confirmation erroné | Suppression refusée ; compte inchangé |
| 2 | Sessions ouvertes sur d'autres appareils | Fermées : la prochaine action renvoie vers la connexion |
| 3 | Nouvelle inscription avec le même identifiant après suppression | Autorisée, comme un nouveau compte sans aucune donnée de l'ancien |
| 4 | Compte administrateur | Hors de ce parcours : géré par l'équipe (`SPEC-ADMIN-nn`) |

### Ce qui n'est pas défini

- *24/11/2026* — Effacement immédiat ou différé, et conservation éventuelle de traces (ZO-26) : hypothèse retenue = effacement immédiat et définitif, en attendant la durée de conservation fixée par le client.
- *24/11/2026* — Proposition d'export avant suppression : non demandée ; recommandée (lien vers `SPEC-AUTH-09` dans l'écran de confirmation).

### Critères d'acceptation

- [ ] AC-1 — Après suppression confirmée, aucune donnée personnelle du compte ne subsiste (`CASE-AUTH-37`).
- [ ] AC-2 — Les anciens identifiants ne permettent plus de se connecter (`CASE-AUTH-38`).
- [ ] AC-3 — Sans confirmation valide, rien n'est supprimé (`CASE-AUTH-39`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |
