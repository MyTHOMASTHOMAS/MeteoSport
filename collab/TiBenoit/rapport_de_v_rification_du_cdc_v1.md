# Rapport de vérification — Cahier des charges v1 vs CR-001

**Documents audités :**
- Source de vérité : `cr-001.md` (entretien du 23/11/2026)
- Document vérifié : `cahier-des-charges-v1.md` (v1 du 23/11/2026)

**Objectif de l'audit :** contrôler la traçabilité stricte entre le CR et le CDC, détecter tout ajout ou invention non justifié, relever les oublis et incohérences internes, et identifier les angles morts résiduels non couverts par la section 11.

---

## 1. Synthèse exécutive

Le CDC v1 présente une **très bonne qualité méthodologique globale** :
- Le principe *« formaliser le problème, pas la solution »* est respecté (aucune fuite de stack technique, et respect exemplaire de `Q41` en n'inscrivant pas `localhost` comme contrainte contractuelle).
- La traçabilité vers les identifiants `CR-001/Qxx` est systématique.
- La section 11 (*Questions restées ouvertes*) est déjà particulièrement fouillée (9 incohérences, 12 ambiguïtés, 16 zones d'ombre).

Toutefois, une vérification poussée met en évidence **plusieurs écarts réels** qui doivent être corrigés avant présentation au client :

| Catégorie d'écart | Critiques | Majeurs | Mineurs | Total |
| --- | :---: | :---: | :---: | :---: |
| **Ajouts, inventions et déformations** (non demandés dans le CR) | 1 | 4 | 6 | **11** |
| **Oublis et troncatures** (présents dans le CR, absents/réduits dans le CDC) | 1 | 6 | 5 | **12** |
| **Incohérences internes du CDC** | 1 | 3 | 3 | **7** |
| **Angles morts** (absents du CR *et* de la section 11 du CDC) | 3 | 6 | 3 | **12** |

---

## 2. Ajouts, inventions et déformations (CDC non justifié par le CR)

### 2.1. Inventions pures / Ajouts fonctionnels non demandés

| Sévérité | Localisation CDC | Constat | Référence CR concernée |
| --- | --- | --- | --- |
| **Critique** | `REQ-023` (§9, Administration) | **Ajout d'une fonctionnalité d'administration non demandée :** *« L'administrateur tient à jour les critères de sécurité de chaque sentier du panel pilote »*. Or, `Q42` limite strictement le back-office administrateur à la gestion manuelle **des statuts des sentiers et des alertes**. `Q34` et `Q40` indiquent que les règles par sentier sont définies dans le référentiel des sentiers (calibrage projet), pas administrées dans une interface dédiée. Dans un délai de 3 semaines sans budget, cet ajout crée une charge non demandée. | `Q34`, `Q40`, `Q42` |
| **Majeur** | Titre du document | **Nom de produit inventé (`MeteoSport`) :** le nom *« MeteoSport »* n'apparaît nulle part dans `cr-001.md`. Il n'est pas non plus signalé comme nom provisoire ou en section 11. | Absent du CR |
| **Majeur** | §4, §5 (*Sarah — randonneuse occasionnelle*) | **Glissement de périmètre sportif (« randonneurs ») :** le client a acté *« Trail et pêche uniquement »* (`Q05`). Le terme *« Randonnée »* n'apparaît que dans le titre de la reformulation interne `CR-001/§4.1`, jamais dans les propos du client (`§1`) ni ses réponses (`Q01–Q42`). Le CDC amplifie cette dérive en ajoutant les *randonneurs* comme partie prenante (§4) et en créant un persona complet de randonneuse (*Sarah*). Si l'intention est de représenter un pratiquant *débutant / grand public* (`Q03`), il convient de parler de « traileur débutant ou occasionnel » ou de faire valider l'extension à la randonnée. | `Q03`, `Q05`, `§4.1` |

### 2.2. Extrapolations et durcissements non signalés comme hypothèses

| Sévérité | Localisation CDC | Constat | Référence CR concernée |
| --- | --- | --- | --- |
| **Majeur** | `Obj 5` (§3), `REQ-024` (§9) | **Extrapolation du « score argumenté » et du classement à la pêche :** `Obj 5` demande de *« classer les secteurs côtiers avec un score argumenté »*. Or, le *« score comparatif argumenté »* n'a été demandé par le client que dans `Q11` pour **l'arbitrage entre trail et pêche**, pas pour noter/classer les côtes dans le module Pêche (`Q09`, `Q12` parlent uniquement de connaître la côte ayant les meilleures conditions). | `Q09`, `Q11`, `Q12` |
| **Majeur** | `R-01` (§8) | **Extension non signalée de la règle au « trajet choisi » :** `R-01` impose que *« Un itinéraire, conseillé **ou choisi**, n'emprunte que des sentiers officiels balisés »*. Or, `Q16` portait spécifiquement sur la logique du *trajet conseillé*. Bien que l'extension soit logique pour la sécurité, elle devrait être signalée comme déduite/à confirmer (comme `R-02`). | `Q16` |
| **Mineur** | `C5` (§7), `REQ-101` (§10) | **Durcissement sur la PWA :** `Q01` évoque une *« possibilité de PWA »* et `Q27` indique *« PWA adoptée pour l'ergonomie mobile »*. Le CDC en fait une exigence stricte d'*« installation sur l'écran d'accueil »* (`REQ-101`). C'est une interprétation technique raisonnable de la PWA, mais plus restrictive que `Q01`. | `Q01`, `Q27` |
| **Mineur** | `REQ-002` (§9) | **Précision non actée :** `Q18` évoque le *« dénivelé accepté »* au choix libre de l'utilisateur ; le CDC traduit par *« dénivelé maximal accepté »* et le classe en `Must` (ainsi que le multi-jours), alors que le caractère `Must` pour le MVP à 3 semaines n'a pas été arbitré. | `Q18` |
| **Mineur** | `REQ-004` (§9) | **Donnée ajoutée sans mention *(déduit)* :** `REQ-004` exige l'affichage de *« la date de cette information »* pour chaque sentier. Cet ajout découle de l'exigence de fraîcheur (`Q25`), ce qui est correctement marqué *(déduit)* dans `REQ-104`, mais pas dans `REQ-004`. | `§1`, `Q25`, `Q26`, `Q36` |
| **Mineur** | `REQ-013` (§9) | **Variable ajoutée au calcul :** `REQ-013` fait dépendre l'eau et la nourriture *« du profil, de la durée estimée **et de la météo prévue** »*. `Q21` ne cite explicitement que les données du profil (même si la météo est très pertinente pour l'hydratation, cela mériterait d'être rattaché à `ZO-05`). | `§1`, `Q21` |
| **Mineur** | `REQ-019` (§9) | **Précision « lui-même » :** `Q24` demande des *« fonctions de suppression/export du compte »* ; le CDC impose le libre-service complet (*« lui-même »*). | `Q24` |
| **Mineur** | §5 (*Julien*, *Sarah*, *Patrice*) | **Détails de contexte inventés dans les personas :** *« la veille ou le matin même »* (Julien), *« sorties de week-end »* et *« évalue mal la durée »* (Sarah), *« décide au dernier moment »* (Patrice). Acceptable pour des personas (le CDC précise bien qu'ils sont construits par l'équipe et à valider), mais à garder en tête lors de la revue client. | §5 |

### 2.3. Citations inexactes ou imprécises du CR

- **`INC-02` (§11.1) — Citation erronée de `CR-001/§1` :** le CDC écrit : *« Le projet est présenté comme une « application assistée par IA » avec un « trajet conseillé par l'IA » (§1). »* Or, `CR-001/§1` dit exactement : **« trajet conseillé par l'application »**, et non *« par l'IA »*. La référence à l'IA pour le trajet conseillé provient en réalité de la **question** `Q16` (*« Sur quels critères l'IA conseille-t-elle une variante »*), pas du `§1`.
- **`§1` (Contexte — Littoral réglementé) :** cite uniquement `CR-001/Q10` pour affirmer que la RNMR encadre *« une partie de la côte ouest »* ; l'information « côte ouest » provient de `Q32`, pas de `Q10`.
- **`REQ-108` (§10) :** `Q38` parle de découpage par *« communes / secteurs d'altitude / balises »* avec paramétrage *« lors du déploiement pour ajuster les limites et respecter les quotas »*. Le CDC parle de *« zones, secteurs d'altitude, **seuils** »* modifiables *« sans changer l'application »*, glissant légèrement des *limites de quotas* vers des *seuils* génériques.

---

## 3. Oublis et troncatures (présents dans le CR, absents ou réduits dans le CDC)

| Sévérité | Élément du CR | Source CR | Constat dans le CDC |
| --- | --- | --- | --- |
| **Critique** | **Calculs *sécuritaires* par règles fixes (sans IA)** | `Q21` | `Q21` stipule : *« Formules algorithmiques internes fixes et éprouvées pour les calculs physiologiques **et sécuritaires**. »* Le CDC oublie systématiquement le volet **sécuritaire** dans la règle `R-05`, dans `REQ-107` (déterminisme) et dans le tableau *Hors périmètre* (§6), ne conservant que temps, eau et nourriture (alors même que `INC-02` le mentionne dans son constat). |
| **Majeur** | **Créneau horaire disponible côté Trail** | `§1` | Dans `CR-001/§1` (*Parcours utilisateur*), à *« Où voulez-vous aller ? »* (départ et arrivée = Trail), le client prévoit la *« possibilité de renseigner un créneau horaire disponible »*. Le CDC a retenu le créneau uniquement côté Pêche (`REQ-025`) et l'a totalement omis de `REQ-001`/`REQ-002` (sans le mentionner en section 11). |
| **Majeur** | **Point de départ et créneau disponible dans l'arbitrage Trail vs Pêche** | `Q12`, `§4.2` | `§4.2` précise que le module d'arbitrage génère le score comparatif *« selon le point de départ, le créneau disponible (Q12) et la priorité des sports »*. `REQ-028` omet le point de départ et le créneau disponible. |
| **Majeur** | **Clause de non-responsabilité en cas d'accident** | `Q29` | `Q29` exige un *« avertissement légal et **clause de non-responsabilité** (...) n'engageant pas la responsabilité en cas d'accident »*. La règle `R-14` ne retient que le caractère d'aide à la décision face aux bulletins officiels et omet la clause d'exonération de responsabilité (pourtant évoquée en `ZO-12`). |
| **Majeur** | **Date de sortie manquante dans `REQ-025` (Pêche)** | `Q13`, `Obj 5` | `Obj 5` indique *« Pour une **date**, un créneau et un point de départ »*, mais `REQ-025` ne demande que le créneau disponible et le point de départ, oubliant la date (pourtant nécessaire dès que la recherche porte sur les prochains jours, cf. `AMB-02`). |
| **Majeur** | **Exigence de *fiabilité* des sources externes** | `Q25` | `Q25` délègue le choix des sources *« avec exigence de **fiabilité** et fraîcheur »*. Le CDC couvre la *fraîcheur* (`REQ-104`) et l'*indisponibilité* (`REQ-103`), mais ne pose aucune exigence ou critère vérifiable concernant la *fiabilité* des sources gratuites retenues. |
| **Majeur** | **Absence d'une règle métier dédiée à l'alerte « risque requin »** | `Q10` | La Réserve naturelle marine fait l'objet d'une règle métier dédiée (`R-11`), mais pas le risque requin, pourtant jugé tout aussi impératif en `Q10` (présent uniquement en `REQ-027` et `INC-07`). |
| **Mineur** | **Portée des synthèses textuelles IA** | `Q21` | `Q21` réserve l'IA à *« la génération de synthèses textuelles explicatives en langage naturel »* (sans se limiter à un cas précis). `REQ-009` réduit cela uniquement à l'explication de l'écart entre trajet choisi et trajet conseillé. |
| **Mineur** | **Éléments absents du tableau *Hors périmètre* (§6)** | `Q13`, `Q31`, `Q40` | Trois exclusions actées dans le CR ne figurent pas dans le tableau *Hors périmètre* : (1) le calibrage des règles de sécurité sur les sentiers hors panel pilote (`Q40`, relégué en `INC-09`), (2) l'affichage de l'historique météo (`Q13`), et (3) la mesure directe en temps réel de la turbidité (`Q31`). |
| **Mineur** | **Éléments de §9 absents du résumé *Périmètre* (§6)** | `§1`, `Q21`, `Q24` | `REQ-009` (explication en langage courant), `REQ-010` (suggestion de trace par distance/niveau) et la *politique de confidentialité* (`REQ-018`) ne sont pas listés dans les puces de la section 6. |
| **Mineur** | **Données marines oubliées dans `REQ-104`** | `Q25` | `REQ-104` précise *(météo, état d'un sentier)* entre parenthèses, oubliant les données marines (houle, marée, vent, pluies bassins versants) pour le module Pêche. |
| **Mineur** | **Durée de conservation RGPD** | `Q24` | La question `Q24` portait explicitement sur le dispositif de *« consentement, de **conservation** et de suppression »*. La réponse n'ayant pas traité la conservation, cet oubli n'a pas été rattrapé dans `ZO-12`. |

> **Point positif à souligner :** La consigne de `CR-001/Q41` (*« Poste de développement local (`localhost`). Modalité logistique interne non contractuelle (à ne pas inscrire comme contrainte dans le CDC) »*) a été **parfaitement respectée**.

---

## 4. Incohérences internes du CDC

1. **Contradiction logique dans l'hypothèse de `ZO-09` (Critique) :**
   - `ZO-09` propose comme hypothèse si le profil (dont la VMA) est incomplet : *« Itinéraire et météo restent accessibles. Temps estimé et quantités ne sont calculés qu'avec un profil complet. »*
   - **Problème :** Selon `R-03` et `REQ-007`, la météo le long du parcours est affichée **à l'heure estimée de passage sur chaque tronçon**, laquelle dépend directement de l'allure et du temps de parcours estimés ! Sans temps estimé (ou sans allure par défaut de secours), l'affichage météo tronçon par tronçon ne peut pas fonctionner.
2. **Contradiction entre `Obj 1` et `INC-09` / `REQ-003` sur le panel pilote (Majeur) :**
   - `Obj 1` limite l'itinéraire sur sentiers ouverts + météo à *« un départ et une arrivée choisis **sur le panel pilote** »*.
   - Or, `INC-09` affirme : *« Itinéraire, météo et `.gpx` disponibles sur **tous les sentiers officiels**. Le trajet conseillé est calculé seulement sur le panel pilote. »*
   - Il faut aligner `Obj 1` (soit en précisant que le panel pilote est le périmètre de *test/recette* d'`Obj 1`, soit en l'alignant sur `INC-09`).
3. **Contradiction entre `R-02`, `REQ-003` et `REQ-004` sur les sentiers fermés (Majeur) :**
   - `R-02` indique qu'exclure un sentier fermé du trajet conseillé est *« (déduit, à confirmer) »*.
   - Pourtant, `Obj 1` et `REQ-003` affirment sans réserve (`Must`) que tout itinéraire construit n'emprunte que des sentiers **ouverts**.
   - Par ailleurs, si `REQ-003` ne construit que des itinéraires sur sentiers ouverts, on ne comprend pas dans quel scénario `REQ-004` affiche un sentier *« fermé »* sur un parcours emprunté (sauf si l'utilisateur force un sentier ou visualise une carte globale — cas non décrit).
4. **Contradiction de priorité pour `REQ-014` (Majeur) :**
   - Les points d'eau potable figurent dans la section 6 sous **« Dans le périmètre — prioritaire pour la première livraison »**, alors que `REQ-014` est classé **`Could`** en section 9 (conformément à `Q17` : *« peut être intéressante »*).
5. **Erreur d'en-tête de colonne dans toute la section 11 (Mineur) :**
   - Dans les tableaux `11.1`, `11.2` et `11.3`, la troisième colonne s'intitule **`Posée le`** (qui appelle une date), mais contient des références de source (`CR-001/Q06, Q30...`). Elle devrait s'intituler **`Source`** (ou comporter une date réelle si une colonne `Posée le` est souhaitée).
6. **Portée incomplète de `REQ-105` (Mineur) :**
   - `REQ-105` indique *« Un utilisateur ne peut **consulter** que ses propres données de profil »*, omettant la protection en **modification et suppression** (un utilisateur ne doit pas non plus pouvoir modifier/exporter/supprimer les données d'un autre compte).
7. **Attribution incohérente des personas en section 9 (Mineur) :**
   - `REQ-002` (aller-retour, dénivelé max), `REQ-007` (météo heure par heure), `REQ-011` (export GPX) et `REQ-014` (points d'eau) ne sont attribués qu'à *Julien*, et `REQ-006` (difficulté) qu'à *Sarah*, alors que ces exigences concernent manifestement les deux profils trail.

---

## 5. Angles morts (absents du CR *et* de la section 11 du CDC)

Ces points ne sont couverts ni par le compte rendu ni par les 37 entrées actuelles de la section 11, alors qu'ils conditionnent directement la conception et la recette.

### 5.1. Métier — Trail

1. **Sorties sur plusieurs jours et calcul horaire de passage (Critique) :**
   - `REQ-002` et `INC-08` autorisent les sorties sur plusieurs jours (ex. 2 ou 3 jours dans Mafate). Or, pour calculer la météo à l'heure de passage (`R-03`) le jour 2 et les jours suivants, il est impossible d'enchaîner les heures en continu sans connaître les temps d'arrêt/nuitée et l'heure de reprise quotidienne (ou un découpage par étapes). Aucune règle ne traite ce cas.
2. **Définition du « trajet choisi » et gestion des cas sans solution (Critique) :**
   - Avec une simple saisie *Départ + Arrivée* (`REQ-001`), plusieurs itinéraires existent souvent sur le réseau de sentiers. Comment l'utilisateur choisit-il son « trajet choisi » avant comparaison avec le « trajet conseillé » (`REQ-008`) ?
   - Quel comportement afficher si **aucun itinéraire valide** n'existe (sentier unique fermé par l'ONF, dénivelé maximal saisi trop bas par rapport au relief réel, zone isolée) ?
3. **Vigilances officielles majeures à La Réunion (Critique) :**
   - Le territoire réunionnais est exposé aux vigilances Météo-France (fortes pluies/orages, vents forts, forte houle, pré-alerte/alerte cyclonique) et aux arrêtés préfectoraux de fermeture générale des sentiers. Aucun mécanisme ni comportement n'est prévu : l'application doit-elle bloquer les recommandations ou afficher une alerte prioritaire en cas de vigilance orange/rouge ?

### 5.2. Métier — Pêche et Arbitrage sportif

4. **Séparation entre « Pêche du bord » et « Chasse sous-marine » (Majeur) :**
   - Ces deux pratiques (`Q08`) ont des critères d'exposition très différents (visibilité/turbidité et risque requin critiques en chasse sous-marine, beaucoup moins pour la pêche du bord).
   - L'utilisateur sélectionne-t-il sa pratique précise lors de sa recherche ?
   - Dans le classement des sports favoris (`REQ-017`, `Q39`), y a-t-il **2 sports** (Trail / Pêche) ou **3 pratiques** (Trail / Pêche du bord / Chasse sous-marine) ?
   - Que fait un utilisateur qui ne pratique qu'un seul des deux sports lors de l'étape obligatoire de classement à l'inscription ?
5. **Périmètre géographique et résultat de l'arbitrage « Trail vs Pêche » (Majeur) :**
   - Pour produire un score comparatif « Trail vs Pêche » (`REQ-028`) à partir d'un point de départ et d'un créneau, **quel(s) sentier(s)** sont évalués côté Trail pour calculer son score (toute l'île, le panel pilote, les sentiers proches du point de départ) ?
   - `Q11` évoque explicitement le cas où *« les conditions sont bonnes **(ou mauvaises)** pour les deux sports »*. Que répond l'application quand les deux activités sont défavorables : déconseille-t-elle toute sortie, ou recommande-t-elle tout de même l'activité la moins défavorable ?

### 5.3. Compte utilisateur, Données et RGPD

6. **Données persistées et synchronisées dans le compte (Majeur) :**
   - `REQ-015` impose de retrouver ses données sur tous ses appareils, mais le CDC ne précise pas si le compte ne stocke que le profil (4 champs + sports favoris) ou également l'historique des itinéraires préparés/validés et des fichiers `.gpx`.
7. **Cycle de vie du compte et authentification (Majeur) :**
   - Les parcours essentiels liés au compte obligatoire (`REQ-015`) ne sont pas abordés : récupération de mot de passe oublié, modification des identifiants, déconnexion, et gestion des erreurs d'authentification.
8. **Conformité RGPD complète : mineurs, retrait du consentement, conservation et format d'export (Majeur) :**
   - **Mineurs :** l'application est « grand public » (`Q03`) et collecte des données de forme physique/santé (âge, poids, taille, VMA). En France, la majorité numérique RGPD est à 15 ans : faut-il bloquer l'inscription des mineurs ou recueillir l'accord parental ?
   - **Retrait du consentement :** le RGPD impose de pouvoir retirer son consentement aussi facilement qu'il a été donné. Que devient un compte dont l'utilisateur retire le consentement aux données physiques sans supprimer le compte ?
   - **Durée de conservation** des données (pourtant posée dans la question `Q24`) et **format du fichier d'export** (`REQ-019`) non définis.

### 5.4. Administration et Sécurité opérationnelle

9. **Gouvernance et traçabilité de l'espace d'administration (Majeur) :**
   - Comment le ou les comptes « Administrateur » sont-ils créés et gérés ?
   - En cas de forçage manuel de l'état d'un sentier (`R-08`), surtout si un administrateur force en *« ouvert »* un sentier déclaré *« fermé »* par une source automatique, existe-t-il un **journal d'audit** (qui a modifié, quand, pourquoi) et un avertissement de sécurité ?

### 5.5. Ergononomie et Cas limites mineurs

10. **Cas de la pêche du bord face au risque requin (`INC-07` / `REQ-027`) (Mineur) :**
    - `INC-07` restreint l'alerte requin à la chasse sous-marine, mais certaines formes de pêche du bord (pêche en wading / les pieds dans l'eau sur le platier) peuvent exposer au risque requin. À confirmer avec le client.
11. **Sens de parcours et points d'intérêt sur un aller-retour (Mineur) :**
    - Pour un aller-retour (`REQ-002`), la météo de l'aller et celle du retour sur les mêmes tronçons interviennent à des heures différentes ; l'affichage doit distinguer les deux passages.
12. **Gestion des unités et bornes de saisie du profil (Mineur) :**
    - Aucune règle de cohérence/plage valide n'est mentionnée pour l'âge, le poids, la taille et la VMA afin d'éviter des calculs physiologiques aberrants (ex. VMA à 50 km/h ou poids à 5 kg).

---

## 6. Matrice de traçabilité synthétique (`CR-001` → `CDC v1`)

| Source CR | Statut | Traçabilité CDC | Remarque principale |
| --- | :---: | --- | --- |
| **En-tête CR** | ⚠️ | En-tête, §1, §4, `ZO-01` | Nom `MeteoSport` inventé dans le CDC |
| **§1 (Propos client)** | ⚠️ | §1, §2, `REQ-004` à `013`, `AMB-01/02/03` | Oubli du *créneau horaire disponible* côté Trail ; fausse citation dans `INC-02` |
| **Q01** | ⚠️ | `C5`, `REQ-101` | « Possibilité de PWA » durcie en installation obligatoire (cohérent avec `Q27`) |
| **Q02** | ✅ | `REQ-016` | Conforme |
| **Q03** | ⚠️ | §1, §4, §5 (*Sarah*), `INC-03` | « Grand public » étendu aux *randonneurs* (hérité de `§4.1`, en tension avec `Q05`) |
| **Q04** | ✅ | §4, `ZO-02` | Conforme |
| **Q05** | ⚠️ | §6 (*Hors périmètre*), `C4` | Tension mineure avec « randonneurs » en §4/§5 |
| **Q06** | ✅ | §6, `Obj 1–4`, `INC-01` | Conforme |
| **Q07** | ✅ | §1, `Obj 7`, `C1`, `C2`, `ZO-02`, `ZO-03` | Échéance au 14/12/2026 correctement calculée |
| **Q08** | ✅ | §6, `REQ-024`, `AMB-06` | Conforme (angle mort sur la séparation UI bord vs chasse) |
| **Q09** | ⚠️ | `Obj 5`, `REQ-024`, `ZO-15` | « Score argumenté » en `Obj 5` extrapolé depuis `Q11` |
| **Q10** | ⚠️ | `C10`, `REQ-026/027`, `INC-07`, `ZO-11` | Pas de règle métier requin (contrairement à `R-11`) ; citation §1 imprécise |
| **Q11** | ⚠️ | `Obj 6`, `REQ-028`, `AMB-02` | Cas « mauvaises conditions pour les 2 sports » non adressé |
| **Q12** | ⚠️ | `REQ-025`, *Patrice* | Oubli du point de départ/créneau dans `REQ-028` (arbitrage) ; date oubliée en `REQ-025` |
| **Q13** | ⚠️ | `REQ-007`, `INC-05`, `AMB-07` | Exclusion de l'historique météo affichée absente du tableau *Hors périmètre* |
| **Q14** | ✅ | §6 (*Hors périmètre*), `R-04` | Conforme |
| **Q15** | ✅ | `R-03`, `REQ-007`, `AMB-11`, `ZO-04` | Conforme (conflit avec l'hypothèse de `ZO-09`) |
| **Q16** | ⚠️ | `R-01`, `R-02`, `REQ-003/008`, `AMB-04` | `R-01` étendue au trajet choisi ; tension `R-02` vs `REQ-003` |
| **Q17** | ⚠️ | §6, `REQ-014`, `INC-08` | `REQ-014` (`Could`) listé dans le périmètre « prioritaire » en §6 |
| **Q18** | ⚠️ | `REQ-001`, `REQ-002`, `INC-08`, `INC-09` | « Dénivelé accepté » traduit en « dénivelé maximal accepté » en `Must` |
| **Q19** | ✅ | `Obj 4`, `REQ-011`, `REQ-110`, `AMB-08`, `ZO-14` | Conforme |
| **Q20** | ✅ | §6 (*Hors périmètre*), `REQ-016`, `INC-04` | Conforme |
| **Q21** | ❌ | `R-05`, `REQ-009`, `REQ-107`, `INC-02` | **Oubli des calculs *sécuritaires*** dans `R-05`, `REQ-107` et *Hors périmètre* ; `REQ-009` restrictif |
| **Q22** | ✅ | §6 (*Hors périmètre*), `REQ-016` | Conforme |
| **Q23** | ✅ | `REQ-015`, `REQ-105`, `ZO-10`, `INC-03` | Conforme (`REQ-105` à étendre à modification/suppression) |
| **Q24** | ⚠️ | `C9`, `R-13`, `REQ-018/019`, `ZO-12` | Durée de conservation (question `Q24`) oubliée ; politique de confidentialité omise en §6 |
| **Q25** | ⚠️ | §4, `C3`, `REQ-102`, `REQ-104` | Exigence de *fiabilité* non formalisée ; données marines omises en `REQ-104` |
| **Q26** | ✅ | `R-07`, `REQ-103`, `INC-06`, `ZO-16` | Conforme |
| **Q27** | ✅ | §1, §6, `C6`, `REQ-109` | Conforme |
| **Q28** | ✅ | §1, `C2`, `C3`, `REQ-102`, `INC-02`, `ZO-15` | Conforme |
| **Q29** | ⚠️ | `R-14`, `REQ-020`, `ZO-12` | Clause de non-responsabilité en cas d'accident omise dans `R-14` |
| **Q30** | ✅ | §6, `INC-01` | Conforme |
| **Q31** | ⚠️ | `R-10`, `REQ-024`, `INC-05`, `INC-06` | Exclusion de la mesure directe absente du tableau *Hors périmètre* |
| **Q32** | ✅ | §6, `R-11`, `REQ-026`, `INC-07` | Conforme |
| **Q33** | ✅ | `R-12`, `REQ-017`, `REQ-028` | Conforme |
| **Q34** | ⚠️ | `R-06`, `REQ-008`, `REQ-023`, `ZO-07` | `REQ-023` ajoute une gestion admin des règles non demandée |
| **Q35** | ✅ | `R-09`, `REQ-014` | Conforme |
| **Q36** | ✅ | §1, `R-08`, `REQ-021`, `AMB-12`, `ZO-08` | Conforme |
| **Q37** | ✅ | §1, §6, `C8`, `REQ-111`, `INC-03` | Conforme |
| **Q38** | ⚠️ | §1, `C3`, `C7`, `REQ-108` | Glissement mineur « limites de quotas » → « seuils » dans `REQ-108` |
| **Q39** | ✅ | §6, `R-12`, `REQ-017`, `INC-01`, `INC-04` | Conforme |
| **Q40** | ⚠️ | `Obj 1`, `REQ-023`, `INC-09`, `AMB-09` | Contradiction `Obj 1` vs `INC-09` ; hors panel pilote absent du *Hors périmètre* |
| **Q41** | ✅ | *(Omis volontairement)* | Consigne de non-inscription parfaitement respectée |
| **Q42** | ⚠️ | §4, §6, `REQ-021/022/106`, `AMB-10`, `ZO-08` | Sur-spécifié par l'ajout de `REQ-023` |

---

## 7. Plan d'actions recommandé pour la v2 du CDC

### Corrections immédiates (conformité stricte au CR-001)
1. **Supprimer ou requalifier `REQ-023`** (administration des critères de sécurité par sentier) : ne pas l'inclure comme exigence issue du CR, ou la déplacer en hypothèse/question ouverte.
2. **Compléter `R-05`, `REQ-107` et le tableau *Hors périmètre*** pour intégrer les **calculs sécuritaires** (pas uniquement physiologiques), conformément à `Q21`.
3. **Compléter `R-14`** avec la **clause de non-responsabilité en cas d'accident** (`Q29`).
4. **Corriger `Obj 5` et `REQ-024`** : retirer la mention *« avec un score argumenté »* (qui appartient à `Obj 6` / `Q11`), ou la marquer explicitement comme hypothèse de conception.
5. **Réintégrer les éléments oubliés :**
   - Le *créneau horaire disponible* dans `REQ-001` ou le traiter en ambiguïté/zone d'ombre (section 11) ;
   - Le *point de départ* et le *créneau disponible* dans `REQ-028` (`Q12`/`§4.2`) ;
   - La *date* dans `REQ-025` (cohérence avec `Obj 5`) ;
   - Une règle métier dédiée à l'alerte *risque requin* (miroir de `R-11`) ;
   - La *fiabilité* des sources (`Q25`) en section 10 et les exclusions manquantes (`Q13`, `Q31`, `Q40`) dans le *Hors périmètre*.
6. **Corriger les défauts éditoriaux et cohérences internes :**
   - Indiquer que *« MeteoSport »* est un nom provisoire (ou le remplacer par « Application Trail & Pêche » en attendant validation) ;
   - Corriger la fausse citation de `§1` dans `INC-02` ;
   - Renommer la colonne `Posée le` en `Source` dans les tableaux `11.1`, `11.2` et `11.3` ;
   - Aligner `Obj 1` avec `INC-09`, `R-02` avec `REQ-003`/`REQ-004`, `REQ-014` (`Could`) avec la section 6, et compléter les personas dans le tableau de la section 9 ;
   - Requalifier « randonneurs » / persona *Sarah* (ou ajouter une ambiguïté `AMB-13` sur l'ouverture à la randonnée face à `Q05`).

### Nouvelles zones d'ombre à ajouter en section 11
- **`ZO-09` (correction) :** préciser comment la météo par tronçon (`R-03`) fonctionne en l'absence de VMA (ex. allure de référence par défaut).
- **Nouvelles entrées recommandées :**
  - Gestion horaire des sorties sur plusieurs jours (heures d'étape/reprise) ;
  - Comportement face aux vigilances officielles majeures (cyclone, vigilance rouge/orange, fermeture générale) et en cas d'absence d'itinéraire valide ;
  - Sélection du « trajet choisi » parmi plusieurs itinéraires possibles ;
  - Distinction Pêche du bord vs Chasse sous-marine (recherche, critères, classement des sports favoris) ;
  - Cas d'arbitrage où les deux sports sont défavorables et définition du secteur Trail évalué dans `REQ-028` ;
  - Périmètre de synchronisation du compte (profil seul ou historique d'itinéraires), cycle de vie du compte (mot de passe oublié) et compléments RGPD (durée de conservation `Q24`, mineurs < 15 ans, retrait du consentement, format d'export) ;
  - Création du rôle administrateur et journalisation des forçages manuels (`R-08`).