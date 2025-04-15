"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Game } from "@/types/database_types";
import GameInfo from "./gameInfo";

type Filter = "all" | "upcoming" | "past";

interface Props {
  games: Game[];
}

export default function Tab({ games }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  useEffect(() => {
    const filtered = games.filter((game) => {
      if (filter === "all") {
        return game;
      } else if (filter === "upcoming") {
        return new Date(game.gameDate) > new Date();
      } else if (filter === "past") {
        return new Date(game.gameDate) < new Date();
      }
    });
    setFilteredGames(filtered);
  }, [filter, games]);


  return (
    <Tabs defaultValue="tab-1" className="items-center mt-3">
      <TabsList className="gap-1 bg-transparent">
        <TabsTrigger
          value="tab-1"
          onClick={() => setFilter("all")}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
        >
          Kaikki
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          onClick={() => setFilter("upcoming")}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
        >
          Tulevat
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          onClick={() => setFilter("past")}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
        >
          Menneet
        </TabsTrigger>
      </TabsList>


      <div className="mt-4">
        {filteredGames.map((game) => (
          <GameInfo game={game} key={game.id}/>
        ))}
      </div>
    </Tabs>
  );
}
