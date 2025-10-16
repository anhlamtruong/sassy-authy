"use client";

import { logout } from "@/actions/logout";
import { useTransition } from "react";
import { BeatLoader, ClockLoader } from "react-spinners";

interface LogoutButtonProps {
  children: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ children }) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <button
      disabled={isPending}
      onClick={onClick}
      className=" items-center flex cursor-pointer"
    >
      {children}
      {isPending && <ClockLoader size={20} className="ml-2"></ClockLoader>}
    </button>
  );
};

export default LogoutButton;
