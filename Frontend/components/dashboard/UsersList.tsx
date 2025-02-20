"use client";
import { User } from "@/hooks/useSession"
import { DBUser } from "@/types/database_types";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import RoleChange from "./RoleChange";

const UsersList = ({ user }: { user: User }) => {
  const [users, setUsers] = useState<DBUser[]>([]);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      }
      )
      .then((data) => {
        setUsers(data);        
      }
      )
      .catch((error) => {
        console.error(error);
      }
      );
  }, [user]);
    

  return (
    <div>
      {user.name}


      <Table>
        <TableCaption>Lista käyttäjistä</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nimi</TableHead>
            <TableHead>Sähköposti</TableHead>
            <TableHead>Rooli</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((dbuser) => (
            <TableRow key={dbuser.id}>
              <TableCell>{dbuser.name}</TableCell>
              <TableCell>{dbuser.email}</TableCell>
              <TableCell><RoleChange role={dbuser.role} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> 
    </div>
  )
}

export default UsersList
