import { Column, Row, Heading, Text, Button, IconButton } from "@once-ui-system/core";
import { person } from "@/resources";

export function FooterCTA() {
  return (
    <Column
      fillWidth
      horizontal="center"
      align="center"
      gap="32"
      paddingY="80"
      style={{
        borderTop: "1px solid var(--neutral-alpha-weak)",
      }}
    >
      <Column horizontal="center" align="center" gap="16" maxWidth="s">
        <span style={{ fontSize: "var(--font-size-label-default-s)", color: "var(--neutral-on-background-weak)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>
          Get in touch
        </span>
        <Heading variant="display-strong-m" align="center" wrap="balance">
          Let&apos;s work together
        </Heading>
        <Text
          variant="body-default-l"
          onBackground="neutral-weak"
          align="center"
          wrap="balance"
        >
          I&apos;m currently open to new opportunities. Whether you have a project
          in mind or just want to say hi — my inbox is always open.
        </Text>
      </Column>

      <Row gap="12" wrap horizontal="center">
        <Button
          href={`mailto:${person.email}`}
          variant="primary"
          size="l"
          arrowIcon
        >
          Say hello
        </Button>
        <Button
          href="https://www.linkedin.com/in/farzaneh-falakrou/"
          variant="secondary"
          size="l"
          prefixIcon="linkedin"
        >
          LinkedIn
        </Button>
      </Row>

      <Row gap="8" horizontal="center">
        <IconButton
          href="https://github.com/farzaneh-falakrou"
          icon="github"
          variant="ghost"
          size="m"
          tooltip="GitHub"
          tooltipPosition="bottom"
        />
        <IconButton
          href="https://www.behance.net/farzanehfalakrou"
          icon="behance"
          variant="ghost"
          size="m"
          tooltip="Behance"
          tooltipPosition="bottom"
        />
        <IconButton
          href={`mailto:${person.email}`}
          icon="email"
          variant="ghost"
          size="m"
          tooltip="Email"
          tooltipPosition="bottom"
        />
      </Row>
    </Column>
  );
}
