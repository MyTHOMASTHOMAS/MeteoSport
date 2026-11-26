# ADR-011 — Stratégie de tests automatisés, traçabilité CASE et simulation de pannes

**Statut :** proposé
**Date :** 26/11/2026
**Décidé par :** équipe projet

---

## Contexte

Le projet suit la chaîne du kit TDD :
`CR → REQ → SPEC → CASE → test automatisé → code → commit`. Chaque cas de test
documentaire (`tdd/tests/cases/<domaine>/CASE-<DOM>-<nn>.md`) devient un test
automatisé écrit **avant** le code (rouge, puis vert). Une rupture dans la
chaîne est un trou de couverture.

Plusieurs exigences du CDC ne se prouvent que par des tests, et le CDC dit
lesquels :

| Exigence | Ce que le CDC demande de vérifier |
|---|---|
| `REQ-103` | Couper chaque source, puis simuler une donnée périmée : message par secteur, aucune valeur inventée (`R-07`). |
| `REQ-105` | Accès croisé entre deux comptes, pour chaque opération (consulter, modifier, exporter, supprimer). |
| `REQ-106` | Accès à l'espace d'administration avec un compte ordinaire. |
| `REQ-107` | Tests automatisés sur des jeux de données de référence. |
| `REQ-110` | Contrôle du fichier `.gpx` (format standard), puis import sur les appareils de test. |
| `REQ-114` | Conservation des mots de passe ; connexions échouées répétées. |

Les ADR précédents ont renvoyé ici des points précis :

- `ADR-001` — TypeScript sur les deux instances, Express 5 et React 19 / Vite,
  Docker Compose ; recette sur les images compilées.
- `ADR-002` — PostgreSQL / PostGIS ; les tests d'intégration utilisent la même
  image ; tests reproductibles sur un poste neuf.
- `ADR-003` — chaque paramètre a un test « modification → effet », plus les
  refus (hors bornes, chevauchement de zones) et le signalement des références
  invalides.
- `ADR-004` — session relue en base à chaque requête ; routes `/api/moi/…` sans
  identifiant de compte ; routes `/api/admin/…` réservées ; Mailpit ; aucun
  secret dans les journaux (`CASE-AUTH-25`).
- `ADR-005` — chaque source est derrière une interface ; les tests la
  remplacent par une source simulée pour la couper ou la rendre périmée.
- `ADR-006` — `CASE-AUTH-52` et `CASE-AUTH-54` en vrai navigateur ; précache
  sans URL `/api/` ; écran d'indisponibilité en mode avion (`REQ-109`).
- `ADR-007` — graphe et routage en mémoire, en TypeScript, testables sans base.
- `ADR-008` — moteurs purs appelés avec un contexte complet ; égalité stricte
  avant arrondi ; un même contexte calculé deux fois donne le même résultat.
- `ADR-009` — textes types testés au mot près (`CASE-CALC-28` à `30`) ; IA
  lente, en erreur ou infidèle simulée.
- `ADR-010` — validation au schéma GPX 1.1 avant remise du fichier.

Contraintes : coût nul, outils libres et gratuits (`REQ-102`) ; trois
développeurs ; fin de cycle le 09/12/2026.

Quatre questions sont à trancher : les outils de test ; la base utilisée par
les tests ; la simulation des sources externes et du temps ; le contrôle de la
correspondance entre CASE et tests.

## Options envisagées

### Lanceur de tests (backend et frontend)

#### Option V — Vitest

| | |
|---|---|
| Ce qu'elle apporte | TypeScript et modules ES sans configuration ; même configuration que Vite, déjà retenu pour le frontend (`ADR-001`) ; un seul outil pour les deux instances ; API proche de Jest (`expect`, `vi.fn`, minuteurs simulés) ; mode surveillance rapide pour le cycle rouge → vert. |
| Ce qu'elle coûte | Outil plus jeune que Jest ; certaines ressources d'aide en ligne sont écrites pour Jest et demandent une transposition. |
| Ce qu'elle rend difficile plus tard | Rien de notable : la syntaxe des tests est quasi identique à celle de Jest. |

#### Option J — Jest

| | |
|---|---|
| Ce qu'elle apporte | Référence historique, documentation abondante. |
| Ce qu'elle coûte | TypeScript via `ts-jest` ou Babel ; prise en charge des modules ES encore expérimentale ; une seconde chaîne de compilation à côté de Vite. |
| Ce qu'elle rend difficile plus tard | Aligner la configuration du frontend (Vite) et celle des tests. |

#### Option N — Lanceur intégré de Node.js (`node:test`)

| | |
|---|---|
| Ce qu'elle apporte | Aucune dépendance. |
| Ce qu'elle coûte | Simulation de modules et de minuteurs plus limitée ; rien pour les composants React : il faudrait un second outil côté frontend. |
| Ce qu'elle rend difficile plus tard | Partager utilitaires et conventions entre les deux instances. |

### Tests dans un vrai navigateur

#### Option P — Playwright

| | |
|---|---|
| Ce qu'elle apporte | Coupure réseau simulée (`setOffline`) pour `REQ-109` ; plusieurs contextes isolés dans un même test, c'est-à-dire **deux appareils** pour `SPEC-AUTH-10` AC-4 ; lecture du stockage local, d'IndexedDB et du stockage de cache pour `CASE-AUTH-52` et `54` ; Service Worker pris en charge sous Chromium. Libre et gratuit. |
| Ce qu'elle coûte | Navigateurs à télécharger ; tests lents (images à construire). |
| Ce qu'elle rend difficile plus tard | Rien de notable. |

#### Option C — Cypress

| | |
|---|---|
| Ce qu'elle apporte | Interface de mise au point agréable, gratuite en local. |
| Ce qu'elle coûte | Un seul onglet par test : deux appareils dans un même scénario demandent des contournements ; simulation hors connexion moins directe. |
| Ce qu'elle rend difficile plus tard | Les scénarios multi-appareils d'`AUTH`. |

### Base de données des tests d'intégration

#### Option B1 — Service `db-test` du Docker Compose

| | |
|---|---|
| Ce qu'elle apporte | Même image PostGIS que l'application, déclarée une seule fois (`ADR-002`) ; l'équipe utilise déjà Docker Compose (`ADR-001`) ; données en mémoire (`tmpfs`), donc rapides et effacées à l'arrêt. |
| Ce qu'elle coûte | Le service doit être démarré avant la suite (fait par le script de test). Une seule base : les fichiers d'intégration ne peuvent pas tourner en parallèle. |
| Ce qu'elle rend difficile plus tard | Paralléliser la suite d'intégration. |

#### Option B2 — Testcontainers (conteneur lancé par les tests eux-mêmes)

| | |
|---|---|
| Ce qu'elle apporte | Aucun service à démarrer à la main ; une base par fichier possible, donc parallélisme. |
| Ce qu'elle coûte | Une dépendance de plus ; accès à Docker depuis le processus de test ; version de l'image à reporter dans le code de test. |
| Ce qu'elle rend difficile plus tard | Rien : c'est la voie d'évolution si la suite devient lente. |

#### Option B3 — Base simulée en mémoire (`pg-mem`)

| | |
|---|---|
| Ce qu'elle apporte | Aucun Docker, très rapide. |
| Ce qu'elle coûte | **Pas de PostGIS**, comportement approché de PostgreSQL : un test vert ne prouve pas que l'application fonctionne. |
| Ce qu'elle rend difficile plus tard | Tout test qui touche aux géométries ou aux transactions. |

### Simulation des sources externes

#### Option S1 — Sources simulées en mémoire seulement

| | |
|---|---|
| Ce qu'elle apporte | Simple et rapide : une fausse implémentation de l'interface d'`ADR-005`. |
| Ce qu'elle coûte | Le code HTTP réel des adaptateurs (lecture de la réponse, délai dépassé, erreur 5xx, réponse illisible) n'est jamais exercé ; c'est pourtant là qu'une panne réelle se manifeste. |
| Ce qu'elle rend difficile plus tard | Détecter un adaptateur qui plante au lieu de signaler l'indisponibilité. |

#### Option S2 — Interception HTTP seulement (`msw`)

| | |
|---|---|
| Ce qu'elle apporte | Le vrai code des adaptateurs est exercé. |
| Ce qu'elle coûte | Chaque test métier (verdict, pêche, affichage) doit fabriquer des réponses HTTP brutes : tests longs, couplés au format de chaque API. |
| Ce qu'elle rend difficile plus tard | Changer de source : tous les tests métier sont à reprendre. |

#### Option S3 — Les deux, chacun à son niveau

| | |
|---|---|
| Ce qu'elle apporte | Interception HTTP pour tester chaque adaptateur ; sources simulées pour tout ce qui est au-dessus. |
| Ce qu'elle coûte | Deux mécanismes à connaître. |
| Ce qu'elle rend difficile plus tard | Rien de notable. |

## Décision

Nous retenons **Vitest** pour les tests unitaires, d'intégration et de
composants des deux instances, **Supertest** pour tester l'API Express sur une
**vraie base PostgreSQL / PostGIS** fournie par un service `db-test` du Docker
Compose, et **Playwright** pour les seuls comportements qui exigent un vrai
navigateur ; les sources externes sont simulées **à deux niveaux** (`msw` pour
les adaptateurs, sources simulées au-dessus) et le temps est piloté par une
**horloge injectée** ; chaque CASE a **son fichier de test**, nommé d'après lui,
et un script vérifie la correspondance CASE ↔ test.

### Niveaux de test

1. **Quatre niveaux, un critère de choix.** Un CASE est testé au niveau le plus
   bas qui peut le faire échouer.

   | Niveau | Outil | Ce qui tourne | Domaines et sujets |
   |---|---|---|---|
   | Unitaire | Vitest | Une fonction ou un module ; ni base, ni réseau, ni horloge réelle | `CALC`, `PECHE`, `COMP` (moteurs et évaluateur de règles, `ADR-008`) ; routage `TRAIL` (`ADR-007`) ; sérialisation et simplification `GPX` ; gabarits d'explication (`ADR-009`) ; calcul de fraîcheur ; validation des paramètres |
   | Intégration API | Vitest + Supertest | L'application Express complète, en mémoire (sans écoute de port), sur la base `db-test`, avec sources, courriel et IA simulés | `AUTH`, `ADMIN`, imports `REF`, collecte et cache `METEO`, paramètres (`ADR-003`) ; `REQ-103`, `REQ-105`, `REQ-106`, `REQ-114` |
   | Composant | Vitest + Testing Library + jsdom | Un composant React ou un module du frontend | Seulement là où une règle se joue dans le navigateur : client HTTP unique (`401` → purge, erreur réseau → écran d'indisponibilité, `502`/`504` → service indisponible) et `purgerDonneesLocales()` (`ADR-006`) |
   | Bout en bout | Playwright (Chromium) | Les images compilées, lancées par Docker Compose | `CASE-AUTH-52` et `54` (purge), `REQ-109` en mode avion, révocation sur un second appareil (`SPEC-AUTH-10` AC-4), précache sans `/api/` (`ADR-006`), un parcours nominal recherche trail → téléchargement GPX |

2. **Point d'entrée testable.** Le backend expose une fonction
   `creerApplication(dependances)` qui renvoie l'application Express **sans**
   l'écouter ; le démarrage réel (`listen`, tâche de collecte) est dans un
   fichier séparé. Les dépendances injectées sont : horloge, registre des
   sources, transport de courriel, journaliseur, client d'IA, accès à la base.
   La production passe les vraies ; les tests passent des doubles.

### Traçabilité CASE → test

3. **Un fichier par CASE**, dans le dossier `tests/` de l'instance concernée,
   `<domaine>` étant le code du domaine en minuscules (comme
   `tdd/tests/cases/<domaine>/`) :

   ```text
   backend/tests/tests-unitaires/<domaine>/case-<dom>-<nn>.test.ts
   backend/tests/tests-integration/<domaine>/case-<dom>-<nn>.test.ts
   frontend/tests/tests-composants/<domaine>/case-<dom>-<nn>.test.tsx
   e2e/tests/<domaine>/case-<dom>-<nn>.spec.ts
   ```

   Le champ **Fichier** de chaque CASE indique le chemin retenu, donc le niveau.

4. **Nom des tests.** Chaque test commence par `test_CASE_<DOM>_<nn>_`
   (gabarit CASE). Un même CASE peut avoir plusieurs tests dans son fichier
   (par exemple `test.each` sur les quatre opérations de `CASE-AUTH-39` :
   `test_CASE_AUTH_39_acces_croise_$operation`). Un test ne vérifie qu'un seul
   CASE : pas d'assertion étrangère (revue du gabarit CASE).

5. **Script de contrôle `npm run tracabilite`.** Sans exécuter les tests, il :
   - liste les `CASE-<DOM>-<nn>.md` de `tdd/tests/cases/` ;
   - liste les fichiers de test et les noms `test_CASE_…` qu'ils contiennent ;
   - **échoue** si un CASE n'a pas de fichier de test, si un test cite un CASE
     qui n'existe pas, ou si un test cite un autre CASE que celui de son fichier ;
   - **signale** sans échouer les tests marqués `todo` ou `skip` ;
   - produit le tableau CASE → fichier → tests, repris dans
     `tdd/docs/traceability.md` ; s'il trouve les rapports JSON de Vitest et
     Playwright de la dernière exécution, il y ajoute l'état (rouge ou vert).

### Temps et fuseau

6. **Horloge injectée.** Le backend lit l'heure courante par un seul service,
   `Horloge` (`maintenant()`). Production : horloge système ; tests : horloge
   fixe, que le test fait avancer. Toute comparaison de temps métier passe par
   elle : fraîcheur des données, fin de blocage, expiration du lien de
   réinitialisation, planification de la collecte, purge de l'historique des
   pluies. **Jamais par `now()` de PostgreSQL**, que les tests ne peuvent pas
   piloter. Les moteurs d'`ADR-008` reçoivent déjà l'heure en entrée.
   Exception : l'expiration des sessions est gérée par `express-session` et
   `connect-pg-simple` (`ADR-004`), qui lisent l'heure système ; ces tests la
   pilotent par `vi.setSystemTime` (à confirmer à l'implémentation).
7. **Fuseau forcé.** Les tests s'exécutent avec le fuseau du processus réglé sur
   UTC (configuration de Vitest). Un code qui dépend du fuseau de la machine au
   lieu d'utiliser explicitement celui de La Réunion produit alors des heures
   fausses de 4 heures, que les jeux de référence détectent.

### Sources externes simulées (`REQ-103`)

8. **Adaptateurs testés avec leur vrai code HTTP.** Un adaptateur par source
   (Open-Meteo Forecast, Open-Meteo Marine, vigilance Météo-France). Les requêtes
   sont interceptées par `msw` (mode Node), qui renvoie des réponses
   **enregistrées une fois depuis la vraie API** et versionnées dans
   `backend/tests/fixtures/sources/<source>/`. Scénarios obligatoires pour chaque
   adaptateur : réponse normale, erreur 5xx, délai dépassé, réponse illisible,
   refus pour quota, réponse sans date de mise à jour (date de réception
   présentée comme telle, `SPEC-METEO-06` cas limite 6). `msw` est réglé pour
   **faire échouer** toute requête non prévue : aucun test n'atteint Internet,
   aucun quota n'est consommé.
9. **Sources simulées au-dessus des adaptateurs.** Pour la collecte, le cache, la
   fraîcheur, les moteurs et l'affichage, une `SourceSimulee` implémente
   l'interface d'`ADR-005`, avec trois commandes : répondre (données et date du
   producteur), être en panne, avoir atteint son quota.
10. **Péremption simulée par le temps, pas par des données fabriquées.** Une
    donnée périmée est une donnée reçue normalement, puis l'horloge avance
    au-delà de l'âge maximal paramétré (`ADR-003`). C'est la comparaison réelle
    de l'application qui est testée.
11. **Matrice de `REQ-103` dérivée du registre des sources.** Un test
    d'intégration parcourt le registre des sources du backend et vérifie, pour
    chaque source et pour chacun des cas « coupée » et « périmée », sur chaque
    secteur qui l'affiche : message par secteur, date de la dernière donnée,
    **aucune valeur**. L'état des sentiers (saisie de l'administrateur) entre
    dans la matrice pour la péremption (« non vérifié », `SPEC-REF-05` AC-7).
    Une source ajoutée au registre sans scénario fait échouer ce test.
12. **IA (`ADR-009`).** Le service local est simulé par `msw` : réponse fidèle,
    réponse au-delà du délai d'attente, erreur, réponse infidèle. Dans les trois
    derniers cas, le test vérifie que le texte type est affiché.
13. **Courriel.** En intégration, transport Nodemailer en mémoire : le test lit
    le message et en extrait le lien de réinitialisation. En bout en bout, le
    test lit le courriel dans Mailpit par son API HTTP.

### Base de données

14. Service `db-test` dans `docker-compose.yml`, profil `test`, **même image**
    que la base de l'application, données en `tmpfs`, port distinct. Les
    migrations sont jouées une fois au début de la suite. Avant chaque test, les
    tables de données sont vidées (`TRUNCATE … RESTART IDENTITY CASCADE`) puis
    un jeu minimal est chargé (paramètres d'`ADR-003`, petit référentiel de
    test). Les fichiers d'intégration s'exécutent l'un après l'autre ; les
    tests unitaires, en parallèle.

### Jeux de référence (`REQ-107`)

15. Un jeu de référence est un fichier JSON :
    `backend/tests/jeux-reference/<domaine>/<nom>.json`, qui contient le contexte
    complet d'entrée (`ADR-008`, point 2), le résultat attendu et la trace
    attendue, calculés à la main dans le CASE qui le cite. Pour chaque jeu, le
    test vérifie :
    - l'égalité stricte du résultat et de la trace, avant arrondi ;
    - qu'un second calcul sur le même contexte donne un résultat identique ;
    - qu'un calcul sur le même contexte, collections mélangées dans un autre
      ordre, donne le même résultat (tri imposé par `ADR-008`, point 4) ;
    - le tout sous fuseau UTC (point 7).

    Les jeux du panel pilote (La Possession → Mafate, Roche Écrite, Piton des
    Neiges) sont relus avec le client à la recette (`R-05`).

### Fichiers GPX (`REQ-110`)

16. Le schéma officiel GPX 1.1 (XSD publié par Topografix) est **copié dans le
    dépôt** (`backend/tests/fixtures/gpx/gpx-1.1.xsd`) : aucun téléchargement
    pendant les tests. Chaque fichier produit à partir des jeux de référence est
    validé contre ce schéma, avec le validateur retenu par `ADR-010` (proposé :
    `xmllint-wasm`, libxml2 compilé en WebAssembly, sans module natif à
    construire dans l'image Docker). Un test soumet aussi un fichier
    volontairement non conforme, qui doit être refusé : il prouve que le
    validateur n'accepte pas tout, et couvre `CASE-GPX-20` (aucun fichier non
    conforme remis). La date de production vient de l'horloge injectée : un même
    jeu produit toujours le même fichier.
17. **Partie manuelle.** L'import sur les montres et GPS de l'équipe ne
    s'automatise pas. Il fait l'objet d'une fiche de recette par appareil
    (modèle, date, fichier importé, résultat), rangée dans `tdd/docs/`.

### Accès et sécurité (`REQ-105`, `REQ-106`, `REQ-114`)

18. **Registre des routes.** Chaque route de l'API est déclarée dans un registre
    unique, avec son niveau d'accès (`public`, `utilisateur`,
    `administrateur`) ; l'application monte ses routes **à partir** de ce
    registre. Un test d'intégration parcourt le registre et vérifie, pour chaque
    route et chaque profil (anonyme, utilisateur, utilisateur et
    administrateur), la réponse attendue : `401`, `403` ou accès. Une nouvelle
    route est couverte d'office (`REQ-106`, `R-16`). Un test vérifie aussi que le
    retrait du rôle administrateur prend effet dès la requête suivante
    (`ADR-004`).
19. **Accès croisé** (`CASE-AUTH-39`, `CASE-AUTH-41`). Deux comptes A et B sont
    remplis de **valeurs marqueurs** distinctes (poids, VMA, sports favoris
    différents). Pour chaque opération (consulter, modifier, exporter,
    supprimer) faite avec la session de A : la réponse ne contient aucune valeur
    de B, et les données de B en base sont inchangées après l'opération. Les
    réponses des routes d'administration ne contiennent aucune valeur marqueur
    des profils (`SPEC-AUTH-08` AC-2). Un test vérifie enfin qu'aucune route
    `/api/moi/…` du registre ne prend d'identifiant de compte en paramètre
    (cloisonnement par construction, `ADR-004`).
20. **Mots de passe et blocage** (`REQ-114`) :
    - après inscription, la valeur stockée commence par `$argon2id$` et ne
      contient pas le mot de passe ; aucune réponse de l'API (profil, export) ne
      contient ce haché ;
    - pendant inscription, connexion et réinitialisation, les journaux capturés
      en mémoire ne contiennent ni mot de passe, ni haché, ni jeton, ni
      identifiant de session (`CASE-AUTH-25`) ;
    - blocage : le seuil et la durée sont **lus dans les paramètres**, jamais
      écrits en dur dans le test ; la tentative qui suit le seuil est refusée
      même avec le bon mot de passe ; l'horloge avancée de la durée rend la
      connexion de nouveau possible ; deux agents Supertest (deux appareils)
      cumulent le même compteur ;
    - la parade contre la mesure du temps de réponse (hachage factice pour un
      identifiant inconnu, `ADR-004`) est vérifiée par un espion sur le service
      de hachage, pas par une mesure de durée, trop instable.

### Exécution

21. Commandes, depuis la racine du dépôt :
    - `npm run test:unit` — unitaires et composants, sans Docker ;
    - `npm run test:integration` — démarre `db-test`, puis lance Supertest ;
    - `npm run test:e2e` — construit et démarre les images, puis lance
      Playwright ;
    - `npm run tracabilite` — contrôle CASE ↔ test.
22. **Avant chaque fusion** sur la branche principale : unitaires, intégration
    et traçabilité au vert. **Bout en bout** : avant chaque démonstration ou
    recette, et pour toute modification de l'authentification ou du frontend
    qui touche à la purge, au Service Worker ou au client HTTP. Si le dépôt est
    hébergé sur une plateforme offrant une intégration continue gratuite, elle
    lance les mêmes commandes ; sinon, l'auteur les lance et le dit dans sa
    demande de fusion.
23. **Couverture de code** mesurée (Vitest, fournisseur `v8`) pour information,
    **sans seuil** : l'indicateur suivi est « chaque CASE a son test, et il est
    vert ».

## Raisons

- **Un seul lanceur pour tout le code TypeScript.** Vitest lit la même
  configuration que Vite (`ADR-001`) et comprend TypeScript sans chaîne de
  compilation supplémentaire ; Jest en demanderait une, et le lanceur de Node.js
  laisserait le frontend sans outil. Avec trois développeurs et deux semaines,
  un outil de moins à apprendre compte.
- **Les règles d'accès vivent dans la combinaison route + session + base.** Une
  session relue en base à chaque requête, un compteur incrémenté de façon
  atomique, une suppression en cascade (`ADR-004`) : aucun de ces mécanismes
  n'est prouvé par une base simulée. D'où Supertest sur une vraie base, et le
  rejet de l'option B3.
- **`db-test` dans Docker Compose plutôt que Testcontainers** : même résultat,
  une dépendance de moins, et la version de l'image reste écrite à un seul
  endroit (`ADR-002`). Testcontainers reste la voie d'évolution si la suite
  ralentit.
- **Playwright parce que deux exigences sont « multi-appareils » ou « hors
  connexion ».** `SPEC-AUTH-10` AC-4 (un second appareil perd l'accès) et
  `REQ-109` (mode avion) s'écrivent directement avec ses contextes isolés et sa
  coupure réseau ; avec Cypress, ce sont des contournements.
- **Deux niveaux de simulation parce que les pannes ont deux origines.** Une
  panne réelle se manifeste dans le code HTTP (délai, erreur, réponse
  illisible) : il faut l'exercer pour chaque adaptateur (S2). Mais les dizaines
  de tests métier n'ont pas à connaître le format JSON d'Open-Meteo (S1).
  L'option S3 donne chaque avantage à son niveau.
- **Le temps est l'entrée cachée de presque toutes ces règles.** Péremption,
  blocage, lien expiré, historique des pluies : sans horloge pilotable, il
  faudrait attendre (tests lents) ou fabriquer des dates (on ne teste plus la
  comparaison). `vi.setSystemTime` ne suffit pas seul : il ne pilote pas
  PostgreSQL ; d'où l'interdiction de `now()` en SQL pour le temps métier.
- **La chaîne de traçabilité casse en silence.** Un CASE sans test ou un test
  orphelin ne se voit pas à la relecture d'un seul fichier. Un fichier par CASE
  et un petit script rendent la matrice de `traceability.md` exacte à tout
  moment.
- **« Pour chaque opération » se tient par construction.** `REQ-105` et
  `REQ-106` demandent un test par opération ; un registre de routes parcouru par
  le test rend l'oubli d'une route impossible, au lieu de dépendre d'une liste de
  tests tenue à la main.

## Conséquences acceptées

- **Docker nécessaire** pour les tests d'intégration et de bout en bout (déjà
  requis par `ADR-001`) ; les tests unitaires s'en passent.
- **La forme du backend est imposée par les tests** : `creerApplication`,
  dépendances injectées, registre des routes, registre des sources, horloge
  unique. Ces éléments sont à reporter dans les signatures
  (`tdd/docs/signature/`) avant l'implémentation.
- **Le champ « Fichier » du gabarit CASE** (`tests/tests-unitaires/…`) ne couvre
  que le niveau unitaire : chaque CASE indique le chemin de son niveau (point 3).
- **Réponses réelles à enregistrer** une fois par source (compte Météo-France
  nécessaire, `ADR-005`). Si une source change son format, les tests restent
  verts et seule l'application réelle échoue : ce risque n'est pas couvert par
  la suite normale.
- **Suite d'intégration séquentielle**, plus lente que les tests unitaires.
- **Bout en bout limité à Chromium.** Safari iOS et Firefox sont vérifiés à la
  main lors de la recette de `REQ-101` (`ADR-006`).
- **Un outil maison à maintenir** : le script de traçabilité.
- **« Le test échoue si la règle est retirée »** (gabarit CASE) reste vérifié en
  revue, en montrant le test rouge avant le code ; aucun outil ne le garantit.
- **Partie manuelle de `REQ-110`** (import sur les appareils) hors
  automatisation, tracée par fiche de recette.
- **Dépendance à `ADR-010`**, non encore rédigé : le validateur XSD proposé ici
  est à confirmer par lui.

## Ce qui nous ferait revenir dessus

- La suite d'intégration dépasse environ 5 minutes : base par fichier avec
  Testcontainers (option B2), ou transactions annulées à la fin de chaque test.
- Des tests échouent de façon intermittente (ordre, horloge, fuseau, base
  partagée) : on en cherche la cause avant toute relance ; si c'est la base
  partagée, option B2.
- Vitest ne fait pas tourner une dépendance du backend (module natif `argon2`,
  Express 5) : Jest pour le backend seul, Vitest gardé pour le frontend.
- Une source change de format sans que les tests le voient : test de contrat
  contre la vraie API, lancé à la main avant chaque démonstration, hors suite
  normale (il consomme du quota).
- La revue laisse passer des tests qui restent verts sans la règle : test de
  mutation (Stryker, gratuit) sur le module de calcul d'`ADR-008`.
- Les tests de composants se révèlent nécessaires au-delà du client HTTP et de
  la purge (logique d'écran complexe) : on étend le niveau composant, sans
  changer d'outil.
