# Rapport de cohérence — CR-001 et CDC v1

**Auteur :** relecture assistée (demandée par Maxime)
**Date :** 23/11/2026
**Documents comparés :** `tdd/docs/cr/cr-001.md` (CR) et `tdd/docs/cdc/cahier-des-charges-v1.md` (CDC, corrigé le 23/11/2026)
**Méthode :** chaque réponse du CR (Q01 à Q42) a été recherchée dans le CDC, puis chaque exigence du CDC a été rapprochée de sa source. Le rapport ne liste que ce que le CDC §11 ne traite pas déjà (INC-01 à 11, AMB-01 à 18, ZO-01 à 30), ou ce qui est faux ou contradictoire.

Les identifiants proposés (INC-12, AMB-19, ZO-31…) prolongent la numérotation du CDC §11.

---

## 0. Verdict

- **Couverture :** les 42 questions du CR sont reprises dans le CDC. Seule Q41 est volontairement absente (« à ne pas inscrire comme contrainte dans le CDC »). Aucune exigence n'est sans source.
- **Cohérence des listes :** les Must / Should / Could du §6 correspondent aux tables du §9. Les 18 sujets du CR §3 ont chacun un équivalent en §11.
- **Dates :** 23/11/2026 + 3 semaines = 14/12/2026. Le CDC le signale (ZO-03).
- **À corriger :** 7 incohérences nouvelles, 10 ambiguïtés nouvelles, 6 zones d'ombre nouvelles, plus 2 problèmes de provenance des sources.
- **À trancher en premier :** AMB-19 (le « tracé GPX » de Q06), INC-12 et INC-13 (priorités), ZO-31 (source de l'état des sentiers).

---

## 1. Incohérences nouvelles

| # | Constat | Source | Hypothèse ou correction proposée |
|---|---|---|---|
| **INC-12** | **Q30 est étendue à tort.** Q30 ne porte que sur la pêche : « Le Trail est sécurisé en priorité ; le volet Pêche est intégré si le calendrier le permet ». Le CDC §6 range sous « si le calendrier le permet (Q30) » des exigences trail : REQ-009 (explications), REQ-010 (suggestion de trace), REQ-014 (points d'eau), REQ-017 (sports favoris), REQ-022 et REQ-023 (alertes, seuils). Ce classement est un choix de l'équipe que Q30 ne justifie pas. | CR Q30 ; CDC §6, §9 | Retirer « Q30 » de la citation pour ces exigences et marquer leur priorité *(hypothèse)*. |
| **INC-13** | **Des Must dépendent d'un Should.** REQ-008 (trajet conseillé) et REQ-029 (verdict favorable ou non) sont Must et reposent sur les règles propres à chaque sentier. Le référentiel de ces règles est REQ-023, en Should. Sans seuils, les deux Must ne sont pas livrables. | CDC REQ-008, REQ-029, REQ-023 ; CR Q34, Q40 | Passer REQ-023 en Must pour le panel pilote (3 parcours), ou rétrograder REQ-008 et REQ-029. |
| **INC-14** | **Q41 est contournée.** Q41 dit que la démonstration sur `localhost` est « non contractuelle, à ne pas inscrire dans le CDC ». INC-11 s'appuie pourtant sur Q41 pour sortir les vérifications smartphone de la démonstration (REQ-101, 109, 110). REQ-015 (données retrouvées sur plusieurs appareils) n'est pas citée dans INC-11, alors qu'elle est invérifiable avec un seul poste local. | CR Q41 ; CDC INC-11, REQ-015 | Reformuler INC-11 sans citer Q41 comme source. Ajouter REQ-015 aux vérifications faites par l'équipe, et dire comment elle sera recettée. |
| **INC-15** | **INC-05 est contredit par REQ-029 et REQ-009.** L'hypothèse d'INC-05 est « seules les prévisions sont affichées », et l'historique météo est hors périmètre. Mais REQ-029 affiche « quels critères posent problème » et REQ-009 explique le verdict. Si le critère est une pluie cumulée (radiers, ravines, Q34), l'utilisateur voit de l'historique. | CDC INC-05, REQ-029, REQ-009, §6 hors périmètre ; CR Q13, Q34 | Préciser que la pluie passée peut être citée comme critère, sans afficher de série d'historique. |
| **INC-16** | **REQ-026 est plus large que R-11.** REQ-026 dit « toute recommandation sur la côte ouest » (donc aussi une recommandation trail, via REQ-028). R-11 limite l'alerte à la pêche et à la chasse sous-marine. | CDC REQ-026, R-11, AMB-17 ; CR Q32 | Aligner REQ-026 sur R-11. |
| **INC-17** | **Le CR n'est plus une source pure.** Le CR est la trace de l'entretien et la source du CDC. Or son §3 et son §5 citent des identifiants du CDC (INC-03, ZO-18…) et la date du 09/12/2026, qui est une décision d'équipe (C-27) et non une parole du client. Les priorités diffèrent aussi : le CDC §11 liste 11 points « à trancher en priorité », le CR §5 en ajoute 4 (AMB-14, AMB-15, ZO-07, ZO-26). Le CR §3 n'inclut pas ZO-05 ni ZO-07, que le §5 reprend. | CR §3, §5 ; CDC §11 | Retirer les renvois au CDC et la date du 09/12 du CR, ou le dire en tête de ces sections. Aligner les deux listes de priorités. |
| **INC-18** | **Le journal C-13 et le CR ne concordent pas.** C-13 dit que « la mention du créneau au §1 du CR n'était pas dans les propos du client ». Le CR actuel cite pourtant « J'ai un créneau d'une heure pour pêcher sur Saint-Paul » en verbatim (§1 et Q12). | CDC C-13 ; CR §1, Q12 | Vérifier avec les notes d'entretien, puis corriger C-13 ou le CR. |

---

## 2. Ambiguïtés nouvelles

| # | Constat | Source | Hypothèse proposée |
|---|---|---|---|
| **AMB-19** | **Q06 : « le tracé GPX ».** La question opposait « le GPX sur mesure » aux autres options. Le client répond « le trail, avec le tracé GPX et les conseils d'équipement ». Cela peut vouloir dire l'**export** `.gpx` (lecture actuelle du CDC) ou la **trace sur mesure** (REQ-010, aujourd'hui Should). C'est le point le plus lourd : la seule demande concrète citée par le client est « une suggestion de trace d'environ 40/50 km jusqu'à Mafate ». | CR §1, Q06 ; CDC REQ-010, REQ-011 | À faire trancher en priorité. À défaut, REQ-010 passe en Must, limité au panel pilote. |
| **AMB-20** | **« Sentier officiel balisé » n'est défini nulle part** (Q16, R-01, REQ-003). Quelle liste fait foi (ONF, plan départemental…) ? « Officiel » et « ouvert » sont-ils distincts ? Le réseau doit venir d'une source libre (Q28) : sa complétude et la possibilité d'y repérer « balisé » sont inconnues. | CR Q16, Q28 ; CDC R-01, REQ-003 | Réseau = sentiers de la source retenue, liste documentée dans REQ-113. |
| **AMB-21** | **« Côte ouest » n'est pas délimitée** (Q32, R-11, REQ-026). Quelles communes déclenchent l'alerte Réserve marine ? | CR Q32 ; CDC R-11 | Liste de communes paramétrable, validée par le client. |
| **AMB-22** | **« Balises » (Q38, REQ-108).** Balises météo (stations) ou balisage des sentiers ? Le CDC reprend le mot sans trancher. | CR Q38 ; CDC REQ-108 | À demander au client. |
| **AMB-23** | **Q27 : « pas de mode hors ligne *complexe* ».** Le qualificatif laisse la place à un mode simple (récapitulatif, checklist), que la question Q27 proposait. Le CDC écarte tout hors ligne (§6 hors périmètre). La checklist d'équipement et les quantités d'eau seraient pourtant utiles en zone blanche. Q01 dit « possibilité de PWA », Q27 « PWA retenue ». | CR Q01, Q27 ; CDC §6, REQ-101, REQ-109 | À confirmer : le récapitulatif est-il consultable hors ligne ? |
| **AMB-24** | **§1 : « adapte l'itinéraire aux conditions météo *réelles* ».** Les conditions réelles sont-elles des observations ou des prévisions (Q13, Q14) ? « Adapter » veut-il dire seulement changer de tracé (REQ-008) ou aussi proposer un autre horaire de départ ? | CR §1, Q13, Q14 | Prévisions uniquement, changement de tracé uniquement. |
| **AMB-25** | **« Niveau » (Q21 ; §1 « itinéraires selon le niveau »).** Aucun document ne dit comment le niveau se déduit du profil, ni comment l'âge, le poids et la taille entrent dans les calculs. REQ-010 et la persona Sarah en dépendent. | CR §1, Q21 ; CDC REQ-010, REQ-013 | Niveau dérivé de la VMA, avec des paliers fixes validés (voir ZO-05). |
| **AMB-26** | **Q28 : « *objectif* 0 € ».** Le CDC en fait une contrainte ferme (« Aucun coût récurrent », REQ-102). Une source payante indispensable serait-elle refusée ou rediscutée ? | CR Q28 ; CDC §7 C2, REQ-102 | À préciser avec ZO-15. |
| **AMB-27** | **Q11 : « en tenant compte des préférences de l'utilisateur ».** REQ-028 n'utilise que le classement des sports (et le temps, le départ). Les « préférences » peuvent couvrir d'autres éléments du profil. | CR Q11 ; CDC REQ-028, R-12 | Classement des sports seulement. |
| **AMB-28** | **Q24 : consentement « à l'inscription ».** REQ-018 dit « avant toute saisie de données de forme physique ». Ce n'est pas équivalent si le profil se remplit après l'inscription. | CR Q24 ; CDC REQ-018, R-13 | Consentement à l'inscription, re-demandé s'il est absent. |

---

## 3. Zones d'ombre nouvelles

| # | Sujet non abordé | Source | Hypothèse proposée |
|---|---|---|---|
| **ZO-31** | **Source de l'état des sentiers.** REQ-003 et REQ-004 (Must) supposent une source automatique pour le réseau et l'état des sentiers (Q36 : « données automatisées »). Si aucune source gratuite exploitable n'existe, l'administrateur devient la seule source, ce qui pèse sur ZO-08 (sans budget). | CR Q25, Q36 ; CDC REQ-003, REQ-004 | Source à identifier avant tout développement. À défaut, état saisi à la main par l'administrateur. |
| **ZO-32** | **Source d'historique de pluie.** INC-05, Q31 et Q34 exigent des pluies récentes (24 à 48 h). ZO-15 ne couvre que houle, marées et solunaire. | CR Q31, Q34 ; CDC INC-05, ZO-15 | Même traitement que ZO-15 : critère retiré et signalé si la source n'est pas gratuite. |
| **ZO-33** | **Compte obligatoire non traduit en exigence.** ZO-10 est retirée et son hypothèse (« compte obligatoire pour toute utilisation ») n'est reprise dans aucune REQ ni règle. | CR Q23 ; CDC ZO-10, REQ-015 | Ajouter une règle R ou une REQ. |
| **ZO-34** | **Nature des données.** Q24 parle de données « de forme physique et de santé ». Poids, âge et VMA peuvent relever de données de santé (RGPD, art. 9) *(connaissance extérieure au CR)*. | CR Q24 ; CDC ZO-12, ZO-26 | À traiter avec ZO-12 et ZO-26. |
| **ZO-35** | **Créneau de pêche et trajet.** Le créneau d'une heure (Q12) inclut-il le trajet depuis le point de départ vers le secteur ? | CR Q12 ; CDC REQ-025 | Créneau = durée sur place, trajet en plus. |
| **ZO-36** | **Faisabilité.** 18 exigences fonctionnelles Must (compte, RGPD, administration, routage, météo horaire, GPX…) pour 3 personnes en 3 semaines, sans estimation de charge. Q30 signale le risque, mais le CDC ne l'évalue pas. | CR Q07, Q30 ; CDC §6, §9 | Chiffrer la charge avant de présenter le CDC. |

---

## 4. Provenance des sources

Ces deux points ne changent pas le fond, mais ils affaiblissent la valeur du renvoi « CR-001/Qnn ».

1. **Faits de terrain tirés de nos propres questions.** Les microclimats (CDC §1 et C7, cités avec Q15 et Q38), l'état des sentiers de l'ONF (Q36), l'absence de réseau à Mafate (Q27) et les points d'eau issus d'OpenStreetMap (Q35) figurent dans le libellé des **questions de l'équipe**, pas dans les réponses du client. Le CDC les cite comme « CR-001/Qnn » comme si le client les avait dits. À marquer *(déduit)* ou *(connaissance extérieure au CR)*.
2. **Réponses du CR qui contiennent du raisonnement d'équipe.** Exemples : Q20 « pour simplifier l'inscription et limiter la gestion RGPD », Q27 « PWA retenue pour l'ergonomie mobile », Q21 « formules… éprouvées ». Le tableau est censé contenir les réponses du client, et le CDC les prend comme telles. À vérifier avec les notes d'entretien.

---

## 5. Actions proposées

| Priorité | Action | Réf. |
|---|---|---|
| 1 | Faire trancher le « tracé GPX » de Q06 avant la présentation du CDC | AMB-19 |
| 1 | Corriger le classement des priorités (Q30 mal citée, Must dépendants d'un Should) | INC-12, INC-13 |
| 1 | Identifier la source de l'état des sentiers et de l'historique de pluie | ZO-31, ZO-32 |
| 2 | Retirer du CR les renvois au CDC et la date du 09/12 ; aligner les priorités du §5 et du §11 | INC-17 |
| 2 | Reformuler INC-11 (sans Q41) et couvrir REQ-015 | INC-14 |
| 2 | Aligner REQ-026 sur R-11, préciser la pluie passée dans REQ-029 et REQ-009 | INC-15, INC-16 |
| 2 | Définir « sentier officiel balisé », « côte ouest », « balises » | AMB-20, AMB-21, AMB-22 |
| 3 | Ajouter ces points au CDC §11 et au journal des corrections (C-30 et suivants) | tous |
| 3 | Marquer les faits issus des questions de l'équipe et vérifier les réponses du CR avec les notes | §4 |
