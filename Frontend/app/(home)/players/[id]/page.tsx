import BackButton from "@/components/basics/BackButton";
import { PlayerStats } from "@/types/database_types";


type Params = Promise<{ id: string }>;

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const playerId = parseInt(id);
  let player: PlayerStats | null = null;

  
  if (isNaN(playerId)) {
    return (
      <div className="w-3/4 h-3 mx-auto">
        <p className="text-center text-2xl">Invalid player ID</p>
      </div>
    );
  }
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/players/${playerId}`, {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE || '600') },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch player data");
    }

    player = await res.json();
  } catch (error) {
    console.error("Error fetching player data:", error);
  }

  if (!player) {
    return (
      <div className="w-3/4 h-3 mx-auto">
        <p className="text-center text-2xl">Player not found</p>
      </div>
    );
  }
  


  return (
    <div>
      <div className="mt-8 ml-4">
        <BackButton/>
      </div>
      <div className="flex flex-col items-center mt-8 mb-8">
        <h2 className="text-xl">{player.name}</h2>
        {player.nickname && (
          <p className="text-xl">Lempinimi: {player.nickname}</p>
        )}
        <p className="text-xl">Pelinumero: {player.number}</p>
      </div>

      <div className="flex flex-col items-center mt-8 mb-8">
        <h2 className="text-xl mb-4">Tilastot</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {player.seasons.map((season) => (
            <div
              key={season.seasonName}
              className="border p-4 rounded-lg shadow-md w-full"
            >
              <h3 className="text-lg font-bold">{season.seasonName}</h3>
              <p>Ottelut: {season.games}</p>
              <p>Maalit: {season.points.goals}</p>
              <p>Syötöt: {season.points.assists}</p>
              <p>+/-: {season.points.pm}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Page;