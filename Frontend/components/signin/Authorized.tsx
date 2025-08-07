"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from 'js-cookie';

const Authorized = () => {
  const router = useRouter(); 
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      router.push('/');
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return <p>Authorizing...</p>;
}; 

export default Authorized;