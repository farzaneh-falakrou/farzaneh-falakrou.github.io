import { PulseDot } from "./PulseDot";
import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  variant?: "sans" | "italic";
  withPulseDot?: boolean;
  children: React.ReactNode;
}

export function Eyebrow({ variant = "sans", withPulseDot = false, children }: EyebrowProps) {
  return (
    <div className={variant === "italic" ? styles.italic : styles.sans}>
      {withPulseDot ? <PulseDot /> : null}
      {children}
    </div>
  );
}
