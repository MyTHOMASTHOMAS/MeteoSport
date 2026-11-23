# Rapport d'analyse de cohérence : Cahier des Charges vs Compte-Rendu d'entretien

**Destinataire :** Équipe projet MeteoSport (Maxime, Thomas, Ivan)  
**Auteur de l'analyse :** Antigravity (Revue Qualité Exigences)  
**Date :** 23/11/2026  
**Documents sources analysés :**
* Cahier des charges : [cahier-des-charges-v1.md](file:///C:/Users/tiplo/Desktop/MeteoSport/tdd/docs/cdc/cahier-des-charges-v1.md)
* Compte-rendu d'entretien officiel : [cr-001.md](file:///C:/Users/tiplo/Desktop/MeteoSport/tdd/docs/cr/cr-001.md)
* *(Document de travail local : [collab/Ivan/cr-001.md](file:///C:/Users/tiplo/Desktop/MeteoSport/collab/Ivan/cr-001.md))*

---

## 1. Synthèse exécutive et Avis global

### Degré de conformité global : **98% (Excellente cohérence structurelle et sémantique)**

Le Cahier des Charges [cahier-des-charges-v1.md](file:///C:/Users/tiplo/Desktop/MeteoSport/tdd/docs/cdc/cahier-des-charges-v1.md) constitue une traduction **rigoureuse, fidèle et exhaustive** des besoins exprimés dans le compte-rendu officiel d'entretien [cr-001.md](file:///C:/Users/tiplo/Desktop/MeteoSport/tdd/docs/cr/cr-001.md).

L'analyse démontre que :
1. **Couverture intégrale :** L'intégralité des 42 questions/réponses (`Q01` à `Q42`) ainsi que les verbatims et le parcours utilisateur de la section 1 du CR ont été pris en compte et tracés sans exception.
2. **Respect de la posture méthodologique :** Le CDC applique strictement le principe énoncé à sa ligne 7 : *"formalise le problème compris, pas la solution"*. Toutes les mentions prématurées de technologies figurant dans le CR (ex. PWA, Supabase, SQLite, PostgreSQL, Vercel, Render, OSRM) ont été traduites en exigences fonctionnelles ou non fonctionnelles neutres vis-à-vis de l'implémentation.
3. **Mise en lumière proactive des paradoxes :** Plutôt que de masquer les contradictions inhérentes au discours du client, le CDC prend le parti vertueux de consigner et d'isoler dans sa section 11 l'ensemble des paradoxes : 9 incohérences (`INC`), 12 ambiguïtés (`AMB`) et 16 zones d'ombre (`ZO`).

> [!NOTE]
> **Observation sur le dossier `collab/Ivan/` :**  
> Le fichier local [collab/Ivan/cr-001.md](file:///C:/Users/tiplo/Desktop/MeteoSport/collab/Ivan/cr-001.md) présent dans l'espace de travail d'Ivan correspond à une version préliminaire (brouillon initial) dans laquelle 22 questions étaient marquées *« À compléter »* et les questions `Q30` à `Q42` n'existaient pas. Le CDC s'appuie bien sur la version consolidée et complète située dans [tdd/docs/cr/cr-001.md](file:///C:/Users/tiplo/Desktop/MeteoSport/tdd/docs/cr/cr-001.md).

---

## 2. Matrice de traçabilité croisée (CR-001 ➔ CDC-v1)

Le tableau ci-dessous vérifie l'alignement point par point de chaque échange du compte-rendu avec son incarnation dans le CDC :

| Réf. CR-001 | Sujet / Décision client | Éléments correspondants dans le CDC v1 | Statut & Alignement |
|---|---|---|---|
| **Verbatims §1** | Trace 40-50 km Mafate, préférences, créneau Saint-Paul | §1 Contexte, §5 Personas (Julien, Patrice), REQ-001, REQ-010, REQ-025 | Conforme (exact) |
| **Q01** | App web mobile / PWA | §7 Contrainte 5, REQ-101 | Conforme (abstrait de la techno) |
| **Q02** | Profil : âge, poids, taille, VMA | §6 Périmètre, REQ-016, R-05, REQ-005 | Conforme (exact) |
| **Q03** | Cible grand public | §1 Contexte, §4 Parties prenantes, §5 Persona Sarah, REQ-015 | Conforme (exact) |
| **Q04** | Décideur / validation J+21 | §4 Parties prenantes, §7 Contrainte 8, ZO-02 | Conforme (zone d'ombre actée) |
| **Q05** | Trail & Pêche seuls, La Réunion uniquement | §1 Contexte, §6 Hors périmètre, §7 Contrainte 4 | Conforme (exact) |
| **Q06** | Priorité MVP au Trail (GPX + équipement) | §3 Obj. 1 & 3, §6 Périmètre Must, §9 REQ-001 à 014 | Conforme (exact) |
| **Q07** | Délai 3 semaines, budget 0 € | §1, §3 Obj. 7, §7 Contraintes 1 & 2, REQ-102, ZO-03 | Conforme (exact) |
| **Q08** | Pêche du bord & chasse sous-marine (bateau/kayak exclus) | §5 Patrice, §6 Périmètre & Hors périmètre, REQ-024 | Conforme (exact) |
| **Q09** | Critères pêche : vent, houle, marée, lune, turbidité, pluie | §3 Obj. 5, §8 R-10, REQ-024, ZO-15 | Conforme (exact) |
| **Q10** | Réglementation : Réserve marine et risque requin | §1, §7 Contrainte 10, §8 R-11, REQ-026, REQ-027, INC-07 | Conforme (exact) |
| **Q11** | Arbitrage Trail vs Pêche : score comparatif argumenté | §3 Obj. 6, §6 Périmètre Should/Could, REQ-028, INC-01 | Conforme (exact) |
| **Q12** | Contraintes pêche : créneau horaire et point de départ | §3 Obj. 5, §5 Patrice, REQ-025 | Conforme (exact) |
| **Q13** | Météo : prévisions des prochains jours (pas historique) | §6 Périmètre, §8 R-03, REQ-007, INC-05, AMB-07 | Conforme (exact) |
| **Q14** | Adaptation itinéraire : phase préparation uniquement | §6 Hors périmètre, §8 R-04 | Conforme (exact) |
| **Q15** | Météo heure par heure le long de la trace selon allure | §1, §2, §3 Obj. 1, §8 R-03, REQ-007, AMB-11, ZO-04 | Conforme (exact) |
| **Q16** | Trajet conseillé sur sentiers officiels balisés uniquement | §3 Obj. 1 & 2, §6 Périmètre & Hors périm., §8 R-01/02, REQ-003/008 | Conforme (exact) |
| **Q17** | Points d'eau (intéressant) ; gîtes/abris non retenus | §6 Périmètre & Hors périmètre, §8 R-09, REQ-014, INC-08 | Conforme (exact) |
| **Q18** | Choix libre départ/arrivée, aller-retour, jours, dénivelé | §6 Périmètre, REQ-001, REQ-002, INC-08, INC-09 | Conforme (exact) |
| **Q19** | Export GPX standard (pas de synchro API constructeurs) | §3 Obj. 4, §6 Périmètre & Hors périm., REQ-011, REQ-110, ZO-14 | Conforme (exact) |
| **Q20** | Profil strictement limité aux 4 données physiologiques | §6 Hors périmètre, REQ-016, INC-04 | Conforme (exact) |
| **Q21** | Règles fixes pour calculs ; IA réservée aux textes explicatifs | §6 Hors périm., §8 R-05, REQ-005, REQ-009, REQ-013, INC-02, ZO-05 | Conforme (exact) |
| **Q22** | Préférences gérées manuellement (pas de feedback ML) | §6 Hors périmètre, REQ-016 | Conforme (exact) |
| **Q23** | Compte utilisateur multi-appareils obligatoire | §6 Périmètre, REQ-015, REQ-105, ZO-10 | Conforme (exact) |
| **Q24** | RGPD : consentement opt-in, export et suppression | §7 Contrainte 9, §8 R-13, REQ-018, REQ-019, REQ-105 | Conforme (exact) |
| **Q25** | Aucune source imposée, délégation avec exigence fiabilité | §2, §4, §7 Contrainte 3, REQ-102, REQ-104, ZO-01 | Conforme (exact) |
| **Q26** | Fail-safe : message explicite si indispo, pas d'extrapolation | §8 R-07, REQ-004, REQ-103, INC-06, ZO-16 | Conforme (exact) |
| **Q27** | Pas de offline lourd, app connectée, GPX sur terrain | §1, §5 Julien, §6 Hors périm., §7 Contrainte 6, REQ-109 | Conforme (exact) |
| **Q28** | 0 € de coût API récurrent / Open Data obligatoire | §1, §3 Obj. 7, §7 Contraintes 2 & 3, REQ-102, ZO-15 | Conforme (exact) |
| **Q29** | CGU obligatoires avec clause de non-responsabilité | §6 Périmètre, §8 R-14, REQ-020, ZO-12 | Conforme (exact) |
| **Q30** | MVP à 3 semaines : Trail prioritaire, Pêche si possible | §6 Périmètre (découpage Must / Should), INC-01 | Conforme (arbitrage cadré) |
| **Q31** | Turbidité estimée via pluviométrie récente | §8 R-10, REQ-024, INC-05, INC-06 | Conforme (exact) |
| **Q32** | Pas de SIG lourd : alerte / pop-up Réserve Marine Ouest | §6 Hors périmètre, §8 R-11, REQ-026, INC-07 | Conforme (exact) |
| **Q33** | Arbitrage météo équivalente via priorité sports du profil | §3 Obj. 6, §8 R-12, REQ-017, REQ-028, INC-01 | Conforme (exact) |
| **Q34** | Critères de déviation spécifiques par sentier | §3 Obj. 2, §8 R-06, REQ-008, REQ-023, INC-09, ZO-07 | Conforme (exact) |
| **Q35** | Points d'eau indicatifs + message d'avertissement | §6 Périmètre, §8 R-09, REQ-014 | Conforme (exact) |
| **Q36** | Gestion manuelle admin pour forcer l'état des sentiers | §1, §4, §6, §8 R-08, REQ-004, REQ-021, AMB-12, ZO-08 | Conforme (exact) |
| **Q37** | Démo locale exigée avant investissement infrastructure | §1, §3 Obj. 7, §6 Hors périm., §7 Contrainte 8, REQ-111, INC-03 | Conforme (exact) |
| **Q38** | Découpage météo par zones/balises pour quotas API | §1, §7 Contraintes 3 & 7, REQ-007, REQ-108 | Conforme (exact) |
| **Q39** | Ordre des sports favoris intégré dès l'inscription | §6 Périmètre, §8 R-12, REQ-017, REQ-028, INC-04 | Conforme (exact) |
| **Q40** | Panel pilote calibré (La Possession-Mafate, Roche Écrite…) | §3 Obj. 1, REQ-023, INC-09, AMB-09 | Conforme (exact) |
| **Q41** | Démo localhost non contractuelle (consigne respectée) | Absente des contraintes contractuelles du CDC | Conforme (respect strict) |
| **Q42** | Interface admin sécurisée dédiée sentiers & alertes | §4 Parties prenantes, §6, REQ-021, REQ-022, REQ-106, AMB-10 | Conforme (exact) |

---

## 3. Analyse approfondie des écarts, déductions et choix d'ingénierie

Bien que le CDC soit fidèle au CR, un cahier des charges n'est jamais une transcription littérale "mot à mot" : il structure, catégorise et explicite. L'analyse révèle trois mécanismes distincts opérés par les rédacteurs du CDC :

### 3.1. Abstraction technique réussie (Principe Métier vs Solution)
Le compte-rendu d'entretien mentionnait de nombreuses pistes techniques évoquées lors de l'échange ou de la reformulation :
* *Mentionnées au CR :* PWA (Q01, Q27), OSRM / OpenStreetMap (Q28, Q35), Supabase / Vercel / Render (Q37), SQLite / PostgreSQL (CR §5.2).
* *Traduction au CDC :* Le CDC s'est abstenu de mentionner la moindre base de données ou framework. Il convertit la PWA en *"Application web pensée pour smartphone, installable sur l'écran d'accueil"* ([REQ-101](file:///C:/Users/tiplo/Desktop/MeteoSport/tdd/docs/cdc/cahier-des-charges-v1.md#L232)), et les outils tiers en *"sources gratuites et Open Data"* ([REQ-102](file:///C:/Users/tiplo/Desktop/MeteoSport/tdd/docs/cdc/cahier-des-charges-v1.md#L233)).
* **Évaluation :** Respect parfait des standards d'expression du besoin.

### 3.2. Priorisation MoSCoW et Cadrage du MVP
Dans le CR-001, le statut du module **Pêche** était ambigu :
* `Q06` donnait la priorité absolue au Trail.
* `Q30` indiquait que le périmètre du MVP à 3 semaines n'était *"pas défini à ce stade"* concernant l'exclusion ou non de la Pêche.
* Le CDC tranche de manière pragmatique :
  * Volet **Trail** = `Must` (REQ-001 à REQ-013)
  * Volet **Pêche** = `Should` (REQ-024 à REQ-027, conditionné par *"si le calendrier le permet"*)
  * Volet **Comparaison Trail / Pêche** = `Could` (REQ-028)
* **Évaluation :** Ce choix protège l'engagement de livraison sous 3 semaines tout en gardant l'architecture ouverte.

### 3.3. Règles métier déduites (Non explicitement dictées par le client)
Le CDC formule certaines règles qui n'étaient pas formulées textuellement par le client mais qui découlent de la logique du domaine :
* **Règle R-02 :** *"Un sentier déclaré fermé n'est jamais proposé dans un trajet conseillé"* (marqué honnêtement dans le CDC comme `(déduit, à confirmer)`).
* **Règle R-07 / REQ-104 :** Obligation d'afficher la date de fraîcheur de la donnée et politique Fail-Safe sans invention de données (déduit de `Q25` et `Q26`).
* **Règle R-12 :** Mécanisme de départage automatique en cas d'égalité météo via le profil (déduit de `Q33` et `Q39`).

---

## 4. Revue de la Section 11 : Gestion des paradoxes du client

Le CDC brille particulièrement par son recensement exhaustif des incohérences et zones d'ombre relevées lors de l'entretien. Celles-ci constituent la feuille de route du prochain entretien client :

### Les 4 incohérences majeures à faire trancher en priorité :
1. **INC-01 (Périmètre MVP vs Sports favoris) :** Si la pêche n'est pas garantie au MVP (`Q30`), pourquoi contraindre l'onboarding utilisateur à classer plusieurs sports (`Q39`) ?
2. **INC-02 (Promesse IA vs Réalité algorithmique) :** Le client a vendu l'idée d'une *"application assistée par IA"* avec un *"trajet conseillé par l'IA"*, mais a exigé en `Q21` des formules algorithmiques fixes et éprouvées pour tous les calculs vitaux, limitant l'IA à la rédaction de textes. De plus, les API d'IA générative ont un coût, en tension avec le budget de 0 € (`Q28`).
3. **INC-03 (Grand Public vs Démo Locale) :** L'exigence d'une application grand public avec synchronisation multi-appareils (`Q03`, `Q23`) contraste avec le refus catégorique de financer un hébergement avant une validation en local sur PC (`Q37`).
4. **INC-05 & INC-06 (Prévisions vs Historique & Extrapolation) :** Le client demande de n'afficher que des prévisions futures (`Q13`) et interdit toute extrapolation (`Q26`), mais exige d'estimer la turbidité de l'eau via les pluies passées (`Q31`) et d'adapter les tracés selon les crues récentes des ravines (`Q34`).

---

## 5. Recommandations pour l'équipe (Maxime, Thomas, Ivan)

1. **Ne pas retoucher au CDC ni au CR-001 :** Le binôme actuel `cahier-des-charges-v1.md` / `cr-001.md` est parfaitement aligné et constitue une base contractuelle saine.
2. **Mettre à jour la copie locale d'Ivan :** Le fichier [collab/Ivan/cr-001.md](file:///C:/Users/tiplo/Desktop/MeteoSport/collab/Ivan/cr-001.md) étant obsolète (brouillon de début d'entretien), Ivan devrait se baser exclusivement sur [tdd/docs/cr/cr-001.md](file:///C:/Users/tiplo/Desktop/MeteoSport/tdd/docs/cr/cr-001.md) pour ses développements et tests.
3. **Préparer l'entretien n° 002 :** Utiliser les identifiants `INC-01`, `INC-02`, `ZO-02` (critères de recette à J+21) et `ZO-05` (validation des formules de dépense énergétique et hydrique) comme ordre du jour pour le client.
4. **Sécuriser la stack de démo locale :** La contrainte `Q37`/`Q41` imposant une validation sur `localhost` tout en simulant une application mobile utilisable, prévoir une configuration réseau local (IP LAN ou émulateur Chrome DevTools) pour que le client puisse manipuler l'interface sur smartphone lors de la démo sans coût d'hébergement.

---

**Conclusion de l'audit :**  
Le Cahier des charges v1 est **pleinement validé** au titre de la cohérence avec le Compte-rendu n° 001. Il reflète avec exactitude les besoins du client tout en apportant la rigueur d'ingénierie nécessaire pour cadrer le développement dans le délai imparti de 3 semaines.
