# Prompt — écrire le code de CASE-<DOM>-<nn>

> <description courte du cas de test>
>
> Étape « test → code ». Le test est le contrat, l'agent produit le code. Suit
> `docs/prompt/PROMPT_CONTEXTE_INITIAL.md`.
>
> Prérequis : le test `tests/tests-unitaires/<domaine>/case-<dom>-<nn>.test.ts` doit exister et être rouge.
>
> À recopier tel quel dans l'agent. Un prompt = une tâche = un test qui passe du
> rouge au vert.

```text
CONTEXTE
Stack : <framework> / <langage>, complétée par <runner de tests> (tests unitaires et
d'intégration) et <runner E2E> (tests de bout en bout).
Commande de test : <commande globale>
Commande pour ce seul test : <commande spécifique pour ce test>
Commande d'audit d'architecture : <commande d'audit>

CE QUE JE TE DONNE
- Le test à faire passer : tests/tests-unitaires/<domaine>/case-<dom>-<nn>.test.ts::test_CASE_<DOM>_<nn>_<description>
- Le cas de test : tests/cases/<domaine>/CASE-<DOM>-<nn>.md
- La spécification : specs/<domaine>.md, section SPEC-<DOM>-<nn>
- Les exigences d'architecture : specs/architecture.md
- Le modèle du domaine : docs/uml/domain.puml
- Les fichiers du domaine que tu peux modifier : <liste des chemins autorisés sous src/>

TA TÂCHE
1. Fais passer au vert le test test_CASE_<DOM>_<nn>_<description>, et lui seul.
2. À la fin de la tâche, lance la commande d'audit, analyse le rapport généré, et applique les corrections nécessaires pour garantir une conformité totale (0 infraction).

CONTRAINTES
1. Ne modifie aucun fichier sous tests/. Le test est le contrat, pas une
   proposition. Si tu le crois faux, arrête-toi et dis-le-moi.
2. Ne le contourne pas : pas de skip, pas de xfail, pas de tolérance élargie,
   pas d'assertion neutralisée.
3. Implémente la règle, pas la valeur attendue. Les nombres écrits dans le cas
   de test ne doivent apparaître nulle part dans le code de production. Le
   calcul part du pourcentage écrit dans la spécification.
4. La règle vit dans le domaine : <chemin du service métier>. Pas dans un contrôleur, pas dans un
   écran, pas dans une requête.
5. Respecte le modèle du domaine documenté dans docs/uml/domain.puml : mêmes
   classes, mêmes attributs, mêmes relations, même vocabulaire. N'invente
   aucune entité ni relation absente du diagramme. Si le test l'exige, arrête-
   toi et dis-le-moi plutôt que de t'en écarter.
6. N'implémente que ce que ce test exige. Ne traite pas les autres cas, ne
   généralise pas, n'anticipe aucune évolution. Les autres tests rouges restent
   rouges.
7. Respecte strictement les spécifications de specs/architecture.md :
   <liste des règles d'architecture applicables>
8. Ne modifie aucun fichier en dehors de : <liste des chemins autorisés>.
9. Aucune dépendance nouvelle.

RENDS
- Le diff.
- La liste des fichiers créés ou modifiés.
- La commande exacte pour lancer ce seul test, et son résultat.
- Le résultat de la commande d'audit confirmant le statut 🟢 CONFORME.
- Où vit la règle, en une ligne : fichier et fonction.
- Ce que tu as dû supposer et qui n'était ni dans la spécification ni dans le
  test.
```
