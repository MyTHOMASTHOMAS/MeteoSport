# Cahier des charges — MeteoSport

**Équipe :** Maxime, Thomas, Ivan
**Version :** v1 — 23/11/2026
**Sources :** `docs/cr/cr-001.md` (entretien du 23/11/2026)

Ce document formalise le **problème compris**, pas la solution. Aucun nom de technologie, aucun nom de framework, aucune structure de base de données ici.

> **Statut :** brouillon, pas encore présenté au client.
> Le marqueur ⚠ renvoie à un point de la section 11 : une incohérence (`INC-nn`), une ambiguïté (`AMB-nn`) ou une zone d'ombre (`ZO-nn`). Tant que le client n'a pas tranché, c'est l'hypothèse indiquée en section 11 qui s'applique.

---

## 1. Contexte

Le client habite La Possession, à La Réunion, et pratique le trail. Il souhaite une application qui aide les pratiquants de **trail** et de **pêche** à décider quand et où sortir en fonction de la météo (*CR-001/§1*). L'application est destinée au **grand public**, pas seulement à son usage personnel (*CR-001/Q03*). Son nom et sa fonction restent à préciser (*CR-001, en-tête*).

Le terrain impose plusieurs contraintes :

- **Relief et microclimats.** Les conditions changent fortement entre le littoral, les hauts et les cirques, parfois à quelques kilomètres d'écart (*CR-001/Q38*).
- **Zones sans réseau.** Certains secteurs, comme le cirque de Mafate, n'ont pas de couverture mobile (*CR-001/Q27*).
- **État des sentiers.** L'ONF décide de l'ouverture ou de la fermeture des sentiers, mais ces décisions ne sont pas toujours publiées sous une forme exploitable automatiquement (*CR-001/Q36*).
- **Littoral réglementé.** La Réserve naturelle marine de La Réunion encadre la pêche sur une partie de la côte ouest, et le risque requin pèse sur les activités nautiques (*CR-001/Q10*).

Le projet doit être livré en **3 semaines**, **sans budget**, ni pour la réalisation ni pour l'exploitation (*CR-001/Q07, Q28*). Avant toute dépense de mise en ligne, le client veut voir l'application fonctionner en démonstration (*CR-001/Q37*).

---

## 2. Problème

Le CR-001 ne décrit pas comment le client prépare ses sorties aujourd'hui, ni avec quels outils (*CR-001/Q25* : « aucune source imposée »). Le problème ci-dessous est **déduit des besoins exprimés** et doit être confirmé (⚠ ZO-01).

Aujourd'hui, pour préparer une sortie, un pratiquant doit croiser lui-même des informations dispersées : prévisions météo, ouverture des sentiers, état de la mer. Il ne peut pas :

- savoir, pour un parcours donné, quel temps il fera à chaque endroit **au moment où il y passera** (*CR-001/Q15*) ;
- obtenir un itinéraire de remplacement plus sûr quand les conditions se dégradent sur son parcours (*CR-001/Q16*) ;
- savoir quel équipement, quelle quantité d'eau et quelle quantité de nourriture emporter selon son profil et la météo prévue (*CR-001/§1, Q21*) ;
- comparer les côtes de l'île pour la pêche, ni savoir quelle activité est la plus favorable ce jour-là (*CR-001/Q09, Q11*).

---

## 3. Objectifs

| # | Objectif | Comment on saura que c'est atteint |
|---|---|---|
| 1 | Préparer une sortie trail sur sentiers officiels en connaissant la météo le long du parcours | Pour un départ et une arrivée choisis sur le panel pilote, l'utilisateur obtient un itinéraire qui n'emprunte que des sentiers ouverts, avec la météo prévue sur chaque tronçon à l'heure estimée de passage (*CR-001/Q06, Q15, Q16, Q40*) |
| 2 | Proposer une solution plus sûre quand les conditions sont défavorables | Quand une règle de sécurité d'un sentier est déclenchée, un trajet conseillé sur sentiers balisés s'affiche à côté du trajet choisi (*CR-001/Q16, Q34*) |
| 3 | Emporter le bon équipement et les bonnes quantités | Pour un itinéraire validé, l'application affiche une liste d'équipement adaptée à la météo prévue et des quantités d'eau et de nourriture calculées à partir du profil (*CR-001/Q06, Q21*) |
| 4 | Suivre l'itinéraire sur sa montre | Le fichier `.gpx` téléchargé s'importe sans erreur sur les appareils de test retenus (*CR-001/Q19*, ⚠ ZO-14) |
| 5 | Choisir la côte la plus favorable pour pêcher | Pour une date, un créneau et un point de départ, l'application classe les secteurs côtiers avec un score argumenté (*CR-001/Q09, Q12*, ⚠ INC-01) |
| 6 | Savoir quelle activité est la plus propice | L'application affiche un score comparatif argumenté entre trail et pêche (*CR-001/Q11, Q33*, ⚠ INC-01) |
| 7 | Livrer dans le délai sans coût | Démonstration validée par le client à l'échéance des 3 semaines, et aucune dépense engagée (*CR-001/Q07, Q28, Q37*). Les critères de recette restent à définir (⚠ ZO-02) |

---

## 4. Parties prenantes

| Partie prenante | Rôle | Ce qu'elle attend | Utilise l'application ? |
|---|---|---|---|
| Client | Commanditaire du projet. Son identité, sa fonction et son pouvoir de validation restent à préciser (*CR-001/Q04*) | Une démonstration fonctionnelle sous 3 semaines, sans coût | oui (pratiquant de trail) |
| Pratiquants grand public | Utilisateurs finaux : traileurs, randonneurs, pêcheurs du bord, chasseurs sous-marins (*CR-001/Q03, Q08*) | Préparer leurs sorties en sécurité | oui |
| Administrateur | Corrige l'état des sentiers et gère les alertes (*CR-001/Q36, Q42*). On ne sait pas qui tiendra ce rôle après la livraison (⚠ ZO-08) | Pouvoir corriger rapidement une information erronée | oui (espace d'administration) |
| Équipe projet | Conçoit, réalise et livre l'application | Un périmètre stable et des critères de recette clairs | non |
| Producteurs de données (ONF, services météo, données marines) | Sources externes non imposées par le client (*CR-001/Q25*) | — | non |
| Autorités (Réserve naturelle marine, préfecture) | Fixent la réglementation du littoral (*CR-001/Q10*) | Respect de la réglementation | non |

---

## 5. Personas

Ces personas sont construits par l'équipe à partir du CR-001. Ils restent à valider avec le client.

### Julien — traileur confirmé *(inspiré du client)*
- **Contexte d'usage :** habite La Possession. Prépare depuis son smartphone, la veille ou le matin même, des sorties longues d'environ 40 à 50 km, par exemple vers Mafate. Court avec une montre GPS et n'a plus de réseau une fois dans le cirque (*CR-001/§1, Q27*).
- **Objectif :** obtenir un itinéraire sur sentiers ouverts, adapté à la météo prévue et à son niveau, le charger sur sa montre et savoir quoi emporter.
- **Ce qui le bloque aujourd'hui :** il doit croiser lui-même la météo et l'état des sentiers, sans savoir quel temps il fera à chaque endroit au moment où il y passera.

### Sarah — randonneuse occasionnelle *(déduit de CR-001/Q03)*
- **Contexte d'usage :** fait partie du grand public, a un niveau modeste et ne connaît pas forcément sa VMA (⚠ ZO-09). Prépare ses sorties de week-end sur smartphone.
- **Objectif :** trouver une sortie adaptée à son niveau et à la météo, sans prendre de risque.
- **Ce qui la bloque aujourd'hui :** elle évalue mal la durée et la difficulté réelles d'un parcours, et ne sait pas quelle quantité d'eau emporter.

### Patrice — pêcheur du bord et chasseur sous-marin *(CR-001/Q08, Q12)*
- **Contexte d'usage :** dispose souvent de créneaux courts (« j'ai un créneau d'une heure pour pêcher sur Saint-Paul ») et décide au dernier moment depuis son smartphone.
- **Objectif :** savoir quel secteur de côte offre les meilleures conditions pendant son créneau, sans enfreindre la réglementation.
- **Ce qui le bloque aujourd'hui :** il doit croiser lui-même le vent, la houle, la marée et la clarté de l'eau après la pluie, et il n'est pas sûr des zones réglementées.

---

## 6. Périmètre

### Dans le périmètre — prioritaire pour la première livraison (*CR-001/Q06*)

- Création d'un itinéraire trail entre un départ et une arrivée. L'utilisateur choisit librement : aller simple ou aller-retour, nombre de jours, dénivelé (*CR-001/Q18*)
- Affichage des sentiers ouverts, du temps de parcours et de la difficulté (*CR-001/§1*)
- Prévisions météo des prochains jours, heure par heure le long du parcours (*CR-001/Q13, Q15*)
- Trajet conseillé, uniquement sur sentiers officiels balisés (*CR-001/Q16, Q34*)
- Téléchargement de l'itinéraire validé au format `.gpx` (*CR-001/Q19*)
- Conseils d'équipement et quantités d'eau et de nourriture (*CR-001/Q06, Q21*)
- Profil utilisateur (âge, poids, taille, VMA) et classement des sports favoris (*CR-001/Q02, Q20, Q39*)
- Compte utilisateur, avec les mêmes données sur tous ses appareils (*CR-001/Q23*)
- Consentement, conditions d'utilisation, export et suppression du compte (*CR-001/Q24, Q29*)
- Espace d'administration de l'état des sentiers et des alertes (*CR-001/Q36, Q42*)
- Points d'eau potable, à titre indicatif (*CR-001/Q17, Q35*)

### Dans le périmètre — si le calendrier le permet (*CR-001/Q30*, ⚠ INC-01)

- Recommandation de secteur côtier pour la pêche du bord et la chasse sous-marine (*CR-001/Q08, Q09, Q31*)
- Saisie du créneau disponible et du point de départ (*CR-001/Q12*)
- Alertes liées à la Réserve naturelle marine et au risque requin (*CR-001/Q10, Q32*)
- Comparaison entre trail et pêche avec un score argumenté (*CR-001/Q11, Q33*)

### Hors périmètre

| Élément écarté | Motif | Source |
|---|---|---|
| Autres sports que le trail et la pêche | Choix du client | CR-001/Q05 |
| Zones hors de La Réunion | Choix du client | CR-001/Q05 |
| Pêche en bateau et en kayak | Pas retenues « pour commencer » | CR-001/Q08 |
| Adaptation de l'itinéraire pendant la sortie | Adaptation seulement pendant la préparation | CR-001/Q14 |
| Itinéraires hors sentiers officiels balisés | Sécurité | CR-001/Q16 |
| Abris, gîtes et itinéraires de repli | Non retenus pour le moment | CR-001/Q17 |
| Envoi direct de l'itinéraire sur la montre | Le téléchargement du fichier `.gpx` suffit | CR-001/Q19 |
| Données de profil autres que les 4 de base et les sports favoris | Inscription simplifiée, moins de données personnelles | CR-001/Q20, Q39 |
| Apprentissage à partir des retours après chaque sortie | Mise à jour manuelle du profil uniquement | CR-001/Q22 |
| Consultation hors connexion | Le fichier `.gpx` prend le relais sur le terrain | CR-001/Q27 |
| Carte précise des zones réglementées en mer | Remplacée par un message d'alerte | CR-001/Q32 |
| Calculs physiologiques confiés à une IA | Règles de calcul fixes exigées | CR-001/Q21 |
| Mise en ligne publique avant validation de la démonstration | Le client veut d'abord voir l'application fonctionner | CR-001/Q37 |

---

## 7. Contraintes

| # | Contrainte | Nature | Source |
|---|---|---|---|
| 1 | Livraison en 3 semaines, soit le 14/12/2026 si le délai court depuis l'entretien (⚠ ZO-03) | stratégique | CR-001/Q07 |
| 2 | Aucun budget, ni pour la réalisation ni pour l'exploitation : aucun coût récurrent toléré | stratégique | CR-001/Q07, Q28 |
| 3 | Uniquement des sources de données gratuites ou ouvertes, dans la limite de leurs quotas d'utilisation | technique | CR-001/Q25, Q28, Q38 |
| 4 | Territoire couvert : La Réunion uniquement | métier | CR-001/Q05 |
| 5 | Application web pensée pour smartphone, installable sur l'écran d'accueil | technique | CR-001/Q01 |
| 6 | Connexion internet nécessaire. Sur le terrain, en zone sans réseau, seul le fichier `.gpx` est disponible | physique | CR-001/Q27 |
| 7 | Microclimats marqués : la météo d'un point ne vaut pas pour tout le parcours | physique | CR-001/Q15, Q38 |
| 8 | Validation par une démonstration avant toute mise en ligne | stratégique | CR-001/Q37 |
| 9 | Données personnelles de forme physique soumises au RGPD | réglementaire | CR-001/Q24 |
| 10 | Réglementation du littoral : Réserve naturelle marine et risque requin | réglementaire | CR-001/Q10 |

---

## 8. Règles métier

| # | Règle | Source |
|---|---|---|
| R-01 | Un itinéraire, conseillé ou choisi, n'emprunte que des sentiers officiels balisés | CR-001/Q16 |
| R-02 | Un sentier déclaré fermé n'est jamais proposé dans un trajet conseillé *(déduit, à confirmer)* | CR-001/Q16, Q36 |
| R-03 | La météo d'un tronçon est celle prévue à l'heure estimée de passage sur ce tronçon | CR-001/Q15 |
| R-04 | L'itinéraire est adapté à la météo seulement pendant la préparation, jamais pendant la sortie | CR-001/Q14 |
| R-05 | Le temps de parcours et les quantités d'eau et de nourriture sont calculés par des règles fixes, à partir du profil. Une IA ne fait jamais ces calculs | CR-001/Q21 |
| R-06 | Les critères qui déclenchent un trajet conseillé sont propres à chaque sentier (radiers, boue, ravines) | CR-001/Q34 |
| R-07 | Si une source de données est indisponible ou pas à jour, l'application l'indique clairement pour le secteur concerné et n'invente aucune valeur de remplacement | CR-001/Q26 |
| R-08 | Quand l'administrateur force l'état d'un sentier, cet état remplace l'information reçue automatiquement (⚠ AMB-12) | CR-001/Q36 |
| R-09 | Les points d'eau sont toujours accompagnés d'un avertissement : leur disponibilité peut varier, il faut emporter toute sa réserve d'eau | CR-001/Q35 |
| R-10 | La clarté de l'eau est estimée à partir des pluies récentes sur les bassins versants côtiers | CR-001/Q31 |
| R-11 | Toute recommandation de pêche sur la côte ouest affiche une alerte sur la Réserve naturelle marine et invite à vérifier la réglementation sur place | CR-001/Q32 |
| R-12 | Quand trail et pêche obtiennent des conditions équivalentes, l'ordre des sports favoris du profil les départage | CR-001/Q33, Q39 |
| R-13 | Les données de forme physique ne sont enregistrées qu'après un consentement explicite de l'utilisateur | CR-001/Q24 |
| R-14 | L'inscription n'aboutit qu'après acceptation des conditions d'utilisation, qui précisent que l'application est une aide à la décision et ne remplace pas les bulletins officiels | CR-001/Q29 |

---

## 9. Exigences fonctionnelles

### Trail

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-001 | L'utilisateur saisit un point de départ, un point d'arrivée, une date et une heure de départ (⚠ ZO-04) | Must | Julien, Sarah | CR-001/Q15, Q18 |
| REQ-002 | L'utilisateur choisit entre aller simple et aller-retour, le nombre de jours et le dénivelé maximal accepté (⚠ INC-08) | Must | Julien | CR-001/Q18 |
| REQ-003 | L'application construit un itinéraire sur sentiers officiels balisés et ouverts | Must | Julien, Sarah | CR-001/Q16 |
| REQ-004 | L'application affiche, pour chaque sentier emprunté, son état (ouvert ou fermé) et la date de cette information | Must | Julien, Sarah | CR-001/§1, Q26, Q36 |
| REQ-005 | L'application affiche le temps de parcours estimé, calculé à partir du profil (⚠ AMB-11) | Must | Julien, Sarah | CR-001/§1, Q21 |
| REQ-006 | L'application affiche la difficulté du parcours (⚠ AMB-03) | Must | Sarah | CR-001/§1 |
| REQ-007 | L'application affiche la météo prévue heure par heure pour chaque tronçon, à l'heure estimée de passage | Must | Julien | CR-001/Q13, Q15, Q38 |
| REQ-008 | Quand une règle de sécurité d'un sentier est déclenchée, l'application affiche un trajet conseillé à côté du trajet choisi (⚠ AMB-04, INC-09) | Must | Julien, Sarah | CR-001/Q16, Q34 |
| REQ-009 | L'application explique en langage courant pourquoi le trajet conseillé diffère du trajet choisi (⚠ INC-02) | Should | Julien, Sarah | CR-001/Q21 |
| REQ-010 | L'application suggère une trace selon une distance ou un niveau souhaité, par exemple environ 40 à 50 km depuis un point de départ (⚠ AMB-01) | Should | Julien | CR-001/§1 |
| REQ-011 | Une fois l'itinéraire validé, l'utilisateur télécharge un fichier `.gpx` (⚠ AMB-08) | Must | Julien | CR-001/Q19 |
| REQ-012 | L'application propose une liste d'équipement adaptée à la météo prévue sur le parcours : vêtement de pluie, casquette, lunettes… (⚠ ZO-06) | Must | Julien, Sarah | CR-001/§1, Q06 |
| REQ-013 | L'application calcule les quantités d'eau et de nourriture à partir du profil, de la durée estimée et de la météo prévue (⚠ ZO-05) | Must | Julien, Sarah | CR-001/§1, Q21 |
| REQ-014 | L'application affiche les points d'eau potable sur le parcours, avec l'avertissement de la règle R-09 | Could | Julien | CR-001/Q17, Q35 |

### Profil et compte

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-015 | L'utilisateur crée un compte, s'y connecte et retrouve ses données sur tous ses appareils (⚠ ZO-10) | Must | tous | CR-001/Q23 |
| REQ-016 | L'utilisateur renseigne et modifie son âge, son poids, sa taille et sa VMA (⚠ ZO-09) | Must | tous | CR-001/Q02, Q20, Q22 |
| REQ-017 | À l'inscription, l'utilisateur classe ses sports favoris par ordre de préférence, et peut modifier ce classement ensuite | Should | tous | CR-001/Q33, Q39 |
| REQ-018 | L'utilisateur donne un consentement explicite avant toute saisie de données de forme physique, et peut consulter la politique de confidentialité | Must | tous | CR-001/Q24 |
| REQ-019 | L'utilisateur exporte ses données et supprime son compte lui-même | Must | tous | CR-001/Q24 |
| REQ-020 | L'utilisateur accepte les conditions d'utilisation, avec l'avertissement de la règle R-14, pour finaliser son inscription (⚠ ZO-12) | Must | tous | CR-001/Q29 |

### Administration

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-021 | Seul un administrateur peut forcer ou corriger l'état d'un sentier | Must | Administrateur | CR-001/Q36, Q42 |
| REQ-022 | L'administrateur crée, modifie et retire les alertes affichées aux utilisateurs (⚠ AMB-10) | Should | Administrateur | CR-001/Q42 |
| REQ-023 | L'administrateur tient à jour les critères de sécurité de chaque sentier du panel pilote (⚠ ZO-07, AMB-09) | Should | Administrateur | CR-001/Q34, Q40 |

### Pêche — si le calendrier le permet (⚠ INC-01)

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-024 | L'application classe les secteurs côtiers pour la pêche du bord et pour la chasse sous-marine selon le vent, la houle (hauteur et période), la marée, le calendrier solunaire, la pluie et la clarté estimée de l'eau (⚠ AMB-05, AMB-06, ZO-15) | Should | Patrice | CR-001/Q08, Q09, Q31 |
| REQ-025 | L'utilisateur saisit son créneau disponible et son point de départ pour affiner le classement | Should | Patrice | CR-001/Q12 |
| REQ-026 | Toute recommandation sur la côte ouest affiche l'alerte de la règle R-11 | Should | Patrice | CR-001/Q10, Q32 |
| REQ-027 | Toute recommandation de chasse sous-marine affiche une alerte sur le risque requin et sur la réglementation associée (⚠ INC-07, ZO-11) | Should | Patrice | CR-001/Q10 |

### Comparaison entre activités

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-028 | À « Que voulez-vous faire aujourd'hui ? », l'application affiche un score comparatif argumenté entre trail et pêche, départagé si besoin par la règle R-12 (⚠ AMB-02, INC-01) | Could | tous | CR-001/Q11, Q33, Q39 |

---

## 10. Exigences non fonctionnelles

| ID | Exigence | Comment on la vérifie | Source |
|---|---|---|---|
| REQ-101 | L'application est utilisable sur smartphone et installable sur l'écran d'accueil (⚠ ZO-13) | Installation et parcours complet sur les smartphones de test retenus | CR-001/Q01 |
| REQ-102 | L'exploitation n'engendre aucun coût : uniquement des sources gratuites, dans la limite de leurs quotas | Liste des sources avec leurs conditions d'utilisation ; estimation du nombre d'appels comparé aux quotas | CR-001/Q25, Q28 |
| REQ-103 | Si une source est indisponible ou trop ancienne, un message explicite s'affiche pour le secteur concerné, sans aucune valeur inventée (⚠ ZO-16) | Test en coupant chaque source, puis en simulant une donnée périmée | CR-001/Q26 |
| REQ-104 | Chaque information externe affichée (météo, état d'un sentier) indique sa date de mise à jour *(déduit de l'exigence de fraîcheur)* | Vérification de chaque écran | CR-001/Q25 |
| REQ-105 | Un utilisateur ne peut consulter que ses propres données de profil | Test d'accès croisé entre deux comptes | CR-001/Q23, Q24 |
| REQ-106 | Seul le rôle administrateur accède à l'espace d'administration | Test d'accès avec un compte utilisateur ordinaire | CR-001/Q42 |
| REQ-107 | Les calculs de temps, d'eau et de nourriture donnent toujours le même résultat pour les mêmes entrées | Tests automatisés sur des jeux de données de référence | CR-001/Q21 |
| REQ-108 | Le découpage météo (zones, secteurs d'altitude, seuils) se modifie par paramétrage, sans changer l'application | Modification d'un paramètre, puis vérification de son effet | CR-001/Q38 |
| REQ-109 | Sans connexion, l'application indique clairement que les informations ne sont pas disponibles *(déduit)* | Test en mode avion | CR-001/Q27 |
| REQ-110 | Le fichier `.gpx` produit respecte le format standard | Contrôle du fichier, puis import sur les appareils de test (⚠ ZO-14) | CR-001/Q19 |
| REQ-111 | L'application peut être démontrée de bout en bout sans mise en ligne publique | Démonstration au client à l'échéance | CR-001/Q37 |

---

## 11. Questions restées ouvertes

Cette section recense les **incohérences** (deux réponses du CR-001 qui se contredisent), les **ambiguïtés** (une formulation qui peut se comprendre de plusieurs façons) et les **zones d'ombre** (des sujets non abordés mais nécessaires). Pour chaque point, l'hypothèse de la dernière colonne s'applique jusqu'à la réponse du client.

**À trancher en priorité au prochain entretien :** INC-01, INC-02, INC-03, ZO-02, ZO-05, ZO-11.

### 11.1 Incohérences

| # | Constat | Posée le | Réponse | Hypothèse retenue en attendant |
|---|---|---|---|---|
| INC-01 | La première version porte sur le trail (Q06) et l'intégration de la pêche n'est pas décidée (Q30). Pourtant le premier besoin exprimé est de savoir « quel sport est le plus propice », et le classement des sports favoris dès l'inscription (Q39) n'a de sens que si la pêche existe. **Question :** la pêche et la comparaison entre activités sont-elles attendues dans la livraison à 3 semaines ? | CR-001/Q06, Q30, Q39 | en attente | Trail = Must, pêche = Should, comparaison = Could. Le classement des sports favoris est conservé pour ne pas devoir modifier le profil plus tard |
| INC-02 | Le projet est présenté comme une « application assistée par IA » avec un « trajet conseillé par l'IA » (§1). Or Q21 réserve l'IA aux textes d'explication : temps, quantités et trajet conseillé sont calculés par des règles fixes. Le client pourrait attendre plus d'IA qu'il n'y en aura. Par ailleurs, une IA de rédaction a souvent un coût, ce qui est incompatible avec Q28. **Question :** le client accepte-t-il que les recommandations reposent sur des règles et que l'IA serve seulement à les expliquer ? | CR-001/§1, Q21, Q28 | en attente | Recommandations par règles. L'explication en langage courant (REQ-009) est abandonnée si aucune solution gratuite n'existe |
| INC-03 | L'application est destinée au grand public (Q03), avec un compte disponible sur plusieurs appareils (Q23). Mais le client veut une démonstration avant toute mise en ligne (Q37). « Livrer le projet » en 3 semaines (Q07) ne veut donc pas dire mettre l'application à disposition du public. **Question :** que contient exactement le livrable à 3 semaines ? | CR-001/Q03, Q07, Q23, Q37 | en attente | Le livrable est une démonstration fonctionnelle. La mise en ligne publique fera l'objet d'une décision ultérieure, hors délai |
| INC-04 | Le profil est « strictement limité » à 4 données (Q20), mais Q39 y ajoute le classement des sports favoris | CR-001/Q20, Q39 | en attente | Profil = 4 données + classement des sports. La date, l'heure, le créneau et le point de départ sont saisis à chaque recherche et ne font pas partie du profil |
| INC-05 | Le client a précisé vouloir les **prévisions** des prochains jours, pas l'historique (Q13). Or la clarté de l'eau dépend des pluies des 24 à 48 dernières heures (Q31), et les règles de sécurité des sentiers (radiers, boue) dépendent aussi des pluies passées (Q34) | CR-001/Q13, Q31, Q34 | en attente | Seules les prévisions sont affichées. Les pluies récentes servent en interne au calcul de la clarté de l'eau et aux règles des sentiers |
| INC-06 | Q26 interdit toute valeur extrapolée, alors que Q31 demande d'estimer la clarté de l'eau | CR-001/Q26, Q31 | en attente | Une estimation est permise si elle est présentée comme telle. L'interdiction vise uniquement le remplacement d'une donnée manquante |
| INC-07 | Q10 demande de signaler « impérativement » la Réserve marine **et les zones à risque requin**. Q32 réduit cela à un message pour la côte ouest et ne parle plus du requin, alors que les côtes concernées couvrent toute l'île (Q09) | CR-001/Q09, Q10, Q32 | en attente | Message « Réserve marine » pour toute recommandation sur la côte ouest, et message « risque requin » pour toute recommandation de chasse sous-marine, quelle que soit la côte |
| INC-08 | Le nombre de jours est au choix de l'utilisateur (Q18), mais les gîtes et abris ne sont pas retenus (Q17). Les prévisions ne couvrent par ailleurs qu'un nombre limité de jours | CR-001/Q13, Q17, Q18 | en attente | Sortie sur plusieurs jours autorisée dans la limite de l'horizon des prévisions. Eau et nourriture calculées pour la totalité de la sortie, aucun hébergement proposé |
| INC-09 | Départ et arrivée sont libres (Q18), mais les règles de sécurité ne seront calibrées que pour le panel pilote (Q40). Le comportement hors panel n'est pas défini. Par ailleurs, « La Possession → Mafate » est un itinéraire, pas un sentier | CR-001/Q18, Q34, Q40 | en attente | Itinéraire, météo et `.gpx` disponibles sur tous les sentiers officiels. Le trajet conseillé est calculé seulement sur le panel pilote ; ailleurs, un message indique qu'il n'est pas disponible |

### 11.2 Ambiguïtés

| # | Constat | Posée le | Réponse | Hypothèse retenue en attendant |
|---|---|---|---|---|
| AMB-01 | « Une suggestion de trace d'environ 40/50 km » et « une trace sur mesure » décrivent une recherche **par distance**. Le parcours utilisateur, lui, demande **un départ et une arrivée**. S'agit-il de deux modes de recherche ? | CR-001/§1 | en attente | Mode départ → arrivée en Must. La suggestion par distance (REQ-010) est en Should |
| AMB-02 | À « Que voulez-vous faire aujourd'hui ? », est-ce l'utilisateur qui choisit l'activité ou l'application qui la recommande ? « Aujourd'hui » limite-t-il la recherche au jour même, alors que les prévisions portent sur les prochains jours ? | CR-001/§1, Q11, Q13 | en attente | L'utilisateur choisit une activité ou demande une comparaison. Il peut viser n'importe quelle date dans l'horizon des prévisions |
| AMB-03 | « Difficulté » : cotation officielle du sentier, ou difficulté ressentie selon le niveau de l'utilisateur ? | CR-001/§1 | en attente | Cotation officielle du sentier, complétée par le temps estimé personnalisé |
| AMB-04 | Le trajet conseillé est-il toujours affiché, ou seulement quand une règle est déclenchée ? Peut-il proposer « un autre secteur » (Q16) que celui choisi ? | CR-001/Q16, Q34 | en attente | Affiché seulement quand une règle est déclenchée, et dans le même secteur |
| AMB-05 | « Meilleure côte » : de quelle échelle parle-t-on ? Une façade de l'île, une commune (« Saint-Paul », Q12) ou un spot précis ? | CR-001/§1, Q09, Q12 | en attente | Des secteurs côtiers à l'échelle de la commune |
| AMB-06 | « Pêche du bord » devient « surfcasting » dans la reformulation du CR, ce qui exclut la pêche au lancer citée dans la question Q08 | CR-001/Q08, §4.2 | en attente | Toute forme de pêche du bord est concernée |
| AMB-07 | « Prochains jours » : combien de jours de prévision ? | CR-001/Q13 | en attente | L'horizon maximal fourni par les sources retenues, affiché à l'utilisateur |
| AMB-08 | Quel tracé est exporté en `.gpx` : celui choisi par l'utilisateur ou le trajet conseillé ? Qui « valide » l'itinéraire ? | CR-001/Q19 | en attente | L'utilisateur valide l'un des deux tracés, et c'est celui-là qui est exporté |
| AMB-09 | Le panel pilote est cité avec « notamment » : la liste est-elle fermée ? | CR-001/Q40 | en attente | Trois parcours : La Possession → Mafate, Roche Écrite, Piton des Neiges |
| AMB-10 | Les « alertes » gérées par l'administrateur sont-elles des alertes sur les sentiers, la météo ou le littoral ? | CR-001/Q42 | en attente | Messages libres rattachés à un secteur et affichés aux utilisateurs concernés |
| AMB-11 | Le CR parle de « l'allure estimée » (Q15) sans dire comment elle tient compte du dénivelé et du terrain. Une estimation à partir de la seule VMA est peu fiable en montagne | CR-001/Q15, Q21 | en attente | Estimation à partir de la VMA, corrigée par le dénivelé selon une règle fixe (voir ZO-05) |
| AMB-12 | Quand l'administrateur force l'état d'un sentier, ce forçage dure-t-il jusqu'à ce qu'il le retire, ou jusqu'à la prochaine information automatique ? | CR-001/Q36 | en attente | Le forçage dure jusqu'à ce que l'administrateur le retire. Sa date est affichée |

### 11.3 Zones d'ombre

| # | Sujet non abordé | Posée le | Réponse | Hypothèse retenue en attendant |
|---|---|---|---|---|
| ZO-01 | Identité et fonction du client, et outils qu'il utilise aujourd'hui pour préparer ses sorties. Sans cela, le problème (section 2) n'est que déduit | CR-001, en-tête, Q25 | en attente | Problème tel que formulé en section 2 |
| ZO-02 | Qui valide le livrable et selon quels critères de recette (Q04 et Q07 sans réponse) | CR-001/Q04, Q07 | en attente | L'équipe rédige des scénarios de recette sur le panel pilote et les soumet au client pour accord avant la fin de la 1re semaine |
| ZO-03 | Date de départ du délai de 3 semaines | CR-001/Q07 | en attente | Le délai court depuis l'entretien du 23/11/2026 : échéance le 14/12/2026 |
| ZO-04 | Le client n'a pas cité la date et l'heure de départ comme données à saisir. Elles sont pourtant indispensables pour la météo à l'heure de passage | CR-001/Q15 | en attente | Saisie obligatoire, pré-remplie avec la date et l'heure courantes |
| ZO-05 | Contenu des règles de calcul du temps, de l'eau et de la nourriture, et qui les valide. Une erreur peut avoir des conséquences sur la santé | CR-001/Q21 | en attente | Règles tirées de références publiques, citées dans l'application et soumises à la validation du client |
| ZO-06 | Règles des conseils d'équipement : à partir de quels seuils recommander un vêtement de pluie, une casquette, des lunettes ? | CR-001/§1 | en attente | Grille simple (pluie, ensoleillement, température, vent) proposée par l'équipe et validée par le client |
| ZO-07 | Qui fournit les seuils de sécurité propres à chaque sentier (Q34) ? Cela demande une connaissance du terrain que l'équipe n'a pas | CR-001/Q34 | en attente | L'équipe propose des seuils pour les 3 parcours pilotes, le client les valide |
| ZO-08 | Qui tient le rôle d'administrateur après la livraison et met à jour l'état des sentiers, sans budget ? | CR-001/Q36, Q42 | en attente | Le client |
| ZO-09 | Que se passe-t-il si l'utilisateur ne connaît pas sa VMA ou ne remplit pas son profil ? | CR-001/Q02, Q03 | en attente | Itinéraire et météo restent accessibles. Temps estimé et quantités ne sont calculés qu'avec un profil complet |
| ZO-10 | Peut-on consulter l'application sans compte (Q23 : authentification « obligatoire ») ? Pour un public large, cela peut freiner l'adoption | CR-001/Q23 | en attente | Compte obligatoire pour toute utilisation |
| ZO-11 | La réglementation préfectorale liée au risque requin encadre certaines activités nautiques à La Réunion et peut concerner la chasse sous-marine. Recommander une côte pour la chasse sous-marine risque d'orienter vers une zone où elle est interdite. Le client connaît-il ces règles ? Faut-il exclure ces zones ? | CR-001/Q08, Q10 | en attente | Aucune recommandation de chasse sous-marine sans alerte réglementaire explicite. À confirmer avant toute mise en ligne |
| ZO-12 | Qui rédige et valide les conditions d'utilisation et la politique de confidentialité ? Qui est responsable du traitement des données au sens du RGPD ? La portée réelle de la clause de non-responsabilité (Q29) n'a pas été vérifiée | CR-001/Q24, Q29 | en attente | L'équipe fournit un modèle, le client le fait valider et en porte la responsabilité |
| ZO-13 | Exigences non abordées : temps de réponse, accessibilité, langues, smartphones et navigateurs pris en charge, nombre d'utilisateurs attendu | — | en attente | Français uniquement, smartphones récents, aucun engagement de nombre d'utilisateurs pour la démonstration |
| ZO-14 | Sur quelles montres ou quels GPS l'import du fichier `.gpx` doit-il être vérifié ? | CR-001/Q19 | en attente | Vérification sur les appareils dont dispose l'équipe |
| ZO-15 | Existe-t-il des sources gratuites pour la houle, les marées et le calendrier solunaire à La Réunion ? | CR-001/Q09, Q28 | en attente | Un critère sans source gratuite est retiré du calcul, et ce retrait est signalé à l'utilisateur |
| ZO-16 | À partir de quel âge une donnée est-elle « pas à jour » (Q26) ? | CR-001/Q26 | en attente | Seuil propre à chaque type de donnée, fixé par paramétrage |

---

## 12. Validation client

| Version | Date | Présentée au client | Retour |
|---|---|---|---|
| v1 | 23/11/2026 | non | — |
