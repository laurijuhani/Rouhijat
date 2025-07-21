"use client";

import useSession from "@/hooks/useSession";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import useSignout from "@/hooks/useSignout";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from "react";

const UserPic = () => {
  const { user } = useSession();
  const signout = useSignout();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }
  ,[]);

  if (!user || !isClient) return null; 

  return (
    <>  
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-primary">
          <DropdownMenuLabel>Käyttäjäni</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <a href="/blogs">Blogit</a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="/dashboard">Hallintapaneeli</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button onClick={signout}>Kirjaudu ulos</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserPic;