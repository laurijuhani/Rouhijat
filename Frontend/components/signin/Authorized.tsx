"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Authorized = () => {
  const router = useRouter(); 
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      router.push('/');
    } else {
      router.push('/signin');
    }
  }, [router, searchParams]);

  return <p>Authorizing...</p>;
}; 

export default Authorized;