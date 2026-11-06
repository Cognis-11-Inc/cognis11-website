/** Public source was inspected on this date; these are scoped project descriptions,
 *  not a claim that this website's build reran those projects' experiments. */
export const evidenceReviewed = '2026-11-05';

export const publicArtifacts = [
  {
    id: 'hound',
    name: 'HOUND',
    number: '01',
    status: 'Research prototype · HOUND-001A',
    summary: 'Follow an observation back to its source.',
    description: 'A Rust prototype for collecting validated HTTP sensor observations in an explicitly authorized, controlled network. The evidence journal keeps provenance alongside each observation.',
    evidence: 'The verification record dated October 23, 2026 documents six synthetic messages crossing two relays, 18 recorded observations, and a repeated collection that added no duplicate records.',
    limit: 'This demonstration measures observation collection and delivery coverage. Intruder attribution and a learned investigation policy remain future work.',
    repository: 'https://github.com/Cognis-11-Inc/HOUND',
    sourceUrl: 'https://github.com/Cognis-11-Inc/HOUND/blob/c482d5d1eba8dbb640469b6040965418b8a4ec82/docs/verification/HOUND-001A.md',
    sourceLabel: 'Read the verification record',
    sourceKind: 'Documented experiment',
  },
  {
    id: 'digital-bee-hive',
    name: 'Digital Bee Hive',
    number: '02',
    status: 'Experimental project',
    summary: 'How much can small things build together?',
    description: 'An experimental project exploring bounded micro-agents, explicit knowledge, and collective organization. Its public design asks how deliberately incomplete components might cooperate.',
    evidence: 'The public repository describes the proposed colony structure, lineage, roles, permissions, and knowledge-metabolism model, giving readers a concrete design and source entry point.',
    limit: 'The design describes research intentions. It is not presented here as a benchmark, a production service, or proof of general intelligence.',
    repository: 'https://github.com/Cognis-11-Inc/Digital-BeeHive',
    sourceUrl: 'https://github.com/Cognis-11-Inc/Digital-BeeHive#readme',
    sourceLabel: 'Read the project design',
    sourceKind: 'Public design and source',
  },
] as const;
