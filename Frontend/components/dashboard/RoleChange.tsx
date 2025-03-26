"use client";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DBUser } from "@/types/database_types";
import { useState } from "react";

type Role = 'user' | 'admin' | 'owner';


// TODO: put also deleteing the user here 

interface RoleChangeProps {
  role: Role;
  id: string;
  setUsers: React.Dispatch<React.SetStateAction<DBUser[]>>;
}

const RoleChange = ({ role, id, setUsers }: RoleChangeProps) => {
  const [selectedRole, setSelectedRole] = useState(role);

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
  };


  const handleButtonClick = async() => {    
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/users/changerole', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ id, role: selectedRole })
    });

    if (!res.ok) {
      console.error('Failed to change role');
      return;
    }

    setUsers((prev) => prev.map((user) => {
      if (user.id === id) {
        return { ...user, role: selectedRole };
      }
      return user;
    }));
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
  );
};

export default RoleChange;
