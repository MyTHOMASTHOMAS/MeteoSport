# Projet MeteoSport

Application de prévisions météorologiques adaptées à la pratique sportive.

---

## 👥 Équipe du projet

- **TiBenoit**
- **MaxLaMenace**
- **Ivan**

**Période de réalisation :** Du 23 novembre 2026 au 09 décembre 2026  
**Dernière mise à jour :** 23/11/2026

---

## 📋 Tableau de Gestion de Projet (Board style Trello)

Ce tableau Kanban permet de piloter et suivre l'avancement des tâches de l'équipe tout au long du projet (du 23/11 au 09/12/2026).

### 📌 Vue Kanban

| 📥 Backlog / À faire | 🚧 En cours (WIP) | 🔍 En revue / Test | ✅ Terminé (Done) |
| :--- | :--- | :--- | :--- |
| *(Vide pour le moment)* | **Découverte du projet**<br>📅 *23/11/2026*<br>🏷️ `Onboarding`<br>👤 **TiBenoit**<br><hr>**Découverte du projet**<br>📅 *23/11/2026*<br>🏷️ `Onboarding`<br>👤 **MaxLaMenace**<br><hr>**Découverte du projet**<br>📅 *23/11/2026*<br>🏷️ `Onboarding`<br>👤 **Ivan** | *(Vide pour le moment)* | *(Vide pour le moment)* |

---

### 🗓️ Planning & Répartition Détaillée des Tâches (23/11 au 09/12)

| Réf. | Tâche | Assigné à | Date / Échéance | Statut | Priorité | Livrable attendu / Objectif |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-01` | **Découverte du projet** | **TiBenoit** | 23/11/2026 | 🟡 **En cours** | 🔴 Haute | Prise en main du repo, du kit TDD et de l'environnement |
| `TSK-02` | **Découverte du projet** | **MaxLaMenace** | 23/11/2026 | 🟡 **En cours** | 🔴 Haute | Prise en main du repo, du kit TDD et de l'environnement |
| `TSK-03` | **Découverte du projet** | **Ivan** | 23/11/2026 | 🟡 **En cours** | 🔴 Haute | Prise en main du repo, du kit TDD et de l'environnement |

---

### 👤 Suivi Individuel par Membre

#### 🔹 TiBenoit
- [ ] 🟡 **23/11/2026** : Découverte du projet *(En cours)*

#### 🔹 MaxLaMenace
- [ ] 🟡 **23/11/2026** : Découverte du projet *(En cours)*

#### 🔹 Ivan
- [ ] 🟡 **23/11/2026** : Découverte du projet *(En cours)*

---

## 1. Les trois règles

Elles ne se négocient pas.

1. **Aucun code généré sans spécification.**
2. **Aucune fonctionnalité acceptée sans preuve.**
3. **Aucun code livré sans compréhension humaine.**

---

## 2. Qui fait quoi

| Étape | Responsable | Rôle de l'IA |
|---|---|---|
| Comprendre le besoin | **Vous** | aucun |
| Cahier des charges | **Vous** | aucun |
| Spécifier | **Vous** | revue critique |
| Concevoir (UML, BDD, archi) | **Vous** | revue critique |
| Définir les cas de test | **Vous** | revue critique |
| Automatiser les tests | IA | production |
| Reviewer les tests générés | **Vous** | aucun |
| Découper en tâches, piloter | **Vous** | aucun |
| Produire le code | IA | production |
| Reviewer le code | **Vous** | second regard possible |
| Corriger | IA | production |
| Accepter | **Vous** | aucun |

Deux boucles, dans cet ordre : **avant** le développement, l'IA critique votre
travail ; **après** la génération, vous critiquez le travail de l'IA.

---

## 3. Arborescence

```text
.
├── README.md                              Tableau de bord & suivi du projet
├── .gitmessage                            Gabarit de commit
├── tdd/                                   Référentiel documentaire (kit TDD)
│   ├── docs/
│   │   ├── cdc/
│   │   │   └── cahier-des-charges-v<n>.md à versionner : v1, v2…
│   │   ├── cr/
│   │   │   └── compte-rendu-entretien-<nn>.md
│   │   ├── delegation/
│   │   ├── impact/
│   │   ├── traceability.md
│   │   ├── signature/
│   │   ├── prompt/
│   │   ├── uml/
│   │   └── adr/
│   ├── specs/
│   │   └── <domaine>.md                   SPEC-<DOM>-nn
│   └── tests/cases/
│       └── <domaine>/
│           ├── CASE-<DOM>-<nn>.md
│           └── sommaire.md
├── tests/                                 Tests automatisés
├── src/                                   Code source applicatif
└── reports/
```

Ce qui n'est **pas** dans ce dépôt n'existe pas. Une décision prise oralement et
non écrite est une décision perdue.

---

## 4. Identifiants et traçabilité

La chaîne complète :

```text
CR-<nn>/Q<nn> → REQ-<nnn> → SPEC-<DOM>-<nn> → CASE-<DOM>-<nn> → test → code → commit
```

Elle commence à un **échange consigné** avec le client, pas à une exigence. Une
règle métier qui ne vient d'aucun échange consigné ne vient de nulle part.

| Niveau | Format | Où il est défini | Ce qu'il doit citer |
|---|---|---|---|
| Échange | `CR-<nn>/Q<nn>` | `tdd/docs/cr/compte-rendu-entretien-<nn>.md`, questions `Qnn` | — |
| Exigence | `REQ-<nnn>` | `tdd/docs/cdc/cahier-des-charges-v<n>.md` | un `CR-nn/Qnn`, ou `déduit` + justification |
| Spécification | `SPEC-<DOM>-<nn>` | `tdd/specs/<domaine>.md`, en titre de section | au moins un `REQ` |
| Cas de test | `CASE-<DOM>-<nn>` | `tdd/tests/cases/<domaine>/CASE-<DOM>-<nn>.md` | au moins un `SPEC` |
| Test automatisé | l'ID `CASE` **dans le nom du test** | `tests/` | — |
| Commit | l'ID `SPEC` dans le message | git | — |

---

## 5. Commits

```text
<type>(<domaine>): <SPEC-ID> <description courte>

<pourquoi, si ce n'est pas évident>

Generated-by: <outil>          ← uniquement si le contenu a été produit par l'agent
```

Types : `spec`, `design`, `test`, `feat`, `fix`, `docs`, `chore`.

---

## 6. Rythme & Jalons

- **23/11/2026** : Lancement du projet & tâche collective de découverte
- **Push quotidien** : Chaque soir pour synchroniser le travail de l'équipe
- **09/12/2026** : Fin du cycle de développement & livraison finale

