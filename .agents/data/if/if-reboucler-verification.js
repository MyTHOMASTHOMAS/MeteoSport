export default function (sac) {
  const output = sac['0']?.value;
  if (typeof output !== 'string') return false;
  
  if (output.includes('DECISION: TOUT_TERMINE')) {
    return false; // Terminé
  }
  
  return (
    output.includes('DECISION: REBOUCLER_MEME_SPEC') ||
    output.includes('DECISION: SPEC_SUIVANTE') ||
    output.includes('REBOUCLER')
  );
}

