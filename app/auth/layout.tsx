"use client";
import { useStyles } from "@/hooks/useStyles";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const styles = useStyles();
  return (
    <div
      style={styles.container}
      className=" h-full flex items-center justify-center"
    >
      {children}
    </div>
  );
};

export default AuthLayout;
