"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Users,
  BarChart3,
  Shield,
} from "lucide-react";

type Props = {
  isAdmin: boolean;
  isManager: boolean;
};

export default function CustomUserButton({
  isAdmin,
  isManager,
}: Props) {
  return (
    <UserButton>
      <UserButton.MenuItems>

        {/* Cashiers */}
        {(isManager || isAdmin) && (
          <UserButton.Link
            label="Cashiers"
            labelIcon={<Users size={16} />}
            href="/cashiers"
          />
        )}

        {/* Analytics */}
        {(isManager || isAdmin) && (
          <UserButton.Link
            label="Analytics"
            labelIcon={<BarChart3 size={16} />}
            href="/analytics"
          />
        )}

        {/* Admin */}
        {isAdmin && (
          <UserButton.Link
            label="Admin"
            labelIcon={<Shield size={16} />}
            href="/admin"
          />
        )}

      </UserButton.MenuItems>
    </UserButton>
  );
}