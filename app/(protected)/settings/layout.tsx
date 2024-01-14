"use client";

import { useStyles } from "@/hooks/use_styles";
import Navbar from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactElement;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const styles = useStyles();
  return (
    <div
      style={styles.container}
      className=" h-full w-full flex flex-col gap-y-10 items-center  justify-center"
    >
      <Navbar></Navbar>
      {children}
    </div>
  );
};

export default ProtectedLayout;
