"use client";

import { Avatar, Button, Column, Text } from "@once-ui-system/core";
import { about, person } from "@/resources";

export function HomeIntro() {
  return (
    <div className="home-intro">
      {about.avatar.display && (
        <div className="home-intro__photo">
          <Avatar src={person.avatar} size="xl" />
        </div>
      )}
      <div className="home-intro__content">
        <Column gap="16">
          <Text
            variant="body-default-l"
            onBackground="neutral-weak"
            wrap="balance"
          >
            I studied architecture in Milan before making the jump to digital
            product design. That background shaped how I think — systems first,
            then details. I&apos;ve spent the last 6 years helping teams turn
            ambiguous problems into interfaces that feel obvious in hindsight.
          </Text>
          <Button
            href={about.path}
            variant="tertiary"
            size="m"
            weight="default"
            arrowIcon
          >
            More about me
          </Button>
        </Column>
      </div>
    </div>
  );
}
