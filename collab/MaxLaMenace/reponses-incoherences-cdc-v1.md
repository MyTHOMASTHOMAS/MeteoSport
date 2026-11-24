# Réponses aux incohérences du CDC v1 (section 11.1)

**Auteur :** Maxime  
**Date :** 24/11/2026  
**Document concerné :** `tdd/docs/cdc/cahier-des-charges-v1.md`, section 11.1  
**Sources :** `tdd/docs/cr/cr-001.md`

Ce fichier consigne les décisions prises pour lever les 11 incohérences de la section 11.1. Il n'a pas encore été reporté dans le CDC.

### Arbitrage équipe (24/11/2026)

| Sujet | Décision retenue |
|---|---|
| Délai 3 semaines | **Hors CDC** — traité au planning |
| Priorités | **Tout en Must** |
| Prévisions météo | **3 jours affichés** |
| Multi-jours / étapes | **Option la plus simple** : recherche bornée à aujourd'hui ; pas de gestion d'étapes multi-jours |
| Pêche | **Solution Thomas** : type unique « Spot de pêche », GPS précis, pas de sous-techniques |
| Pluies récentes | **Historique constitué en interne** à partir des appels météo |

---

## 1. Décisions

| # | Constat (résumé) | Décision | Justification |
|---|---|---|---|
| INC-01 | Q06 et Q30 hiérarchisent trail et pêche, mais le premier besoin du client est de savoir « quel sport est le plus propice ». | **Tout est en Must** : trail, pêche, comparaison, suggestion de trace, classement des sports. **Le délai de 3 semaines n'est pas une donnée du CDC** : c'est un facteur externe, traité au planning. | Arbitrage équipe 24/11. Le CDC décrit le besoin, pas le calendrier. |
| INC-02 | « Trajet conseillé par l'IA » (§1) contre formules fixes (Q21) et 0 € d'API (Q28). | Les calculs et le trajet conseillé reposent sur des **règles fixes**. L'**IA rédige les synthèses textuelles** en langage naturel, à condition d'être gratuite. | Q21 réserve l'IA aux synthèses textuelles. Q34 définit le trajet conseillé par des règles par sentier. Q28 impose 0 € d'API. |
| INC-03 | Application publique et multi-appareils (Q03, Q23) contre démonstration locale d'abord (Q37). | Le livrable est une **démonstration fonctionnelle en local**. La mise en ligne publique est une décision ultérieure. Aucune date d'échéance dans le CDC. | Q37. Délai hors CDC. |
| INC-04 | Profil limité à 4 données (Q20) contre classement des sports (Q39). | Profil = **âge, poids, taille, VMA + classement des sports favoris**. Date, heure, temps disponible et point de départ sont saisis à chaque recherche, hors profil. | Q39 répond « Oui » à l'ajout, après Q20. |
| INC-05 | « Météo sur les derniers jours » (§1) et prévisions (Q13), alors que Q31 et Q34 ont besoin des pluies récentes. | Aucun historique météo **affiché** à l'utilisateur. Les **pluies récentes sont un critère interne**. L'historique est **constitué en interne** en conservant les données des appels aux sources météo gratuites (ZO-32). | Q13 exclut l'historique affiché. Q31 / Q34 l'utilisent en calcul. Arbitrage équipe : constitution interne. |
| INC-06 | Aucune extrapolation hasardeuse (Q26) contre estimation de la clarté de l'eau (Q31). | Une **estimation est permise si elle est étiquetée comme telle**. Si la donnée de pluie est indisponible, l'application affiche « indisponible » et n'estime rien. | Q26 vise le remplacement d'une donnée manquante. Q31 demande explicitement une estimation. |
| INC-07 | Q10 demande Réserve marine et risque requin. Q32 ne parle que de la Réserve pour la côte ouest. | Les alertes sont un **mécanisme générique**. Une alerte est rattachée à **une ou plusieurs activités précises** (sentier ou spot de pêche), choisies **une par une** par l'administrateur. Requin et Réserve marine ne sont que des exemples. | Aligné AMB-10 / AMB-17 / AMB-18. Remplace R-11 et R-15. |
| INC-08 | Nombre de jours au choix (Q18), sans gîtes ni abris (Q17), prévisions limitées. | **Option la plus simple :** la recherche et la recommandation d'activité sont bornées à **aujourd'hui**. Les **prévisions météo sont affichées sur 3 jours** (J à J+2). Pas de parcours multi-jours ni d'étapes / gîtes. | Arbitrage équipe 24/11 (simplicité + AMB-02 / AMB-07). |
| INC-09 | Départ et arrivée libres (Q18) contre règles calibrées sur le panel pilote (Q40). | **Itinéraire, météo et `.gpx` sur tous les sentiers officiels.** Le **trajet conseillé n'existe que sur le panel pilote** (3 parcours fermés). Hors panel : message simple, verdict plafonné à « indicatif, sentier non calibré ». | Option la plus simple pour la sécurité. Aligné AMB-09. |
| INC-10 | Météo heure par heure (Q15) contre découpage par zones (Q38). | **Heure par heure, par zone.** Chaque tronçon reçoit la météo de la zone qu'il traverse, à l'heure estimée de passage. Découpage paramétrable. Horizon affiché : **3 jours**. | Q15 + Q38 + AMB-07. |
| INC-11 | Démonstration locale (Q37) contre application orientée smartphone et compte multi-appareils (Q01, Q23). | **Démonstration en localhost.** L'équipe teste l'usage smartphone, le même compte sur plusieurs appareils et l'import du `.gpx` sur ses appareils de test, puis présente les résultats au client. | Q41 : localhost, modalité interne non contractuelle. |

---

## 2. Modèle d'activité (issu d'INC-07 + solution pêche Thomas)

- **Deux types d'activité** : trail (inclut randonneurs, AMB-14) et pêche.
- Une **activité** est un lieu précis : sentier / parcours pour le trail ; **spot de pêche** (GPS précis) pour la pêche.
- **Pas de sous-techniques de pêche** (lancer, surfcasting, etc.) : une seule entité `Spot de pêche` (AMB-06).
- Une alerte est rattachée à une ou plusieurs activités, **sans notion de secteur géographique à part**.
- Conséquence : AMB-05 réglée — recommandation de pêche sur un **spot précis**. Référentiel des spots à ajouter au périmètre (comme les sentiers).

---

## 3. Conséquences à reporter dans le CDC

**Priorités (INC-01)**
- Passer en Must : REQ-009, REQ-010, REQ-014, REQ-017, REQ-024 à REQ-028 (et tout autre Should lié à ces volets).
- Retirer les sous-titres « volet trail secondaire » et « volet pêche et comparaison, si le calendrier le permet » (§6, §9).
- REQ-112 (volet pêche indépendant du trail) n'a plus de raison d'être.
- Réécrire INC-01. **ZO-35** (charge / faisabilité 3 semaines) → **hors CDC**, à traiter au planning.

**Délai hors CDC (INC-01, INC-03)**
- À retirer ou déplacer vers un planning : ligne 1 du §1, objectif 7, contrainte 1 du §7, ZO-02 (partie échéance), ZO-03, dates de REQ-111, C-27 et C-34.
- Le CDC conserve « démonstration locale » **sans date**.

**Alertes et modèle d'activité (INC-07)**
- Remplacer R-11 et R-15 par une règle générale d'alertes rattachées à des activités précises.
- Réécrire REQ-022, REQ-026, REQ-027.
- Clore AMB-10, AMB-17, AMB-18, AMB-21 et ZO-11 comme cas d'usage d'alertes.
- Reprendre AMB-05, REQ-024, REQ-025 et ZO-22 avec **spot précis + type unique** (pas 3 pratiques).
- Ajouter le référentiel des spots de pêche au périmètre (REQ-023 ne couvre que les sentiers).

**Horizon temporel (INC-08) — simplifié**
- Recherche / recommandation = **aujourd'hui** (AMB-02).
- Affichage des prévisions = **3 jours** (AMB-07).
- Pas de multi-jours ni d'étapes : **retirer ou reformuler ZO-19** ; ne pas fusionner un REQ multi-jours complexe.
- Reformuler INC-08 en conséquence.

**Profil, météo, verdict**
- INC-04 : hors périmètre profil déjà cohérent.
- INC-05 / ZO-32 : **constituer l'historique de pluie en interne** ; citer ce mécanisme dans REQ-029.
- INC-09 : plafond « indicatif, sentier non calibré » dans REQ-029 ; panel pilote = **3 parcours fermés** (AMB-09).
- INC-10 / INC-11 : hypothèses actuelles confirmées.

**Journal des corrections**
- Ajouter les corrections C-48 et suivantes à la section 13.

---

## 4. Écarts avec le CR-001 à faire valider par le client

- **Q30** conditionnait la pêche au calendrier. L'équipe a tranché **tout en Must** : à confirmer auprès du client.
- **Q07** cite le délai de 3 semaines. Sorti du CDC, il reste tracé dans le **planning**.
- **Q32** : alertes par activité précise — vérifier le rattachement Réserve marine aux spots concernés.
- **INC-02** : confirmer que l'IA ne sert qu'aux synthèses textuelles.
