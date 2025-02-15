import { useRouter } from 'next/navigation';

const useSignout = () => {
  const router = useRouter();

  const signout = () => {
    localStorage.removeItem('token');

    router.push('/');
  };

  return signout;
};

export default useSignout;