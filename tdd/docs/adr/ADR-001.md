# ADR-001 — Architecture applicative, stack technique et déploiement local Docker

**Statut :** proposé
**Date :** 25/11/2026
**Décidé par :** TiBenoit, MaxLaMenace, Ivan

---

## Contexte

Le projet **MeteoSport** doit être livré dans un délai court (fin de cycle le 09/12/2026) par une équipe de 3 développeurs, avec un périmètre fonctionnel complet en *Must* réparti sur 10 domaines (`ARCH`, `AUTH`, `REF`, `METEO`, `TRAIL`, `CALC`, `GPX`, `PECHE`, `COMP`, `ADMIN`).

Plusieurs contraintes structurent le choix d'architecture, de compilation et de déploiement local :

- **Exécution locale à coût zéro (`REQ-102`, `REQ-111`, `CR-001/Q37`)** : l'application doit pouvoir être démontrée de bout en bout en local (`localhost`), sans hébergement payant ni dépense d'infrastructure.
- **Séparation en deux instances (contrainte d'architecture équipe)** : le frontend (application compilée) et le backend (API métier) doivent tourner sur deux instances distinctes, afin d'isoler le service des fichiers statiques de la logique métier et de préparer une éventuelle mise en ligne ultérieure.
- **Application web orientée mobile (`REQ-101`, `REQ-109`)** : interface fluide sur smartphone, installable en PWA connectée, avec gestion explicite de l'absence de réseau.
- **Modularité alignée sur le kit TDD** : l'organisation du code doit refléter les 10 domaines spécifiés (`tdd/specs/`) et les signatures d'architecture (`tdd/docs/signature/`). La stratégie de tests automatisés est traitée séparément dans `ADR-011`.

## Options envisagées

### Option A — Double instance Docker : Backend Express 5 (Node.js / TypeScript) + Frontend React 19 compilé (Vite + Nginx)

| | |
|---|---|
| Ce qu'elle apporte | Respecte strictement la séparation en deux instances via deux conteneurs Docker dédiés orchestrés par Docker Compose. Compilation reproductible (builds multi-stages Docker : bundle statique Vite pour React 19, compilation TypeScript pour Express 5). Langage unique (**TypeScript**) sur toute la chaîne facilitant le partage de contrats/types entre front et back. Proxy inverse `/api` possible directement sur l'instance Nginx du front pour simplifier la gestion des cookies de session et éviter les frictions CORS en local. |
| Ce qu'elle coûte | Mise en place et maintenance de deux `Dockerfile` et d'un `docker-compose.yml` local. Express 5 étant minimaliste, la structuration modulaire par domaine (`src/`) et la validation des entrées API doivent être cadrées par l'équipe. |
| Ce qu'elle rend difficile plus tard | Un rendu côté serveur (SSR) pour du SEO public nécessiterait de remplacer le build statique par un serveur Node front (non pertinent en V1, toute consultation exigeant un compte authentifié selon `R-16`). |

### Option B — Double processus local sans conteneurisation (scripts Node + serveur statique sur l'hôte)

| | |
|---|---|
| Ce qu'elle apporte | Aucune dépendance à Docker ; démarrage direct via les scripts `npm` sur le poste de développement. |
| Ce qu'elle coûte | Risque fort d'écarts d'environnement entre les 3 postes de l'équipe et le poste de démonstration (versions de Node, ports, dépendances système pour la base de données ou les outils annexes). Déploiement local moins proche d'une architecture deux instances isolées. |
| Ce qu'elle rend difficile plus tard | Reproduire à l'identique l'environnement de démonstration chez le client ou basculer vers un hébergement conteneurisé après validation locale. |

### Option C — Framework full-stack monolithique en une seule instance (ex. Next.js)

| | |
|---|---|
| Ce qu'elle apporte | Un seul artefact à compiler et un seul serveur à démarrer en local, sans configuration de proxy inter-instances. |
| Ce qu'elle coûte | Ne respecte pas la contrainte de séparation en deux instances distinctes (front compilé / back API). Couplage plus fort entre la couche UI et les moteurs métier. |
| Ce qu'elle rend difficile plus tard | Déployer, faire évoluer ou exposer le backend indépendamment du frontend lors d'une mise en production ultérieure. |

## Décision

Nous retenons **l'Option A** : un déploiement local via une **double instance Docker** orchestrée par **Docker Compose**, composée d'une instance **frontend React 19 (TypeScript) compilée avec Vite et servie par Nginx** et d'une instance **backend Express 5 (Node.js LTS / TypeScript)** structurée en monolithe modulaire par domaine.

## Raisons

- **Respect exact de la contrainte d'instances séparées** :
  - **Instance 1 (Frontend — conteneur Docker dédié)** : image multi-stage qui compile l'application React 19 via Vite en fichiers statiques optimisés (`dist/`), puis les sert via un conteneur **Nginx** léger configuré pour le routage SPA et le proxy inverse `/api` vers l'instance backend.
  - **Instance 2 (Backend — conteneur Docker dédié)** : image multi-stage qui compile le code TypeScript et exécute l'API **Express 5** sur Node.js LTS, exposée sur le réseau interne Docker et découpée selon les domaines métier du kit TDD.
- **Démonstration locale fiable et à coût zéro (`REQ-102`, `REQ-111`)** : un seul `docker compose up --build` démarre les deux instances (ainsi que les services locaux de persistance et de capture d'e-mails définis dans `ADR-002` et `ADR-004`) de manière identique sur chaque poste, sans aucun hébergement payant.
- **Cohérence technique sur un délai court (09/12/2026)** : un langage unique (TypeScript) sur les deux instances permet à chaque membre de l'équipe d'intervenir sur le front comme sur le back et d'aligner le code sur les signatures (`tdd/docs/signature/`).
- **Fiabilité d'Express 5 et React 19** : Express 5 propage nativement les promesses rejetées dans les routes asynchrones (sécurisant la gestion des pannes de sources externes `REQ-103`) et React 19 offre un socle moderne pour l'interface mobile-first (`REQ-101`).

## Conséquences acceptées

- **Prérequis Docker local** : chaque poste de développement et le poste de démonstration client doivent disposer de Docker et Docker Compose.
- **Cycle de compilation en double instance** : en développement quotidien, le rechargement à chaud (Vite dev server / `tsx watch`) peut être utilisé via un profil Docker Compose dédié, tandis que la recette et la démonstration client s'exécutent impérativement sur les images compilées (build de production).
- **Structuration backend à la charge de l'équipe** : Express 5 n'impose ni architecture ni validation de payload ; le découpage par domaines et la validation stricte des entrées (ex. `Zod`) sont définis dans les signatures avant implémentation.
- **Configuration réseau inter-conteneurs** : l'instance Nginx du frontend doit router `/api` vers l'instance Express 5 sur le réseau Docker interne en préservant les en-têtes nécessaires aux sessions (`ADR-004`).

## Ce qui nous ferait revenir dessus

- L'impossibilité technique d'installer ou d'exécuter Docker sur le poste retenu pour la démonstration locale client (`REQ-111`), ce qui imposerait de basculer temporairement sur l'Option B (deux processus locaux lancés par script) sans remettre en cause Express 5 ni React 19.
- Une incompatibilité bloquante d'Express 5 ou React 19 avec une dépendance critique du projet (cartographie, sécurité ou sérialisation GPX) impossible à résoudre en moins d'une demi-journée.