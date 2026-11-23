# Rapport de suivi — corrections du CDC v1

**Auteur :** relecture assistée (demandée par Maxime)
**Date :** 23/11/2026
**Documents comparés :** `tdd/docs/cdc/cahier-des-charges-v1.md` (CDC, section 13 « Journal des corrections »), `tdd/docs/cr/cr-001.md` (CR) et le rapport de vérification précédent (supprimé)
**Méthode :** chaque constat du rapport précédent a été recherché dans le CDC corrigé.

Classement : ✅ corrigé · 🟠 partiellement corrigé.

---

## 0. Verdict

Sur les 21 constats du rapport précédent, **19 sont corrigés** et **2 restent partiels** (N-04 et N-08). Les corrections sont tracées dans la section 13 du CDC (C-01 à C-29).

---

## 1. Constats corrigés

### Hallucinations et sur-interprétations

| Réf. | Constat | État | Correction constatée dans le CDC |
|---|---|---|---|
| H-01 | Budget « 0 € » étendu à toute l'exploitation | ✅ | Contrainte n°2, REQ-102 et ZO-18 : 0 € limité à la réalisation et aux API ; hébergement non tranché (C-01) |
| H-02 | INC-02 : citation inexacte, raisonnement bancal | ✅ | Citation « trajet conseillé par l'IA » conforme au CR rétabli ; lecture « outillage de dev » ajoutée ; explications par textes types ; affirmation sur le coût d'une IA retirée (C-03) |
| H-03 | Personas : faits inventés | ✅ | Détails non sourcés marqués *(hypothèse)* ou retirés ; Sarah devient « traileuse débutante » (C-04) |
| H-04 | « Le client pratique le trail » | ✅ | §1 et §4 reformulés (C-04) |
| H-05 | REQ-023 : rôle de l'administrateur inventé | ✅ | Critères consignés dans le référentiel ; l'espace d'administration reste limité aux statuts et aux alertes (C-06) |
| H-06 | Citations mal rattachées | ✅ | Côte ouest rattachée à Q32, Q38 corrigé, ZO-11 et AMB-18 marqués « connaissance extérieure », ZO-02 corrigé, randonnée en AMB-14 (C-05, C-08) |

### Incohérences internes

| Réf. | Constat | État | Correction constatée dans le CDC |
|---|---|---|---|
| I-01 | « Trajet choisi » non défini | ✅ | AMB-13 ajoutée ; R-01 signalée comme extension ; REQ-003 ne limite plus le trajet choisi aux sentiers ouverts ; REQ-008 déclenchée aussi par un sentier fermé (C-18) |
| I-02 | Météo par tronçon (REQ-007) ou par zone (REQ-108) | ✅ | INC-10, R-03 et REQ-007 : « par zone traversée, à l'heure de passage » (C-19) |
| I-03 | Points d'eau : « prioritaire » en §6, Could en REQ-014 | ✅ | §6 aligné sur la §9 (C-17) |
| I-04 | REQ-013 et R-05 divergent | ✅ | Alignées, la météo est marquée *déduite* (C-20) |
| I-05 | Smartphone et installation vs démonstration en `localhost` | ✅ | INC-11 ajoutée ; vérifications sur smartphone faites par l'équipe hors démonstration (REQ-101, REQ-109) (C-21) |
| I-06 | Références orphelines en §11 | ✅ | INC-04, INC-05, INC-06 et AMB-07 rattachés au corps (REQ-007, REQ-016, REQ-017, R-07, R-10) (C-25) |

### Non-dits du CR

| Réf. | Constat | État | Correction constatée dans le CDC |
|---|---|---|---|
| N-01 | « En local » (Q37) supprimé du CDC | ✅ | Réintroduit en §1, objectif 7, contrainte 8 et REQ-111 ; INC-03 reformulé en point à confirmer (C-02) |
| N-02 | Créneau horaire prévu seulement pour la pêche | ✅ | AMB-15 et REQ-001 (C-13) |
| N-03 | Pas de verdict « météo idéale » pour le trail | ✅ | REQ-029 et ZO-17 (C-12) |
| N-05 | Conservation des données (Q24) sans réponse | ✅ | ZO-26 (C-28) |
| N-06 | « Conditions équivalentes » sans seuil | ✅ | AMB-16 (C-28) |
| N-07 | Volet pêche à rendre indépendant du trail | ✅ | REQ-112 (C-29) |
| N-09 | Portée de la règle R-11 (côte ouest) | ✅ | AMB-17 (C-28) |

### Hypothèses de la section 11

| Point | État | Correction constatée dans le CDC |
|---|---|---|
| INC-02 (faux dilemme sur REQ-009) | ✅ | Voir H-02 |
| INC-03 (déjà répondu par Q37) | ✅ | Reformulé en point à confirmer (C-02) |
| ZO-10 (compte obligatoire, déjà tranché par Q23) | ✅ | Retirée (C-26) |
| ZO-02 (échéance inventée) | ✅ | Datée : scénarios de recette soumis avant le 30/11/2026, échéance précisée comme fixée par l'équipe |
| AMB-09 (panel pilote fermé) | ✅ | Conservée comme hypothèse, à valider avant calibrage |

---

## 2. Points restés partiels

### 🟠 N-04 — Priorité de la demande n°1 du client

**Constat initial :** la première citation du client est une « suggestion de trace d'environ 40/50 km jusqu'à Mafate », et sa première attente est de savoir « quel sport est le plus propice ». Le CDC range pourtant la suggestion de trace (REQ-010) en **Should** et la comparaison entre activités (REQ-028) en **Could**.

**Ce qui a été fait :** INC-01 mentionne maintenant la suggestion de trace et documente l'hypothèse (trail = Must, pêche = Should, comparaison = Could, REQ-010 = Should). Cette hypothèse reste cohérente avec Q06 et Q30.

**Ce qui reste :** les priorités n'ont pas changé. Elles vont à l'encontre de l'ordre des attentes du client, et la réponse de Q06 (« le tracé GPX ») ne dit pas clairement si elle vise le GPX seul ou le GPX sur mesure.

**Action proposée :** reformuler INC-01 pour poser explicitement la question au client (« votre première demande est la suggestion de trace : doit-elle être dans la livraison à 3 semaines ? »), ou remonter REQ-010 en Must. À défendre dans tous les cas à la présentation.

### 🟠 N-08 — Sécurité du compte (Q23)

**Constat initial :** Q23 demande un compte utilisateur « sécurisé ». REQ-105 couvre l'isolation entre comptes, mais aucune exigence ne traite l'authentification elle-même.

**Ce qui a été fait :** REQ-015 reprend « compte sécurisé » et ZO-25 prévoit les parcours standards (création, connexion, déconnexion, réinitialisation du mot de passe).

**Ce qui reste :** « sécurisé » n'est pas défini. Aucune exigence ne dit à quoi on reconnaît un compte sécurisé (règles sur le mot de passe, protection contre les tentatives répétées, stockage des identifiants, durée de session) ni comment le vérifier.

**Action proposée :** ajouter une exigence non fonctionnelle (REQ-114), sans nom de technologie, par exemple : règles minimales sur le mot de passe, limitation des tentatives de connexion, mots de passe jamais conservés en clair, expiration de session. La colonne « Comment on la vérifie » serait un jeu de tests d'authentification. Les seuils exacts seraient à valider avec le client dans une zone d'ombre dédiée.

---

## 3. Suite proposée

1. Traiter N-04 : reformuler INC-01, ou arbitrer la priorité de REQ-010.
2. Traiter N-08 : rédiger REQ-114 et la zone d'ombre associée.
3. Reporter ces deux corrections dans le journal de la section 13 du CDC (C-30 et C-31).
4. Présenter le CDC au client (section 12 : « présentée au client » est encore à « non »).
