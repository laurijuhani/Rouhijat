import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const response = await fetch(`${process.env.BACKEND_URL}/signIn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: user.email, 
            name: user.name,
            image: user.image,
          }),
        }); 
   
        const data = await response.json();
       
        if (data.allowed) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    async session({ session, user }) {
      session.user = user; 
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };