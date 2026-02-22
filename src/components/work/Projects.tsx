import { getPosts } from "@/utils/utils";
import { Column } from "@once-ui-system/core";
import { ProjectCard } from "@/components";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
}

export function Projects({ range, exclude }: ProjectsProps) {
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  if (exclude && exclude.length > 0) {
    allProjects = allProjects.filter((post) => !exclude.includes(post.slug));
  }

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  const [featured, ...rest] = displayedProjects;

  return (
    <Column fillWidth gap="xl">
      {/* Featured — full width */}
      {featured && (
        <ProjectCard
          featured
          priority
          key={featured.slug}
          href={`/work/${featured.slug}`}
          images={featured.metadata.images}
          title={featured.metadata.title}
          description={featured.metadata.summary}
          content={featured.content}
          avatars={featured.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={featured.metadata.link || ""}
          tags={featured.metadata.tags || []}
        />
      )}

      {/* Remaining — 2-column grid */}
      {rest.length > 0 && (
        <div
          className="project-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "32px",
          }}
        >
          {rest.map((post, index) => (
            <ProjectCard
              priority={index < 1}
              key={post.slug}
              href={`/work/${post.slug}`}
              images={post.metadata.images}
              title={post.metadata.title}
              description={post.metadata.summary}
              content={post.content}
              avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
              link={post.metadata.link || ""}
              tags={post.metadata.tags || []}
            />
          ))}
        </div>
      )}
    </Column>
  );
}
