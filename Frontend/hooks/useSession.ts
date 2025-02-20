import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  exp: number;
  iat: number;
  role: 'user' | 'admin' | 'owner';
}

interface Session {
  user: User | null;
}

const useSession = (): Session => {
  const [user] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedToken = JSON.parse(jsonPayload);
        
        return decodedToken.item;
      }
    }
    return null;
  });

  useEffect(() => {
    // This effect is just to ensure the component re-renders if needed
    // when the token changes in local storage
  }, []);

  return { user };
}

export default useSession;