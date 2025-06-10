"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from 'js-cookie';

const Authorized = () => {
  const router = useRouter(); 
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      Cookies.set('token', token, { secure: true, sameSite: 'strict', expires: 1 });
      router.push('/');
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return <p>Authorizing...</p>;
}; 

export default Authorized;