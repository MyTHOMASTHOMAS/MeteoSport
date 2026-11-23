# CASE-<DOM>-<nn> — <titre descriptif du cas de test>

**Spécification :** `SPEC-<DOM>-<nn>`
**Critère d'acceptation :** `AC-<n>`
**Type :** acceptation
**Niveau de risque :** critique / élevé / modéré / faible

## Ce que ce cas protège

<En deux à quatre phrases : quelle règle métier est protégée par ce cas, et ce
qui se casse si la règle n'est plus respectée.>

## Cas

```gherkin
Étant donné <contexte initial avec données précises>
Et <condition complémentaire>
Quand <action déclenchante>
Alors <résultat attendu vérifiable>
Et <résultat complémentaire>
```

## Données

| Élément | Valeur |
|---|---:|
| <élément de donnée> | <valeur> |
| <élément de donnée> | <valeur> |

## Résultat attendu, calculé à la main

| Grandeur | Valeur attendue | Calcul |
|---|---:|---|
| <grandeur> | <valeur> | <formule ou raisonnement> |

## Ce que ce cas ne vérifie pas

- <cas exclu, couvert par un autre CASE> ;
- <cas exclu, couvert par un autre CASE> ;

---

## Test automatisé

**Nom attendu :**
`test_CASE_<DOM>_<nn>_<description_courte>`
**Fichier :** tests/tests-unitaires/<domaine>/case-<dom>-<nn>.test.ts

## Revue du test automatisé

- [ ] Le test reprend <donnée clé>.
- [ ] Le test <vérifie un aspect spécifique>.
- [ ] Le test <vérifie un autre aspect>.
- [ ] Le test échoue si <la règle est volontairement supprimée du code>.
- [ ] Le nom du test contient `CASE_<DOM>_<nn>`.
- [ ] Aucune assertion étrangère à ce cas n'a été ajoutée.

**Relu par :** <à renseigner>
**Remarques :** <à renseigner>
