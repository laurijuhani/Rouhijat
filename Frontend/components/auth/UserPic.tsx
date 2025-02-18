import useSession from "@/hooks/useSession"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import useSignout from "@/hooks/useSignout";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const UserPic = () => {
  const { user } = useSession();
  const signout = useSignout();

  if (!user) return null; 

  console.log(new Date(user.iat).toLocaleString());

  return (
    <>  
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Käyttäjäni</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <a href="/profile">Profiili</a>
          </DropdownMenuItem>
          <DropdownMenuItem>Hallintapaneeli</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button onClick={signout}>Kirjaudu ulos</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserPic