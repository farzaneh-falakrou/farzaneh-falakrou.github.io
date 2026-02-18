"use client";

import { Carousel, Heading, SmartLink, Text } from "@once-ui-system/core";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  featured?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  featured = false,
  images = [],
  title,
  content,
  description,
  link,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Let inner <a> tags handle their own navigation
    if ((e.target as HTMLElement).closest("a")) return;
    window.location.href = href;
  };

  return (
    <div
      className={`project-card${featured ? " project-card--featured" : " project-card--compact"}`}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") window.location.href = href; }}
    >
      <div className="project-card__image">
        <Carousel
          sizes={featured ? "(max-width: 960px) 100vw, 960px" : "(max-width: 640px) 100vw, 480px"}
          items={images.map((image) => ({ slide: image, alt: title }))}
        />
      </div>

      <div className="project-card__body">
        {title && (
          <Heading as="h2" wrap="balance" variant={featured ? "heading-strong-xl" : "heading-strong-l"}>
            {title}
          </Heading>
        )}
        {description?.trim() && (
          <Text
            variant="body-default-s"
            onBackground="neutral-weak"
            wrap="balance"
          >
            <span className={featured ? "" : "project-card__clamp"}>
              {description}
            </span>
          </Text>
        )}
        <div className="project-card__links">
          {content?.trim() && (
            <SmartLink
              suffixIcon="arrowRight"
              style={{ margin: 0, width: "fit-content" }}
              href={href}
            >
              <Text variant="body-default-s">Read case study</Text>
            </SmartLink>
          )}
          {link && (
            <SmartLink
              suffixIcon="arrowUpRightFromSquare"
              style={{ margin: 0, width: "fit-content" }}
              href={link}
            >
              <Text variant="body-default-s">View project</Text>
            </SmartLink>
          )}
        </div>
      </div>
    </div>
  );
};
