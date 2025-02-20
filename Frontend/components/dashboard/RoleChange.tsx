"use client"

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

type Role = 'user' | 'admin' | 'owner';

interface RoleChangeProps {
  role: Role;
}

const RoleChange = ({ role }: RoleChangeProps) => {
  const [selectedRole, setSelectedRole] = useState(role);

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
  };


  const handleButtonClick = () => {
    console.log(selectedRole);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 max-w-[210px]">
      <div className="w-full sm:w-[105px]">
        <Select onValueChange={handleRoleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={selectedRole} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">user</SelectItem>
            <SelectItem value="admin">admin</SelectItem>
            <SelectItem value="owner">owner</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-[105px]">
        {selectedRole !== role && (
          <Button onClick={handleButtonClick} className="w-full">
            Vaihda rooli
          </Button>
        )}
      </div>
    </div>
  )
}

export default RoleChange
