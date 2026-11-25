# ADR-008 — Isolation des moteurs de calcul déterministes et évaluation des règles

**Statut :** proposé
**Date :** 25/11/2026
**Décidé par :** équipe projet

---

## Contexte

Plusieurs calculs décident de ce que l'application présente comme sûr,
favorable ou suffisant :

- temps de parcours et heures de passage (`REQ-005`, `SPEC-CALC-01`), niveau
  par paliers de VMA (`R-20`, `SPEC-CALC-02`), quantités d'eau et de
  nourriture (`REQ-013`, `SPEC-CALC-03`), liste d'équipement (`REQ-012`,
  `SPEC-CALC-04`) ;
- état et désactivation de chaque sentier emprunté (`R-02`, `R-08`,
  `SPEC-TRAIL-05`) : fermeture reçue ou forcée, critères de sécurité des
  sentiers du panel pilote importés dans le référentiel (`R-06`, `REQ-023`,
  `SPEC-REF-05` : sensibilité, donnée observée, seuil, période, zone),
  évalués à l'heure de passage, aller et retour ;
- verdict favorable / défavorable / à risque (`R-19`, `REQ-029`,
  `SPEC-CALC-06`) : critères des sentiers pilotes, grille générale pluie /
  vent / chaleur complétée d'un critère « pluie récente » (hypothèse de
  `SPEC-CALC-06`), vigilance officielle majeure, mention « indicatif, sentier
  non calibré » hors panel, mention « verdict incomplet » quand une donnée
  manque ;
- points d'eau proches du tracé, à titre indicatif, sans effet sur la quantité
  d'eau (`R-09`, `SPEC-CALC-05`) ;
- identification des spots de pêche selon vent, houle, marée, solunaire, pluie
  et clarté estimée, avec retrait signalé d'un critère sans source (`REQ-024`,
  `SPEC-PECHE-02`) ;
- score comparatif trail / pêche, refus de recommander si les deux sont
  défavorables, départage par les sports favoris sous le seuil d'équivalence
  (`REQ-028`, `R-12`, `SPEC-COMP-01` à `03`).

Exigences qui encadrent ces calculs :

- `R-05` — règles fixes, tirées de références publiques citées (temps,
  quantités, sécurité) et validées par le client ; une IA ne fait jamais ces
  calculs (`CR-001/Q21`).
- `REQ-107` — mêmes entrées, même résultat ; vérifié par des tests automatisés
  sur des jeux de référence.
- `SPEC-CALC-08` — l'heure courante n'intervient que par les entrées
  explicites (cas limite 2) ; référence publique et date de validation
  consultables pour chaque règle (AC-4) ; égalité stricte avant l'arrondi
  d'affichage (hypothèse) ; un changement de paramètre ne modifie que les
  calculs qui l'utilisent (AC-3). Le lieu où consigner références et dates est
  laissé ouvert.
- `R-07` — une donnée indisponible ou périmée n'est jamais remplacée : un
  critère qui en dépend est « non évaluable ».

Décisions déjà prises : backend Express 5 / TypeScript (`ADR-001`) ; paramètres
`REQ-115` et ajoutés par les specs en base, modifiables par l'administrateur,
passés aux moteurs en entrée explicite (`ADR-003`) ; données externes lues dans
un cache horodaté (`ADR-005`) ; tronçons par zone et graphe (`ADR-007`) ; base
PostgreSQL / PostGIS qui « stocke et retrouve, sans décider » (`ADR-002`).

## Options envisagées

### Forme des règles

#### Option A — Tables déclaratives évaluées par un évaluateur commun

| | |
|---|---|
| Ce qu'elle apporte | Les grilles (grille générale du verdict, grille d'équipement, barème de pêche, comparateur) sont des données relues et validées telles quelles par le client ; un seul évaluateur, le même que pour les critères de `SPEC-REF-05` déjà importés comme données ; références et dates de validation portées par la table elle-même. |
| Ce qu'elle coûte | Un format de table et un évaluateur à concevoir et à tester ; une règle qui ne rentre pas dans le format oblige à l'étendre. |
| Ce qu'elle rend difficile plus tard | Exprimer une règle très spécifique (formule non tabulaire), qui reste alors une fonction codée. |

#### Option B — Une fonction TypeScript par règle

| | |
|---|---|
| Ce qu'elle apporte | Simple, typé, sans format intermédiaire. |
| Ce qu'elle coûte | Chaque changement de grille validé par le client passe par le code ; les critères de `SPEC-REF-05`, eux, sont des données : deux mécanismes d'évaluation pour la même question (un critère est-il déclenché ?). |
| Ce qu'elle rend difficile plus tard | Faire relire une grille au client sans lui montrer du code. |

#### Option C — Bibliothèque générique de règles (par exemple json-rules-engine)

| | |
|---|---|
| Ce qu'elle apporte | Moteur existant, format déjà défini. |
| Ce qu'elle coûte | Évaluation asynchrone et à base d'événements, surface importante pour quelques grilles ; déterminisme et état « non évaluable » à vérifier ou à contourner. |
| Ce qu'elle rend difficile plus tard | Prouver la reproductibilité en dehors du comportement interne de la bibliothèque. |

### Modification des règles

#### Option M1 — Fichiers versionnés dans le dépôt, modifiés par l'équipe

| | |
|---|---|
| Ce qu'elle apporte | Conforme aux « règles fixes » de `R-05` : chaque version est datée, relue en revue de code et rattachée à une validation du client. |
| Ce qu'elle coûte | Une évolution de règle demande l'équipe, une validation client et un redémarrage. |
| Ce qu'elle rend difficile plus tard | Un ajustement rapide par le client. |

#### Option M2 — Règles en base, modifiables dans l'espace d'administration

| | |
|---|---|
| Ce qu'elle apporte | Ajustement par le client sans l'équipe, comme les paramètres d'`ADR-003`. |
| Ce qu'elle coûte | Une règle validée peut être changée sans validation tracée : contredit `R-05` et `SPEC-CALC-08` AC-4. |
| Ce qu'elle rend difficile plus tard | Savoir quelle règle validée a produit un verdict passé. |

## Décision

Nous retenons des **tables de règles déclaratives**, en fichiers JSON
versionnés dans le dépôt, modifiés par l'équipe seule et portant chacun leur
référence publique et leur date de validation client, **évaluées par un
évaluateur commun** ; les moteurs de calcul sont des **fonctions pures
regroupées dans un module dédié du backend**, qui reçoivent toutes leurs
entrées explicitement.

### Moteurs de calcul

1. **Module dédié.** Les moteurs (temps et heures de passage, niveau,
   quantités, équipement, points d'eau, état et désactivation des sentiers,
   verdict, scoring pêche, comparateur) et l'évaluateur
   de règles forment un module du backend. Ils n'importent ni la base, ni le
   réseau, ni l'horloge, ni le générateur aléatoire, ni le module d'IA
   (`ADR-009`). Cette discipline est tenue par convention et vérifiée en revue
   de code.
2. **Entrées explicites.** Chaque calcul reçoit un contexte complet : trajet et
   tronçons par zone (`ADR-007`) ; heure de référence (heure de départ saisie,
   ou heure courante lue par le backend pour la pêche et le comparateur,
   `SPEC-PECHE-02`) et date du jour, fuseau de La Réunion ; heure du coucher du
   soleil (calcul local, `ADR-005`), pour signaler une arrivée tardive
   (`SPEC-CALC-01` cas limite 6) ; profil ou valeurs par défaut ; prévisions,
   vigilances, cumuls de pluie et états des sentiers reçus **avec leur date**
   (`ADR-005`) ; forçages en cours (`R-08`) ; jeu de paramètres lu au début du
   calcul (`ADR-003`) ; tables de règles et critères des sentiers pilotes. Le
   backend construit ce contexte ; le module ne va rien chercher lui-même.
3. **Sortie tracée.** Chaque résultat est accompagné de sa trace : critères
   évalués et leur issue (déclenché, non déclenché, non évaluable) avec zone,
   heure et passage (aller ou retour, `SPEC-CALC-06` AC-2), dates des données
   utilisées, valeurs par défaut appliquées (`R-17`), versions des tables de
   règles et des paramètres. Cette trace alimente l'affichage des critères qui
   posent problème (`REQ-029`, `REQ-024`) et la rédaction des explications
   (`ADR-009`), qui ne recalcule rien (`SPEC-CALC-07`).
   Une valeur qui ne peut pas être calculée (par exemple le temps d'un tronçon
   sans altitude, `SPEC-CALC-01` cas limite 5) est rendue comme **non
   calculable** avec son motif ; aucun calcul en aval n'utilise une valeur
   supposée à sa place.
4. **Déterminisme.** Pas de dépendance à l'ordre d'itération d'un objet : les
   collections sont triées par identifiant avant toute agrégation. Les valeurs
   restent non arrondies dans les calculs ; l'arrondi n'intervient qu'à
   l'affichage (`SPEC-CALC-08`, égalité stricte avant arrondi), selon les règles
   des specs (5 minutes pour les temps, `SPEC-CALC-01` ; toujours au-dessus pour
   les quantités, `SPEC-CALC-03` cas limite 5).

### Tables de règles

5. **Fichiers.** Un fichier JSON par grille : grille générale du verdict,
   grille d'équipement, barème de pêche, règles du comparateur, ainsi que les
   règles de calcul du temps et des quantités (coefficients et formules
   tabulées). Chaque fichier porte : identifiant, version, référence publique
   citée (règles visées par `R-05`), date de validation client (toutes les
   règles), et ses lignes.
6. **Format d'une ligne.** Une donnée d'entrée nommée (par exemple pluie
   horaire, rafales, température, cumul de pluie sur une période), une
   agrégation sur les tronçons ou le créneau (maximum, somme, valeur à l'heure
   de passage), une comparaison à un seuil, et un résultat (niveau du verdict,
   article d'équipement, note d'un critère de pêche). La grille d'équipement
   comprend aussi sa liste de base, toujours proposée (hypothèse de
   `SPEC-CALC-04`). Les critères de sécurité des sentiers pilotes, importés dans
   le référentiel (`SPEC-REF-05`, `ADR-007`), suivent le même format ; un
   critère porte en plus sa zone météo et sa période.
7. **Évaluateur commun.** Il évalue chaque ligne en trois issues : déclenchée,
   non déclenchée, **non évaluable** quand une donnée manque ou est périmée, que
   le tronçon n'a pas de zone ou que son heure de passage n'est pas estimable
   (`R-07`, `SPEC-TRAIL-05` AC-8). Une ligne non évaluable n'est jamais traitée
   comme respectée. Les combinaisons propres à chaque moteur restent dans le
   moteur :
   - **état d'un sentier** (`SPEC-TRAIL-05`) : un forçage en cours remplace
     l'état reçu de la source ; une fermeture connue ou un critère déclenché
     désactive toujours le sentier, même forcé « ouvert » ; sans fermeture ni
     critère déclenché, un critère non évaluable ou une source indisponible
     donne un état inconnu, sans désactivation. Exception : un critère dont la
     zone a disparu du découpage désactive le sentier par prudence
     (`SPEC-REF-05` cas limite 6) ;
   - **verdict** (`SPEC-CALC-06`) : valeur la plus grave parmi les critères ;
     « à risque » pour un critère de sentier déclenché, un seuil de danger, un
     sentier fermé ou une vigilance majeure (hypothèses de `SPEC-CALC-06`),
     jamais « favorable » sous vigilance majeure (`R-19`) ; un critère non
     évaluable impose au moins « défavorable » et la mention « verdict
     incomplet » ; mention « indicatif, sentier non calibré » pour les sentiers
     hors panel ;
   - **équipement** : un article déclenché par plusieurs zones ou passages
     n'apparaît qu'une fois, avec tous ses motifs (`SPEC-CALC-04`) ;
   - **pêche** : retrait signalé d'un critère sans source (`REQ-024`), clarté
     « indisponible » sans cumul de pluie (`R-10`) ;
   - **comparateur** : il réutilise les moteurs du verdict et de la pêche ; le
     double défavorable prime sur le départage, puis seuil d'équivalence et
     ordre des sports favoris (`R-12`, `SPEC-COMP-02`, `SPEC-COMP-03`).
8. **Validation et chargement.** Les tables sont validées par schéma au
   démarrage du backend ; une table invalide empêche le démarrage. Elles ne
   sont pas modifiables depuis l'application. Seuls les paramètres d'`ADR-003`
   (paliers de VMA, valeurs par défaut, seuil d'équivalence, âges maximaux…)
   restent réglables par l'administrateur ; une table peut y faire référence par
   leur clé.
9. **Documentation.** Le document `tdd/docs/regles-calcul.md` présente chaque
   table, sa référence et sa date de validation, et renvoie au fichier qui fait
   foi (hypothèse de `SPEC-CALC-08`).

### Tests

10. Les jeux de référence (`REQ-107`, `SPEC-CALC-08` AC-2) appellent les moteurs
    directement avec un contexte complet, sans base ni réseau ; chaque cas
    vérifie le résultat et la trace, avec égalité stricte avant arrondi. Un test
    vérifie qu'un même contexte calculé deux fois donne un résultat identique.

## Raisons

- **Une seule façon de dire « ce critère est-il déclenché ? ».** Les critères
  des sentiers pilotes sont des données importées (`SPEC-REF-05`) ; écrire la
  grille générale, l'équipement et la pêche dans le même format évite deux
  mécanismes à tester pour la même question, et l'état « non évaluable » de
  `R-07` est traité une seule fois.
- **Le client valide des tables, pas du code.** `R-05` demande des règles
  validées par le client ; une table lisible, avec sa référence et sa date, se
  relit en recette (option A plutôt que B).
- **« Règles fixes » au sens de `R-05`.** Les règles changent par une nouvelle
  version validée et relue (M1), pas par un réglage à l'écran (M2) ; la
  souplesse demandée par le client passe par les paramètres d'`ADR-003`, dont la
  liste est bornée par `REQ-115` et les specs.
- **Une seule source de vérité pour la référence et la date** : elles sont dans
  la table appliquée, ce qui garantit `SPEC-CALC-08` AC-4 sans écart possible
  avec un document tenu à part.
- **Une bibliothèque générique (C) n'apporte rien** pour quelques grilles et
  complique la preuve de reproductibilité.
- **Module plutôt que paquet séparé.** Choix de simplicité pour un délai court
  (09/12/2026) : une seule base de code backend, sans configuration de
  workspace. La pureté est tenue par convention et par les tests.

## Conséquences acceptées

- **Pureté non garantie techniquement.** Rien n'empêche un import de la base,
  de l'horloge ou de l'IA dans le module ; la revue de code et les tests sur
  contexte complet sont les garde-fous. Une règle de lint limitée au dossier
  peut être ajoutée à faible coût si un écart est constaté.
- **Format de table et évaluateur à concevoir** avant les moteurs, et à étendre
  si une règle ne s'y exprime pas ; une règle qui reste une formule (par exemple
  la correction du temps par le dénivelé) est une fonction pure dont les
  coefficients sont dans une table.
- **Évolution d'une règle = nouvelle version** du fichier, validation client
  datée, revue et redémarrage. Le client ne peut pas ajuster lui-même une règle
  validée.
- **Deux origines pour les critères** : les critères des sentiers pilotes
  arrivent par l'import des référentiels (`ADR-007`), les grilles par les
  fichiers de règles. Même format, mais deux circuits de mise à jour.
- **Trace à produire par chaque moteur**, ce qui alourdit un peu les sorties ;
  c'est elle qui permet d'expliquer sans recalculer (`ADR-009`).
- **Contexte à construire par le backend** : la lecture de la base, du cache et
  des paramètres se fait avant l'appel aux moteurs, jamais pendant.
- **Paliers de VMA et valeurs par défaut : validés à la recette, mais
  réglables par l'administrateur.** `SPEC-CALC-08` (AC-4) demande une date de
  validation client pour chaque règle du domaine, paliers compris ; `REQ-115`
  et `ADR-003` les rendent modifiables à l'écran. La date de validation porte
  sur les valeurs initiales (seed d'`ADR-003`) ; toute modification ultérieure
  est tracée par l'historique des paramètres d'`ADR-003` (auteur, date,
  motif), sans nouvelle validation client.
- **Points laissés ouverts par les specs, non tranchés ici** : barème et seuil
  « défavorable » de la pêche (`SPEC-PECHE-02`, `SPEC-COMP-02`), formule et
  forme du score comparatif (`SPEC-COMP-01`), verdict d'un sentier du panel
  évalué par le comparateur sans itinéraire construit (`SPEC-COMP-02`),
  définition de la vigilance majeure et du secteur (`SPEC-CALC-06`). Ils
  seront exprimés dans les tables de règles une fois tranchés et validés ;
  l'architecture ne les présume pas.

## Ce qui nous ferait revenir dessus

- Une importation de la base, de l'horloge ou de l'IA est trouvée dans le module
  de calcul : on ajoute une règle de lint, voire on sort le module en paquet
  séparé.
- Plusieurs règles validées à la recette ne s'expriment pas dans le format de
  table : on revient à des fonctions codées pour ces règles (option B), en
  gardant les tables pour les grilles.
- Le client demande à ajuster lui-même des seuils de règles validées : on étudie
  le passage de ces seuils en paramètres (`ADR-003`), avec une trace de
  validation, plutôt qu'une modification libre des tables (M2).
- Les jeux de référence échouent de façon intermittente (ordre, flottants,
  fuseau) : on revoit la représentation des valeurs (entiers en unités fines)
  et la construction du contexte.
