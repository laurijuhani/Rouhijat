import CancelButton from "@/components/signin/CancelButton"
import Error from "@/components/signin/Error"
import Signin from "@/components/signin/Signin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Page = () => {
  

  return (

    <div className="flex flex-col justify-center items-center h-screen relative">
    <Error />
    <div className="w-[90%] max-w-[400px] flex flex-col">
      <Card className="flex-grow bg-gray-200">
        <CardHeader>
          <CardTitle>Kirjaudu</CardTitle>
          <CardDescription className="text-gray-800">Kirjaudu sisään Google käyttäjällä</CardDescription>
        </CardHeader>
        <CardContent>
          <Signin />
        </CardContent>
      </Card>
      <div className="flex justify-start mt-4">
        <CancelButton />
      </div>
    </div>
  </div>
 
  )
}

export default Page
