import { Heading, Link, Text } from '@ui-construction-library/core';

const GITHUB_URL = 'https://github.com/jilimb0/UI-Library';
const DOCS_URL = './docs/';
const STORYBOOK_URL = './storybook/';

export function FooterSection() {
  return (
    <footer className="footer-panel">
      <div className="stack stack-tight">
        <Text className="eyebrow">Public entry points</Text>
        <Heading as="h2" className="section-heading">
          Explore the full library surface
        </Heading>
      </div>
      <div className="row wrap-row">
        <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          View GitHub
        </Link>
        <Link href={DOCS_URL}>Open docs</Link>
        <Link href={STORYBOOK_URL}>Open Storybook</Link>
      </div>
    </footer>
  );
}
