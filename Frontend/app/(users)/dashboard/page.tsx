"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import UserNavBar from "@/components/dashboard/UserNavBar";
import UsersList from "@/components/dashboard/UsersList";
import { User } from "@/hooks/useSession";

const Page = ({ user }: { user: User }) => {
  return (
    <>
      <UserNavBar user={user} />

      <div className="flex flex-col">
        <UsersList  user={user} />

      </div>


    </>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute WrappedComponent={Page} />
  )
}
