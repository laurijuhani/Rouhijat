"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import UserNavBar from "@/components/dashboard/UserNavBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/hooks/useSession";

const Page = ({ user }: { user: User }) => {
  return (
    <div>
      <UserNavBar user={user} />

      <div>
        <Label htmlFor="name">Nimi</Label>
        <Input type="text" id="name" placeholder={user.name} />
      </div>



    </div>
  )
}

export default function Profile() {
  return (
    <ProtectedRoute WrappedComponent={Page} />
  )
}
