"use client"
import { useSession, signIn, signOut } from "next-auth/react"


const Signin = () => {
  const { data: session } = useSession();


  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name} </p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }


  return (
    <div>
      <p>You are not signed in</p>
      <button onClick={() => signIn("google")}>Sign in with google</button>
    </div>
  )
}

export default Signin
