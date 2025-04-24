import Selector from "./selector";
import { Season } from "@/types/database_types";


const fetchSeasons = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/seasons`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch seasons");
    }
    return res.json(); 
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return [];
  }
}; 

const Page = async  () => {
  let seasons: Season[] = [];
  
    try {
      seasons = await fetchSeasons();
    } catch (error) {
      console.error("Error fetching seasons:", error);
      return (
        <div className="w-3/4 h-3 mx-auto">
          <p className="text-center text-2xl">Failed to load games</p>
        </div>
      );
    }
  

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">Rouhijoiden ottelut</h1>

      <Selector seasons={seasons}/>
   
    </div>
  );
};

export default Page;
