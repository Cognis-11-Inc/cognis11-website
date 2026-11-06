export const fragments = {
  trace: { tier: 'Trace', title: 'Before the explanation.', text: 'What did you actually observe — and what did you add?', visual: 'trace' },
  absence: { tier: 'Uncommon', title: 'The shape of an absence.', text: 'What would you expect to find if your explanation were wrong?', visual: 'absence' },
  counterflow: { tier: 'Uncommon', title: 'Against the current.', text: 'Which conclusion did you inherit without examining its mechanism?', visual: 'counterflow' },
  eclipse: { tier: 'Rare encounter', title: 'The rejected possibility.', text: 'What have you ruled out before you looked?', visual: 'eclipse' },
  eleventh: { tier: 'Exceptional encounter', title: 'The eleventh door.', text: 'A contradiction is a place to investigate. Stay with it.', visual: 'eleventh' },
  paradox: { tier: 'Hidden signal · 11', title: 'A living paradox engine.', text: 'Hold two opposing ideas long enough to find where each one breaks.', visual: 'paradox' },
  fifth: { tier: 'Hidden question', title: 'A fifth question.', text: 'What does your preferred explanation prevent you from noticing?', visual: 'absence' },
  echo: { tier: 'Hidden response', title: 'Repetition is a probe.', text: 'If the answer stays the same, change the question.', visual: 'counterflow' },
  return: { tier: 'Returning signal', title: 'Something remained.', text: 'The encounter ended. Did the question?', visual: 'trace' },
} as const;
export type FragmentId = keyof typeof fragments;

/** One roll per deliberate encounter. Rarity is presentation, never access to
 * company information. A cooldown prevents repeated rare visual interruptions. */
export function chooseFragment(index: number, roll: number, rareAllowed: boolean): FragmentId {
  const ordinary = ['trace', 'absence', 'counterflow'] as const;
  if (index < ordinary.length) return ordinary[index];
  if (rareAllowed && roll < 1 / 111) return 'eleventh';
  if (rareAllowed && roll < 1 / 11) return 'eclipse';
  return ordinary[index % ordinary.length];
}
