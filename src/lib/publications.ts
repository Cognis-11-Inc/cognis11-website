/** Author identity and public records verified against ORCID's public API and
 * DataCite's DOI metadata on 2026-11-05. Excerpts are from registered abstracts. */
export const researcher = {
  name: 'Guillaume Heinerth',
  orcid: '0009-0009-0353-5821',
  orcidUrl: 'https://orcid.org/0009-0009-0353-5821',
  zenodoUrl: 'https://zenodo.org/records/22313960',
};

export const publications = [
  {
    version: 'v8.1', date: '2026-09-05',
    title: 'Proto-Pineal v8.1 UMBRA Claim Harmonised',
    doi: '10.5281/zenodo.22313960', record: 'https://zenodo.org/records/22313960',
    summary: 'A versioned account of the governed UMBRA prototype. The manuscript distinguishes state-transition authority from language-model proposals, memory, and presentation, and separates implementation evidence from experimental claims.',
    quote: '',
  },
  {
    version: 'v7.5', date: '2026-04-13',
    title: 'Proto-Pineal v7.5: Demonstrating Trajectory Sensitivity Beyond Endpoint State in a Deterministic System',
    doi: '10.5281/zenodo.19546840', record: 'https://zenodo.org/records/19546840',
    summary: 'The note reports a deterministic replay assay in which near-identical endpoints accompany different trajectory geometry. It asks what is lost when the path is reduced to its final snapshot, within the tested substrate.',
    quote: 'ordered path information is not reducible to endpoint state.',
  },
  {
    version: 'v7.4.1', date: '2026-03-07',
    title: 'Proto-Pineal v7.4.1 Platinum: A Continuity Architecture for Persistent Cognitive Systems',
    doi: '10.5281/zenodo.18904307', record: 'https://zenodo.org/records/18904307',
    summary: 'An architecture manuscript addressing persistence, drift, temporal observability, and the conditions under which continuity can be inspected. The public record includes the core text and its constitutive supplements.',
    quote: 'an inspectable structural property rather than a narrative effect.',
  },
] as const;

export const manuscriptExcerpt = 'It records a bounded, inspectable research artifact and its evidentiary limits.';
export const manuscriptPath = 'research/umbra-v8-1/';
export const manuscriptFile = 'research/proto-pineal-v8.1.pdf';

// Further author-linked records, verified in ORCID. They are linked as records;
// no uninspected abstract or result is asserted here.
export const furtherRecords = [
  { title: 'Proto-Pineal V.8.0 UMBRA Working Manuscript', doi: '10.5281/zenodo.22309853' },
  { title: 'Proto-Pineal Reset Input Admissibility Boundary', doi: '10.5281/zenodo.19748624' },
  { title: 'Proto-Pineal Long-Horizon Deterministic Reconstitution to Canonical RT After Bounded Symbolic Stress', doi: '10.5281/zenodo.19717244' },
  { title: 'Proto-Pineal Long-Horizon Deterministic Reconstitution to Canonical RT(32) After Bounded Symbolic Stress', doi: '10.5281/zenodo.19744993' },
  { title: 'Proto-Pineal: Deterministic Reconstitution to Canonical RT After Bounded Symbolic Stress', doi: '10.5281/zenodo.19715325' },
  { title: 'ATL8: A Structure-First Symbolic Memory Substrate (Proto-Pineal, Work in Progress)', doi: '10.5281/zenodo.18463524' },
] as const;
