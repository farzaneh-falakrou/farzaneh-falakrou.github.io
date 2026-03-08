import Image from "next/image";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  description: string;
  tags?: string[];
  timeframe?: string;
  impact?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority = false,
  images = [],
  title,
  description,
  tags,
  timeframe,
  impact,
}) => {
  return (
    <div className="project-card">
      {/* Overlay anchor — makes the entire card right-clickable / Cmd+clickable */}
      <a href={href} className="project-card__cover-link" aria-label={title} />

      {/* Left: image */}
      {images[0] && (
        <div className="project-card__image">
          <Image
            src={images[0]}
            alt={title}
            fill
            sizes="(max-width: 720px) 100vw, 44vw"
            priority={priority}
            className="project-card__img"
          />
        </div>
      )}

      {/* Right: content */}
      <div className="project-card__body">
        <div className="project-card__body-top">
          <h3 className="project-card__title">{title}</h3>
          {impact && <p className="project-card__tagline">{impact}</p>}
          {timeframe && <p className="project-card__timeframe">{timeframe}</p>}
          {description?.trim() && (
            <p className="project-card__description">{description}</p>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="project-card__tags">
            {tags.map((tag) => (
              <span key={tag} className="project-card__tag">
                {tag.replace(/ /g, "_")}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
