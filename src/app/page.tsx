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
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center" gap="32" style={{ position: "relative" }}>
          <RotatingBadge />
          <RevealFx translateY="4" fillWidth horizontal="center">
            <HeroHeadline />
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
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
                {about.title}
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      <RevealFx translateY="12" delay={0.8} fillWidth>
        <StatsStrip />
      </RevealFx>
      <RevealFx translateY="8" delay={1.0} fillWidth>
        <ProcessAndTools />
      </RevealFx>
      <RevealFx translateY="16" delay={1.2} fillWidth>
        <Column fillWidth gap="24">
          <Row fillWidth horizontal="between" vertical="center">
            <Column gap="4">
              <span style={{ fontSize: "var(--font-size-label-default-s)", color: "var(--neutral-on-background-weak)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>
                Selected Work
              </span>
              <Heading variant="heading-strong-l">
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
      <RevealFx translateY="8" delay={1.5} fillWidth>
        <MarqueeTicker />
      </RevealFx>
      <RevealFx translateY="16" delay={1.6} fillWidth>
        <FooterCTA />
      </RevealFx>
    </Column>
  );
}
