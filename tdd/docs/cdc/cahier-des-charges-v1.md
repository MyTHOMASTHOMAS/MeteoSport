# Cahier des charges — MeteoSport *(nom provisoire, ⚠ ZO-30)*

**Équipe :** Maxime, Thomas, Ivan
**Version :** v1.1 — 23/11/2026 (v1 corrigée le 23/11/2026, voir section 13)
**Sources :** `tdd/docs/cr/cr-001.md` (entretien du 23/11/2026)

Ce document formalise le **problème compris**, pas la solution. Aucun nom de technologie, aucun nom de framework, aucune structure de base de données ici.

> **Statut :** brouillon, pas encore présenté au client.
> Le marqueur ⚠ renvoie à un point de la section 11 : une incohérence (`INC-nn`), une ambiguïté (`AMB-nn`) ou une zone d'ombre (`ZO-nn`). Tant que le client n'a pas tranché, c'est l'hypothèse indiquée en section 11 qui s'applique.
> La mention *(hypothèse)* ou *(déduit)* signale un élément proposé par l'équipe, qui ne vient pas directement du client.

---

## 1. Contexte

Le client habite La Possession, à La Réunion. Il souhaite « une suggestion de trace d'environ 40/50 km jusqu'à Mafate » et évoque aussi un créneau pour pêcher sur Saint-Paul (*CR-001/§1, Q12*). Il demande une application qui aide les pratiquants de **trail** et de **pêche** à décider quand et où sortir en fonction de la météo (*CR-001/§1, Q05*). L'application est destinée au **public**, pas seulement à son usage personnel (*CR-001/Q03*). Son nom et sa fonction restent à préciser (*CR-001, en-tête*, ⚠ ZO-01).

Le terrain impose plusieurs contraintes :

- **Relief et microclimats.** Le relief de l'île crée des microclimats marqués *(prémisse de l'équipe, connaissance extérieure au CR)* : la météo d'un point ne vaut pas pour tout un parcours. Le client demande une météo heure par heure le long du parcours et un découpage par zones (*CR-001/Q15, Q38*).
- **Zones sans réseau.** En zone blanche, l'application ne fonctionne pas et le fichier `.gpx` sur montre ou GPS prend le relais (*CR-001/Q27*). Le cirque de Mafate en est un exemple *(cité dans la question de l'équipe, connaissance extérieure au CR)*.
- **État des sentiers.** L'ouverture ou la fermeture des sentiers est décidée par l'ONF *(connaissance extérieure au CR)*. Ces décisions ne sont pas toujours publiées sous une forme exploitable automatiquement *(prémisse posée par l'équipe en Q36)*. Le client en retient qu'un administrateur doit pouvoir forcer ou corriger l'état d'un sentier si les données automatisées ne sont pas à jour (*CR-001/Q36*, ⚠ ZO-31).
- **Littoral réglementé.** La Réserve naturelle marine est présente sur la côte ouest (*CR-001/Q32*), et le risque requin doit être signalé (*CR-001/Q10*).

Le projet doit être livré en **3 semaines** (*CR-001/Q07*), soit au plus tard le **14/12/2026**. L'équipe vise un jalon interne le **09/12/2026** (⚠ ZO-03). Il n'y a **aucun budget** de réalisation et l'objectif est **0 € de coût récurrent pour les API et les données** (*CR-001/Q07, Q28*). Avant tout investissement dans un hébergement, le client veut voir l'application fonctionner **en local** (*CR-001/Q37*) ; qui paiera un hébergement ensuite n'est pas tranché (⚠ ZO-18).

---

## 2. Problème

Le CR-001 ne décrit pas comment le client prépare ses sorties aujourd'hui, ni avec quels outils (*CR-001/Q25* : « aucune source imposée »). Le problème ci-dessous est **déduit des besoins exprimés** et doit être confirmé (⚠ ZO-01).

Aujourd'hui, pour préparer une sortie, un pratiquant doit croiser lui-même des informations dispersées : prévisions météo, ouverture des sentiers, état de la mer. Il ne peut pas :

- savoir si la météo est idéale pour pratiquer un sentier choisi (*CR-001/§1*) ;
- savoir, pour un parcours donné, quel temps il fera à chaque endroit **au moment où il y passera** (*CR-001/Q15*) ;
- obtenir un itinéraire de remplacement plus sûr quand les conditions se dégradent sur son parcours (*CR-001/§1, Q16*) ;
- savoir quel équipement, quelle quantité d'eau et quelle quantité de nourriture emporter (*CR-001/§1, Q21*) ;
- savoir quelle côte a les meilleures conditions pour la pêche, ni quelle activité est la plus propice ce jour-là (*CR-001/§1, Q09, Q11*).

---

## 3. Objectifs

| # | Objectif | Comment on saura que c'est atteint |
|---|---|---|
| 1 | Préparer une sortie trail sur sentiers officiels en connaissant la météo le long du parcours | Pour un départ et une arrivée du panel pilote, l'utilisateur obtient un itinéraire sur sentiers officiels balisés, l'état de chaque sentier emprunté et la météo prévue de chaque zone traversée à l'heure estimée de passage (*CR-001/Q06, Q15, Q16, Q38, Q40*, ⚠ INC-09) |
| 2 | Savoir si la météo convient au parcours et disposer d'une solution plus sûre | L'application indique si les conditions prévues sont favorables (⚠ ZO-17). Quand une règle de sécurité d'un sentier est déclenchée, un trajet conseillé sur sentiers balisés s'affiche à côté du trajet choisi (*CR-001/§1, Q16, Q34*) |
| 3 | Emporter le bon équipement et les bonnes quantités | Pour un itinéraire validé, l'application affiche une liste d'équipement adaptée à la météo prévue et des quantités d'eau et de nourriture calculées par des règles fixes à partir du profil (*CR-001/§1, Q06, Q21*) |
| 4 | Suivre l'itinéraire sur sa montre | Le fichier `.gpx` téléchargé s'importe sans erreur sur les appareils de test retenus (*CR-001/§1, Q19*, ⚠ ZO-14) |
| 5 | Choisir la côte la plus favorable pour pêcher | Pour une date, un créneau et un point de départ, l'application indique les secteurs côtiers aux meilleures conditions et les critères qui l'expliquent (*CR-001/§1, Q09, Q12*, ⚠ INC-01, AMB-05) |
| 6 | Savoir quelle activité est la plus propice | L'application affiche un score comparatif justifié entre trail et pêche (*CR-001/Q11, Q33*, ⚠ INC-01) |
| 7 | Livrer dans le délai sans coût | Démonstration en local validée par le client dans le délai de 3 semaines (14/12/2026 ; jalon interne de l'équipe : 09/12/2026), sans dépense de réalisation ni coût d'API (*CR-001/Q07, Q28, Q37*, ⚠ INC-03, ZO-02, ZO-03, ZO-35) |

---

## 4. Parties prenantes

| Partie prenante | Rôle | Ce qu'elle attend | Utilise l'application ? |
|---|---|---|---|
| Client | Commanditaire du projet. Son identité, sa fonction et son pouvoir de validation restent à préciser (*CR-001/Q04*, ⚠ ZO-02) | Une démonstration fonctionnelle en local sous 3 semaines, sans coût | oui (cite une sortie vers Mafate et un créneau de pêche, *CR-001/§1, Q12*) |
| Pratiquants (public) | Utilisateurs finaux : traileurs, pêcheurs du bord, chasseurs sous-marins (*CR-001/Q03, Q05, Q08*). Inclusion des randonneurs à confirmer (⚠ AMB-14) | Préparer leurs sorties en sécurité | oui |
| Administrateur | Corrige l'état des sentiers et gère les alertes (*CR-001/Q36, Q42*). On ne sait pas qui tiendra ce rôle après la livraison (⚠ ZO-08, ZO-27) | Pouvoir corriger rapidement une information erronée | oui (espace d'administration) |
| Équipe projet | Conçoit, réalise et livre l'application | Un périmètre stable et des critères de recette clairs | non |
| Producteurs de données (ONF, Préfecture, services météo, données marines) | Sources externes non imposées par le client (*CR-001/Q25*) | — | non |
| Autorités (Réserve naturelle marine, préfecture) | Fixent la réglementation du littoral (*CR-001/Q10, Q32*) | Respect de la réglementation | non |

---

## 5. Personas

Ces personas sont construits par l'équipe. Les éléments marqués *(hypothèse)* ne viennent pas du CR-001. Ils restent à valider avec le client.

### Julien — traileur confirmé *(inspiré du client)*
- **Contexte d'usage :** habite La Possession et cherche des traces d'environ 40 à 50 km, par exemple jusqu'à Mafate (*CR-001/§1*). Suit son itinéraire sur sa montre grâce au fichier GPX (*CR-001/§1, Q19*). N'a plus de réseau une fois dans le cirque *(connaissance extérieure au CR ; les zones blanches viennent de CR-001/Q27)*. Prépare ses sorties depuis son smartphone *(hypothèse)*.
- **Objectif :** obtenir un itinéraire sur sentiers officiels, adapté à la météo prévue et à son niveau, le charger sur sa montre et savoir quoi emporter.
- **Ce qui le bloque aujourd'hui :** il doit croiser lui-même la météo et l'état des sentiers, sans savoir quel temps il fera à chaque endroit au moment où il y passera *(hypothèse, ⚠ ZO-01)*.

### Sarah — traileuse débutante *(hypothèse, déduit de CR-001/Q03)*
- **Contexte d'usage :** fait partie du public visé, a un niveau modeste et ne connaît pas forcément sa VMA (⚠ ZO-09) *(hypothèse)*.
- **Objectif :** trouver une sortie adaptée à son niveau et à la météo, sans prendre de risque (*CR-001/§1* : « itinéraires selon le niveau »).
- **Ce qui la bloque aujourd'hui :** évaluer la durée et la difficulté réelles d'un parcours et la quantité d'eau à emporter *(hypothèse)*.

### Patrice — pêcheur du bord et chasseur sous-marin *(CR-001/Q08, Q12)*
- **Contexte d'usage :** exemple cité par le client : « J'ai un créneau d'une heure pour pêcher sur Saint-Paul » (*CR-001/Q12*). Décide souvent au dernier moment *(hypothèse)*.
- **Objectif :** savoir quel secteur de côte offre les meilleures conditions pendant son créneau, en étant averti de la réglementation (*CR-001/Q09, Q10*).
- **Ce qui le bloque aujourd'hui :** croiser lui-même le vent, la houle, la marée et la clarté de l'eau après la pluie *(hypothèse, ⚠ ZO-01)*.

---

## 6. Périmètre

### Dans le périmètre — prioritaire pour la première livraison (*CR-001/Q06*)

- Création d'un itinéraire trail entre un départ et une arrivée. L'utilisateur choisit librement : aller simple ou aller-retour pour une sortie à la journée, dénivelé accepté (*CR-001/§1, Q18*) — REQ-001 à REQ-003. Les sorties sur plusieurs jours passent en second plan (REQ-030, ⚠ INC-08)
- Affichage de l'état des sentiers, du temps de parcours et de la difficulté (*CR-001/§1*) — REQ-004 à REQ-006
- Prévisions météo des prochains jours, heure par heure le long du parcours (*CR-001/Q13, Q15*) — REQ-007
- Indication des conditions favorables ou non pour l'itinéraire (*CR-001/§1*) — REQ-029
- Trajet conseillé, uniquement sur sentiers officiels balisés (*CR-001/Q16, Q34*) — REQ-008
- Téléchargement de l'itinéraire validé au format `.gpx` (*CR-001/Q19*) — REQ-011
- Conseils d'équipement et quantités d'eau et de nourriture (*CR-001/Q06, Q21*) — REQ-012, REQ-013
- Profil utilisateur (âge, poids, taille, VMA) (*CR-001/Q02, Q20*) — REQ-016
- Compte utilisateur, avec les mêmes données sur tous ses appareils (*CR-001/Q23*) — REQ-015
- Consentement, politique de confidentialité, conditions d'utilisation, export et suppression du compte (*CR-001/Q24, Q29*) — REQ-018 à REQ-020
- Espace d'administration : état des sentiers et alertes (*CR-001/Q36, Q42*) — REQ-021, REQ-022
- Critères de sécurité de chaque sentier du panel pilote, consignés dans le référentiel des sentiers (*CR-001/Q34, Q40*) — REQ-023

### Dans le périmètre — volet trail secondaire *(priorité fixée par l'équipe : hypothèse, ⚠ INC-01 ; Q30 ne porte que sur la pêche)*

- Sorties sur plusieurs jours (*CR-001/Q18*, ⚠ INC-08) — REQ-030
- Explication en langage courant du trajet conseillé et du verdict (*CR-001/Q21*) — REQ-009
- Suggestion de trace selon une distance ou un niveau (*CR-001/§1*, ⚠ AMB-19) — REQ-010
- Points d'eau potable, à titre indicatif (*CR-001/Q17, Q35*) — REQ-014
- Classement des sports favoris (*CR-001/Q33, Q39*) — REQ-017

### Dans le périmètre — volet pêche et comparaison, si le calendrier le permet (*CR-001/Q30*, ⚠ INC-01, ZO-35)

- Recommandation de secteur côtier pour la pêche du bord et la chasse sous-marine, avec date, créneau et point de départ (*CR-001/Q08, Q09, Q12, Q31*) — REQ-024, REQ-025
- Alertes liées à la Réserve naturelle marine et au risque requin (*CR-001/Q10, Q32*) — REQ-026, REQ-027
- Comparaison entre trail et pêche avec un score justifié (*CR-001/Q11, Q33*) — REQ-028

### Hors périmètre

| Élément écarté | Motif | Source |
|---|---|---|
| Autres sports que le trail et la pêche | Choix du client (randonnée : ⚠ AMB-14) | CR-001/Q05 |
| Zones hors de La Réunion | Choix du client | CR-001/Q05 |
| Pêche en bateau et en kayak | Pas retenues « pour commencer » | CR-001/Q08 |
| Affichage de l'historique météo | Le client veut les prévisions des prochains jours | CR-001/Q13 |
| Adaptation de l'itinéraire pendant la sortie | Adaptation seulement pendant la préparation | CR-001/Q14 |
| Trajet conseillé hors sentiers officiels balisés | Sécurité | CR-001/Q16 |
| Abris, gîtes et échappatoires *(hypothèse de l'équipe, ⚠ INC-08)* | Non évoqués par le client : il ne les a pas écartés, c'est l'équipe qui les laisse de côté | CR-001/Q17 |
| Envoi direct de l'itinéraire sur la montre | Le téléchargement du fichier `.gpx` suffit | CR-001/Q19 |
| Données de profil autres que les 4 de base et les sports favoris | Inscription simplifiée, moins de données personnelles | CR-001/Q20, Q39 |
| Calculs physiologiques et de sécurité confiés à une IA | Règles de calcul fixes exigées | CR-001/Q21 |
| Apprentissage à partir des retours après chaque sortie | Mise à jour manuelle du profil uniquement | CR-001/Q22 |
| Consultation hors connexion (⚠ AMB-23) | Le fichier `.gpx` prend le relais sur le terrain | CR-001/Q27 |
| Mesure directe de la clarté de l'eau | Estimée à partir des pluies récentes | CR-001/Q31 |
| Carte précise des zones réglementées en mer | Remplacée par un message d'alerte | CR-001/Q32 |
| Mise en ligne publique avant validation de la démonstration en local | Le client veut d'abord voir l'application fonctionner en local | CR-001/Q37 |
| Trajet conseillé sur les sentiers hors panel pilote | Règles de sécurité calibrées seulement sur le panel pilote | CR-001/Q40, ⚠ INC-09 |

---

## 7. Contraintes

| # | Contrainte | Nature | Source |
|---|---|---|---|
| 1 | Livraison en 3 semaines (échéance du client : 14/12/2026). Jalon interne de l'équipe : 09/12/2026 (⚠ ZO-03) | stratégique | CR-001/Q07 |
| 2 | Aucun budget de réalisation. Aucun coût récurrent pour les API et les données (« objectif » du client, ⚠ AMB-26). Le coût d'un éventuel hébergement après la démonstration n'est pas tranché (⚠ ZO-18) | stratégique | CR-001/Q07, Q28, Q37 |
| 3 | Uniquement des sources de données gratuites ou ouvertes, fiables et à jour, dans la limite de leurs quotas d'utilisation | technique | CR-001/Q25, Q28, Q38 |
| 4 | Territoire couvert : La Réunion uniquement | métier | CR-001/Q05 |
| 5 | Application web orientée mobile. L'installation sur l'écran d'accueil est proposée à titre ergonomique, sur les navigateurs qui le permettent (⚠ ZO-13, AMB-23) | technique | CR-001/Q01, Q27 |
| 6 | Connexion internet nécessaire. Sur le terrain, en zone sans réseau, seul le fichier `.gpx` est disponible | physique | CR-001/Q27 |
| 7 | Microclimats marqués *(prémisse de l'équipe, connaissance extérieure au CR)* : la météo d'un point ne vaut pas pour tout le parcours | physique | CR-001/Q15, Q38 |
| 8 | Validation par une démonstration en local avant tout investissement d'hébergement et toute mise en ligne (⚠ INC-03, INC-11) | stratégique | CR-001/Q37 |
| 9 | Données personnelles de forme physique soumises au RGPD (⚠ ZO-26, ZO-33) | réglementaire | CR-001/Q24 |
| 10 | Réglementation du littoral : Réserve naturelle marine et risque requin | réglementaire | CR-001/Q10, Q32 |

---

## 8. Règles métier

| # | Règle | Source |
|---|---|---|
| R-01 | Un trajet conseillé n'emprunte que des sentiers officiels balisés. Le trajet choisi suit lui aussi le réseau des sentiers officiels balisés *(extension déduite, à confirmer, ⚠ AMB-13)*. La définition de « sentier officiel balisé » reste à fixer (⚠ AMB-20) | CR-001/Q16 |
| R-02 | Un sentier déclaré fermé n'est jamais proposé dans un trajet conseillé *(déduit, à confirmer)* | CR-001/Q34, Q36 |
| R-03 | La météo d'un tronçon est celle prévue, pour la zone météo qu'il traverse, à l'heure estimée de passage sur ce tronçon (⚠ INC-10) | CR-001/Q15, Q38 |
| R-04 | L'itinéraire est adapté à la météo seulement pendant la préparation, jamais pendant la sortie (⚠ AMB-24) | CR-001/Q14 |
| R-05 | Le temps de parcours, les quantités d'eau et de nourriture et les calculs de sécurité (règles des sentiers, verdict sur les conditions) sont faits par des règles fixes. Une IA ne fait jamais ces calculs. La prise en compte de la météo dans les quantités est *déduite* (⚠ ZO-05) | CR-001/Q21 |
| R-06 | Les critères qui déclenchent un trajet conseillé sont propres à chaque sentier (radiers, boue, ravines) et figurent dans le référentiel des sentiers | CR-001/Q34 |
| R-07 | Si une source de données est indisponible ou pas à jour, l'application l'indique clairement pour le secteur concerné et n'invente aucune valeur de remplacement (⚠ INC-06, ZO-16) | CR-001/Q26 |
| R-08 | Quand l'administrateur force l'état d'un sentier, cet état remplace l'information reçue automatiquement (⚠ AMB-12, ZO-27) | CR-001/Q36 |
| R-09 | Les points d'eau sont toujours accompagnés d'un avertissement : leur disponibilité peut varier, il faut emporter toute sa réserve d'eau | CR-001/Q35 |
| R-10 | La clarté de l'eau est estimée à partir des pluies récentes sur les bassins versants côtiers, et présentée comme une estimation (⚠ INC-05, INC-06, ZO-32) | CR-001/Q31 |
| R-11 | Toute recommandation de pêche ou de chasse sous-marine sur la côte ouest affiche une alerte sur la présence potentielle de la Réserve naturelle marine et invite à vérifier la réglementation sur place (⚠ AMB-17, AMB-21) | CR-001/Q32 |
| R-12 | Quand trail et pêche obtiennent des conditions équivalentes, l'ordre des sports favoris du profil les départage (⚠ AMB-16, AMB-27) | CR-001/Q33, Q39 |
| R-13 | Les données de forme physique ne sont enregistrées qu'après un consentement explicite de l'utilisateur, recueilli à l'inscription (⚠ AMB-28) | CR-001/Q24 |
| R-14 | L'inscription n'aboutit qu'après acceptation des conditions d'utilisation. Elles précisent que l'application est une aide à la décision indicative, qu'elle ne remplace pas les bulletins officiels, et contiennent une clause de non-responsabilité en cas d'accident | CR-001/Q29 |
| R-15 | Toute recommandation de chasse sous-marine affiche une alerte sur le risque requin, quelle que soit la côte. La pêche du bord n'est pas concernée *(hypothèse de conception de l'équipe, en attente d'arbitrage, ⚠ INC-07, AMB-18)* | CR-001/Q10 |
| R-16 | Toute utilisation de l'application exige un compte authentifié : aucune consultation sans compte | CR-001/Q23 |

---

## 9. Exigences fonctionnelles

### Trail

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-001 | L'utilisateur saisit un point de départ, un point d'arrivée, une date et une heure de départ (⚠ ZO-04), et peut indiquer son temps disponible (⚠ AMB-15) | Must | Julien, Sarah | CR-001/§1, Q12, Q15, Q18 |
| REQ-002 | L'utilisateur choisit entre aller simple et aller-retour, pour une sortie à la journée, et le dénivelé accepté (⚠ INC-08, ZO-29) | Must | Julien, Sarah | CR-001/Q18 |
| REQ-003 | L'application construit un itinéraire sur sentiers officiels balisés entre le départ et l'arrivée (⚠ AMB-13, AMB-20, ZO-21) | Must | Julien, Sarah | CR-001/Q16, Q18 |
| REQ-004 | L'application affiche, pour chaque sentier emprunté, son état (ouvert ou fermé) et la date de cette information *(date : déduit de l'exigence de fraîcheur)* (⚠ ZO-31) | Must | Julien, Sarah | CR-001/§1, Q25, Q26, Q36 |
| REQ-005 | L'application affiche le temps de parcours estimé, calculé à partir du profil (⚠ AMB-11, ZO-09) | Must | Julien, Sarah | CR-001/§1, Q21 |
| REQ-006 | L'application affiche la difficulté du parcours (⚠ AMB-03) | Must | Julien, Sarah | CR-001/§1 |
| REQ-007 | L'application affiche la météo prévue heure par heure pour chaque zone traversée, à l'heure estimée de passage (⚠ INC-05, INC-10, AMB-07) | Must | Julien, Sarah | CR-001/Q13, Q15, Q38 |
| REQ-008 | Quand une règle de sécurité d'un sentier est déclenchée, ou qu'un sentier emprunté est fermé, l'application affiche un trajet conseillé à côté du trajet choisi (⚠ AMB-04, AMB-13, INC-09) | Must | Julien, Sarah | CR-001/§1, Q16, Q34 |
| REQ-009 | L'application explique en langage courant pourquoi le trajet conseillé diffère du trajet choisi et pourquoi les conditions sont jugées favorables ou non (⚠ INC-02) | Should | Julien, Sarah | CR-001/Q21 |
| REQ-010 | L'application suggère une trace selon une distance ou un niveau souhaité, par exemple environ 40 à 50 km depuis un point de départ (⚠ AMB-01, AMB-19, AMB-25) | Should | Julien, Sarah | CR-001/§1, Q06 |
| REQ-011 | Une fois l'itinéraire validé, l'utilisateur télécharge un fichier `.gpx` (⚠ AMB-08, AMB-19) | Must | Julien, Sarah | CR-001/§1, Q19 |
| REQ-012 | L'application propose une liste d'équipement adaptée à la météo prévue sur le parcours : vêtement de pluie, casquette, lunettes… (⚠ ZO-06) | Must | Julien, Sarah | CR-001/§1, Q06 |
| REQ-013 | L'application calcule les quantités d'eau et de nourriture à partir du profil et de la durée estimée. La prise en compte de la météo prévue est *déduite* (⚠ ZO-05) | Must | Julien, Sarah | CR-001/§1, Q21 |
| REQ-014 | L'application affiche les points d'eau potable sur le parcours, avec l'avertissement de la règle R-09 | Could | Julien, Sarah | CR-001/Q17, Q35 |
| REQ-029 | Pour un itinéraire, l'application indique si les conditions prévues sont favorables ou non, et quels critères posent problème, y compris une pluie récente, sans afficher d'historique. Hors panel pilote, le verdict repose sur la grille générale seule et le signale (⚠ INC-05, INC-09, ZO-17, ZO-20) | Must | Julien, Sarah | CR-001/§1, Q34 |
| REQ-030 | L'utilisateur peut planifier une sortie sur plusieurs jours, dans la limite de l'horizon des prévisions. Les quantités d'eau et de nourriture couvrent la totalité de la sortie (⚠ INC-08, ZO-19, ZO-29) | Should | Julien, Sarah | CR-001/Q13, Q18 |

### Profil et compte

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-015 | L'utilisateur crée un compte sécurisé, s'y connecte et retrouve ses données sur tous ses appareils (sécurité du compte : REQ-114 ; ⚠ ZO-24, ZO-25) | Must | tous | CR-001/Q23 |
| REQ-016 | L'utilisateur renseigne et modifie son âge, son poids, sa taille et sa VMA (⚠ ZO-09, ZO-28, INC-04) | Must | tous | CR-001/Q02, Q20, Q22 |
| REQ-017 | À l'inscription, l'utilisateur classe ses sports favoris par ordre de préférence, et peut modifier ce classement ensuite (⚠ INC-01, INC-04, ZO-22) | Should | tous | CR-001/Q33, Q39 |
| REQ-018 | L'utilisateur donne un consentement explicite avant toute saisie de données de forme physique, et peut consulter la politique de confidentialité (⚠ ZO-26, ZO-33, AMB-28) | Must | tous | CR-001/Q24 |
| REQ-019 | L'utilisateur peut exporter ses données et supprimer son compte (⚠ ZO-26) | Must | tous | CR-001/Q24 |
| REQ-020 | L'utilisateur accepte les conditions d'utilisation, avec l'avertissement et la clause de la règle R-14, pour finaliser son inscription (⚠ ZO-12) | Must | tous | CR-001/Q29 |

### Administration

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-021 | Seul un administrateur peut forcer ou corriger l'état d'un sentier (⚠ AMB-12, ZO-27) | Must | Administrateur | CR-001/Q36, Q42 |
| REQ-022 | L'administrateur crée, modifie et retire les alertes affichées aux utilisateurs (⚠ AMB-10) | Must | Administrateur | CR-001/Q42 |
| REQ-023 | Les critères de sécurité de chaque sentier du panel pilote sont consignés dans le référentiel des sentiers et validés par le client. Leur mode de mise à jour n'est pas défini : l'espace d'administration est limité aux statuts des sentiers et aux alertes (*CR-001/Q42*) (⚠ ZO-07, AMB-09) | Must | Équipe projet, client | CR-001/Q34, Q40 |

### Pêche — si le calendrier le permet (⚠ INC-01)

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-024 | L'application identifie les secteurs côtiers aux meilleures conditions pour la pêche du bord et pour la chasse sous-marine, selon le vent, la houle, la marée, le solunaire, la pluie et la clarté estimée de l'eau, et indique les critères qui l'expliquent (⚠ AMB-05, AMB-06, ZO-15, ZO-22, ZO-32) | Should | Patrice | CR-001/Q08, Q09, Q31 |
| REQ-025 | L'utilisateur saisit la date, son créneau disponible et son point de départ pour affiner la recommandation (⚠ ZO-34) | Should | Patrice | CR-001/Q12, Q13 |
| REQ-026 | Toute recommandation de pêche du bord ou de chasse sous-marine sur la côte ouest affiche l'alerte de la règle R-11 (⚠ AMB-17, AMB-21) | Should | Patrice | CR-001/Q10, Q32 |
| REQ-027 | Toute recommandation de chasse sous-marine affiche l'alerte de la règle R-15 et rappelle de vérifier la réglementation. La pêche du bord n'est pas concernée *(hypothèse de conception, en attente d'arbitrage)* (⚠ INC-07, AMB-18, ZO-11) | Should | Patrice | CR-001/Q10 |

### Comparaison entre activités

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-028 | À « Que voulez-vous faire aujourd'hui ? », l'application affiche un score comparatif justifié entre trail et pêche, pour la date, le temps disponible et le point de départ saisis, départagé si besoin par la règle R-12 (⚠ AMB-02, AMB-16, AMB-27, ZO-23, INC-01) | Could | tous | CR-001/§1, Q11, Q12, Q33, Q39 |

---

## 10. Exigences non fonctionnelles

| ID | Exigence | Comment on la vérifie | Source |
|---|---|---|---|
| REQ-101 | L'application est pleinement utilisable sur smartphone depuis un navigateur mobile, et propose l'installation sur l'écran d'accueil sur les navigateurs qui le permettent (⚠ ZO-13, AMB-23) | Parcours complet sur les smartphones de test, puis installation sur les navigateurs compatibles, par l'équipe, en dehors de la démonstration client (⚠ INC-11) | CR-001/Q01, Q27 |
| REQ-102 | Aucun coût récurrent pour les API et les données : uniquement des sources gratuites, dans la limite de leurs quotas (⚠ AMB-26 ; hébergement : ⚠ ZO-18) | Liste des sources avec leurs conditions d'utilisation ; estimation du nombre d'appels comparé aux quotas | CR-001/Q25, Q28 |
| REQ-103 | Si une source est indisponible ou trop ancienne, un message explicite s'affiche pour le secteur concerné, sans aucune valeur inventée (⚠ ZO-16) | Test en coupant chaque source, puis en simulant une donnée périmée | CR-001/Q26 |
| REQ-104 | Chaque information externe affichée (météo, données marines, état d'un sentier) indique sa date de mise à jour *(déduit de l'exigence de fraîcheur)* | Vérification de chaque écran | CR-001/Q25 |
| REQ-105 | Un utilisateur ne peut consulter, modifier, exporter ou supprimer que ses propres données | Test d'accès croisé entre deux comptes, pour chaque opération | CR-001/Q23, Q24 |
| REQ-106 | Seul le rôle administrateur accède à l'espace d'administration | Test d'accès avec un compte utilisateur ordinaire | CR-001/Q42 |
| REQ-107 | Les calculs de temps, d'eau, de nourriture et de sécurité donnent toujours le même résultat pour les mêmes entrées | Tests automatisés sur des jeux de données de référence | CR-001/Q21 |
| REQ-108 | Le découpage météo (zones géographiques, secteurs d'altitude, balises ⚠ AMB-22) et ses limites se paramètrent au déploiement, sans changer l'application, pour respecter les quotas des sources | Modification d'un paramètre, puis vérification de son effet | CR-001/Q38 |
| REQ-109 | Sans connexion, l'application indique clairement que les informations ne sont pas disponibles *(déduit, ⚠ AMB-23)* | Test en mode avion, par l'équipe (⚠ INC-11) | CR-001/Q27 |
| REQ-110 | Le fichier `.gpx` produit respecte le format standard | Contrôle du fichier, puis import sur les appareils de test (⚠ ZO-14) | CR-001/Q19 |
| REQ-111 | L'application peut être démontrée de bout en bout en local, sans mise en ligne publique | Démonstration au client dans le délai de 3 semaines (14/12/2026) | CR-001/Q37 |
| REQ-112 | Le volet pêche peut être livré ou non sans affecter le volet trail *(déduit)* | Démonstration complète du trail avec le volet pêche désactivé | CR-001/Q30 |
| REQ-113 | Chaque source de données retenue est documentée : producteur, fréquence de mise à jour, conditions d'utilisation et justification de sa fiabilité | Revue de la liste des sources avec le client | CR-001/Q25 |
| REQ-114 | Le compte est sécurisé : aucun mot de passe n'est conservé ni affiché en clair, et la connexion est temporairement bloquée après plusieurs échecs consécutifs (nombre d'échecs et durée à fixer) *(déduit de « compte utilisateur sécurisé »)* | Revue de la conservation des mots de passe ; test de connexions échouées répétées | CR-001/Q23 |

---

## 11. Questions restées ouvertes

Cette section recense les **incohérences** (deux réponses du CR-001 qui se contredisent), les **ambiguïtés** (une formulation qui peut se comprendre de plusieurs façons) et les **zones d'ombre** (des sujets non abordés mais nécessaires). Pour chaque point, l'hypothèse de la dernière colonne s'applique jusqu'à la réponse du client. Les points marqués *(connaissance extérieure au CR)* viennent de l'équipe, pas de l'entretien.

**À trancher en priorité au prochain entretien :** INC-01, INC-02, INC-03, AMB-13, AMB-14, AMB-15, AMB-19, ZO-02, ZO-03, ZO-05, ZO-07, ZO-11, ZO-17, ZO-18, ZO-20, ZO-26, ZO-31. Cette liste est identique à celle du CR-001 §5, avec en plus AMB-19 et ZO-31.

### 11.1 Incohérences

| # | Constat | Source | Réponse | Hypothèse retenue en attendant |
|---|---|---|---|---|
| INC-01 | La première version porte sur le trail (Q06) et l'intégration de la pêche n'est pas décidée (Q30). Pourtant le premier besoin exprimé est de savoir « quel sport est le plus propice », la première demande citée est une suggestion de trace (§1), et le classement des sports favoris dès l'inscription (Q39) n'a de sens que si la pêche existe. **Question :** la pêche, la comparaison entre activités et la suggestion de trace sont-elles attendues dans la livraison à 3 semaines ? | CR-001/§1, Q06, Q30, Q39 | en attente | Trail = Must. Pêche = Should, comparaison = Could. Pour le trail, explications (REQ-009), suggestion de trace (REQ-010), classement des sports favoris (REQ-017) et sorties multi-jours (REQ-030) = Should, points d'eau (REQ-014) = Could : ces priorités sont un choix de l'équipe, Q30 ne portant que sur la pêche. Le classement des sports n'a d'utilité que si la pêche est livrée |
| INC-02 | Le client décrit une application « assistée par IA » avec un « trajet conseillé par l'IA » (§1). Or Q21 exige des formules fixes pour les calculs physiologiques et sécuritaires, et réserve l'IA « à l'outillage de dev et à la génération de synthèses textuelles ». Une lecture possible : l'IA sert surtout à développer l'application, pas dans le produit. Par ailleurs, la question Q28 citait l'IA parmi les API payantes, et la réponse fixe 0 € de coût API. **Questions :** y a-t-il de l'IA dans le produit, ou seulement pour le développement ? Le client accepte-t-il que le trajet conseillé repose sur des règles fixes ? | CR-001/§1, Q21, Q28 | en attente | Trajet conseillé et verdict par règles fixes. Les explications (REQ-009) sont construites à partir de la règle déclenchée, par des textes types, sans coût. Une IA de rédaction n'est ajoutée que si elle est gratuite |
| INC-03 | L'application est ouverte au public (Q03), avec un compte sur plusieurs appareils (Q23). Mais le client veut la voir fonctionner en local avant tout investissement d'hébergement (Q37). « Livrer le projet » en 3 semaines (Q07) ne veut donc pas dire mettre l'application à disposition du public. **À confirmer :** le livrable à 3 semaines est-il la démonstration en local ? | CR-001/Q03, Q07, Q23, Q37 | en attente | Le livrable est une démonstration fonctionnelle en local. La mise en ligne publique fera l'objet d'une décision ultérieure, hors délai (⚠ ZO-18) |
| INC-04 | Le profil est « strictement limité » à 4 données (Q20), mais Q39 y ajoute le classement des sports favoris | CR-001/Q20, Q39 | en attente | Profil = 4 données + classement des sports. La date, l'heure, le temps disponible et le point de départ sont saisis à chaque recherche et ne font pas partie du profil |
| INC-05 | Le client a d'abord parlé de « météo sur les derniers jours » (§1), puis précisé vouloir les **prévisions** des prochains jours (Q13). Or la clarté de l'eau dépend des pluies récentes (Q31), et les règles de sécurité des sentiers (radiers, boue) dépendent aussi des pluies passées (Q34) | CR-001/§1, Q13, Q31, Q34 | en attente | Aucune série d'historique météo n'est affichée. Les pluies récentes servent au calcul de la clarté de l'eau et aux règles des sentiers, et peuvent être citées comme critère dans le verdict (REQ-029) et ses explications (REQ-009), sans afficher l'historique (⚠ ZO-32) |
| INC-06 | Q26 interdit toute extrapolation hasardeuse, alors que Q31 demande d'estimer la clarté de l'eau | CR-001/Q26, Q31 | en attente | Une estimation est permise si elle est présentée comme telle. L'interdiction vise le remplacement d'une donnée manquante |
| INC-07 | Q10 demande de signaler la Réserve marine **et le risque requin**. Q32 réduit cela à un message pour la côte ouest et ne parle plus du requin, alors que les côtes concernées couvrent toute l'île (Q09) | CR-001/Q09, Q10, Q32 | en attente | Message « Réserve marine » pour toute recommandation sur la côte ouest (R-11), et message « risque requin » pour toute recommandation de chasse sous-marine, quelle que soit la côte (R-15) |
| INC-08 | Le nombre de jours est au choix de l'utilisateur (Q18), mais les gîtes et abris n'ont pas été évoqués (Q17). Les prévisions ne couvrent par ailleurs qu'un nombre limité de jours | CR-001/Q13, Q17, Q18 | en attente | Itinéraire à la journée en Must (REQ-002). Sortie sur plusieurs jours en Should (REQ-030), dans la limite de l'horizon des prévisions : cette scission réduit la portée de Q18 (« au choix de l'utilisateur ») et reste à faire valider par le client. Eau et nourriture calculées pour la totalité de la sortie, aucun hébergement proposé (⚠ ZO-19) |
| INC-09 | Départ et arrivée sont libres (Q18), mais les règles de sécurité ne seront calibrées que pour le panel pilote (Q40). Le comportement hors panel n'est pas défini. Par ailleurs, « La Possession → Mafate » est un itinéraire, pas un sentier | CR-001/Q18, Q34, Q40 | en attente | Itinéraire, météo et `.gpx` disponibles sur tous les sentiers officiels. Le trajet conseillé est calculé seulement sur le panel pilote ; ailleurs, un message indique qu'il n'est pas disponible. Hors panel, le verdict (REQ-029) est donné à partir de la grille générale seule (ZO-17) et signalé comme tel. La recette (objectif 1) se fait sur le panel pilote |
| INC-10 | Q15 demande la météo heure par heure sur chaque tronçon. Q38 retient un découpage par zones (communes, secteurs d'altitude, balises) pour respecter les quotas. Les deux résolutions ne sont pas les mêmes | CR-001/Q15, Q38 | en attente | Chaque tronçon reçoit la météo de la zone qu'il traverse, à l'heure estimée de passage |
| INC-11 | La démonstration se fait en local (Q37), alors que l'application est orientée smartphone (Q01) et que le compte doit fonctionner sur plusieurs appareils (Q23). La démonstration ne permettra pas de tout montrer sur smartphone | CR-001/Q01, Q23, Q37 | en attente | La démonstration client se fait en local. L'équipe vérifie sur des appareils de test l'usage sur smartphone (REQ-101, REQ-109), l'accès au même compte depuis plusieurs appareils (REQ-015) et l'import du fichier `.gpx` (REQ-110). Leurs résultats sont présentés au client |

### 11.2 Ambiguïtés

| # | Constat | Source | Réponse | Hypothèse retenue en attendant |
|---|---|---|---|---|
| AMB-01 | « Une suggestion de trace d'environ 40/50 km » et « une trace sur mesure par rapport aux tracés de rando connus » décrivent une recherche **par distance**. Le parcours utilisateur, lui, demande **un départ et une arrivée**. S'agit-il de deux modes de recherche ? | CR-001/§1 | en attente | Mode départ → arrivée en Must. La suggestion par distance (REQ-010) est en Should |
| AMB-02 | À « Que voulez-vous faire aujourd'hui ? », est-ce l'utilisateur qui choisit l'activité ou l'application qui la recommande ? « Aujourd'hui » limite-t-il la recherche au jour même, alors que les prévisions portent sur les prochains jours ? | CR-001/§1, Q11, Q13 | en attente | L'utilisateur choisit une activité ou demande une comparaison. Il peut viser n'importe quelle date dans l'horizon des prévisions |
| AMB-03 | « Difficulté » : cotation officielle du sentier, ou difficulté ressentie selon le niveau de l'utilisateur (« itinéraires selon le niveau ») ? | CR-001/§1 | en attente | Cotation officielle du sentier, complétée par le temps estimé personnalisé |
| AMB-04 | Le trajet conseillé est-il toujours affiché, ou seulement quand une règle est déclenchée ? Peut-il proposer « un autre secteur » (question Q16) que celui choisi ? | CR-001/Q16, Q34 | en attente | Affiché seulement quand une règle est déclenchée ou qu'un sentier est fermé, et dans le même secteur |
| AMB-05 | « Meilleure côte » : de quelle échelle parle-t-on ? Une façade de l'île, une commune (« Saint-Paul », Q12) ou un spot précis ? | CR-001/§1, Q09, Q12 | en attente | Des secteurs côtiers à l'échelle de la commune |
| AMB-06 | La question Q08 cite le surfcasting et le lancer comme formes de pêche du bord. Toutes les formes de pêche du bord sont-elles concernées ? | CR-001/Q08 | en attente | Toute forme de pêche du bord est concernée |
| AMB-07 | « Prochains jours » : combien de jours de prévision ? | CR-001/Q13 | en attente | L'horizon maximal fourni par les sources retenues, affiché à l'utilisateur |
| AMB-08 | Quel tracé est exporté en `.gpx` : celui choisi par l'utilisateur ou le trajet conseillé ? Qui « valide » l'itinéraire ? | CR-001/Q19 | en attente | L'utilisateur valide l'un des deux tracés, et c'est celui-là qui est exporté |
| AMB-09 | Le panel pilote est cité avec « notamment » : la liste est-elle fermée ? | CR-001/Q40 | en attente | Trois parcours : La Possession → Mafate, Roche Écrite, Piton des Neiges. Liste à valider avant le calibrage |
| AMB-10 | Les « alertes » gérées par l'administrateur sont-elles des alertes sur les sentiers, la météo ou le littoral ? | CR-001/Q42 | en attente | Messages libres rattachés à un secteur et affichés aux utilisateurs concernés |
| AMB-11 | Le CR parle de l'heure de passage (Q15) sans dire comment elle tient compte du dénivelé et du terrain. Une estimation à partir de la seule VMA est peu fiable en montagne | CR-001/Q15, Q21 | en attente | Estimation à partir de la VMA, corrigée par le dénivelé selon une règle fixe (voir ZO-05) |
| AMB-12 | Quand l'administrateur force l'état d'un sentier, ce forçage dure-t-il jusqu'à ce qu'il le retire, ou jusqu'à la prochaine information automatique ? | CR-001/Q36 | en attente | Le forçage dure jusqu'à ce que l'administrateur le retire. Sa date est affichée |
| AMB-13 | « Trajet choisi par l'utilisateur » (§1) : qui le produit ? L'application à partir du départ et de l'arrivée, ou l'utilisateur en choisissant ses sentiers ? Peut-il passer par un sentier fermé, alors que Q34 cite un sentier fermé comme déclencheur du trajet conseillé ? Q16 ne limite que le trajet **conseillé** aux sentiers balisés | CR-001/§1, Q16, Q18, Q34 | en attente | L'application propose un trajet choisi sur sentiers officiels balisés, que l'utilisateur peut ajuster. Un sentier fermé y est signalé (REQ-004) et déclenche le trajet conseillé (REQ-008) |
| AMB-14 | Le client parle de « tracés de rando connus » (§1), mais limite le périmètre au trail et à la pêche (Q05). Les randonneurs font-ils partie du public visé ? | CR-001/§1, Q05 | en attente | Les randonneurs ne sont pas une cible. Les sentiers de randonnée balisés servent de réseau pour le trail |
| AMB-15 | Q12 prévoit la saisie du temps disponible « pour affiner la recommandation », dans le volet pêche. Vaut-elle aussi pour une sortie trail ? | CR-001/Q12 | en attente | Saisie facultative pour le trail. Si le temps estimé dépasse le temps disponible, l'application le signale |
| AMB-16 | « Conditions équivalentes » (Q33) : à partir de quel écart deux scores sont-ils considérés comme équivalents ? | CR-001/Q33 | en attente | Écart inférieur à un seuil paramétrable |
| AMB-17 | Q32 prévoit l'alerte Réserve marine « pour toute activité sur la côte ouest ». Concerne-t-elle seulement la pêche et la chasse sous-marine, ou aussi un parcours trail sur le littoral ouest ? | CR-001/Q32 | en attente | Seulement les recommandations de pêche et de chasse sous-marine |
| AMB-18 | L'alerte requin vise-t-elle aussi certaines formes de pêche du bord exposées (pieds dans l'eau, platier) ? *(connaissance extérieure au CR)* Q10 ne limite pas le requin à une pratique | CR-001/Q10 | en attente | Alerte requin seulement pour la chasse sous-marine (R-15). Choix de l'équipe, plus restrictif que Q10, à faire confirmer par le client |
| AMB-19 | Q06 : le client répond « le trail, avec le tracé GPX », alors que la question opposait « le GPX sur mesure » aux autres options. Cela peut désigner l'**export** d'un fichier `.gpx` ou la **trace sur mesure** (suggestion par distance, REQ-010). La seule demande concrète du client est « une suggestion de trace d'environ 40/50 km jusqu'à Mafate » (§1) | CR-001/§1, Q06, Q19 | en attente | Le « tracé GPX » est l'export d'une trace déterminée et validée par l'utilisateur (REQ-011), lecture retenue par l'équipe. La suggestion de trace par distance (REQ-010) reste en Should. À faire trancher en priorité |
| AMB-20 | « Sentier officiel balisé » n'est défini nulle part : quelle liste fait foi ? « Officiel » et « ouvert » sont-ils distincts ? La source libre du réseau (Q28) permet-elle de repérer le balisage ? | CR-001/Q16, Q28 | en attente | Le réseau est formé des sentiers de la source retenue ; leur liste est documentée avec REQ-113 |
| AMB-21 | « Côte ouest » n'est pas délimitée : quelles communes déclenchent l'alerte Réserve marine ? | CR-001/Q32 | en attente | Liste de communes paramétrable, validée par le client |
| AMB-22 | « Balises » dans le découpage météo : s'agit-il de stations météo ou du balisage des sentiers ? | CR-001/Q38 | en attente | Stations météo *(déduit du contexte)* |
| AMB-23 | Q27 : « pas de mode hors ligne **complexe** ». Un mode simple (liste d'équipement, quantités d'eau) consultable sans réseau est-il souhaité ? Q01 parle d'une « possibilité de PWA », Q27 d'une « PWA retenue » | CR-001/Q01, Q27 | en attente | Aucun mode hors ligne : l'application signale l'absence de connexion (REQ-109). L'installation sur l'écran d'accueil est proposée sur les navigateurs compatibles, sans critère de recette (C5, REQ-101) |
| AMB-24 | §1 : « adapte l'itinéraire aux conditions météo réelles ». « Réelles » désigne-t-il des observations ou des prévisions ? « Adapter » veut-il dire seulement changer de tracé, ou aussi proposer un autre horaire de départ ? | CR-001/§1, Q13, Q14 | en attente | Prévisions uniquement. L'adaptation consiste à changer de tracé (REQ-008), sans proposer d'horaire |
| AMB-25 | « Niveau » (§1 : « itinéraires selon le niveau », Q21) : comment se déduit-il du profil ? Comment l'âge, le poids et la taille entrent-ils dans les calculs ? | CR-001/§1, Q21 | en attente | Niveau dérivé de la VMA, en paliers fixes validés par le client (voir ZO-05) |
| AMB-26 | Q28 parle d'un « **objectif** 0 € ». Une source payante indispensable serait-elle refusée ou rediscutée avec le client ? | CR-001/Q28 | en attente | Contrainte traitée comme ferme : aucune source payante sans l'accord du client (voir ZO-15) |
| AMB-27 | Q11 : « en tenant compte des préférences de l'utilisateur ». S'agit-il du seul classement des sports, ou d'autres éléments du profil ? | CR-001/Q11 | en attente | Classement des sports seulement (R-12) |
| AMB-28 | Q24 : consentement « à l'inscription ». Ce n'est pas équivalent à « avant toute saisie » (REQ-018) si le profil est rempli après l'inscription | CR-001/Q24 | en attente | Consentement recueilli à l'inscription, et redemandé s'il est absent avant toute saisie de données de forme physique |

### 11.3 Zones d'ombre

| # | Sujet non abordé | Source | Réponse | Hypothèse retenue en attendant |
|---|---|---|---|---|
| ZO-01 | Identité et fonction du client, et outils qu'il utilise aujourd'hui pour préparer ses sorties. Sans cela, le problème (section 2) n'est que déduit | CR-001, en-tête, Q25 | en attente | Problème tel que formulé en section 2 |
| ZO-02 | Qui valide le livrable (Q04 sans réponse) et selon quels critères de recette (non précisés en Q07) | CR-001/Q04, Q07 | en attente | L'équipe rédige des scénarios de recette sur le panel pilote et les soumet au client pour accord avant le 30/11/2026 *(échéance fixée par l'équipe)* |
| ZO-03 | Échéance : 3 semaines depuis l'entretien donnent le 14/12/2026 ; le planning de l'équipe retient le 09/12/2026 | CR-001/Q07 | en attente | Échéance du client : 14/12/2026. Jalon interne de l'équipe : 09/12/2026, pour garder une marge |
| ZO-04 | Le client n'a pas cité la date et l'heure de départ comme données à saisir. Elles sont pourtant indispensables pour la météo à l'heure de passage | CR-001/Q15 | en attente | Saisie obligatoire, pré-remplie avec la date et l'heure courantes |
| ZO-05 | Contenu des règles de calcul du temps, de l'eau, de la nourriture et de sécurité, et qui les valide. La météo entre-t-elle dans le calcul des quantités ? Une erreur peut avoir des conséquences sur la santé | CR-001/Q21 | en attente | Règles tirées de références publiques, citées dans l'application et soumises à la validation du client. La chaleur prévue augmente la quantité d'eau |
| ZO-06 | Règles des conseils d'équipement : à partir de quels seuils recommander un vêtement de pluie, une casquette, des lunettes ? | CR-001/§1 | en attente | Grille simple (pluie, ensoleillement, température, vent) proposée par l'équipe et validée par le client |
| ZO-07 | Qui fournit les seuils de sécurité propres à chaque sentier (Q34) ? Cela demande une connaissance du terrain que l'équipe n'a pas | CR-001/Q34 | en attente | L'équipe propose des seuils pour les 3 parcours pilotes, le client les valide |
| ZO-08 | Qui tient le rôle d'administrateur après la livraison et met à jour l'état des sentiers, sans budget ? | CR-001/Q36, Q42 | en attente | Le client |
| ZO-09 | Que se passe-t-il si l'utilisateur ne connaît pas sa VMA ou ne remplit pas son profil ? La météo à l'heure de passage (R-03) a besoin d'une allure | CR-001/Q02, Q03, Q15 | en attente | Itinéraire et météo restent accessibles : l'heure de passage est estimée avec une allure de référence par défaut, signalée comme telle. Temps personnalisé et quantités ne sont calculés qu'avec un profil complet |
| ZO-10 | *(retiré)* Consultation sans compte | CR-001/Q23 | tranché : authentification obligatoire | Compte obligatoire pour toute utilisation (règle R-16) |
| ZO-11 | La réglementation préfectorale liée au risque requin encadre certaines activités nautiques à La Réunion et peut concerner la chasse sous-marine *(connaissance extérieure au CR)*. Recommander une côte pour la chasse sous-marine risque d'orienter vers une zone où elle est interdite. Le client connaît-il ces règles ? Faut-il exclure ces zones ? | CR-001/Q08, Q10 | en attente | Aucune recommandation de chasse sous-marine sans alerte réglementaire explicite. À confirmer avant toute mise en ligne |
| ZO-12 | Qui rédige et valide les conditions d'utilisation et la politique de confidentialité ? Qui est responsable du traitement des données au sens du RGPD ? La portée réelle de la clause de non-responsabilité (Q29) n'a pas été vérifiée | CR-001/Q24, Q29 | en attente | L'équipe fournit un modèle, le client le fait valider et en porte la responsabilité |
| ZO-13 | Exigences non abordées : temps de réponse, accessibilité, langues, smartphones et navigateurs pris en charge, nombre d'utilisateurs attendu | — | en attente | Français uniquement, smartphones récents, aucun engagement de nombre d'utilisateurs pour la démonstration |
| ZO-14 | Sur quelles montres ou quels GPS l'import du fichier `.gpx` doit-il être vérifié ? | CR-001/Q19 | en attente | Vérification sur les appareils dont dispose l'équipe |
| ZO-15 | Existe-t-il des sources gratuites pour la houle, les marées et le solunaire à La Réunion ? | CR-001/Q09, Q28 | en attente | Un critère sans source gratuite est retiré du calcul, et ce retrait est signalé à l'utilisateur |
| ZO-16 | À partir de quel âge une donnée est-elle « pas à jour » (Q26) ? | CR-001/Q26 | en attente | Seuil propre à chaque type de donnée, fixé par paramétrage |
| ZO-17 | Quels critères rendent la météo « idéale » pour un sentier (besoin du §1) ? Aucun critère de bonnes conditions n'est défini pour le trail, alors que REQ-028 suppose un score trail | CR-001/§1, Q34 | en attente | Verdict à trois niveaux (favorable, défavorable, à risque) à partir des règles du sentier et d'une grille générale (pluie, vent, chaleur) proposée par l'équipe et validée par le client |
| ZO-18 | Qui paie un éventuel hébergement après la démonstration en local ? Le budget nul (Q07) et l'objectif 0 € (Q28) portent sur la réalisation et les API, pas sur l'hébergement | CR-001/Q07, Q28, Q37 | en attente | Aucun hébergement payant engagé dans le délai. Décision du client après la démonstration |
| ZO-19 | Sorties sur plusieurs jours : comment calculer l'heure de passage les jours suivants (heure de fin d'étape, nuitée, heure de reprise) ? | CR-001/Q15, Q18 | en attente | L'utilisateur découpe sa sortie en étapes journalières avec une heure de départ par étape |
| ZO-20 | Vigilances officielles (fortes pluies, vent, houle, cyclone) et fermetures générales des sentiers par arrêté *(connaissance extérieure au CR)* : quel comportement ? | CR-001/Q25, Q26 | en attente | En cas de vigilance majeure sur le secteur, une alerte prioritaire s'affiche et aucune sortie n'est jugée favorable |
| ZO-21 | Que faire si aucun itinéraire valide n'existe (sentier unique fermé, dénivelé accepté trop faible) ? | CR-001/Q18, Q36 | en attente | Message explicite indiquant la contrainte bloquante |
| ZO-22 | Pêche du bord et chasse sous-marine : l'utilisateur choisit-il sa pratique lors de la recherche ? Le classement des sports favoris porte-t-il sur 2 sports ou 3 pratiques ? Que fait un utilisateur qui ne pratique qu'un sport ? | CR-001/Q08, Q33, Q39 | en attente | L'utilisateur choisit sa pratique à la recherche. Le classement porte sur trail, pêche du bord et chasse sous-marine ; une pratique peut être exclue |
| ZO-23 | Arbitrage trail / pêche : quels sentiers sont évalués côté trail ? Que répondre quand les conditions sont mauvaises pour les deux sports (Q11 : « ou mauvaises ») ? | CR-001/Q11, Q12 | en attente | Sentiers du panel pilote proches du point de départ. Si les deux activités sont défavorables, l'application le dit et ne recommande aucune sortie |
| ZO-24 | Quelles données sont retrouvées sur les autres appareils : profil seul, ou aussi les itinéraires préparés et les fichiers `.gpx` ? | CR-001/Q23 | en attente | Profil et classement des sports seulement |
| ZO-25 | Cycle de vie du compte : mot de passe oublié, changement d'identifiants, déconnexion | CR-001/Q23 | en attente | Parcours standards de création, connexion, déconnexion et réinitialisation du mot de passe |
| ZO-26 | RGPD : durée de conservation des données (posée en Q24, sans réponse), inscription des mineurs *(connaissance extérieure au CR)*, retrait du consentement sans suppression du compte, format de l'export | CR-001/Q24 | en attente | Inscription réservée aux 15 ans et plus. Le retrait du consentement efface les données de forme physique et désactive les calculs personnalisés. Durée de conservation fixée par le client. Export dans un format lisible et standard |
| ZO-27 | Création et gestion des comptes administrateur ; traçabilité des forçages d'état des sentiers (qui, quand, pourquoi) | CR-001/Q36, Q42 | en attente | Comptes administrateur créés par l'équipe. Chaque forçage enregistre son auteur, sa date et son motif |
| ZO-28 | Plages de valeurs acceptées pour l'âge, le poids, la taille et la VMA, pour éviter des calculs aberrants | CR-001/Q02, Q20 | en attente | Plages plausibles fixées par l'équipe ; une saisie hors plage est refusée avec un message |
| ZO-29 | Aller-retour : les mêmes tronçons sont parcourus à deux heures différentes. Comment afficher la météo des deux passages ? | CR-001/Q15, Q18 | en attente | Chaque passage est affiché séparément |
| ZO-30 | Le nom « MeteoSport » n'apparaît pas dans le CR-001 | CR-001, en-tête | en attente | Nom provisoire, à faire valider par le client |
| ZO-31 | Source de l'état des sentiers. REQ-003 et REQ-004 (Must) supposent une source automatique pour le réseau et l'état des sentiers (Q36 : « données automatisées »). Existe-t-il une source gratuite exploitable ? Sinon, l'administrateur devient la seule source | CR-001/Q25, Q36 | en attente | Source à identifier avant tout développement. À défaut, état saisi à la main par l'administrateur (REQ-021), ce qui pèse sur ZO-08 |
| ZO-32 | Source d'historique de pluie. Q31 et Q34 exigent les pluies récentes (24 à 48 h), alors que ZO-15 ne couvre que la houle, les marées et le solunaire | CR-001/Q31, Q34 | en attente | Même traitement que ZO-15 : un critère sans source gratuite est retiré du calcul et ce retrait est signalé |
| ZO-33 | Nature des données. Q24 parle de données « de forme physique et de santé ». L'âge, le poids et la VMA peuvent relever de données de santé au sens du RGPD *(connaissance extérieure au CR)* | CR-001/Q24 | en attente | Traité avec ZO-12 et ZO-26 : consentement explicite maintenu (R-13), qualification juridique à faire valider par le client |
| ZO-34 | Créneau de pêche et trajet. Le créneau d'une heure (Q12) inclut-il le trajet depuis le point de départ vers le secteur ? | CR-001/Q12 | en attente | Créneau = durée sur place, trajet en plus |
| ZO-35 | Faisabilité. 20 exigences fonctionnelles Must (compte, RGPD, administration, seuils par sentier, routage, météo horaire, GPX…) pour 3 personnes en 3 semaines, sans estimation de charge. Q30 signale le risque, mais le CDC ne l'évalue pas | CR-001/Q07, Q30 | en attente | La charge est chiffrée avant la présentation du CDC. En cas de dépassement, les Must sont arbitrés avec le client |

---

## 12. Validation client

| Version | Date | Présentée au client | Retour |
|---|---|---|---|
| v1 | 23/11/2026 | non | — |
| v1.1 | 23/11/2026 | non | — |

---

## 13. Journal des corrections

Corrections apportées le 23/11/2026 après les trois rapports de vérification (`collab/MaxLaMenace/rapport-verification-cdc-v1.md`, `collab/TiBenoit/rapport_de_v_rification_du_cdc_v1.md`, `collab/Ivan/rapport-coherence-cdc-cr.md`) et la correction du CR-001.

C-30 à C-47 : seconde série de corrections (passage en v1.1), issues des rapports `collab/Ivan/rapport-verification-cdc-cr.md`, `collab/MaxLaMenace/rapport-coherence-cr-cdc-v1.md` et `collab/TiBenoit/rapport-points-restants-cdc-cr.md`. Le détail est dans `collab/rapport-corrections-cdc-v1.1.md`.

| # | Correction | Origine |
|---|---|---|
| C-01 | Budget : « 0 € » limité à la réalisation et aux API ; hébergement non tranché (§1, C2, REQ-102, ZO-18) | Rapport Max H-01 |
| C-02 | « En local » réintroduit (§1, Obj 7, C8, REQ-111) ; INC-03 reformulé en point à confirmer | Rapport Max N-01 |
| C-03 | INC-02 réécrit : citation « trajet conseillé par l'IA » conservée (conforme aux propos du client rétablis dans le CR), lecture « outillage de dev », explications par textes types | Rapports Max H-02, TiBenoit §2.3 ; CR-001 corrigé |
| C-04 | Personas : éléments non sourcés marqués *(hypothèse)* ; Sarah devient traileuse débutante ; §1 et §4 ne disent plus que le client « pratique le trail » | Rapports Max H-03, H-04, TiBenoit §2.2 |
| C-05 | Randonnée traitée comme ambiguïté (AMB-14), « randonneurs » retirés des utilisateurs | Rapports Max H-06, TiBenoit §2.1 ; « tracés de rando » rétabli dans le CR |
| C-06 | REQ-023 requalifiée : critères consignés dans le référentiel, pas édités par l'administrateur | Rapports Max H-05, TiBenoit §2.1 |
| C-07 | « MeteoSport » signalé comme nom provisoire (ZO-30) | Rapport TiBenoit §2.1 |
| C-08 | Citations corrigées : côte ouest (Q32), microclimats (Q38), ZO-02 (Q07 répondu en partie), ZO-11 et AMB-18 marqués connaissance extérieure | Rapports Max H-06, TiBenoit §2.3 |
| C-09 | Obj 5 et REQ-024 : « classer avec un score argumenté » remplacé par l'identification des meilleurs secteurs et des critères en cause | Rapport TiBenoit §2.2 |
| C-10 | Calculs « sécuritaires » ajoutés (R-05, REQ-107, hors périmètre) | Rapport TiBenoit §3 |
| C-11 | Clause de non-responsabilité ajoutée à R-14 et REQ-020 | Rapport TiBenoit §3 |
| C-12 | Nouvelle exigence REQ-029 (conditions favorables ou non) et ZO-17 (critères trail) | Rapport Max N-03 |
| C-13 | Temps disponible pour le trail : AMB-15 et REQ-001 (la mention du créneau au §1 du CR n'était alors pas dans les propos du client ; le CR corrigé la cite désormais en verbatim, voir C-47) | Rapports Max N-02, TiBenoit §3 ; CR-001 corrigé |
| C-14 | REQ-028 complétée (date, temps disponible, point de départ) ; REQ-025 complétée (date) | Rapport TiBenoit §3 |
| C-15 | Nouvelle règle R-15 (risque requin) | Rapport TiBenoit §3 |
| C-16 | Fiabilité des sources (REQ-113, C3) ; données marines dans REQ-104 | Rapport TiBenoit §3 |
| C-17 | Hors périmètre complété (historique météo Q13, mesure directe de la clarté Q31, trajet conseillé hors panel Q40) ; §6 aligné sur la §9 (REQ-009, REQ-010, REQ-014, REQ-017, politique de confidentialité) | Rapports Max I-03, TiBenoit §3 et §4 |
| C-18 | Trajet choisi défini en hypothèse (AMB-13) ; R-01 extension signalée ; REQ-003 ne limite plus le trajet choisi aux sentiers ouverts ; REQ-008 déclenché aussi par un sentier fermé | Rapports Max I-01, TiBenoit §4 et §5 |
| C-19 | Granularité météo : INC-10, R-03 et REQ-007 par zone traversée | Rapport Max I-02 |
| C-20 | R-05 et REQ-013 alignés, la météo marquée comme déduite | Rapports Max I-04, TiBenoit §2.2 |
| C-21 | Vérifications sur smartphone en dehors de la démonstration locale (INC-11, REQ-101, REQ-109) | Rapport Max I-05 |
| C-22 | ZO-09 : allure de référence par défaut pour la météo à l'heure de passage | Rapport TiBenoit §4 |
| C-23 | Obj 1 aligné sur INC-09 (recette sur le panel pilote) | Rapport TiBenoit §4 |
| C-24 | REQ-105 étendue à la modification, l'export et la suppression ; colonne Persona complétée ; colonne « Posée le » renommée « Source » | Rapport TiBenoit §4 |
| C-25 | INC-04, INC-05, INC-06 et AMB-07 rattachés au corps du document | Rapport Max I-06 |
| C-26 | ZO-10 retirée (tranchée par Q23) ; INC-01 mentionne la suggestion de trace | Rapport Max §4 et N-04 |
| C-27 | Échéance fixée au 09/12/2026 (C1, ZO-03, Obj 7) | Décision de l'équipe |
| C-28 | Nouvelles entrées en section 11 : AMB-13 à AMB-18, ZO-17 à ZO-30 (conservation et compléments RGPD, seuil d'équivalence, pêche du bord / chasse sous-marine, arbitrage, plusieurs jours, vigilances, absence d'itinéraire, compte, administration, bornes du profil, aller-retour) | Rapports Max N-05, N-06, N-08, N-09, TiBenoit §5 |
| C-29 | REQ-112 (volet pêche indépendant du trail) | Rapport Max N-07 |
| C-30 | REQ-022 (alertes) et REQ-023 (critères de sécurité des sentiers) passées en Must et placées dans le périmètre prioritaire (§6). REQ-008 et REQ-029 ne reposent plus sur une exigence Should | Rapports Ivan P-01, P-02 ; Max INC-13 ; arbitrage du 23/11/2026 |
| C-31 | §6 : le volet trail secondaire (REQ-009, 010, 014, 017, 030) est séparé du volet pêche. Q30 ne justifie plus que le volet pêche ; la priorité des exigences trail est signalée comme un choix de l'équipe (INC-01) | Rapport Max INC-12 |
| C-32 | REQ-002 scindée : à la journée (Must) et nouvelle REQ-030 pour le multi-jours (Should). Cette scission réduit la portée de Q18 et reste à valider par le client (INC-08) | Rapport Thomas point 2 ; arbitrage du 23/11/2026 |
| C-33 | INC-11 ne cite plus Q41. REQ-015 ajoutée aux vérifications faites par l'équipe. REQ-110 rangée parmi les vérifications sur appareils de test | Rapports Ivan P-03, m-03 ; Max INC-14 ; Thomas point 4 |
| C-34 | Échéance du client (14/12/2026) distinguée du jalon interne de l'équipe (09/12/2026) : §1, objectif 7, C1, ZO-03, REQ-111. Remplace la formulation de C-27 | Rapports Ivan M-06 ; Thomas point 3 |
| C-35 | Prémisses de l'équipe marquées *(connaissance extérieure au CR)* : microclimats, rôle de l'ONF, état des sentiers, cirque de Mafate sans réseau (§1, C7, persona Julien) | Rapports Ivan M-03 ; Max §4 |
| C-36 | « Abris, gîtes et échappatoires » : hors périmètre signalé comme hypothèse de l'équipe, rattaché à INC-08 | Rapport Ivan M-04 |
| C-37 | Verdict hors panel pilote défini (grille générale seule, INC-09, REQ-029). Pluie récente citable comme critère sans afficher d'historique (INC-05, REQ-029) | Rapports Ivan M-05 ; Max INC-15 |
| C-38 | REQ-026 alignée sur R-11 : pêche et chasse sous-marine seulement | Rapport Max INC-16 |
| C-39 | C5 et REQ-101 : l'installation sur l'écran d'accueil est proposée sur les navigateurs compatibles, elle n'est plus un critère de recette | Rapports Thomas point 1 ; Max AMB-23 |
| C-40 | R-15, REQ-027 et AMB-18 : alerte requin limitée à la chasse sous-marine, signalée comme hypothèse de l'équipe plus restrictive que Q10 | Rapport Thomas point 5 ; arbitrage du 23/11/2026 |
| C-41 | Nouvelles entrées en §11 : AMB-19 à AMB-28 (dont le « tracé GPX » de Q06, hypothèse : export du fichier `.gpx`, REQ-010 reste Should) et ZO-31 à ZO-35 (source de l'état des sentiers, source de pluie, données de santé, créneau de pêche, faisabilité) | Rapport Max AMB-19 à AMB-28, ZO-31, 32, 34, 35, 36 ; arbitrage du 23/11/2026 |
| C-42 | Nouvelle règle R-16 : compte obligatoire pour toute utilisation. ZO-10 y renvoie | Rapport Max ZO-33 |
| C-43 | Nouvelle exigence REQ-114 : sécurité du compte *(déduit)* | Rapport Ivan m-04 |
| C-44 | INC-01 : justification du classement des sports favoris harmonisée avec la priorité Should de REQ-017 | Rapport Ivan m-05 |
| C-45 | En-tête : passage en v1.1, chemin complet de la source ; ligne v1.1 ajoutée au §12 | Rapport Ivan m-01, m-02 |
| C-46 | Liste « à trancher en priorité » de §11 alignée sur le CR §5, avec AMB-19 et ZO-31 en plus | Rapport Ivan m-07 ; Max INC-17 |
| C-47 | C-13 annotée : le CR corrigé cite le créneau de pêche en verbatim (§1 et Q12). À vérifier avec les notes d'entretien | Rapport Max INC-18 |
