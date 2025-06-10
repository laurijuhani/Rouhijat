"use client";
import Fetch from "@/utils/fetch";
import { Button } from "../ui/button";
import { useToast } from "@/context/ToastContext";
import Cookies from "js-cookie";

const ManualFetch = () => {
  const { showToast } = useToast();
  const handleFetch = async () => {
    if (window.confirm("Oletko varma, että haluat hakea uudet tiedot?")) {
      try {
        await Fetch.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/posts/fetch", {}, {
          Authorization: `Bearer ${Cookies.get('token')}`,
        });

        showToast('success', 'Tiedot haettu onnistuneesti', '');
      } catch (error) {
        showToast('error', 'Tiedon haku epäonnistui', 'Yritä uudelleen');
        console.error("Error fetching data:", error);
      }
    }
  };
  return (
    <Button
      onClick={handleFetch}
      variant="outline"
    >
      Hae uudet IG tiedot
    </Button>
  );
};

export default ManualFetch;
