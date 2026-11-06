export const site = {
  name: 'Cognis 11 Inc.',
  contactEmail: 'founder@cognis11.xyz',
  founder: { name: 'Guillaume Heinerth', title: 'Founder and Operator' },
  github: 'https://github.com/Cognis-11-Inc',
  description:
    'A Canadian research company exploring synthetic intelligence, computational architectures, continuity, and human–synthetic dynamics.',
};

export const navigation = [
  { label: 'Home', path: '' },
  { label: 'Research', path: 'research/' },
  { label: 'Consulting', path: 'consulting/' },
  { label: 'About', path: 'about/' },
  { label: 'Contact', path: 'contact/' },
] as const;

/** Resolve local links and assets for custom-domain or project-path hosting. */
export function sitePath(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
