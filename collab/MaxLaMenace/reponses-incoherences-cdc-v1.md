# Réponses aux incohérences du CDC v1 (section 11.1)

**Auteur :** Maxime
**Date :** 24/11/2026
**Document concerné :** `tdd/docs/cdc/cahier-des-charges-v1.md`, section 11.1
**Sources :** `tdd/docs/cr/cr-001.md`

Ce fichier consigne les décisions prises pour lever les 11 incohérences de la section 11.1. Il n'a pas encore été reporté dans le CDC. Ces décisions viennent de l'équipe : le client ne les a pas encore validées (voir « Écarts avec le CR-001 »).

---

## 1. Décisions

| # | Constat (résumé) | Décision | Justification |
|---|---|---|---|
| INC-01 | Q06 et Q30 hiérarchisent trail et pêche, mais le premier besoin du client est de savoir « quel sport est le plus propice ». | **Tout est en Must** : trail, pêche, comparaison, suggestion de trace, classement des sports. **Le délai de 3 semaines n'est pas une donnée du CDC** : c'est un facteur externe, traité au planning. | Le CDC décrit le besoin, pas le calendrier. |
| INC-02 | « Trajet conseillé par l'IA » (§1) contre formules fixes (Q21) et 0 € d'API (Q28). | Les calculs et le trajet conseillé reposent sur des **règles fixes**. L'**IA rédige les synthèses textuelles** en langage naturel, à condition d'être gratuite. | Q21 réserve l'IA aux synthèses textuelles. Q34 définit le trajet conseillé par des règles par sentier. Q28 impose 0 € d'API. |
| INC-03 | Application publique et multi-appareils (Q03, Q23) contre démonstration locale d'abord (Q37). | Le livrable est une **démonstration fonctionnelle en local**. La mise en ligne publique est une décision ultérieure. | Q37. |
| INC-04 | Profil limité à 4 données (Q20) contre classement des sports (Q39). | Profil = **âge, poids, taille, VMA + classement des sports favoris**. Date, heure, temps disponible et point de départ sont saisis à chaque recherche, hors profil. | Q39 répond « Oui » à l'ajout, après Q20. |
| INC-05 | « Météo sur les derniers jours » (§1) et prévisions (Q13), alors que Q31 et Q34 ont besoin des pluies récentes. | Aucun historique météo affiché. Les **pluies récentes sont un critère interne**, citable dans le verdict et les explications. Si aucune source gratuite n'existe (ZO-32), le critère est retiré et ce retrait est signalé. | Q13 exclut l'historique. Q31 et Q34 l'utilisent comme critère de calcul. |
| INC-06 | Aucune extrapolation hasardeuse (Q26) contre estimation de la clarté de l'eau (Q31). | Une **estimation est permise si elle est étiquetée comme telle**. Si la donnée de pluie est indisponible, l'application affiche « indisponible » et n'estime rien. | Q26 vise le remplacement d'une donnée manquante. Q31 demande explicitement une estimation. |
| INC-07 | Q10 demande Réserve marine et risque requin. Q32 ne parle que de la Réserve pour la côte ouest. | Les alertes sont un **mécanisme générique**. Une alerte est rattachée à **une ou plusieurs activités précises**, choisies **une par une** par l'administrateur. Requin et Réserve marine ne sont que des exemples d'alertes. | Décision de l'équipe. Elle remplace les règles figées R-11 et R-15. |
| INC-08 | Nombre de jours au choix (Q18), sans gîtes ni abris (Q17), prévisions limitées. | Le **nombre de jours est libre**. La durée est calculée **en continu, sans pauses ni gîtes**. La météo est celle des **prévisions lues à la demande du trajet**, appliquées à l'heure de passage estimée. Aucun hébergement proposé. | Q18, Q17. Les prévisions suivent Q13 et Q15. |
| INC-09 | Départ et arrivée libres (Q18) contre règles calibrées sur le panel pilote (Q40). | **Itinéraire, météo et `.gpx` sur tous les sentiers officiels.** Le **trajet conseillé n'existe que sur le panel pilote**, avec un message ailleurs. Hors panel, le verdict est **plafonné à « indicatif, sentier non calibré »**, jamais un « favorable » sans réserve. | Q40 valide un calibrage restreint. Le plafonnement évite un faux sentiment de sécurité. |
| INC-10 | Météo heure par heure (Q15) contre découpage par zones (Q38). | **Heure par heure, par zone.** Chaque tronçon reçoit la météo de la zone qu'il traverse, à l'heure estimée de passage. Découpage paramétrable. | Q15 fixe la résolution temporelle, Q38 la résolution spatiale. |
| INC-11 | Démonstration locale (Q37) contre application orientée smartphone et compte multi-appareils (Q01, Q23). | **Démonstration en localhost.** L'équipe teste l'usage smartphone, le même compte sur plusieurs appareils et l'import du `.gpx` sur ses appareils de test, puis présente les résultats au client. | Q41 : localhost, modalité interne non contractuelle. |

---

## 2. Modèle d'activité (issu d'INC-07)

- Il y a **deux types d'activité** : trail et pêche.
- Une **activité** est un lieu précis. Pour le trail, c'est un sentier ou un parcours. Pour la pêche, c'est un spot (exemple : la jetée de Saint-Pierre).
- Une alerte est rattachée à une ou plusieurs activités, **sans notion de secteur à part**.
- Conséquence : AMB-05 est réglée. La recommandation de pêche porte sur un **spot précis**, pas sur une commune. Il faut donc un référentiel des spots de pêche, comme celui des sentiers.

---

## 3. Conséquences à reporter dans le CDC

**Priorités (INC-01)**
- Passer en Must : REQ-009, REQ-010, REQ-014, REQ-017, REQ-024 à REQ-028, REQ-030.
- Retirer les sous-titres « volet trail secondaire » et « volet pêche et comparaison, si le calendrier le permet » (§6, §9).
- REQ-112 (volet pêche indépendant du trail) n'a plus de raison d'être.
- Réécrire INC-01 et retirer ZO-35 (charge et faisabilité, à traiter au planning).

**Délai hors CDC (INC-01, INC-03)**
- À retirer ou déplacer vers un planning : ligne 1 du §1, objectif 7, contrainte 1 du §7, ZO-02 (partie échéance), ZO-03, dates de REQ-111, C-27 et C-34.
- Décision restante : le CDC garde-t-il la mention « démonstration locale » sans date ?

**Alertes et modèle d'activité (INC-07)**
- Remplacer R-11 et R-15 par une règle générale : une alerte rattachée à des activités précises s'affiche avec toute recommandation de ces activités.
- Réécrire REQ-022 (l'administrateur crée, modifie, retire les alertes et les rattache à des activités) et REQ-026, REQ-027.
- Clore AMB-10, AMB-17, AMB-18, AMB-21 et ZO-11, ou les reformuler comme des cas d'usage d'alertes.
- Reprendre AMB-05, REQ-024, REQ-025 et ZO-22 avec la notion de spot précis. La question « pêche du bord et chasse sous-marine » est à relire : sont-elles des activités de type pêche, ou des pratiques distinctes ?
- Ajouter le référentiel des spots de pêche au périmètre (REQ-023 ne couvre que les sentiers).

**Multi-jours (INC-08)**
- Fusionner REQ-030 dans REQ-002.
- Retirer ZO-19 (heures d'étape), puisque la durée est continue.
- Reformuler INC-08 : la scission journée / multi-jours n'existe plus.

**Profil, météo, verdict**
- INC-04 : mettre à jour le texte du hors périmètre sur les données de profil (déjà cohérent).
- INC-05 : conserver la mention de ZO-32 dans REQ-029.
- INC-09 : ajouter le plafond « indicatif, sentier non calibré » à REQ-029, et définir le panel pilote en **sentiers** et non en itinéraires.
- INC-10 : aucun changement, l'hypothèse actuelle (R-03, REQ-007) est confirmée.
- INC-11 : aucun changement, l'hypothèse actuelle (REQ-101, 109, 110) est confirmée.

**Journal des corrections**
- Ajouter les corrections C-48 et suivantes à la section 13.

---

## 4. Écarts avec le CR-001 à faire valider par le client

- **Q30** conditionne la pêche au calendrier (« si le calendrier de 3 semaines le permet »). Le passage de tout en Must demande au client plus que ce qu'il a dit.
- **Q07** cite le délai de 3 semaines. Le sortir du CDC est un choix de structure : il doit rester tracé dans le planning.
- **Q32** limitait l'alerte Réserve marine à la côte ouest. Les alertes par activité précise remplacent ce périmètre géographique sans le contredire, mais il faut vérifier que la Réserve marine est bien rattachée à tous les spots concernés.
- **INC-02** : le client doit confirmer que l'IA ne sert qu'à rédiger des synthèses, avec des règles fixes pour le reste.
