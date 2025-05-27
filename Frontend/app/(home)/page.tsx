import Games from "@/components/home/Games";
import Image from "next/image";
import { Suspense } from "react";
import Loading from "../loading";
import Feed from "@/components/instagram/Feed";

export default function Home() {
  return (
    <div className="text-center items-center justify-center content-center">
      <div className="p-4">
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
        <Suspense fallback={<Loading />}>
          <Feed />
        </Suspense>
      </div>
  
    </div>    

  );
}

