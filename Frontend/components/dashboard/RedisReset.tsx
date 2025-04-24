'use client';
import Fetch from "@/utils/fetch";
import { Button } from "../ui/button";
import { useToast } from "@/context/ToastContext";


const RedisReset = () => {
  const { showToast } = useToast();
  const handleReset = async () => {
    if (window.confirm("Oletko varma, että haluat nollata Redis tietokannan?")) {
      try {
        await Fetch.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/users/resetredis", {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        });
        
        showToast('success', 'Redis tietokanta nollattu', '');
      } catch (error) {
        showToast('error', 'Redis tietokannan nollaus epäonnistui', 'Yritä uudelleen');
        console.error("Error resetting Redis database:", error);
      }
    }
  };

  return (
    <Button
      onClick={handleReset}
      variant="outline"
    >
      Resetoi Redis
    </Button>
  );
};

export default RedisReset;
