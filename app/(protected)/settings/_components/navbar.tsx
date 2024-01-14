"use client";

import { useStyles } from "@/hooks/use_styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ui/theme_switcher";
import { UserButton } from "@/components/auth/user_button";
const NavBar = () => {
  const styles = useStyles();
  const pathname = usePathname();
  return (
    <nav
      style={styles.card}
      className=" flex justify-between items-center p-4 rounded-xl w-3/4 shadow-sm"
    >
      <div className="flex gap-x-2">
        <Button variant={pathname === "/server" ? "default" : "outline"}>
          {" "}
          <Link href={"/server"}>Server</Link>
        </Button>
        <Button variant={pathname === "/client" ? "default" : "outline"}>
          {" "}
          <Link href={"/client"}>Client</Link>
        </Button>
        <Button variant={pathname === "/admin" ? "default" : "outline"}>
          {" "}
          <Link href={"/admin"}>Admin</Link>
        </Button>
        <Button variant={pathname === "/settings" ? "default" : "outline"}>
          {" "}
          <Link href={"/settings"}>Settings</Link>
        </Button>
        <ThemeSwitcher></ThemeSwitcher>
      </div>
      <UserButton />
    </nav>
  );
};

export default NavBar;
