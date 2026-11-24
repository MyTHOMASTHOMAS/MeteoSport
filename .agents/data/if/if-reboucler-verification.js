export default function (sac) {
  // Récupère le message quelle que soit la clé de connexion ("c6", "0", ou première entrée du sac)
  const message = sac.c6 || sac['0'] || Object.values(sac)[0];
  const output = message?.value;
  if (typeof output !== 'string') return false;
  
  if (output.includes('DECISION: TOUT_TERMINE')) {
    return false; // Terminé, ne plus reboucler
  }
  
  return (
    output.includes('DECISION: REBOUCLER_MEME_SPEC') ||
    output.includes('DECISION: SPEC_SUIVANTE') ||
    output.includes('REBOUCLER')
  );
}

