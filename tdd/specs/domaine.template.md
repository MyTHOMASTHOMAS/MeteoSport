# Spécifications — <Nom du domaine>

**Domaine :** `<DOM>`

---

## SPEC-<DOM>-<nn> — <titre de la spécification>

**Exigence :** <REQ-nnn, REQ-nnn> (avec <règles R-nn, contraintes C-nn>)
**Statut :** proposé | revue IA faite | validée
**Version :** v<n> (<date>)

### Règle

> <Énoncé de la règle métier principale que cette spécification formalise.
> Une à trois phrases en langage métier.>

### Portée

- Couvre <ce que cette spécification traite>.
- Couvre <autre aspect couvert>.
- Ne couvre pas <ce qui est exclu> → `SPEC-<DOM>-<nn>`.
- Ne couvre pas <ce qui est hors périmètre> → hors périmètre.

### Scénarios nominaux

```gherkin
Scénario : <titre du scénario>
  Étant donné <contexte initial>
  Quand <action déclenchante>
  Alors <résultat attendu>
  Et <résultat complémentaire>

Scénario : <titre du second scénario>
  Étant donné <contexte>
  Quand <action>
  Alors <résultat>
```

### Cas limites

| # | Situation | Comportement attendu |
|---|---|---|
| 1 | <situation limite> | <comportement> |
| 2 | <situation limite> | <comportement> |

### Ce qui n'est pas défini

- *<date>* — <point non encore tranché, en attente de décision ou de retour client.>

### Critères d'acceptation

- [ ] AC-1 — <critère d'acceptation vérifiable> (`CASE-<DOM>-<nn>`).
- [ ] AC-2 — <critère d'acceptation vérifiable> (`CASE-<DOM>-<nn>`).

### Revue IA

| Remarque de l'IA | Décision | Motif |
|---|---|---|
| <ce que l'IA a signalé> | Acceptée / Refusée | <raison> |
