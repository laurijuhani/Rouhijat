"use client";
import { User } from "@/hooks/useSession";
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
} from "@/components/ui/table";
import RoleChange from "./RoleChange";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useToast } from "@/context/ToastContext";


const UsersList = ({ user }: { user: User }) => {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [invites, setInvites] = useState<string[]>([]);
  const { showToast } = useToast();

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
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error(error);
      });
       
      if (user.role === 'admin' || user.role === 'owner') { 
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/invites', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch other data');
          }
          return response.json();
        })
        .then((data) => {
          setInvites(data);
        })
        .catch((error) => {
          console.error(error);
        });
      }
       
  }, [user]);
    

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');

    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/invites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      showToast('error', 'Kutsun lähettäminen epäonnistui', 'Yritä uudelleen');
      console.error('Failed to send invite');
      return;
    }
    setInvites([...invites, email as string]);
    showToast('success', 'Kutsu lähetetty', '');
  };

  const handleDelete = async (email: string) => {
    const confirmDelete = window.confirm('Haluatko varmasti poistaa kutsun?');
    if (confirmDelete) {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/invites/' + email, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!res.ok) {
        showToast('error', 'Kutsun poistaminen epäonnistui', 'Yritä uudelleen');
        console.error('Failed to delete invite');
        return;
      }
      setInvites(invites.filter(invite => invite !== email));
      showToast('success', 'Kutsu poistettu', '');
    }
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
              <TableCell>
                {(user.role === 'admin' || user.role === 'owner') ? (
                  <RoleChange 
                    role={dbuser.role} 
                    id={dbuser.id} 
                    setUsers={setUsers} 
                  />
                ) : (
                  dbuser.role
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> 

      {(user.role === 'admin' || user.role === 'owner')  && (
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
                    <TableCell>
                      <Button variant='destructive' onClick={() => handleDelete(invite)}>
                        <TrashIcon className="opacity-60" size={13} aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
};

export default UsersList;
