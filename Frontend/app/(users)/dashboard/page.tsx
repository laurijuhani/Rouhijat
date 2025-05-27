"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
import { InfoIcon } from "lucide-react";
import RedisReset from "@/components/dashboard/RedisReset";
import ManualFetch from "@/components/dashboard/ManualFetch";

const UsersList = lazy(() => import("@/components/dashboard/UsersList"));
const PlayersList = lazy(() => import("@/components/dashboard/PlayersList"));
const GamesList = lazy(() => import("@/components/dashboard/GamesList"));

const Page = ({ user }: { user: User }) => {
  return (
    <PlayersProvider>
      <ToastProvider>
        <UserNavBar user={user} />


        <div className="dark bg-primary text-foreground px-4 py-3 mb-4 mx-auto lg:w-[1024px] rounded-xl gap-3 flex items-center">
        <InfoIcon className="w-5 h-5" />
          <p className="text-center flex-grow text-base">
            Muutoksilla voi mennä 10 minuuttia, ennen kuin ne näkyy muille käyttäjille
          </p>
        </div>


        {(user.role === "admin" || user.role === "owner") && (
          <div className="my-4 justify-center flex gap-4">
            <RedisReset />
            <ManualFetch />
          </div>
          )}

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-primary">
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
  );
};

export default function Dashboard() {
  return (
    <ProtectedRoute WrappedComponent={Page} />
  );
}
