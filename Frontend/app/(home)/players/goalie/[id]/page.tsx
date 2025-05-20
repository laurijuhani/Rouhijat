import BackButton from "@/components/basics/BackButton";
import GameCard from "@/components/home/GameCard";
import { Goalie } from "@/types/database_types";


type Params = Promise<{ id: string }>;

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const goalieId = parseInt(id);
  let goalie: Goalie | null = null;

  
  if (isNaN(goalieId)) {
    return (
      <div className="w-3/4 h-3 mx-auto">
        <p className="text-center text-2xl">Invalid Goalie ID</p>
      </div>
    );
  }
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/goalies/${goalieId}`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch player data");
    }

    goalie = await res.json();
  } catch (error) {
    console.error("Error fetching player data:", error);
  }

  if (!goalie) {
    return (
      <div className="w-3/4 h-3 mx-auto">
        <p className="text-center text-2xl">Goalie not found</p>
      </div>
    );
  }
  


  return (
    <div>
      <div className="mt-8 ml-4">
        <BackButton/>
      </div>
      <div className="flex flex-col items-center mt-8 mb-8">
        <h2 className="text-xl">{goalie.name}</h2>
        {goalie.nickname && (
          <p className="text-xl">Lempinimi: {goalie.nickname}</p>
        )}
        {goalie.number && (
          <p className="text-xl">Pelinumero: {goalie.number}</p>
        )}
      </div>

      <div className="flex flex-col items-center mt-8 mb-8">
        <h2 className="text-xl mb-4">Pelatut ottelut: {goalie.games.length}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {goalie.games.map((game) => (
            <GameCard game={game} key={game.id} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Page;