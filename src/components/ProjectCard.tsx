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
  tags?: string[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  featured = false,
  images = [],
  title,
  content,
  description,
  link,
  tags,
}) => {
  return (
    <div
      className={`project-card${featured ? " project-card--featured" : " project-card--compact"}`}
    >
      {/* Cover link — makes the whole card Cmd+clickable and right-clickable */}
      <a href={href} className="project-card__cover-link" aria-label={title} />

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
        {tags && tags.length > 0 && (
          <div className="project-card__tags">
            {tags.slice(0, featured ? 4 : 3).map((tag) => (
              <span key={tag} className="project-card__tag">{tag}</span>
            ))}
          </div>
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
