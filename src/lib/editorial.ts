/** Public editorial framing derived from the company brief and Operator's voice.
 * These are perspectives and inquiry examples, not research achievements. */
export const researchReading = [
  { title: 'Start with the observation.', body: 'What was recorded? In which setting? Follow the observation back to its source before deciding what it means.' },
  { title: 'Ask for the mechanism.', body: 'Which structure, constraint, or interaction could account for what happened? An appealing description is an invitation to investigate further.' },
  { title: 'Keep the claim in scope.', body: 'A controlled demonstration answers a bounded question. Read its procedure and limits alongside its result, and ask what would need to be tested next.' },
] as const;

export const practicePrinciples = [
  { title: 'Follow the mechanism.', body: 'An intriguing pattern is a beginning. Follow it toward the structures, constraints, and decisions that could explain it.' },
  { title: 'Make something real.', body: 'An idea becomes more interesting when it can take form: a program, an instrument, a sound, an interaction. Building gives curiosity something to work against.' },
  { title: 'Keep contradiction productive.', body: 'A conflicting idea can expose an assumption. Stay with the tension long enough to ask which part of the explanation needs to change.' },
  { title: 'Give form a purpose.', body: 'Rhythm, light, texture, and response shape an encounter. Artistic intention belongs in the same design conversation as technical precision.' },
] as const;

export const consultingInquiries = [
  { title: 'Architecture & state', body: 'Bring a system whose boundaries, state, or hand-offs are difficult to reason about. Begin with the decision you need to make and the behaviour you need to understand.' },
  { title: 'AI-assisted workflows', body: 'Bring a workflow where tools, context, and human review need to work together. Where does information enter, where is output examined, and where does the process lose its shape?' },
  { title: 'Technical review & prototypes', body: 'Bring a specific implementation question, a prototype, or a small piece of work that needs close examination. A focused question makes limited consulting time more useful.' },
] as const;

export const consultingQuestions = [
  { question: 'What is the free evaluation for?', answer: 'It is the starting conversation about the problem, its context, and whether there is a useful fit. Any paid investigation or execution is agreed separately before it begins.' },
  { question: 'What counts toward the three-hour weekly limit?', answer: 'After agreement to a paid engagement, document review, analysis, preparation, agreed execution, meetings, and client-requested interruptions during that work all count. The limit applies to the total consulting work for that client.' },
  { question: 'What can a focused engagement produce?', answer: 'Depending on the agreed scope, a useful outcome could be a reviewed technical decision, an explanation of a difficult mechanism, a workflow outline, or a scoped prototype. The intended result and time budget are established together.' },
  { question: 'Can we discuss a larger or exclusive engagement?', answer: 'Yes. A separately defined contract can address scope, schedule, fee, reserved availability, or exclusivity. Those terms are discussed directly with the founder.' },
] as const;

export const contactQuestions = [
  { question: 'What should I include in a first message?', answer: 'Describe what you are trying to understand or build, what is blocking you, and what a useful outcome would look like. A short description and a relevant public reference are a good starting point.' },
  { question: 'Does an initial inquiry begin a paid engagement?', answer: 'The first consulting evaluation is free. Paid work begins after scope and availability have been agreed. Reviewing documentation as part of that paid work counts toward the weekly limit.' },
  { question: 'Can I inspect Proto-Pineal / UMBRA?', answer: 'Published manuscripts through v8.1 can be read on Zenodo, with the author’s ORCID linked alongside them. The engine and current implementation remain proprietary. The Research page also links to separate public projects and their documented scope.' },
] as const;
