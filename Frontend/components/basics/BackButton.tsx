"use client"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import Image from "next/image"


const BackButton = () => {
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => router.back()}>
      <Image src="/icons/back.svg" alt="Back" width={15} height={15} />
      Takaisin
    </Button> 
  )
}

export default BackButton
