# Revue de cohérence des ADR 001 à 011

**Date :** 26/11/2026
**Rédigé par :** MaxLaMenace (équipe MeteoSport)
**Documents relus :**
- `tdd/docs/adr/ADR-001` à `ADR-011` et `tdd/docs/adr/sommaire.md`
- `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3, validée par le client le 24/11/2026)

Cette revue vérifie si les choix des ADR sont cohérents avec le cahier des charges (CDC) et **entre eux**. Pris un par un, les ADR sont solides. Les problèmes apparaissent quand on les lit ensemble.

**Constat principal :** deux contradictions sont à trancher avant de coder (A-01 et A-02). Il faut aussi alléger le périmètre pour tenir la fin de cycle du 09/12/2026 (A-06).

---

## 1. Synthèse

| # | Priorité | Sujet | ADR concernés | Action proposée |
|---|---|---|---|---|
| A-01 | 🔴 Bloquant | Écran de réglages pour le client, absent du CDC | 003, 004, 008 | Revenir au fichier YAML (option B), ou consigner officiellement la demande du client |
| A-02 | 🔴 Bloquant | Découpage des sentiers par zone météo fait à deux endroits | 002, 007, 010 | Choisir un seul endroit (PostGIS ou TypeScript) |
| A-03 | 🟠 Important | Météo gratuite trop floue pour 40 zones | 005, 003 | Le dire au client, prévoir moins de zones |
| A-04 | 🟠 Important | Table de correspondance (alias) sans utilité réelle | 002, 005, 007 | Garder le champ, reporter la logique |
| A-05 | 🟠 Important | Réglages techniques modifiables par le client | 003, 004, 006, 009 | Séparer configuration technique et paramètres métier |
| A-06 | 🟠 Important | Trop de travail pour 13 jours | tous | Reporter l'option IA et l'écran de réglages |
| A-07 | 🟢 Mineur | Phrases plus à jour, statuts, signataires | 002, 004, 005, 007, 010, 011 | Petites corrections |

---

## 2. Points bloquants

### A-01 — Le client pourrait modifier des réglages qu'il ne devrait pas toucher (ADR-003)

**En clair.** L'application utilise des réglages : à partir de quelle VMA on est « confirmé », quelle allure par défaut, combien d'échecs de connexion avant blocage… Il faut pouvoir les changer **sans toucher au code**. Là-dessus, tout le monde est d'accord. La question est : **qui les change ?**

- **Option B (fichier YAML)** : l'équipe ouvre le fichier, change la valeur et redémarre.
- **Option C (retenue)** : les réglages sont en base, et **le client** les change lui-même depuis un écran de l'espace d'administration.

**Pourquoi l'option C pose problème :**

1. **Le CDC ne la prévoit pas.** Le CDC limite l'espace d'administration à deux choses : l'état des sentiers et les alertes (`REQ-023`, `CR-001/Q42`). La demande du client n'a été faite qu'à l'oral, et l'ADR précise que l'équipe a choisi de ne pas la consigner. C'est comme une fenêtre ajoutée à l'oral sans figurer sur le devis : en cas de litige, rien ne prouve que le client l'a demandée.
2. **Elle contredit ADR-004.** ADR-004 écrit que l'espace admin « ne contient que sentiers, forçages et alertes ».
3. **Elle affaiblit les « règles fixes ».** `R-05` exige des règles validées par le client, parce qu'elles touchent à la sécurité. Avec l'option C, le client change d'un clic des seuils qu'il a validés (paliers de VMA par exemple), sans nouvelle validation. ADR-008 le reconnaît dans ses conséquences.
4. **Elle ajoute du travail** : un écran, une table de paramètres, une table d'historique et une nouvelle spec ADMIN.

**Proposition :**
- **Le plus simple :** passer à l'option B. `REQ-108` et `REQ-115` demandent seulement « sans modifier l'application », et un fichier relu au démarrage y suffit.
- **Si le client y tient :** écrire sa demande dans un CR, faire une fiche d'impact, mettre à jour le CDC, puis rattacher ADR-003 à cette nouvelle exigence. Un ADR ne doit pas être la seule trace d'un changement de périmètre.

### A-02 — Deux ADR découpent les sentiers chacun à leur façon (ADR-002 et ADR-007)

**En clair.** La météo est donnée **par zone** (commune ou tranche d'altitude). Pour savoir quel temps il fera sur un sentier, il faut le couper en morceaux, un par zone traversée.

- **ADR-002** retient PostgreSQL + PostGIS. Son argument principal : « la coupure d'un tracé à une limite d'altitude […] est fournie par PostGIS au lieu d'être une interpolation maison ». Il écarte d'ailleurs l'option C (calculs géométriques dans le code) pour cette raison.
- **ADR-007** (point 12) fait ce découpage **en TypeScript, en mémoire**, « le point de coupure étant interpolé entre deux sommets du tracé ». Autrement dit, l'option C qu'ADR-002 avait écartée.

C'est comme acheter une scie électrique parce qu'elle coupe toute seule, puis tout couper à la main. Soit l'achat ne servait à rien, soit on fait le travail deux fois.

Le même glissement se voit ailleurs : ADR-007 semble écrit comme si la base n'était pas encore choisie (« laisse `ADR-002` libre de son choix de base »). ADR-010 refait une projection UTM en TypeScript alors qu'ADR-002 confie les distances à PostGIS (`EPSG:2975`).

**Proposition :** trancher une seule fois, et mettre les deux ADR d'accord.
- **Soit** PostGIS découpe à l'import ou au démarrage et stocke le résultat, et le graphe d'ADR-007 le charge comme une donnée.
- **Soit** tout le calcul géométrique se fait en TypeScript, et ADR-002 retire cet argument de sa justification (PostGIS reste utile pour les contrôles d'import).

---

## 3. Points importants

### A-03 — La météo gratuite est trop floue pour le découpage prévu (ADR-005)

**En clair.** Open-Meteo est gratuit mais **peu précis** sur La Réunion : une prévision par carré de 9 à 25 km de côté (ADR-005). L'île mesure environ 70 × 50 km. Avec une quarantaine de zones (exemple de calcul d'ADR-005), beaucoup tomberont dans **le même carré** et auront exactement la même météo. On construit une mécanique fine (zones d'altitude, contrôle de chevauchement en 3D, découpage des tracés) pour une donnée qui ne l'est pas.

**Nuance à vérifier :** Open-Meteo accepterait un paramètre d'altitude (`elevation`) qui corrige la **température** selon l'altitude. Si c'est confirmé, c'est le seul vrai gain des secteurs d'altitude.

**Proposition :** le dire clairement dans la fiche de la source présentée au client (`REQ-113`), prévoir moins de zones, et vérifier le paramètre `elevation` en début d'implémentation.

### A-04 — Une table de correspondance qui ne sert à rien pour l'instant (ADR-002, ADR-005, ADR-007)

**En clair.** `SPEC-REF-04` et `SPEC-REF-06`, reprises par ADR-002 et ADR-007, prévoient des **alias** : l'identifiant qu'une source externe donne à un sentier ou à un spot. Ils servent à rattacher une donnée reçue au bon élément. Il y a de la logique autour : unicité, doublons refusés, informations reçues sans correspondance consignées.

Or ADR-005 conclut :
- qu'il n'existe **pas** de source automatique pour l'état des sentiers (saisie manuelle par l'administrateur) ;
- que les données marines Open-Meteo se demandent **par coordonnées GPS**, sans identifiant.

Personne n'utilisera donc ces alias : c'est un trousseau de clés pour des portes qui n'existent pas.

**Proposition :** garder le champ dans le format d'import (pour l'avenir), mais reporter la logique de correspondance. Le noter dans SPEC-REF-04/06.

### A-05 — Réglages techniques modifiables par le client (ADR-003, ADR-004, ADR-006, ADR-009)

**En clair.** Le catalogue de réglages d'ADR-003, que le client pourrait modifier, contient des réglages **métier** (paliers de VMA, allure par défaut) mais aussi des réglages **techniques** :
- l'adresse du serveur d'e-mails (ADR-004) ;
- l'adresse des fonds de carte (ADR-006) ;
- l'activation de l'IA, `ia.active` (ADR-009).

Si le client change l'adresse du serveur d'e-mails par erreur, plus personne ne peut réinitialiser son mot de passe. S'il active l'IA alors que son conteneur ne tourne pas, ça ne marche pas.

Les ADR ne sont pas d'accord entre eux : ADR-009 met l'adresse de l'IA dans une **variable d'environnement**, hors catalogue, mais son activation **dans** le catalogue.

**Proposition :** deux familles distinctes.
- **Configuration technique** (SMTP, tuiles, adresse et activation de l'IA, clés d'API) : variables d'environnement ou fichier, gérés par l'équipe.
- **Paramètres métier** (`REQ-115` et ceux ajoutés par les specs) : le catalogue d'ADR-003.

### A-06 — Trop de travail pour le temps qui reste

**En clair.** Il reste **13 jours** à 3 développeurs, pour 10 domaines tous en *Must*. Au programme notamment :
- routage sous contrainte de dénivelé et suggestion par distance, écrits à la main (ADR-007) ;
- évaluateur de règles et tables (ADR-008) ;
- PWA, purge locale, cartographie (ADR-006) ;
- option IA locale avec contrôle de fidélité (ADR-009) ;
- simplification et validation GPX (ADR-010) ;
- script de traçabilité et tests de bout en bout (ADR-011).

**Deux éléments peuvent être reportés sans rien perdre :**
- **l'option IA (ADR-009)** : `REQ-009` accepte des textes types, déjà prévus comme socle. Il suffit de garder l'interface pour pouvoir ajouter l'IA plus tard ;
- **l'écran de réglages (ADR-003)** : voir A-01.

---

## 4. Points mineurs (A-07)

Surtout des phrases qui n'ont pas suivi les ADR écrits après :

| ADR | Constat | Correction |
|---|---|---|
| ADR-011 | Dit qu'ADR-010 est « non encore rédigé » et que le validateur XSD est « à confirmer » | ADR-010 confirme `xmllint-wasm` : mettre à jour |
| ADR-002 | « La nature des pluies conservées […] n'est pas encore tranchée » | ADR-005 a tranché : dernière prévision reçue. Mettre à jour ADR-002 et `SPEC-METEO-05` |
| ADR-007 | Option R2 : « Impose PostgreSQL / PostGIS à `ADR-002` » | PostGIS est déjà le choix d'ADR-002 : reformuler |
| ADR-005 | Renvoie à ADR-004 pour garder la clé Météo-France hors du dépôt | ADR-004 ne traite pas les secrets : ajouter une ligne (voir aussi A-05) |
| ADR-010 | Tracé validé gardé dans la session, qui dure 7 jours en glissant (ADR-004) ; `SPEC-GPX-01` parle de « session de préparation » | Sans danger (l'état des sentiers est relu au téléchargement), mais aligner les formulations |
| Tous | Statut « proposé » partout | Passer en « accepté » ceux qui sont validés en équipe |
| Tous | « Décidé par » varie (noms ou « équipe projet ») | Uniformiser |

---

## 5. Ce qui est solide

À garder tel quel :

- **Sessions serveur plutôt que JWT (ADR-004)** : quand un compte est supprimé, les autres appareils perdent l'accès **dès leur requête suivante** (`SPEC-AUTH-10` AC-4).
- **Cloisonnement par construction (ADR-004)** : les routes `/api/moi/…` ne prennent jamais d'identifiant de compte, donc aucun accès croisé à « oublier de contrôler ».
- **Moteurs de calcul purs (ADR-008)** : mêmes entrées, même résultat (`REQ-107`), avec une trace qui dit **pourquoi**.
- **Une seule source par type de donnée, sans repli caché (ADR-005)** : une panne est affichée, jamais masquée (`R-07`).
- **Textes types toujours disponibles (ADR-009)** : l'IA n'est qu'un bonus.
- **Horloge injectée (ADR-011)** : on simule le temps qui passe (donnée périmée, blocage qui expire) sans attendre.
- **Registres parcourus par les tests (ADR-011)** : une nouvelle route ou une nouvelle source est testée d'office.
- **Aucune donnée personnelle stockée dans le navigateur (ADR-006)** : la purge n'a rien à oublier.

---

## 6. Décisions à prendre en équipe

1. **A-01** : option B (fichier) ou formalisation de la demande du client (CR, fiche d'impact, CDC) ?
2. **A-02** : découpage des sentiers dans PostGIS ou en TypeScript ?
3. **A-06** : on reporte l'option IA d'ADR-009 ?
4. **A-03, A-04, A-05** : d'accord pour les propositions ci-dessus ?
