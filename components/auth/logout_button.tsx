"use client";

import { logout } from "@/actions/logout";
import { useTransition } from "react";
import { BeatLoader } from "react-spinners";

interface LogoutButtonProps {
  children: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ children }) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      try {
        await logout();
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div onClick={onClick} className=" items-center flex cursor-pointer">
      {children}
      {isPending && <BeatLoader></BeatLoader>}
    </div>
  );
};

export default LogoutButton;
