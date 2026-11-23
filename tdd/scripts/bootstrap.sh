#!/usr/bin/env bash
# Bootstrap du kit TDD pour un nouveau démarrage projet.
# Usage (depuis la racine du dépôt) :
#   ./tdd/scripts/bootstrap.sh MeteoSport EquipeAlpha METEO
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOM_PROJET="${1:-MeteoSport}"
NOM_EQUIPE="${2:-<NOM-EQUIPE>}"
DOM="${3:-METEO}"
dom_lower="$(echo "$DOM" | tr '[:upper:]' '[:lower:]')"

echo "==> Projet : $NOM_PROJET | Équipe : $NOM_EQUIPE | Domaine : $DOM"

# 1. Cadre dépôt
if [[ ! -f "$ROOT/README.md" ]]; then
  cp "$ROOT/tdd/projet/README.template.md" "$ROOT/README.md"
  sed -i "s/<NOM-PROJET>/$NOM_PROJET/g; s/<NOM-EQUIPE>/$NOM_EQUIPE/g" "$ROOT/README.md"
  echo "    README.md créé"
fi
if [[ ! -f "$ROOT/.gitmessage" ]]; then
  cp "$ROOT/tdd/projet/.gitmessage.template" "$ROOT/.gitmessage"
  echo "    .gitmessage créé"
fi

# 2. Docs de base
cp -n "$ROOT/tdd/docs/cr/compte-rendu-entretien.template.md" \
      "$ROOT/tdd/docs/cr/compte-rendu-entretien-01.md" 2>/dev/null || true
cp -n "$ROOT/tdd/docs/cdc/cahier-des-charges.template.md" \
      "$ROOT/tdd/docs/cdc/cahier-des-charges-v1.md" 2>/dev/null || true
cp -n "$ROOT/tdd/docs/adr/README.template.md" \
      "$ROOT/tdd/docs/adr/README.md" 2>/dev/null || true
cp -n "$ROOT/tdd/docs/traceability.template.md" \
      "$ROOT/tdd/docs/traceability.md" 2>/dev/null || true
cp -n "$ROOT/tdd/docs/uml/README.template.md" \
      "$ROOT/tdd/docs/uml/README.md" 2>/dev/null || true

# 3. Premier domaine
cp -n "$ROOT/tdd/specs/domaine.template.md" \
      "$ROOT/tdd/specs/${DOM}.md" 2>/dev/null || true
cp -n "$ROOT/tdd/specs/sommaire.template.md" \
      "$ROOT/tdd/specs/sommaire.md" 2>/dev/null || true
mkdir -p "$ROOT/tdd/tests/cases/${dom_lower}"
cp -n "$ROOT/tdd/tests/cases/sommaire.template.md" \
      "$ROOT/tdd/tests/cases/${dom_lower}/sommaire.md" 2>/dev/null || true

# Remplacements légers sur les copies fraîches
for f in \
  "$ROOT/tdd/docs/cdc/cahier-des-charges-v1.md" \
  "$ROOT/tdd/docs/adr/README.md" \
  "$ROOT/tdd/docs/traceability.md" \
  "$ROOT/tdd/specs/sommaire.md" \
  "$ROOT/tdd/specs/${DOM}.md"
do
  if [[ -f "$f" ]]; then
    sed -i "s/<NOM-PROJET>/$NOM_PROJET/g; s/<NOM-EQUIPE>/$NOM_EQUIPE/g; s/<DOM>/$DOM/g" "$f"
  fi
done

echo "==> Bootstrap terminé."
echo "    Prochaine étape : remplir tdd/docs/cr/compte-rendu-entretien-01.md"
echo "    Puis : tdd/docs/cdc/cahier-des-charges-v1.md"
