import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const useSignout = () => {
  const signout = () => {
    Cookies.remove('token');

    redirect("/");
  };

  return signout;
};

export default useSignout;
