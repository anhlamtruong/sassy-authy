"use client";
import { logout } from "@/actions/logout";
import ThemeSwitcher from "@/components/ui/theme_switcher";
import { useCurrentUser } from "@/hooks/use_current_user";
import { useStyles } from "@/hooks/use_styles";

const SettingsPage = () => {
  const user = useCurrentUser();
  const styles = useStyles();

  return (
    <div
      style={styles.card}
      className=" transition-all justify-center items-center flex flex-col w-max p-10  rounded-xl"
    ></div>
  );
};

export default SettingsPage;
