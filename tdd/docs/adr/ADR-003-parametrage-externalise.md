# ADR-003 — Externalisation et validation du paramétrage

**Statut :** proposé
**Date :** 25/11/2026
**Décidé par :** équipe projet

---

## Contexte

Plusieurs valeurs qui pilotent les calculs et les affichages doivent pouvoir
changer **sans modifier l'application** :

- `REQ-108` — le découpage météo (communes, secteurs d'altitude, stations) et ses
  limites se paramètrent **au déploiement**, pour respecter les quotas des sources
  (`R-03`, `CR-001/Q38`).
- `REQ-115` — les paliers de VMA (`R-20`), les valeurs par défaut du profil
  (`R-17`), le seuil d'équivalence des scores (`R-12`) et l'âge maximal de chaque
  type de donnée (`R-07`) se paramètrent sans modifier l'application
  (`CR-001/Q21, Q26, Q33`).

Vérification attendue par le CDC dans les deux cas : *modification d'un
paramètre, puis vérification de son effet*.

Les specs ajoutent des paramètres absents de la liste de `REQ-115` :

| Domaine | Paramètres | Source |
|---|---|---|
| `CALC` | pourcentage de VMA de l'allure, durée de la pluie récente, distance maximale d'un point d'eau au tracé, délai d'attente de l'IA | `calculs.md`, en-tête `ARCH` |
| `GPX` | nombre maximal de points d'une trace, tolérance d'écart de la simplification, tolérance de distance (hypothèse 2 %) | `SPEC-GPX-03` |
| `AUTH` | seuil d'échecs et durée de blocage, durée de validité d'une session sans activité, durée de validité du lien de réinitialisation | `comptes-profil.md` (AC-4 du blocage : choix d'équipe hors `REQ-115`) |
| `METEO` | durée de conservation de l'historique des pluies | `sources-meteo.md`, cas limite 4 de l'historique |
| `TRAIL` | correspondance palier → plage de durée cible | `trail.md`, recherche par niveau |

Le découpage météo a une nature différente des autres paramètres : ce sont des
**emprises géographiques** avec plages d'altitude, et non des valeurs scalaires.
`SPEC-METEO-02` impose deux règles sur ce découpage :

- AC-3 — un découpage dont deux zones se chevauchent (même point, position et
  altitude) est **refusé au démarrage** ;
- AC-5 — une zone retirée alors qu'un spot ou un critère de sécurité la désigne
  **ne bloque pas** le démarrage ; la référence invalide est signalée à l'équipe
  (mode de signalement laissé ouvert par la spec).

Contraintes transverses : coût nul et exécution locale (`REQ-102`, `REQ-111`),
calculs déterministes et reproductibles (`REQ-107`, `R-05`).

## Options envisagées

### Option A — Constantes dans le code

| | |
|---|---|
| Ce qu'elle apporte | Aucune infrastructure ; valeurs typées et vérifiées à la compilation. |
| Ce qu'elle coûte | Toute modification exige de changer le code et de redéployer : **contraire à `REQ-108` et `REQ-115`**. |
| Ce qu'elle rend difficile plus tard | Ajuster une valeur après la recette sans intervention de l'équipe. |

### Option B — Fichier de configuration versionné (YAML), lu et validé au démarrage

| | |
|---|---|
| Ce qu'elle apporte | Conforme à `REQ-108`/`REQ-115` ; relu en revue Git ; validation complète au démarrage (refus bloquant possible). |
| Ce qu'elle coûte | Modifier une valeur exige d'éditer un fichier sur le poste et de redémarrer : réservé à l'équipe technique. |
| Ce qu'elle rend difficile plus tard | Laisser le client ajuster lui-même un seuil ; savoir quelle valeur s'appliquait à une date donnée (dépend de l'historique Git du poste). |

### Option C — Paramètres scalaires en base, modifiables dans l'espace d'administration ; découpage météo en fichier GeoJSON lu au démarrage

| | |
|---|---|
| Ce qu'elle apporte | Le client ajuste lui-même les valeurs, sans redémarrer ni intervention de l'équipe ; effet immédiat ; historique des modifications en base. Le découpage géographique garde un fichier éditable dans un outil SIG libre et la validation au démarrage exigée par `SPEC-METEO-02`. |
| Ce qu'elle coûte | Un écran d'administration supplémentaire, une table de paramètres et une table d'historique, une validation à l'enregistrement ; deux mécanismes à maintenir (base pour les scalaires, fichier pour les zones). |
| Ce qu'elle rend difficile plus tard | Modifier le découpage météo depuis l'écran (il reste un acte de déploiement). |

### Option D — Tout en base, découpage météo compris

| | |
|---|---|
| Ce qu'elle apporte | Un seul mécanisme. |
| Ce qu'elle coûte | Saisie de polygones dans un écran (lourde, sujette à erreur) ; le refus « au démarrage » de `SPEC-METEO-02` AC-3 devient un refus à l'enregistrement ; s'écarte du « au déploiement » de `REQ-108`. |
| Ce qu'elle rend difficile plus tard | Faire relire le découpage en revue de code. |

## Décision

Nous retenons l'**option C** : les paramètres scalaires sont enregistrés en base
et modifiés par l'administrateur dans l'espace d'administration, avec effet
immédiat et historique ; le découpage météo reste un fichier GeoJSON versionné,
lu et validé au démarrage.

### Paramètres scalaires

1. **Stockage.** Une table de paramètres : clé, domaine, valeur typée, unité,
   bornes de validité, libellé. Le catalogue couvre la liste de `REQ-115` et les
   paramètres ajoutés par les specs (tableau du contexte).
2. **Valeurs initiales.** Chargées par un script d'amorçage (seed) versionné dans
   le dépôt. Il est le seul endroit où figurent les valeurs par défaut ; aucune
   valeur métier n'est écrite en dur dans le code. Démarrage refusé si un
   paramètre du catalogue est absent de la base.
3. **Modification.** Écran réservé au rôle administrateur (contrôle d'accès :
   `ADR-004`). Validation à l'enregistrement : type, bornes, cohérence entre
   paramètres (paliers de VMA strictement croissants et sans trou, tolérances
   positives…). Une valeur invalide est refusée avec le motif ; l'ancienne valeur
   reste en vigueur.
4. **Historique.** Chaque modification enregistre auteur, date, ancienne valeur,
   nouvelle valeur et motif, sur le modèle des forçages (`R-08`).
5. **Prise d'effet.** Immédiate : les calculs et affichages suivants utilisent la
   nouvelle valeur. Un calcul en cours garde le jeu de valeurs lu à son début.
   Les moteurs de calcul reçoivent les paramètres en **entrée explicite**
   (`ADR-008`), ce qui garde le calcul reproductible (`REQ-107`) : même entrée,
   mêmes paramètres, même résultat.

### Découpage météo

6. **Format.** Un fichier GeoJSON versionné (FeatureCollection) ; chaque zone
   porte : identifiant stable, nom, type (`commune`, `secteur_altitude`,
   `station`), emprise, altitude minimale et maximale éventuelles. Une limite
   d'altitude appartient au secteur supérieur (`SPEC-METEO-02`, cas limite 1).
7. **Prise d'effet.** Au redémarrage de l'application (`REQ-108` : « au
   déploiement » ; scénario « Modification du découpage au déploiement » de
   `SPEC-METEO-02`).
8. **Validation au démarrage — bloquante.** Fichier illisible, zone mal formée,
   identifiant dupliqué, ou deux zones qui se recouvrent (intersection des
   emprises **et** des plages d'altitude) : l'application refuse de démarrer et
   donne le motif et les zones en cause (`SPEC-METEO-02` AC-3).
9. **Validation au démarrage — non bloquante.** Toute référence à une zone
   absente du découpage (secteur de pluie d'un spot, zone d'un critère de
   sécurité du panel pilote) est signalée **dans le journal de démarrage** et
   dans **un rapport fichier** listant chaque élément concerné. Le démarrage
   continue ; les conséquences relèvent des référentiels (`SPEC-REF-02`,
   `SPEC-REF-05`, cas limites 6) (`SPEC-METEO-02` AC-5).

## Raisons

- L'option A est écartée : elle contredit directement `REQ-108` et `REQ-115`.
- Entre B et C, le critère décisif est **qui modifie** : l'administrateur client
  doit pouvoir ajuster lui-même les valeurs, sans intervention de l'équipe
  technique ni redémarrage, ce qu'un fichier sur le poste ne permet pas. Ce
  besoin a été confirmé oralement par le client à l'équipe ; il n'est consigné
  dans aucun document de `tdd/` et ne s'appuie donc sur aucune exigence du CDC
  (voir « Conséquences acceptées »).
- L'historique en base répond au besoin de reproductibilité de `REQ-107` : on sait
  quelle valeur s'appliquait à une date donnée, ce qu'un fichier modifié en place
  ne garantit pas.
- Le découpage météo est séparé (rejet de D) parce que sa nature (géométries) et
  ses règles (`REQ-108` « au déploiement », refus « au démarrage » de
  `SPEC-METEO-02` AC-3) diffèrent ; GeoJSON est un format ouvert, éditable dans
  des outils libres, sans coût (`REQ-102`).
- Le journal plus un rapport fichier suffisent au signalement de `SPEC-METEO-02`
  AC-5 : le découpage ne change qu'au déploiement, donc l'équipe est présente pour
  le lire ; aucun écran supplémentaire.

## Conséquences acceptées

- **Écart assumé avec le CDC.** Le CDC (§ parties prenantes, `REQ-021`,
  `REQ-022`) et le CR-001 (`Q42`) limitent l'administrateur à l'état des sentiers
  et aux alertes. Le réglage des paramètres par l'administrateur repose sur une
  confirmation orale du client, que l'équipe a choisi de ne pas consigner : ni
  compte rendu, ni fiche d'impact, ni mise à jour du CDC. Cet ADR est la seule
  trace de ce choix ; aucune exigence du CDC ne le couvre.
- **Nouvelle spec.** L'écran de paramètres n'est couvert par aucune des specs
  `SPEC-ADMIN-01` à `04` : une spec dédiée est à écrire, et la portée de
  `SPEC-ADMIN-01` est à étendre.
- **Le client agit sur des valeurs de sécurité.** Âges maximaux des données,
  paliers de VMA et seuil d'équivalence influent sur ce qui est affiché comme sûr
  ou favorable. Les bornes de validité fixées par l'équipe dans le catalogue sont
  le garde-fou ; une valeur hors bornes est refusée.
- **Paramètres `AUTH` et IA exposés au client.** Seuil et durée de blocage, durées
  de session et de lien, délai d'attente de l'IA sont dans le même catalogue. Les
  bornes empêchent les valeurs qui désactiveraient la protection (ex. seuil
  d'échecs nul).
- **Deux mécanismes à maintenir** : base pour les scalaires, fichier pour le
  découpage.
- **Dépendances** : le SGBD est choisi par `ADR-002` ; le rôle administrateur et
  son contrôle d'accès par `ADR-004` ; le passage des paramètres en entrée
  explicite des moteurs par `ADR-008`.
- **Tests** : chaque paramètre du catalogue doit avoir un test « modification →
  effet » (vérification de `REQ-108` et `REQ-115`), plus les cas de refus
  (valeur hors bornes, chevauchement de zones) et le signalement des références
  invalides.

## Ce qui nous ferait revenir dessus

- Le client revient sur sa demande de régler lui-même ces paramètres : on
  revient à l'option B (fichier, équipe technique seule).
- Le découpage météo doit changer souvent ou être ajusté par le client (par
  exemple pour suivre les quotas en cours d'exploitation) : on reconsidère
  l'option D.
- Une modification de paramètre à chaud produit des résultats incohérents au sein
  d'une même réponse (par exemple trail et pêche évalués avec deux jeux de valeurs
  dans le comparateur) malgré le jeu de valeurs figé au début du calcul.
