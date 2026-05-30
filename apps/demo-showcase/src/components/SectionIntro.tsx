import { Heading, Text } from '@ui-construction-library/core';

export function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="stack stack-tight section-intro">
      <Text className="eyebrow">{eyebrow}</Text>
      <Heading as="h2" className="section-heading">
        {title}
      </Heading>
      <Text className="section-description">{description}</Text>
    </div>
  );
}
