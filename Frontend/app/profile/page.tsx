"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { User } from "@/hooks/useSession";

const Page = ({ user }: { user: User }) => {
  return (
    <div>
      {user.name} -
    Profiili      
    </div>
  )
}

export default function Profile() {
  return (
    <ProtectedRoute WrappedComponent={Page} />
  )
}
