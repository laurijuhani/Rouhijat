"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import UserPic from "@/components/auth/UserPic";
import BackButton from "@/components/profile/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/hooks/useSession";
import useSignout from "@/hooks/useSignout";

const Page = ({ user }: { user: User }) => {
  const signout = useSignout();
  return (
    <div>
      <div className="mb-4 flex justify-between w-full bg-gray-800 p-4 rounded-b-lg p-b-4">
        <BackButton />
        <div className="flex items-center ">
          <UserPic />
          <p className="ml-4">{user.name}</p>
        </div>
      </div>

      <div>
        <Label htmlFor="name">Nimi</Label>
        <Input type="text" id="name" placeholder={user.name} />
      </div>


      <div className="flex justify-center mt-10">
        <Button onClick={signout} variant="outline" className="mt-4">
          Kirjaudu ulos
        </Button>
      </div>
    </div>
  )
}

export default function Profile() {
  return (
    <ProtectedRoute WrappedComponent={Page} />
  )
}
