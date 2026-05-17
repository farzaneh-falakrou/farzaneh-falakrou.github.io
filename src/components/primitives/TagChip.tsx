import styles from "./TagChip.module.css";

export function TagChip({ children }: { children: React.ReactNode }) {
  return <span className={styles.tag}>{children}</span>;
}
