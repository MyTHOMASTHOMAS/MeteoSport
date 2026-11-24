# Cahier des charges — MeteoSport

**Équipe :** Maxime, Thomas, Ivan
**Version :** v1.2 — 24/11/2026 (report des réponses aux points de la section 11, voir section 13)
**Sources :** `tdd/docs/cr/cr-001.md` (entretien du 23/11/2026 ; arbitrages de l'équipe du 24/11/2026 en §5 du CR)

Ce document formalise le **problème compris**, pas la solution. Aucun nom de technologie, aucun nom de framework, aucune structure de base de données ici.

> **Statut :** brouillon, pas encore présenté au client.
> Le marqueur ⚠ renvoie à un point de la section 11 : une incohérence (`INC-nn`), une ambiguïté (`AMB-nn`) ou une zone d'ombre (`ZO-nn`). Tous ces points ont été tranchés par l'équipe le 24/11/2026 et la section 11 donne la décision retenue. Les décisions qui s'écartent d'une réponse du CR-001 sont listées en §11.4 : elles doivent être confirmées par le client.
> La mention *(hypothèse)* ou *(déduit)* signale un élément proposé par l'équipe, qui ne vient pas directement du client.

---

## 1. Contexte

Le client, Maximilien (fonction à préciser, ⚠ ZO-01), habite La Possession, à La Réunion. Il souhaite « une suggestion de trace d'environ 40/50 km jusqu'à Mafate » et évoque aussi un créneau pour pêcher sur Saint-Paul (*CR-001/§1, Q12*). Il demande une application qui aide les pratiquants de **trail** et de **pêche** à décider quand et où sortir en fonction de la météo (*CR-001/§1, Q05*). L'application est destinée au **public**, pas seulement à son usage personnel (*CR-001/Q03*). Pour préparer ses sorties, il utilise aujourd'hui les sites Windy et Randopéi (⚠ ZO-01).

Le terrain impose plusieurs contraintes :

- **Relief et microclimats.** Le relief de l'île crée des microclimats marqués *(prémisse de l'équipe, connaissance extérieure au CR)* : la météo d'un point ne vaut pas pour tout un parcours. Le client demande une météo heure par heure le long du parcours et un découpage par zones (*CR-001/Q15, Q38*).
- **Zones sans réseau.** En zone blanche, l'application ne fonctionne pas et le fichier `.gpx` sur montre ou GPS prend le relais (*CR-001/Q27*). Le cirque de Mafate en est un exemple *(cité dans la question de l'équipe, connaissance extérieure au CR)*.
- **État des sentiers.** L'ouverture ou la fermeture des sentiers est décidée par l'ONF *(connaissance extérieure au CR)*. Ces décisions ne sont pas toujours publiées sous une forme exploitable automatiquement *(prémisse posée par l'équipe en Q36)*. Un administrateur doit donc pouvoir forcer ou corriger l'état d'un sentier si les données automatisées ne sont pas à jour (*CR-001/Q36*). Si aucune source automatique n'est trouvée, l'administrateur saisit l'état à la main (⚠ ZO-31).
- **Littoral réglementé.** La Réserve naturelle marine est présente sur la côte ouest (*CR-001/Q32*), et le risque requin doit être signalé (*CR-001/Q10*). Ces informations sont diffusées par des alertes que l'administrateur rattache aux spots de pêche concernés (⚠ INC-07).

Il n'y a **aucun budget** de réalisation et **aucune source payante** n'est admise : 0 € de coût récurrent pour les API et les données (*CR-001/Q07, Q28*, ⚠ AMB-26). Avant tout investissement dans un hébergement, le client veut voir l'application fonctionner **en local** (*CR-001/Q37*). Aucun hébergement payant n'est engagé pour cette démonstration ; la suite relève d'une décision du client (⚠ ZO-18). Le délai de réalisation est suivi dans le planning du projet, pas dans ce document (⚠ ZO-03).

---

## 2. Problème

Le client prépare aujourd'hui ses sorties avec Windy (prévisions météo) et Randopéi (descriptions de randonnées à La Réunion) *(nature des deux sites : connaissance extérieure au CR)* (⚠ ZO-01). Le problème ci-dessous est **déduit des besoins exprimés** et doit être confirmé.

Aujourd'hui, pour préparer une sortie, un pratiquant doit croiser lui-même des informations dispersées : prévisions météo, ouverture des sentiers, état de la mer. Il ne peut pas :

- savoir si la météo est idéale pour pratiquer un sentier choisi (*CR-001/§1*) ;
- savoir, pour un parcours donné, quel temps il fera à chaque endroit **au moment où il y passera** (*CR-001/Q15*) ;
- obtenir un itinéraire de remplacement plus sûr quand les conditions se dégradent sur son parcours (*CR-001/§1, Q16*) ;
- savoir quel équipement, quelle quantité d'eau et quelle quantité de nourriture emporter (*CR-001/§1, Q21*) ;
- savoir quel endroit de la côte a les meilleures conditions pour la pêche, ni quelle activité est la plus propice ce jour-là (*CR-001/§1, Q09, Q11*).

---

## 3. Objectifs

| # | Objectif | Comment on saura que c'est atteint |
|---|---|---|
| 1 | Préparer une sortie trail sur sentiers officiels en connaissant la météo le long du parcours | Pour un départ et une arrivée du panel pilote, ou une distance souhaitée, l'utilisateur obtient pour le jour même un itinéraire sur sentiers officiels balisés, l'état de chaque sentier emprunté et la météo prévue de chaque zone traversée à l'heure estimée de passage (*CR-001/§1, Q06, Q15, Q16, Q38, Q40*, ⚠ AMB-01, AMB-02, INC-09) |
| 2 | Savoir si la météo convient au parcours et disposer d'une solution plus sûre | L'application indique si les conditions prévues sont favorables, défavorables ou à risque (⚠ ZO-17). Quand un sentier du trajet choisi est désactivé, un trajet conseillé sur sentiers balisés s'affiche à côté du trajet choisi (*CR-001/§1, Q16, Q34*, ⚠ AMB-04) |
| 3 | Emporter le bon équipement et les bonnes quantités | Pour un itinéraire validé, l'application affiche une liste d'équipement adaptée à la météo prévue et des quantités d'eau et de nourriture calculées par des règles fixes à partir du profil ou des valeurs par défaut (*CR-001/§1, Q06, Q21*, ⚠ ZO-09) |
| 4 | Suivre l'itinéraire sur sa montre | Le fichier `.gpx` téléchargé s'importe sans erreur sur les appareils de test de l'équipe (*CR-001/§1, Q19*, ⚠ ZO-14) |
| 5 | Choisir le spot le plus favorable pour pêcher | Pour le jour même, un créneau et un point de départ, l'application indique les spots de pêche aux meilleures conditions et les critères qui l'expliquent (*CR-001/§1, Q09, Q12*, ⚠ AMB-05) |
| 6 | Savoir quelle activité est la plus propice | L'application affiche un score comparatif justifié entre trail et pêche (*CR-001/Q11, Q33*) |
| 7 | Démontrer l'application sans coût | Démonstration en local validée par le client sur les scénarios de recette du panel pilote, sans dépense de réalisation ni coût d'API (*CR-001/Q07, Q28, Q37*, ⚠ INC-03, ZO-02) |

---

## 4. Parties prenantes

| Partie prenante | Rôle | Ce qu'elle attend | Utilise l'application ? |
|---|---|---|---|
| Client | Commanditaire du projet : Maximilien, fonction à préciser (⚠ ZO-01). Valide les scénarios de recette (⚠ ZO-02) ; le décideur final n'a pas été confirmé (*CR-001/Q04*) | Une démonstration fonctionnelle en local, sans coût | oui (cite une sortie vers Mafate et un créneau de pêche, *CR-001/§1, Q12*) |
| Pratiquants (public) | Utilisateurs finaux : traileurs et randonneurs, qui forment un même public (⚠ AMB-14), pêcheurs du bord et chasseurs sous-marins (*CR-001/Q03, Q05, Q08*) | Préparer leurs sorties en sécurité | oui |
| Administrateur | Le client (⚠ ZO-08), avec des comptes créés par l'équipe (⚠ ZO-27). Corrige l'état des sentiers et gère les alertes (*CR-001/Q36, Q42*) | Pouvoir corriger rapidement une information erronée | oui (espace d'administration) |
| Équipe projet | Conçoit, réalise et livre l'application | Un périmètre stable et des critères de recette clairs | non |
| Producteurs de données (ONF, Préfecture, services météo, données marines) | Sources externes non imposées par le client (*CR-001/Q25*) | — | non |
| Autorités (Réserve naturelle marine, préfecture) | Fixent la réglementation du littoral (*CR-001/Q10, Q32*) | Respect de la réglementation | non |

---

## 5. Personas

Ces personas sont construits par l'équipe. Les éléments marqués *(hypothèse)* ne viennent pas du CR-001. Ils restent à valider avec le client.

### Julien — traileur confirmé *(inspiré du client)*
- **Contexte d'usage :** habite La Possession et cherche des traces d'environ 40 à 50 km, par exemple jusqu'à Mafate (*CR-001/§1*). Suit son itinéraire sur sa montre grâce au fichier GPX (*CR-001/§1, Q19*). N'a plus de réseau une fois dans le cirque *(connaissance extérieure au CR ; les zones blanches viennent de CR-001/Q27)*. Prépare ses sorties depuis son smartphone *(hypothèse)*.
- **Objectif :** obtenir un itinéraire sur sentiers officiels, adapté à la météo prévue et à son niveau, le charger sur sa montre et savoir quoi emporter.
- **Ce qui le bloque aujourd'hui :** il croise lui-même un site de prévisions météo et un site de randonnée (⚠ ZO-01), sans savoir quel temps il fera à chaque endroit au moment où il y passera *(hypothèse)*.

### Sarah — randonneuse qui débute en trail *(hypothèse, déduit de CR-001/Q03 et AMB-14)*
- **Contexte d'usage :** fait partie du public visé, a un niveau modeste et ne connaît pas sa VMA. Elle ne la renseigne pas : l'application utilise une allure par défaut et le lui signale (⚠ ZO-09) *(hypothèse)*.
- **Objectif :** trouver une sortie adaptée à son niveau et à la météo, sans prendre de risque (*CR-001/§1* : « itinéraires selon le niveau »).
- **Ce qui la bloque aujourd'hui :** évaluer la durée et la difficulté réelles d'un parcours et la quantité d'eau à emporter *(hypothèse)*.

### Patrice — pêcheur du bord et chasseur sous-marin *(CR-001/Q08, Q12)*
- **Contexte d'usage :** exemple cité par le client : « J'ai un créneau d'une heure pour pêcher sur Saint-Paul » (*CR-001/Q12*). Décide souvent au dernier moment *(hypothèse)*.
- **Objectif :** savoir quel spot de pêche offre les meilleures conditions pendant son créneau, en étant averti de la réglementation (*CR-001/Q09, Q10*).
- **Ce qui le bloque aujourd'hui :** croiser lui-même le vent, la houle, la marée et la clarté de l'eau après la pluie *(hypothèse)*.

---

## 6. Périmètre

### Dans le périmètre

Toutes les exigences fonctionnelles sont en **Must** (⚠ INC-01).

**Trail et randonnée**
- Recherche d'un itinéraire pour le jour même entre un départ et une arrivée, en aller simple ou en aller-retour, avec un dénivelé accepté (*CR-001/§1, Q18*, ⚠ AMB-02, INC-08) — REQ-001 à REQ-003
- Suggestion de trace selon une distance ou un niveau, second mode de recherche (*CR-001/§1*, ⚠ AMB-01) — REQ-010
- Affichage de l'état des sentiers, du temps de parcours et de la difficulté (*CR-001/§1*) — REQ-004 à REQ-006
- Météo heure par heure le long du parcours, et prévisions affichées sur 3 jours (*CR-001/Q13, Q15*, ⚠ AMB-07) — REQ-007, REQ-031
- Indication des conditions favorables, défavorables ou à risque pour l'itinéraire (*CR-001/§1*) — REQ-029
- Trajet conseillé, uniquement sur sentiers officiels balisés du panel pilote (*CR-001/Q16, Q34, Q40*) — REQ-008
- Explication en langage courant du trajet conseillé et du verdict (*CR-001/Q21*) — REQ-009
- Téléchargement de l'itinéraire validé au format `.gpx` (*CR-001/Q19*) — REQ-011
- Conseils d'équipement et quantités d'eau et de nourriture (*CR-001/Q06, Q21*) — REQ-012, REQ-013
- Points d'eau potable, à titre indicatif (*CR-001/Q17, Q35*) — REQ-014

**Pêche**
- Recommandation de spot de pêche pour le jour même, selon le créneau et le point de départ (*CR-001/Q08, Q09, Q12, Q31*, ⚠ ZO-22) — REQ-024, REQ-025
- Alertes rattachées aux sentiers et aux spots, dont la Réserve naturelle marine et le risque requin (*CR-001/Q10, Q32*, ⚠ INC-07) — REQ-026, REQ-027

**Comparaison entre activités**
- Score comparatif justifié entre trail et pêche (*CR-001/Q11, Q33*) — REQ-028

**Compte et profil**
- Compte utilisateur, avec le profil et le classement des sports sur tous ses appareils (*CR-001/Q23*) — REQ-015
- Profil facultatif (âge, poids, taille, VMA) et classement des sports favoris (*CR-001/Q02, Q20, Q39*) — REQ-016, REQ-017
- Consentement, politique de confidentialité, conditions d'utilisation, export et suppression du compte (*CR-001/Q24, Q29*) — REQ-018 à REQ-020

**Administration et référentiels**
- Espace d'administration : état des sentiers et alertes (*CR-001/Q36, Q42*) — REQ-021, REQ-022
- Référentiels internes des sentiers officiels et des spots de pêche (⚠ AMB-05, AMB-20) — REQ-032
- Critères de sécurité de chaque parcours du panel pilote, consignés dans le référentiel des sentiers (*CR-001/Q34, Q40*) — REQ-023

### Hors périmètre

| Élément écarté | Motif | Source |
|---|---|---|
| Autres sports que le trail (randonnée comprise) et la pêche | Choix du client ; les randonneurs font partie du public du trail (⚠ AMB-14) | CR-001/Q05 |
| Zones hors de La Réunion | Choix du client | CR-001/Q05 |
| Pêche en bateau et en kayak | Pas retenues « pour commencer » | CR-001/Q08 |
| Distinction entre techniques de pêche (lancer, surfcasting, chasse sous-marine…) | Un seul type « spot de pêche » (⚠ AMB-06, ZO-22) | CR-001/Q08 |
| Recherche ou recommandation pour un autre jour que le jour même | Recherche bornée à aujourd'hui ; les prévisions restent consultables sur 3 jours (⚠ AMB-02, AMB-07) | CR-001/§1, Q13 |
| Sorties sur plusieurs jours, étapes, abris, gîtes et échappatoires | Option la plus simple retenue par l'équipe (⚠ INC-08, ZO-19) | CR-001/Q17, Q18 |
| Affichage de l'historique météo | Le client veut les prévisions des prochains jours ; les pluies récentes restent un critère interne (⚠ INC-05) | CR-001/Q13 |
| Adaptation de l'itinéraire pendant la sortie | Adaptation seulement pendant la préparation | CR-001/Q14 |
| Proposition d'un autre horaire de départ | Adapter l'itinéraire veut dire changer de tracé (⚠ AMB-24) | CR-001/§1, Q14 |
| Trajet conseillé hors sentiers officiels balisés | Sécurité | CR-001/Q16 |
| Sentiers et spots absents des référentiels internes | Seuls les sentiers et spots chargés dans l'application sont proposés (⚠ AMB-20) | CR-001/Q16 |
| Envoi direct de l'itinéraire sur la montre | Le téléchargement du fichier `.gpx` suffit | CR-001/Q19 |
| Données de profil autres que les 4 de base et les sports favoris | Inscription simplifiée, moins de données personnelles | CR-001/Q20, Q39 |
| Calculs physiologiques et de sécurité confiés à une IA | Règles de calcul fixes exigées | CR-001/Q21 |
| Apprentissage à partir des retours après chaque sortie | Mise à jour manuelle du profil uniquement | CR-001/Q22 |
| Consultation hors connexion | Le fichier `.gpx` prend le relais sur le terrain (⚠ AMB-23) | CR-001/Q27 |
| Mesure directe de la clarté de l'eau | Estimée à partir des pluies récentes | CR-001/Q31 |
| Carte précise des zones réglementées en mer | Remplacée par des alertes rattachées aux spots (⚠ INC-07) | CR-001/Q32 |
| Source de données payante | Contrainte ferme (⚠ AMB-26) | CR-001/Q28 |
| Mise en ligne publique avant validation de la démonstration en local | Le client veut d'abord voir l'application fonctionner en local | CR-001/Q37 |
| Trajet conseillé sur les sentiers hors panel pilote | Règles de sécurité calibrées seulement sur le panel pilote | CR-001/Q40, ⚠ INC-09 |

---

## 7. Contraintes

| # | Contrainte | Nature | Source |
|---|---|---|---|
| 1 | *(retirée en v1.2 : le délai de livraison est suivi dans le planning du projet, ⚠ ZO-03)* | — | CR-001/Q07 |
| 2 | Aucun budget de réalisation. Aucun coût récurrent pour les API et les données : aucune source payante n'est admise (⚠ AMB-26). Aucun hébergement payant pour la démonstration en local ; la suite relève d'une décision du client (⚠ ZO-18) | stratégique | CR-001/Q07, Q28, Q37 |
| 3 | Uniquement des sources de données gratuites ou ouvertes, fiables et à jour, dans la limite de leurs quotas d'utilisation | technique | CR-001/Q25, Q28, Q38 |
| 4 | Territoire couvert : La Réunion uniquement | métier | CR-001/Q05 |
| 5 | Application web orientée mobile. L'installation sur l'écran d'accueil est proposée à titre ergonomique, sur les navigateurs qui le permettent (⚠ ZO-13, AMB-23) | technique | CR-001/Q01, Q27 |
| 6 | Connexion internet nécessaire. Sur le terrain, en zone sans réseau, seul le fichier `.gpx` est disponible | physique | CR-001/Q27 |
| 7 | Microclimats marqués *(prémisse de l'équipe, connaissance extérieure au CR)* : la météo d'un point ne vaut pas pour tout le parcours | physique | CR-001/Q15, Q38 |
| 8 | Validation par une démonstration en local avant tout investissement d'hébergement et toute mise en ligne (⚠ INC-03, INC-11) | stratégique | CR-001/Q37 |
| 9 | Données personnelles de forme physique soumises au RGPD (⚠ ZO-26, ZO-33) | réglementaire | CR-001/Q24 |
| 10 | Réglementation du littoral : Réserve naturelle marine et risque requin, signalés par des alertes (⚠ INC-07) | réglementaire | CR-001/Q10, Q32 |

---

## 8. Règles métier

| # | Règle | Source |
|---|---|---|
| R-01 | Le trajet choisi et le trajet conseillé n'empruntent que des sentiers officiels balisés. Font foi les sentiers du référentiel interne (REQ-032, ⚠ AMB-13, AMB-20) | CR-001/Q16 |
| R-02 | Un sentier est disponible par défaut. Il est désactivé quand l'une de ses règles de sécurité est déclenchée ou qu'il est déclaré fermé. Un sentier désactivé n'est jamais proposé dans un trajet conseillé ; dans le trajet choisi, il reste affiché avec une alerte (⚠ AMB-04, AMB-13) | CR-001/Q34, Q36 |
| R-03 | La météo d'un tronçon est celle prévue, pour la zone météo qu'il traverse, à l'heure estimée de passage sur ce tronçon. Les zones sont des communes, des secteurs d'altitude ou des stations météo (⚠ INC-10, AMB-22) | CR-001/Q15, Q38 |
| R-04 | L'itinéraire est adapté à la météo seulement pendant la préparation, jamais pendant la sortie. Adapter veut dire changer de tracé, à partir des prévisions et des règles des sentiers, sans proposer d'autre horaire (⚠ AMB-24) | CR-001/Q14 |
| R-05 | Le temps de parcours, les quantités d'eau et de nourriture et les calculs de sécurité (règles des sentiers, verdict sur les conditions) sont faits par des règles fixes, tirées de références publiques citées et validées par le client. La chaleur prévue augmente la quantité d'eau. Une IA ne fait jamais ces calculs (⚠ ZO-05) | CR-001/Q21 |
| R-06 | Les critères qui déclenchent un trajet conseillé sont propres à chaque sentier (radiers, boue, ravines) et figurent dans le référentiel des sentiers | CR-001/Q34 |
| R-07 | Si une source de données est indisponible ou pas à jour, l'application l'indique clairement pour le secteur concerné et n'invente aucune valeur de remplacement. L'âge au-delà duquel une donnée n'est plus à jour est paramétré pour chaque type de donnée (⚠ INC-06, ZO-16) | CR-001/Q26 |
| R-08 | Quand l'administrateur force l'état d'un sentier, cet état remplace l'information reçue automatiquement, pour la durée qu'il fixe ou jusqu'à ce qu'il le retire. Chaque forçage enregistre son auteur, sa date et son motif (⚠ AMB-12, ZO-27) | CR-001/Q36 |
| R-09 | Les points d'eau sont toujours accompagnés d'un avertissement : leur disponibilité peut varier, il faut emporter toute sa réserve d'eau | CR-001/Q35 |
| R-10 | La clarté de l'eau est estimée à partir des pluies récentes sur les bassins versants côtiers, et présentée comme une estimation. Les pluies récentes proviennent d'un historique que l'application constitue en conservant les données reçues des sources météo. Si cette donnée manque, la clarté est affichée comme indisponible, sans estimation (⚠ INC-05, INC-06, ZO-32) | CR-001/Q31 |
| R-11 | L'administrateur rattache chaque alerte à une ou plusieurs activités précises (sentier ou spot de pêche), choisies une par une, pour une durée fixée ou sans limite. Une alerte en cours s'affiche sur la page de chaque activité concernée et dans toute recommandation qui la propose. La présence de la Réserve naturelle marine et le risque requin sont des alertes de ce type, sans traitement particulier (⚠ INC-07, AMB-10, AMB-12, AMB-17, AMB-18, AMB-21) | CR-001/Q10, Q32, Q42 |
| R-12 | Quand l'écart entre les scores du trail et de la pêche est inférieur à un seuil paramétrable, seul l'ordre des sports favoris du profil les départage (⚠ AMB-16, AMB-27) | CR-001/Q11, Q33, Q39 |
| R-13 | Le consentement explicite aux données de forme physique est recueilli dans le parcours de création du compte. Ces données ne sont enregistrées qu'avec ce consentement. Son retrait les efface et les valeurs par défaut s'appliquent (R-17, ⚠ AMB-28, ZO-26) | CR-001/Q24 |
| R-14 | L'inscription n'aboutit qu'après acceptation des conditions d'utilisation. Elles précisent que l'application est une aide à la décision indicative, qu'elle ne remplace pas les bulletins officiels, et contiennent une clause de non-responsabilité en cas d'accident | CR-001/Q29 |
| R-15 | *(supprimée en v1.2 : le risque requin relève des alertes de la règle R-11)* | CR-001/Q10 |
| R-16 | Toute utilisation de l'application exige un compte authentifié : aucune consultation sans compte | CR-001/Q23 |
| R-17 | Les données du profil (âge, poids, taille, VMA) sont facultatives. Une donnée absente est remplacée par une valeur par défaut paramétrable, et l'utilisateur en est averti. Le temps de parcours et les quantités ne sont personnalisés que si le profil est renseigné (⚠ ZO-09, AMB-28) | CR-001/Q02, Q20 |
| R-18 | La recherche d'itinéraire et la recommandation d'activité portent sur le jour même. Les prévisions météo sont consultables sur 3 jours, du jour même au surlendemain (⚠ AMB-02, AMB-07, INC-08) | CR-001/§1, Q13 |
| R-19 | Le verdict sur les conditions a trois niveaux : favorable, défavorable, à risque. Il s'appuie sur les règles du sentier et sur une grille générale (pluie, vent, chaleur). Hors panel pilote, il repose sur la grille générale seule et porte la mention « indicatif, sentier non calibré ». En cas de vigilance officielle majeure sur le secteur, une alerte prioritaire s'affiche et aucune sortie n'est jugée favorable (⚠ ZO-17, ZO-20, INC-09) | CR-001/§1, Q34, Q40 |
| R-20 | Le niveau de l'utilisateur se déduit de sa VMA, par paliers paramétrables. La difficulté d'un sentier est sa cotation officielle : le profil influe sur le temps de parcours, pas sur la difficulté (⚠ AMB-03, AMB-25) | CR-001/§1, Q21 |

---

## 9. Exigences fonctionnelles

### Trail

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-001 | L'utilisateur saisit un point de départ, un point d'arrivée et une heure de départ, pré-remplie avec l'heure courante. La date est celle du jour (R-18, ⚠ ZO-04, AMB-02, AMB-15) | Must | Julien, Sarah | CR-001/§1, Q15, Q18 |
| REQ-002 | L'utilisateur choisit entre aller simple et aller-retour, pour une sortie à la journée, et le dénivelé accepté. En aller-retour, la météo de chaque passage est affichée séparément (⚠ INC-08, ZO-29) | Must | Julien, Sarah | CR-001/Q15, Q18 |
| REQ-003 | L'application construit un itinéraire sur les sentiers officiels balisés du référentiel (R-01), que l'utilisateur peut ajuster. Si aucun itinéraire valide n'existe, elle indique la contrainte bloquante et propose un parcours proche réalisable (⚠ AMB-13, AMB-20, ZO-21) | Must | Julien, Sarah | CR-001/Q16, Q18 |
| REQ-004 | L'application affiche, pour chaque sentier emprunté, son état (ouvert, fermé, ou désactivé par une règle de sécurité) et la date de cette information *(date : déduit de l'exigence de fraîcheur)*. Un sentier fermé ou désactivé est signalé par une alerte (R-02, ⚠ ZO-31) | Must | Julien, Sarah | CR-001/§1, Q25, Q26, Q36 |
| REQ-005 | L'application affiche le temps de parcours estimé, calculé à partir de la VMA et corrigé par le dénivelé selon une règle fixe. Sans VMA, une allure par défaut s'applique (R-17). Les règles de calcul couvrent l'allure de randonnée comme celle de trail (⚠ AMB-11, AMB-14, ZO-09) | Must | Julien, Sarah | CR-001/§1, Q21 |
| REQ-006 | L'application affiche la difficulté du parcours, c'est-à-dire la cotation officielle enregistrée dans le référentiel des sentiers (R-20, ⚠ AMB-03) | Must | Julien, Sarah | CR-001/§1 |
| REQ-007 | L'application affiche la météo prévue heure par heure pour chaque zone traversée, à l'heure estimée de passage (R-03, ⚠ INC-10, AMB-22) | Must | Julien, Sarah | CR-001/Q13, Q15, Q38 |
| REQ-008 | Quand un sentier du trajet choisi est désactivé (R-02), l'application affiche un trajet conseillé à côté du trajet choisi. Ce trajet respecte les filtres choisis par l'utilisateur (difficulté…) et peut se situer dans un autre secteur. Il n'est calculé que sur le panel pilote ; ailleurs, un message indique qu'il n'est pas disponible (⚠ AMB-04, AMB-09, AMB-13, INC-09) | Must | Julien, Sarah | CR-001/§1, Q16, Q34, Q40 |
| REQ-009 | L'application explique en langage courant pourquoi le trajet conseillé diffère du trajet choisi et pourquoi les conditions sont jugées favorables ou non. Ces explications sont rédigées par une IA seulement si elle est gratuite, sinon par des textes types (⚠ INC-02) | Must | Julien, Sarah | CR-001/Q21 |
| REQ-010 | Second mode de recherche : l'application suggère une trace selon une distance ou un niveau souhaité, par exemple environ 40 à 50 km depuis un point de départ (R-20, ⚠ AMB-01, AMB-19, AMB-25) | Must | Julien, Sarah | CR-001/§1, Q06 |
| REQ-011 | L'utilisateur valide le tracé qu'il retient, trajet choisi ou trajet conseillé, et télécharge ce tracé dans un fichier `.gpx` (⚠ AMB-08, AMB-19) | Must | Julien, Sarah | CR-001/§1, Q19 |
| REQ-012 | L'application propose une liste d'équipement adaptée à la météo prévue sur le parcours : vêtement de pluie, casquette, lunettes… Elle suit une grille (pluie, ensoleillement, température, vent) proposée par l'équipe et validée par le client (⚠ ZO-06) | Must | Julien, Sarah | CR-001/§1, Q06 |
| REQ-013 | L'application calcule les quantités d'eau et de nourriture à partir du profil (ou des valeurs par défaut, R-17), de la durée estimée et de la météo prévue (R-05, ⚠ ZO-05) | Must | Julien, Sarah | CR-001/§1, Q21 |
| REQ-014 | L'application affiche les points d'eau potable sur le parcours, avec l'avertissement de la règle R-09 | Must | Julien, Sarah | CR-001/Q17, Q35 |
| REQ-029 | Pour un itinéraire, l'application donne le verdict de la règle R-19 et indique quels critères posent problème, y compris une pluie récente (R-10), sans afficher d'historique (⚠ INC-05, INC-09, ZO-17, ZO-20) | Must | Julien, Sarah | CR-001/§1, Q34 |
| REQ-030 | *(supprimée en v1.2 : les sorties sur plusieurs jours sont hors périmètre, ⚠ INC-08, ZO-19)* | — | — | CR-001/Q18 |
| REQ-031 | L'application affiche les prévisions météo des 3 prochains jours, du jour même au surlendemain, heure par heure et par jour, pour les zones de l'itinéraire ou pour le spot de pêche consulté (R-18, ⚠ AMB-07) | Must | tous | CR-001/Q13 |

### Profil et compte

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-015 | L'utilisateur crée un compte sécurisé (REQ-114), s'y connecte, s'en déconnecte et peut réinitialiser son mot de passe. L'inscription est réservée aux 15 ans et plus. Le profil et le classement des sports sont retrouvés sur tous ses appareils (⚠ ZO-24, ZO-25, ZO-26) | Must | tous | CR-001/Q23 |
| REQ-016 | L'utilisateur peut renseigner et modifier son âge, son poids, sa taille et sa VMA. Ces données sont facultatives (R-17). Une saisie hors des plages plausibles fixées par l'équipe est refusée avec un message (⚠ ZO-09, ZO-28, INC-04) | Must | tous | CR-001/Q02, Q20, Q22 |
| REQ-017 | À l'inscription, l'utilisateur classe ses sports favoris (trail, pêche) par ordre de préférence, et peut modifier ce classement ensuite (⚠ INC-04, ZO-22) | Must | tous | CR-001/Q33, Q39 |
| REQ-018 | L'utilisateur donne un consentement explicite dans le parcours de création du compte, avant toute saisie de données de forme physique, et peut consulter la politique de confidentialité (R-13, ⚠ AMB-28, ZO-26, ZO-33) | Must | tous | CR-001/Q24 |
| REQ-019 | L'utilisateur peut exporter ses données dans un format lisible et standard, retirer son consentement (ce qui efface ses données de forme physique) et supprimer son compte (⚠ ZO-26) | Must | tous | CR-001/Q24 |
| REQ-020 | L'utilisateur accepte les conditions d'utilisation, avec l'avertissement et la clause de la règle R-14, pour finaliser son inscription. L'équipe en fournit un modèle, que le client fait valider (⚠ ZO-12) | Must | tous | CR-001/Q29 |

### Administration et référentiels

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-021 | Seul un administrateur peut forcer ou corriger l'état d'un sentier, pour une durée fixée ou sans limite (R-08, ⚠ AMB-12, ZO-27) | Must | Administrateur | CR-001/Q36, Q42 |
| REQ-022 | L'administrateur crée, modifie et retire les alertes, les rattache à une ou plusieurs activités et fixe leur durée (R-11, ⚠ AMB-10, AMB-12) | Must | Administrateur | CR-001/Q42 |
| REQ-023 | Les critères de sécurité de chaque parcours du panel pilote (La Possession → Mafate, Roche Écrite, Piton des Neiges) sont proposés par l'équipe, validés par le client et consignés dans le référentiel des sentiers. Leur mode de mise à jour n'est pas défini : l'espace d'administration est limité aux statuts des sentiers et aux alertes (*CR-001/Q42*) (⚠ ZO-07, AMB-09) | Must | Équipe projet, client | CR-001/Q34, Q40 |
| REQ-032 | Les sentiers officiels balisés et les spots de pêche forment deux référentiels internes, chargés par import. Seuls ces sentiers et ces spots sont proposés. Chaque sentier porte sa cotation officielle, chaque spot sa position précise. Les données externes (météo, état des sentiers) sont rattachées aux éléments de ces référentiels (⚠ AMB-03, AMB-05, AMB-20) | Must | Équipe projet, administrateur | CR-001/Q09, Q16, Q25 |

### Pêche

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-024 | L'application identifie les spots de pêche aux meilleures conditions selon le vent, la houle, la marée, le solunaire, la pluie et la clarté estimée de l'eau (R-10), et indique les critères qui l'expliquent. Elle ne distingue pas les techniques de pêche. Un critère sans source gratuite est retiré du calcul et ce retrait est signalé (⚠ AMB-06, ZO-15, ZO-22, ZO-32) | Must | Patrice | CR-001/Q08, Q09, Q31 |
| REQ-025 | L'utilisateur saisit son créneau disponible et son point de départ ; la recommandation porte sur le jour même (R-18). Le créneau est le temps passé sur place, trajet en plus. La distance entre le point de départ et chaque spot entre dans la recommandation (⚠ AMB-05, AMB-15, ZO-34) | Must | Patrice | CR-001/Q12, Q13 |
| REQ-026 | Chaque page de sentier ou de spot de pêche, et toute recommandation qui le propose, affiche les alertes en cours qui lui sont rattachées (R-11, ⚠ INC-07, AMB-10, AMB-17, AMB-21) | Must | tous | CR-001/Q10, Q32, Q42 |
| REQ-027 | Les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) sont créées par l'administrateur sur les spots concernés et invitent à vérifier la réglementation locale sur place (R-11, ⚠ AMB-18, ZO-11) | Must | Administrateur, Patrice | CR-001/Q10, Q32 |

### Comparaison entre activités

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-028 | À « Que voulez-vous faire aujourd'hui ? », l'application affiche un score comparatif justifié entre trail et pêche, pour le jour même, le temps disponible et le point de départ saisis. Côté trail, elle évalue les sentiers du panel pilote proches du point de départ. Si les deux activités sont défavorables, elle le dit et ne recommande aucune sortie. En cas d'équivalence, la règle R-12 s'applique (⚠ AMB-02, AMB-16, AMB-27, ZO-23) | Must | tous | CR-001/§1, Q11, Q12, Q33, Q39 |

---

## 10. Exigences non fonctionnelles

| ID | Exigence | Comment on la vérifie | Source |
|---|---|---|---|
| REQ-101 | L'application est pleinement utilisable sur smartphone depuis un navigateur mobile, et propose l'installation sur l'écran d'accueil sur les navigateurs qui le permettent. Elle fonctionne uniquement connectée (REQ-109, ⚠ ZO-13, AMB-23) | Parcours complet sur les smartphones de test, puis installation sur les navigateurs compatibles, par l'équipe, en dehors de la démonstration client (⚠ INC-11) | CR-001/Q01, Q27 |
| REQ-102 | Aucun coût récurrent pour les API et les données : uniquement des sources gratuites, dans la limite de leurs quotas. Aucune source payante n'est admise (⚠ AMB-26 ; hébergement : ⚠ ZO-18) | Liste des sources avec leurs conditions d'utilisation ; estimation du nombre d'appels comparé aux quotas | CR-001/Q25, Q28 |
| REQ-103 | Si une source est indisponible ou trop ancienne, un message explicite s'affiche pour le secteur concerné, sans aucune valeur inventée (R-07, ⚠ ZO-16) | Test en coupant chaque source, puis en simulant une donnée périmée | CR-001/Q26 |
| REQ-104 | Chaque information externe affichée (météo, données marines, état d'un sentier) indique sa date de mise à jour *(déduit de l'exigence de fraîcheur)* | Vérification de chaque écran | CR-001/Q25 |
| REQ-105 | Un utilisateur ne peut consulter, modifier, exporter ou supprimer que ses propres données | Test d'accès croisé entre deux comptes, pour chaque opération | CR-001/Q23, Q24 |
| REQ-106 | Seul le rôle administrateur accède à l'espace d'administration | Test d'accès avec un compte utilisateur ordinaire | CR-001/Q42 |
| REQ-107 | Les calculs de temps, d'eau, de nourriture et de sécurité donnent toujours le même résultat pour les mêmes entrées | Tests automatisés sur des jeux de données de référence | CR-001/Q21 |
| REQ-108 | Le découpage météo (communes, secteurs d'altitude, stations météo ⚠ AMB-22) et ses limites se paramètrent au déploiement, sans changer l'application, pour respecter les quotas des sources | Modification d'un paramètre, puis vérification de son effet | CR-001/Q38 |
| REQ-109 | Sans connexion, l'application indique clairement que les informations ne sont pas disponibles et invite à se reconnecter (⚠ AMB-23) | Test en mode avion, par l'équipe (⚠ INC-11) | CR-001/Q27 |
| REQ-110 | Le fichier `.gpx` produit respecte le format standard | Contrôle du fichier, puis import sur les appareils de test de l'équipe (⚠ ZO-14) | CR-001/Q19 |
| REQ-111 | L'application peut être démontrée de bout en bout en local, sans mise en ligne publique | Démonstration au client sur les scénarios de recette du panel pilote (⚠ ZO-02) | CR-001/Q37 |
| REQ-112 | *(supprimée en v1.2 : toutes les exigences sont en Must, le volet pêche n'est plus optionnel, ⚠ INC-01)* | — | CR-001/Q30 |
| REQ-113 | Chaque source de données retenue est documentée : producteur, fréquence de mise à jour, conditions d'utilisation et justification de sa fiabilité | Revue de la liste des sources avec le client | CR-001/Q25 |
| REQ-114 | Le compte est sécurisé : aucun mot de passe n'est conservé ni affiché en clair, et la connexion est temporairement bloquée après plusieurs échecs consécutifs (nombre d'échecs et durée à fixer) *(déduit de « compte utilisateur sécurisé »)* | Revue de la conservation des mots de passe ; test de connexions échouées répétées | CR-001/Q23 |
| REQ-115 | Les paliers de VMA, les valeurs par défaut du profil, le seuil d'équivalence des scores et l'âge maximal de chaque type de donnée se paramètrent sans modifier l'application (⚠ AMB-16, AMB-25, ZO-09, ZO-16) | Modification de chaque paramètre, puis vérification de son effet | CR-001/Q21, Q26, Q33 |

---

## 11. Points tranchés

Cette section recense les **incohérences** (deux réponses du CR-001 qui se contredisent), les **ambiguïtés** (une formulation qui peut se comprendre de plusieurs façons) et les **zones d'ombre** (des sujets non abordés mais nécessaires). Les points marqués *(connaissance extérieure au CR)* viennent de l'équipe, pas de l'entretien.

Tous ces points ont été tranchés par l'équipe les 23 et 24/11/2026 (`collab/MaxLaMenace/reponses-incoherences-cdc-v1.md`, `collab/TiBenoit/tableau-reponses-ambiguites-cdc-11.2.md`, `collab/Ivan/reponses-zones-ombre-cdc.md`). La colonne **Statut** indique :

- **Validée** : l'hypothèse de la v1.1 est confirmée, au besoin précisée ;
- **Modifiée** : la décision diffère de l'hypothèse de la v1.1 ;
- **Répondue** : l'information manquante a été obtenue ;
- **Hors CDC** : le sujet relève du planning du projet ;
- **⚑** : la décision s'écarte d'une réponse du CR-001 et doit être confirmée par le client (§11.4).

### 11.1 Incohérences

| # | Constat | Source | Statut | Décision retenue |
|---|---|---|---|---|
| INC-01 | La première version porte sur le trail (Q06) et l'intégration de la pêche n'est pas décidée (Q30). Pourtant le premier besoin exprimé est de savoir « quel sport est le plus propice », la première demande citée est une suggestion de trace (§1), et le classement des sports favoris dès l'inscription (Q39) n'a de sens que si la pêche existe. **Question :** la pêche, la comparaison entre activités et la suggestion de trace sont-elles attendues ? | CR-001/§1, Q06, Q30, Q39 | Modifiée ⚑ | Toutes les exigences sont en Must : trail, pêche, comparaison, suggestion de trace, classement des sports, explications, points d'eau. Le délai n'est pas une donnée du CDC : il est traité au planning (ZO-35) |
| INC-02 | Le client décrit une application « assistée par IA » avec un « trajet conseillé par l'IA » (§1). Or Q21 exige des formules fixes pour les calculs physiologiques et sécuritaires, et réserve l'IA « à l'outillage de dev et à la génération de synthèses textuelles ». Par ailleurs, la question Q28 citait l'IA parmi les API payantes, et la réponse fixe 0 € de coût API. **Questions :** y a-t-il de l'IA dans le produit ? Le client accepte-t-il que le trajet conseillé repose sur des règles fixes ? | CR-001/§1, Q21, Q28 | Validée ⚑ | Calculs, trajet conseillé et verdict reposent sur des règles fixes (R-05, R-06, R-19). L'IA ne sert qu'à rédiger les explications en langage courant (REQ-009), à condition d'être gratuite ; à défaut, textes types |
| INC-03 | L'application est ouverte au public (Q03), avec un compte sur plusieurs appareils (Q23). Mais le client veut la voir fonctionner en local avant tout investissement d'hébergement (Q37). « Livrer le projet » (Q07) ne veut donc pas dire mettre l'application à disposition du public | CR-001/Q03, Q07, Q23, Q37 | Validée | Le livrable est une démonstration fonctionnelle en local. La mise en ligne publique fera l'objet d'une décision ultérieure (ZO-18). Aucune date d'échéance dans le CDC |
| INC-04 | Le profil est « strictement limité » à 4 données (Q20), mais Q39 y ajoute le classement des sports favoris | CR-001/Q20, Q39 | Validée | Profil = âge, poids, taille, VMA, toutes facultatives (R-17), et classement des sports. L'heure de départ, le temps disponible et le point de départ sont saisis à chaque recherche, selon l'activité (AMB-15), et ne font pas partie du profil. Compte obligatoire pour se connecter (R-16) |
| INC-05 | Le client a d'abord parlé de « météo sur les derniers jours » (§1), puis précisé vouloir les **prévisions** des prochains jours (Q13). Or la clarté de l'eau dépend des pluies récentes (Q31), et les règles de sécurité des sentiers (radiers, boue) dépendent aussi des pluies passées (Q34) | CR-001/§1, Q13, Q31, Q34 | Modifiée | Aucun historique météo n'est affiché. Les pluies récentes sont un critère interne : l'application constitue elle-même leur historique en conservant les données reçues des sources météo gratuites (R-10, ZO-32). Elles peuvent être citées dans le verdict (REQ-029) et ses explications (REQ-009) |
| INC-06 | Q26 interdit toute extrapolation hasardeuse, alors que Q31 demande d'estimer la clarté de l'eau | CR-001/Q26, Q31 | Validée | Une estimation est permise si elle est présentée comme telle. L'interdiction vise le remplacement d'une donnée manquante : si la donnée de pluie manque, l'application affiche « indisponible » et n'estime rien (R-10) |
| INC-07 | Q10 demande de signaler la Réserve marine **et le risque requin**. Q32 réduit cela à un message pour la côte ouest et ne parle plus du requin, alors que les côtes concernées couvrent toute l'île (Q09) | CR-001/Q09, Q10, Q32 | Modifiée ⚑ | Les alertes sont un mécanisme générique : l'administrateur rattache chaque alerte à une ou plusieurs activités précises (sentier ou spot de pêche), choisies une par une, sans notion de secteur géographique à part (R-11). Réserve marine et risque requin ne sont que des exemples. R-15 est supprimée |
| INC-08 | Le nombre de jours est au choix de l'utilisateur (Q18), mais les gîtes et abris n'ont pas été évoqués (Q17). Les prévisions ne couvrent par ailleurs qu'un nombre limité de jours | CR-001/Q13, Q17, Q18 | Modifiée ⚑ | Option la plus simple : la recherche et la recommandation portent sur le jour même ; les prévisions sont affichées sur 3 jours (R-18). Pas de sortie sur plusieurs jours, ni d'étapes, ni de gîtes. REQ-030 est supprimée |
| INC-09 | Départ et arrivée sont libres (Q18), mais les règles de sécurité ne seront calibrées que pour le panel pilote (Q40). Le comportement hors panel n'est pas défini. Par ailleurs, « La Possession → Mafate » est un itinéraire, pas un sentier | CR-001/Q18, Q34, Q40 | Validée | Itinéraire, météo et `.gpx` disponibles sur tous les sentiers officiels du référentiel. Le trajet conseillé n'existe que sur le panel pilote, liste fermée de 3 parcours (AMB-09) ; ailleurs, un message l'indique. Hors panel, le verdict porte la mention « indicatif, sentier non calibré » (R-19). La recette se fait sur le panel pilote |
| INC-10 | Q15 demande la météo heure par heure sur chaque tronçon. Q38 retient un découpage par zones (communes, secteurs d'altitude, balises) pour respecter les quotas. Les deux résolutions ne sont pas les mêmes | CR-001/Q15, Q38 | Validée | Heure par heure, par zone : chaque tronçon reçoit la météo de la zone qu'il traverse, à l'heure estimée de passage (R-03). Découpage paramétrable (REQ-108). Prévisions affichées sur 3 jours (REQ-031) |
| INC-11 | La démonstration se fait en local (Q37), alors que l'application est orientée smartphone (Q01) et que le compte doit fonctionner sur plusieurs appareils (Q23). La démonstration ne permettra pas de tout montrer sur smartphone | CR-001/Q01, Q23, Q37 | Validée | La démonstration client se fait en local. L'équipe vérifie sur ses appareils de test l'usage sur smartphone (REQ-101, REQ-109), l'accès au même compte depuis plusieurs appareils (REQ-015) et l'import du fichier `.gpx` (REQ-110), puis présente les résultats au client |

### 11.2 Ambiguïtés

| # | Constat | Source | Statut | Décision retenue |
|---|---|---|---|---|
| AMB-01 | « Une suggestion de trace d'environ 40/50 km » et « une trace sur mesure par rapport aux tracés de rando connus » décrivent une recherche **par distance**. Le parcours utilisateur, lui, demande **un départ et une arrivée**. S'agit-il de deux modes de recherche ? | CR-001/§1 | Modifiée | Deux modes de recherche, tous deux en Must : départ → arrivée (REQ-001) et suggestion par distance (REQ-010) |
| AMB-02 | À « Que voulez-vous faire aujourd'hui ? », est-ce l'utilisateur qui choisit l'activité ou l'application qui la recommande ? « Aujourd'hui » limite-t-il la recherche au jour même, alors que les prévisions portent sur les prochains jours ? | CR-001/§1, Q11, Q13 | Modifiée | L'utilisateur choisit une activité ou demande une comparaison. La recherche et la recommandation portent sur le jour même ; les prévisions des jours suivants restent consultables (R-18, AMB-07) |
| AMB-03 | « Difficulté » : cotation officielle du sentier, ou difficulté ressentie selon le niveau de l'utilisateur (« itinéraires selon le niveau ») ? | CR-001/§1 | Validée | Cotation officielle enregistrée dans le référentiel des sentiers (REQ-032). Le profil influe seulement sur le temps estimé (R-20) |
| AMB-04 | Le trajet conseillé est-il toujours affiché, ou seulement quand une règle est déclenchée ? Peut-il proposer « un autre secteur » (question Q16) que celui choisi ? | CR-001/Q16, Q34 | Modifiée | Les règles des sentiers sont des règles de désactivation : un sentier est disponible par défaut (R-02). Le trajet conseillé s'affiche quand un sentier du trajet choisi est désactivé. Il respecte les filtres de l'utilisateur (difficulté…) et peut se situer dans un autre secteur, dans la limite du panel pilote (REQ-008) |
| AMB-05 | « Meilleure côte » : de quelle échelle parle-t-on ? Une façade de l'île, une commune (« Saint-Paul », Q12) ou un spot précis ? | CR-001/§1, Q09, Q12 | Modifiée | Des spots de pêche précis, enregistrés avec leur position (REQ-032). La recommandation tient compte de la distance au point de départ (REQ-025) |
| AMB-06 | La question Q08 cite le surfcasting et le lancer comme formes de pêche du bord. Toutes les formes de pêche du bord sont-elles concernées ? | CR-001/Q08 | Modifiée | Aucune distinction de technique : l'application recommande un « spot de pêche », sans préciser le type de pêche (ZO-22) |
| AMB-07 | « Prochains jours » : combien de jours de prévision ? | CR-001/Q13 | Modifiée | 3 jours, du jour même au surlendemain (REQ-031) |
| AMB-08 | Quel tracé est exporté en `.gpx` : celui choisi par l'utilisateur ou le trajet conseillé ? Qui « valide » l'itinéraire ? | CR-001/Q19 | Validée | L'utilisateur valide le tracé qu'il retient (trajet choisi ou trajet conseillé), et c'est celui-là qui est exporté (REQ-011) |
| AMB-09 | Le panel pilote est cité avec « notamment » : la liste est-elle fermée ? | CR-001/Q40 | Validée | Liste fermée de trois parcours : La Possession → Mafate, Roche Écrite, Piton des Neiges |
| AMB-10 | Les « alertes » gérées par l'administrateur sont-elles des alertes sur les sentiers, la météo ou le littoral ? | CR-001/Q42 | Modifiée | Alertes rattachées à des sentiers ou à des spots de pêche, affichées sur la page de l'élément concerné et dans les recommandations qui le proposent (R-11, REQ-026) |
| AMB-11 | Le CR parle de l'heure de passage (Q15) sans dire comment elle tient compte du dénivelé et du terrain. Une estimation à partir de la seule VMA est peu fiable en montagne | CR-001/Q15, Q21 | Validée | Estimation à partir de la VMA, corrigée par le dénivelé selon une règle fixe (REQ-005, ZO-05) |
| AMB-12 | Quand l'administrateur force l'état d'un sentier, ce forçage dure-t-il jusqu'à ce qu'il le retire, ou jusqu'à la prochaine information automatique ? | CR-001/Q36 | Modifiée | L'administrateur fixe une durée ou laisse le forçage sans limite, jusqu'à ce qu'il le retire. Même règle pour les alertes (R-08, R-11) |
| AMB-13 | « Trajet choisi par l'utilisateur » (§1) : qui le produit ? L'application à partir du départ et de l'arrivée, ou l'utilisateur en choisissant ses sentiers ? Peut-il passer par un sentier fermé, alors que Q34 cite un sentier fermé comme déclencheur du trajet conseillé ? Q16 ne limite que le trajet **conseillé** aux sentiers balisés | CR-001/§1, Q16, Q18, Q34 | Validée | L'application propose un trajet choisi sur sentiers officiels balisés, que l'utilisateur peut ajuster (REQ-003). Un sentier fermé ou désactivé y reste affiché avec une alerte (REQ-004) et déclenche le trajet conseillé (REQ-008) |
| AMB-14 | Le client parle de « tracés de rando connus » (§1), mais limite le périmètre au trail et à la pêche (Q05). Les randonneurs font-ils partie du public visé ? | CR-001/§1, Q05 | Modifiée ⚑ | Les randonneurs et les traileurs forment un même public, sur le même réseau de sentiers, sans troisième sport. Les règles de calcul du temps couvrent l'allure de randonnée (REQ-005) |
| AMB-15 | Q12 prévoit la saisie du temps disponible « pour affiner la recommandation », dans le volet pêche. Vaut-elle aussi pour une sortie trail ? | CR-001/Q12 | Modifiée | Les saisies sont propres à chaque activité. Trail : départ, arrivée, heure de départ, aller simple ou aller-retour, dénivelé accepté (REQ-001, REQ-002). Pêche : créneau disponible et point de départ (REQ-025). Le temps disponible sert à la pêche et à la comparaison (REQ-028), pas à la recherche d'itinéraire trail |
| AMB-16 | « Conditions équivalentes » (Q33) : à partir de quel écart deux scores sont-ils considérés comme équivalents ? | CR-001/Q33 | Validée | Écart inférieur à un seuil paramétrable (R-12, REQ-115) |
| AMB-17 | Q32 prévoit l'alerte Réserve marine « pour toute activité sur la côte ouest ». Concerne-t-elle seulement la pêche et la chasse sous-marine, ou aussi un parcours trail sur le littoral ouest ? | CR-001/Q32 | Modifiée | La pêche seulement. Pas de traitement particulier : c'est une alerte générique, sans limite de durée, que l'administrateur rattache aux spots concernés (R-11) |
| AMB-18 | L'alerte requin vise-t-elle aussi certaines formes de pêche du bord exposées (pieds dans l'eau, platier) ? *(connaissance extérieure au CR)* Q10 ne limite pas le requin à une pratique | CR-001/Q10 | Modifiée ⚑ | Même règle qu'AMB-17 : alerte générique rattachée par l'administrateur aux spots concernés. La limitation à la chasse sous-marine (ancienne R-15) est abandonnée |
| AMB-19 | Q06 : le client répond « le trail, avec le tracé GPX », alors que la question opposait « le GPX sur mesure » aux autres options. Cela peut désigner l'**export** d'un fichier `.gpx` ou la **trace sur mesure** (suggestion par distance, REQ-010) | CR-001/§1, Q06, Q19 | Modifiée | Le « tracé GPX » est l'export du fichier `.gpx` (REQ-011). La suggestion par distance reste un mode distinct, en Must (REQ-010) |
| AMB-20 | « Sentier officiel balisé » n'est défini nulle part : quelle liste fait foi ? « Officiel » et « ouvert » sont-ils distincts ? La source libre du réseau (Q28) permet-elle de repérer le balisage ? | CR-001/Q16, Q28 | Modifiée | Fait foi le référentiel interne des sentiers, chargé par import (REQ-032). Seuls ces sentiers sont proposés. Les sources externes (météo, état des sentiers) sont rattachées aux sentiers de ce référentiel |
| AMB-21 | « Côte ouest » n'est pas délimitée : quelles communes déclenchent l'alerte Réserve marine ? | CR-001/Q32 | Modifiée | Aucune délimitation géographique : l'administrateur rattache l'alerte aux spots de pêche de la côte ouest (R-11) |
| AMB-22 | « Balises » dans le découpage météo : s'agit-il de stations météo ou du balisage des sentiers ? | CR-001/Q38 | Validée | Stations météo (R-03, REQ-108) |
| AMB-23 | Q27 : « pas de mode hors ligne **complexe** ». Un mode simple (liste d'équipement, quantités d'eau) consultable sans réseau est-il souhaité ? Q01 parle d'une « possibilité de PWA », Q27 d'une « PWA retenue » | CR-001/Q01, Q27 | Validée | Aucun mode hors ligne : l'application fonctionne connectée et, sans connexion, invite à se reconnecter (REQ-109). L'installation sur l'écran d'accueil est proposée sur les navigateurs compatibles, sans critère de recette (C5, REQ-101) |
| AMB-24 | §1 : « adapte l'itinéraire aux conditions météo réelles ». « Réelles » désigne-t-il des observations ou des prévisions ? « Adapter » veut-il dire seulement changer de tracé, ou aussi proposer un autre horaire de départ ? | CR-001/§1, Q13, Q14 | Validée | Prévisions et règles des sentiers. L'adaptation consiste à changer de tracé (REQ-008), sans proposer d'horaire (R-04) |
| AMB-25 | « Niveau » (§1 : « itinéraires selon le niveau », Q21) : comment se déduit-il du profil ? Comment l'âge, le poids et la taille entrent-ils dans les calculs ? | CR-001/§1, Q21 | Modifiée | Niveau déduit de la VMA, par paliers paramétrables sans modifier l'application (R-20, REQ-115). L'usage de l'âge, du poids et de la taille relève des règles de calcul de ZO-05 |
| AMB-26 | Q28 parle d'un « **objectif** 0 € ». Une source payante indispensable serait-elle refusée ou rediscutée avec le client ? | CR-001/Q28 | Modifiée | Contrainte absolue : aucune source payante. Une donnée sans source gratuite est omise, avec un avertissement à l'utilisateur (ZO-15) |
| AMB-27 | Q11 : « en tenant compte des préférences de l'utilisateur ». S'agit-il du seul classement des sports, ou d'autres éléments du profil ? | CR-001/Q11 | Validée | Classement des sports seulement (R-12) |
| AMB-28 | Q24 : consentement « à l'inscription ». Ce n'est pas équivalent à « avant toute saisie » (REQ-018) si le profil est rempli après l'inscription | CR-001/Q24 | Modifiée | Compte obligatoire pour se connecter. Le formulaire de profil est proposé à l'inscription et dans le compte, mais ses valeurs sont facultatives ; absentes ou effacées, elles sont remplacées par des valeurs par défaut signalées (R-17). Le consentement est recueilli dans le parcours de création du compte (R-13, REQ-018) |

### 11.3 Zones d'ombre

| # | Sujet non abordé | Source | Statut | Décision retenue |
|---|---|---|---|---|
| ZO-01 | Identité et fonction du client, et outils qu'il utilise aujourd'hui pour préparer ses sorties. Sans cela, le problème (section 2) n'est que déduit | CR-001, en-tête, Q25 | Répondue | Client : Maximilien, fonction non précisée. Outils utilisés aujourd'hui : les sites Windy et Randopéi |
| ZO-02 | Qui valide le livrable (Q04 sans réponse) et selon quels critères de recette (non précisés en Q07) | CR-001/Q04, Q07 | Validée | L'équipe rédige des scénarios de recette sur le panel pilote et les soumet au client pour accord. L'échéance relève du planning |
| ZO-03 | Échéance de livraison (Q07 : 3 semaines) | CR-001/Q07 | Hors CDC | Les dates sont suivies dans le planning du projet |
| ZO-04 | Le client n'a pas cité la date et l'heure de départ comme données à saisir. Elles sont pourtant indispensables pour la météo à l'heure de passage | CR-001/Q15 | Modifiée | Heure de départ obligatoire, pré-remplie avec l'heure courante. La date est celle du jour (AMB-02) |
| ZO-05 | Contenu des règles de calcul du temps, de l'eau, de la nourriture et de sécurité, et qui les valide. La météo entre-t-elle dans le calcul des quantités ? Une erreur peut avoir des conséquences sur la santé | CR-001/Q21 | Validée | Règles tirées de références publiques, citées dans l'application et validées par le client. La chaleur prévue augmente la quantité d'eau (R-05) |
| ZO-06 | Règles des conseils d'équipement : à partir de quels seuils recommander un vêtement de pluie, une casquette, des lunettes ? | CR-001/§1 | Validée | Grille simple (pluie, ensoleillement, température, vent) proposée par l'équipe et validée par le client (REQ-012) |
| ZO-07 | Qui fournit les seuils de sécurité propres à chaque sentier (Q34) ? Cela demande une connaissance du terrain que l'équipe n'a pas | CR-001/Q34 | Validée | L'équipe propose des seuils pour les 3 parcours pilotes, le client les valide (REQ-023) |
| ZO-08 | Qui tient le rôle d'administrateur après la livraison et met à jour l'état des sentiers, sans budget ? | CR-001/Q36, Q42 | Validée | Le client |
| ZO-09 | Que se passe-t-il si l'utilisateur ne connaît pas sa VMA ou ne remplit pas son profil ? La météo à l'heure de passage (R-03) a besoin d'une allure | CR-001/Q02, Q03, Q15 | Modifiée | Compte obligatoire ; âge, poids, taille et VMA facultatifs. Une donnée absente est remplacée par une valeur ou une allure par défaut, signalée. Temps et quantités sont personnalisés seulement quand le profil est renseigné (R-17) |
| ZO-10 | *(retiré)* Consultation sans compte | CR-001/Q23 | Répondue | Compte obligatoire pour toute utilisation (R-16), tranché par Q23 |
| ZO-11 | La réglementation préfectorale liée au risque requin encadre certaines activités nautiques à La Réunion et peut concerner la chasse sous-marine *(connaissance extérieure au CR)*. Recommander une côte pour la chasse sous-marine risque d'orienter vers une zone où elle est interdite. Le client connaît-il ces règles ? Faut-il exclure ces zones ? | CR-001/Q08, Q10 | Modifiée | Alertes génériques rattachées aux spots de pêche concernés (R-11, REQ-027), sans pratique distincte (AMB-17, AMB-18, INC-07) |
| ZO-12 | Qui rédige et valide les conditions d'utilisation et la politique de confidentialité ? Qui est responsable du traitement des données au sens du RGPD ? La portée réelle de la clause de non-responsabilité (Q29) n'a pas été vérifiée | CR-001/Q24, Q29 | Validée | L'équipe fournit un modèle, le client le fait valider et en porte la responsabilité |
| ZO-13 | Exigences non abordées : temps de réponse, accessibilité, langues, smartphones et navigateurs pris en charge, nombre d'utilisateurs attendu | — | Validée | Français uniquement, smartphones récents, aucun engagement de nombre d'utilisateurs pour la démonstration |
| ZO-14 | Sur quelles montres ou quels GPS l'import du fichier `.gpx` doit-il être vérifié ? | CR-001/Q19 | Validée | Appareils dont dispose l'équipe |
| ZO-15 | Existe-t-il des sources gratuites pour la houle, les marées et le solunaire à La Réunion ? | CR-001/Q09, Q28 | Validée | Un critère sans source gratuite est retiré du calcul, et ce retrait est signalé à l'utilisateur (REQ-024) |
| ZO-16 | À partir de quel âge une donnée est-elle « pas à jour » (Q26) ? | CR-001/Q26 | Validée | Seuil propre à chaque type de donnée, fixé par paramétrage (R-07, REQ-115) |
| ZO-17 | Quels critères rendent la météo « idéale » pour un sentier (besoin du §1) ? Aucun critère de bonnes conditions n'est défini pour le trail, alors que REQ-028 suppose un score trail | CR-001/§1, Q34 | Validée | Verdict à trois niveaux (favorable, défavorable, à risque) à partir des règles du sentier et d'une grille générale (pluie, vent, chaleur) proposée par l'équipe et validée par le client (R-19) |
| ZO-18 | Qui paie un éventuel hébergement après la démonstration en local ? Le budget nul (Q07) et l'objectif 0 € (Q28) portent sur la réalisation et les API, pas sur l'hébergement | CR-001/Q07, Q28, Q37 | Validée | Aucun hébergement payant pour la démonstration en local. Décision du client après la démonstration |
| ZO-19 | Sorties sur plusieurs jours : comment calculer l'heure de passage les jours suivants (heure de fin d'étape, nuitée, heure de reprise) ? | CR-001/Q15, Q18 | Modifiée ⚑ | Sans objet : pas de sortie sur plusieurs jours ni d'étapes (INC-08). Les heures de passage sont estimées sur la journée de la sortie |
| ZO-20 | Vigilances officielles (fortes pluies, vent, houle, cyclone) et fermetures générales des sentiers par arrêté *(connaissance extérieure au CR)* : quel comportement ? | CR-001/Q25, Q26 | Validée | En cas de vigilance majeure sur le secteur, une alerte prioritaire s'affiche et aucune sortie n'est jugée favorable (R-19) |
| ZO-21 | Que faire si aucun itinéraire valide n'existe (sentier unique fermé, dénivelé accepté trop faible) ? | CR-001/Q18, Q36 | Modifiée | Message indiquant la contrainte bloquante, et proposition d'un parcours proche réalisable (REQ-003) |
| ZO-22 | Pêche du bord et chasse sous-marine : l'utilisateur choisit-il sa pratique lors de la recherche ? Le classement des sports favoris porte-t-il sur 2 sports ou 3 pratiques ? Que fait un utilisateur qui ne pratique qu'un sport ? | CR-001/Q08, Q33, Q39 | Modifiée ⚑ | Deux sports seulement : trail (randonneurs compris) et pêche. Un seul type « spot de pêche », avec une position précise, sans technique ni troisième pratique. Le classement des sports favoris porte sur ces deux sports |
| ZO-23 | Arbitrage trail / pêche : quels sentiers sont évalués côté trail ? Que répondre quand les conditions sont mauvaises pour les deux sports (Q11 : « ou mauvaises ») ? | CR-001/Q11, Q12 | Validée | Sentiers du panel pilote proches du point de départ. Si les deux activités sont défavorables, l'application le dit et ne recommande aucune sortie (REQ-028) |
| ZO-24 | Quelles données sont retrouvées sur les autres appareils : profil seul, ou aussi les itinéraires préparés et les fichiers `.gpx` ? | CR-001/Q23 | Validée | Profil et classement des sports seulement |
| ZO-25 | Cycle de vie du compte : mot de passe oublié, changement d'identifiants, déconnexion | CR-001/Q23 | Validée | Parcours standards de création, connexion, déconnexion et réinitialisation du mot de passe (REQ-015) |
| ZO-26 | RGPD : durée de conservation des données (posée en Q24, sans réponse), inscription des mineurs *(connaissance extérieure au CR)*, retrait du consentement sans suppression du compte, format de l'export | CR-001/Q24 | Validée | Inscription réservée aux 15 ans et plus. Le retrait du consentement efface les données de forme physique ; les valeurs par défaut s'appliquent (R-13). Durée de conservation fixée par le client (§11.5). Export dans un format lisible et standard |
| ZO-27 | Création et gestion des comptes administrateur ; traçabilité des forçages d'état des sentiers (qui, quand, pourquoi) | CR-001/Q36, Q42 | Validée | Comptes administrateur créés par l'équipe. Chaque forçage enregistre son auteur, sa date et son motif (R-08) |
| ZO-28 | Plages de valeurs acceptées pour l'âge, le poids, la taille et la VMA, pour éviter des calculs aberrants | CR-001/Q02, Q20 | Validée | Plages plausibles fixées par l'équipe ; une saisie hors plage est refusée avec un message (REQ-016) |
| ZO-29 | Aller-retour : les mêmes tronçons sont parcourus à deux heures différentes. Comment afficher la météo des deux passages ? | CR-001/Q15, Q18 | Validée | Chaque passage est affiché séparément (REQ-002) |
| ZO-30 | Le nom « MeteoSport » n'apparaît pas dans le CR-001 | CR-001, en-tête | Répondue | Nom « MeteoSport » validé |
| ZO-31 | Source de l'état des sentiers. REQ-003 et REQ-004 supposent une source automatique pour l'état des sentiers (Q36 : « données automatisées »). Existe-t-il une source gratuite exploitable ? Sinon, l'administrateur devient la seule source | CR-001/Q25, Q36 | Validée | Source à identifier avant tout développement. À défaut, état saisi à la main par l'administrateur (REQ-021). Le réseau des sentiers vient du référentiel interne (AMB-20) |
| ZO-32 | Source d'historique de pluie. Q31 et Q34 exigent les pluies récentes (24 à 48 h), alors que ZO-15 ne couvre que la houle, les marées et le solunaire | CR-001/Q31, Q34 | Modifiée | L'historique est constitué en interne, en conservant les données des appels aux sources météo gratuites. Il n'est pas affiché à l'utilisateur (R-10, INC-05) |
| ZO-33 | Nature des données. Q24 parle de données « de forme physique et de santé ». L'âge, le poids et la VMA peuvent relever de données de santé au sens du RGPD *(connaissance extérieure au CR)* | CR-001/Q24 | Validée | Consentement explicite maintenu (R-13) ; qualification juridique à faire valider par le client |
| ZO-34 | Créneau de pêche et trajet. Le créneau d'une heure (Q12) inclut-il le trajet depuis le point de départ vers le spot ? | CR-001/Q12 | Validée | Créneau = durée sur place, trajet en plus (REQ-025) |
| ZO-35 | Faisabilité de l'ensemble des exigences Must dans le délai, sans estimation de charge | CR-001/Q07, Q30 | Hors CDC | Charge et calendrier sont traités au planning. Le CDC fixe le besoin, pas la faisabilité calendaire |

### 11.4 Écarts avec le CR-001 à faire confirmer par le client

| Réponse du CR-001 | Décision de l'équipe | Points |
|---|---|---|
| Q07 : livraison en 3 semaines | Le délai sort du CDC et reste suivi au planning du projet | ZO-03, ZO-35 |
| Q30 : le volet pêche est intégré si le calendrier le permet | Toutes les exigences sont en Must, pêche et comparaison comprises | INC-01 |
| §1 : « trajet conseillé par l'IA » | Trajet conseillé par règles fixes ; l'IA ne rédige que les explications, si elle est gratuite | INC-02 |
| Q05 : trail et pêche uniquement | Les randonneurs font partie du public du trail | AMB-14 |
| Q08 : pêche du bord et chasse sous-marine | Un seul sport « pêche » : des spots sans distinction de technique | AMB-06, ZO-22 |
| Q10, Q32 : Réserve marine sur la côte ouest, risque requin | Alertes génériques rattachées par l'administrateur à des spots précis ; vérifier ce rattachement avec le client | INC-07, AMB-17, AMB-18, AMB-21 |
| Q18 : nombre de jours au choix de l'utilisateur | Sortie à la journée, recherche pour le jour même | INC-08, ZO-19 |

### 11.5 Éléments attendus du client

Ces éléments ne bloquent pas la rédaction, mais le client doit les fournir ou les valider :

- sa fonction et le décideur final (*CR-001/Q04*, ZO-01) ;
- la durée de conservation des données (ZO-26) ;
- la validation des scénarios de recette (ZO-02), des règles de calcul (ZO-05), de la grille d'équipement (ZO-06), des seuils de sécurité des 3 parcours pilotes (ZO-07), de la grille générale du verdict (ZO-17), du modèle de conditions d'utilisation et de politique de confidentialité (ZO-12) et de la qualification des données de santé (ZO-33).

---

## 12. Validation client

| Version | Date | Présentée au client | Retour |
|---|---|---|---|
| v1 | 23/11/2026 | non | — |
| v1.1 | 23/11/2026 | non | — |
| v1.2 | 24/11/2026 | non | — |

---

## 13. Journal des corrections

Corrections apportées le 23/11/2026 après les trois rapports de vérification (`collab/MaxLaMenace/rapport-verification-cdc-v1.md`, `collab/TiBenoit/rapport_de_v_rification_du_cdc_v1.md`, `collab/Ivan/rapport-coherence-cdc-cr.md`) et la correction du CR-001.

C-30 à C-47 : seconde série de corrections (passage en v1.1), issues des rapports `collab/Ivan/rapport-verification-cdc-cr.md`, `collab/MaxLaMenace/rapport-coherence-cr-cdc-v1.md` et `collab/TiBenoit/rapport-points-restants-cdc-cr.md`. Le détail est dans `collab/rapport-corrections-cdc-v1.1.md`.

C-48 à C-61 : passage en v1.2 le 24/11/2026. Report des réponses aux points de la section 11 (`collab/MaxLaMenace/reponses-incoherences-cdc-v1.md`, `collab/TiBenoit/tableau-reponses-ambiguites-cdc-11.2.md`, `collab/Ivan/reponses-zones-ombre-cdc.md`) et de l'arbitrage de l'équipe du 24/11/2026. Les dates citées en C-27 et C-34 ne s'appliquent plus (C-48).

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
| C-48 | Délai hors CDC : retiré du §1, de l'objectif 7 (reformulé), de C1 (retirée), de REQ-111, de ZO-02 ; ZO-03 et ZO-35 passées « Hors CDC ». Les dates de C-27 et C-34 ne s'appliquent plus | Arbitrage équipe 24/11 ; Max INC-01, INC-03 ; Ivan ZO-02, ZO-03, ZO-35 |
| C-49 | Toutes les exigences fonctionnelles en Must (REQ-009, 010, 014, 017, 024 à 028) ; §6 réorganisé par volet, sans sous-titres de priorité ; REQ-112 supprimée | Arbitrage équipe 24/11 ; Max INC-01 ; Thomas AMB-01, AMB-19 |
| C-50 | Horizon : recherche et recommandation pour le jour même, prévisions affichées sur 3 jours. Nouvelles R-18 et REQ-031 ; REQ-001, REQ-025, REQ-028 et ZO-04 alignées ; REQ-030 supprimée ; sorties sur plusieurs jours hors périmètre | Arbitrage équipe 24/11 ; Max INC-08 ; Thomas AMB-02, AMB-07 ; Ivan ZO-19 |
| C-51 | Pêche : type unique « spot de pêche » à position précise, sans technique (Obj 5, persona Patrice, REQ-024, REQ-025, REQ-017, hors périmètre) ; nouvelle REQ-032 pour les référentiels des sentiers et des spots | Solution Thomas ; Thomas AMB-05, AMB-06, AMB-20 ; Ivan ZO-22 |
| C-52 | Alertes génériques rattachées à des activités précises : R-11 réécrite, R-15 supprimée, REQ-022, REQ-026, REQ-027 réécrites, C10 et §1 alignés | Max INC-07 ; Thomas AMB-10, AMB-12, AMB-17, AMB-18, AMB-21 ; Ivan ZO-11 |
| C-53 | Profil facultatif avec valeurs par défaut signalées : nouvelle R-17 ; R-13, REQ-005, REQ-013, REQ-016, REQ-018, REQ-019 alignées | Arbitrage équipe 24/11 ; Thomas AMB-28 ; Ivan ZO-09, ZO-26 |
| C-54 | Pluies récentes : historique constitué en interne (R-10, REQ-029, INC-05, ZO-32) | Arbitrage équipe 24/11 ; Max INC-05 ; Ivan ZO-32 |
| C-55 | Trajets : modèle de désactivation des sentiers (R-02), R-01 confirmée, REQ-003 (ajustement, parcours proche réalisable), REQ-004, REQ-008 (filtres, autre secteur), REQ-011 | Thomas AMB-04, AMB-08, AMB-13, AMB-24 ; Ivan ZO-21 |
| C-56 | Randonneurs intégrés au public du trail : §4, persona Sarah (randonneuse qui débute en trail), REQ-005, hors périmètre | Thomas AMB-14 |
| C-57 | Client (Maximilien) et outils actuels (Windy, Randopéi) en §1, §2, §4 ; nom « MeteoSport » validé (titre) | Ivan ZO-01, ZO-30 |
| C-58 | Nouvelles règles R-19 (verdict, hors panel, vigilances) et R-20 (niveau, difficulté) ; nouvelle REQ-115 (paramètres modifiables sans changer l'application) ; REQ-108 : balises = stations météo | Thomas AMB-03, AMB-16, AMB-22, AMB-25 ; Max INC-09 ; Ivan ZO-16, ZO-17, ZO-20 |
| C-59 | §11 renommée « Points tranchés » : colonnes « Statut » et « Décision retenue », nouvelles §11.4 (écarts avec le CR-001 à faire confirmer) et §11.5 (éléments attendus du client) ; liste « à trancher en priorité » supprimée | Max §4 |
| C-60 | Harmonisations entre les trois fichiers de réponses : alertes rattachées à des sentiers ou des spots, sans « zone » à part (Max INC-07 retenu face à la cible « zone » de Thomas §3.3) ; temps disponible demandé pour la pêche et la comparaison, pas pour la recherche trail (Thomas AMB-15) ; date de départ = jour même (ZO-04 croisé avec AMB-02) | Équipe |
| C-61 | Traduction des décisions en termes neutres, conformément à l'en-tête : « paramétrable sans modifier l'application » au lieu des noms de variables et de fichiers de configuration, « chargés par import » au lieu des scripts d'initialisation de la base | Équipe |
