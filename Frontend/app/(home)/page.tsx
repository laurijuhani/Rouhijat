import Games from "@/components/home/Games";
import Image from "next/image";
import { Suspense } from "react";
import Loading from "../loading";

export default function Home() {
  return (
    <div className="text-center items-center justify-center content-center">
      <div className="bg-zinc-600 p-4">
        <Image
          className="logo mx-auto"
          src="/logo.svg"
          alt="logo"
          width={400}
          height={400}
          priority
          />
        </div>

  
      <div className="pt-8">
        <Suspense fallback={<Loading />}>
          <Games />
        </Suspense>
      </div>
  

      <p className="text-center text-2xl">Welcome to the Rouhijat website!</p> 
    </div>    

  );
}
