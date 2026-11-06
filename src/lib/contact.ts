import { site } from './site';

export const inquiryRoutes = [
  {
    id: 'evaluation', title: 'A free evaluation',
    description: 'A specific problem, an architectural decision, or a workflow you want to examine.',
    action: 'Prepare an evaluation inquiry', subject: 'Cognis 11 — free evaluation inquiry',
    body: 'What I am building or trying to understand:\n\nWhat is blocking me:\n\nWhat I have already tried:\n\nWhat a useful result would look like:\n',
  },
  {
    id: 'research', title: 'Research correspondence',
    description: 'A question, a public artifact, or an observation related to the company’s research direction.',
    action: 'Prepare a research inquiry', subject: 'Cognis 11 — research correspondence',
    body: 'The question or observation:\n\nRelevant public reference:\n\nWhat I would like to discuss:\n',
  },
  {
    id: 'collaboration', title: 'A possible collaboration',
    description: 'An intersection between engineering, creative practice, and a concrete thing worth building.',
    action: 'Prepare a collaboration inquiry', subject: 'Cognis 11 — collaboration inquiry',
    body: 'The idea or project:\n\nWhy I think there is a connection:\n\nWhat I could contribute:\n\nWhat we might build or investigate:\n',
  },
] as const;

export function inquiryMailto(subject: string, body: string) {
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
