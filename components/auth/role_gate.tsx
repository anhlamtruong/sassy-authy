"use client";

import { UserRole } from "@prisma-client-authenticate";

import { useCurrentRole } from "@/hooks/use_current_role";
import { FormError } from "@/components/form_error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return <>{children}</>;
};
