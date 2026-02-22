import {
  Button,
  Avatar,
  RevealFx,
  Column,
  Row,
  Heading,
  Schema,
  Meta,
} from "@once-ui-system/core";
import { home, about, person, baseURL } from "@/resources";
import { Projects } from "@/components/work/Projects";
import { HeroHeadline, RotatingBadge } from "@/components/HeroHeadline";
import { StatsStrip } from "@/components/StatsStrip";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { ProcessAndTools } from "@/components/ProcessAndTools";
import { FooterCTA } from "@/components/FooterCTA";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* ── Hero ── */}
      <Column fillWidth horizontal="center" gap="m" style={{ position: "relative" }}>
        <RotatingBadge />
        <Column maxWidth="s" horizontal="center" align="center" gap="32">
          <RevealFx translateY="4" fillWidth horizontal="center">
            <HeroHeadline />
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.2} horizontal="center" paddingLeft="12">
            <Button
              data-border="rounded"
              href="/work"
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                View my work
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>

      {/* ── Stats ── */}
      <RevealFx translateY="4" delay={0.3} fillWidth>
        <StatsStrip />
      </RevealFx>

      {/* ── Selected Work — leads with evidence ── */}
      <RevealFx delay={0.4} fillWidth>
        <Column fillWidth gap="24">
          <Row fillWidth horizontal="between" vertical="center">
            <Column gap="4">
              <span style={{ fontSize: "var(--font-size-label-default-s)", color: "var(--neutral-on-background-weak)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>
                Selected Work
              </span>
              <Heading as="h2" variant="heading-strong-l">
                A few things I&apos;ve shipped
              </Heading>
            </Column>
            <Button href="/work" variant="tertiary" size="s" arrowIcon>
              View all
            </Button>
          </Row>
          <Projects range={[1, 3]} />
        </Column>
      </RevealFx>

      {/* ── Process + Tools ── */}
      <ProcessAndTools />

      {/* ── Disciplines marquee ── */}
      <MarqueeTicker />

      {/* ── Footer CTA ── */}
      <FooterCTA />
    </Column>
  );
}
