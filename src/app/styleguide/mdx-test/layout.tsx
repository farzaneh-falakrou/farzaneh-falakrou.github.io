import styles from "./layout.module.css";

export default function MdxTestLayout({ children }: { children: React.ReactNode }) {
  return <main className={styles.container}>{children}</main>;
}
