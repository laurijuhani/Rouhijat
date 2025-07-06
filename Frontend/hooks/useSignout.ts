import Cookies from "js-cookie";

const useSignout = () => {
  const signout = () => {
    Cookies.remove('token'); 

    window.location.href = '/';
  };

  return signout;
};

export default useSignout;