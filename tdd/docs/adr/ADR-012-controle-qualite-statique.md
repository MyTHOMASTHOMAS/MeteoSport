# ADR-012 — Contrôle qualité statique du code et barrière de fusion

**Statut :** proposé
**Date :** 26/11/2026
**Décidé par :** équipe projet

---

## Contexte

Le cahier des charges ne contient **aucune exigence sur la qualité du code**.
Cet ADR n'en invente pas. Il traite un autre problème : plusieurs ADR posent
des règles de code que **rien ne fait respecter**, sinon la relecture.

| Règle posée | Où | Comment elle est tenue aujourd'hui |
|---|---|---|
| L'heure courante passe uniquement par le service `Horloge` | `ADR-011`, point 6 | Revue de code |
| Les moteurs de calcul n'importent ni la base, ni le réseau, ni l'horloge, ni l'aléatoire, ni l'IA | `ADR-008`, point 1 | « Tenue par convention et vérifiée en revue » ; « pureté non garantie techniquement » (conséquences) |
| Le backend est découpé en modules par domaine | `ADR-001` | Rien |
| Aucun secret dans les journaux | `ADR-004`, `CASE-AUTH-25` | Masquage dans le journaliseur et un test sur les journaux capturés ; rien n'empêche un `console.log` qui contourne le journaliseur |
| Données externes validées à l'entrée (Zod) | `ADR-001` | Rien n'empêche de les typer « à la confiance » |
| Clé Météo-France hors du dépôt | `ADR-005` | Renvoi à `ADR-004`, qui ne traite pas les secrets |
| Tests au vert avant chaque fusion | `ADR-011`, point 22 | « Si la plateforme offre une intégration continue gratuite » : non tranché |

Ces règles protègent des exigences du CDC :
- l'horloge et la pureté des moteurs protègent la reproductibilité (`REQ-107`) ;
- le passage obligé par le journaliseur protège la confidentialité des mots de
  passe (`REQ-114`).

Elles cassent **en silence**. Un `Date.now()` placé dans un moteur ne fait
échouer aucun test, puisque les tests tournent avec une horloge fixe. Il ne
s'arrête qu'en revue, si quelqu'un le voit.

Les outils déjà choisis ne vérifient pas les types non plus. Vite (build du
frontend), Vitest (tests) et `tsx` (rechargement à chaud du backend) retirent
les types sans les contrôler. Si `tsc` n'est lancé nulle part, une erreur de
type passe jusqu'à la démonstration.

Contraintes : outils libres et gratuits (`REQ-102`) ; trois développeurs ; fin
de cycle le 09/12/2026, avec une charge déjà jugée trop lourde (revue de
cohérence, A-06). Le dispositif doit donc être **léger**. Il doit être en place
**avant la première ligne de code** : aucun code n'existe encore dans le dépôt.

Quatre questions sont à trancher : le niveau d'exigence de TypeScript, l'outil
d'analyse statique et de formatage, l'endroit où le contrôle bloque une
fusion, et ce qui reste à la revue humaine.

## Options envisagées

### Niveau d'exigence de TypeScript

#### Option T1 — `strict` et contrôles complémentaires choisis

| | |
|---|---|
| Ce qu'elle apporte | `strict` (valeurs `null`/`undefined`, `any` implicite, `unknown` dans les `catch`) plus `noUncheckedIndexedAccess` : `tableau[i]` est typé « peut-être absent ». C'est le cas le plus fréquent dans les moteurs : tronçon absent, palier de VMA introuvable, heure sans prévision (`R-07`). |
| Ce qu'elle coûte | Plus de vérifications d'absence à écrire dans le code de calcul et de routage. |
| Ce qu'elle rend difficile plus tard | Rien : c'est le réglage le plus coûteux à **ajouter** après coup, pas à retirer. |

#### Option T2 — `strict` seul

| | |
|---|---|
| Ce qu'elle apporte | Le réglage recommandé par défaut, sans surcoût. |
| Ce qu'elle coûte | Un accès hors limites d'un tableau ou d'un dictionnaire est typé comme une valeur présente. |
| Ce qu'elle rend difficile plus tard | Activer `noUncheckedIndexedAccess` une fois le code écrit fait apparaître des dizaines d'erreurs d'un coup. |

#### Option T3 — Non strict, durci plus tard

| | |
|---|---|
| Ce qu'elle apporte | Démarrage plus rapide. |
| Ce qu'elle coûte | Les `null` et `any` implicites traversent tout le code ; les données externes sont typées sans contrôle. |
| Ce qu'elle rend difficile plus tard | Le durcissement : il n'arrive jamais sur un cycle de deux semaines. |

### Analyse statique et formatage

#### Option L1 — ESLint avec typescript-eslint, et Prettier

| | |
|---|---|
| Ce qu'elle apporte | Règles qui s'appuient sur les types (promesses oubliées, `switch` incomplet). `no-restricted-imports` et `no-restricted-syntax` par dossier traduisent directement les règles d'`ADR-008` et d'`ADR-011`. Règles React (hooks). Outils standards, documentés, gratuits. |
| Ce qu'elle coûte | Deux outils et quelques paquets. Le lint qui lit les types est plus lent (quelques secondes à quelques dizaines de secondes). |
| Ce qu'elle rend difficile plus tard | Rien de notable. |

#### Option L2 — Biome (lint et formatage en un seul outil)

| | |
|---|---|
| Ce qu'elle apporte | Un seul outil, très rapide, configuration courte. |
| Ce qu'elle coûte | Ses règles qui lisent les types sont plus récentes et moins complètes. Moins d'exemples pour les restrictions par dossier dont cet ADR a besoin. |
| Ce qu'elle rend difficile plus tard | Ajouter une règle qui n'existe que dans l'écosystème ESLint. |

#### Option L3 — Plateforme d'analyse (SonarQube Community, SonarCloud)

| | |
|---|---|
| Ce qu'elle apporte | Tableau de bord, métriques, historique. |
| Ce qu'elle coûte | Un serveur à héberger, ou une offre gratuite réservée aux dépôts publics (`REQ-102`). Fait doublon avec un linter. Les règles propres au projet (horloge, pureté) restent à écrire ailleurs. |
| Ce qu'elle rend difficile plus tard | Rien, mais elle n'apporte rien que L1 n'apporte déjà ici. |

### Où le contrôle bloque

#### Option G1 — Intégration continue sur chaque demande de fusion (GitHub Actions)

| | |
|---|---|
| Ce qu'elle apporte | Les fusions passent par des PR GitHub. Le contrôle tourne sur une machine neuve, à l'identique pour tous, et son résultat s'affiche dans la PR. Il remplace le « l'auteur les lance et le dit » d'`ADR-011` (point 22). Les runners Linux fournissent Docker, donc la base `db-test` d'`ADR-011`. |
| Ce qu'elle coûte | Un fichier de workflow à écrire. Sur un dépôt privé avec l'offre gratuite : quota de minutes (2 000 par mois) et pas de vérifications obligatoires par règle de branche. |
| Ce qu'elle rend difficile plus tard | Rien de notable. |

#### Option G2 — Hooks Git locaux (Husky, lint-staged)

| | |
|---|---|
| Ce qu'elle apporte | Retour immédiat, avant même le commit. |
| Ce qu'elle coûte | Contournable par `--no-verify`. Ralentit chaque commit. Ne lance pas les tests d'intégration (trop lents pour un commit). Dépend du poste de chacun. |
| Ce qu'elle rend difficile plus tard | Rien, mais elle ne prouve rien à la fusion. |

#### Option G3 — Contrôle manuel par l'auteur, déclaré dans la PR

| | |
|---|---|
| Ce qu'elle apporte | Aucun outillage. |
| Ce qu'elle coûte | Repose sur la mémoire de chacun en fin de cycle, quand la pression est la plus forte. |
| Ce qu'elle rend difficile plus tard | Savoir si la branche principale est saine à un instant donné. |

## Décision

Nous retenons **TypeScript `strict` avec `noUncheckedIndexedAccess`** sur les
trois projets, **ESLint avec typescript-eslint** pour l'analyse statique, y
compris des **règles d'architecture** qui font respecter `ADR-004`, `ADR-008`
et `ADR-011`, et **Prettier** pour le formatage. L'ensemble est lancé avec les
tests par **GitHub Actions sur chaque demande de fusion**, et une vérification
rouge interdit la fusion. Ce que les outils ne voient pas reste à la
**revue humaine**, avec une liste courte.

### TypeScript

1. **Configuration commune.** Un `tsconfig.base.json` à la racine, étendu par
   `backend/`, `frontend/` et `e2e/` :
   - `strict: true` ;
   - `noUncheckedIndexedAccess: true` ;
   - `noImplicitOverride: true` ;
   - `noFallthroughCasesInSwitch: true`.

   `exactOptionalPropertyTypes` n'est **pas** retenu : il entre en conflit avec
   les types de plusieurs bibliothèques et rapporte peu ici.
2. **`npm run typecheck`** lance `tsc --noEmit` sur chaque projet. C'est le seul
   endroit où les types sont vérifiés (voir Contexte).
3. **Pas de `any` d'origine extérieure.** Les données qui viennent de
   l'extérieur arrivent en `unknown` et passent par un schéma Zod (`ADR-001`)
   avant usage : corps de requête, réponses des sources (`ADR-005`), fichiers
   d'import (`ADR-007`), tables de règles (`ADR-008`), paramètres (`ADR-003`).
   `any` explicite est interdit par le lint. `@ts-ignore` est interdit ;
   `@ts-expect-error` est accepté avec une explication.

### Analyse statique (ESLint)

4. **Une configuration à la racine** (`eslint.config.js`, format « flat »),
   qui couvre les trois projets. Base : `recommendedTypeChecked` de
   typescript-eslint, plus les règles des hooks React pour le frontend.
5. **Règles générales retenues**, toutes en erreur :

   | Règle | Ce qu'elle évite ici |
   |---|---|
   | `@typescript-eslint/no-floating-promises`, `no-misused-promises` | Une tâche de collecte lancée sans `await` : son erreur est perdue et la source paraît à jour alors qu'elle est en panne (`R-07`) |
   | `@typescript-eslint/switch-exhaustiveness-check` | Un `switch` sur le verdict (`favorable`, `défavorable`, `à risque`, `R-19`) ou sur l'issue d'une règle (déclenchée, non déclenchée, non évaluable, `ADR-008`) qui oublie un cas |
   | `@typescript-eslint/no-explicit-any`, `ban-ts-comment` | Voir point 3 |
   | `eqeqeq` | Comparaisons avec conversion implicite (`0 == ""`) dans les seuils |
   | `no-console` (sauf `e2e/` et scripts outils) | Un journal qui contourne le journaliseur et son masquage des secrets (`ADR-004`, `CASE-AUTH-25`). Le backend écrit uniquement par le journaliseur injecté (`ADR-011`, point 2) |

6. **Règles d'architecture**, limitées aux dossiers concernés :

   | Portée | Interdit | Règle protégée |
   |---|---|---|
   | Tout `backend/src/`, sauf le service `Horloge` | `Date.now()`, `new Date()` **sans argument** (`new Date(valeur)` reste permis pour lire une date) | `ADR-011`, point 6 |
   | Module de calcul (`ADR-008`) | Imports de la base, du réseau (`node:http`, `node:https`, adaptateurs de sources), de `node:fs`, du service `Horloge`, du module d'IA (`ADR-009`) ; `Math.random()` | `ADR-008`, point 1 ; `REQ-107` |
   | Entre domaines du backend | Importer l'intérieur d'un autre domaine : on passe par son point d'entrée (`index.ts`) | `ADR-001` (monolithe modulaire) |

   Ces règles utilisent `no-restricted-imports` et `no-restricted-syntax`,
   fournies par ESLint : aucune dépendance de plus. Les chemins exacts sont
   écrits quand l'arborescence est fixée dans les signatures
   (`tdd/docs/signature/`).
7. **Zéro avertissement.** Une règle est soit en erreur, soit désactivée.
   ESLint tourne avec `--max-warnings 0`, pour que les avertissements ne
   s'accumulent pas sans que personne ne les lise.
8. **Dérogations visibles et justifiées.** Seule forme admise :
   `// eslint-disable-next-line <règle> -- <raison>`, sur une ligne. Les
   directives inutiles sont signalées en erreur
   (`reportUnusedDisableDirectives`). Une dérogation à une règle
   d'architecture (point 6) se discute en équipe avant la fusion.

### Formatage

9. **Prettier**, configuration par défaut (aucun débat de style). Il est
   complété par `eslint-config-prettier`, pour qu'ESLint ne juge pas la mise
   en forme. Un `.editorconfig` est fourni, et le formatage à l'enregistrement
   est recommandé dans l'éditeur. La CI vérifie seulement (`prettier --check`).

### Dépendances, secrets et environnement

10. **Version de Node.js unique**, écrite dans `.nvmrc` et lue par la CI et les
    `Dockerfile` (`ADR-001`). Le `package-lock.json` est versionné. La CI et
    les images installent avec `npm ci`.
11. **Audit des dépendances** : `npm audit --omit=dev --audit-level=high` dans
    la CI, **sans bloquer**. Le résultat est visible dans la PR. Une alerte est
    examinée en revue : on met à jour, ou on accepte en le notant dans la PR.
12. **Secrets hors du dépôt** (`ADR-005`, clé Météo-France) :
    - `.env` est ignoré par Git ;
    - un `.env.example` sans valeur est versionné ;
    - gitleaks (libre, gratuit) analyse les commits de la PR dans la CI et
      **bloque** si un secret est détecté. Une clé publiée doit être révoquée,
      pas seulement retirée de l'historique.

### Barrière de fusion

13. **`npm run qualite`** enchaîne `typecheck`, `lint` et `format:check`. La
    commande est rapide, sans Docker, et faite pour être lancée en local avant
    de pousser.
14. **Workflow `.github/workflows/qualite.yml`**, déclenché à chaque demande
    de fusion vers la branche principale et à chaque push sur elle :

    | Étape | Commande | Bloquante |
    |---|---|---|
    | Qualité statique | `npm run qualite` | oui |
    | Secrets | gitleaks | oui |
    | Tests unitaires et de composants | `npm run test:unit` | oui |
    | Traçabilité CASE ↔ test | `npm run tracabilite` (`ADR-011`, point 5) | oui |
    | Tests d'intégration | `npm run test:integration` (démarre `db-test`) | oui |
    | Audit des dépendances | `npm audit …` | non (point 11) |
    | Couverture | rapport Vitest | non (`ADR-011`, point 23 : sans seuil) |

    Les tests de bout en bout restent **hors CI**, comme le prévoit
    `ADR-011` (point 22) : avant chaque démonstration et pour les
    modifications concernées.
15. **Une vérification rouge interdit la fusion.**
    - Si le dépôt le permet (dépôt public, ou offre qui inclut les règles de
      branche), la vérification est rendue **obligatoire** par une règle de
      protection de la branche principale.
    - Sinon, c'est une règle d'équipe : aucune PR fusionnée avec une
      vérification rouge ou en cours.
16. **Hooks Git locaux non imposés** (option G2). Chacun peut en installer
    pour son confort ; la référence reste la CI.

### Ce qui reste à la revue humaine

17. Les outils ci-dessus ne voient pas tout. La personne qui relit une PR
    (autre que son auteur) vérifie aussi :
    - que le test a été vu **rouge avant le code** (gabarit CASE, `ADR-011`,
      conséquences) ;
    - qu'aucune requête SQL n'utilise `now()` ou `CURRENT_TIMESTAMP` pour du
      temps métier (`ADR-011`, point 6) : ce n'est pas vérifiable par ESLint ;
    - que chaque dérogation au lint (point 8) est justifiée ;
    - que les alertes d'audit (point 11) sont traitées ou acceptées par écrit.

## Raisons

- **Les règles d'architecture des autres ADR sont la vraie cible.** Le style de
  code ne justifierait pas un ADR. En revanche, l'horloge unique, la pureté des
  moteurs et le passage par le journaliseur protègent `REQ-107` et `REQ-114`,
  et leur violation ne fait échouer aucun test. Une règle de lint transforme
  une convention en erreur de compilation. C'est ce qu'`ADR-008` envisageait
  « si un écart est constaté ». Nous l'avançons : la règle coûte quelques
  lignes, et un écart découvert pendant la recette coûterait beaucoup plus.
- **Le mode strict ne s'ajoute pas après coup.** C'est la seule décision de cet
  ADR difficile à reprendre. Activée sur une base vide, elle ne coûte presque
  rien ; activée sur du code écrit, elle fait apparaître des centaines
  d'erreurs. `noUncheckedIndexedAccess` cible précisément les accès qui
  échouent dans les moteurs, par exemple une heure sans prévision ou un palier
  absent.
- **Personne ne vérifie les types aujourd'hui.** Vite, Vitest et `tsx` les
  ignorent. Sans `tsc` dans la barrière, le typage n'est qu'une indication pour
  l'éditeur.
- **ESLint plutôt que Biome :** les règles dont nous avons le plus besoin
  (promesses oubliées, `switch` complet, imports interdits par dossier) sont
  matures dans typescript-eslint. Biome serait plus rapide, mais la vitesse
  n'est pas notre contrainte, et un second outil à apprendre si une règle
  manque coûterait plus cher.
- **Pas de plateforme d'analyse :** serveur ou dépôt public obligatoire
  (`REQ-102`), doublon avec le linter, et ses métriques générales ne
  protègent aucune règle propre au projet.
- **La CI plutôt que des hooks :** une barrière contournable par une option de
  ligne de commande n'en est pas une, surtout en fin de cycle. La CI tourne
  dans le même environnement pour tous et son résultat est visible dans la PR.
  `npm run qualite` garde un retour rapide en local, sans imposer de hook.
- **Une estimation du quota, qui tient.** Avec une dizaine d'exécutions par
  jour pendant 13 jours, à environ 8 minutes chacune (installation, base
  PostGIS, tests), on compte autour de 1 000 minutes, sous les 2 000 minutes
  mensuelles de l'offre gratuite pour un dépôt privé. Un dépôt public n'a pas
  de quota.
- **Audit non bloquant :** une faille publiée la veille de la démonstration,
  dans une dépendance sans correctif, ne doit pas empêcher toute fusion. Le
  risque est rendu visible et arbitré, pas ignoré.
- **Zéro avertissement :** sur un cycle court, un avertissement n'est jamais
  traité. Il devient du bruit qui masque le suivant.

## Conséquences acceptées

- **Une demi-journée de mise en place** pour une personne, dans la PR qui crée
  le squelette du dépôt (configurations, scripts, workflow), avant tout code
  métier.
- **Plus de vérifications d'absence** dans le code, à cause de
  `noUncheckedIndexedAccess`, surtout dans les moteurs et le routage.
- **Lint plus lent** que sans lecture des types (quelques dizaines de
  secondes sur le projet complet).
- **Les règles d'architecture dépendent de l'arborescence.** Elles sont
  écrites quand les signatures fixent les dossiers. D'ici là, seules les
  règles générales s'appliquent.
- **Une partie reste humaine** : le `now()` en SQL, le test vu rouge, la
  justification des dérogations. Le lint peut être contourné par une
  dérogation ; elle est au moins visible dans le diff.
- **Quota de minutes et règles de branche** : sur un dépôt privé avec l'offre
  gratuite, la barrière de fusion repose sur une règle d'équipe et la
  consommation de minutes est à surveiller.
- **Vulnérabilités acceptées en connaissance de cause** : l'audit ne bloque
  pas.
- **Autres ADR à aligner**, sans changer leurs décisions :
  - `ADR-008` : la conséquence « pureté non garantie techniquement » et le
    point 1 (« tenue par convention ») renvoient désormais au point 6 du
    présent ADR ;
  - `ADR-011` : le point 22 (intégration continue « si la plateforme
    l'offre ») est tranché par les points 14 et 15 ;
  - `ADR-005` : le renvoi à `ADR-004` pour la clé Météo-France pointe vers le
    point 12.

## Ce qui nous ferait revenir dessus

- Le lint dépasse environ une minute en local : règles qui lisent les types
  gardées pour la CI seulement, ou passage du formatage à Biome.
- Le quota de minutes s'épuise : tests d'intégration lancés seulement sur les
  demandes de fusion (pas sur chaque push), ou retour à l'option G3 pour cette
  seule étape.
- Une même règle reçoit régulièrement des dérogations : la règle est fausse ou
  mal placée ; on la corrige ou on la retire, plutôt que de laisser les
  dérogations se multiplier.
- Les motifs de chemins des règles entre domaines deviennent trop nombreux à
  tenir à la main : `eslint-plugin-boundaries`.
- Un défaut constaté en recette aurait été arrêté par une règle existante non
  activée : on l'active, et on vérifie les autres règles du même type.
- Un secret est trouvé dans l'historique malgré gitleaks : révocation de la
  clé, puis analyse de tout l'historique et pas seulement des commits de la PR.
