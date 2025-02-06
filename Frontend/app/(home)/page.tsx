import Games from "@/components/home/Games";
import Image from "next/image";
import { Suspense } from "react";
import Loading from "../loading";

export default function Home() {
  return (
    <div className="text-center items-center justify-center content-center">
      <Image
        className="logo mx-auto"
        src="/logo_ink.svg"
        alt="logo"
        width={400}
        height={400}
        priority
      />

      <Suspense fallback={<Loading />}>
        <Games />
      </Suspense>
  

      <p className="text-center text-2xl">Welcome to the Rouhijat website!</p> 
    </div>    

  );
}
