# Rapport de vérification — CDC v1 et CR-001 (après corrections)

**Date :** 23/11/2026
**Rédigé pour :** Ivan (équipe MeteoSport)
**Documents vérifiés :**
- `tdd/docs/cr/cr-001.md` — Compte rendu d'entretien n° 001 (version corrigée)
- `tdd/docs/cdc/cahier-des-charges-v1.md` — Cahier des charges v1 (corrigé le 23/11/2026, journal C-01 à C-29)

Ce rapport porte sur les versions issues du commit `65e448d` (« corrige le CR-001 et le CDC v1 après vérification croisée »). Il ne reprend pas les constats déjà traités par le journal des corrections : il vérifie ce qui reste, et ce que les corrections ont pu introduire.

---

## 1. Synthèse

| Contrôle | Résultat |
|---|---|
| Structure du CR conforme au modèle (§1 à §5) | ✅ Conforme |
| Structure du CDC conforme au modèle (§1 à §12) | ✅ Conforme (+ §13 journal) |
| Questions Q01 à Q42 citées dans le CDC | ✅ 42 / 42 citées au moins une fois |
| Identifiants INC / AMB / ZO : chacun défini une seule fois en §11 | ✅ 11 INC, 18 AMB, 30 ZO, aucun doublon |
| Chaque marqueur ⚠ du corps renvoie à une entrée existante de §11 | ✅ Aucun renvoi cassé |
| Chaque entrée de §11 est rattachée au corps du document | ✅ (ZO-10 retirée, normal) |
| Exigences REQ-001 à REQ-029 et REQ-101 à REQ-113 présentes | ✅ Numérotation complète |
| Alignement §6 Périmètre ↔ priorités §9 (Must / Should / Could) | ✅ Cohérent |
| Absence de noms de technologies dans le CDC | ✅ Respecté (« PWA » remplacé par « installable sur l'écran d'accueil ») |

**Avis global :** les deux documents sont cohérents et bien tracés. La vérification relève **3 points importants** (dépendances de priorités et réponse client non respectée), **6 points moyens** et **7 remarques mineures**. Aucun n'empêche de présenter le CDC au client, mais les points importants doivent être corrigés avant.

---

## 2. Points importants

### P-01 — La gestion des alertes est déclassée alors que le client l'a demandée sans condition
- **CR-001/Q42 :** « Interface d'administration dédiée […] pour gérer manuellement les statuts des sentiers **et les alertes** ».
- **CR-001/§4.1 (volet Trail, prioritaire) :** « Un administrateur peut forcer l'état d'un sentier **et gérer les alertes** ».
- **CDC :** REQ-021 (statuts) est Must, mais REQ-022 (alertes) est **Should** et rangée en §6 « si le calendrier le permet ».
- **Problème :** le CR range les alertes dans le volet prioritaire ; le CDC les rend optionnelles sans justification ni entrée en §11.
- **Correction proposée :** passer REQ-022 en Must et la déplacer dans le périmètre prioritaire, ou ouvrir une entrée en §11 qui justifie le déclassement (par exemple, si les alertes sont surtout littorales, donc liées à la pêche : à rattacher à AMB-10).

### P-02 — Le trajet conseillé (Must) dépend d'un référentiel de critères classé Should
- **REQ-008 (Must)** : le trajet conseillé s'affiche « quand une règle de sécurité d'un sentier est déclenchée ».
- **R-06** : ces règles « figurent dans le référentiel des sentiers ».
- **REQ-023 (Should)** : les critères de chaque sentier du panel pilote sont consignés dans le référentiel et validés par le client.
- **Problème :** sans REQ-023, REQ-008 et REQ-029 (verdict, Must) n'ont pas de règles à appliquer. Une exigence Must ne peut pas reposer sur une exigence Should. Même dépendance pour l'objectif 2.
- **Correction proposée :** passer REQ-023 en Must (au moins pour le panel pilote). Le calendrier du 30/11/2026 de ZO-02 pourrait accueillir la validation des seuils (ZO-07).

### P-03 — Le CR contient encore un commentaire de l'équipe dans une réponse du client
- **CR-001/Q41, colonne Réponse :** « Modalité logistique interne non contractuelle (**à ne pas inscrire comme contrainte dans le CDC**) ».
- **Problème :** le journal du CR indique « commentaires de l'équipe […] retirés des réponses ». Cette consigne de rédaction n'est pas une parole du client.
- **Effet de bord :** le CDC s'appuie quand même sur Q41 pour construire INC-11 et en tirer une organisation des vérifications (REQ-101, REQ-109). Il faut soit que Q41 soit une réponse du client exploitable, soit qu'elle ne soit pas citée.
- **Correction proposée :** dans le CR, garder seulement « Poste de développement local (`localhost`) » et déplacer la remarque sous le tableau, en note de l'équipe. Dans le CDC, INC-11 peut garder Q41 comme source.

---

## 3. Points moyens

### M-01 — Q30 : réponse contradictoire
« Non défini à ce stade. Le Trail est sécurisé en priorité ; le volet Pêche est intégré si le calendrier le permet. » La réponse dit à la fois que rien n'est défini et donne une règle. Le CDC s'appuie sur la seconde partie pour tout le périmètre « si le calendrier le permet ».
→ Préciser dans le CR ce que le client a réellement dit, et garder INC-01 ouvert en conséquence (c'est déjà le cas).

### M-02 — CR §1 tranche la randonnée, CR §3 et le CDC la laissent ouverte
- CR §1, l. 34 : « tracés de rando » (le périmètre est limité au trail et à la pêche en Q05) — formulé comme une réponse.
- CR §3 n° 5 et CDC AMB-14 : question ouverte.
→ Dans le CR §1, écrire « voir Q05 et §3 n° 5 » plutôt que de présenter le point comme résolu.

### M-03 — Le contexte du CDC présente une prémisse de l'équipe comme un fait du client
CDC §1 : « L'ONF décide […] mais ces décisions ne sont pas toujours publiées sous une forme exploitable automatiquement (*CR-001/Q36*) ». Cette affirmation figure dans la **question** Q36, rédigée par l'équipe ; la réponse du client n'en dit rien. Même chose, dans une moindre mesure, pour les microclimats (prémisse de la question Q38).
→ Ajouter la mention *(connaissance extérieure au CR)*, comme pour ZO-11 et AMB-18.

### M-04 — Hors périmètre décidé par l'équipe sans le dire
CDC §6, hors périmètre : « Abris, gîtes et échappatoires — Non évoqués par le client — CR-001/Q17 ». Un sujet que le client n'a pas évoqué n'est pas écarté par lui : c'est une zone d'ombre. INC-08 la traite d'ailleurs déjà comme une question ouverte.
→ Marquer la ligne *(hypothèse, ⚠ INC-08)*.

### M-05 — Le verdict hors panel pilote n'est pas défini
INC-09 : itinéraire, météo et `.gpx` sont disponibles sur tous les sentiers officiels, le trajet conseillé seulement sur le panel. Mais REQ-029 (verdict favorable / défavorable, Must) repose sur les règles du sentier (Q34) et sur la grille générale (ZO-17). Hors panel, on ne sait pas si le verdict s'affiche (grille générale seule ?) ou non.
→ Compléter l'hypothèse de INC-09 ou de ZO-17.

### M-06 — Échéance interne transformée en critère de recette
L'objectif 7 exige une démonstration « validée par le client à l'échéance du 09/12/2026 ». Or le client a donné 3 semaines (14/12/2026) ; le 09/12 est une date de planning de l'équipe (ZO-03, C-27). Le CR §5 reprend aussi le 09/12 comme si c'était l'échéance du client.
→ Dans l'objectif 7 et le CR §5, écrire « dans le délai de 3 semaines (14/12/2026) ; jalon interne de l'équipe : 09/12/2026 ».

---

## 4. Remarques mineures

| # | Emplacement | Constat | Suggestion |
|---|---|---|---|
| m-01 | CDC, en-tête | « Sources : `docs/cr/cr-001.md` » alors que le fichier est dans `tdd/docs/cr/` | Indiquer le chemin depuis la racine du dépôt |
| m-02 | CDC, en-tête | « v1 — corrigée le 23/11/2026 » : 29 corrections sans changement de version | Passer en v1.1 et l'ajouter au tableau §12 |
| m-03 | CDC INC-11 | REQ-110 est classée parmi les « vérifications sur smartphone » alors qu'elle porte sur l'import `.gpx` sur montres / GPS | Retirer REQ-110 de la liste ou écrire « sur appareils de test » |
| m-04 | CDC REQ-015 | « compte sécurisé » n'a pas d'exigence non fonctionnelle vérifiable | Ajouter une NFR (protection des mots de passe, verrouillage après échecs…) ou une zone d'ombre |
| m-05 | CDC REQ-017 / INC-04 | L'hypothèse dit que le classement des sports est conservé « pour ne pas devoir modifier le profil plus tard », mais REQ-017 est Should | Harmoniser : soit Must, soit retirer la justification |
| m-06 | CR §4 | La reformulation n'évoque ni la suggestion de trace par distance (40/50 km, REQ-010), ni la difficulté, ni l'indication de conditions favorables (besoin n° 2) | Ajouter une ligne à §4.1 pour que la reformulation couvre tous les besoins du §1 |
| m-07 | CR §5 ↔ CDC §11 | Les priorités ne coïncident pas : CR §5 ajoute AMB-14, AMB-15, ZO-07, ZO-26 absents de la liste « à trancher en priorité » du CDC | Aligner les deux listes |

---

## 5. Vérifications sans anomalie

- **Couverture CR → CDC :** les 42 questions sont citées ; les citations du client du §1 (La Possession → Mafate, préférences, créneau à Saint-Paul) sont reprises dans le contexte et les personas.
- **Correspondance CR §3 → CDC §11 :** les 18 sujets non abordés du CR ont chacun une entrée en §11 (ZO-01, INC-02, AMB-13 à AMB-18, ZO-08, ZO-09, ZO-17, ZO-19 à ZO-24, ZO-26, ZO-27).
- **Hypothèses signalées :** les éléments déduits ou externes sont bien marqués *(hypothèse)*, *(déduit)* ou *(connaissance extérieure au CR)*, sauf les cas de M-03 et M-04.
- **Règles métier ↔ exigences :** R-09 ↔ REQ-014, R-11 ↔ REQ-026, R-12 ↔ REQ-028, R-13 ↔ REQ-018, R-14 ↔ REQ-020, R-15 ↔ REQ-027 : renvois cohérents.
- **Dates :** 23/11/2026 + 3 semaines = 14/12/2026, comme indiqué en ZO-03.
- **Journal des corrections :** les trois rapports cités en §13 existent dans `collab/`.

---

## 6. Actions proposées avant présentation au client

1. **CDC :** REQ-022 et REQ-023 en Must, ou justification du déclassement en §11 (P-01, P-02).
2. **CR :** retirer la consigne de l'équipe de la réponse Q41 (P-03) ; clarifier Q30 (M-01) et la mention « rando » du §1 (M-02).
3. **CDC :** marquer les prémisses externes du §1 (M-03) et la ligne « abris » du hors périmètre (M-04).
4. **CDC :** compléter INC-09 / ZO-17 pour le verdict hors panel (M-05).
5. **CDC + CR :** distinguer l'échéance client (14/12) du jalon interne (09/12) (M-06).
6. Traiter les remarques mineures m-01 à m-07, puis passer le CDC en v1.1.
