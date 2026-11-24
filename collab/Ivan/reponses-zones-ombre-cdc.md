# Réponses aux zones d'ombre — CDC v1.1

**Date :** 23/11/2026  
**Mise à jour :** 24/11/2026 (arbitrage équipe)  
**Source :** `tdd/docs/cdc/cahier-des-charges-v1.md`, §11.3  
**Rédigé par :** Ivan

Pour chaque zone d'ombre : la question, l'hypothèse actuelle du CDC, puis la réponse retenue. « OK » = hypothèse validée telle quelle.

ZO-10 n'est pas reprise : elle est déjà tranchée par CR-001/Q23 (compte obligatoire).

### Arbitrage équipe (24/11/2026)

| Sujet | Décision retenue |
|---|---|
| Délai 3 semaines | **Hors CDC** — planning |
| Priorités | **Tout en Must** |
| Prévisions | **3 jours affichés** |
| Multi-jours / ZO-19 | **Option la plus simple** : pas d'étapes ; recherche = aujourd'hui |
| Pêche / ZO-22 | **Solution Thomas** : 2 sports (trail + pêche), spot unique |
| Pluies / ZO-32 | **Historique constitué en interne** |
| Compte / profil | **Compte obligatoire** ; valeurs profil **facultatives** → défauts (`ZO-09`, AMB-28) |

---

## Cadrage et validation

| # | Question | Hypothèse actuelle | Réponse |
|---|---|---|---|
| ZO-01 | Identité et fonction du client, outils qu'il utilise aujourd'hui | Problème tel que formulé en §2 | Client : Maximilien (fonction non précisée). Outils utilisés aujourd'hui : les sites Windy et Randopéi |
| ZO-02 | Qui valide le livrable, selon quels critères de recette | Scénarios de recette sur le panel pilote, soumis au client avant le 30/11/2026 | OK pour les **scénarios de recette sur le panel pilote**. La **date** d'échéance est **hors CDC** (planning). |
| ZO-03 | Échéance | Client : 14/12/2026 ; jalon interne : 09/12/2026 | **Hors CDC.** Les dates restent dans le planning projet uniquement. |
| ZO-18 | Qui paie un hébergement après la démo locale | Aucun hébergement payant dans le délai ; décision du client après la démo | OK — aucun hébergement payant pour la démo locale ; décision client après la démo. *(Sans date dans le CDC.)* |
| ZO-30 | Nom « MeteoSport » | Nom provisoire, à valider | Nom « MeteoSport » validé |
| ZO-35 | Faisabilité de 20 Must en 3 semaines à 3 | Charge chiffrée avant présentation ; arbitrage des Must avec le client si dépassement | **Hors CDC.** Charge et calendrier traités au **planning**. Le CDC fixe le besoin en Must, pas la faisabilité calendaire. |

## Trail

| # | Question | Hypothèse actuelle | Réponse |
|---|---|---|---|
| ZO-04 | Saisie de la date et de l'heure de départ | Obligatoire, pré-remplie avec la date et l'heure courantes | OK |
| ZO-05 | Règles de calcul (temps, eau, nourriture, sécurité), validation, rôle de la météo | Références publiques citées, validées par le client ; la chaleur augmente l'eau | OK |
| ZO-06 | Seuils des conseils d'équipement | Grille simple (pluie, soleil, température, vent) proposée par l'équipe, validée par le client | OK |
| ZO-07 | Qui fournit les seuils de sécurité par sentier | L'équipe propose pour les 3 parcours pilotes, le client valide | OK |
| ZO-09 | VMA inconnue ou profil incomplet | Allure de référence par défaut, signalée ; temps et quantités personnalisés seulement avec profil complet | **Confirmé (aligné AMB-28) :** compte obligatoire pour se connecter ; VMA / poids / taille / âge **non obligatoires**. Si non saisis → **valeurs / allure par défaut** (signalées). Temps et quantités personnalisés seulement quand le profil est renseigné. |
| ZO-17 | Critères de météo « idéale » pour un sentier | Verdict à 3 niveaux (favorable, défavorable, à risque) : règles du sentier + grille générale | OK |
| ZO-19 | Heures de passage sur plusieurs jours | Étapes journalières, une heure de départ par étape | **Simplifié (arbitrage 24/11) :** pas de parcours multi-jours ni d'étapes. Recherche / recommandation = **aujourd'hui**. Prévisions météo **affichées sur 3 jours**. Heures de passage estimées sur la journée du trajet uniquement. |
| ZO-20 | Vigilances officielles et fermetures générales | Alerte prioritaire, aucune sortie jugée favorable | OK |
| ZO-21 | Aucun itinéraire valide | Message indiquant la contrainte bloquante | OK, et proposer un trail proche réalisable |
| ZO-29 | Météo des deux passages en aller-retour | Chaque passage affiché séparément | OK |
| ZO-31 | Source automatique de l'état des sentiers | À identifier avant développement ; sinon saisie manuelle par l'administrateur | OK |

## Pêche et arbitrage

| # | Question | Hypothèse actuelle | Réponse |
|---|---|---|---|
| ZO-11 | Réglementation requin / chasse sous-marine, zones à exclure | Aucune recommandation de chasse sous-marine sans alerte réglementaire | OK via **alertes génériques** rattachées aux spots de pêche (pas de pratique distincte hardcodée). Aligné AMB-17 / AMB-18 / INC-07. |
| ZO-15 | Sources gratuites houle, marées, solunaire | Critère sans source retiré du calcul, retrait signalé | OK |
| ZO-22 | Choix de la pratique, classement sur 2 sports ou 3 pratiques | Choix à la recherche ; classement sur 3 pratiques, exclusion possible | **Solution Thomas :** **2 sports** seulement — trail (inclut randonneurs) et pêche. Entité unique **« Spot de pêche »** (GPS précis), **sans** sous-techniques ni 3ᵉ pratique. Classement des sports favoris sur ces 2 types. |
| ZO-23 | Sentiers évalués dans l'arbitrage ; tout est mauvais | Sentiers pilotes proches du départ ; si tout est défavorable, aucune sortie recommandée | OK |
| ZO-32 | Source gratuite d'historique de pluie (24-48 h) | Même traitement que ZO-15 | **Constitution d'historique en interne :** conserver les données des appels aux sources météo gratuites pour alimenter le critère « pluies récentes ». Pas d'historique météo affiché à l'utilisateur (INC-05). |
| ZO-34 | Le créneau de pêche inclut-il le trajet | Créneau = temps sur place, trajet en plus | OK |

## Compte, données, RGPD

| # | Question | Hypothèse actuelle | Réponse |
|---|---|---|---|
| ZO-12 | Rédaction et validation des CGU / politique de confidentialité, responsable de traitement | Modèle fourni par l'équipe, validé et porté par le client | OK |
| ZO-13 | Performance, accessibilité, langues, appareils, nombre d'utilisateurs | Français, smartphones récents, aucun engagement de volume | OK |
| ZO-14 | Montres / GPS de test pour le `.gpx` | Appareils dont dispose l'équipe | OK |
| ZO-16 | Âge à partir duquel une donnée est « pas à jour » | Seuil paramétrable par type de donnée | OK |
| ZO-24 | Données retrouvées sur les autres appareils | Profil et classement des sports seulement | OK |
| ZO-25 | Cycle de vie du compte | Parcours standards (création, connexion, déconnexion, mot de passe oublié) | OK |
| ZO-26 | Conservation, mineurs, retrait du consentement, format d'export | 15 ans et plus ; retrait = effacement des données de forme physique ; durée fixée par le client ; export standard | OK |
| ZO-28 | Plages de valeurs du profil | Plages plausibles fixées par l'équipe, saisie hors plage refusée | OK |
| ZO-33 | Âge, poids, VMA = données de santé au sens du RGPD ? | Consentement explicite maintenu, qualification validée par le client | OK |

## Administration

| # | Question | Hypothèse actuelle | Réponse |
|---|---|---|---|
| ZO-08 | Qui est administrateur après la livraison | Le client | OK |
| ZO-27 | Création des comptes admin, traçabilité des forçages | Comptes créés par l'équipe ; auteur, date et motif enregistrés | OK |
