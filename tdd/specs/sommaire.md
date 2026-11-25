# Sommaire des spécifications — MeteoSport

Index des domaines. Un fichier `specs/<domaine>.md` par domaine.

| Domaine | Fichier | Code `<DOM>` | Statut |
|---|---|---|---|
| Architecture, PWA et paramétrage | [`architecture.md`](./architecture.md) | `ARCH` | proposé |
| Comptes, profil et RGPD | [`comptes-profil.md`](./comptes-profil.md) | `AUTH` | proposé |
| Référentiels internes | [`referentiels.md`](./referentiels.md) | `REF` | proposé |
| Sources externes, météo et fraîcheur | [`sources-meteo.md`](./sources-meteo.md) | `METEO` | proposé |
| Trail : recherche, routage et trajet conseillé | [`trail.md`](./trail.md) | `TRAIL` | proposé |
| Moteurs de calcul et explications | [`calculs.md`](./calculs.md) | `CALC` | proposé |
| Export GPX | [`export-gpx.md`](./export-gpx.md) | `GPX` | proposé |
| Pêche | [`peche.md`](./peche.md) | `PECHE` | proposé |
| Comparateur d'activités | [`comparateur.md`](./comparateur.md) | `COMP` | proposé |
| Administration et alertes | [`administration.md`](./administration.md) | `ADMIN` | proposé |

## Description des domaines

### `ARCH` — Architecture, PWA et paramétrage
- **Périmètre :** exécution complète en local pour la démonstration à coût zéro, ergonomie mobile et installation sur écran d'accueil (PWA connectée), écran d'indisponibilité hors connexion, externalisation de tous les paramètres configurables (découpage météo, quotas, paliers VMA, valeurs par défaut, seuil d'équivalence, durée maximale de fraîcheur).
- **Couverture CDC :** `REQ-101`, `REQ-102`, `REQ-108`, `REQ-109`, `REQ-111`, `REQ-115`.

### `AUTH` — Comptes, profil et RGPD
- **Périmètre :** inscription (≥ 15 ans), connexion, déconnexion, réinitialisation du mot de passe, sécurité (hachage, blocage temporaire après échecs), cloisonnement des données, gestion du profil facultatif (âge, poids, taille, VMA + bornes plausibles) et du classement des sports favoris, recueil et retrait du consentement, CGU, politique de confidentialité, export standard et suppression du compte.
- **Couverture CDC :** `REQ-015` à `REQ-020`, `REQ-105`, `REQ-114` ; `R-13`, `R-14`, `R-16`, `R-17` (`R-20` relève de `CALC`).
- **Points ouverts à raccrocher :** durée de conservation (`ZO-26`), qualification RGPD des données de forme physique (`ZO-33`).

### `REF` — Référentiels internes
- **Périmètre :** schémas de données et procédures d'import des sentiers officiels balisés (tracés, cotations officielles, points d'eau) et des spots de pêche (positions précises), ainsi que modélisation des critères de sécurité propres aux 3 parcours du panel pilote (La Possession → Mafate, Roche Écrite, Piton des Neiges).
- **Couverture CDC :** `REQ-023`, `REQ-032` ; `R-01`, `R-06`.

### `METEO` — Sources externes, météo et fraîcheur
- **Périmètre :** catalogue documenté des sources gratuites retenues (producteur, fréquence, quotas, conditions d'utilisation), découpage géographique météo paramétrable, prévisions sur 3 jours (heure par heure et par jour), constitution de l'historique interne des pluies récentes, horodatage de fraîcheur et gestion des indisponibilités ou données périmées sans extrapolation.
- **Couverture CDC :** `REQ-007`, `REQ-031`, `REQ-102`, `REQ-103`, `REQ-104`, `REQ-108`, `REQ-113` ; `R-03`, `R-07`, `R-10`, `R-18`.

### `TRAIL` — Trail : recherche, routage et trajet conseillé
- **Périmètre :** saisie des critères du jour même (départ/arrivée, heure de départ, aller simple/aller-retour, dénivelé) et second mode par distance ou niveau ; construction d'itinéraire sur sentiers balisés ajustable par l'utilisateur, affichage de l'état des sentiers et de la cotation, gestion des impasses (contrainte bloquante + parcours proche réalisable) et calcul du trajet conseillé sur le panel pilote lorsqu'un sentier est désactivé.
- **Couverture CDC :** `REQ-001` à `REQ-004`, `REQ-006`, `REQ-008`, `REQ-010` (partiel avec `CALC`) ; `R-01`, `R-02`, `R-03`, `R-04`, `R-06`, `R-07`, `R-08`, `R-16` à `R-20` ; `REQ-026` et `R-11` (partiel avec `ADMIN` : affichage des alertes en cours sur le trajet choisi et le trajet conseillé, `SPEC-TRAIL-05`) ; `REQ-103`, `REQ-104` (partiel avec `METEO` : affichage pour l'état des sentiers, `SPEC-TRAIL-05`, `SPEC-TRAIL-07`).
- **Points à raccrocher ailleurs :** la clause de `REQ-002` « en aller-retour, la météo de chaque passage est affichée séparément » relève de `METEO` ; **non couverte à ce jour** (`sources-meteo.md` supprimé, commit `7e4094f`, ARB-001) ; `TRAIL` fournit les deux passages distincts (`SPEC-TRAIL-01`, AC-5). L'affichage des alertes sur la page de chaque sentier (`REQ-026`) n'est pas couvert par `TRAIL` et relève de `ADMIN` ou `REF` (non rédigés). Les variantes du panel pilote utilisées par le trajet conseillé sont à déclarer dans `REF`.

### `CALC` — Moteurs de calcul et explications
- **Périmètre :** règles déterministes reproductibles et sans IA : temps de parcours (trail et randonnée, VMA ou allure par défaut, dénivelé), quantités d'eau et de nourriture (incluant la chaleur), grille d'équipement, verdict à 3 niveaux (règles du sentier, grille générale, vigilances officielles, pluie récente), affichage indicatif des points d'eau, et explications en langage courant (IA gratuite ou textes types).
- **Couverture CDC :** `REQ-005`, `REQ-009`, `REQ-010` (niveau de l'utilisateur, partiel avec `TRAIL`), `REQ-012` à `REQ-014`, `REQ-029`, `REQ-107`, `REQ-115` (paramètres de calcul, partiel avec `ARCH`) ; `R-05`, `R-09`, `R-17`, `R-19`, `R-20`.

### `GPX` — Export GPX
- **Périmètre :** validation du tracé retenu (trajet choisi ou trajet conseillé), génération d'un fichier `.gpx` conforme au format standard et contrôle de compatibilité pour l'import sur montres et GPS.
- **Couverture CDC :** `REQ-011`, `REQ-110`.

### `PECHE` — Pêche
- **Périmètre :** saisie du créneau sur place et du point de départ pour le jour même, évaluation des spots (vent, houle, marée, solunaire, pluie, clarté estimée via l'historique des pluies) sans distinction de technique, prise en compte de la distance, justification des critères et retrait signalé d'un critère sans source gratuite.
- **Couverture CDC :** `REQ-024`, `REQ-025`, `REQ-031` ; `R-10`, `R-18`.

### `COMP` — Comparateur d'activités
- **Périmètre :** calcul et justification du score comparatif entre trail (sentiers pilotes proches du point de départ) et pêche pour le créneau du jour même, gestion du cas « aucune sortie recommandée » si les deux activités sont défavorables, et arbitrage par le classement des sports favoris sous le seuil d'équivalence.
- **Couverture CDC :** `REQ-028` ; `R-12`, `R-18`.

### `ADMIN` — Administration et alertes
- **Périmètre :** contrôle d'accès réservé au rôle administrateur, forçage temporaire ou permanent de l'état d'un sentier (avec journalisation de l'auteur, de la date et du motif), création/modification/retrait d'alertes génériques (dont Réserve naturelle marine et risque requin) rattachées aux sentiers ou spots, et affichage sur chaque fiche et recommandation concernée.
- **Couverture CDC :** `REQ-021`, `REQ-022`, `REQ-026`, `REQ-027`, `REQ-106` ; `R-08`, `R-11`.

## Chaîne

```text
REQ-nnn → SPEC-<DOM>-nn → CASE-<DOM>-nn
```

Voir aussi : `docs/traceability.md`, `tests/cases/<domaine>/sommaire.md`.