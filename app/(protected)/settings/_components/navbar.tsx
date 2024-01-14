"use client";

import { useStyles } from "@/hooks/use_styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ui/theme_switcher";
const NavBar = () => {
  const styles = useStyles();
  const pathname = usePathname();
  return (
    <nav
      style={styles.card}
      className=" flex justify-between items-center p-4 rounded-xl w-3/4 shadow-sm"
    >
      <div className="flex gap-x-2">
        <Button>
          {" "}
          <Link href={"/settings"}>Settings</Link>
        </Button>
        <ThemeSwitcher></ThemeSwitcher>
      </div>
      <p>User Button</p>
    </nav>
  );
};

export default NavBar;
