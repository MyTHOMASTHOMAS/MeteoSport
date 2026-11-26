# Revue de cohérence des ADR 001 à 011

**Version :** v2 — 26/11/2026 (après-midi)
**Rédigé par :** MaxLaMenace (équipe MeteoSport)
**Documents relus :**
- `tdd/docs/adr/ADR-001` à `ADR-011` et `tdd/docs/adr/sommaire.md`
- `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3, validée par le client le 24/11/2026)
- `tdd/specs/` : sections citées par les ADR (`administration.md`, `referentiels.md`, `sources-meteo.md`, `trail.md`, `calculs.md`, `comptes-profil.md`)

Cette revue vérifie si les choix des ADR sont cohérents avec le cahier des charges (CDC), **entre eux**, et avec les specs. Pris un par un, les ADR sont solides. Les problèmes apparaissent quand on les lit ensemble.

**Ce qui change depuis la v1 (matin du 26/11) :**
- Les ADR n'ont pas bougé, sauf ADR-011 (Supertest remplacé par `fetch` natif). **A-01 à A-07 restent ouverts.**
- La relecture des specs **aggrave** A-01, A-04 et A-05 : des critères d'acceptation ne pourront pas passer tels quels.
- **Quatre nouveaux points** (A-08 à A-11), dont un bloquant : personne n'a choisi d'où viennent les tracés des sentiers.

**Constat principal :** trois sujets sont à trancher avant de coder (A-01, A-02, A-08). Il faut aussi alléger le périmètre pour tenir la fin de cycle du 09/12/2026 (A-06).

---

## 1. Synthèse

| # | Priorité | Sujet | ADR concernés | Action proposée | Depuis |
|---|---|---|---|---|---|
| A-01 | 🔴 Bloquant | Écran de réglages pour le client, absent du CDC et contraire à une spec validée | 003, 004, 008 | Revenir au fichier YAML (option B), ou consigner officiellement la demande du client | v1, aggravé |
| A-02 | 🔴 Bloquant | Découpage des sentiers par zone météo fait à deux endroits | 002, 007, 010 | Choisir un seul endroit (PostGIS ou TypeScript) | v1 |
| A-08 | 🔴 Bloquant | Aucune source choisie pour les tracés, les points d'eau, le contour de l'île et les fonds de carte | 002, 005, 006, 007 | Compléter le catalogue d'ADR-005 et désigner qui produit les fichiers d'import | **v2** |
| A-03 | 🟠 Important | Météo gratuite trop floue pour 40 zones | 005, 003 | Le dire au client, prévoir moins de zones | v1 |
| A-04 | 🟠 Important | Table de correspondance (alias) sans utilité réelle, et un critère impossible à tenir | 002, 005, 007 | Garder le champ, reporter la logique, réécrire `SPEC-REF-06` AC-5 | v1, aggravé |
| A-05 | 🟠 Important | Réglages techniques modifiables par le client | 003, 004, 006, 009 | Séparer configuration technique et paramètres métier | v1, aggravé |
| A-06 | 🟠 Important | Trop de travail pour 13 jours | tous | Reporter l'option IA et l'écran de réglages | v1 |
| A-09 | 🟠 Important | Si la vigilance Météo-France tombe, aucune sortie n'est « favorable » : la démo est en jeu | 005, 008, 011 | Créer le compte Météo-France maintenant, prévoir un scénario de démo | **v2** |
| A-10 | 🟠 Important | Le découpage des tronçons par heure de passage n'est porté par aucun ADR | 002, 007, 008 | L'attribuer à un ADR | **v2** |
| A-11 | 🟠 Important | Un mauvais mot de passe pourrait déconnecter l'utilisateur | 004, 006 | Réserver la réponse `401` à l'absence de session | **v2** |
| A-07 | 🟢 Mineur | Phrases plus à jour, références erronées, points non reportés dans les specs | 002, 003, 004, 005, 007, 008, 010, 011 | Petites corrections | v1, complété |

---

## 2. Points bloquants

### A-01 — Le client pourrait modifier des réglages qu'il ne devrait pas toucher (ADR-003)

**En clair.** L'application utilise des réglages : à partir de quelle VMA on est « confirmé », quelle allure par défaut, combien d'échecs de connexion avant blocage… Il faut pouvoir les changer **sans toucher au code**. Là-dessus, tout le monde est d'accord. La question est : **qui les change ?**

- **Option B (fichier YAML)** : l'équipe ouvre le fichier, change la valeur et redémarre.
- **Option C (retenue)** : les réglages sont en base, et **le client** les change lui-même depuis un écran de l'espace d'administration.

**Pourquoi l'option C pose problème :**

1. **Le CDC ne la prévoit pas.** Le CDC limite l'espace d'administration à deux choses : l'état des sentiers et les alertes (`REQ-023`, `CR-001/Q42`). La demande du client n'a été faite qu'à l'oral, et l'ADR précise que l'équipe a choisi de ne pas la consigner. C'est comme une fenêtre ajoutée à l'oral sans figurer sur le devis : en cas de litige, rien ne prouve que le client l'a demandée.
2. **Elle fait échouer une spec validée.** *(nouveau en v2)* `SPEC-ADMIN-01` est la seule spec au statut **validée**. Son AC-3 dit : « L'espace d'administration reste limité aux statuts des sentiers et aux alertes ». Avec l'option C, le test `CASE-ADMIN-01` est rouge par construction.
3. **Elle contredit ADR-004.** ADR-004 écrit que l'espace admin « ne contient que sentiers, forçages et alertes ».
4. **Elle affaiblit les « règles fixes ».** `R-05` exige des règles validées par le client, parce qu'elles touchent à la sécurité. Avec l'option C, le client change d'un clic des seuils qu'il a validés (paliers de VMA par exemple), sans nouvelle validation. ADR-008 le reconnaît dans ses conséquences.
5. **Elle ajoute du travail** : un écran, une table de paramètres, une table d'historique et une nouvelle spec ADMIN.

**Proposition :**
- **Le plus simple :** passer à l'option B. `REQ-108` et `REQ-115` demandent seulement « sans modifier l'application », et un fichier relu au démarrage y suffit.
- **Si le client y tient :** écrire sa demande dans un CR, faire une fiche d'impact, mettre à jour le CDC **et `SPEC-ADMIN-01`**, puis rattacher ADR-003 à cette nouvelle exigence. Un ADR ne doit pas être la seule trace d'un changement de périmètre.

### A-02 — Deux ADR découpent les sentiers chacun à leur façon (ADR-002 et ADR-007)

**En clair.** La météo est donnée **par zone** (commune ou tranche d'altitude). Pour savoir quel temps il fera sur un sentier, il faut le couper en morceaux, un par zone traversée.

- **ADR-002** retient PostgreSQL + PostGIS. Son argument principal : « la coupure d'un tracé à une limite d'altitude […] est fournie par PostGIS au lieu d'être une interpolation maison ». Il écarte d'ailleurs l'option C (calculs géométriques dans le code) pour cette raison. Il précise que ce découpage est « calculé à l'import ou au démarrage, stocké, puis lu par les moteurs ».
- **ADR-007** (point 12) fait ce découpage **en TypeScript, en mémoire**, « le point de coupure étant interpolé entre deux sommets du tracé », et le garde « en mémoire jusqu'au prochain démarrage ». Autrement dit, l'option C qu'ADR-002 avait écartée.

C'est comme acheter une scie électrique parce qu'elle coupe toute seule, puis tout couper à la main. Soit l'achat ne servait à rien, soit on fait le travail deux fois.

Le même glissement se voit ailleurs : ADR-007 semble écrit comme si la base n'était pas encore choisie (« laisse `ADR-002` libre de son choix de base »). ADR-010 refait une projection UTM en TypeScript alors qu'ADR-002 confie les distances à PostGIS (`EPSG:2975`). ADR-007 calcule longueurs et dénivelés « à partir du tracé » sans dire où.

**Proposition :** trancher une seule fois, et mettre les ADR d'accord.
- **Soit** PostGIS découpe à l'import ou au démarrage et stocke le résultat, et le graphe d'ADR-007 le charge comme une donnée.
- **Soit** tout le calcul géométrique se fait en TypeScript, et ADR-002 retire cet argument de sa justification (PostGIS reste utile pour les contrôles d'import).

### A-08 — Personne n'a choisi d'où viennent les tracés des sentiers *(nouveau)*

**En clair.** L'application ne propose que les sentiers de son référentiel (`R-01`). Ce référentiel est chargé depuis des fichiers GeoJSON : tracés avec l'altitude de chaque point, jonctions, points d'eau (ADR-007). **Mais aucun ADR ne dit d'où viennent ces données**, ni qui fabrique les fichiers des 3 parcours pilotes.

Chaque ADR renvoie la question au catalogue des sources d'ADR-005 :

| Donnée | Qui la demande | Ce qu'il dit |
|---|---|---|
| Tracés et altitudes des sentiers | ADR-007 | « Source des tracés et altitudes non tranchée ici : elle relève du catalogue des sources (`REQ-113`) » |
| Points d'eau | `SPEC-CALC-05` (hypothèse) ; sommaire des ADR | Importés « depuis une source gratuite, avec sa date de mise à jour », affichée à l'utilisateur (`REQ-104`). Le sommaire annonce ce choix dans ADR-005 |
| Contour de La Réunion | ADR-002 | Nécessaire au contrôle « position à La Réunion » ; « à documenter avec le catalogue des sources » |
| Fonds de carte (IGN, OpenStreetMap) | ADR-006 | « Les deux fonds et leurs conditions d'utilisation entrent dans le catalogue des sources (`ADR-005`) » |

Or le catalogue d'ADR-005 ne contient **aucune** de ces quatre lignes. C'est un jeu de « passe à ton voisin » où personne ne garde la balle.

**Pourquoi c'est bloquant :** sans fichier des 3 parcours pilotes, rien ne peut être importé. Sans import, pas de graphe, pas de routage, pas de trajet conseillé, pas de GPX : tout le domaine TRAIL et ses tests attendent ces données. Saisir les jonctions à la main et vérifier les altitudes prendra aussi du temps.

**Proposition :**
- Compléter le catalogue d'ADR-005 avec ces quatre sources (producteur, licence, date de mise à jour), et retirer « points d'eau » du sommaire si ADR-005 ne les traite pas.
- Désigner **maintenant** qui prépare les fichiers GeoJSON du panel pilote, à partir de quelle source, et vérifier que les altitudes sont présentes sur chaque point.

---

## 3. Points importants

### A-03 — La météo gratuite est trop floue pour le découpage prévu (ADR-005)

**En clair.** Open-Meteo est gratuit mais **peu précis** sur La Réunion : une prévision par carré de 9 à 25 km de côté (ADR-005). L'île mesure environ 70 × 50 km. Avec une quarantaine de zones (exemple de calcul d'ADR-005), beaucoup tomberont dans **le même carré** et auront exactement la même météo. On construit une mécanique fine (zones d'altitude, contrôle de chevauchement en 3D, découpage des tracés) pour une donnée qui ne l'est pas.

**Nuance à vérifier :** Open-Meteo accepterait un paramètre d'altitude (`elevation`) qui corrige la **température** selon l'altitude. Si c'est confirmé, c'est le seul vrai gain des secteurs d'altitude.

**Proposition :** le dire clairement dans la fiche de la source présentée au client (`REQ-113`), prévoir moins de zones, et vérifier le paramètre `elevation` en début d'implémentation.

### A-04 — Une table de correspondance qui ne sert à rien, et un critère impossible à tenir (ADR-002, ADR-005, ADR-007)

**En clair.** `SPEC-REF-04` et `SPEC-REF-06`, reprises par ADR-002 et ADR-007, prévoient des **alias** : l'identifiant qu'une source externe donne à un sentier ou à un spot. Ils servent à rattacher une donnée reçue au bon élément. Il y a de la logique autour : unicité, doublons refusés, informations reçues sans correspondance consignées.

Or ADR-005 conclut :
- qu'il n'existe **pas** de source automatique pour l'état des sentiers (saisie manuelle par l'administrateur) ;
- que les données marines Open-Meteo se demandent **par coordonnées GPS**, sans identifiant.

Personne n'utilisera donc ces alias : c'est un trousseau de clés pour des portes qui n'existent pas.

**Aggravé en v2 :** ce n'est pas seulement du travail inutile. `SPEC-REF-06` AC-5 exige que les données marines soient « rattachées à ce spot **par ses alias** ». Avec le choix d'ADR-005, ce critère ne peut pas être satisfait tel qu'il est écrit.

**Proposition :** garder le champ dans le format d'import (pour l'avenir), mais reporter la logique de correspondance. Réécrire `SPEC-REF-06` AC-5 : les données marines sont rattachées au spot par sa position. Le noter dans `SPEC-REF-04` et `SPEC-REF-06`.

### A-05 — Réglages techniques modifiables par le client (ADR-003, ADR-004, ADR-006, ADR-009)

**En clair.** Le catalogue de réglages d'ADR-003, que le client pourrait modifier, contient des réglages **métier** (paliers de VMA, allure par défaut) mais aussi des réglages **techniques** :
- l'adresse du serveur d'e-mails (ADR-004) ;
- l'adresse des fonds de carte (ADR-006) ;
- l'activation de l'IA, `ia.active` (ADR-009) ;
- la durée de conservation de l'historique des pluies (ADR-002, ADR-003).

Si le client change l'adresse du serveur d'e-mails par erreur, plus personne ne peut réinitialiser son mot de passe. S'il active l'IA alors que son conteneur ne tourne pas, ça ne marche pas.

Les ADR ne sont pas d'accord entre eux : ADR-009 met l'adresse de l'IA dans une **variable d'environnement**, hors catalogue, mais son activation **dans** le catalogue.

**Aggravé en v2 :** les specs ont déjà fait la distinction. `SPEC-METEO-05` qualifie la durée de conservation des pluies de « paramètre technique interne, hors liste fermée de `REQ-115` ». ADR-003 la place pourtant dans le catalogue modifiable par le client.

**Autre constat :** le catalogue est éparpillé. ADR-004 (SMTP, durées de session et de lien), ADR-006 (fonds de carte), ADR-007 (distance d'un point saisi au référentiel, tolérance des jonctions, nombre maximal de chemins explorés) et ADR-009 (`ia.active`) ajoutent chacun des paramètres, mais le tableau d'ADR-003 n'a pas suivi. Personne ne peut dire aujourd'hui combien il y a de paramètres.

**Proposition :** deux familles distinctes, listées **à un seul endroit** (ADR-003).
- **Configuration technique** (SMTP, tuiles, adresse et activation de l'IA, clés d'API, durée de conservation) : variables d'environnement ou fichier, gérés par l'équipe.
- **Paramètres métier** (`REQ-115` et ceux ajoutés par les specs) : le catalogue d'ADR-003.

### A-06 — Trop de travail pour le temps qui reste

**En clair.** Il reste **13 jours** à 3 développeurs, pour 10 domaines tous en *Must*. Au programme notamment :
- routage sous contrainte de dénivelé et suggestion par distance, écrits à la main (ADR-007) ;
- évaluateur de règles et tables (ADR-008) ;
- PWA, purge locale, cartographie (ADR-006) ;
- option IA locale avec contrôle de fidélité (ADR-009) ;
- simplification et validation GPX (ADR-010) ;
- script de traçabilité et tests de bout en bout (ADR-011) ;
- *(v2)* préparation des fichiers GeoJSON du panel pilote (A-08).

**Deux éléments peuvent être reportés sans rien perdre :**
- **l'option IA (ADR-009)** : `REQ-009` accepte des textes types, déjà prévus comme socle. Il suffit de garder l'interface pour pouvoir ajouter l'IA plus tard ;
- **l'écran de réglages (ADR-003)** : voir A-01.

### A-09 — Si la vigilance tombe, aucune sortie n'est « favorable » *(nouveau)*

**En clair.** Les vigilances officielles viennent de Météo-France, par une API qui demande un compte et une clé (ADR-005). ADR-005 reconnaît que cette plateforme est instable : les vigilances seront « plus souvent indisponibles que les autres données ».

Il n'en tire pas la conséquence. Les specs disent :
- vigilance indisponible → le verdict vaut **au mieux « défavorable »** (`SPEC-CALC-06` cas 9, appliqué par ADR-008) ;
- trail et pêche défavorables → le comparateur **ne recommande aucune sortie** (`SPEC-COMP-02`).

Autrement dit : si l'API Météo-France ne répond pas le jour de la démo, **aucun parcours ne sera jamais « favorable »**, et l'écran « Que voulez-vous faire aujourd'hui ? » répondra « rien ». Le comportement est correct (on ne suppose pas l'absence de vigilance), mais la démo ne montrera pas le parcours nominal.

S'y ajoute : **le compte Météo-France n'existe pas encore**. ADR-011 en a aussi besoin pour enregistrer les réponses réelles qui servent aux tests.

**Proposition :**
- Créer le compte Météo-France et la clé **cette semaine**, et vérifier que le flux Outre-mer répond.
- Prévoir dans la procédure de démo un scénario qui montre les deux cas : vigilance disponible (verdict favorable possible) et vigilance coupée (verdict incomplet, message par secteur).

### A-10 — Personne ne coupe les tronçons à chaque changement d'heure *(nouveau)*

**En clair.** Un traileur qui traverse le cirque de Mafate de 9 h 20 à 12 h 10 doit voir la météo de 9 h, 10 h, 11 h **et** 12 h, chacune sur la portion parcourue pendant cette heure (`SPEC-METEO-04` cas 6, AC-5, `CASE-METEO-34`). Il faut donc couper les tronçons **par zone** (ce que fait ADR-007) **et par heure de passage**.

Ce second découpage n'a pas de propriétaire :
- **ADR-002** dit qu'il « reste dans les moteurs de calcul » ;
- **ADR-007** (point 13) donne **une seule** heure de passage à chaque tronçon ;
- **ADR-008** ne le mentionne pas ;
- le **sommaire** l'attribue pourtant à ADR-007 (« découpage dynamique par zone météo et par créneau horaire »).

C'est comme un relais où chaque coureur croit que c'est l'autre qui porte le témoin.

**Proposition :** l'écrire dans ADR-008 (le moteur des heures de passage coupe chaque tronçon aux changements d'heure, aller et retour séparément), et corriger le point 13 d'ADR-007 et le sommaire en conséquence.

### A-11 — Un mauvais mot de passe pourrait déconnecter l'utilisateur *(nouveau)*

**En clair.** ADR-006 prévoit que le navigateur efface ses données locales et revient à l'écran de connexion à **chaque** réponse `401` du serveur. C'est voulu pour une session expirée ou un compte supprimé depuis un autre appareil.

Mais ADR-004 ne dit pas quel code renvoyer quand un utilisateur **déjà connecté** se trompe de mot de passe :
- en changeant son mot de passe (`SPEC-AUTH-11`) ;
- en confirmant la suppression de son compte (`SPEC-AUTH-10`) ;
- pendant un blocage (`SPEC-AUTH-11` cas 4).

Si ces refus renvoient `401`, l'utilisateur est déconnecté au lieu de voir un message. C'est contraire aux specs, qui gardent la session ouverte (`SPEC-AUTH-04` AC-8, `SPEC-AUTH-11` cas 4). Même chose pour un échec de connexion : la page serait rechargée et le message neutre perdu.

**Proposition :** l'écrire dans ADR-004. `401` signifie seulement « pas de session valide ». Un mot de passe refusé ou un compte bloqué renvoie un autre code (par exemple `400` ou `403`), avec le message neutre. Le registre des routes d'ADR-011 peut le vérifier.

---

## 4. Points mineurs (A-07)

Surtout des phrases qui n'ont pas suivi les ADR écrits après, et quelques références erronées.

| ADR | Constat | Correction |
|---|---|---|
| ADR-011 | Dit qu'ADR-010 est « non encore rédigé » et que le validateur XSD est « à confirmer » (toujours vrai après la mise à jour du 26/11) | ADR-010 confirme `xmllint-wasm` : mettre à jour |
| ADR-011 | *(v2)* Le point 11 cite « `SPEC-REF-05` AC-7 » pour l'état « non vérifié » : cet AC n'existe pas | C'est `SPEC-REF-06` AC-4 |
| ADR-011 | *(v2)* Le point 11 teste la péremption de l'état saisi par l'administrateur, alors que `SPEC-REF-06` cas 8 dit qu'une saisie ou un forçage actif ne se périme pas | Tester plutôt « non vérifié » pour un sentier sans saisie, et la fin d'un forçage (cas 9) |
| ADR-011 / ADR-010 | *(v2)* Le schéma XSD est rangé dans `backend/tests/fixtures/`, mais ADR-010 valide chaque fichier **en production** | Ranger le schéma avec le code de l'application ; les tests le lisent au même endroit |
| ADR-011 / ADR-004 | *(v2)* ADR-004 refuse toute requête qui modifie des données si son en-tête `Origin` n'est pas celui de l'application. Le `fetch` de Node n'envoie probablement pas cet en-tête (à vérifier) | `creerClientTest` ajoute `Origin` ; ADR-004 précise le cas d'un en-tête absent |
| ADR-008 | *(v2)* Point 7 : « une fermeture connue […] désactive toujours le sentier, même forcé “ouvert” ». Or un forçage « ouvert » **remplace** la fermeture reçue de la source (`R-08`, `SPEC-TRAIL-05` AC-2) ; seules les règles de sécurité passent au-dessus | Reformuler : « un critère déclenché désactive le sentier même forcé “ouvert” » |
| ADR-002 | « La nature des pluies conservées […] n'est pas encore tranchée » | ADR-005 a tranché : dernière prévision reçue. Mettre à jour ADR-002 et `SPEC-METEO-05` |
| ADR-007 | Option R2 : « Impose PostgreSQL / PostGIS à `ADR-002` » | PostGIS est déjà le choix d'ADR-002 : reformuler |
| ADR-005 | Renvoie à ADR-004 pour garder la clé Météo-France hors du dépôt | ADR-004 ne traite pas les secrets : ajouter une ligne (voir aussi A-05) |
| ADR-010 | Tracé validé gardé dans la session, qui dure 7 jours en glissant (ADR-004) ; `SPEC-GPX-01` parle de « session de préparation » | Sans danger (l'état des sentiers est relu au téléchargement), mais aligner les formulations |
| ADR-002, 004 | *(v2)* Points que les ADR devaient faire remonter aux specs, toujours absents : `SPEC-AUTH-10` cas 4 (retirer le rôle administrateur avant la suppression), `SPEC-ADMIN-02` (auteur d'un forçage dont le compte est supprimé), `SPEC-REF-04` (alias déjà en base attribué à un autre élément), `SPEC-METEO-02` (point exactement sur la frontière entre deux zones) | Reporter dans les specs, en « Ce qui n'est pas défini » au minimum |
| Specs | *(v2)* Une vingtaine de renvois à `SPEC-ARCH-nn`, qui n'existe pas | Remplacer par l'ADR correspondant (purge : ADR-006 ; paramétrage : ADR-003 ; réception des courriels : ADR-004…) |
| Tous | Statut « proposé » partout | Passer en « accepté » ceux qui sont validés en équipe |
| Tous | « Décidé par » varie (noms ou « équipe projet ») ; le CDC nomme l'équipe « Maxime, Thomas, Ivan » | Uniformiser |

---

## 5. Ce qui est solide

À garder tel quel :

- **Sessions serveur plutôt que JWT (ADR-004)** : quand un compte est supprimé, les autres appareils perdent l'accès **dès leur requête suivante** (`SPEC-AUTH-10` AC-4).
- **Cloisonnement par construction (ADR-004)** : les routes `/api/moi/…` ne prennent jamais d'identifiant de compte, donc aucun accès croisé à « oublier de contrôler ». ADR-010 applique le même principe au téléchargement du GPX.
- **Moteurs de calcul purs (ADR-008)** : mêmes entrées, même résultat (`REQ-107`), avec une trace qui dit **pourquoi**.
- **Une seule source par type de donnée, sans repli caché (ADR-005)** : une panne est affichée, jamais masquée (`R-07`).
- **Textes types toujours disponibles (ADR-009)** : l'IA n'est qu'un bonus.
- **Horloge injectée (ADR-011)** : on simule le temps qui passe (donnée périmée, blocage qui expire) sans attendre.
- **Registres parcourus par les tests (ADR-011)** : une nouvelle route ou une nouvelle source est testée d'office.
- **Aucune donnée personnelle stockée dans le navigateur (ADR-006)** : la purge n'a rien à oublier.
- **Socle commun cohérent (ADR-001, 002, 004, 006, 011)** : Docker Compose, PostgreSQL et Mailpit d'un côté ; session relue en base à chaque requête et purge locale de l'autre. Le passage de Supertest à `fetch` dans ADR-011 ne casse rien, sous réserve de l'en-tête `Origin` (A-07).

---

## 6. Décisions à prendre en équipe

1. **A-01** : option B (fichier) ou formalisation de la demande du client (CR, fiche d'impact, CDC, `SPEC-ADMIN-01`) ?
2. **A-02** : découpage des sentiers dans PostGIS ou en TypeScript ?
3. **A-08** : qui prépare les fichiers GeoJSON du panel pilote, et à partir de quelle source ?
4. **A-09** : qui crée le compte Météo-France, et quand ?
5. **A-06** : on reporte l'option IA d'ADR-009 ?
6. **A-10** : d'accord pour confier le découpage par heure de passage à ADR-008 ?
7. **A-03, A-04, A-05, A-11** : d'accord pour les propositions ci-dessus ?
