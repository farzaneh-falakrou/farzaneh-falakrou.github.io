import styles from "./DisplayHeading.module.css";

interface DisplayHeadingProps {
  as?: "h1" | "h2" | "h3";
  size?: "hero" | "work" | "about" | "contact";
  children: React.ReactNode;
}

export function DisplayHeading({ as = "h1", size = "hero", children }: DisplayHeadingProps) {
  const Tag = as;
  return (
    <Tag className={`${styles.display} ${styles[`size_${size}`]}`}>
      {children}
    </Tag>
  );
}
