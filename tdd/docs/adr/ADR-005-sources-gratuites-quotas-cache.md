# ADR-005 — Sources de données gratuites, quotas et stratégie de cache

**Statut :** proposé
**Date :** 25/11/2026
**Décidé par :** équipe projet

---

## Contexte

L'application affiche et exploite des données externes : prévisions météo
horaires sur 3 jours par zone (`REQ-007`, `REQ-031`, `R-18`), vigilances
officielles (`R-19`), données marines et solunaire pour la pêche (`REQ-024`),
état des sentiers (`REQ-032`). Le client n'impose aucune source et délègue le
choix à l'équipe, avec une exigence de fiabilité et de fraîcheur
(`CR-001/Q25`).

Contraintes :

- `REQ-102` — sources gratuites uniquement, dans la limite de leurs quotas ;
  aucune source payante (`CR-001/Q28`).
- `REQ-113` — chaque source est documentée : producteur, fréquence de mise à
  jour, conditions d'utilisation, justification de sa fiabilité ; la liste est
  revue avec le client.
- `REQ-103`, `REQ-104`, `R-07` — chaque information affichée porte sa date de
  mise à jour ; une source indisponible ou une donnée plus ancienne que l'âge
  maximal paramétré (`ADR-003`) produit un message par secteur, sans valeur
  inventée (`SPEC-METEO-06`).
- `REQ-024` — un critère de pêche sans source gratuite est retiré du calcul et
  ce retrait est signalé (`SPEC-METEO-01` AC-4, AC-6).
- `R-10` — l'historique des pluies récentes est constitué par l'application à
  partir des données reçues (`SPEC-METEO-05`).
- `SPEC-METEO-01` AC-3 et AC-5 — les appels quotidiens restent sous le quota de
  chaque source pour le découpage paramétré ; une donnée n'est pas redemandée
  avant sa prochaine mise à jour prévue.
- Le découpage météo par zones est paramétré au déploiement pour tenir les
  quotas (`REQ-108`, `CR-001/Q38`, `ADR-003`).
- Délai : fin de cycle le 09/12/2026, backend Express 5 / TypeScript
  (`ADR-001`).

État des sources gratuites relevé par l'équipe le 25/11/2026 :

| Besoin | Constat |
|---|---|
| Prévisions horaires | **Open-Meteo** : API JSON sans clé, gratuite pour un usage non commercial, moins de 10 000 appels par jour (5 000 par heure, 600 par minute), données sous CC BY 4.0 (mention de la source obligatoire). Sur La Réunion, seuls des modèles globaux sont servis (résolution de l'ordre de 9 à 25 km). **Météo-France** publie AROME Outre-Mer Réunion-Mayotte à 2,5 km, gratuit depuis 2024, mais via un portail à compte et clé, en fichiers GRIB2, avec des quotas non publiés et une stabilité signalée comme faible par des réutilisateurs. |
| Vigilances officielles | Flux de vigilance Outre-mer de Météo-France, mis à jour chaque minute, accessible uniquement par le portail API Météo-France (compte gratuit). Pas d'alternative officielle gratuite. |
| Houle, vent côtier | **Open-Meteo Marine** : hauteur, période et direction de houle, horaire ; précision limitée près des côtes, données « non adaptées à la navigation ». |
| Marée | API de prédiction du **SHOM** : réservée aux abonnés payants → exclue (`REQ-102`). Open-Meteo Marine fournit une hauteur de mer modélisée qui inclut la marée, rapportée au niveau moyen des mers, et non au zéro des cartes. |
| État des sentiers | Pas d'API ONF exploitable ; correction manuelle par l'administrateur (`CR-001/Q36`, `REQ-021`). |
| Solunaire | Calculable localement à partir d'algorithmes astronomiques publics (hypothèse de `SPEC-METEO-01`). |

## Options envisagées

### Option A — Open-Meteo pour la météo et la mer, Météo-France pour les vigilances, collecte planifiée

| | |
|---|---|
| Ce qu'elle apporte | Une seule API JSON pour prévisions, houle, vent et marée estimée : intégration rapide, quotas publiés et larges. Source officielle pour les vigilances, seule donnée à enjeu de sécurité majeur (`R-19`). Quota prévisible et historique des pluies continu grâce à la collecte planifiée. |
| Ce qu'elle coûte | Modèles globaux : les microclimats réunionnais sont mal résolus. Marée approximative. Un compte sur le portail Météo-France à créer et une clé à gérer. Usage limité au non commercial. |
| Ce qu'elle rend difficile plus tard | Une exploitation commerciale (abonnement Open-Meteo payant, contraire à `REQ-102`). |

### Option B — Météo-France AROME Outre-Mer pour les prévisions et les vigilances

| | |
|---|---|
| Ce qu'elle apporte | Résolution de 2,5 km, adaptée au relief ; producteur officiel, argument fort pour `REQ-113`. |
| Ce qu'elle coûte | Décodage GRIB2 et extraction par zone côté Node ; quotas inconnus ; plateforme instable ; la houle et la marée restent à trouver ailleurs. Risque élevé sur le délai du 09/12/2026. |
| Ce qu'elle rend difficile plus tard | Changer de source : le traitement des grilles GRIB2 est propre à ce producteur. |

### Option C — AROME Outre-Mer en source principale, Open-Meteo en repli

| | |
|---|---|
| Ce qu'elle apporte | Précision quand Météo-France répond, continuité sinon. |
| Ce qu'elle coûte | Double intégration. La donnée affichée change de producteur selon les pannes : il faut l'indiquer à chaque affichage et l'expliquer au client. |
| Ce qu'elle rend difficile plus tard | Garantir la reproductibilité des résultats (`REQ-107`) quand deux producteurs alternent sur une même zone. |

### Option D — Interrogation des sources à la demande, avec cache à durée de vie

| | |
|---|---|
| Ce qu'elle apporte | Aucun appel pour une zone que personne ne consulte. |
| Ce qu'elle coûte | Premier affichage plus lent ; pic d'appels non maîtrisé ; **trous dans l'historique des pluies** quand personne ne consulte une zone, ce qui rend le cumul indisponible (`SPEC-METEO-05`, cas limite 1). |
| Ce qu'elle rend difficile plus tard | Estimer à l'avance les appels comparés aux quotas (`REQ-102`). |

## Décision

Nous retenons l'**option A** : Open-Meteo (prévisions et données marines, marée
comprise à titre d'estimation), l'API de vigilance de Météo-France pour les
vigilances, un calcul local du solunaire et la saisie manuelle de l'état des
sentiers ; les sources sont interrogées par une collecte planifiée côté serveur
qui alimente un cache en base.

### Catalogue retenu

| Type de donnée | Source | Producteur | Remarques |
|---|---|---|---|
| Prévisions horaires 3 jours : pluie, vent, température, ensoleillement | Open-Meteo, API Forecast | Open-Meteo (modèles globaux) | Mention de la source affichée (CC BY 4.0) |
| Vigilances officielles | API vigilance Météo-France, flux Outre-mer | Météo-France | Compte et clé créés par l'équipe sur le portail |
| Houle (hauteur, période, direction), vent côtier | Open-Meteo, API Marine | Open-Meteo (modèles de vagues) | Précision limitée près des côtes, présentée comme telle |
| Marée | Open-Meteo, API Marine (hauteur de mer) | Open-Meteo | **Présentée comme une estimation** ; seule la tendance (montante, descendante, étale) est exploitée, jamais une hauteur au zéro des cartes |
| Solunaire (lune, lever et coucher du soleil) | Calcul local | — (algorithmes astronomiques publics) | Aucun appel, aucun quota ; méthode et référence documentées |
| État des sentiers | Saisie de l'administrateur | — | `REQ-021`, `R-08` ; pas de collecte |
| Pluies récentes (historique) | Dérivé des prévisions Open-Meteo collectées | — | Voir point 4 ci-dessous |

### Collecte et cache

1. **Collecte planifiée.** Une tâche du backend interroge chaque source au
   rythme de mise à jour de ses données, pour chaque zone du découpage
   (`ADR-003`) et pour chaque spot pour les données marines. Une donnée n'est pas
   redemandée avant sa prochaine mise à jour prévue (`SPEC-METEO-01` AC-5).
   Les écrans ne lisent que le cache, jamais les sources directement.
2. **Cache en base** (`ADR-002`). Chaque donnée est stockée avec son secteur
   (zone, spot), sa source, sa date de mise à jour par le producteur ou, à
   défaut, sa date de réception présentée comme telle (`SPEC-METEO-06`, cas
   limite 6).
3. **Fraîcheur.** À chaque lecture, l'âge de la donnée est comparé à l'âge
   maximal paramétré pour son type (`ADR-003`). Au-delà, la donnée n'est plus
   présentée comme courante et le message par secteur s'affiche (`R-07`,
   `SPEC-METEO-06`). Aucune extrapolation ni valeur de remplacement ; aucune
   source de repli.
4. **Historique des pluies.** Faute de source gratuite d'observations, la
   collecte conserve, pour chaque zone et chaque heure écoulée, la **dernière
   prévision reçue** pour cette heure (`SPEC-METEO-05` : « dernière prévision
   reçue pour l'heure écoulée »). Purge au-delà de la durée de conservation
   paramétrée.
5. **Quotas.** Un compteur d'appels par source et par jour est tenu par le
   backend. Avant chaque appel, le compteur est comparé au quota publié avec une
   marge. Quota atteint : plus aucun appel jusqu'au renouvellement ; les données
   vieillissent et suivent `SPEC-METEO-06` (`SPEC-METEO-01`, cas limite 2).
   Une erreur de la source (indisponibilité, refus) est journalisée ; la donnée
   précédente reste en cache avec sa date et vieillit normalement.
6. **Estimation des appels** (`REQ-102`, `SPEC-METEO-01` AC-3). Pour un
   découpage de *Z* zones et *S* spots collectés toutes les heures :
   `24 × (Z + S)` appels Open-Meteo par jour, par exemple `24 × (40 + 30) =
   1 680`, soit moins de 20 % du quota quotidien. L'estimation est recalculée à
   chaque changement de découpage et figure dans le catalogue.
7. **Catalogue documentaire.** Une fiche par source (producteur, données,
   fréquence, quotas, conditions d'utilisation, fiabilité) est tenue dans
   `tdd/docs/` et présentée au client (`REQ-113`, `SPEC-METEO-01` AC-1).
8. **Tests.** Chaque source est accessible derrière une interface ; les tests
   automatisés la remplacent par une source simulée pour couper chaque source et
   simuler une donnée périmée (vérification de `REQ-103`).

## Raisons

- **Délai et risque.** Open-Meteo s'intègre en JSON sans clé et publie ses
  quotas ; AROME Outre-Mer impose un décodage GRIB2 et repose sur une plateforme
  instable aux quotas non publiés. Avec une fin de cycle au 09/12/2026, l'option
  B fait porter un risque de livraison sur la donnée centrale de l'application.
- **Une seule source par type de donnée.** L'option C mélange deux producteurs
  sur une même zone selon les pannes, ce qui brouille la date et l'origine
  affichées (`REQ-104`) et la reproductibilité (`REQ-107`). `R-07` demande de
  signaler l'indisponibilité, pas de la masquer par une autre source.
- **Les vigilances justifient l'effort d'un compte Météo-France.** Ce sont les
  seules données dont l'absence change le verdict de sécurité (`R-19`) ; il n'en
  existe pas d'autre source officielle gratuite, et `SPEC-METEO-06` (cas limite
  5) interdit de présenter une absence de vigilance comme confirmée.
- **Marée en estimation plutôt que retirée.** Le client cite la marée parmi les
  critères de pêche (`CR-001/Q09`). Seule sa tendance compte pour le score ; la
  hauteur modélisée suffit à la donner, à condition d'être présentée comme une
  estimation, comme la clarté de l'eau (`R-10`).
- **Collecte planifiée plutôt qu'à la demande.** Elle rend la consommation de
  quota prévisible et vérifiable (`REQ-102`), et elle seule garantit un
  historique des pluies sans trou, condition des cumuls de `SPEC-METEO-05`.
- **Solunaire local.** Aucun quota, aucune panne possible, résultat déterministe.

## Conséquences acceptées

- **Précision limitée en montagne.** Les modèles globaux d'Open-Meteo lissent
  les microclimats (`CR-001/Q38`). La météo d'un secteur d'altitude restera
  celle d'un point du modèle. La justification de fiabilité du catalogue
  (`REQ-113`) doit le dire au client.
- **Usage non commercial.** La gratuité d'Open-Meteo est réservée à l'usage non
  commercial. La démonstration locale (`REQ-111`) en relève ; une exploitation
  commerciale imposerait un abonnement, contraire à `REQ-102`.
- **Mention de la source** Open-Meteo (CC BY 4.0) affichée dans l'application
  (`SPEC-METEO-01`, cas limite 4).
- **Compte Météo-France à créer** par l'équipe, avec une clé gardée hors du dépôt
  (`ADR-004`). La plateforme pouvant être instable, les vigilances seront plus
  souvent « indisponibles » que les autres données ; c'est le comportement prévu
  par `SPEC-METEO-06`.
- **Marée approximative.** Valeurs rapportées au niveau moyen des mers, précision
  limitée près des côtes : présentée comme une estimation, seule la tendance est
  utilisée par le score pêche.
- **Pluies de l'historique issues de prévisions**, non d'observations : le cumul
  est une estimation, cohérente avec la présentation de la clarté comme
  estimation (`R-10`) ; à dire dans la justification des critères du panel
  pilote (`REQ-023`).
- **Une tâche de fond dans le backend** (planification, compteur de quotas,
  journalisation), à prévoir dans l'instance Express (`ADR-001`).
- **Appels même sans utilisateur.** La collecte tourne tant que l'application
  est démarrée ; à l'arrêt, l'historique a des trous et les cumuls sont
  indisponibles jusqu'à ce qu'il couvre de nouveau la période (`SPEC-METEO-05`,
  cas limite 2).

## Ce qui nous ferait revenir dessus

- La revue du catalogue avec le client (`REQ-113`) juge la résolution des modèles
  globaux insuffisante pour le panel pilote : on passe à AROME Outre-Mer pour les
  prévisions (option B), si le délai le permet.
- Open-Meteo modifie ses conditions (quota, fin de la gratuité non commerciale)
  ou l'application devient commerciale : source retirée (`SPEC-METEO-01`, cas
  limite 5) et bascule vers Météo-France.
- Le portail Météo-France reste inaccessible pendant la recette : les vigilances
  sont marquées « sans source » et l'impact sur le verdict (`R-19`) est soumis au
  client.
- Les écarts de marée estimée se révèlent trompeurs sur les spots du littoral :
  le critère passe en « sans source », avec retrait signalé (`REQ-024`).
- L'estimation des appels dépasse 50 % du quota pour le découpage retenu : on
  espace la collecte ou on réduit le nombre de zones (`REQ-108`).
