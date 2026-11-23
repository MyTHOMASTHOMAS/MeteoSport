# Bundle-doc — MeteoSport

Agrège la documentation (et éventuellement le code) en fichiers Markdown
`raw_N.md` sous `out/bundle-doc/`.

Les fichiers dont le nom contient `template` sont exclus automatiquement.

## Usage

```bash
# Documentation TDD par défaut
node scripts/bundle-doc/bundle-raw.mjs

# Une config précise
node scripts/bundle-doc/bundle-raw.mjs -c cr
node scripts/bundle-doc/bundle-raw.mjs -c kit

# Dossiers libres
node scripts/bundle-doc/bundle-raw.mjs -f tdd/docs/cdc,tdd/docs/cr

# Aide
node scripts/bundle-doc/bundle-raw.mjs -h
```

Sortie : `out/bundle-doc/raw_*.md` + `sommaire.md`.
