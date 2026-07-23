import styles from "./Italic.module.css";

export function Italic({ children }: { children: React.ReactNode }) {
  return <em className={styles.em}>{children}</em>;
}
