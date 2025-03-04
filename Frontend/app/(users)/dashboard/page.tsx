"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import UserNavBar from "@/components/dashboard/UserNavBar";
import { User } from "@/hooks/useSession";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { lazy, Suspense } from "react";
import Spinner from "@/components/basics/Spinner";
import { PlayersProvider } from "@/context/PlayersContext";
import { ToastProvider } from "@/context/ToastContext";

const UsersList = lazy(() => import("@/components/dashboard/UsersList"));
const PlayersList = lazy(() => import("@/components/dashboard/PlayersList"));
const GamesList = lazy(() => import("@/components/dashboard/GamesList"));

const Page = ({ user }: { user: User }) => {
  return (
    <PlayersProvider>
      <ToastProvider>
        <UserNavBar user={user} />


        <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Käyttäjät</TabsTrigger>
          <TabsTrigger value="players">Pelaajat</TabsTrigger>
          <TabsTrigger value="games">Pelit</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Suspense fallback={<Spinner className="flex justify-center mt-4"/>}>
            <UsersList user={user} />     
          </Suspense>
        </TabsContent>
        <TabsContent value="players">
          <Suspense fallback={<Spinner className="flex justify-center mt-4"/>}>
            <PlayersList user={user} />
          </Suspense>
        </TabsContent>
        <TabsContent value="games">
          <Suspense fallback={<Spinner className="flex justify-center mt-4"/>}>
            <GamesList />
          </Suspense>
        </TabsContent>
      </Tabs>

      
    </ToastProvider>
  </PlayersProvider>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute WrappedComponent={Page} />
  )
}
