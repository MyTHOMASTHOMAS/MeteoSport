# Rapport de vérification — CDC v1 vs CR-001

**Auteur :** relecture assistée (demandée par Maxime)
**Documents comparés :** `tdd/docs/cdc/cahier-des-charges-v1.md` (CDC) et `tdd/docs/cr/cr-001.md` (CR)
**Méthode :** relecture croisée de chaque affirmation, citation `CR-001/Qnn` et exigence du CDC contre le texte du CR.

Classement : 🔴 à corriger avant présentation au client · 🟠 à clarifier ou à rendre explicite · 🟡 mineur.

---

## 0. Verdict

Le CDC est globalement fidèle au CR. Les citations de sources sont presque toutes exactes, la section 11 est solide (INC-04 à INC-09 sont de vraies trouvailles), et la consigne « pas de technologie dans le CDC » est respectée.

Les écarts se répartissent en 4 familles :

1. **Contenu ajouté qui n'est pas dans le CR** : personas, périmètre du budget, REQ-023, quelques citations.
2. **Contradictions internes au CDC** qui ne sont pas listées en section 11.
3. **Non-dits du CR** repris sans être signalés.
4. **Hypothèses de la section 11** qui vont à l'encontre de ce que le client a dit.

Les points 🔴 sont les n° 1 à 6 ci-dessous.

---

## 1. Hallucinations et sur-interprétations

### 🔴 H-01 — Le budget « 0 € » est étendu à toute l'exploitation
- **CDC :** contrainte n°2 « aucun coût récurrent toléré, ni pour la réalisation ni pour l'exploitation » ; REQ-102 « l'exploitation n'engendre aucun coût ».
- **CR :** Q07 = budget 0 € alloué. Q28 = « 0 € de coût **API** récurrent ». Q37 évoque un « investissement dans une infrastructure d'hébergement » à envisager **après** la démo.
- **Écart :** le client n'a jamais dit « zéro coût d'exploitation » au sens large. L'hébergement n'est pas couvert. Le CDC durcit la contrainte, et REQ-102 sera invérifiable ou faux si un hébergement est un jour payé.
- **Correction proposée :** « 0 € pour la réalisation et pour les API/données ; coût d'hébergement non tranché (Q37) », et ajouter une zone d'ombre « qui paie l'hébergement après la démo ? ».

### 🔴 H-02 — INC-02 : citation inexacte et raisonnement bancal
- **CDC (INC-02) :** cite « trajet conseillé par l'IA (§1) ».
- **CR §1 :** « trajet conseillé **par l'application** ». Les mentions « l'IA » viennent de **nos** questions (Q11 « comment l'IA tranche-t-elle », Q16 « l'IA conseille-t-elle »), pas du client. Seul l'objet « assistée par IA » est de lui.
- **CR Q21 :** « L'IA est réservée à **l'outillage de dev** et à la génération de synthèses textuelles ». L'« outillage de dev » signifie peut-être que l'IA sert à **développer**, pas dans le produit. Le CDC ne voit pas cette lecture.
- **Affirmation externe :** « une IA de rédaction a souvent un coût » n'est pas dans le CR.
- **Hypothèse abusive :** abandonner REQ-009 « si aucune solution gratuite n'existe ». Une explication par gabarit déterministe (la règle déclenchée est connue) ne coûte rien et ne demande pas d'IA.
- **Correction proposée :** corriger la citation, ajouter la question « y a-t-il de l'IA **dans** le produit ou seulement pour le développement ? », et garder REQ-009 par explication à gabarit.

### 🔴 H-03 — Personas : faits inventés présentés comme tirés du CR
La section 5 dit « construits à partir du CR », mais plusieurs détails n'y figurent pas :

| Persona | Affirmation du CDC | Dans le CR ? |
|---|---|---|
| Julien | « Court avec une montre GPS » | Non. Q19 parle de transfert vers une montre ou un GPS en général |
| Julien | « Prépare depuis son smartphone, la veille ou le matin même » | Non |
| Patrice | « dispose **souvent** de créneaux courts », « décide au dernier moment » | Non. Q12 donne un seul exemple |
| Patrice | « n'est pas sûr des zones réglementées » | Non |
| Sarah | Persona entier | Déduit, signalé comme tel (OK) |

Julien est « inspiré du client » : ces détails pourraient être pris pour des déclarations du client. Retirer ou marquer *(hypothèse)*.

### 🟠 H-04 — « Le client pratique le trail » / ne pratique que le trail
- **CDC §1 et §4 :** « pratique le trail », « oui (pratiquant de trail) ».
- **CR :** le client dit « J'habite La Possession et j'aimerais une suggestion de trace… jusqu'à Mafate ». Il dit aussi « j'ai un créneau d'une heure pour **pêcher** sur Saint-Paul ». Le CR ne dit pas qu'il pratique le trail, et la citation pêche suggère qu'il pêche aussi.
- **Correction proposée :** reformuler (« souhaite une suggestion de trace… ») et ne pas faire de Patrice un persona distinct du client sans l'avoir vérifié.

### 🟠 H-05 — REQ-023 : le rôle de l'administrateur est inventé
- **CDC :** « L'administrateur tient à jour les critères de sécurité de chaque sentier », sources Q34, Q40.
- **CR :** Q34 dit que les critères sont définis « dans le référentiel des sentiers ». Q42 limite l'interface admin aux **statuts des sentiers** et aux **alertes**.
- **Écart :** rien ne dit que l'admin édite les critères via l'interface. C'est une exigence créée par l'équipe, mal sourcée. À requalifier en hypothèse, ou à retirer.

### 🟡 H-06 — Citations ou précisions mal rattachées
- §1 : « la Réserve… encadre la pêche sur une partie de la côte **ouest** » est cité en Q10. La côte ouest vient de **Q32**. Le contenu « encadre la pêche » est une connaissance extérieure au CR.
- §1 : « littoral, hauts et cirques, à quelques kilomètres d'écart » (Q38). Q38 parle seulement de relief et de microclimats extrêmes.
- ZO-11 : la réglementation préfectorale sur la chasse sous-marine est une connaissance extérieure. La question est légitime mais devrait être marquée comme telle.
- ZO-02 : « Q04 et Q07 sans réponse ». Q07 est répondu (délai, budget), seuls les critères de validation manquent.
- §4 : « randonneurs » comme utilisateurs. Q05 limite aux trail et pêche, et la table « hors périmètre » exclut les « autres sports ». La randonnée n'apparaît que dans un titre du CR (§4.1). À trancher : trail uniquement, ou randonnée incluse ?

---

## 2. Incohérences internes au CDC (absentes de la section 11)

### 🔴 I-01 — Le « trajet choisi » n'est défini nulle part, et REQ-003 neutralise le double affichage
- Le CR (§1) demande un **double affichage** : trajet choisi par l'utilisateur vs trajet conseillé.
- Q18 : l'utilisateur donne un **départ et une arrivée**. Qui produit le « trajet choisi » ? L'application (REQ-003) ? L'utilisateur le dessine ? Un tracé connu ?
- REQ-003, R-01 et l'objectif 1 imposent que **l'itinéraire choisi** n'emprunte que des sentiers officiels **ouverts**. Mais Q34 cite « sentier déclaré fermé » comme **déclencheur** d'un trajet conseillé. Si le trajet choisi est déjà limité aux sentiers ouverts et balisés, le trajet conseillé ne diffère que sur les règles météo.
- **À ajouter en section 11** : une AMB sur le sens de « trajet choisi », et trancher si l'utilisateur peut choisir un tracé passant par un sentier fermé (auquel cas REQ-003 et R-01 sont trop stricts pour le « choisi »).
- R-01 étend aussi à l'itinéraire « choisi » ce que Q16 dit seulement du trajet **conseillé**. À signaler comme extension.

### 🟠 I-02 — Granularité météo : par tronçon (REQ-007) vs par zone (REQ-108)
- REQ-007 : météo « pour **chaque tronçon** ». REQ-108 et Q38 : découpage **par zones / balises**, pour tenir les quotas.
- Ce n'est pas la même résolution, et Q15 vs Q38 est une tension du CR que le CDC aurait dû relever. À reformuler : « par zone traversée, à l'heure de passage ».

### 🟠 I-03 — Points d'eau : « prioritaire » en section 6, « Could » en REQ-014
La section 6 les range dans « prioritaire pour la première livraison ». Ils sont REQ-014 en Could.

### 🟠 I-04 — REQ-013 vs R-05
R-05 : quantités calculées « à partir du profil ». REQ-013 ajoute la durée **et la météo**. Cohérent avec l'esprit, mais R-05 devrait être alignée, et la dépendance à la météo n'est pas dans Q21 (c'est une déduction, à marquer).

### 🟠 I-05 — Smartphone, installation et vérification vs démonstration en `localhost`
- REQ-101 se vérifie par « installation et parcours complet sur les smartphones de test » ; REQ-109 par un « test en mode avion » ; REQ-110 par un import sur appareils.
- CR Q41 : démo sur **poste de développement local**, sans partage réseau. Un test sur smartphone peut ne pas être réalisable dans ce cadre.
- À arbitrer : soit les vérifications se font hors démo client, soit Q41 doit être rediscuté. À mentionner explicitement dans le CDC.
- La synchronisation multi-appareils (Q23, REQ-015) pose le même problème en démo `localhost`.

### 🟡 I-06 — Références orphelines
Dans la section 11, **INC-04, INC-05, INC-06, AMB-07** ne sont renvoyés par aucun ⚠ du corps. INC-03 n'est cité que dans la liste des priorités. La légende dit que « le marqueur ⚠ renvoie à un point de la section 11 » : relier ces points aux exigences concernées (par ex. AMB-07 sur REQ-007).

---

## 3. Non-dits du CR repris sans être signalés

### 🔴 N-01 — Q37 est vidé de sa substance : la démo est **locale**
- Q37 : « le client exige de voir le projet fonctionner **en local** ».
- Q41 (non contractuel) précise `localhost`, avec la mention de ne pas l'inscrire en contrainte.
- Le CDC supprime donc toute mention de « local » : contrainte n°8 = « démonstration avant mise en ligne ». Or « en local » vient de **Q37**, une exigence du client. Seul le détail `localhost` de **Q41** est exclu.
- INC-03 pose comme question ouverte « que contient le livrable à 3 semaines ? ». Le CR y répond en grande partie (démo locale à J+21, §3 point 1 et Q37). Reformuler INC-03 : ce n'est plus une incohérence ouverte mais un point à confirmer.

### 🔴 N-02 — Le créneau horaire n'est prévu que pour la pêche
- CR §1 (parcours « Où voulez-vous aller ? ») : départ et arrivée « avec possibilité de renseigner un **créneau horaire disponible** ». Valable pour tout sport.
- Q12 : « temps disponible et point de départ ».
- CDC : le créneau n'existe que dans REQ-025 (pêche, Should). Pour le trail, REQ-001 saisit seulement une heure de départ. Un temps disponible pourrait contraindre la durée de l'itinéraire. À ajouter, ou à signaler comme question.

### 🔴 N-03 — Le besoin « la météo est-elle idéale pour ce sentier ? » n'a pas d'exigence
- CR §1 : « savoir si la météo est **idéale** pour pratiquer un sentier choisi ».
- CDC : prévisions affichées (REQ-007), alternative conseillée si une règle se déclenche (REQ-008). Aucun **verdict** (go / no-go / score) pour un trail seul.
- REQ-028 (score trail vs pêche) suppose un score de conditions pour le trail. Or aucun critère de « bonnes conditions trail » n'est défini (REQ-024 les définit pour la pêche). Question à ajouter en section 11.

### 🟠 N-04 — Priorité de la demande n°1 du client
- La première citation du client est « une suggestion de trace d'environ 40/50 km jusqu'à Mafate », et sa première attente est « savoir quel sport est le plus propice ».
- Le CDC relègue REQ-010 (suggestion de trace) en **Should**, et REQ-028 (comparaison) en **Could**. Le CDC le signale (AMB-01, INC-01), mais ces hypothèses vont **à l'encontre de l'ordre des attentes** du client.
- À défendre explicitement dans la présentation, ou à remonter la priorité. Q06 cite aussi le « GPX sur mesure » parmi les options de priorité ; la réponse « tracé GPX » ne dit pas clairement lequel.

### 🟠 N-05 — Conservation des données (Q24) sans réponse
Q24 demandait un dispositif de consentement, de **conservation** et de suppression. La réponse ne traite pas la conservation. Le CDC ne le relève pas : durée de conservation, inactivité. À ajouter en zone d'ombre RGPD (ZO-12).

### 🟠 N-06 — « Conditions équivalentes » (R-12)
R-12 départage « quand les conditions sont équivalentes » (Q33). Aucun seuil ne définit « équivalent ». À ajouter dans une AMB.

### 🟡 N-07 — Architecture modulaire (Q30)
Le CR annonce une architecture « modulaire » pour sécuriser le socle trail. Pas d'équivalent dans le CDC. C'est un choix de solution, donc légitimement hors CDC, mais une exigence de type « le module pêche peut être livré ou retiré sans impacter le trail » pourrait figurer en non-fonctionnel.

### 🟡 N-08 — Sécurité du compte (Q23)
Q23 dit « compte utilisateur **sécurisé** ». REQ-105 couvre l'isolation entre comptes mais aucune exigence ne traite l'authentification elle-même (mot de passe, récupération).
### 🟡 N-09 — « Alertes » : portée de R-11
Q32 dit « pour **toute activité** sur la côte ouest ». R-11 et REQ-026 limitent à la recommandation de pêche. Probablement l'intention, mais à confirmer.

---

## 4. Hypothèses de la section 11 à rediscuter

| Point | Hypothèse du CDC | Problème |
|---|---|---|
| INC-01 | Trail Must, pêche Should, comparaison Could | Contredit l'ordre des attentes (N-04). Reste cohérent avec Q06 et Q30 |
| INC-02 | REQ-009 abandonnée si pas d'IA gratuite | Faux dilemme (H-02) |
| INC-03 | Livrable = démo, mise en ligne hors délai | Largement déjà répondu par Q37 (N-01) |
| ZO-10 | Compte obligatoire | Déjà tranché par Q23 (« authentification obligatoire »). Ce n'est pas une zone d'ombre |
| ZO-02 | Scénarios de recette « avant la fin de la 1re semaine » | Échéance inventée, non issue du CR. Acceptable comme hypothèse, à dater |
| AMB-09 | 3 parcours pilotes fermés | Q40 dit « notamment » : liste ouverte. L'hypothèse est raisonnable mais devrait être validée avant calibrage |

---

## 5. Ce qui est vérifié et conforme

- La date d'échéance : 23/11/2026 + 21 jours = 14/12/2026 ✔.
- Les références `CR-001/Qnn` pour R-01 à R-14, les REQ-001 à REQ-022 et le hors-périmètre : exactes, aucune hallucination majeure.
- INC-04, INC-05, INC-06, INC-07, INC-08, INC-09 : bien fondées et bien sourcées.
- Aucun nom de technologie dans le CDC (respect de la consigne de l'en-tête).
- Tous les identifiants INC / AMB / ZO cités dans le corps existent dans la section 11.
- La section 1 reconnaît honnêtement que le « problème » est déduit (ZO-01).

---

## 6. Actions proposées (par ordre de priorité)

1. Reformuler la contrainte « 0 € » : API et données gratuites, hébergement à trancher (H-01).
2. Corriger INC-02 : citation, lecture « outillage de dev », REQ-009 par gabarit (H-02).
3. Nettoyer les personas : retirer ou marquer comme hypothèses les détails non sourcés (H-03, H-04).
4. Réintroduire « en local » (Q37) dans la contrainte n°8 et reformuler INC-03 (N-01).
5. Ajouter en section 11 : sens de « trajet choisi » (I-01), créneau pour le trail (N-02), verdict « météo idéale » et score trail (N-03).
6. Requalifier REQ-023 (H-05), aligner section 6 et REQ-014 (I-03), R-05 et REQ-013 (I-04).
7. Traiter les tensions de vérification smartphone vs `localhost` (I-05) et de granularité météo (I-02).
8. Compléter la section 11 : conservation des données (N-05), seuil d'équivalence (N-06), randonnée incluse ou non (H-06).
9. Relier les points orphelins de la section 11 au corps du CDC (I-06).
