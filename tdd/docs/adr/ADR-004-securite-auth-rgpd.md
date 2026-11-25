# ADR-004 — Authentification, sessions multi-appareils, sécurité et RGPD

**Statut :** proposé
**Date :** 25/11/2026
**Décidé par :** TiBenoit, MaxLaMenace, Ivan

---

## Contexte

Toute utilisation de l'application exige un compte authentifié (`R-16`,
`SPEC-AUTH-02` AC-3). Un même compte est utilisé depuis plusieurs appareils
(`REQ-015`) et il existe deux rôles : utilisateur et administrateur (`REQ-106`).
Les specs `AUTH` fixent des comportements qui contraignent directement le
mécanisme technique.

**1. Sessions**

- La suppression d'un compte ferme **immédiatement** ses sessions sur tous les
  appareils : la prochaine action d'un autre appareil renvoie vers la connexion
  (`SPEC-AUTH-10` AC-4) et efface les données personnelles du navigateur (AC-5).
- À l'inverse, le blocage après échecs **ne ferme pas** les sessions déjà
  ouvertes (`SPEC-AUTH-04` AC-8). Le changement et la réinitialisation du mot de
  passe ne les ferment pas non plus (hypothèses de l'équipe, `SPEC-AUTH-03` et
  `SPEC-AUTH-11`, à valider à la recette : le client peut demander l'inverse).
- Une session expire après une durée d'inactivité à paramétrer (`SPEC-AUTH-02`,
  « Ce qui n'est pas défini ») ; une session expirée n'affiche aucune donnée d'un
  autre compte (AC-6).
- La déconnexion ne vise que l'appareil courant ; la déconnexion de tous les
  appareils n'est pas demandée (`SPEC-AUTH-02`).

**2. Mots de passe et blocage** (`REQ-114`, `SPEC-AUTH-04`)

- Conservation non réversible ; jamais affiché, exporté ni journalisé (AC-1, AC-6).
- Blocage temporaire après un nombre d'échecs consécutifs ; le compteur est
  **porté par le compte**, tous appareils confondus (cas 2) ; durée fixe comptée
  depuis l'échec qui atteint le seuil, non prolongée par les tentatives pendant
  le blocage (cas 6). Seuil et durée paramétrables (AC-4).
- **Un seul message neutre** pour tout refus : identifiant inconnu, mot de passe
  erroné ou compte bloqué (AC-7). Aucun compteur pour les identifiants inconnus
  (cas 3).
- Les ressaisies erronées du mot de passe actuel depuis une session ouverte
  comptent comme des échecs (`SPEC-AUTH-10` cas 1, `SPEC-AUTH-11` AC-5) ; pendant
  un blocage, ces opérations sont refusées même avec le bon mot de passe
  (`SPEC-AUTH-10` AC-6, `SPEC-AUTH-11` cas 4).

**3. Réinitialisation du mot de passe** (`SPEC-AUTH-03`, `SPEC-AUTH-11`)

- Lien à usage unique, à durée limitée ; seul le dernier lien émis est valable
  (AC-3, AC-4) ; réponse identique pour une adresse inconnue (AC-2).
- Une réinitialisation réussie lève le blocage (AC-5) ; un changement de mot de
  passe invalide les liens en cours (`SPEC-AUTH-11` AC-4).
- La démonstration est locale et gratuite (`REQ-102`, `REQ-111`) : il faut un
  moyen de **recevoir** le lien sans service payant ni mise en ligne
  (`SPEC-AUTH-03`, « Ce qui n'est pas défini »).

**4. Cloisonnement et rôles** (`REQ-105`, `REQ-106`, `SPEC-AUTH-08`, `SPEC-ADMIN-01`)

- Un utilisateur n'accède qu'à ses propres données, pour chacune des opérations
  consulter, modifier, exporter, supprimer (`SPEC-AUTH-08` AC-1).
- L'administrateur n'accède à **aucune** donnée personnelle des utilisateurs
  (AC-2) : son espace est limité aux sentiers et aux alertes (`REQ-023`).
- L'administrateur est le client lui-même (CDC, parties prenantes), qui utilise
  aussi l'application comme sportif. Les comptes administrateurs sont créés par
  l'équipe ; le flux n'est pas spécifié (`SPEC-ADMIN-01`).

**5. RGPD** (`REQ-018`, `REQ-019`, `R-13`, `SPEC-AUTH-05`, `SPEC-AUTH-09`, `SPEC-AUTH-10`)

- Export des données personnelles « dans un format lisible et standard », format
  laissé au choix de l'équipe (`SPEC-AUTH-09`) ; données absentes signalées comme
  non renseignées (AC-3) ; jamais le mot de passe (AC-2).
- Retrait du consentement : effacement réel des 4 données de forme (`R-13`) ;
  l'historique des dates d'octroi et de retrait est conservé (`SPEC-AUTH-05` cas 7).
- Suppression du compte : effacement immédiat et définitif en attendant `ZO-26`.
- Qualification des données de forme en données de santé : ouverte (`ZO-33`) ;
  le consentement explicite est maintenu en attendant.

**Contraintes**

- coût nul, outils gratuits (`REQ-102`) ; démo de bout en bout en local (`REQ-111`) ;
- base PostgreSQL retenue par `ADR-002`, qui prévoit d'y stocker les sessions si
  elles sont côté serveur ;
- paramètres (seuil, durées) externalisés selon `ADR-003` ;
- interface PWA mobile-first, purge du stockage navigateur traitée par `ADR-006` ;
- stack fixé par `ADR-001` : backend Express 5 (TypeScript), frontend React 19
  compilé et servi par Nginx, qui relaie `/api` vers le backend ; le tout lancé
  par Docker Compose. Les entrées sont validées avec Zod.

## Options envisagées

La décision structurante est le mécanisme de session : elle conditionne
`SPEC-AUTH-10` AC-4 et `SPEC-AUTH-04` AC-8. Les autres points (hachage, réception
des liens, format d'export) ont des alternatives plus courtes, présentées
ensuite.

### Option A — Sessions serveur en base, identifiant opaque dans un cookie

| | |
|---|---|
| Ce qu'elle apporte | Le serveur détient l'état de chaque session : la fermer, c'est supprimer une ligne. La suppression d'un compte efface ses sessions dans la même transaction que ses données (cascade `ADR-002`) : `SPEC-AUTH-10` AC-4 est vrai dès la requête suivante, sans délai. Le blocage ne touche pas aux sessions : `SPEC-AUTH-04` AC-8 est respecté sans rien coder. Si le client demande plus tard de fermer les autres sessions au changement de mot de passe, c'est une requête de suppression filtrée par compte. Cookie `HttpOnly` : l'identifiant n'est pas lisible par le JavaScript de la page. Mécanisme standard : en Express 5, middleware `express-session` avec un stockage PostgreSQL. |
| Ce qu'elle coûte | Une lecture en base par requête (négligeable aux volumes d'une démo). Une protection contre les requêtes intersites forgées (CSRF) est nécessaire, puisque le navigateur envoie le cookie automatiquement. Une table de sessions à purger des sessions expirées. |
| Ce qu'elle rend difficile plus tard | Une API consommée par des clients non navigateurs (application native) demanderait un second mode d'authentification. Hors périmètre aujourd'hui. |

### Option B — Jeton JWT sans état, porté par le client

| | |
|---|---|
| Ce qu'elle apporte | Aucun stockage de session côté serveur : le jeton signé se suffit à lui-même. Pratique pour une API consommée par plusieurs clients. |
| Ce qu'elle coûte | **Un jeton émis reste valable jusqu'à son expiration** : un appareil qui détient le jeton d'un compte supprimé continue d'être accepté. `SPEC-AUTH-10` AC-4 n'est tenu que si l'on ajoute une liste de jetons révoqués consultée à chaque requête, c'est-à-dire un état serveur : on retombe sur l'option A, en plus compliqué. Le jeton stocké en `localStorage` est lisible par tout script de la page. |
| Ce qu'elle rend difficile plus tard | Toute nouvelle règle de révocation (fermer les sessions au changement de mot de passe) ajoute de la logique de liste noire. |

### Option C — JWT d'accès courte durée + jeton de rafraîchissement révocable en base

| | |
|---|---|
| Ce qu'elle apporte | Compromis courant : la révocation porte sur le jeton de rafraîchissement, stocké en base ; le jeton d'accès expire vite (quelques minutes). |
| Ce qu'elle coûte | Deux jetons, une rotation, un point de rafraîchissement à sécuriser. La révocation n'est **pas immédiate** : un appareil garde l'accès jusqu'à l'expiration de son jeton d'accès, ce qui contredit « la prochaine action renvoie vers la connexion » (`SPEC-AUTH-10` AC-4). Pour la tenir, il faut vérifier l'existence du compte à chaque requête : le jeton d'accès perd alors son intérêt. |
| Ce qu'elle rend difficile plus tard | La complexité est payée sans besoin : un seul client (la PWA), servi par la même origine. |

### Points secondaires

**Hachage des mots de passe**

- *Argon2id* : algorithme recommandé par l'OWASP, résistant aux attaques par carte
  graphique grâce à son coût mémoire. Disponible dans la plupart des stacks.
- *bcrypt* : éprouvé, partout disponible ; tronque les mots de passe au-delà de
  72 octets.
- *Hachage rapide (SHA-256, même salé)* : écarté, conçu pour être rapide, donc
  pour être cassé rapidement hors ligne. Non conforme à l'esprit de `REQ-114`.

**Réception des liens de réinitialisation pendant la démo**

- *Capteur SMTP local (Mailpit)* : faux serveur de messagerie qui reçoit tous les
  courriels et les affiche dans une page web locale. Gratuit, libre, aucun envoi
  réel. Le code envoie de vrais courriels SMTP : seul le serveur change en
  production.
- *Écriture du courriel dans un fichier ou dans le journal* : zéro dépendance,
  mais le chemin d'envoi réel n'est jamais exercé, et un lien de réinitialisation
  dans un journal est un secret qui traîne.
- *Service SMTP gratuit (offre gratuite d'un fournisseur)* : envoi réel, mais
  compte externe, quotas, données des testeurs envoyées à un tiers, et
  dépendance réseau contraire à l'esprit de `REQ-111`.

**Format de l'export RGPD**

- *JSON* : format ouvert, lisible par un humain et par une machine (portabilité,
  article 20 du RGPD) ; représente naturellement l'historique du consentement
  (une liste de dates) et la valeur « non renseigné » (`null`).
- *CSV* : lisible dans un tableur, mais plat : l'historique du consentement et le
  classement des sports s'y représentent mal.
- *PDF* : lisible par un humain, mais pas exploitable par une machine.

## Décision

Nous retenons des **sessions serveur stockées dans PostgreSQL, désignées par un
identifiant opaque dans un cookie `HttpOnly`**, avec un mot de passe haché en
**Argon2id**, un compteur d'échecs porté par le compte, des liens de
réinitialisation à jeton aléatoire stocké haché, un capteur SMTP local
(**Mailpit**) pour la démo, des données personnelles toujours adressées via le
compte de la session (jamais via un identifiant fourni par la requête), et un
export RGPD en **JSON**.

## Raisons

- **La révocation immédiate est une exigence, pas un confort.** `SPEC-AUTH-10`
  AC-4 demande que la prochaine action d'un autre appareil échoue. Seul un état
  côté serveur consulté à chaque requête le garantit. Les options B et C
  n'y arrivent qu'en ajoutant cet état : elles cumulent alors la complexité des
  jetons et celle des sessions.
- **L'option A rend les deux règles opposées faciles à tenir ensemble.**
  Supprimer un compte supprime ses sessions (AC-4) ; bloquer un compte ne touche
  qu'au compteur et à la date de fin de blocage, jamais aux sessions
  (`SPEC-AUTH-04` AC-8). Aucune logique particulière n'est à écrire pour que le
  blocage épargne les sessions ouvertes.
- **Les hypothèses à valider restent réversibles.** Si la recette décide que le
  changement ou la réinitialisation du mot de passe doivent fermer les autres
  sessions, il suffit de supprimer les sessions du compte sauf la session
  courante. Aucun changement de mécanisme.
- **Un seul client, une seule origine.** La PWA et l'API tournent sur deux
  instances (`ADR-001`), mais Nginx relaie `/api` vers le backend : le navigateur
  ne voit qu'une seule origine. Le cookie de session est alors le mécanisme le
  plus simple et le plus sûr (pas de jeton manipulable par le JavaScript de la
  page, pas de configuration CORS).
- **Argon2id plutôt que bcrypt** parce que c'est la recommandation actuelle et
  qu'elle n'a pas la limite des 72 octets. En Node.js : paquet `argon2`. Son
  module natif est précompilé ; s'il ne s'installe pas dans l'image Docker du
  backend, `@node-rs/argon2` fournit le même algorithme.
- **Mailpit parce qu'il exerce le vrai chemin d'envoi sans rien envoyer.** La
  démo montre le courriel reçu dans une page locale, le code est celui de la
  production, et rien ne sort du poste (`REQ-102`, `REQ-111`).
- **Le cloisonnement par construction plutôt que par contrôle.** Les données
  personnelles sont exposées uniquement sous une forme « mon compte » (par
  exemple `/api/moi/profil`, `/api/moi/export`) : le compte visé est
  **toujours** celui de la session. Il n'existe aucune route qui prend un
  identifiant de compte en paramètre, donc aucun accès croisé possible à oublier
  de contrôler (`SPEC-AUTH-08` AC-1, cas 4 : rien à confirmer ni infirmer).
- **Le rôle administrateur ne donne accès à aucune donnée personnelle parce
  qu'aucune route de l'espace d'administration ne les expose**, pas parce qu'un
  filtre les cache. Cet espace ne contient que sentiers, forçages et alertes
  (`REQ-023`, `SPEC-AUTH-08` AC-2). Un compte qui porte aussi le rôle
  utilisateur accède à **ses propres** données par les routes `/api/moi/…`,
  comme tout utilisateur.
- **JSON pour l'export** parce que c'est le seul des trois formats qui est à la
  fois lisible, standard, exploitable par une machine et capable de représenter
  l'historique du consentement et l'absence de valeur sans contorsion.

## Conséquences acceptées

**Sessions** (mise en œuvre dans Express 5, `ADR-001`)

- Middleware `express-session`, stockage `connect-pg-simple` dans la base
  d'`ADR-002`. Ce stockage ne relie pas la session au compte par une clé
  étrangère (une ligne = identifiant, contenu JSON, expiration). À la
  suppression du compte, ses sessions sont donc supprimées par une requête sur
  l'identifiant de compte rangé dans le contenu JSON, dans la même transaction
  que ses données.
- **À chaque requête, le compte de la session est relu en base.** Un compte
  absent rend la session invalide : c'est cette relecture qui garantit
  `SPEC-AUTH-10` AC-4. La suppression des lignes de session n'est que du
  nettoyage.
- `req.session.regenerate()` à la connexion (pas de fixation de session),
  `req.session.destroy()` à la déconnexion.
- Cookie `HttpOnly`, `SameSite=Lax`, et `Secure` dès que Nginx sert en HTTPS.
  Option `rolling` avec `maxAge` égal à la durée d'inactivité : le cookie est
  persistant (la PWA rouverte reste connectée) et prolongé à chaque requête.
- **Durée d'inactivité proposée : 7 jours**, paramétrable (`ADR-003`). À valider
  à la recette. Pas de durée de vie absolue en v1.
- Express tourne derrière le proxy Nginx : `trust proxy` est activé, et Nginx
  transmet `Host`, `X-Forwarded-For` et `X-Forwarded-Proto` (ce sont les
  « en-têtes nécessaires aux sessions » d'`ADR-001`). Sans cela, Express croit
  recevoir du HTTP et ne pose pas de cookie `Secure`, et les journaux montrent
  l'adresse du proxy au lieu de celle du client.
- Protection CSRF : `SameSite=Lax`, plus un middleware qui refuse toute requête
  modifiant des données si son en-tête `Origin` n'est pas celui de
  l'application. L'API n'accepte que du JSON : un autre site ne peut pas en
  envoyer sans passer par un contrôle CORS, que l'API ne configure pas. Le
  paquet `csurf`, souvent cité, est abandonné par ses mainteneurs et n'est pas
  utilisé.
- `connect-pg-simple` supprime lui-même les sessions expirées
  (`pruneSessionInterval`) : pas de tâche à écrire.
- Une requête refusée faute de session valide renvoie une réponse qui demande au
  navigateur d'effacer ses données (`Clear-Site-Data: "storage", "cache"`) : c'est
  le point d'accroche de `SPEC-AUTH-10` AC-5 sur les autres appareils. Le support
  de cet en-tête varie selon les navigateurs : `ADR-006` prévoit la purge côté
  client en complément.
- Les réponses qui contiennent des données personnelles portent
  `Cache-Control: no-store`, pour que ni le navigateur ni le Service Worker ne les
  conservent (`SPEC-AUTH-02` AC-7, `ADR-006`).

**Démonstration sur téléphone** (décision de l'équipe du 25/11/2026)

- La démo se fait depuis un téléphone sur le réseau local, en HTTP, avec un
  navigateur configuré pour traiter l'adresse du poste comme une origine
  sécurisée. Aucun certificat HTTPS n'est fourni.
- Ce réglage est indispensable : sans lui, le navigateur désactive le Service
  Worker (installation PWA et écran hors connexion, `ADR-006`) et ignore
  `Clear-Site-Data`. La session, elle, fonctionne dans tous les cas.
- Le cookie de session n'est pas `Secure` pendant la démo, puisqu'elle est en
  HTTP : acceptable sur un réseau local, pas pour une mise en ligne.
- Le navigateur et le réglage exacts sont à consigner dans la procédure de démo.

**Vérification du mot de passe : un seul point d'entrée**

- Connexion, confirmation de suppression du compte (`SPEC-AUTH-10`) et
  changement de mot de passe (`SPEC-AUTH-11`) passent par **le même service** de
  vérification. C'est lui qui refuse pendant un blocage, compte les échecs et
  remet le compteur à zéro. Les trois parcours ne peuvent pas diverger.
- Le compte porte deux champs : nombre d'échecs consécutifs et date de fin de
  blocage. L'incrément est atomique en base (`UPDATE … SET echecs = echecs + 1`),
  pour que deux tentatives simultanées depuis deux appareils comptent deux fois.
- Pendant le blocage, la tentative est refusée **avant** la vérification du mot
  de passe et ne modifie ni le compteur ni la date de fin (`SPEC-AUTH-04` cas 6).
- **Identifiant inconnu** : le service calcule quand même un hachage Argon2id sur
  une valeur factice. Sans cela, la réponse serait nettement plus rapide pour un
  identifiant inconnu, et le temps de réponse révélerait l'existence du compte
  malgré le message neutre (`SPEC-AUTH-04` AC-7).
- Paramètres Argon2id de départ : 19 Mio de mémoire, 2 itérations, parallélisme 1
  (minimum OWASP). À ajuster si la connexion dépasse environ une demi-seconde
  sur le poste de démo. Le paquet calcule hors du fil principal de Node.js : un
  hachage en cours ne bloque pas les autres requêtes.
- Le mot de passe, son haché, les jetons de réinitialisation et les identifiants
  de session sont exclus des journaux (masquage de ces champs dans la
  configuration du journaliseur, à fixer avec lui), testé par `CASE-AUTH-25`.
- Aucune limitation par adresse IP : `SPEC-AUTH-04` renvoie les attaques réseau
  à l'architecture, et une démo locale n'y est pas exposée. Conséquence assumée :
  rien ne freine un essai d'un même mot de passe sur beaucoup d'identifiants
  différents.
- Un tiers peut bloquer un compte en échouant volontairement : la
  réinitialisation, qui lève le blocage (`SPEC-AUTH-03` AC-5), est la parade
  prévue par les specs.

**Réinitialisation**

- Jeton aléatoire d'au moins 128 bits, transmis dans le lien. La base n'en garde
  que l'empreinte SHA-256 (un hachage rapide suffit ici : le jeton est aléatoire,
  il ne se devine pas comme un mot de passe), avec sa date d'expiration.
- **Un seul jeton par compte** : en émettre un nouveau remplace l'ancien
  (`SPEC-AUTH-03` AC-4). Il est supprimé à l'utilisation (AC-3), au changement de
  mot de passe (`SPEC-AUTH-11` AC-4) et avec le compte.
- Durée de validité proposée : **30 minutes**, paramétrable (`ADR-003`). À valider.
- Réponse à la demande identique et renvoyée sans attendre l'envoi du courriel
  (envoi par Nodemailer, non attendu par la route), pour que le temps de réponse
  ne distingue pas une adresse connue d'une inconnue (AC-2).
- Mailpit est un service du `docker-compose.yml` d'`ADR-001`, qui le prévoit
  déjà : SMTP sur le réseau interne Docker, page de lecture des courriels
  publiée sur l'hôte. Le serveur SMTP est un paramètre (`ADR-003`) : passer à un
  vrai serveur ne change pas le code.

**Rôles**

- **Un compte peut porter plusieurs rôles** : `utilisateur` et `administrateur`
  (décision de l'équipe du 25/11/2026). Le client, administrateur et sportif,
  n'a ainsi qu'un seul compte. Les rôles d'un compte sont stockés dans une
  table dédiée, effacée avec le compte (`ADR-002`).
- Tout compte créé par l'inscription a le rôle `utilisateur` et suit le
  parcours normal : CGU, attestation d'âge, consentement, classement
  (`SPEC-AUTH-01`).
- Le rôle `administrateur` est **ajouté ou retiré** sur un compte existant par
  une commande en ligne exécutée par l'équipe (script du backend lancé par
  `docker compose exec`), jamais par l'interface (`SPEC-ADMIN-01`). Le compte
  se connecte par le même écran et est soumis au même blocage.
- Les rôles sont relus en base à chaque requête, avec le compte : le retrait du
  rôle administrateur prend effet dès la requête suivante, sans déconnexion.
- Les contrôles sont faits sur le serveur, pas seulement en masquant des liens
  dans l'interface : les routes `/api/admin/…` exigent le rôle `administrateur`
  (`REQ-106`), les routes `/api/moi/…` exigent le rôle `utilisateur`.
- Un compte qui porte le rôle administrateur ne peut pas être supprimé depuis
  l'interface : l'équipe retire d'abord le rôle, puis la suppression suit le
  parcours normal (`SPEC-AUTH-10` cas 4, à reformuler en « compte portant le
  rôle administrateur »). Sans cette règle, la suppression du compte du client
  supprimerait aussi le seul accès à l'administration.

**RGPD**

- **Effacement réel, jamais logique.** Le retrait du consentement supprime les
  4 valeurs (pas de marqueur « masqué ») ; la suppression du compte supprime les
  lignes. C'est l'inverse du choix fait pour les référentiels dans `ADR-002`
  (élément retiré marqué, pas supprimé), et c'est voulu : ici la loi demande
  que la donnée disparaisse.
- Export JSON construit **champ par champ à partir d'une liste explicite**,
  jamais en sérialisant l'objet compte : un champ ajouté plus tard au compte
  (comme le haché du mot de passe) ne peut pas fuiter dans l'export par accident
  (`SPEC-AUTH-09` AC-2). En pratique, l'export passe par un schéma Zod qui
  déclare ses champs : tout champ non déclaré est retiré. Dates au format ISO 8601, encodage UTF-8, valeur
  absente = `null` (AC-3), clés en français lisibles. Téléchargé en pièce jointe
  (`Content-Disposition: attachment`), avec `Cache-Control: no-store`.
- La démo n'a pas de sauvegarde de base. Si des sauvegardes sont mises en place,
  une donnée effacée y survit : à traiter avec `ZO-26`.
- La qualification en données de santé (`ZO-33`) ne change pas le mécanisme : le
  consentement explicite est déjà en place. Elle pourrait imposer un chiffrement
  des colonnes de forme physique ou un hébergeur certifié en production, hors
  périmètre de la démo.

## Ce qui nous ferait revenir dessus

- Un client autre que la PWA servie par la même origine (application native,
  API ouverte à des tiers) → ajouter un mode par jeton pour ce client, en gardant
  la révocation côté serveur.
- Le navigateur de démo ne traite plus l'adresse du poste comme sécurisée
  (mise à jour, réglage perdu, autre téléphone) : Service Worker absent, PWA non
  installable → Nginx sert en HTTPS avec un certificat local (`ADR-006`). Le
  mécanisme de session ne change pas.
- Mise en ligne de l'application → HTTPS obligatoire et cookie `Secure`
  systématique.
- La recette demande que changement ou réinitialisation du mot de passe ferment
  les autres sessions → suppression des sessions du compte sauf la courante ; pas
  de nouvel ADR, une mise à jour des specs.
- Ni `argon2` ni `@node-rs/argon2` ne s'installent dans l'image Docker du
  backend → repli sur bcrypt (paquet `bcrypt`), avec la limite des 72 octets.
- Docker est indisponible sur le poste de démo (repli sur l'option B
  d'`ADR-001`) → PostgreSQL et Mailpit sont lancés comme programmes locaux ; le
  mécanisme ne change pas.
- Le temps de connexion devient gênant sur le poste de démo → baisser le coût
  Argon2id dans les limites OWASP avant de changer d'algorithme.
- `ZO-26` impose de conserver la preuve du consentement après la suppression du
  compte → une table de preuve anonymisée, détachée du compte ; la cascade
  actuelle ne le permet pas.
- `ZO-33` qualifie les données de forme en données de santé et le projet passe en
  production → réévaluer le stockage (chiffrement, hébergeur).
