# Rapport de vérification — CDC v1.1 et CR-001 (suivi des corrections)

**Date :** 23/11/2026
**Rédigé pour :** Ivan (équipe MeteoSport)
**Documents vérifiés :**
- `tdd/docs/cr/cr-001.md` — Compte rendu d'entretien n° 001 (dernière modification : commit `65e448d`)
- `tdd/docs/cdc/cahier-des-charges-v1.md` — Cahier des charges **v1.1** (commit `dc28ade`, journal C-01 à C-47)

Ce rapport reprend chaque point de la vérification précédente (P-01 à P-03, M-01 à M-06, m-01 à m-07) et indique s'il a été corrigé. Il signale aussi les nouveaux points apparus avec la v1.1.

**Constat principal :** le CDC a été corrigé sur presque tous les points (journal C-30 à C-47). **Le CR-001, lui, n'a pas été modifié depuis le commit `65e448d`** : toutes les corrections demandées dans le CR restent à faire.

---

## 1. Synthèse

| Contrôle | Résultat |
|---|---|
| Structure du CR conforme au modèle (§1 à §5) | ✅ Conforme |
| Structure du CDC conforme au modèle (§1 à §12) | ✅ Conforme (+ §13 journal) |
| Questions Q01 à Q42 citées dans le CDC | ✅ 41 / 42 dans le corps ; Q41 n'est plus citée que dans le journal (C-33), ce qui est voulu |
| Identifiants INC / AMB / ZO : chacun défini une seule fois en §11 | ✅ 11 INC, 28 AMB, 35 ZO, aucun doublon |
| Chaque marqueur ⚠ du corps renvoie à une entrée existante de §11 | ✅ Aucun renvoi cassé dans le corps (voir N-02 pour le journal) |
| Chaque entrée de §11 est rattachée au corps du document | ✅ |
| Exigences REQ-001 à REQ-030 et REQ-101 à REQ-114 présentes | ✅ Numérotation complète, aucun renvoi vers une exigence inexistante |
| Nombre de Must annoncé en ZO-35 (20) | ✅ 20 exigences fonctionnelles Must comptées |
| Alignement §6 Périmètre ↔ priorités §9 | ✅ Cohérent (REQ-022, REQ-023 en Must dans le périmètre prioritaire) |
| Absence de noms de technologies dans le CDC | ✅ Respecté |
| Fichiers cités dans le journal §13 | ❌ 4 fichiers absents du dépôt (N-01) |

**Bilan des points du rapport précédent :**

| Gravité | Total | Corrigés | Partiels | Non corrigés |
|---|---|---|---|---|
| Importants (P) | 3 | 2 | 1 | 0 |
| Moyens (M) | 6 | 3 | 1 | 2 |
| Mineurs (m) | 7 | 5 | 1 | 1 |
| **Total** | **16** | **10** | **3** | **3** |

Tous les points restants portent sur le **CR-001**. Le CDC est prêt à être présenté au client, sous réserve des nouveaux points N-01 à N-03 (traçabilité du journal).

---

## 2. Suivi des points importants

| # | Point | Statut | Vérification |
|---|---|---|---|
| P-01 | Gestion des alertes déclassée en Should | ✅ Corrigé | REQ-022 en **Must** (§9) et dans le périmètre prioritaire (§6). Journal C-30 |
| P-02 | Trajet conseillé (Must) dépendant d'un référentiel Should | ✅ Corrigé | REQ-023 en **Must**, dans le périmètre prioritaire. REQ-008 et REQ-029 ne reposent plus sur une exigence Should. Journal C-30 |
| P-03 | Commentaire de l'équipe dans la réponse Q41 | ⚠ Partiel | **CDC corrigé :** INC-11 ne cite plus Q41 (C-33). **CR non corrigé :** la réponse Q41 contient toujours « Modalité logistique interne non contractuelle (à ne pas inscrire comme contrainte dans le CDC) ». Le journal du CR affirme pourtant que les commentaires de l'équipe ont été retirés des réponses |

→ **Reste à faire (CR, Q41) :** garder seulement « Poste de développement local (`localhost`) » et déplacer la remarque sous le tableau, en note de l'équipe.

---

## 3. Suivi des points moyens

| # | Point | Statut | Vérification |
|---|---|---|---|
| M-01 | Q30 : réponse contradictoire (« Non défini à ce stade » + une règle) | ❌ Non corrigé | La réponse Q30 du CR est inchangée. Côté CDC, INC-01 reste ouvert et C-31 précise que la priorité des exigences trail est un choix de l'équipe : le CDC gère bien l'ambiguïté |
| M-02 | CR §1 présente la randonnée comme tranchée | ❌ Non corrigé | CR §1, ligne « Formulations ambiguës » : « tracés de rando » (le périmètre est limité au trail et à la pêche en Q05) — toujours formulé comme une réponse, alors que CR §3 n° 5 et AMB-14 laissent la question ouverte |
| M-03 | Prémisses de l'équipe présentées comme faits du client (§1 du CDC) | ✅ Corrigé | Microclimats, rôle de l'ONF, publication des décisions, Mafate sans réseau : tous marqués *(connaissance extérieure au CR)* ou *(prémisse de l'équipe)*, y compris C7 et le persona Julien. Journal C-35 |
| M-04 | « Abris, gîtes et échappatoires » écartés sans le dire | ✅ Corrigé | Ligne marquée *(hypothèse de l'équipe, ⚠ INC-08)* avec un motif explicite. Journal C-36 |
| M-05 | Verdict hors panel pilote non défini | ✅ Corrigé | INC-09 et REQ-029 : hors panel, verdict sur la grille générale seule, signalé comme tel. Journal C-37 |
| M-06 | Échéance interne (09/12) transformée en critère de recette | ⚠ Partiel | **CDC corrigé :** §1, objectif 7, C1, ZO-03 et REQ-111 distinguent le 14/12/2026 (client) du 09/12/2026 (jalon interne). Journal C-34. **CR non corrigé :** §5 point 1 parle toujours de « échéance du 09/12/2026 » |

→ **Reste à faire (CR) :**
1. Q30 : noter ce que le client a réellement dit, ou séparer « Non défini à ce stade » et la règle sur deux phrases attribuées clairement.
2. §1 : remplacer la parenthèse par « voir Q05 et §3 n° 5 ».
3. §5 point 1 : écrire « échéance du client 14/12/2026, jalon interne 09/12/2026 ».

---

## 4. Suivi des remarques mineures

| # | Point | Statut | Vérification |
|---|---|---|---|
| m-01 | Chemin de la source dans l'en-tête du CDC | ✅ Corrigé | `tdd/docs/cr/cr-001.md`. Journal C-45 |
| m-02 | Passage en v1.1 | ✅ Corrigé | En-tête v1.1 et ligne v1.1 au §12. Journal C-45 |
| m-03 | REQ-110 parmi les « vérifications sur smartphone » | ✅ Corrigé | INC-11 : « sur des appareils de test », REQ-110 citée pour l'import `.gpx`. Journal C-33 |
| m-04 | « Compte sécurisé » sans exigence vérifiable | ✅ Corrigé | Nouvelle REQ-114 (mots de passe, blocage après échecs), référencée depuis REQ-015. Journal C-43 |
| m-05 | Justification du classement des sports incohérente avec Should | ✅ Corrigé | INC-01 : « le classement des sports n'a d'utilité que si la pêche est livrée ». Journal C-44 |
| m-06 | CR §4 : reformulation incomplète | ❌ Non corrigé | CR §4.1 ne mentionne toujours ni la suggestion de trace par distance (REQ-010), ni la difficulté (REQ-006), ni l'indication de conditions favorables (REQ-029, besoin n° 2) |
| m-07 | Listes de priorités CR §5 ↔ CDC §11 | ⚠ Partiel | Le CDC reprend les 15 identifiants du CR §5 et annonce explicitement deux ajouts (AMB-19, ZO-31). Le CR §5 n'a pas été mis à jour : AMB-19 (« tracé GPX ») et ZO-31 (source de l'état des sentiers) n'apparaissent pas dans l'ordre du jour de l'entretien n° 002 |

→ **Reste à faire (CR) :** compléter §4.1 et ajouter AMB-19 et ZO-31 à l'ordre du jour du §5 (AMB-19 au point 2 « Périmètre », ZO-31 au point 3 « Trail »).

---

## 5. Nouveaux points relevés dans la v1.1

### N-01 — Le journal du CDC cite des rapports absents du dépôt (important pour la traçabilité)
La §13 cite sept rapports. Quatre n'existent pas dans le dépôt :

| Fichier cité | État |
|---|---|
| `collab/MaxLaMenace/rapport-verification-cdc-v1.md` | supprimé (absent depuis le commit `8a7da04`) |
| `collab/TiBenoit/rapport_de_v_rification_du_cdc_v1.md` | supprimé (absent depuis le commit `e1a96b5`) |
| `collab/Ivan/rapport-coherence-cdc-cr.md` | supprimé par le commit `22e1f8b` |
| `collab/rapport-corrections-cdc-v1.1.md` | **jamais versionné** — c'est pourtant lui qui doit contenir « le détail » de C-30 à C-47 |

→ Ajouter `collab/rapport-corrections-cdc-v1.1.md` au dépôt. Pour les rapports supprimés, soit les restaurer, soit indiquer dans la §13 le commit où on peut les retrouver (ex. « supprimé, voir `git show 7c676b3` »).

### N-02 — Identifiants d'autres rapports confondus avec ceux du CDC
La colonne « Origine » du journal cite « Max INC-13 », « Max INC-14 »… « Max INC-18 », « Max ZO-33 », « Max ZO-31, 32, 34, 35, 36 ». Ce sont les numéros du rapport de Max, pas ceux du CDC. Or :
- INC-12 à INC-18 n'existent pas dans le CDC ;
- ZO-31 à ZO-35 existent dans le CDC **avec un autre contenu**, et ZO-36 n'existe pas.

Un lecteur qui cherche « ZO-33 » tombera sur la qualification des données de santé, alors que C-42 parle du compte obligatoire.
→ Préfixer les identifiants externes (ex. « Max/INC-13 ») ou citer la section du rapport d'origine.

### N-03 — Noms des auteurs des rapports incohérents
Le journal cite tour à tour « Rapport Thomas », « Rapport TiBenoit » et « Rapport Max », alors que les dossiers s'appellent `TiBenoit` et `MaxLaMenace`.
→ Utiliser partout le nom du dossier (ou partout le prénom) pour qu'on retrouve le fichier sans ambiguïté.

### N-04 — Le journal du CR n'enregistre pas la seconde série de corrections
Le CDC est passé en v1.1, mais le CR n'a ni nouvelle entrée de journal ni mention de la vérification. Une fois P-03, M-01, M-02, M-06, m-06 et m-07 corrigés, ajouter une ligne datée au journal du CR.

---

## 6. Vérifications sans anomalie

- **Dépendances de priorités :** aucune exigence Must ne dépend d'une exigence Should ou Could (REQ-008 et REQ-029 s'appuient sur REQ-023, désormais Must).
- **Nouvelles entrées §11 :** AMB-19 à AMB-28 et ZO-31 à ZO-35 sont toutes rattachées au corps du document.
- **Nouvelles règles et exigences :** R-16 ↔ ZO-10 ; REQ-114 ↔ REQ-015 ; REQ-030 ↔ INC-08, ZO-19, ZO-29 ; REQ-026 ↔ R-11 ; REQ-027 ↔ R-15 : renvois cohérents.
- **Hypothèses signalées :** les choix de l'équipe plus restrictifs que le client (alerte requin, R-15 / AMB-18 ; scission du multi-jours, INC-08 ; lecture du « tracé GPX », AMB-19) sont explicitement marqués comme à faire valider.
- **Dates :** 23/11/2026 + 3 semaines = 14/12/2026 ; jalon interne au 09/12/2026 ; scénarios de recette avant le 30/11/2026 (ZO-02) — cohérent dans tout le CDC.
- **Liste « à trancher en priorité » (§11) :** contient bien les 15 identifiants du CR §5, plus AMB-19 et ZO-31, comme annoncé.

---

## 7. Actions restantes avant présentation au client

**CR-001 (aucune correction faite à ce jour) :**
1. Q41 : retirer la consigne de l'équipe de la réponse (P-03).
2. Q30 : clarifier la réponse du client (M-01).
3. §1 : ne plus présenter la randonnée comme tranchée (M-02).
4. §5 : distinguer l'échéance client (14/12) du jalon interne (09/12) (M-06), et ajouter AMB-19 et ZO-31 (m-07).
5. §4.1 : ajouter suggestion de trace, difficulté et indication de conditions favorables (m-06).
6. Journal : ajouter une entrée pour ces corrections (N-04).

**CDC v1.1 (traçabilité uniquement) :**
7. Versionner `collab/rapport-corrections-cdc-v1.1.md` et traiter les rapports supprimés cités en §13 (N-01).
8. Distinguer les identifiants des rapports externes de ceux du CDC dans la colonne « Origine » (N-02), et harmoniser le nom des auteurs (N-03).
