# Kit TDD — template de démarrage (MeteoSport)

Référentiel documentaire **vierge**. Il ne contient que des **gabarits** (suffixe
`.template.md` ou `ADR-000-template.md`) et la procédure pour démarrer un projet
piloté par la traçabilité.

> Aucun contenu métier rempli ici. Tout ce qui est spécifique à MeteoSport se
> crée en copiant / renommant les gabarits ci-dessous.

---

## Structure

```text
tdd/
├── README.md                          ← ce fichier
├── projet/
│   ├── README.template.md             → à copier à la racine du dépôt en README.md
│   └── .gitmessage.template           → à copier à la racine en .gitmessage
├── docs/
│   ├── cdc/
│   │   ├── cahier-des-charges.template.md
│   │   └── archived/                  ← anciennes versions du CDC
│   ├── cr/
│   │   └── compte-rendu-entretien.template.md
│   ├── adr/
│   │   ├── ADR-000-template.md
│   │   └── README.template.md
│   ├── uml/
│   │   ├── README.template.md
│   │   └── sequences/
│   ├── signature/
│   │   ├── signature.template.md
│   │   └── signature-domain.template.md
│   ├── cr/ · impact/ · delegation/
│   ├── prompt/
│   │   ├── PROMPT_CONTEXTE_INITIAL.template.md
│   │   ├── code/prompt-code.template.md
│   │   └── test/prompt-test.template.md
│   └── traceability.template.md
├── specs/
│   ├── sommaire.template.md
│   └── domaine.template.md            → un fichier par domaine (ex. METEO.md)
└── tests/cases/
    ├── CASE.template.md
    ├── sommaire.template.md
    └── _exemple/                      ← premier domaine à renommer
```

---

## Bootstrap rapide (premier jour)

```bash
# 1. Cadre du dépôt (racine du projet, pas dans tdd/)
cp tdd/projet/README.template.md ./README.md
cp tdd/projet/.gitmessage.template ./.gitmessage
git config commit.template .gitmessage

# 2. Premier entretien + CDC v1
cp tdd/docs/cr/compte-rendu-entretien.template.md \
   tdd/docs/cr/compte-rendu-entretien-01.md
cp tdd/docs/cdc/cahier-des-charges.template.md \
   tdd/docs/cdc/cahier-des-charges-v1.md

# 3. Index ADR + traçabilité + UML
cp tdd/docs/adr/README.template.md tdd/docs/adr/README.md
cp tdd/docs/traceability.template.md tdd/docs/traceability.md
cp tdd/docs/uml/README.template.md tdd/docs/uml/README.md

# 4. Premier domaine (remplacer METEO / meteo par le vrai code domaine)
cp tdd/specs/domaine.template.md tdd/specs/METEO.md
cp tdd/specs/sommaire.template.md tdd/specs/sommaire.md
mkdir -p tdd/tests/cases/meteo
cp tdd/tests/cases/sommaire.template.md tdd/tests/cases/meteo/sommaire.md
```

Ensuite : remplacer chaque placeholder `<…>` et suivre le cycle ci-dessous.

---

## Convention des placeholders

| Placeholder | Signification |
|---|---|
| `<NOM-PROJET>` | Nom du projet (ex. MeteoSport) |
| `<NOM-EQUIPE>` | Nom de l'équipe |
| `<DOMAINE>` / `<DOM>` | Domaine fonctionnel court (ex. METEO, UI, DATA) |
| `<nn>` / `<nnn>` | Numéro séquentiel |
| `<date>` | Date JJ/MM/AAAA |
| `<…>` | Contenu libre à rédiger |

---

## Chaîne de traçabilité

```text
CR-nn/Qnn → REQ-nnn → SPEC-<DOM>-nn → CASE-<DOM>-nn → test automatisé → code → commit
```

Chaque maillon cite sa source. Une rupture dans la chaîne est un trou de couverture.

---

## Cycle de vie

### 1. Cycle initial (v1)

1. `projet/README` + `.gitmessage` — cadre et conventions du dépôt.
2. `docs/cr/compte-rendu-entretien-01.md` — premier entretien (`Qnn`).
3. `docs/cdc/cahier-des-charges-v1.md` — problème, règles `R-nn`, exigences `REQ-nnn`.
4. `docs/adr/ADR-001-….md` — décisions d'architecture (copier `ADR-000-template.md`).
5. `docs/uml/` — modèle de domaine et séquences PlantUML.
6. `specs/<domaine>.md` — comportements attendus (Gherkin, cas limites).
7. `tests/cases/<domaine>/CASE-….md` + sommaire — cas de test détaillés.
8. `docs/signature*.md` — signature du socle `src/`.
9. `docs/traceability.md` — matrice de bout en bout.
10. `docs/prompt/PROMPT_CONTEXTE_INITIAL.md` — contexte agent.
11. `docs/prompt/test/…` — générer les tests (`CASE` → test).
12. `docs/delegation/…` — découper les tâches.
13. `docs/prompt/code/…` — code de production (rouge → vert).

### 2. Cycle de changement (nouveau CR)

```text
CR-nn → impact-CR-nnn → CDC v(n+1) → specs → UML → CASE → tests → code → traceability
```

Règle : **jamais de modification de code avant l'analyse d'impact**
(`docs/impact/impact-CR.template.md`).

---

## Inventaire des gabarits

| Gabarit | Rôle |
|---|---|
| `projet/README.template.md` | README racine du dépôt |
| `projet/.gitmessage.template` | Convention de commits |
| `docs/cr/compte-rendu-entretien.template.md` | Entretien client |
| `docs/cdc/cahier-des-charges.template.md` | Cahier des charges versionné |
| `docs/adr/ADR-000-template.md` | Décision d'architecture |
| `docs/adr/README.template.md` | Index des ADR |
| `docs/uml/README.template.md` | Conventions UML PlantUML |
| `specs/domaine.template.md` | Specs d'un domaine |
| `specs/sommaire.template.md` | Index des domaines |
| `tests/cases/CASE.template.md` | Cas de test unitaire documentaire |
| `tests/cases/sommaire.template.md` | Index des CASE d'un domaine |
| `docs/signature*.template.md` | Signature d'architecture |
| `docs/traceability.template.md` | Matrice de traçabilité |
| `docs/impact/impact-CR.template.md` | Analyse d'impact |
| `docs/delegation/delegation.template.md` | Plan de délégation agent |
| `docs/prompt/*.template.md` | Prompts agent (contexte, test, code) |
