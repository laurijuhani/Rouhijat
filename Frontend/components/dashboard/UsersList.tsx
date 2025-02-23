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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const UsersList = ({ user }: { user: User }) => {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [invites, setInvites] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      });

      const fetchInvites = fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/invites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch other data');
        }
        return response.json();
      });
  
      Promise.all([fetchUsers, fetchInvites])
        .then(([usersData, invitesData]) => {
          setUsers(usersData);
          setInvites(invitesData);          
        })
        .catch((error) => {
          console.error(error);
        });
     
  }, [user]);
    

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    console.log(email);
    // TODO: Send a POST request to the backend with the new user data
    // validation also
  };

  return (
    <div>
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

      {user.role === 'admin' || user.role === 'owner' && (
        <>
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-3 gap-4 mr-2 ml-2">
            <Label htmlFor="email" className="col-span-4">Kutsu käyttäjä</Label>
            <Input type="email" id="email" name="email" required className="col-span-3 h-10" />
            <Button type="submit" className="col-span-1 h-10">Lisää käyttäjä</Button>
          </form>

          {invites.length === 0 ? (
            <p className="m-4 flex justify-center">Ei kutsuja</p>
          ) : (
            <Table>
              <TableCaption>Lista kutsuista</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Sähköposti</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite, index) => (
                  <TableRow key={index}>
                    <TableCell>{invite}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  )
}

export default UsersList
