# ADR — index

Décisions d'architecture du projet **MeteoSport**.  
Gabarit : `ADR-000-template.md`.

| ADR | Titre | Statut | Ancrage CDC |
|---|---|---|---|
| [ADR-001](./ADR-001-architecture-stack-locale.md) | Architecture applicative, stack technique et exécution locale | proposé | REQ-102, REQ-111 |
| [ADR-002](./ADR-002-persistance-donnees-spatiales.md) | Persistance des données, géométries et historique interne des pluies | proposé | REQ-015, REQ-021, REQ-022, REQ-032, R-08, R-10, R-11 |
| [ADR-003](./ADR-003-parametrage-externalise.md) | Externalisation et validation du paramétrage au déploiement | proposé | REQ-108, REQ-115, R-03, R-07, R-12, R-17, R-20 |
| [ADR-004](./ADR-004-securite-auth-rgpd.md) | Authentification, sessions multi-appareils, sécurité et RGPD | proposé | REQ-015 à REQ-020, REQ-105, REQ-106, REQ-114, R-13, R-14, R-16 |
| [ADR-005](./ADR-005-sources-gratuites-quotas-cache.md) | Sources de données gratuites, quotas et stratégie de cache | proposé | REQ-007, REQ-024, REQ-031, REQ-102, REQ-103, REQ-104, REQ-113, R-07, R-10, R-18 |
| [ADR-006](./ADR-006-frontend-pwa-cartographie.md) | Interface mobile-first, PWA connectée, cartographie et purge locale | proposé | REQ-101, REQ-109, REQ-015, REQ-019 |
| [ADR-007](./ADR-007-graphe-sentiers-import-routage.md) | Import des référentiels, graphe des sentiers et moteur de routage | proposé | REQ-001 à REQ-004, REQ-008, REQ-010, REQ-023, REQ-032, R-01, R-02, R-04, R-06 |
| [ADR-008](./ADR-008-moteurs-calcul-deterministes.md) | Isolation des moteurs de calcul déterministes et évaluation des règles | proposé | REQ-005, REQ-012 à REQ-014, REQ-024, REQ-028, REQ-029, REQ-107, R-05, R-09, R-12, R-19, R-20 |
| [ADR-009](./ADR-009-explications-textes-types-ia.md) | Rédaction des explications : textes types et option IA gratuite | proposé | REQ-009, REQ-102, R-05 |
| [ADR-010](./ADR-010-generation-validation-gpx.md) | Génération, simplification de trace et validation GPX 1.1 | proposé | REQ-011, REQ-110, R-01, R-09 |

---

## Description des ADR

### `ADR-001` — Architecture applicative, stack technique et exécution locale
- **Domaines concernés :** `ARCH` (transverse)
- **Décisions à trancher :** Style d'architecture (ex. monolithe modulaire découpé selon les 10 domaines du kit TDD pour aligner `src/` et les signatures), choix des langages/frameworks, outillage de tests automatisés (`tests/` avec simulation de coupure des sources externes pour `REQ-103`), et mode de lancement reproductible en local à coût zéro (`localhost`, script ou conteneurisation).

### `ADR-002` — Persistance des données, géométries et historique interne des pluies
- **Domaines concernés :** `REF`, `METEO`, `AUTH`, `ADMIN`
- **Décisions à trancher :** Choix du SGBD local capable de gérer les entités relationnelles (comptes, profils, consentements, forçages, alertes), les géométries 3D avec altitudes (sentiers, jonctions, points d'eau, spots, emprises des zones météo) et les séries temporelles (historique interne des pluies par zone et par heure, avec purge automatique au-delà de la durée de conservation paramétrée).

### `ADR-003` — Externalisation et validation du paramétrage au déploiement
- **Domaines concernés :** `ARCH`, `METEO`, `CALC`, `GPX`, `AUTH`
- **Décisions à trancher :** Format et chargement des paramètres externalisés sans modification du code (`REQ-108`, `REQ-115` et paramètres ajoutés par les specs : paliers VMA, valeurs par défaut, seuils, âges maximaux, découpage météo, tolérances GPX, blocage connexion). Règles de validation au démarrage : refus bloquant si deux zones météo se chevauchent (`SPEC-METEO-02` AC-3) et signalement non bloquant si une zone référencée par un spot ou un critère pilote disparaît (`SPEC-METEO-02` AC-5).

### `ADR-004` — Authentification, sessions multi-appareils, sécurité et RGPD
- **Domaines concernés :** `AUTH`, `ADMIN`
- **Décisions à trancher :** Mécanisme de sessions serveur révocables immédiatement sur tous les appareils à la suppression du compte (`SPEC-AUTH-10` AC-4) tout en maintenant les sessions actives lors d'un blocage (`SPEC-AUTH-04` AC-8) ; hachage non réversible des mots de passe ; compteur d'échecs porté par le compte et message neutre anti-énumération ; réception locale gratuite des liens de réinitialisation pour la démo (`SPEC-AUTH-03`) ; contrôle d'accès par rôle (RBAC strict empêchant l'administrateur d'accéder aux données personnelles, `SPEC-AUTH-08`) et format standard de l'export RGPD (`SPEC-AUTH-09`).

### `ADR-005` — Sources de données gratuites, quotas et stratégie de cache
- **Domaines concernés :** `METEO`, `PECHE`, `REF`
- **Décisions à trancher :** Sélection et documentation du catalogue des sources gratuites couvrant La Réunion (`REQ-113` : météo horaire 3 jours, vigilances officielles, données marines, état des sentiers ou saisie manuelle admin, points d'eau) ; calcul astronomique local du solunaire sans appel API (`SPEC-METEO-01`) ; marquage « sans source » si un critère marin n'a pas de source gratuite (`REQ-024`) ; cache serveur par zone respectant la fréquence de mise à jour des sources (`SPEC-METEO-01` AC-5), horodatage (`REQ-104`) et détection de péremption sans extrapolation (`R-07`).

### `ADR-006` — Interface mobile-first, PWA connectée, cartographie et purge locale
- **Domaines concernés :** `ARCH`, `AUTH`, `TRAIL`, `PECHE`
- **Décisions à trancher :** Configuration du manifeste et du Service Worker minimal permettant l'installation sur écran d'accueil (`REQ-101`) et l'affichage de l'écran d'indisponibilité hors connexion (`REQ-109`) sans stockage hors ligne des données métier ; purge complète du stockage navigateur et du cache PWA à la déconnexion et à la suppression de compte (`SPEC-AUTH-02` AC-7, `SPEC-AUTH-10` AC-5) ; choix de la bibliothèque cartographique et des fonds de carte libres gratuits.

### `ADR-007` — Import des référentiels, graphe des sentiers et moteur de routage
- **Domaines concernés :** `REF`, `TRAIL`, `METEO`
- **Décisions à trancher :** Format des fichiers d'import et d'import explicite de retrait exécutés par l'équipe projet (`SPEC-REF-04` : géométries, altitudes, cotations, alias de sources, points d'eau, composition et critères du panel pilote) ; modélisation du graphe des sentiers et algorithme de routage sous contraintes (dénivelé, difficulté maximale, recherche par distance ou durée, parcours proche en cas d'impasse, trajet conseillé sur le panel pilote) ; découpage dynamique des tronçons par zone météo et par créneau horaire (`SPEC-METEO-04` AC-5).

### `ADR-008` — Isolation des moteurs de calcul déterministes et évaluation des règles
- **Domaines concernés :** `CALC`, `PECHE`, `COMP`
- **Décisions à trancher :** Conception en fonctions pures isolées (entrées explicites incluant date/heure et paramètres, sans effet de bord ni appel IA) pour garantir la reproductibilité stricte sur jeux de référence (`REQ-107`, `SPEC-CALC-08`) ; moteur déclaratif d'évaluation des règles de sécurité du panel pilote, de la grille générale du verdict, du scoring pêche et du comparateur ; emplacement documentaire des références publiques citées et des dates de validation client (`R-05`).

### `ADR-009` — Rédaction des explications : textes types et option IA gratuite
- **Domaines concernés :** `CALC`, `ARCH`
- **Décisions à trancher :** Socle garanti par textes types (templates déterministes) pour expliquer le verdict et le trajet conseillé (`SPEC-CALC-07`) ; choix d'activer ou non une IA gratuite en option par paramètre (`REQ-009`, `REQ-102`) ; garde-fous si activée : zéro donnée personnelle transmise (`SPEC-CALC-07` AC-5), délai maximal d'attente (timeout) avec repli immédiat sur les textes types et contrôle de fidélité aux résultats calculés.

### `ADR-010` — Génération, simplification de trace et validation GPX 1.1
- **Domaines concernés :** `GPX`
- **Décisions à trancher :** Sérialisation conforme au schéma public GPX 1.1 (trace continue aller/retour, altitudes du référentiel, points de passage pour les points d'eau avec avertissement `R-09`, mention d'aide indicative, zéro donnée personnelle ni temps estimé) ; algorithme de simplification des traces longues respectant le plafond de points, les tolérances d'écart/distance et la préservation des points clés (`SPEC-GPX-03` AC-4) ; validation XSD systématique à la production et en test automatisé avant remise du fichier.

---

**Non retenus (explicite) :**

- **Hébergement cloud et infrastructure de production** — motif : le client exige une démonstration fonctionnelle en local avant tout investissement (`REQ-111`, `CR-001/Q37`).
- **Mode hors-ligne complet en PWA (cache cartographique et données métier)** — motif : hors périmètre ; l'application exige une connexion active et le fichier `.gpx` prend le relais sur le terrain (`REQ-101`, `REQ-109`, `CR-001/Q27`).
- **Synchronisation directe avec les montres et plateformes GPS** — motif : hors périmètre ; le téléchargement d'un fichier `.gpx` standard suffit (`REQ-011`, `REQ-110`, `CR-001/Q19`).
- **Recours à une IA pour les calculs physiologiques, le routage ou le verdict de sécurité** — motif : interdit par règle métier ; calculs exclusivement déterministes par règles fixes (`R-05`, `REQ-107`, `CR-001/Q21`).
- **Sources de données ou API payantes** — motif : contrainte ferme de coût récurrent nul (`0 €`) (`REQ-102`, `CR-001/Q07`, `CR-001/Q28`).
- **Cartographie SIG détaillée des zones réglementées en mer (Réserve marine, risque requin)** — motif : hors périmètre ; remplacée par des alertes génériques rattachées aux spots par l'administrateur (`REQ-027`, `R-11`, `CR-001/Q32`).

Chaîne : `CDC` → **ADR-001…** → specs → CASE → code.