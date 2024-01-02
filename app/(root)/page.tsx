// import { Button } from "@/components/ui/button";
// import ThemeSwitcher from "@/components/ui/theme_switcher";
import { Inter, Reenie_Beanie } from "next/font/google";
import MainApp from "../_component/main_app";

const inter = Inter({ subsets: ["latin"] });
export const reenie_beanie = Reenie_Beanie({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});
export default function Home() {
  return (
    <div className=" w-screen h-screen">
      <MainApp></MainApp>
    </div>
  );
}
