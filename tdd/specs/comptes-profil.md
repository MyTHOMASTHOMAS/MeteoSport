# Spécifications — Comptes, profil et RGPD

**Domaine :** `AUTH`

---

## SPEC-AUTH-01 — Inscription

**Exigence :** REQ-015, REQ-017, REQ-018, REQ-020 (avec règles R-13, R-14, R-16)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Toute personne de 15 ans ou plus peut créer un compte. L'inscription n'aboutit
> qu'après acceptation des conditions d'utilisation (CGU), et comprend le recueil du
> consentement aux données de forme physique ainsi que le classement des sports favoris.
> Les CGU précisent que l'application est une aide à la décision indicative, qu'elle
> ne remplace pas les bulletins officiels, et contiennent une clause de
> non-responsabilité en cas d'accident (R-14). Les CGU restent consultables à tout
> moment depuis le compte. L'identifiant choisi à l'inscription n'est pas modifiable
> en v1.

### Portée

- Couvre le parcours de création du compte : identifiant, mot de passe, attestation d'âge, acceptation des CGU, choix du consentement, classement des sports favoris.
- Couvre le refus de l'inscription quand une étape obligatoire manque.
- Couvre la consultation des CGU en vigueur depuis le compte, après l'inscription (décision de l'équipe du 25/11/2026).
- Couvre le caractère non modifiable de l'identifiant (adresse électronique) en v1 (décision de l'équipe du 25/11/2026).
- Ne couvre pas le détail du consentement et de son retrait → `SPEC-AUTH-05`.
- Ne couvre pas la saisie des données de profil → `SPEC-AUTH-06`.
- Ne couvre pas les règles de robustesse et de conservation du mot de passe → `SPEC-AUTH-04`.
- Ne couvre pas la création des comptes administrateurs, faite par l'équipe → `SPEC-ADMIN-nn`.
- Ne couvre pas la rédaction juridique des CGU et de la politique de confidentialité : modèle fourni par l'équipe ; le client le fait valider et en porte la responsabilité (REQ-020 ; modèle CGU / confidentialité à faire valider à la recette, CR-001/§6) → hors périmètre. La présence de l'avertissement et de la clause de R-14 dans les CGU présentées reste couverte (AC-7).

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
| 1 | Le visiteur ne coche pas l'attestation « J'atteste avoir 15 ans ou plus » (ou déclare avoir moins de 15 ans) | Inscription refusée, message expliquant la limite d'âge (REQ-015) ; aucun compte créé, aucune donnée conservée |
| 2 | Identifiant déjà utilisé par un autre compte | Inscription refusée : le message indique que l'identifiant est indisponible, sans autre information sur le compte existant. L'existence de l'identifiant est donc révélée à l'inscription : compromis assumé (voir « Ce qui n'est pas défini ») |
| 3 | Le visiteur abandonne le parcours avant la fin | Aucun compte créé, aucune donnée conservée |
| 4 | Le visiteur ne classe pas ses sports favoris | Inscription refusée : le classement est une étape obligatoire de l'inscription (REQ-017) ; un message invite à classer les deux sports. Modifiable ensuite (`SPEC-AUTH-07`) |
| 5 | Le visiteur veut lire les CGU ou la politique de confidentialité avant d'accepter | Les deux documents sont consultables depuis le parcours sans perdre la saisie en cours (REQ-018 pour la politique de confidentialité, REQ-020 pour les CGU ; vérifié par AC-9, `CASE-AUTH-49`, pour les CGU et par `SPEC-AUTH-05` AC-5, `CASE-AUTH-31`, pour la politique) |
| 6 | Tentative d'accès à une page de l'application sans compte | Redirection vers la connexion ou l'inscription (R-16 ; vérifié par `SPEC-AUTH-02` AC-3, `CASE-AUTH-11`) |
| 7 | Mot de passe ne respectant pas la règle de robustesse (`SPEC-AUTH-04`) | Inscription refusée avec un message indiquant les critères attendus ; aucun compte créé |
| 8 | Utilisateur connecté qui veut changer son adresse électronique (identifiant) | Aucune fonction de modification proposée en v1 ; l'identifiant affiché dans le compte n'est pas éditable (décision de l'équipe du 25/11/2026). Pour changer d'adresse, l'utilisateur supprime son compte (`SPEC-AUTH-10`) et en crée un nouveau |
| 9 | Utilisateur connecté qui veut relire les CGU | Les CGU en vigueur sont consultables depuis son compte, comme la politique de confidentialité (`SPEC-AUTH-05`) (décision de l'équipe du 25/11/2026) |

### Ce qui n'est pas défini

- *24/11/2026* — Mode de vérification des 15 ans : hypothèse retenue = attestation déclarative (case à cocher), distincte de l'âge du profil, qui reste facultatif. L'attestation est une condition d'éligibilité du compte et non une donnée de forme physique : elle est conservée avec le compte et n'est pas touchée par la modification, l'effacement de l'âge ou le retrait du consentement (`SPEC-AUTH-05`, `SPEC-AUTH-06`). À confirmer avec le client.
- *24/11/2026* — Nature de l'identifiant : hypothèse retenue = adresse électronique, nécessaire à la réinitialisation du mot de passe (`SPEC-AUTH-03`). Vérification de l'adresse à l'inscription : non demandée, non prévue.
- *24/11/2026* — Identifiant déjà utilisé (cas limite 2) : refuser l'inscription révèle par nature que l'identifiant existe. L'anti-énumération appliquée à la connexion, à la réinitialisation et au blocage (`SPEC-AUTH-02`, `SPEC-AUTH-03`, `SPEC-AUTH-04`) ne s'étend pas à l'inscription. Choix de l'équipe, REQ-114 étant muet sur ce point.
- *25/11/2026* — Enregistrement de la date d'inscription et de la date d'acceptation des CGU (AC-6) : preuve proposée par l'équipe, non exigée par REQ-015, REQ-020 ni R-14. À valider à la recette.
- *25/11/2026* — Identifiant non modifiable et CGU consultables depuis le compte : décisions de l'équipe du 25/11/2026. REQ-015, REQ-020 et R-14 ne traitent pas ces deux points ; ce sont des décisions de conception, pas des exigences du CDC.

### Critères d'acceptation

- [ ] AC-1 — Un visiteur qui remplit toutes les étapes obtient un compte et est connecté (`CASE-AUTH-01`).
- [ ] AC-2 — Sans acceptation des CGU, aucun compte n'est créé (`CASE-AUTH-02`).
- [ ] AC-3 — Sans attestation d'âge cochée (15 ans ou plus), l'inscription est refusée et aucun compte n'est créé (REQ-015) (`CASE-AUTH-03`).
- [ ] AC-4 — Un identifiant déjà utilisé est refusé (`CASE-AUTH-04`).
- [ ] AC-5 — Un refus du consentement n'empêche pas l'inscription et aucune donnée de forme n'est enregistrée (`CASE-AUTH-05`).
- [ ] AC-6 — La date d'inscription, la date d'acceptation des CGU, l'attestation d'âge et le choix de consentement sont enregistrés avec le compte (`CASE-AUTH-06`).
- [ ] AC-7 — Les CGU présentées à l'inscription contiennent l'avertissement « aide à la décision indicative, ne remplace pas les bulletins officiels » et la clause de non-responsabilité en cas d'accident (R-14) (`CASE-AUTH-07`).
- [ ] AC-8 — Sans classement des deux sports favoris, aucun compte n'est créé (REQ-017) (`CASE-AUTH-08`).
- [ ] AC-9 — Les conditions d'utilisation sont consultables depuis le parcours d'inscription, avant leur acceptation, sans perte de la saisie en cours (REQ-020) (`CASE-AUTH-49`, numéroté en fin de chaîne pour ne pas décaler les cas existants).
- [ ] AC-10 — Aucune fonction ne permet à un utilisateur connecté de modifier son identifiant (décision de l'équipe du 25/11/2026) (`CASE-AUTH-50`).
- [ ] AC-11 — Les CGU en vigueur sont consultables depuis le compte d'un utilisateur connecté (décision de l'équipe du 25/11/2026) (`CASE-AUTH-51`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-02 — Connexion, déconnexion et accès authentifié

**Exigence :** REQ-015 (avec règle R-16 ; ZO-26)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Toute utilisation de l'application exige d'être connecté. Un utilisateur connecté
> retrouve son profil et son classement des sports sur tous ses appareils, et peut
> se déconnecter à tout moment. La déconnexion efface les données personnelles
> conservées dans le navigateur de cet appareil.

### Portée

- Couvre la connexion par identifiant et mot de passe, la déconnexion et le maintien de la session.
- Couvre l'interdiction de toute consultation sans compte (R-16). Seuls sont accessibles sans session : connexion, inscription, réinitialisation du mot de passe, et CGU et politique de confidentialité dans le parcours d'inscription (`SPEC-AUTH-01`, cas limite 5) ; hypothèse, voir « Ce qui n'est pas défini ».
- Couvre la disponibilité du profil et du classement des sports sur plusieurs appareils (REQ-015 ; décision validée CR-001/§5.2 n° 17 : « profil et classement des sports seulement »).
- Couvre l'effacement, à la déconnexion, des données personnelles conservées dans le navigateur (stockage local, cache de la PWA) (décision de l'équipe du 25/11/2026). Le moyen technique relève de `SPEC-ARCH-nn`.
- Ne couvre pas le blocage après échecs → `SPEC-AUTH-04`.
- Ne couvre pas le mot de passe oublié → `SPEC-AUTH-03`.
- Ne couvre pas l'accès à l'espace d'administration → `SPEC-ADMIN-nn`.
- Ne couvre pas la synchronisation des recherches, itinéraires ou historiques de sortie → hors périmètre (REQ-015 ; CR-001/§5.2 n° 17 : seuls profil et classement sont retrouvés).

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
  Et ses données personnelles conservées dans le navigateur de cet appareil sont effacées
  Et toute nouvelle page demandée le renvoie vers la connexion
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Identifiant inconnu, mot de passe erroné ou compte bloqué (`SPEC-AUTH-04`) | Un seul message neutre pour tout refus de connexion, dès le premier échec (`SPEC-AUTH-04`) : la réponse ne permet pas de savoir si l'identifiant existe ni si le compte est bloqué |
| 2 | Lien direct vers une page interne sans session | Redirection vers la connexion (R-16). Retour à la page demandée après connexion : hypothèse d'ergonomie (voir « Ce qui n'est pas défini ») |
| 3 | Session expirée pendant l'utilisation | L'utilisateur est invité à se reconnecter ; aucune donnée d'un autre compte n'est affichée |
| 4 | Compte supprimé entre-temps | Connexion refusée avec le message neutre |
| 5 | Pas de connexion internet | Écran d'indisponibilité (`SPEC-ARCH-nn`), aucune tentative de connexion hors ligne |

### Ce qui n'est pas défini

- *24/11/2026* — Durée de validité d'une session sans activité : à paramétrer, valeur à proposer par l'équipe.
- *25/11/2026* — Pages accessibles sans session (connexion, inscription, réinitialisation, CGU et politique de confidentialité avant compte) : R-16 n'énonce pas cette frontière ; hypothèse de l'équipe déduite de `SPEC-AUTH-01` (cas limite 5) et de la nature de ces parcours. À valider à la recette.
- *24/11/2026* — Déconnexion de tous les appareils à la fois : non demandée, non prévue.
- *24/11/2026* — Durée de conservation du profil et du classement conservés pour la reconnexion multi-appareils : ⚠ ZO-26 (REQ-015), à fixer par le client.
- *24/11/2026* — Retour à la page demandée après connexion (cas limite 2) : confort d'usage proposé par l'équipe, non demandé par REQ-015 ni R-16. Non soumis à un critère d'acceptation. À valider à la recette.
- *25/11/2026* — Effacement des données personnelles du navigateur à la déconnexion : non traité par le CDC ; décision de l'équipe du 25/11/2026. Le CDC n'en fait pas une exigence. Liste précise des emplacements à purger et moyen technique : `SPEC-ARCH-nn`.

### Critères d'acceptation

- [ ] AC-1 — Avec des identifiants corrects, l'utilisateur accède à l'application (`CASE-AUTH-09`).
- [ ] AC-2 — Identifiant inconnu, mot de passe erroné et compte bloqué produisent le même message neutre (`CASE-AUTH-10`).
- [ ] AC-3 — Aucune page fonctionnelle n'est accessible sans session (`CASE-AUTH-11`).
- [ ] AC-4 — Après déconnexion, les pages internes ne sont plus accessibles (`CASE-AUTH-12`).
- [ ] AC-5 — Le profil et le classement modifiés sur un appareil sont retrouvés sur un autre (`CASE-AUTH-13`).
- [ ] AC-6 — Une session expirée renvoie vers la connexion sans afficher de donnée d'un autre compte (`CASE-AUTH-14`).
- [ ] AC-7 — Après déconnexion, aucune donnée personnelle du compte (profil, classement, consentement) ne reste dans le stockage local ni dans le cache de la PWA de cet appareil (décision de l'équipe du 25/11/2026) (`CASE-AUTH-52`).

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
- Ne couvre pas le changement de mot de passe depuis le profil, par un utilisateur connecté qui connaît son mot de passe actuel → `SPEC-AUTH-11`.
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
| 5 | Compte bloqué après échecs (`SPEC-AUTH-04`) | La réinitialisation réussie lève le blocage et remet le compteur d'échecs à zéro (décision de l'équipe du 25/11/2026) : un tiers ne peut pas bloquer durablement le titulaire du compte |

### Ce qui n'est pas défini

- *24/11/2026* — Durée de validité du lien : à paramétrer, valeur à proposer par l'équipe.
- *24/11/2026* — Mécanisme de réinitialisation (lien à usage unique, durée limitée, seul le dernier lien valable, réponse identique pour une adresse inconnue) : hypothèse de sécurité de l'équipe issue de REQ-114 ; REQ-015 dit seulement que l'utilisateur « peut réinitialiser son mot de passe ». À valider à la recette.
- *25/11/2026* — Levée du blocage (`SPEC-AUTH-04`) par une réinitialisation réussie (cas limite 5) : non prévue par REQ-114 ; décision de l'équipe du 25/11/2026.
- *25/11/2026* — Effet d'une réinitialisation réussie sur les sessions déjà ouvertes : non traité par le CDC. Hypothèse de l'équipe = elles restent actives, par cohérence avec `SPEC-AUTH-04` (cas limite 7) et `SPEC-AUTH-11`. Sans critère d'acceptation ; à soumettre au client si leur fermeture est souhaitée.
- *24/11/2026* — Envoi du lien pendant la démonstration en local (sans service payant) : moyen de réception de test à définir avec l'architecture (`SPEC-ARCH-nn`).

### Critères d'acceptation

- [ ] AC-1 — Après réinitialisation, seul le nouveau mot de passe est accepté (`CASE-AUTH-15`).
- [ ] AC-2 — La réponse est identique pour une adresse connue et inconnue (`CASE-AUTH-16`).
- [ ] AC-3 — Un lien expiré ou déjà utilisé est refusé (`CASE-AUTH-17`).
- [ ] AC-4 — Seul le dernier lien émis est valable (`CASE-AUTH-18`).
- [ ] AC-5 — Une réinitialisation réussie lève le blocage d'un compte bloqué après échecs (décision de l'équipe du 25/11/2026) (`CASE-AUTH-19`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-04 — Sécurité des identifiants

**Exigence :** REQ-114
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Aucun mot de passe n'est conservé ni affiché en clair. Après un nombre fixé
> d'échecs de connexion consécutifs, la connexion au compte est temporairement bloquée
> pendant une durée fixée (REQ-114 : « nombre d'échecs et durée à fixer »). Tout refus
> de connexion affiche le même message neutre, quelle qu'en soit la cause. Le blocage
> ne vise que les nouvelles connexions : les sessions déjà ouvertes restent actives.

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
  Et le message neutre affiché est le même que pour tout autre refus de connexion

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
| 3 | Échecs répétés sur un identifiant inconnu | Aucun compteur tenu ni compte bloqué. Chaque tentative reçoit le message neutre, identique à celui d'un compte existant, bloqué ou non : la réponse ne permet pas de savoir si l'identifiant existe |
| 4 | Mot de passe trop court à l'inscription | Refus avec le motif |
| 5 | Mot de passe dans un message, un export ou un journal | Interdit : il n'apparaît dans aucun affichage, export (`SPEC-AUTH-09`) ou journal |
| 6 | Tentative pendant le blocage, même avec le bon mot de passe | Refusée avec le message neutre ; sans effet sur la durée du blocage (hypothèse, voir « Ce qui n'est pas défini ») |
| 7 | Session déjà ouverte sur un autre appareil au moment du blocage | La session reste active jusqu'à sa déconnexion ou son expiration ; seules les nouvelles tentatives de connexion sont refusées (décision de l'équipe du 25/11/2026) |

### Ce qui n'est pas défini

- *24/11/2026* — Nombre d'échecs et durée du blocage (REQ-114 « à fixer ») : proposition 5 échecs, 15 minutes. À valider à la recette.
- *24/11/2026* — Paramétrabilité du seuil et de la durée (AC-4) : choix d'architecture de l'équipe pour ne pas figer ces valeurs dans le code. REQ-115 ne les liste pas parmi les paramètres exigés ; ce n'est donc pas une exigence du CDC.
- *25/11/2026* — Effet du blocage sur une session déjà ouverte (cas limite 7) : non traité par le CDC ; décision de l'équipe du 25/11/2026 = le blocage ne vise que les nouvelles connexions.
- *24/11/2026* — Règle de robustesse : proposition longueur minimale de 8 caractères. À valider.
- *25/11/2026* — Message pendant le blocage : REQ-114 ne dit rien de son contenu. Décision de l'équipe du 25/11/2026 = un message neutre unique pour tout refus de connexion, dès le premier échec, quelle qu'en soit la cause : identifiant inconnu, mot de passe erroné ou compte bloqué. Aucun compteur n'est tenu pour les identifiants inconnus, et la réponse ne révèle ni l'existence du compte ni son blocage, par cohérence avec `SPEC-AUTH-02` et `SPEC-AUTH-03`. Formulation exacte du message (ex. « Identifiant ou mot de passe incorrect, ou accès temporairement indisponible. Réessayez plus tard ou réinitialisez votre mot de passe ») : à valider à la recette.
- *24/11/2026* — Durée du blocage fixe ou glissante : non traitée par REQ-114. Hypothèse de l'équipe = durée fixe comptée depuis l'échec qui atteint le seuil ; les tentatives pendant le blocage ne la prolongent pas et ne comptent pas comme nouveaux échecs. À valider à la recette.

### Critères d'acceptation

- [ ] AC-1 — Les mots de passe sont conservés sous forme non réversible (`CASE-AUTH-20`).
- [ ] AC-2 — Le compte est bloqué au seuil d'échecs et débloqué après la durée paramétrée (`CASE-AUTH-21`).
- [ ] AC-3 — Une connexion réussie remet le compteur à zéro (`CASE-AUTH-22`).
- [ ] AC-4 — Modifier le seuil ou la durée dans le paramétrage change le comportement sans modifier l'application (choix d'architecture de l'équipe, hors REQ-115) (`CASE-AUTH-23`).
- [ ] AC-5 — Un mot de passe non conforme est refusé (`CASE-AUTH-24`).
- [ ] AC-6 — Le mot de passe n'apparaît dans aucun affichage, export ni journal (REQ-114) (`CASE-AUTH-25`).
- [ ] AC-7 — Tout refus de connexion affiche le même message neutre, que l'identifiant existe ou non, que le mot de passe soit erroné ou que le compte soit bloqué (décision de l'équipe du 25/11/2026) (`CASE-AUTH-26`).
- [ ] AC-8 — Le blocage d'un compte ne ferme pas une session déjà ouverte sur un autre appareil ; seules les nouvelles connexions sont refusées (décision de l'équipe du 25/11/2026) (`CASE-AUTH-53`).

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
> qu'avec un consentement explicite, recueilli dans le parcours de création du compte
> ou ultérieurement depuis le profil (décision de l'équipe du 25/11/2026).
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
| 8 | L'utilisateur efface lui-même ses 4 données (`SPEC-AUTH-06`, cas limite 4) | Ne vaut pas retrait du consentement : le consentement reste actif et les champs restent saisissables. Seul le retrait explicite efface les données et rend les champs indisponibles (R-13) |

### Ce qui n'est pas défini

- *24/11/2026* — Durée de conservation des données personnelles (ZO-26) : à fixer par le client. Elle s'applique aussi à l'historique du consentement (dates d'octroi et de retrait), conservé tant que le compte existe.
- *24/11/2026* — Qualification RGPD de l'âge, du poids, de la taille et de la VMA en données de santé (ZO-33) : à trancher avec le client ; le consentement explicite est maintenu en attendant.
- *24/11/2026* — Contenu de la politique de confidentialité : modèle fourni par l'équipe, que le client fait valider (REQ-020 ; modèle à faire valider à la recette, CR-001/§6).
- *25/11/2026* — Octroi du consentement après l'inscription (depuis le profil) et nouveau consentement après un retrait : R-13 et REQ-018 ne prévoient littéralement le recueil que « dans le parcours de création du compte ». Décision de l'équipe du 25/11/2026 = octroi ultérieur autorisé, pour qu'un utilisateur ayant refusé puisse un jour renseigner son profil.

### Critères d'acceptation

- [ ] AC-1 — Le consentement n'est jamais pré-coché et sa date est enregistrée (`CASE-AUTH-27`).
- [ ] AC-2 — Sans consentement, aucune donnée de forme ne peut être enregistrée (`CASE-AUTH-28`).
- [ ] AC-3 — Le retrait efface les 4 données de forme et rétablit les valeurs par défaut signalées (`CASE-AUTH-29`).
- [ ] AC-4 — Le retrait ne supprime ni le compte, ni l'attestation d'âge, ni le classement des sports, et sa date est enregistrée (`CASE-AUTH-30`).
- [ ] AC-5 — La politique de confidentialité est consultable à l'inscription et depuis le compte (`CASE-AUTH-31`).
- [ ] AC-6 — Un consentement donné depuis le profil après l'inscription rend les champs saisissables et sa date est enregistrée (décision de l'équipe du 25/11/2026) (`CASE-AUTH-32`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-06 — Profil facultatif et valeurs par défaut

**Exigence :** REQ-016 (avec règle R-17 ; paramétrage des valeurs par défaut sous REQ-115 → `SPEC-ARCH-nn`)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'âge, le poids, la taille et la VMA sont facultatifs. Une saisie hors des plages
> plausibles est refusée. Une donnée absente est remplacée par une valeur par défaut
> paramétrable, et l'utilisateur en est averti. Le temps de parcours et les quantités
> ne sont personnalisés que si le profil est renseigné (REQ-016, R-17 ; usage
> calculatoire délégué à `SPEC-CALC-nn`).

### Portée

- Couvre la saisie, la modification et l'effacement de chacune des 4 données.
- Couvre le contrôle des plages plausibles fixées par l'équipe (REQ-016).
- Couvre la fourniture aux autres domaines de la valeur effective (saisie ou par défaut) et de son origine.
- Ne couvre pas l'usage de ces valeurs dans les calculs (temps, eau, nourriture, niveau) → `SPEC-CALC-nn`.
- Ne couvre pas la déduction du niveau à partir de la VMA par paliers paramétrables (R-20, REQ-115) → `SPEC-CALC-nn`.
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
| 3 | Valeur décimale (ex. VMA 13,5, poids 70,5) | Acceptée pour le poids, la taille et la VMA. Pour l'âge, saisie décimale refusée avec un message invitant à saisir un nombre entier d'années (hypothèse, voir « Ce qui n'est pas défini ») |
| 4 | L'utilisateur efface une donnée déjà saisie | Donnée supprimée, valeur par défaut appliquée et signalée |
| 5 | Les 4 données absentes | Tous les calculs en valeurs par défaut ; un seul avertissement global suffit. Si l'utilisateur les a effacées lui-même, le consentement reste actif (`SPEC-AUTH-05`, cas limite 8) |
| 6 | Valeur par défaut modifiée dans le paramétrage | Les calculs suivants des utilisateurs sans saisie utilisent la nouvelle valeur. Renvoi : effet de REQ-115, vérifié dans `SPEC-ARCH-nn` / `SPEC-CALC-nn`, pas par un critère d'`AUTH` |
| 7 | Âge du profil saisi sous 15 ans | Refusé comme hors plage ; l'attestation d'âge et le compte restent inchangés |
| 8 | Âge du profil effacé | Seule la valeur de calcul est concernée ; l'éligibilité du compte (attestation, `SPEC-AUTH-01`) ne change pas |

### Ce qui n'est pas défini

- *24/11/2026* — Plages plausibles (REQ-016, fixées par l'équipe) : proposition âge 15–100 ans, poids 30–250 kg, taille 120–230 cm, VMA 6–25 km/h. À valider à la recette.
- *24/11/2026* — Âge en années entières (cas limite 3) : REQ-016 ne précise pas le format. Hypothèse de l'équipe = nombre entier obligatoire, saisie décimale refusée (pas d'arrondi). À valider à la recette.
- *24/11/2026* — Valeurs par défaut (paramétrables, REQ-115) : à proposer avec les règles de calcul (`SPEC-CALC-nn` ; R-05 ; règles de calcul à faire valider à la recette, CR-001/§6).

### Critères d'acceptation

- [ ] AC-1 — Chacune des 4 données peut être saisie, modifiée et effacée (`CASE-AUTH-33`).
- [ ] AC-2 — Une valeur hors plage est refusée avec un message, bornes incluses acceptées (`CASE-AUTH-34`).
- [ ] AC-3 — Une donnée absente est remplacée par la valeur par défaut et l'utilisateur est averti (`CASE-AUTH-35`).
- [ ] AC-4 — Le profil indique, pour chaque donnée, si la valeur est saisie ou par défaut (`CASE-AUTH-36`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-07 — Classement des sports favoris

**Exigence :** REQ-017 (classement consommé par R-12 → `SPEC-COMP-nn`)
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
| 2 | Aucun classement fourni à l'inscription | Inscription refusée : le classement est obligatoire (REQ-017, `SPEC-AUTH-01` cas limite 4) |
| 3 | Retrait du consentement aux données de forme | Le classement est conservé : il ne relève pas des données de forme |

### Ce qui n'est pas défini

- *24/11/2026* — Possibilité de n'indiquer qu'un seul sport favori : non demandée ; hypothèse retenue = les deux sports sont toujours classés.

### Critères d'acceptation

- [ ] AC-1 — Le classement saisi à l'inscription est enregistré et modifiable dans le profil (`CASE-AUTH-37`).
- [ ] AC-2 — Deux sports ne peuvent pas avoir le même rang (`CASE-AUTH-38`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-08 — Cloisonnement des données

**Exigence :** REQ-105 (avec REQ-023 ; accès à l'espace d'administration sous REQ-106 → `SPEC-ADMIN-nn`)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> Un utilisateur ne peut consulter, modifier, exporter ou supprimer que ses propres
> données. L'espace d'administration étant limité aux statuts des sentiers et aux
> alertes (REQ-023), l'administrateur n'a accès à aucune donnée personnelle des
> utilisateurs (compte, profil, consentement, classement, export).

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
| 3 | Un administrateur tente de consulter le compte, le profil, le consentement ou le classement d'un utilisateur | Refusé : l'espace d'administration est limité aux sentiers et aux alertes |
| 4 | Message d'erreur sur un compte d'autrui | Ne confirme pas l'existence du compte visé (hors inscription : voir `SPEC-AUTH-01`, cas limite 2) |

### Ce qui n'est pas défini

- *24/11/2026* — Accès de l'administrateur aux données utilisateur (support, assistance) : non demandé ; hypothèse retenue = aucun accès. Déduite de REQ-023 (« l'espace d'administration reste limité aux statuts des sentiers et aux alertes »), qui ne pose pas d'interdiction explicite.

### Critères d'acceptation

- [ ] AC-1 — Pour chacune des opérations consulter, modifier, exporter, supprimer, un accès croisé entre deux comptes est refusé (`CASE-AUTH-39`).
- [ ] AC-2 — Un administrateur n'accède à aucune donnée personnelle des utilisateurs (compte, profil, consentement, classement, export) (`CASE-AUTH-40`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-09 — Export des données personnelles

**Exigence :** REQ-019 (avec REQ-105 ; ZO-26)
**Statut :** proposé
**Version :** v1 (24/11/2026)

### Règle

> L'utilisateur peut télécharger à tout moment l'ensemble de ses données personnelles
> dans un format lisible et standard.

### Portée

- Couvre le contenu de l'export : identifiant, date d'inscription, attestation d'âge, date d'acceptation des CGU, état courant du consentement (accordé / non accordé / retiré) et son historique (dates d'octroi et de retrait), données de forme renseignées, classement des sports.
- Ne couvre pas l'export `.gpx` des itinéraires → `SPEC-GPX-nn`.

### Scénarios nominaux

```gherkin
Scénario : Export complet
  Étant donné un utilisateur ayant consenti, renseigné son âge, son poids, sa taille, sa VMA et classé ses sports
  Quand il demande l'export de ses données
  Alors il télécharge un fichier dans un format standard et lisible
  Et ce fichier contient son identifiant, sa date d'inscription, son attestation d'âge, son âge, son poids, sa taille, sa VMA, son classement des sports, la date d'acceptation des CGU, l'état courant de son consentement et son historique
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
| 4 | Consentement refusé à l'inscription (jamais accordé) | Export produit ; il indique qu'aucun consentement n'est accordé, sans date d'octroi ni de retrait, et ne contient aucune donnée de forme |

### Ce qui n'est pas défini

- *24/11/2026* — Format exact de l'export (« lisible et standard », REQ-019 ; réponse validée « export standard », CDC §11, ligne ZO-26) : à choisir par l'équipe parmi les formats ouverts courants. Aucune question ouverte côté client sur ce point : ZO-26 ne porte que sur la durée de conservation.

### Critères d'acceptation

- [ ] AC-1 — L'export contient toutes les données personnelles du compte, dont l'état courant du consentement, et aucune d'un autre compte (`CASE-AUTH-41`).
- [ ] AC-2 — L'export ne contient jamais le mot de passe (`CASE-AUTH-42`).
- [ ] AC-3 — Les données non renseignées apparaissent comme telles, sans valeur par défaut (`CASE-AUTH-43`).
- [ ] AC-4 — Après un retrait, l'export contient les dates d'octroi et de retrait du consentement et aucune donnée de forme (`CASE-AUTH-44`).

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
- Couvre l'effacement des données personnelles conservées dans le navigateur de l'appareil où la suppression est faite, et sur les autres appareils dès leur prochaine action (décision de l'équipe du 25/11/2026). Le moyen technique relève de `SPEC-ARCH-nn`.
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
| 1 | Mot de passe de confirmation erroné | Suppression refusée ; compte inchangé. Les ressaisies erronées comptent comme des échecs de connexion pour le blocage de `SPEC-AUTH-04`, comme pour `SPEC-AUTH-11` (hypothèse, voir « Ce qui n'est pas défini ») |
| 2 | Sessions ouvertes sur d'autres appareils | Fermées : la prochaine action renvoie vers la connexion et efface les données personnelles du compte conservées dans le navigateur de cet appareil (décision de l'équipe du 25/11/2026) |
| 3 | Nouvelle inscription avec le même identifiant après suppression | Autorisée, comme un nouveau compte sans aucune donnée de l'ancien |
| 4 | Compte administrateur | Hors de ce parcours : géré par l'équipe (`SPEC-ADMIN-nn`) |
| 5 | Compte bloqué (`SPEC-AUTH-04`) avec une session déjà ouverte | Suppression refusée avec le message neutre jusqu'à la fin du blocage, comme le changement de mot de passe (`SPEC-AUTH-11`, cas limite 4) (décision de l'équipe du 25/11/2026, voir « Ce qui n'est pas défini ») |

### Ce qui n'est pas défini

- *24/11/2026* — Effacement immédiat ou différé, et conservation éventuelle de traces (ZO-26) : hypothèse retenue = effacement immédiat et définitif, en attendant la durée de conservation fixée par le client. Conséquence : les dates d'octroi et de retrait du consentement, conservées comme preuve tant que le compte existe (`SPEC-AUTH-05`, cas limite 7), sont effacées avec lui ; la conservation de cette preuve au-delà de la suppression relève de la même question ZO-26.
- *25/11/2026* — Suppression pendant un blocage (cas limite 5) : refus jusqu'à la fin du blocage, aligné sur `SPEC-AUTH-11` ; REQ-019 ne prévoit pas cette restriction. Décision de l'équipe du 25/11/2026 = refus maintenu : la suppression avec le bon mot de passe pendant le blocage n'est pas autorisée.
- *24/11/2026* — Mode de confirmation de la suppression (ressaisie du mot de passe) : choix de sécurité de l'équipe, non précisé par REQ-019.
- *25/11/2026* — Prise en compte des ressaisies erronées dans le compteur d'échecs (cas limite 1) : hypothèse de sécurité de l'équipe issue de REQ-114, alignée sur `SPEC-AUTH-11` (cas limite 4). À valider à la recette ; sans critère d'acceptation propre en v1.
- *25/11/2026* — Effacement des données personnelles du navigateur après la suppression : non traité par le CDC ; décision de l'équipe du 25/11/2026. Un appareil resté hors connexion conserve ses données jusqu'à sa prochaine action connectée : limite assumée, l'application ne fonctionnant pas hors ligne (`SPEC-ARCH-nn`).
- *24/11/2026* — Proposition d'export avant suppression : non demandée ; recommandée (lien vers `SPEC-AUTH-09` dans l'écran de confirmation).

### Critères d'acceptation

- [ ] AC-1 — Après suppression confirmée, aucune donnée personnelle du compte ne subsiste (`CASE-AUTH-45`).
- [ ] AC-2 — Les anciens identifiants ne permettent plus de se connecter (`CASE-AUTH-46`).
- [ ] AC-3 — Sans confirmation valide, rien n'est supprimé (`CASE-AUTH-47`).
- [ ] AC-4 — Les sessions ouvertes sur les autres appareils sont fermées : leur prochaine action renvoie vers la connexion (`CASE-AUTH-48`).
- [ ] AC-5 — Après suppression, aucune donnée personnelle du compte ne reste dans le stockage local ni dans le cache de la PWA de l'appareil utilisé, ni des autres appareils après leur prochaine action (décision de l'équipe du 25/11/2026) (`CASE-AUTH-54`).
- [ ] AC-6 — Pendant un blocage (`SPEC-AUTH-04`), la suppression demandée depuis une session déjà ouverte est refusée avec le message neutre, même avec le bon mot de passe (décision de l'équipe du 25/11/2026) (`CASE-AUTH-60`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |

---

## SPEC-AUTH-11 — Changement du mot de passe depuis le profil

**Exigence :** REQ-015, REQ-114 (fonction ajoutée par décision de l'équipe du 25/11/2026 ; REQ-015 et CR-001/Q23 ne la citent pas)
**Statut :** proposé
**Version :** v1 (25/11/2026)

### Règle

> Un utilisateur connecté peut changer son mot de passe depuis son profil en
> saisissant son mot de passe actuel puis un nouveau mot de passe conforme.
> L'ancien mot de passe cesse alors d'être valable.

### Portée

- Couvre la saisie du mot de passe actuel, la saisie du nouveau mot de passe et son contrôle de robustesse.
- Couvre l'invalidation de l'ancien mot de passe et des liens de réinitialisation en cours.
- Ne couvre pas le mot de passe oublié → `SPEC-AUTH-03`.
- Ne couvre pas la règle de robustesse ni la conservation du mot de passe → `SPEC-AUTH-04`.

### Scénarios nominaux

```gherkin
Scénario : Changement réussi
  Étant donné un utilisateur connecté
  Quand il saisit son mot de passe actuel correct
  Et il saisit un nouveau mot de passe conforme
  Alors le nouveau mot de passe permet de se connecter
  Et l'ancien mot de passe est refusé
  Et il reste connecté sur cet appareil

Scénario : Mot de passe actuel erroné
  Étant donné un utilisateur connecté
  Quand il saisit un mot de passe actuel erroné
  Alors le changement est refusé
  Et son mot de passe reste inchangé
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | Nouveau mot de passe non conforme à la règle de robustesse (`SPEC-AUTH-04`) | Refus avec le motif ; mot de passe inchangé |
| 2 | Nouveau mot de passe identique à l'actuel | Accepté s'il est conforme : aucune règle d'historique n'est demandée (voir « Ce qui n'est pas défini ») |
| 3 | Lien de réinitialisation (`SPEC-AUTH-03`) émis avant le changement | Invalidé : il ne permet plus de définir un mot de passe |
| 4 | Mots de passe actuels erronés répétés | Ils comptent comme des échecs de connexion pour le blocage de `SPEC-AUTH-04` (hypothèse, voir « Ce qui n'est pas défini »). Le seuil atteint n'interrompt pas la session ouverte (`SPEC-AUTH-04`, cas limite 7) : l'utilisateur reçoit le message neutre de refus du changement et ne peut plus changer son mot de passe jusqu'à la fin du blocage |
| 5 | Mot de passe dans un message, un export ou un journal | Interdit, comme pour `SPEC-AUTH-04` (cas limite 5) |

### Ce qui n'est pas défini

- *25/11/2026* — Fonction ajoutée par décision de l'équipe du 25/11/2026 : REQ-015 ne cite que la création du compte, la connexion, la déconnexion et la réinitialisation du mot de passe.
- *25/11/2026* — Effet du changement sur les sessions ouvertes sur d'autres appareils : non traité par le CDC. Hypothèse de l'équipe = elles restent actives, par cohérence avec le blocage (`SPEC-AUTH-04`, cas limite 7). À valider à la recette.
- *25/11/2026* — Prise en compte des mots de passe actuels erronés dans le compteur d'échecs (cas limite 4) : hypothèse de sécurité de l'équipe issue de REQ-114, pour éviter de deviner le mot de passe depuis une session ouverte. À valider à la recette.
- *25/11/2026* — Interdiction de réutiliser un ancien mot de passe : non demandée, non prévue.

### Critères d'acceptation

- [ ] AC-1 — Après un changement réussi, seul le nouveau mot de passe est accepté (`CASE-AUTH-55`).
- [ ] AC-2 — Sans le mot de passe actuel correct, le mot de passe n'est pas changé (`CASE-AUTH-56`).
- [ ] AC-3 — Un nouveau mot de passe non conforme est refusé (`CASE-AUTH-57`).
- [ ] AC-4 — Un lien de réinitialisation émis avant le changement est refusé (`CASE-AUTH-58`).
- [ ] AC-5 — Des saisies répétées d'un mot de passe actuel erroné comptent comme des échecs de connexion pour le blocage de `SPEC-AUTH-04` (hypothèse de l'équipe) (`CASE-AUTH-59`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| | | |
