/**
 * Script d'aiguillage If — Décision de rebouclage pour validation-specs.
 * Reçoit le sac d'entrées et détermine si le workflow doit continuer (port 0) ou s'arrêter (port 1).
 *
 * Implémentation robuste selon les préconisations ClientsBox :
 * - Insensible au nommage de la clé ("0", "c6", nom personnalisé, etc.)
 * - Tolérant aux valeurs nulles / undefined
 * - Supporte aussi bien le texte brut que le flux JSON de cursor-cli
 *
 * @param {Record<string, { blockType: string, value: unknown, power: number }>} sac
 * @returns {boolean} true -> port 0 (continuer/reboucler), false -> port 1 (fin)
 */
export default function ifRebouclerVerification(sac) {
  if (!sac || typeof sac !== 'object') {
    return false;
  }

  // Récupère tous les messages valides présents dans le sac
  const messages = Object.values(sac).filter((msg) => msg && typeof msg === 'object');
  if (messages.length === 0) {
    return false;
  }

  for (const msg of messages) {
    let text = '';
    if (typeof msg.value === 'string') {
      text = msg.value;
    } else if (msg.value && typeof msg.value === 'object') {
      text = JSON.stringify(msg.value);
    }

    if (!text) continue;

    // Priorité à l'ordre d'arrêt explicite
    if (text.includes('DECISION: TOUT_TERMINE')) {
      return false;
    }

    // Décisions déclenchant la récursion / continuation du cycle
    if (
      text.includes('DECISION: REBOUCLER_MEME_SPEC') ||
      text.includes('DECISION: SPEC_SUIVANTE') ||
      text.includes('REBOUCLER')
    ) {
      return true;
    }
  }

  return false;
}

