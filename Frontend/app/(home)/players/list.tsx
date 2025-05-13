import { Label } from "@/components/ui/label";
import { BaseInfo } from "@/types/database_types";
import Link from "next/link";



const List = ({ players, isGoalie }: { players: BaseInfo[], isGoalie: boolean }) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 p-2">
        <Label className="font-bold">Numero</Label>
        <Label className="font-bold">Nimi</Label>
        <Label className="font-bold">Lempinimi</Label>
      </div>
      {players.map((player) => (
        <div key={player.id} className="grid grid-cols-3 gap-4 p-2 border-gray-300 border-b">
          <div>{player.number}</div>
          <Link href={`/players/${isGoalie ? "goalie/" : ""}${player.id}`} className="hover:text-accent">
            <div>{player.name}</div>
          </Link>
          <div>{player.nickname}</div>
        </div>
      ))}
      
    </div>
  ); 
}; 

export default List; 