# Diagrammes UML

Les diagrammes vivent en **PlantUML** dans ce dossier : c'est du texte, donc
versionnable, diffable et relisible par l'agent en revue critique. Une capture
d'écran d'un outil de dessin ne l'est pas.

---

## Fichiers attendus

| Fichier | Diagramme | Quand |
|---|---|---|
| `use-cases.puml` | cas d'utilisation | <date> |
| `domain.puml` | classes du domaine | <date> |
| `sequences/<cas>.puml` | séquence, un fichier par cas d'usage sensible | <date> |
| `components.puml` | composants *(facultatif)* | <date> |

Trois diagrammes de séquence suffisent : les cas d'usage où plusieurs acteurs ou
services interviennent. Faire une séquence par écran est du remplissage.

## Rendu

```bash
# avec plantuml installé
plantuml -tsvg docs/uml/**/*.puml
```

Les images générées ne sont pas commitées : seules les sources le sont.

## Conventions

- Les noms de classes, d'acteurs et de cas d'usage reprennent **le vocabulaire du
  client**. Si le client dit « <terme métier> », la classe s'appelle `<TermeMétier>`, pas
  `<TermeTechnique>`.
- Chaque cas d'usage cite la spécification qu'il réalise, en note :

```plantuml
note right of (<cas d'usage>)
  SPEC-<DOM>-<nn>
end note
```

- Le diagramme de classes du domaine ne contient **ni** contrôleur, **ni**
  repository, **ni** classe technique. Il contient les concepts métier et leurs
  règles.

## Revue critique

Après votre v1, consigne à donner à l'agent :

> Compare ce diagramme aux spécifications jointes. Signale les incohérences, les
> responsabilités mal placées, les règles métier absentes du modèle et les
> relations qui ne sont justifiées par aucune spécification. Ne produis pas de
> diagramme corrigé.

Vous arbitrez, puis vous produisez la v2. Les remarques refusées se reportent dans
le journal.
