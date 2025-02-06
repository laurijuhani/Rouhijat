import Signin from "@/components/signin/Signin"
import SessionProviderWrapper from "@/components/utils/SessionProviderWrapper"

const Page = () => {
  

  return (
    <div>
      <SessionProviderWrapper>
        <Signin />
      </SessionProviderWrapper>
    </div>
  )
}

export default Page
