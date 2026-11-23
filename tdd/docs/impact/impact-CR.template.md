# Analyse d'impact — CR-<nnn>

**Demande du client :** <résumé en une phrase>
**Reçue le :** <date>
**Rédigée par :** <noms>

---

> **Interdiction de modifier le code avant que cette analyse soit complète.**
>
> La modification descend la chaîne dans cet ordre : cahier des charges → specs →
> UML → modèle de données → cas de test → tests → code. Commencer par le code,
> c'est perdre la trace de pourquoi il a changé — et c'est exactement ce que ce
> module cherche à vous faire éviter.

---

## 1. Ce que le client demande, reformulé

<En langage métier, en trois à cinq phrases. Si la reformulation est floue, posez
les questions avant de descendre la chaîne.>

## 2. Questions posées au client

| # | Question | Réponse |
|---|---|---|
| 1 | <question> | <réponse> |

## 3. Impact — cahier des charges

| Exigence | Impact | Action |
|---|---|---|
| REQ-<nnn> | modifiée / supprimée / inchangée | <ce qui change> |
| REQ-<nnn> *(nouvelle)* | ajoutée | <description> |

## 4. Impact — spécifications

| Spécification | Impact | Ce qui change exactement |
|---|---|---|
| SPEC-<DOM>-<nn> | modifiée | <détail> |
| SPEC-<DOM>-<nn> | inchangée | *<pourquoi elle ne bouge pas, malgré les apparences>* |

La colonne de droite compte autant pour les specs inchangées : justifier une
non-modification est un résultat d'analyse.

## 5. Impact — conception

| Artefact | Impact | Ce qui change |
|---|---|---|
| `uml/domain.puml` | <impact> | <détail> |
| `uml/sequences/…` | <impact> | <détail> |
| MCD / MLD | <impact> | <détail> |
| architecture | <impact> | <détail> |

Question à traiter explicitement : la demande introduit-elle un **état nouveau**
ou une **donnée nouvelle** qui n'existaient pas dans le modèle ? Si oui, elle ne
peut pas être absorbée par le code seul.

## 6. Impact — tests

| Cas de test | Impact |
|---|---|
| CASE-<DOM>-<nn> | modifié / obsolète / inchangé |
| CASE-<DOM>-<nn> *(nouveau)* | à écrire |

Les tests devenus rouges après cette étape sont un résultat normal et attendu.

## 7. Impact — code

Seulement maintenant.

| Composant | Impact |
|---|---|
| <chemin/fichier> | <description de l'impact> |

## 8. Effets de bord identifiés

<Ce que la demande touche sans que le client l'ait envisagé. C'est la partie qui
distingue une analyse d'impact d'une liste de tâches.>

- <…>

## 9. Ce que nous ne ferons pas dans le temps restant

<Assumé, et à annoncer au client.>

- <…>

## 10. Ordre d'exécution retenu

| # | Étape | Qui |
|---|---|---|
| 1 | <étape> | <responsable> |
