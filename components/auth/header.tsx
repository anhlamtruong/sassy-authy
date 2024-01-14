import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({ subsets: ["latin"], weight: ["100"] });

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-start justify-center h-full">
      <h1 className="text-xl font-semibold">{label}</h1>
    </div>
  );
};
