# Rapport de vérification ciblée — Points résiduels et vigilances (CDC v1 vs CR-001)

**Auteur :** Thomas (TiBenoit)  
**Date :** 23/11/2026  
**Documents audités :**
* Cahier des charges consolidé : [tdd/docs/cdc/cahier-des-charges-v1.md](file:///home/thomaz/Documents/project/Expernet/MeteoSport/tdd/docs/cdc/cahier-des-charges-v1.md)
* Compte rendu d'entretien officiel : [tdd/docs/cr/cr-001.md](file:///home/thomaz/Documents/project/Expernet/MeteoSport/tdd/docs/cr/cr-001.md)

---

## 1. Synthèse exécutive et Bilan de la revue croisée

À la suite de la première phase de relecture croisée de l'équipe (rapports de Thomas, Maxime et Ivan), une vaste opération d'harmonisation a été menée. Les deux documents présentent aujourd'hui une **excellente cohérence globale** et un niveau de rigueur rare :
1. **Couverture intégrale (`Q01` à `Q42`) :** chaque réponse du CR-001 trouve une correspondance traçable dans le CDC v1.
2. **Absence totale de dérive technique :** le CDC respecte strictement son principe fondamental (*« formaliser le problème, pas la solution »*) sans citer de frameworks, bases de données ou technologies d'implémentation.
3. **Traitement transparent des paradoxes :** les 11 incohérences internes du client (`INC-01` à `INC-11`), les 18 ambiguïtés (`AMB-01` à `AMB-18`) et les 30 zones d'ombre (`ZO-01` à `ZO-30`) sont formellement isolées en section 11 avec des hypothèses de travail documentées.

L'examen approfondi montre qu'il ne subsiste que :
* **2 points résiduels sur le fond** (impactant le périmètre et la charge du MVP),
* **3 points mineurs de vigilance documentaire et de traçabilité**.

---

## 2. Les 2 points résiduels sur le fond (Périmètre & Faisabilité MVP)

### Point 1 : Durcissement sur la PWA (`C5` et `REQ-101`)

| Référence CDC | Texte actuel dans le CDC v1 | Source CR-001 | Écart constaté |
| :--- | :--- | :--- | :--- |
| **Contrainte n° 5** (§7) | *« Application web orientée mobile. L'installation sur l'écran d'accueil est retenue pour l'ergonomie (⚠ ZO-13) »* | `CR-001/Q01`, `CR-001/Q27` | Durcissement d'une simple possibilité ergonomique |
| **REQ-101** (§10) | *« L'application est utilisable sur smartphone et installable sur l'écran d'accueil (⚠ ZO-13) »* | `CR-001/Q01`, `CR-001/Q27` | Exigence classée en obligation absolue vérifiable |

* **Constat dans le CR-001 :**
  * `Q01` : *« Application web orientée mobile, avec **possibilité** de PWA »*.
  * `Q27` : *« Rien d'imposé pour le moment, la PWA est uniquement là pour l'ergonomie, l'application doit fonctionner avec une connexion active »*.
* **Problème :** Le CDC transforme une simple faculté (*« possibilité »*) en une exigence contractuelle stricte (`REQ-101` : *« installable sur l'écran d'accueil »*).
* **Risque :** L'installation sur l'écran d'accueil (Add to Home Screen) dépend des navigateurs et des OS (comportement très restrictif sous Safari iOS par rapport à Chrome Android). En faire un critère formel de recette fait peser un risque inutile sur la livraison à 3 semaines, alors que le client demande avant tout une application web fluide sur smartphone.
* **Proposition d'ajustement :**
  * **Contrainte n° 5 :** *« Application web responsive optimisée pour smartphone. Prise en charge de la PWA (installation sur écran d'accueil) à titre ergonomique lorsque le navigateur client le permet. »*
  * **REQ-101 :** *« L'application est pleinement utilisable sur smartphone via navigateur web mobile, et propose l'installation sur l'écran d'accueil sur les navigateurs compatibles. »*

---

### Point 2 : Priorité de `REQ-002` (Sortie multi-jours et dénivelé)

| Référence CDC | Texte actuel dans le CDC v1 | Priorité | Source CR-001 | Écart constaté |
| :--- | :--- | :---: | :--- | :--- |
| **REQ-002** (§9, Trail) | *« L'utilisateur choisit entre aller simple et aller-retour, le nombre de jours et le dénivelé accepté (⚠ INC-08, ZO-19, ZO-29) »* | **Must** | `CR-001/Q18`, `CR-001/Q06` | Maintien en Must d'une fonctionnalité complexe multi-jours |
| **Périmètre §6** | *« L'utilisateur choisit librement : aller simple ou aller-retour, nombre de jours, dénivelé »* | **Prioritaire** | `CR-001/§1`, `CR-001/Q18` | Inclus dans le MVP prioritaire |

* **Constat dans le CR-001 :**
  * Le terme *« dénivelé maximal »* a bien été corrigé en *« dénivelé accepté »* conformément au verbatim de `Q18`.
  * Cependant, **l'exigence globale est restée classée en Must** (obligatoire pour le MVP à 3 semaines).
* **Problème :** Gérer un itinéraire sur plusieurs jours (ex. Mafate en 2 ou 3 jours) pose des défis algorithmiques considérables documentés en section 11 (`INC-08`, `ZO-19`) :
  * Absence de référencement des abris et gîtes (`Q17`) ;
  * Découpage arbitraire des étapes journalières et du bivouac ;
  * Synchronisation heure par heure de la météo sur J+1 et J+2 avec la fatigue cumulée ;
  * Limite temporelle des prévisions météo fiables (`Q13`).
* **Risque :** Maintenir le multi-jours dans le **Must** du MVP à 3 semaines sans budget met en danger la tenue des délais.
* **Proposition d'ajustement :** Scinder l'exigence :
  * **REQ-002a (Must) :** *« L'utilisateur choisit entre un aller simple et un aller-retour à la journée, et indique son dénivelé accepté. »* (Priorité : **Must**)
  * **REQ-002b (Should / jalon 2) :** *« L'utilisateur peut planifier un itinéraire sur plusieurs jours (dans la limite des prévisions météo disponibles), le calcul des besoins couvrant la totalité de la sortie. »* (Priorité : **Should**).

---

## 3. Les 3 points de vigilance documentaire et de traçabilité

Ces trois points ne remettent pas en cause les fonctionnalités, mais constituent des ajustements de rigueur documentaire entre les deux pièces :

### Point 3 : L'échéance du 09/12/2026 introduite à tort dans le CR-001 (§5)
* **Constat :** En entretien (`CR-001/Q07`), le client a mentionné un délai global de *« 3 semaines »* à compter du 23/11/2026, ce qui place l'échéance contractuelle au **14/12/2026**.
* **Dérive :** Le CDC a judicieusement fixé la date cible interne au **09/12/2026** pour conserver une marge de sécurité de quelques jours (`ZO-03`). Cependant, cette date a été **rétro-injectée dans la section 5 du CR-001** (*« échéance du 09/12/2026 »*).
* **Correction recommandée :** Dans le compte rendu d'entretien (qui doit refléter fidèlement les propos du client), rétablir la formulation *« délai de 3 semaines (échéance au 14/12/2026) »* et laisser la date d'atterrissage avancée du 09/12/2026 comme une décision d'équipe propre au CDC (`ZO-03`).

### Point 4 : Citation de `Q41` dans `INC-11` du CDC v1
* **Constat :** La question `Q41` du CR-001 stipule explicitement que la démonstration sur poste local (`localhost`) est une *« modalité logistique interne non contractuelle (à ne pas inscrire comme contrainte dans le CDC) »*.
* **Dérive :** La contrainte a bien été omise de la section 7 (Contraintes contractuelles), ce qui est exemplaire. Néanmoins, `Q41` est toujours citée dans la section 11 (`INC-11` : *« La démonstration se fait sur poste de développement local (Q37, Q41) »*).
* **Correction recommandée :** Supprimer la référence à `Q41` dans `INC-11` pour respecter la consigne à la lettre, en ne conservant que `CR-001/Q37` qui fonde légitimement le besoin d'une démonstration locale.

### Point 5 : Restriction de l'alerte « risque requin » (`R-15` / `REQ-027` vs `AMB-18`)
* **Constat :** En `Q10`, le client a répondu de façon générale : *« Signaler la Réserve marine et le risque requin »*, sans restreindre cette alerte à une pratique sportive en particulier.
* **Dérive :** Dans le CDC, la règle `R-15` et l'exigence `REQ-027` restreignent l'alerte requin à la seule chasse sous-marine, tandis que la pêche du bord fait l'objet d'un questionnement distinct en `AMB-18`.
* **Analyse :** Même si cette distinction est transparente et signalée en `AMB-18`, elle constitue techniquement un léger rétrécissement par rapport à l'énoncé brut de `Q10` (certains types de pêche du bord se pratiquant les pieds dans l'eau ou sur des platiers exposés).
* **Correction recommandée :** Soit maintenir `R-15` en précisant dans son libellé qu'il s'agit d'une hypothèse de conception en attente d'arbitrage (`AMB-18`), soit étendre l'alerte informative requin à toute activité marine (pêche du bord et chasse sous-marine) par principe de précaution.

---

## 4. Matrice d'actions de convergence pour la version v1.1

| Réf. | Document concerné | Situation actuelle (v1) | Ajustement cible (v1.1) | Type d'action |
| :--- | :--- | :--- | :--- | :--- |
| **C5 / REQ-101** | `cahier-des-charges-v1.md` | Installation écran d'accueil obligatoire (Must) | PWA recommandée / supportée selon compatibilité navigateur | Ajustement contractuel (nuance Q01/Q27) |
| **REQ-002** | `cahier-des-charges-v1.md` | Choix multi-jours classé en Must | Scission : journée + dénivelé en **Must**, multi-jours en **Should** | Sécurisation du planning 3 semaines (INC-08) |
| **§5 du CR** | `cr-001.md` | Mention de l'*« échéance du 09/12/2026 »* | Remplacer par *« délai de 3 semaines (14/12/2026) »* | Rigueur du verbatim client (Q07) |
| **INC-11** | `cahier-des-charges-v1.md` | Citation de `Q41` dans la source de l'incohérence | Retirer la mention de `Q41`, ne conserver que `Q37` | Respect strict de la consigne Q41 |
| **R-15 / REQ-027** | `cahier-des-charges-v1.md` | Alerte requin limitée à la chasse sous-marine | Mentionner explicitement le statut d'hypothèse liée à `AMB-18` | Précision réglementaire locale (Q10) |

---

## 5. Conclusion

Avec l'intégration de ces ajustements mineurs, le binôme **CR-001** / **CDC v1.1** atteindra un degré de traçabilité et de sécurité contractuelle parfait pour engager sereinement le développement du MVP et mener le second entretien client.
