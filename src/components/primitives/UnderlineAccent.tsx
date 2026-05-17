import styles from "./UnderlineAccent.module.css";

export function UnderlineAccent({ children }: { children: React.ReactNode }) {
  return <span className={styles.underline}>{children}</span>;
}
