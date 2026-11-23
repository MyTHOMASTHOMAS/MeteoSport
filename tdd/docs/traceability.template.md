# Matrice de traçabilité — équipe `<NOM-EQUIPE>`

Reprise au créneau de fin de journée. C'est le seul endroit où l'état de la
chaîne se lit d'un coup d'œil.

```text
CR-<nn>/Q<nn> → REQ-<nnn> → SPEC-<DOM>-<nn> → CASE-<DOM>-<nn> → tests-unitaires/<domaine> → <sha court>
```

Une ligne par spécification. La remplir n'est pas une formalité de fin de
journée : c'est parcourir votre propre chaîne et voir où elle s'arrête.

**Ce document ne se reconstitue pas la veille du rendu.** `git log` sur ce fichier
montre les jours où il a été tenu.

---

## Comment la remplir

| Colonne | Ce qu'on y met | Où le trouver |
|---|---|---|
| SPEC | l'identifiant de la spécification | titre de section dans `specs/<domaine>.md` |
| REQ | la ou les exigences qu'elle réalise | `docs/cdc/cahier-des-charges.md` |
| Source | l'échange dont l'exigence est issue, ou `déduit` | `docs/cr/compte-rendu-entretien-<nn>.md` |
| Cas de test | le ou les cas qui la couvrent | `tests/cases/<domaine>/CASE-*.md` |
| Tests | le nom du test automatisé | `tests/tests-unitaires/<domaine>/` |
| Commits | le ou les sha courts | `git log --grep=<SPEC-ID>` |

Un maillon qui n'existe pas encore se note `—`. Plusieurs valeurs dans une case se
séparent par une virgule.

**Les six ruptures à surveiller :** une exigence sans source · une source citée
qui n'existe pas dans vos comptes rendus · une spécification qu'aucun cas de test
ne couvre · un cas de test sans test automatisé · une exigence que plus aucune
spécification ne reprend · un cas de test utilisé dans `tests/` mais défini nulle
part.

---

## Matrice Fonctionnelle

| SPEC | REQ | Source | Cas de test | Tests | Commits |
|---|---|---|---|---|---|
| `SPEC-<DOM>-<nn>` | `REQ-<nnn>` | `CR-<nn>/Q<nn>` | `CASE-<DOM>-<nn>` | `tests/tests-unitaires/<domaine>/…` | `<sha>` |

---

## Matrice Architecture & Gouvernance

| SPEC | REQ | Source | Cas de test | Tests | Commits |
|---|---|---|---|---|---|
| `SPEC-ARCH-<nn>` | `REQ-<nnn>` | `<source>` | `CASE-ARCH-<nnnn>` | `tests/tests-unitaires/architecture/…` | `<sha>` |

---

## Exigences non couvertes / Suivi transverse

Une exigence qu'aucune spécification ne reprend n'apparaît nulle part dans le
tableau ci-dessus. C'est la rupture la plus facile à ne pas voir.

| REQ | Priorité | Pourquoi elle n'est pas encore spécifiée / Statut |
|---|---|---|
| `REQ-<nnn>` | <priorité> | <explication> |

---

## Trous connus

Ce que vous savez incomplet, et ce que vous comptez en faire. **Un trou déclaré
n'est pas une faute. Un trou qu'on découvre à votre place en est une.**

| Quoi | Depuis | Pourquoi | Ce qu'on en fait |
|---|---|---|---|
| <description du trou> | <date> | <raison> | <action prévue> |
