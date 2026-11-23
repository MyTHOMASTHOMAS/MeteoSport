# Plan de délégation — `SPEC-<DOM>-<nn>` à `SPEC-<DOM>-<nn>`

**Écrit avant de confier la première tâche à l'agent.** C'est une prévision, pas un
compte rendu. Écrit après coup, il ne vaut rien : on ne se souvient que de ce qui a
marché, et l'historique du dépôt est daté.

---

## Avant — le découpage

| # | Tâche | Test qui doit passer au vert | Ce que l'agent reçoit | Ce qu'il ne touche pas |
|---|---|---|---|---|
| 1 | <description fonctionnelle de la tâche> | `CASE-<DOM>-<nn>`, `CASE-<DOM>-<nn>` | `specs/<domaine>.md`, `tests/cases/<domaine>/CASE-<DOM>-<nn>.md`, `src/<chemins autorisés>/` | <fichiers ou dossiers interdits> |
| 2 | <description fonctionnelle de la tâche> | `CASE-<DOM>-<nn>` | <fichiers fournis> | <fichiers interdits> |

**Colonne 3.** Un identifiant `CASE`, pas une phrase. Si vous ne savez pas quel test
va changer d'état, la tâche est mal découpée.

**Colonne 4.** Ce que l'agent reçoit : les fichiers, les spécifications, les cas de
test. Pas le dépôt entier.

**Colonne 5.** Ce qu'il n'a pas à modifier. Une colonne vide veut dire que vous
n'avez pas pensé au rayon d'action — or « l'agent modifie des fichiers que vous ne
lui avez pas désignés » est le premier des trois signaux de reprise en main.

---

## Après — ce qui s'est passé

Complété au rituel de fin de journée, le même jour.

| # | Résultat | Ce qui a fait reprendre la main |
|---|---|---|
| 1 | <conforme / repris / redécoupé / abandonné> | <ce qui s'est réellement passé> |
| 2 | | |

| Résultat | Sens |
|---|---|
| `conforme` | la tâche a produit ce qui était prévu, le test attendu est passé au vert |
| `repris` | le résultat a demandé une intervention manuelle avant d'être gardé |
| `redécoupé` | la tâche a dû être scindée ou reformulée, puis relancée |
| `abandonné` | la tâche a été retirée à l'agent et faite à la main |

---

## Ce qui sera regardé

Pas le nombre de `conforme`. Ce qui se lit, c'est **l'écart entre ce que vous aviez
prévu et ce qui est arrivé, et le fait que vous l'ayez vu**.

Une équipe avec quatre `repris` qui sait dire pourquoi pilote mieux qu'une équipe
avec six `conforme` qui n'a rien observé.
