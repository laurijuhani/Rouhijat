"use client"
import useSession from "@/hooks/useSession";

const Signin = () => {
  const { user } = useSession();

  if (user) {
    console.log(user);
    
    return (
      <div>
        <p>Welcome, {user.name} </p>
        <button onClick={() => {
          localStorage.removeItem('token');
          window.location.reload();
        }}>Sign out</button>
      </div>
    )
  }

  return (
    <div>
      <p>You are not signed in</p>
      <button onClick={() => {
        // Redirect to your backend authentication endpoint
        window.location.href = process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/google';
      }}>Sign in with Google</button>
    </div>
  )
}

export default Signin;