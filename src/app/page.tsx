import {
  Button,
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
import { HowIWork } from "@/components/HowIWork";
import { HomeIntro } from "@/components/HomeIntro";

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
        <RevealFx translateY="4" fillWidth horizontal="center">
          <HeroHeadline />
        </RevealFx>
      </Column>

      {/* ── Stats ── */}
      <RevealFx translateY="4" delay={0.2} fillWidth>
        <StatsStrip />
      </RevealFx>

      {/* ── About teaser ── */}
      <RevealFx delay={0.3} fillWidth>
        <HomeIntro />
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

      {/* ── How I work ── */}
      <RevealFx delay={0.45} fillWidth>
        <HowIWork />
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
