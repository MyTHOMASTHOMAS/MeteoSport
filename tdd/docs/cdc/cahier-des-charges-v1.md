# Cahier des charges — MeteoSport

**Équipe :** Maxime, Thomas, Ivan
**Version :** v1.3 — 24/11/2026
**Sources :** `tdd/docs/cr/cr-001.md` (entretien du 23/11/2026 ; arbitrages équipe et validation client du 24/11/2026, §5–§6)

Ce document formalise le **problème compris**, pas la solution. Aucun nom de technologie, aucun nom de framework, aucune structure de base de données ici.

Le marqueur ⚠ renvoie à une question encore ouverte en section 11. Les décisions INC / AMB / ZO déjà tranchées et validées par le client sont intégrées dans les sections 1 à 10. La mention *(déduit)* signale un élément déduit des besoins exprimés, pas une citation directe du CR.

---

## 1. Contexte

Le client, Maximilien (fonction à préciser, ⚠ ZO-01), habite La Possession, à La Réunion. Il souhaite « une suggestion de trace d'environ 40/50 km jusqu'à Mafate » et évoque aussi un créneau pour pêcher sur Saint-Paul (*CR-001/§1, Q12*). Il demande une application qui aide les pratiquants de **trail** et de **pêche** à décider quand et où sortir en fonction de la météo (*CR-001/§1, Q05*). L'application est destinée au **public**, pas seulement à son usage personnel (*CR-001/Q03*). Pour préparer ses sorties, il utilise aujourd'hui les sites Windy et Randopéi.

Le terrain impose plusieurs contraintes :

- **Relief et microclimats.** Le relief de l'île crée des microclimats marqués *(prémisse de l'équipe, connaissance extérieure au CR)* : la météo d'un point ne vaut pas pour tout un parcours. Le client demande une météo heure par heure le long du parcours et un découpage par zones (*CR-001/Q15, Q38*).
- **Zones sans réseau.** En zone blanche, l'application ne fonctionne pas et le fichier `.gpx` sur montre ou GPS prend le relais (*CR-001/Q27*). Le cirque de Mafate en est un exemple *(cité dans la question de l'équipe, connaissance extérieure au CR)*.
- **État des sentiers.** L'ouverture ou la fermeture des sentiers est décidée par l'ONF *(connaissance extérieure au CR)*. Ces décisions ne sont pas toujours publiées sous une forme exploitable automatiquement *(prémisse posée par l'équipe en Q36)*. Un administrateur doit donc pouvoir forcer ou corriger l'état d'un sentier si les données automatisées ne sont pas à jour (*CR-001/Q36*). Si aucune source automatique n'est trouvée, l'administrateur saisit l'état à la main.
- **Littoral réglementé.** La Réserve naturelle marine est présente sur la côte ouest (*CR-001/Q32*), et le risque requin doit être signalé (*CR-001/Q10*). Ces informations sont diffusées par des alertes que l'administrateur rattache aux spots de pêche concernés.

Il n'y a **aucun budget** de réalisation et **aucune source payante** n'est admise : 0 € de coût récurrent pour les API et les données (*CR-001/Q07, Q28*). Avant tout investissement dans un hébergement, le client veut voir l'application fonctionner **en local** (*CR-001/Q37*). Aucun hébergement payant n'est engagé pour cette démonstration; la suite relève d'une décision du client. Le délai de réalisation est suivi dans le planning du projet, pas dans ce document.

---

## 2. Problème

Le client prépare aujourd'hui ses sorties avec Windy (prévisions météo) et Randopéi (descriptions de randonnées à La Réunion) *(nature des deux sites : connaissance extérieure au CR)*. Le problème ci-dessous est **déduit des besoins exprimés**.

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
| 1 | Préparer une sortie trail sur sentiers officiels en connaissant la météo le long du parcours | Pour un départ et une arrivée du panel pilote, ou une distance souhaitée, l'utilisateur obtient pour le jour même un itinéraire sur sentiers officiels balisés, l'état de chaque sentier emprunté et la météo prévue de chaque zone traversée à l'heure estimée de passage (*CR-001/§1, Q06, Q15, Q16, Q38, Q40*) |
| 2 | Savoir si la météo convient au parcours et disposer d'une solution plus sûre | L'application indique si les conditions prévues sont favorables, défavorables ou à risque. Quand un sentier du trajet choisi est désactivé, un trajet conseillé sur sentiers balisés s'affiche à côté du trajet choisi (*CR-001/§1, Q16, Q34*) |
| 3 | Emporter le bon équipement et les bonnes quantités | Pour un itinéraire validé, l'application affiche une liste d'équipement adaptée à la météo prévue et des quantités d'eau et de nourriture calculées par des règles fixes à partir du profil ou des valeurs par défaut (*CR-001/§1, Q06, Q21*) |
| 4 | Suivre l'itinéraire sur sa montre | Le fichier `.gpx` téléchargé s'importe sans erreur sur les appareils de test de l'équipe (*CR-001/§1, Q19*) |
| 5 | Choisir le spot le plus favorable pour pêcher | Pour le jour même, un créneau et un point de départ, l'application indique les spots de pêche aux meilleures conditions et les critères qui l'expliquent (*CR-001/§1, Q09, Q12*) |
| 6 | Savoir quelle activité est la plus propice | L'application affiche un score comparatif justifié entre trail et pêche (*CR-001/Q11, Q33*) |
| 7 | Démontrer l'application sans coût | Démonstration en local validée par le client sur les scénarios de recette du panel pilote, sans dépense de réalisation ni coût d'API (*CR-001/Q07, Q28, Q37*) |

---

## 4. Parties prenantes

| Partie prenante | Rôle | Ce qu'elle attend | Utilise l'application ? |
|---|---|---|---|
| Client | Commanditaire du projet : Maximilien, fonction à préciser (⚠ ZO-01). Valide les scénarios de recette ; le décideur final n'a pas été confirmé (*CR-001/Q04*) | Une démonstration fonctionnelle en local, sans coût | oui (cite une sortie vers Mafate et un créneau de pêche, *CR-001/§1, Q12*) |
| Pratiquants (public) | Utilisateurs finaux : traileurs et randonneurs, qui forment un même public, pêcheurs du bord et chasseurs sous-marins (*CR-001/Q03, Q05, Q08*) | Préparer leurs sorties en sécurité | oui |
| Administrateur | Le client, avec des comptes créés par l'équipe. Corrige l'état des sentiers et gère les alertes (*CR-001/Q36, Q42*) | Pouvoir corriger rapidement une information erronée | oui (espace d'administration) |
| Équipe projet | Conçoit, réalise et livre l'application | Un périmètre stable et des critères de recette clairs | non |
| Producteurs de données (ONF, Préfecture, services météo, données marines) | Sources externes non imposées par le client (*CR-001/Q25*) | — | non |
| Autorités (Réserve naturelle marine, préfecture) | Fixent la réglementation du littoral (*CR-001/Q10, Q32*) | Respect de la réglementation | non |

---

## 5. Personas

### Julien — traileur confirmé *(inspiré du client)*
- **Contexte d'usage :** habite La Possession et cherche des traces d'environ 40 à 50 km, par exemple jusqu'à Mafate (*CR-001/§1*). Suit son itinéraire sur sa montre grâce au fichier GPX (*CR-001/§1, Q19*). N'a plus de réseau une fois dans le cirque *(connaissance extérieure au CR ; les zones blanches viennent de CR-001/Q27)*. Prépare ses sorties depuis son smartphone *(déduit)*.
- **Objectif :** obtenir un itinéraire sur sentiers officiels, adapté à la météo prévue et à son niveau, le charger sur sa montre et savoir quoi emporter.
- **Ce qui le bloque aujourd'hui :** il croise lui-même un site de prévisions météo et un site de randonnée, sans savoir quel temps il fera à chaque endroit au moment où il y passera *(déduit)*.

### Sarah — randonneuse qui débute en trail *(déduit de CR-001/Q03 et AMB-14)*
- **Contexte d'usage :** fait partie du public visé (randonneurs et traileurs = même public), a un niveau modeste et ne connaît pas sa VMA. Elle ne la renseigne pas : l'application utilise une allure par défaut et le lui signale.
- **Objectif :** trouver une sortie adaptée à son niveau et à la météo, sans prendre de risque (*CR-001/§1* : « itinéraires selon le niveau »).
- **Ce qui la bloque aujourd'hui :** évaluer la durée et la difficulté réelles d'un parcours et la quantité d'eau à emporter *(déduit)*.

### Patrice — pêcheur du bord et chasseur sous-marin *(CR-001/Q08, Q12)*
- **Contexte d'usage :** exemple cité par le client : « J'ai un créneau d'une heure pour pêcher sur Saint-Paul » (*CR-001/Q12*). Décide souvent au dernier moment *(déduit)*. Un seul type « spot de pêche », sans distinction de technique.
- **Objectif :** savoir quel spot de pêche offre les meilleures conditions pendant son créneau, en étant averti de la réglementation (*CR-001/Q09, Q10*).
- **Ce qui le bloque aujourd'hui :** croiser lui-même le vent, la houle, la marée et la clarté de l'eau après la pluie *(déduit)*.

---

## 6. Périmètre

### Dans le périmètre

- Recherche d'un itinéraire trail pour le jour même entre un départ et une arrivée, en aller simple ou en aller-retour, avec un dénivelé accepté (*CR-001/§1, Q18*) — REQ-001 à REQ-003
- Suggestion de trace selon une distance ou un niveau, second mode de recherche (*CR-001/§1*) — REQ-010
- Affichage de l'état des sentiers, du temps de parcours et de la difficulté (*CR-001/§1*) — REQ-004 à REQ-006
- Météo heure par heure le long du parcours, et prévisions affichées sur 3 jours (*CR-001/Q13, Q15*) — REQ-007, REQ-031
- Indication des conditions favorables, défavorables ou à risque pour l'itinéraire (*CR-001/§1*) — REQ-029
- Trajet conseillé, uniquement sur sentiers officiels balisés du panel pilote (*CR-001/Q16, Q34, Q40*) — REQ-008
- Explication en langage courant du trajet conseillé et du verdict (*CR-001/Q21*) — REQ-009
- Téléchargement de l'itinéraire validé au format `.gpx` (*CR-001/Q19*) — REQ-011
- Conseils d'équipement et quantités d'eau et de nourriture (*CR-001/Q06, Q21*) — REQ-012, REQ-013
- Points d'eau potable, à titre indicatif (*CR-001/Q17, Q35*) — REQ-014
- Recommandation de spot de pêche pour le jour même, selon le créneau et le point de départ (*CR-001/Q08, Q09, Q12, Q31*) — REQ-024, REQ-025
- Alertes rattachées aux sentiers et aux spots, dont la Réserve naturelle marine et le risque requin (*CR-001/Q10, Q32*) — REQ-026, REQ-027
- Score comparatif justifié entre trail et pêche (*CR-001/Q11, Q33*) — REQ-028
- Compte utilisateur, avec le profil et le classement des sports sur tous ses appareils (*CR-001/Q23*) — REQ-015
- Profil facultatif (âge, poids, taille, VMA) et classement des sports favoris (*CR-001/Q02, Q20, Q39*) — REQ-016, REQ-017
- Consentement, politique de confidentialité, conditions d'utilisation, export et suppression du compte (*CR-001/Q24, Q29*) — REQ-018 à REQ-020
- Espace d'administration : état des sentiers et alertes (*CR-001/Q36, Q42*) — REQ-021, REQ-022
- Référentiels internes des sentiers officiels et des spots de pêche (*CR-001/Q09, Q16*) — REQ-032
- Critères de sécurité de chaque parcours du panel pilote, consignés dans le référentiel des sentiers (*CR-001/Q34, Q40*) — REQ-023

### Hors périmètre

| Élément écarté | Motif | Source |
|---|---|---|
| Autres sports que le trail (randonnée comprise) et la pêche | Choix du client ; les randonneurs font partie du public du trail | CR-001/Q05 |
| Zones hors de La Réunion | Choix du client | CR-001/Q05 |
| Pêche en bateau et en kayak | Pas retenues « pour commencer » | CR-001/Q08 |
| Distinction entre techniques de pêche (lancer, surfcasting, chasse sous-marine…) | Un seul type « spot de pêche » | CR-001/Q08 |
| Recherche ou recommandation pour un autre jour que le jour même | Recherche bornée à aujourd'hui ; les prévisions restent consultables sur 3 jours | CR-001/§1, Q13 |
| Sorties sur plusieurs jours, étapes, abris, gîtes et échappatoires | Option la plus simple retenue par l'équipe | CR-001/Q17, Q18 |
| Affichage de l'historique météo | Le client veut les prévisions des prochains jours ; les pluies récentes restent un critère interne | CR-001/Q13 |
| Adaptation de l'itinéraire pendant la sortie | Adaptation seulement pendant la préparation | CR-001/Q14 |
| Proposition d'un autre horaire de départ | Adapter l'itinéraire veut dire changer de tracé | CR-001/§1, Q14 |
| Trajet conseillé hors sentiers officiels balisés | Sécurité | CR-001/Q16 |
| Sentiers et spots absents des référentiels internes | Seuls les sentiers et spots chargés dans l'application sont proposés | CR-001/Q16 |
| Envoi direct de l'itinéraire sur la montre | Le téléchargement du fichier `.gpx` suffit | CR-001/Q19 |
| Données de profil autres que les 4 de base et les sports favoris | Inscription simplifiée, moins de données personnelles | CR-001/Q20, Q39 |
| Calculs physiologiques et de sécurité confiés à une IA | Règles de calcul fixes exigées | CR-001/Q21 |
| Apprentissage à partir des retours après chaque sortie | Mise à jour manuelle du profil uniquement | CR-001/Q22 |
| Consultation hors connexion | Le fichier `.gpx` prend le relais sur le terrain | CR-001/Q27 |
| Mesure directe de la clarté de l'eau | Estimée à partir des pluies récentes | CR-001/Q31 |
| Carte précise des zones réglementées en mer | Remplacée par des alertes rattachées aux spots | CR-001/Q32 |
| Source de données payante | Contrainte ferme | CR-001/Q28 |
| Mise en ligne publique avant validation de la démonstration en local | Le client veut d'abord voir l'application fonctionner en local | CR-001/Q37 |
| Trajet conseillé sur les sentiers hors panel pilote | Règles de sécurité calibrées seulement sur le panel pilote | CR-001/Q40 |

---

## 7. Contraintes

| # | Contrainte | Nature | Source |
|---|---|---|---|
| 1 | *(retirée en v1.2 : le délai de livraison est suivi dans le planning du projet)* | — | CR-001/Q07 |
| 2 | Aucun budget de réalisation. Aucun coût récurrent pour les API et les données : aucune source payante n'est admise. Aucun hébergement payant pour la démonstration en local ; la suite relève d'une décision du client | stratégique | CR-001/Q07, Q28, Q37 |
| 3 | Uniquement des sources de données gratuites ou ouvertes, fiables et à jour, dans la limite de leurs quotas d'utilisation | technique | CR-001/Q25, Q28, Q38 |
| 4 | Territoire couvert : La Réunion uniquement | métier | CR-001/Q05 |
| 5 | Application web orientée mobile. L'installation sur l'écran d'accueil est proposée à titre ergonomique, sur les navigateurs qui le permettent | technique | CR-001/Q01, Q27 |
| 6 | Connexion internet nécessaire. Sur le terrain, en zone sans réseau, seul le fichier `.gpx` est disponible | physique | CR-001/Q27 |
| 7 | Microclimats marqués *(prémisse de l'équipe, connaissance extérieure au CR)* : la météo d'un point ne vaut pas pour tout le parcours | physique | CR-001/Q15, Q38 |
| 8 | Validation par une démonstration en local avant tout investissement d'hébergement et toute mise en ligne | stratégique | CR-001/Q37 |
| 9 | Données personnelles de forme physique soumises au RGPD (⚠ ZO-26, ZO-33) | réglementaire | CR-001/Q24 |
| 10 | Réglementation du littoral : Réserve naturelle marine et risque requin, signalés par des alertes | réglementaire | CR-001/Q10, Q32 |

---

## 8. Règles métier

| # | Règle | Source |
|---|---|---|
| R-01 | Le trajet choisi et le trajet conseillé n'empruntent que des sentiers officiels balisés. Font foi les sentiers du référentiel interne (REQ-032) | CR-001/Q16 |
| R-02 | Un sentier est disponible par défaut. Il est désactivé quand l'une de ses règles de sécurité est déclenchée ou qu'il est déclaré fermé. Un sentier désactivé n'est jamais proposé dans un trajet conseillé; dans le trajet choisi, il reste affiché avec une alerte | CR-001/Q34, Q36 |
| R-03 | La météo d'un tronçon est celle prévue, pour la zone météo qu'il traverse, à l'heure estimée de passage sur ce tronçon. Les zones sont des communes, des secteurs d'altitude ou des stations météo | CR-001/Q15, Q38 |
| R-04 | L'itinéraire est adapté à la météo seulement pendant la préparation, jamais pendant la sortie. Adapter veut dire changer de tracé, à partir des prévisions et des règles des sentiers, sans proposer d'autre horaire | CR-001/Q14 |
| R-05 | Le temps de parcours, les quantités d'eau et de nourriture et les calculs de sécurité (règles des sentiers, verdict sur les conditions) sont faits par des règles fixes, tirées de références publiques citées et validées par le client. La chaleur prévue augmente la quantité d'eau. Une IA ne fait jamais ces calculs | CR-001/Q21 |
| R-06 | Les critères qui déclenchent un trajet conseillé sont propres à chaque sentier (radiers, boue, ravines) et figurent dans le référentiel des sentiers | CR-001/Q34 |
| R-07 | Si une source de données est indisponible ou pas à jour, l'application l'indique clairement pour le secteur concerné et n'invente aucune valeur de remplacement. L'âge au-delà duquel une donnée n'est plus à jour est paramétré pour chaque type de donnée | CR-001/Q26 |
| R-08 | Quand l'administrateur force l'état d'un sentier, cet état remplace l'information reçue automatiquement, pour la durée qu'il fixe ou jusqu'à ce qu'il le retire. Chaque forçage enregistre son auteur, sa date et son motif | CR-001/Q36 |
| R-09 | Les points d'eau sont toujours accompagnés d'un avertissement : leur disponibilité peut varier, il faut emporter toute sa réserve d'eau | CR-001/Q35 |
| R-10 | La clarté de l'eau est estimée à partir des pluies récentes sur les bassins versants côtiers, et présentée comme une estimation. Les pluies récentes proviennent d'un historique que l'application constitue en conservant les données reçues des sources météo. Si cette donnée manque, la clarté est affichée comme indisponible, sans estimation | CR-001/Q31 |
| R-11 | L'administrateur rattache chaque alerte à une ou plusieurs activités précises (sentier ou spot de pêche), choisies une par une, pour une durée fixée ou sans limite. Une alerte en cours s'affiche sur la page de chaque activité concernée et dans toute recommandation qui la propose. La présence de la Réserve naturelle marine et le risque requin sont des alertes de ce type, sans traitement particulier | CR-001/Q10, Q32, Q42 |
| R-12 | Quand l'écart entre les scores du trail et de la pêche est inférieur à un seuil paramétrable, seul l'ordre des sports favoris du profil les départage | CR-001/Q11, Q33, Q39 |
| R-13 | Le consentement explicite aux données de forme physique est recueilli dans le parcours de création du compte. Ces données ne sont enregistrées qu'avec ce consentement. Son retrait les efface et les valeurs par défaut s'appliquent (R-17, ⚠ ZO-26) | CR-001/Q24 |
| R-14 | L'inscription n'aboutit qu'après acceptation des conditions d'utilisation. Elles précisent que l'application est une aide à la décision indicative, qu'elle ne remplace pas les bulletins officiels, et contiennent une clause de non-responsabilité en cas d'accident | CR-001/Q29 |
| R-15 | *(supprimée en v1.2 : le risque requin relève des alertes de la règle R-11)* | CR-001/Q10 |
| R-16 | Toute utilisation de l'application exige un compte authentifié : aucune consultation sans compte | CR-001/Q23 |
| R-17 | Les données du profil (âge, poids, taille, VMA) sont facultatives. Une donnée absente est remplacée par une valeur par défaut paramétrable, et l'utilisateur en est averti. Le temps de parcours et les quantités ne sont personnalisés que si le profil est renseigné | CR-001/Q02, Q20 |
| R-18 | La recherche d'itinéraire et la recommandation d'activité portent sur le jour même. Les prévisions météo sont consultables sur 3 jours, du jour même au surlendemain | CR-001/§1, Q13 |
| R-19 | Le verdict sur les conditions a trois niveaux : favorable, défavorable, à risque. Il s'appuie sur les règles du sentier et sur une grille générale (pluie, vent, chaleur). Hors panel pilote, il repose sur la grille générale seule et porte la mention « indicatif, sentier non calibré ». En cas de vigilance officielle majeure sur le secteur, une alerte prioritaire s'affiche et aucune sortie n'est jugée favorable | CR-001/§1, Q34, Q40 |
| R-20 | Le niveau de l'utilisateur se déduit de sa VMA, par paliers paramétrables. La difficulté d'un sentier est sa cotation officielle : le profil influe sur le temps de parcours, pas sur la difficulté | CR-001/§1, Q21 |

---

## 9. Exigences fonctionnelles

| ID | Exigence | Priorité | Persona | Source |
|---|---|---|---|---|
| REQ-001 | L'utilisateur saisit un point de départ, un point d'arrivée et une heure de départ, pré-remplie avec l'heure courante. La date est celle du jour (R-18) | Must | Julien, Sarah | CR-001/§1, Q15, Q18 |
| REQ-002 | L'utilisateur choisit entre aller simple et aller-retour, pour une sortie à la journée, et le dénivelé accepté. En aller-retour, la météo de chaque passage est affichée séparément | Must | Julien, Sarah | CR-001/Q15, Q18 |
| REQ-003 | L'application construit un itinéraire sur les sentiers officiels balisés du référentiel (R-01), que l'utilisateur peut ajuster. Si aucun itinéraire valide n'existe, elle indique la contrainte bloquante et propose un parcours proche réalisable | Must | Julien, Sarah | CR-001/Q16, Q18 |
| REQ-004 | L'application affiche, pour chaque sentier emprunté, son état (ouvert, fermé, ou désactivé par une règle de sécurité) et la date de cette information *(date : déduit de l'exigence de fraîcheur)*. Un sentier fermé ou désactivé est signalé par une alerte (R-02) | Must | Julien, Sarah | CR-001/§1, Q25, Q26, Q36 |
| REQ-005 | L'application affiche le temps de parcours estimé, calculé à partir de la VMA et corrigé par le dénivelé selon une règle fixe. Sans VMA, une allure par défaut s'applique (R-17). Les règles de calcul couvrent l'allure de randonnée comme celle de trail | Must | Julien, Sarah | CR-001/§1, Q21 |
| REQ-006 | L'application affiche la difficulté du parcours, c'est-à-dire la cotation officielle enregistrée dans le référentiel des sentiers (R-20) | Must | Julien, Sarah | CR-001/§1 |
| REQ-007 | L'application affiche la météo prévue heure par heure pour chaque zone traversée, à l'heure estimée de passage (R-03) | Must | Julien, Sarah | CR-001/Q13, Q15, Q38 |
| REQ-008 | Quand un sentier du trajet choisi est désactivé (R-02), l'application affiche un trajet conseillé à côté du trajet choisi. Ce trajet respecte les filtres choisis par l'utilisateur (difficulté…) et peut se situer dans un autre secteur. Il n'est calculé que sur le panel pilote; ailleurs, un message indique qu'il n'est pas disponible | Must | Julien, Sarah | CR-001/§1, Q16, Q34, Q40 |
| REQ-009 | L'application explique en langage courant pourquoi le trajet conseillé diffère du trajet choisi et pourquoi les conditions sont jugées favorables ou non. Ces explications sont rédigées par une IA seulement si elle est gratuite, sinon par des textes types | Must | Julien, Sarah | CR-001/Q21 |
| REQ-010 | Second mode de recherche : l'application suggère une trace selon une distance ou un niveau souhaité, par exemple environ 40 à 50 km depuis un point de départ (R-20) | Must | Julien, Sarah | CR-001/§1, Q06 |
| REQ-011 | L'utilisateur valide le tracé qu'il retient, trajet choisi ou trajet conseillé, et télécharge ce tracé dans un fichier `.gpx` | Must | Julien, Sarah | CR-001/§1, Q19 |
| REQ-012 | L'application propose une liste d'équipement adaptée à la météo prévue sur le parcours : vêtement de pluie, casquette, lunettes… Elle suit une grille (pluie, ensoleillement, température, vent) proposée par l'équipe et validée à la recette | Must | Julien, Sarah | CR-001/§1, Q06 |
| REQ-013 | L'application calcule les quantités d'eau et de nourriture à partir du profil (ou des valeurs par défaut, R-17), de la durée estimée et de la météo prévue (R-05) | Must | Julien, Sarah | CR-001/§1, Q21 |
| REQ-014 | L'application affiche les points d'eau potable sur le parcours, avec l'avertissement de la règle R-09 | Must | Julien, Sarah | CR-001/Q17, Q35 |
| REQ-015 | L'utilisateur crée un compte sécurisé (REQ-114), s'y connecte, s'en déconnecte et peut réinitialiser son mot de passe. L'inscription est réservée aux 15 ans et plus. Le profil et le classement des sports sont retrouvés sur tous ses appareils (⚠ ZO-26) | Must | tous | CR-001/Q23 |
| REQ-016 | L'utilisateur peut renseigner et modifier son âge, son poids, sa taille et sa VMA. Ces données sont facultatives (R-17). Une saisie hors des plages plausibles fixées par l'équipe est refusée avec un message | Must | tous | CR-001/Q02, Q20, Q22 |
| REQ-017 | À l'inscription, l'utilisateur classe ses sports favoris (trail, pêche) par ordre de préférence, et peut modifier ce classement ensuite | Must | tous | CR-001/Q33, Q39 |
| REQ-018 | L'utilisateur donne un consentement explicite dans le parcours de création du compte, avant toute saisie de données de forme physique, et peut consulter la politique de confidentialité (R-13, ⚠ ZO-26, ZO-33) | Must | tous | CR-001/Q24 |
| REQ-019 | L'utilisateur peut exporter ses données dans un format lisible et standard, retirer son consentement (ce qui efface ses données de forme physique) et supprimer son compte (⚠ ZO-26) | Must | tous | CR-001/Q24 |
| REQ-020 | L'utilisateur accepte les conditions d'utilisation, avec l'avertissement et la clause de la règle R-14, pour finaliser son inscription. L'équipe fournit un modèle ; le client le fait valider et en porte la responsabilité | Must | tous | CR-001/Q29 |
| REQ-021 | Seul un administrateur peut forcer ou corriger l'état d'un sentier, pour une durée fixée ou sans limite (R-08) | Must | Administrateur | CR-001/Q36, Q42 |
| REQ-022 | L'administrateur crée, modifie et retire les alertes, les rattache à une ou plusieurs activités et fixe leur durée (R-11) | Must | Administrateur | CR-001/Q42 |
| REQ-023 | Les critères de sécurité de chaque parcours du panel pilote (La Possession → Mafate, Roche Écrite, Piton des Neiges) sont proposés par l'équipe, validés à la recette et consignés dans le référentiel des sentiers. L'espace d'administration reste limité aux statuts des sentiers et aux alertes (*CR-001/Q42*) | Must | Équipe projet, client | CR-001/Q34, Q40 |
| REQ-024 | L'application identifie les spots de pêche aux meilleures conditions selon le vent, la houle, la marée, le solunaire, la pluie et la clarté estimée de l'eau (R-10), et indique les critères qui l'expliquent. Elle ne distingue pas les techniques de pêche. Un critère sans source gratuite est retiré du calcul et ce retrait est signalé | Must | Patrice | CR-001/Q08, Q09, Q31 |
| REQ-025 | L'utilisateur saisit son créneau disponible et son point de départ; la recommandation porte sur le jour même (R-18). Le créneau est le temps passé sur place, trajet en plus. La distance entre le point de départ et chaque spot entre dans la recommandation | Must | Patrice | CR-001/Q12, Q13 |
| REQ-026 | Chaque page de sentier ou de spot de pêche, et toute recommandation qui le propose, affiche les alertes en cours qui lui sont rattachées (R-11) | Must | tous | CR-001/Q10, Q32, Q42 |
| REQ-027 | Les alertes réglementaires du littoral (présence de la Réserve naturelle marine, risque requin) sont créées par l'administrateur sur les spots concernés et invitent à vérifier la réglementation locale sur place (R-11) | Must | Administrateur, Patrice | CR-001/Q10, Q32 |
| REQ-028 | À « Que voulez-vous faire aujourd'hui ? », l'application affiche un score comparatif justifié entre trail et pêche, pour le jour même, le temps disponible et le point de départ saisis. Côté trail, elle évalue les sentiers du panel pilote proches du point de départ. Si les deux activités sont défavorables, elle le dit et ne recommande aucune sortie. En cas d'équivalence, la règle R-12 s'applique | Must | tous | CR-001/§1, Q11, Q12, Q33, Q39 |
| REQ-029 | Pour un itinéraire, l'application donne le verdict de la règle R-19 et indique quels critères posent problème, y compris une pluie récente (R-10), sans afficher d'historique | Must | Julien, Sarah | CR-001/§1, Q34 |
| REQ-030 | *(supprimée en v1.2 : les sorties sur plusieurs jours sont hors périmètre)* | — | — | CR-001/Q18 |
| REQ-031 | L'application affiche les prévisions météo des 3 prochains jours, du jour même au surlendemain, heure par heure et par jour, pour les zones de l'itinéraire ou pour le spot de pêche consulté (R-18) | Must | tous | CR-001/Q13 |
| REQ-032 | Les sentiers officiels balisés et les spots de pêche forment deux référentiels internes, chargés par import. Seuls ces sentiers et ces spots sont proposés. Chaque sentier porte sa cotation officielle, chaque spot sa position précise. Les données externes (météo, état des sentiers) sont rattachées aux éléments de ces référentiels | Must | Équipe projet, administrateur | CR-001/Q09, Q16, Q25 |

---

## 10. Exigences non fonctionnelles

| ID | Exigence | Comment on la vérifie | Source |
|---|---|---|---|
| REQ-101 | L'application est pleinement utilisable sur smartphone depuis un navigateur mobile, et propose l'installation sur l'écran d'accueil sur les navigateurs qui le permettent. Elle fonctionne uniquement connectée (REQ-109) | Parcours complet sur les smartphones de test, puis installation sur les navigateurs compatibles, par l'équipe, en dehors de la démonstration client | CR-001/Q01, Q27 |
| REQ-102 | Aucun coût récurrent pour les API et les données : uniquement des sources gratuites, dans la limite de leurs quotas. Aucune source payante n'est admise. Aucun hébergement payant pour la démonstration en local | Liste des sources avec leurs conditions d'utilisation ; estimation du nombre d'appels comparé aux quotas | CR-001/Q25, Q28 |
| REQ-103 | Si une source est indisponible ou trop ancienne, un message explicite s'affiche pour le secteur concerné, sans aucune valeur inventée (R-07) | Test en coupant chaque source, puis en simulant une donnée périmée | CR-001/Q26 |
| REQ-104 | Chaque information externe affichée (météo, données marines, état d'un sentier) indique sa date de mise à jour *(déduit de l'exigence de fraîcheur)* | Vérification de chaque écran | CR-001/Q25 |
| REQ-105 | Un utilisateur ne peut consulter, modifier, exporter ou supprimer que ses propres données | Test d'accès croisé entre deux comptes, pour chaque opération | CR-001/Q23, Q24 |
| REQ-106 | Seul le rôle administrateur accède à l'espace d'administration | Test d'accès avec un compte utilisateur ordinaire | CR-001/Q42 |
| REQ-107 | Les calculs de temps, d'eau, de nourriture et de sécurité donnent toujours le même résultat pour les mêmes entrées | Tests automatisés sur des jeux de données de référence | CR-001/Q21 |
| REQ-108 | Le découpage météo (communes, secteurs d'altitude, stations météo) et ses limites se paramètrent au déploiement, sans changer l'application, pour respecter les quotas des sources | Modification d'un paramètre, puis vérification de son effet | CR-001/Q38 |
| REQ-109 | Sans connexion, l'application indique clairement que les informations ne sont pas disponibles et invite à se reconnecter | Test en mode avion, par l'équipe | CR-001/Q27 |
| REQ-110 | Le fichier `.gpx` produit respecte le format standard | Contrôle du fichier, puis import sur les appareils de test de l'équipe | CR-001/Q19 |
| REQ-111 | L'application peut être démontrée de bout en bout en local, sans mise en ligne publique | Démonstration au client sur les scénarios de recette du panel pilote | CR-001/Q37 |
| REQ-112 | *(supprimée en v1.2 : toutes les exigences sont en Must, le volet pêche n'est plus optionnel)* | — | CR-001/Q30 |
| REQ-113 | Chaque source de données retenue est documentée : producteur, fréquence de mise à jour, conditions d'utilisation et justification de sa fiabilité | Revue de la liste des sources avec le client | CR-001/Q25 |
| REQ-114 | Le compte est sécurisé : aucun mot de passe n'est conservé ni affiché en clair, et la connexion est temporairement bloquée après plusieurs échecs consécutifs (nombre d'échecs et durée à fixer) *(déduit de « compte utilisateur sécurisé »)* | Revue de la conservation des mots de passe ; test de connexions échouées répétées | CR-001/Q23 |
| REQ-115 | Les paliers de VMA, les valeurs par défaut du profil, le seuil d'équivalence des scores et l'âge maximal de chaque type de donnée se paramètrent sans modifier l'application | Modification de chaque paramètre, puis vérification de son effet | CR-001/Q21, Q26, Q33 |

---

## 11. Questions restées ouvertes

Les décisions INC / AMB / ZO déjà tranchées et validées par le client ont été intégrées dans les sections 1 à 10. Ne restent ici que les questions encore sans réponse.

| # | Question | Posée le | Réponse | Hypothèse retenue en attendant |
|---|---|---|---|---|
| ZO-01 | Quelle est la fonction du client, et qui est le décideur final (Q04) ? | CR-001, en-tête, Q04 | Client : Maximilien. Outils : Windy et Randopéi | Fonction et décideur final : en attente |
| ZO-26 | Quelle durée de conservation des données personnelles ? | CR-001/Q24 | Inscription ≥ 15 ans ; retrait du consentement = effacement des données de forme ; export standard (R-13, REQ-019) | Durée de conservation : à fixer par le client |
| ZO-33 | L'âge, le poids et la VMA relèvent-ils des données de santé au sens du RGPD ? *(connaissance extérieure au CR)* | CR-001/Q24 | Consentement explicite maintenu (R-13) | Qualification juridique : à trancher avec le client |

---

## 12. Validation client

| Version | Date | Présentée au client | Retour |
|---|---|---|---|
| v1 | 23/11/2026 | non | — |
| v1.1 | 23/11/2026 | non | — |
| v1.2 | 24/11/2026 | non | — |
| v1.3 | 24/11/2026 | oui | Décisions INC / AMB / ZO validées et intégrées dans les §§1–10 ; §11 réduit aux questions encore ouvertes |
