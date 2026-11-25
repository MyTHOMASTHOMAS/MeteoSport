# ADR-006 — Interface mobile-first, PWA connectée, cartographie et purge locale

**Statut :** proposé
**Date :** 25/11/2026
**Décidé par :** TiBenoit, MaxLaMenace, Ivan

---

## Contexte

Le frontend est une application React 19 compilée par Vite et servie par Nginx,
qui relaie `/api` vers le backend Express 5 (`ADR-001`). Les sessions sont des
cookies `HttpOnly` côté serveur (`ADR-004`). Cet ADR fixe ce qui se passe **dans
le navigateur** : installation, comportement sans réseau, données conservées sur
l'appareil et affichage des cartes.

**1. Application web orientée mobile, installable** (`REQ-101`, `CR-001/Q01`)

- Pleinement utilisable sur smartphone depuis un navigateur mobile.
- Installation sur l'écran d'accueil proposée **sur les navigateurs qui le
  permettent** (contrainte 5 du CDC) : ce n'est pas une obligation sur tous les
  navigateurs.

**2. Connexion obligatoire, pas de mode hors ligne** (`REQ-109`, `CR-001/Q27`)

- L'application ne fonctionne que connectée. En zone blanche, le fichier `.gpx`
  prend le relais (contrainte 6 du CDC).
- Sans connexion, l'application **indique clairement** que les informations ne
  sont pas disponibles et invite à se reconnecter (`REQ-109`, test en mode
  avion). Aucune tentative de connexion hors ligne (`SPEC-AUTH-02` cas 5).
- Cet écran est **distinct** du message affiché quand une source externe est en
  panne alors que l'utilisateur est connecté (`SPEC-METEO-06` AC-7, cas 7 et 8).
- Le mode hors ligne complet (cache de cartes, données métier) est explicitement
  écarté (index des ADR, « Non retenus »).

**3. Purge des données personnelles du navigateur** (décision de l'équipe du
25/11/2026)

- Après déconnexion, aucune donnée personnelle du compte (profil, classement,
  consentement) ne reste dans le stockage local ni dans le cache de la PWA de
  l'appareil (`SPEC-AUTH-02` AC-7, `CASE-AUTH-52`).
- Après suppression du compte : même chose sur l'appareil utilisé, et sur les
  autres appareils **dès leur prochaine action** (`SPEC-AUTH-10` AC-5,
  `CASE-AUTH-54`). Un appareil resté hors connexion garde ses données jusque-là :
  limite assumée par la spec.
- Les specs renvoient la liste des emplacements à purger et le moyen technique à
  `SPEC-ARCH-nn` : cet ADR en fixe le moyen.
- `ADR-004` a déjà posé deux briques : `Cache-Control: no-store` sur les réponses
  contenant des données personnelles, et `Clear-Site-Data: "storage", "cache"`
  sur toute requête refusée faute de session valide, avec une purge côté client
  en complément, car le support de cet en-tête varie selon les navigateurs.

**4. Cartographie** (`REQ-032`, `REQ-102`, `CR-001/Q28`)

- Afficher sur une carte les tracés des sentiers (trajet choisi, trajet
  conseillé), les points d'eau et les spots de pêche.
- La saisie du départ « par un point sur une carte » est l'une des formes
  possibles laissées ouvertes par `SPEC-TRAIL-01` (« Ce qui n'est pas défini ») :
  la bibliothèque retenue doit la permettre sans l'imposer.
- Géométries stockées en WGS 84 (`EPSG:4326`) dans PostGIS et transmises en
  GeoJSON (`ST_AsGeoJSON`, `ADR-002`).
- Coût nul : bibliothèque libre, fonds de carte gratuits sans abonnement
  (`REQ-102`, `CR-001/Q28` : « cartographie et routage libres »).
- La cartographie des zones réglementées en mer est hors périmètre
  (`CR-001/Q32`).

**Contraintes**

- démonstration depuis un téléphone sur le réseau local, en HTTP, avec un
  navigateur configuré pour traiter l'adresse du poste comme une origine sécurisée
  (`ADR-004`, décision de l'équipe du 25/11/2026). Sans ce réglage, ni Service
  Worker ni `Clear-Site-Data` ;
- délai : fin de cycle le 09/12/2026, équipe de 3 développeurs (`ADR-001`) ;
- paramètres externalisés selon `ADR-003`.

## Options envisagées

Trois décisions indépendantes : le Service Worker, la purge, la carte.

### Décision 1 — Service Worker et installation

#### Option A — Pas de Service Worker, manifeste seul

| | |
|---|---|
| Ce qu'elle apporte | Rien à mettre en cache, donc rien à purger côté PWA. Aucun risque d'afficher une ancienne version après un nouveau build. |
| Ce qu'elle coûte | Ouverte sans réseau depuis l'écran d'accueil, l'application ne démarre pas : le navigateur affiche **sa propre page d'erreur**, pas notre écran d'indisponibilité. `REQ-109` n'est tenu que si l'application était déjà ouverte au moment de la coupure. Selon le navigateur, l'installation peut aussi être refusée sans Service Worker. |
| Ce qu'elle rend difficile plus tard | Rien : on peut ajouter un Service Worker ensuite. Mais le test en mode avion de `REQ-109` échoue dès aujourd'hui. |

#### Option B — Service Worker écrit à la main

| | |
|---|---|
| Ce qu'elle apporte | Contrôle total, une quarantaine de lignes : mise en cache d'une page hors connexion à l'installation, renvoi vers elle quand une navigation échoue, aucune autre interception. |
| Ce qu'elle coûte | Vite donne aux fichiers compilés des noms qui changent à chaque build : la liste des fichiers à mettre en cache et le numéro de version du cache sont à maintenir à la main. Une erreur de version laisse une ancienne application en place sur le téléphone de démo. |
| Ce qu'elle rend difficile plus tard | Chaque évolution (mise à jour, nouvelle ressource) est du code de Service Worker à tester soi-même. |

#### Option C — `vite-plugin-pwa` (Workbox) limité à la coquille de l'application

| | |
|---|---|
| Ce qu'elle apporte | Le plugin génère le manifeste et un Service Worker à partir du build Vite : la liste des fichiers compilés et leur version sont calculées automatiquement. On ne précharge **que la coquille** (HTML, JavaScript, CSS, icônes) : l'application démarre sans réseau et affiche son propre écran d'indisponibilité. Aucune règle de cache sur `/api` ni sur les tuiles de carte : ces requêtes partent sur le réseau comme sans Service Worker. |
| Ce qu'elle coûte | Une dépendance de build et sa configuration à comprendre. Le Service Worker généré doit être vérifié (que met-il en cache, qu'intercepte-t-il). |
| Ce qu'elle rend difficile plus tard | Rien de notable : si un mode hors ligne est un jour demandé, il s'ajoute par des règles de cache au même endroit. |

### Décision 2 — Purge des données personnelles

#### Option A — Stocker localement, puis tout effacer à la déconnexion

| | |
|---|---|
| Ce qu'elle apporte | Profil et classement disponibles instantanément au redémarrage, sans attendre l'API. |
| Ce qu'elle coûte | La purge doit connaître chaque emplacement utilisé, aujourd'hui et demain : un développeur qui ajoute une donnée en `localStorage` sans l'ajouter à la purge casse `SPEC-AUTH-02` AC-7 sans le voir. Sur les autres appareils, la donnée reste lisible tant qu'aucune requête n'a échoué. Et le gain est nul : sans réseau, l'application n'affiche de toute façon que l'écran d'indisponibilité. |
| Ce qu'elle rend difficile plus tard | Chaque nouvelle donnée personnelle ajoute un risque de fuite. |

#### Option B — Rien de personnel n'est écrit sur l'appareil ; purge défensive en complément

| | |
|---|---|
| Ce qu'elle apporte | Les données personnelles ne vivent qu'en **mémoire** de la page, chargées depuis `/api/moi/…` à chaque démarrage. Rechargement de la page = données effacées. La purge n'a qu'à vérifier qu'il ne reste rien, au lieu d'énumérer ce qu'il faut effacer. Les réponses sont déjà `no-store` (`ADR-004`) et le Service Worker ne met pas `/api` en cache (décision 1). |
| Ce qu'elle coûte | Une requête de chargement du profil à chaque démarrage (négligeable). Une règle d'équipe à faire respecter : pas de `localStorage`, `sessionStorage` ni IndexedDB pour des données du compte. |
| Ce qu'elle rend difficile plus tard | Un futur mode hors ligne devra rouvrir la question. Hors périmètre (`CR-001/Q27`). |

#### Option C — S'en remettre au seul en-tête `Clear-Site-Data`

| | |
|---|---|
| Ce qu'elle apporte | Aucun code côté client : le serveur ordonne au navigateur d'effacer stockage et caches. |
| Ce qu'elle coûte | Support inégal selon les navigateurs, et ignoré hors origine sécurisée : la démo HTTP en dépend d'un réglage du navigateur (`ADR-004`). Les tests `CASE-AUTH-52` et `CASE-AUTH-54` dépendraient du navigateur utilisé. |
| Ce qu'elle rend difficile plus tard | Garantir la purge sur un navigateur qui ne l'applique pas. |

### Décision 3 — Bibliothèque cartographique

#### Option A — Leaflet avec `react-leaflet`, tuiles raster

| | |
|---|---|
| Ce qu'elle apporte | Bibliothèque légère, stable depuis des années, très documentée. Affiche directement du GeoJSON (`L.geoJSON`) : le format renvoyé par PostGIS (`ADR-002`) passe sans conversion. Gestes tactiles (glisser, pincer) gérés nativement. `react-leaflet` v5 est compatible avec React 19. Fonctionne avec n'importe quel fond de tuiles raster gratuit (IGN, OpenStreetMap). |
| Ce qu'elle coûte | Rendu raster : pas de relief 3D ni de rotation de carte. Piège connu avec Vite : les icônes de marqueur par défaut ne s'affichent pas sans import explicite. |
| Ce qu'elle rend difficile plus tard | Un rendu 3D du relief ou un style de carte personnalisé demanderait de changer de bibliothèque. |

#### Option B — MapLibre GL JS, tuiles vectorielles

| | |
|---|---|
| Ce qu'elle apporte | Rendu WebGL fluide, relief 3D possible (parlant pour les cirques de La Réunion), style de carte entièrement personnalisable. Libre. |
| Ce qu'elle coûte | Bibliothèque nettement plus lourde à charger sur mobile. Exige une source de tuiles vectorielles gratuite et son style, ou un fichier de tuiles auto-hébergé à produire. Courbe d'apprentissage plus longue pour une équipe de 3 avec 2 semaines de délai. |
| Ce qu'elle rend difficile plus tard | Rien : c'est l'option la plus évolutive. |

#### Option C — OpenLayers

| | |
|---|---|
| Ce qu'elle apporte | Très complète (projections, WMTS natif, formats SIG), libre. |
| Ce qu'elle coûte | Lourde et verbeuse pour notre besoin (quelques tracés et points) ; pas d'intégration React officielle. |
| Ce qu'elle rend difficile plus tard | Rien de spécifique, mais on paie la complexité sans en avoir l'usage. |

#### Fond de carte (sous-choix, quel que soit l'outil)

- *Plan IGN v2 (Géoplateforme de l'IGN)* : gratuit, sans clé, licence ouverte
  Etalab 2.0, couvre La Réunion ; cartographie française de référence, lisible
  pour la randonnée.
- *OpenStreetMap (serveur de tuiles de la fondation)* : gratuit, sans clé, licence
  ODbL ; la politique d'usage interdit l'usage intensif et le téléchargement en
  masse : convient à une démo, pas à une application ouverte au public.
- *OpenTopoMap* : relief très lisible, mais serveurs lents et même réserve
  d'usage que OpenStreetMap.

## Décision

Nous retenons :

1. **`vite-plugin-pwa` limité à la coquille** : manifeste généré, Service Worker
   qui ne précharge que les fichiers compilés de l'application et n'intercepte ni
   `/api` ni les tuiles de carte ; l'écran d'indisponibilité est un écran de
   l'application, affiché quand l'API est injoignable.
2. **Aucune donnée personnelle écrite sur l'appareil** : elles restent en mémoire
   de la page. Une **purge défensive côté client** s'exécute à la déconnexion, à
   la suppression du compte et à toute réponse `401`, doublée de l'en-tête
   `Clear-Site-Data` déjà prévu par `ADR-004`.
3. **Leaflet avec `react-leaflet`**, fond **Plan IGN v2** par défaut et
   OpenStreetMap en fond de secours, l'adresse des tuiles étant un paramètre.

## Raisons

- **Le Service Worker sert à `REQ-109`, pas à un mode hors ligne.** Sans lui,
  l'application lancée depuis l'écran d'accueil en mode avion ne démarre pas, et
  c'est la page d'erreur du navigateur qui s'affiche : le test de `REQ-109`
  échoue. Précharger la coquille, et seulement elle, suffit pour que notre écran
  s'affiche. La coquille ne contient que du code, aucune donnée : elle respecte
  `CR-001/Q27`.
- **Le plugin plutôt qu'un Service Worker manuel** parce que le vrai risque d'un
  Service Worker, c'est de garder une ancienne version de l'application sur le
  téléphone. Le plugin calcule la liste et la version des fichiers à chaque
  build ; l'option manuelle nous ferait porter ce risque pendant la recette.
- **La meilleure purge est celle qui n'a rien à effacer.** Stocker localement ne
  rapporte rien ici : sans réseau, l'application n'affiche que l'écran
  d'indisponibilité, donc un profil en cache ne serait jamais montré. En ne
  stockant rien, `SPEC-AUTH-02` AC-7 et `SPEC-AUTH-10` AC-5 deviennent vrais par
  construction ; la purge et les tests vérifient qu'aucun développeur n'a dérogé
  à la règle.
- **La purge côté client est le mécanisme garanti, `Clear-Site-Data` le
  complément.** L'en-tête dépend du navigateur et d'une origine sécurisée ; le
  code de purge s'exécute partout. Pour les autres appareils après suppression
  du compte (`SPEC-AUTH-10` AC-5), la « prochaine action » produit une réponse
  `401` (`ADR-004` : le compte est relu à chaque requête) : c'est elle qui
  déclenche la purge.
- **Deux causes, deux écrans** (`SPEC-METEO-06` AC-7). Une requête vers `/api`
  qui n'obtient **aucune réponse** (erreur réseau) signifie que l'utilisateur
  n'a pas de connexion : écran d'indisponibilité. Une réponse du serveur qui
  signale une source en panne affiche le message par secteur. La distinction
  repose sur un fait technique, pas sur une supposition.
- **Leaflet parce que le besoin est simple et le délai court.** Quelques tracés
  et points en GeoJSON, sur mobile, en deux semaines : Leaflet le fait avec le
  moins de code et le moins de poids. Le relief 3D de MapLibre serait un plus
  visuel qu'aucune exigence ne demande.
- **Plan IGN par défaut** parce qu'il est gratuit, sans clé, sous licence ouverte,
  et que sa politique d'usage ne pose pas la réserve d'OpenStreetMap pour une
  application ouverte au public (`CR-001/Q03`). OpenStreetMap reste
  configuré pour basculer si la Géoplateforme est indisponible pendant la démo.

## Conséquences acceptées

**Service Worker et installation**

- Configuration de `vite-plugin-pwa` : `registerType: 'autoUpdate'` (une nouvelle
  version remplace l'ancienne sans action de l'utilisateur) ; précache limité aux
  fichiers compilés (`js`, `css`, `html`, icônes, polices) ;
  `navigateFallback: 'index.html'` avec `/api/` exclu ; **aucune règle
  `runtimeCaching`**. Toute règle de cache ajoutée plus tard sur `/api` ou sur des
  tuiles remet en cause cet ADR.
- Le Service Worker généré est relu une fois (fichiers préchargés, routes
  interceptées) et un test vérifie que le précache ne contient aucune URL
  `/api/`.
- Manifeste : `name`, `short_name`, `start_url: "/"`, `scope: "/"`,
  `display: "standalone"`, couleurs de thème et de fond, icônes 192 et 512 px et
  une icône `maskable`. Pour iOS, balise `apple-touch-icon` dans `index.html`.
- Nginx (`ADR-001`) : `sw.js` et `index.html` servis avec
  `Cache-Control: no-cache` (sinon une mise à jour peut ne pas être vue) ; fichiers
  compilés à nom versionné en cache long ; type
  `application/manifest+json` déclaré pour l'extension `.webmanifest`, absente
  des types MIME par défaut de Nginx.
- Bouton « Installer l'application » affiché uniquement quand le navigateur
  émet l'évènement `beforeinstallprompt` (navigateurs Chromium). Sur iOS et
  Firefox, l'installation passe par le menu du navigateur : une courte aide
  l'explique. C'est la lecture retenue de « sur les navigateurs qui le
  permettent » (`REQ-101`).
- Le Service Worker n'existe qu'en origine sécurisée : la démo dépend du réglage
  du navigateur décrit dans `ADR-004`. `localhost` est sécurisé d'office : en
  développement sur le poste, rien à régler.

**Écran d'indisponibilité** (`REQ-109`)

- Tous les appels à l'API passent par **un seul client HTTP** du frontend. Une
  erreur réseau (aucune réponse) bascule l'application sur l'écran
  d'indisponibilité ; l'évènement `online` du navigateur relance le chargement.
  `navigator.onLine` sert d'indice pour afficher l'écran plus tôt, jamais de
  preuve de connexion (il vaut souvent `true` sur un Wi-Fi sans internet).
- Une réponse `502` ou `504` de Nginx (backend arrêté) n'est **pas** une absence
  de connexion de l'utilisateur : elle affiche un message « service
  indisponible », distinct des deux autres.
- L'écran ne montre aucune donnée personnelle et ne propose pas de connexion
  (`SPEC-AUTH-02` cas 5). Libellé à proposer par l'équipe.

**Purge locale** (`SPEC-AUTH-02` AC-7, `SPEC-AUTH-10` AC-5)

- **Règle d'équipe** : aucune donnée du compte dans `localStorage`,
  `sessionStorage`, IndexedDB ou le stockage de cache. L'état de l'application
  (profil, classement, consentement) vit en mémoire ; si une bibliothèque de
  cache de requêtes est utilisée, son cache reste en mémoire, sans module de
  persistance.
- Une fonction unique `purgerDonneesLocales()` :
  1. vide `localStorage` et `sessionStorage` ;
  2. supprime toutes les bases IndexedDB de l'origine ;
  3. supprime tous les caches du stockage de cache **sauf** le précache de la
     coquille (nom commençant par `workbox-precache`), qui ne contient que du
     code ;
  4. recharge la page sur l'écran de connexion (`location.replace`), ce qui
     efface la mémoire de la page.
- Elle est appelée : après la réponse à la déconnexion, après la confirmation de
  suppression du compte, et par le client HTTP sur **toute** réponse `401`
  (session expirée, compte supprimé depuis un autre appareil).
- Le backend renvoie aussi `Clear-Site-Data: "cache", "storage"` sur la
  déconnexion et la suppression du compte, en plus des requêtes refusées déjà
  prévues par `ADR-004`. Conséquence assumée : la directive `"storage"`
  désinscrit aussi le Service Worker. Il est réinscrit au prochain chargement de
  la page en ligne ; d'ici là, une application rouverte sans réseau affiche la
  page d'erreur du navigateur au lieu de notre écran. Cas rare (déconnexion puis
  coupure avant toute réouverture), accepté.
- Un appareil resté hors connexion conserve sa page ouverte jusqu'à sa prochaine
  action connectée : limite déjà assumée par `SPEC-AUTH-10`.
- `CASE-AUTH-52` et `CASE-AUTH-54` sont des tests de bout en bout dans un vrai
  navigateur (outil fixé par `ADR-011`) : après déconnexion ou suppression, ils
  vérifient que le stockage local et de session sont vides, qu'il n'existe aucune
  base IndexedDB et qu'il ne reste que le précache de la coquille.

**Cartographie**

- Dépendances : `leaflet` et `react-leaflet` (v5, pour React 19). Icônes de
  marqueur importées explicitement (piège Vite).
- Fonds de carte en paramètres (`ADR-003`) : adresse des tuiles, attribution et
  niveau de zoom maximal de chaque fond. Basculer de l'IGN vers OpenStreetMap ne
  change pas le code.
- Plan IGN v2 par le service de tuiles WMTS de la Géoplateforme, attribution
  « © IGN » ; OpenStreetMap avec l'attribution « © contributeurs OpenStreetMap ».
  Les deux fonds et leurs conditions d'utilisation entrent dans le catalogue des
  sources (`ADR-005`, `REQ-102`).
- À vérifier en début d'implémentation : rendu et niveau de détail du Plan IGN
  sur les sentiers du panel pilote (La Possession → Mafate, Roche Écrite, Piton
  des Neiges).
- Les tuiles ne sont jamais préchargées ni mises en cache par le Service Worker
  (pas de carte hors ligne, `CR-001/Q27` ; téléchargement en masse interdit par
  la politique d'OpenStreetMap). Le cache HTTP du navigateur peut en garder : ce
  ne sont pas des données personnelles au sens de `SPEC-AUTH-02` AC-7.
- L'API renvoie les géométries en GeoJSON. Pour l'affichage, un tracé peut être
  allégé côté serveur (`ST_Simplify`) ; cet allègement ne sert qu'à l'écran et
  ne remplace pas la simplification du GPX, qui a ses propres tolérances
  (`ADR-010`). Les altitudes (coordonnée Z) sont ignorées par Leaflet à
  l'affichage.

**Mobile-first**

- Styles écrits d'abord pour le petit écran, élargis par des requêtes
  `min-width`. CSS Modules (fournis par Vite, sans dépendance). Pas de
  bibliothèque de composants imposée par cet ADR.
- Balise `viewport` sans blocage du zoom (accessibilité) ; zones tactiles d'au
  moins 44 px.
- Sur mobile, la carte occupe une zone de hauteur fixe ou un écran dédié, pour
  que le glissement d'un doigt fasse défiler la page hors de la carte.
- Recette de `REQ-101` : parcours complet sur les smartphones de test, puis
  installation sur les navigateurs compatibles, par l'équipe, hors démo client.

## Ce qui nous ferait revenir dessus

- Le client demande un mode hors ligne (récapitulatif, carte ou checklist
  consultables en zone blanche) → nouvel ADR : règles de cache sur `/api` et les
  tuiles, et la purge doit alors énumérer ce qui est stocké (option A de la
  décision 2).
- Le navigateur de démo ne traite plus l'adresse du poste comme sécurisée → Nginx
  sert en HTTPS avec un certificat local de confiance installé sur le téléphone
  de démo (par exemple généré par `mkcert`) ; le reste de l'ADR ne change pas.
- Le Service Worker généré intercepte ou met en cache autre chose que la coquille
  (constaté à la relecture ou par le test du précache) → corriger la
  configuration ; si le plugin ne le permet pas, option B (Service Worker manuel).
- La désinscription du Service Worker par `Clear-Site-Data: "storage"` gêne en
  recette → garder `"cache"` seul sur la déconnexion et laisser la purge client
  traiter le stockage.
- Le Plan IGN est illisible ou trop pauvre sur les sentiers du panel pilote, ou la
  Géoplateforme change ses conditions d'accès → OpenStreetMap ou OpenTopoMap par
  défaut, par simple changement de paramètre.
- Le client demande le relief en 3D ou une carte stylée → MapLibre GL JS
  (option B de la décision 3), avec une source de tuiles vectorielles gratuite à
  ajouter au catalogue d'`ADR-005`.
- Mise en ligne publique → la réserve d'usage d'OpenStreetMap interdit de garder
  ses tuiles en secours sans accord ou sans fournisseur tiers ; HTTPS obligatoire
  (déjà noté dans `ADR-004`).
