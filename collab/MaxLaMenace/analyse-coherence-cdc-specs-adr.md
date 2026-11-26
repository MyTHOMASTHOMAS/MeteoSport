# Analyse de cohérence — CDC, specs et ADR

**Auteur :** Maxime  
**Date :** 26/11/2026  
**État analysé :** commit `8313210` (merge ADR-009)  
**Documents lus :** `tdd/docs/cdc/cahier-des-charges-v1.md` (v1.3), `tdd/docs/cr/cr-001.md`, `tdd/docs/adr/` (ADR-001 à ADR-009 et `sommaire.md`), `tdd/specs/` (9 fichiers de domaine et `sommaire.md`), `out/validation-specs/` (`arbitrages.md`, `planification.md`)  
**Non analysé en détail :** `collab/`

Ce document prépare la validation collégiale des ADR (TSK-20 à TSK-22). Il relève les contradictions entre documents et propose, pour chacune, la décision à prendre. Il ne modifie aucun document de `tdd/`.

---

## Synthèse

Le lien entre le CDC et les specs est solide : **43 des 45 REQ actives** sont citées dans le champ « Exigence » d'au moins une SPEC. Le volet `AUTH` est bien aligné avec ADR-004 et ADR-006, et le volet `CALC` avec ADR-008 et ADR-009.

Cinq points bloquent la validation :

| # | Point | Décision attendue |
|---|---|---|
| 1 | ADR-003 ouvre à l'administrateur un écran de paramètres que le CDC exclut | Consigner la demande du client, ou revenir à l'option B |
| 2 | Trois modèles incompatibles pour l'état d'un sentier sans information | Trancher ARB-010 et ARB-012, puis aligner REF, TRAIL et ADR-008 |
| 3 | La spec `ARCH` n'existe pas | La rédiger |
| 4 | ADR-010 et ADR-011 sont indexés et cités, mais absents | Les rédiger, ou les retirer de l'index |
| 5 | ARB-001 à ARB-006 appliqués sans trace ; `out/validation-specs` périmé | Reporter les décisions et mettre à jour la planification |

---

## 1. Points bloquants

### 1.1 ADR-003 contredit le CDC, `SPEC-ADMIN-01` et ADR-004

**Constat.** [ADR-003](../../tdd/docs/adr/ADR-003-parametrage-externalise.md) retient l'option C : les paramètres scalaires sont en base et modifiables par l'administrateur depuis l'espace d'administration. Or :

- `REQ-023` (phrase 2) et `CR-001/Q42` limitent l'espace d'administration aux statuts des sentiers et aux alertes ;
- `SPEC-ADMIN-01` AC-3, au statut « validée », exige que l'espace reste limité à ces deux fonctions : il échouerait ;
- ADR-004 justifie l'absence d'accès de l'administrateur aux données personnelles par le fait que cet espace « ne contient que sentiers, forçages et alertes » (`REQ-023`, `SPEC-AUTH-08` AC-2) ;
- ADR-008 s'appuie sur ces paramètres modifiables pour les paliers de VMA et les valeurs par défaut.

ADR-003 reconnaît lui-même que le choix repose sur une confirmation orale du client, que l'équipe a choisi de ne pas consigner (section « Conséquences acceptées »). Cela va contre la règle du README : « une décision prise oralement et non écrite est une décision perdue ». La chaîne `CR → REQ → SPEC → CASE` n'a aucun point de départ pour cet écran.

L'écart s'étend : ADR-009 (`ia.active`, délai d'attente de l'IA) et ADR-006 (adresses des fonds de carte) ajoutent leurs paramètres au même catalogue. L'administrateur pourrait ainsi activer l'IA alors que son conteneur, lancé sous un profil Docker optionnel, ne tourne pas.

**Décision attendue.** Deux sorties possibles :

- **(a) Consigner la demande** : CR-002, fiche d'impact (`tdd/docs/impact/`), CDC v1.4 avec une nouvelle REQ, nouvelle `SPEC-ADMIN-05`, extension de `SPEC-ADMIN-01` et mise à jour d'ADR-004 ;
- **(b) Revenir à l'option B d'ADR-003** : fichier de configuration versionné, modifié par l'équipe seule. Aucun autre document n'est à reprendre.

### 1.2 État d'un sentier sans information : trois modèles incompatibles

| Document | Sentier sans information, ou source indisponible ou périmée | Dernier état « fermé » devenu périmé | Saisie manuelle de l'administrateur |
|---|---|---|---|
| `SPEC-REF-01` et `SPEC-REF-06` (cas 2, 3 et 8) | « ouvert, non vérifié », utilisable | reste « fermé » (décision du 25/11) | « vérifié », sans péremption |
| `SPEC-TRAIL-05` (cas 3 et 4) et `SPEC-TRAIL-07` (cas 3) | « inconnu — source indisponible » ; écarte tout candidat au trajet conseillé | non tranché (ARB-012 ; option (a) « inconnu » appliquée) | non tranché (ARB-010) |
| ADR-008 (point 7) | « état inconnu », sans désactivation | — | — |

Or ADR-005 décide qu'il n'existe **aucune source automatique** de l'état des sentiers : seule la saisie de l'administrateur le renseigne.

**Conséquence.** Si « aucune source » vaut « source indisponible » (ARB-010, question i), tout sentier du panel pilote qui n'a pas été saisi à la main est « inconnu ». Tous les candidats au trajet conseillé sont alors écartés, et le trajet conseillé (`REQ-008`, Must, objectif 2 du CDC) n'est jamais disponible.

**Décision attendue.** Trancher ARB-010 et ARB-012, puis aligner `SPEC-REF-06`, `SPEC-TRAIL-05`, `SPEC-TRAIL-07` et ADR-008 sur un seul vocabulaire (« non vérifié » ou « inconnu ») et un seul comportement.

### 1.3 La spec `ARCH` n'existe pas

Le sommaire des specs indexe `architecture.md` (`ARCH`) au statut « proposé », mais le fichier n'existe pas. Les specs y renvoient 18 fois sous la forme `SPEC-ARCH-nn`.

Conséquences :

- `REQ-101` (application mobile, installation) et `REQ-111` (démonstration locale) ne sont portées par **aucune** SPEC ;
- l'écran d'absence de connexion de `REQ-109` n'est spécifié nulle part : les specs le renvoient toutes à `SPEC-ARCH-nn` ;
- ADR-006 fixe le moyen technique de la purge et de l'écran d'indisponibilité sans spec qui fixe le comportement attendu, ses AC et ses CASE.

**Décision attendue.** Rédiger `tdd/specs/architecture.md` avant la validation des ADR qui s'y rattachent (ADR-001, ADR-003, ADR-006).

### 1.4 ADR-010 et ADR-011 indexés mais absents

Le sommaire des ADR indexe ADR-010 (GPX) et ADR-011 (stratégie de tests). Les deux fichiers n'existent pas, alors qu'ils sont cités 14 fois, notamment par ADR-001, ADR-002, ADR-006, ADR-007 et ADR-009.

Des choix en dépendent : l'outil des tests de bout en bout `CASE-AUTH-52` et `CASE-AUTH-54` (ADR-006), l'image de base des tests d'intégration (ADR-002), la simulation de l'IA lente ou infidèle (ADR-009), les tolérances et la validation GPX 1.1.

**Décision attendue.** Rédiger ADR-010 et ADR-011, ou les retirer de l'index et des renvois.

### 1.5 Arbitrages non tracés et validation des specs périmée

- **ARB-001 à ARB-006** sont cités plus de 60 fois dans `trail.md`, et aussi dans `calculs.md` et ADR-009, comme « tranchés le 25/11/2026 ». Aucune trace de ces décisions n'existe dans le dépôt (ARB-008, ouvert). L'un d'eux accepte un enjeu de sécurité : un utilisateur peut partir sur un sentier réellement fermé sans alternative proposée (ARB-003). Le validateur n'est pas identifié.
- **ARB-007 à ARB-013** sont tous ouverts. Trois touchent à la sécurité : ARB-010, ARB-012 et ARB-013.
- **`out/validation-specs/` est périmé.** ARB-007 et `planification.md` affirment que 7 domaines n'ont pas de fichier ; seul `ARCH` manque aujourd'hui. ARB-007 cite aussi `CASE-METEO-14` pour la clause aller-retour de `REQ-002` : ce cas correspond aujourd'hui à `SPEC-METEO-03` ; le bon cas est `CASE-METEO-17` (`SPEC-METEO-04` AC-2).

**Décision attendue.** Reporter ARB-001 à ARB-006 dans `arbitrages.md` avec leur décision et leur validateur, puis mettre à jour ARB-007 et `planification.md`.

---

## 2. Incohérences entre documents

| # | Constat | Documents | Correction proposée |
|---|---|---|---|
| 2.1 | ADR-005 tranche la nature des pluies de l'historique : « dernière prévision reçue pour l'heure écoulée ». `SPEC-METEO-05` et ADR-002 la disent encore non tranchée | ADR-005 (point 4), `SPEC-METEO-05`, ADR-002 | Reporter la décision dans `SPEC-METEO-05` et ADR-002 |
| 2.2 | **Sécurité.** `SPEC-COMP-02` exclut « à risque » du cas « double défavorable ». Un trail « à risque » et une pêche « défavorable » ne déclenchent donc pas « aucune sortie recommandée », alors que « à risque » est plus grave que « défavorable » (`SPEC-CALC-06`, cas 1) | `SPEC-COMP-02`, `SPEC-CALC-06` | Lire « défavorable » comme « défavorable ou à risque », à faire confirmer par le client |
| 2.3 | `SPEC-TRAIL-07` et ADR-007 reposent sur des « variantes déclarées » du panel pilote. Les specs `REF` ne connaissent pas cette notion : le panel est fermé à 3 parcours (`SPEC-REF-05`), et un sentier pilote hors parcours est refusé à l'import (`SPEC-REF-04`, cas 14) | `SPEC-TRAIL-07`, ADR-007, `SPEC-REF-04`, `SPEC-REF-05` | Ajouter les variantes et leurs critères dans `SPEC-REF-05` |
| 2.4 | Sources absentes du catalogue d'ADR-005 : points d'eau (dont `SPEC-CALC-05` AC-1 exige pourtant la date de mise à jour), tracés, altitudes et cotations (ADR-007 renvoie au catalogue), contour de La Réunion (ADR-002). Le sommaire des ADR attribue pourtant les points d'eau à ADR-005. `REQ-113` impose de documenter chaque source | ADR-005, ADR-007, ADR-002, `SPEC-CALC-05` | Compléter le catalogue d'ADR-005 |
| 2.5 | La durée de conservation des pluies est un « paramètre technique interne, hors `REQ-115` » pour `SPEC-METEO-05`, mais un paramètre modifiable par l'administrateur pour ADR-003. Même écart pour le seuil et la durée du blocage (`SPEC-AUTH-04`) | `SPEC-METEO-05`, `SPEC-AUTH-04`, ADR-003 | Suit la décision du point 1.1 |
| 2.6 | Le découpage des tracés par zone météo est calculé et stocké en base selon ADR-002, mais précalculé et gardé en mémoire selon ADR-007 (point 12) | ADR-002, ADR-007 | Choisir un seul lieu |
| 2.7 | ADR-007 écrit encore que pgRouting « impose PostgreSQL / PostGIS à ADR-002 » et que le routage en TypeScript « laisse ADR-002 libre de son choix de base », alors qu'ADR-002 a déjà retenu PostGIS | ADR-007 | Mettre à jour le texte |
| 2.8 | Personne n'a la charge du découpage d'un tronçon par créneau horaire (`SPEC-METEO-04`, cas 6 et AC-5). ADR-002 le confie aux moteurs de calcul ; ADR-007 (point 13) n'attribue qu'une heure de passage par tronçon ; ADR-008 n'en parle pas | `SPEC-METEO-04`, ADR-002, ADR-007, ADR-008 | Le décrire dans ADR-008 |
| 2.9 | La page de chaque sentier (`REQ-026`) n'est portée par aucune spec. La page d'un spot l'est par `SPEC-PECHE-03` | ARB-009 (ouvert) | Trancher ARB-009 |
| 2.10 | Retours des ADR vers les specs, non reportés : `SPEC-AUTH-10` cas 4 à reformuler en « compte portant le rôle administrateur » (ADR-004) ; sort de l'auteur d'un forçage quand son compte est supprimé (ADR-002 → `SPEC-ADMIN-02`) ; alias déjà en base attribué à un autre élément (ADR-002 → `SPEC-REF-04`) ; point situé sur la frontière entre deux zones (ADR-002 → `SPEC-METEO-02`) | ADR-002, ADR-004 | Reporter dans les specs citées |
| 2.11 | ADR-004 se contredit : l'option A parle d'une suppression des sessions « en cascade » (ADR-002), alors que ses conséquences et ADR-002 précisent qu'il n'y a pas de clé étrangère et que la suppression se fait par une requête | ADR-004 | Corriger le texte de l'option A |

---

## 3. Cohérence interne et forme

- **Renvois `-nn` à résoudre.** Plus de 70 renvois `SPEC-CALC-nn`, `SPEC-ADMIN-nn`, `SPEC-PECHE-nn`, `SPEC-TRAIL-nn`, `SPEC-METEO-nn` dans `comptes-profil.md`, `referentiels.md` et `sources-meteo.md` peuvent maintenant être remplacés par l'identifiant réel.
- **Renvois périmés.**
  - `SPEC-TRAIL-05` (portée) dit la spec `METEO` « non rédigée, ARB-007 », alors que l'en-tête de `trail.md` la dit couverte par `SPEC-METEO-04`.
  - `SPEC-CALC-07` renvoie le choix d'une IA gratuite à un « ADR à rédiger » : c'est ADR-009.
  - Le sommaire des specs (section `TRAIL`) dit `ADMIN` et `REF` « non rédigés ».
- **Statuts hétérogènes.**
  - « validée » pour `ADMIN`, `PECHE` et `COMP`, sans trace de validation dans `planification.md` ;
  - « proposé » pour `AUTH`, `REF` et `METEO`, dont les tables « Revue IA » sont vides ;
  - « revue IA faite » pour `TRAIL`, `CALC` et `GPX`.
- **Granularité de la traçabilité.** `PECHE` regroupe ses 5 AC dans un seul `CASE-PECHE-01` ; `ADMIN` et `COMP` aussi, un CASE par spec. Les autres domaines ont un CASE par AC.
- **Double spécification de `REQ-031`.** `SPEC-METEO-03` et `SPEC-PECHE-03` décrivent toutes deux les prévisions sur 3 jours d'un spot, avec des détails qui divergent déjà : heures passées du jour même, données marines.
- **Point déjà réglé.** `SPEC-COMP-03` laisse « classement des sports absent du profil » en « non défini », alors que `SPEC-AUTH-01` AC-8 rend le classement obligatoire. Le point peut être fermé.
- **Noms de l'équipe.** Le CDC nomme « Maxime, Thomas, Ivan » ; le README et les ADR, « TiBenoit, MaxLaMenace, Ivan ». Le champ « Décidé par » des ADR mêle des noms et « équipe projet ».
- **Kanban du README.** TSK-13 (sommaire des ADR et SPEC ARCH) est « À faire » alors que le sommaire des ADR existe ; la spec `ARCH`, elle, manque toujours.
- **CASE.** Aucun fichier `CASE-*` n'existe encore dans `tdd/tests/cases/` : c'est attendu à ce stade, mais la chaîne s'arrête aux specs.

---

## 4. Ce qui est cohérent

- **CDC → specs :** toutes les REQ actives sauf `REQ-101` et `REQ-111` sont portées par au moins une SPEC ; les règles `R-01` à `R-20` (hors `R-15`, supprimée) sont toutes citées.
- **`AUTH` ↔ ADR-004 ↔ ADR-006 :** sessions révocables (`SPEC-AUTH-10` AC-4), blocage sans fermeture des sessions (`SPEC-AUTH-04` AC-8), message neutre, purge du navigateur (`SPEC-AUTH-02` AC-7, `SPEC-AUTH-10` AC-5) : les ADR répondent point par point aux AC.
- **`METEO-02` ↔ ADR-003 :** refus bloquant d'un chevauchement de zones (AC-3) et signalement non bloquant d'une zone disparue (AC-5).
- **`CALC` ↔ ADR-008 ↔ ADR-009 :** règles fixes sans IA, état « non évaluable », verdict « au moins défavorable » quand une donnée manque, textes types toujours disponibles, contrôle de fidélité de l'IA, aucune donnée du profil transmise.
- **`GPX` :** les trois specs sont cohérentes entre elles et avec ce que le sommaire des ADR annonce pour ADR-010.

---

## 5. Ordre de traitement proposé

1. Décider du sort d'ADR-003 : consigner la demande du client, ou revenir à l'option B (point 1.1).
2. Trancher ARB-010, ARB-012 et ARB-013, puis aligner `SPEC-REF-06`, `SPEC-TRAIL-05`, `SPEC-TRAIL-07` et ADR-008 (point 1.2).
3. Rédiger `tdd/specs/architecture.md`, ADR-010 et ADR-011, ou les retirer des index (points 1.3 et 1.4).
4. Reporter ARB-001 à ARB-006 dans `arbitrages.md` et mettre à jour `planification.md` (point 1.5).
5. Corriger `SPEC-COMP-02` (« à risque » compte comme défavorable) et ajouter les variantes du panel pilote dans `SPEC-REF-05` (points 2.2 et 2.3).
6. Compléter le catalogue des sources d'ADR-005 (point 2.4).
7. Passe de nettoyage : renvois `-nn`, renvois périmés, statuts, noms de l'équipe (section 3).
