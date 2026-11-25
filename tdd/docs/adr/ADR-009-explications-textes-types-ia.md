# ADR-009 — Rédaction des explications : textes types et option IA gratuite

**Statut :** proposé
**Date :** 25/11/2026
**Décidé par :** équipe projet

---

## Contexte

`REQ-009` demande d'expliquer en langage courant **pourquoi le trajet conseillé
diffère du trajet choisi** et **pourquoi les conditions sont jugées favorables
ou non**. Ces explications sont rédigées « par une IA seulement si elle est
gratuite, sinon par des textes types ». Le client a confirmé la place de l'IA
(`CR-001/Q21`, point 4 du § validations) : calculs, verdict et trajet conseillé
par règles fixes ; l'IA **ne rédige que** les explications.

Ce que `SPEC-CALC-07` attend de la rédaction :

- **Contenu** (AC-1, AC-2) — la valeur du verdict, chaque critère qui pose
  problème avec sa zone et son heure ; les sentiers évités et leur motif (règle
  de sécurité déclenchée, ou fermeture avec la date de l'information) ; les cas
  limites 3 à 9 (donnée manquante sans rien supposer, pas de trajet conseillé,
  mention « indicatif, sentier non calibré », verdict favorable, vigilance
  majeure en premier, trajet conseillé dans un autre secteur).
- **Fidélité** (AC-4, cas limites 1 et 2) — l'explication ne contient aucune
  valeur qui ne vienne des règles fixes ; un texte d'IA qui contredit le verdict
  ou ajoute une valeur est écarté au profit des textes types. La **méthode de
  contrôle** est laissée ouverte par la spec.
- **Disponibilité** (AC-3) — sans IA activée, ou si elle ne répond pas dans le
  **délai paramétré**, les textes types s'appliquent sans bloquer l'affichage.
- **Confidentialité** (AC-5) — aucune donnée du profil n'est transmise à l'IA ;
  hypothèse de la spec : seuls les résultats calculés (valeur du verdict,
  critères, zones, heures, sentiers) sont transmis.
- **Mention** — hypothèse de la spec : un texte rédigé par l'IA porte la mention
  discrète « texte rédigé automatiquement ».

Contraintes transverses : coût récurrent nul et aucune source payante
(`REQ-102`) ; démonstration locale sous Docker Compose (`ADR-001`, `REQ-111`) ;
aucune IA dans les calculs (`R-05`, `SPEC-CALC-08` cas limite 1) ; données de
forme physique soumises au RGPD (`ADR-004`) ; délai d'attente de l'IA déjà
inscrit au catalogue de paramètres (`ADR-003`) ; fin de cycle le 09/12/2026.

## Options envisagées

### Mode de rédaction

#### Option A — Textes types seuls, sans IA

| | |
|---|---|
| Ce qu'elle apporte | Déterministe et testable mot pour mot ; fidélité garantie par construction ; aucune latence ; aucune donnée transmise ; rien à installer. Conforme à `REQ-009` (« sinon par des textes types »). |
| Ce qu'elle coûte | Formulations répétitives ; chaque combinaison (vigilance, plusieurs critères, sentier fermé, autre secteur…) doit être prévue à la main. |
| Ce qu'elle rend difficile plus tard | Ajouter une IA ensuite si le code de rédaction n'a pas été isolé derrière une interface. |

#### Option B — Textes types + IA en ligne sur une offre gratuite (API d'un fournisseur)

| | |
|---|---|
| Ce qu'elle apporte | Modèles performants, rédaction naturelle en français, réponse rapide ; aucune ressource locale. |
| Ce qu'elle coûte | Les résultats calculés quittent le poste vers un tiers ; les conditions des offres gratuites autorisent souvent la réutilisation des données envoyées ; clé d'API à créer et à protéger ; dépendance au réseau. |
| Ce qu'elle rend difficile plus tard | Garantir le coût nul dans la durée : quotas et conditions d'une offre gratuite changent sans préavis, et l'offre peut devenir payante (`REQ-102`). |

#### Option C — Textes types + IA locale à modèle ouvert (serveur d'inférence en conteneur)

| | |
|---|---|
| Ce qu'elle apporte | Gratuit sans quota ; aucune donnée ne quitte le poste (AC-5 et RGPD tenus par l'architecture) ; fonctionne hors abonnement ; s'intègre comme un service de plus dans Docker Compose (`ADR-001`). |
| Ce qu'elle coûte | Ressources du poste (plusieurs Go de mémoire, modèle de quelques Go à télécharger) ; sur processeur sans carte graphique, la rédaction peut dépasser le délai paramétré ; qualité du français variable selon le modèle. |
| Ce qu'elle rend difficile plus tard | Passer à un modèle plus gros sans poste mieux équipé. |

### Contrôle de fidélité d'un texte d'IA

#### Option F1 — Contrôle mécanique à partir des faits calculés

| | |
|---|---|
| Ce qu'elle apporte | Déterministe et testable unitairement ; rapide ; vérifie la présence des éléments obligatoires et l'absence de toute valeur étrangère. |
| Ce qu'elle coûte | Ne détecte pas toutes les contradictions de sens (une négation mal placée, une tournure ambiguë). |
| Ce qu'elle rend difficile plus tard | Accepter des reformulations très libres (ex. « en fin de matinée » pour 11h00), refusées par le contrôle. |

#### Option F2 — Second appel à l'IA comme juge du premier texte

| | |
|---|---|
| Ce qu'elle apporte | Peut repérer des contradictions de sens. |
| Ce qu'elle coûte | Double la latence ; le juge est lui-même non déterministe et faillible ; le contrôle ne se teste pas de manière reproductible. |
| Ce qu'elle rend difficile plus tard | Prouver en recette qu'un texte infidèle est toujours écarté. |

## Décision

Nous retenons les **textes types comme socle livré et toujours disponible**
(option A), et une **IA locale à modèle ouvert en option, désactivée par
défaut** (option C), dont chaque texte passe un **contrôle mécanique de
fidélité** (option F1) avant d'être affiché.

### Faits d'explication

1. **Une structure unique en entrée.** Les moteurs de calcul (`ADR-008`)
   produisent, en plus de leurs résultats, un objet **faits d'explication** :
   valeur du verdict ; critères qui posent problème (critère, zone, heure,
   valeur prévue, seuil franchi) ; critères non évaluables et donnée manquante ;
   vigilance officielle ; sentiers évités avec leur motif (règle déclenchée ou
   fermeture et date de l'information) et l'heure de passage concernée ;
   changement de secteur ; mention « indicatif, sentier non calibré ».
2. **Aucune donnée du profil par construction.** Le type de cette structure ne
   contient ni âge, ni poids, ni taille, ni VMA, ni identifiant de compte, ni
   coordonnées saisies : seulement des valeurs calculées et des noms du
   référentiel (sentiers, zones). C'est **la seule entrée** du rédacteur IA ;
   l'adaptateur ne reçoit rien d'autre (AC-5).

### Textes types (socle)

3. **Fonction pure** `rediger(faits) → texte`, sans effet de bord : mêmes faits,
   même texte. Les gabarits de phrases sont dans un fichier versionné du dépôt,
   en français, relus en revue de code ; ils ne sont pas modifiables depuis
   l'espace d'administration.
4. **Ordre fixe** : vigilance majeure d'abord (cas limite 7), puis valeur du
   verdict, critères en cause par heure croissante, données manquantes, sentiers
   évités et motif, changement de secteur, mention « indicatif ». Chaque cas
   limite 3 à 9 de `SPEC-CALC-07` a sa phrase type.

### Option IA

5. **Service local.** Un serveur d'inférence à modèle ouvert tourne dans un
   conteneur ajouté à Docker Compose sous un **profil optionnel** : le
   `docker compose up` par défaut ne le démarre pas et ne télécharge aucun
   modèle. Le modèle retenu (petite taille, quantifié, licence permettant
   l'usage) et sa version sont consignés dans la documentation de déploiement
   après essai sur le poste de démonstration.
6. **Paramètres** (catalogue `ADR-003`) : `ia.active` (désactivée par défaut) et
   `ia.delai_attente` (borné ; valeur initiale proposée 4 s, à ajuster après
   mesure sur le poste de démonstration). L'adresse du service est une variable
   d'environnement technique, hors catalogue.
7. **Requête.** L'IA reçoit les faits d'explication **et le texte type déjà
   rédigé**, avec la consigne de le reformuler en langage courant sans ajouter
   ni retirer d'information. Température minimale, longueur de réponse bornée.
8. **Ordre d'exécution.** Le texte type est toujours rédigé en premier. Si
   l'IA est active, elle est appelée avec le délai paramétré ; à expiration, en
   cas d'erreur ou de rejet par le contrôle, le texte type est renvoyé. La
   réponse de l'API n'attend jamais plus que ce délai (AC-3).

### Contrôle de fidélité

9. **Fonction pure** `controler(texte, faits) → accepté | rejeté(motif)`. Le
   texte est rejeté si :
   - le libellé de la valeur du verdict est absent, ou un autre libellé de
     verdict apparaît (cas limite 1) ;
   - un critère, une zone, une heure ou un sentier évité des faits est absent
     (cas limite 1, AC-1, AC-2) ;
   - un nombre du texte (valeur, seuil, heure, quantité, durée) n'appartient pas
     à l'ensemble des nombres des faits, après normalisation des formats
     (10h00, 10 h…) (cas limite 2, AC-4) ;
   - un sentier ou une zone du référentiel cité n'est pas dans les faits ;
   - la longueur sort des bornes fixées.
10. **Affichage.** Un texte accepté porte la mention « texte rédigé
    automatiquement ». Chaque repli sur les textes types est journalisé avec son
    motif (désactivée, délai dépassé, erreur, contrôle et règle en échec), sans
    le contenu des faits.

## Raisons

- **Les textes types sont exigés de toute façon.** `REQ-009` et AC-3 imposent un
  repli toujours disponible : ce socle est obligatoire, l'IA ne peut être qu'un
  complément. Le livrer d'abord garantit `REQ-009` à la démonstration, quel que
  soit l'état de l'option.
- **Local plutôt qu'en ligne (C contre B).** Les critères décisifs sont `REQ-102`
  et AC-5. Une offre gratuite en ligne ne garantit pas le coût nul dans la durée
  et fait sortir des données d'usage vers un tiers dont les conditions
  autorisent souvent la réutilisation ; un modèle local est gratuit sans quota et
  ne transmet rien hors du poste, ce qui rend AC-5 vrai par l'architecture et pas
  seulement par le contenu de la requête.
- **Faits d'explication typés.** Construire l'explication à partir d'une
  structure dédiée, sans champ du profil, rend AC-5 vérifiable par un test sur le
  type et sur la requête envoyée, et sépare nettement les calculs (`ADR-008`) de
  la rédaction (`SPEC-CALC-08` cas limite 1).
- **Reformuler le texte type plutôt que rédiger librement.** L'IA part d'un
  texte déjà exact : la tâche est plus simple pour un petit modèle, et l'écart
  avec les faits reste faible, ce qui limite les rejets.
- **Contrôle mécanique (F1 contre F2).** La recette doit prouver qu'un texte
  infidèle est écarté (cas limites 1 et 2) : seul un contrôle déterministe se
  teste de façon reproductible. Un juge IA doublerait la latence sans garantie.
- **Désactivée par défaut.** La démonstration ne dépend ni des ressources du
  poste ni du téléchargement d'un modèle ; l'équipe active l'option une fois la
  latence mesurée.

## Conséquences acceptées

- **Gabarits à écrire et à tester** pour chaque cas de `SPEC-CALC-07` ; les
  textes types ont des tests au mot près (`CASE-CALC-28` à `CASE-CALC-30`).
- **Contradictions de sens non toutes détectées.** Le contrôle F1 vérifie
  présences et valeurs, pas le sens de chaque phrase (une négation peut passer).
  Le risque est limité par la reformulation d'un texte exact et une température
  minimale ; il est assumé tant que les textes d'IA portent la mention
  « texte rédigé automatiquement ».
- **Contrôle strict, rejets possibles.** Une reformulation correcte mais libre
  (« fin de matinée » pour 11h00) est rejetée : on préfère un texte type à un
  texte invérifiable.
- **Latence et ressources.** Sur un poste sans carte graphique, le modèle peut
  dépasser régulièrement le délai : l'utilisateur voit alors les textes types,
  ce qui reste conforme. Le profil IA demande plusieurs Go de mémoire et de
  disque.
- **Heures de passage transmises.** Elles dérivent du profil (VMA) mais sont un
  résultat calculé, transmis conformément à l'hypothèse de `SPEC-CALC-07` ; le
  profil lui-même ne l'est jamais. Le traitement reste sur le poste.
- **Écart de distance ou de durée non expliqué.** L'écart entre la plage
  demandée et le trajet conseillé (`SPEC-TRAIL-07` cas limite 11, `ARB-006`)
  n'est pas couvert par `SPEC-CALC-07` : la structure des faits pourra
  l'accueillir quand la spec sera complétée.
- **Nouveau paramètre** à ajouter au catalogue d'`ADR-003` : `ia.active`
  (le délai d'attente y figure déjà).
- **Dépendances** : faits d'explication produits par les moteurs de calcul
  (`ADR-008`) ; paramètres (`ADR-003`) ; service optionnel dans Docker Compose
  (`ADR-001`) ; simulation de l'IA lente, en erreur ou infidèle dans les tests
  (`ADR-011`) ; données personnelles (`ADR-004`).

## Ce qui nous ferait revenir dessus

- Le modèle local dépasse le délai pour la majorité des demandes sur le poste de
  démonstration, ou ses textes sont majoritairement rejetés par le contrôle :
  on livre les textes types seuls (option A) et on retire le profil IA.
- Le client juge les textes types suffisants à la recette : même conséquence.
- Un texte d'IA accepté par le contrôle se révèle contraire aux résultats : on
  renforce le contrôle (liste de formulations interdites, négations autour des
  critères) ou on désactive l'option.
- Une mise en ligne de l'application est décidée : la place d'un serveur
  d'inférence sur l'hébergement, ou le recours à une offre en ligne (option B)
  et ses conditions de données, sont à réexaminer avec `ADR-004`.
