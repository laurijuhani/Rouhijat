import { Game, PlayerPointsData } from "@/types/database_types";

const checkGamesEqual = (a: Game, b: Game): boolean => {
  if (a.id !== b.id) {
    return false;
  }

  if (a.homeTeam !== b.homeTeam) {
    return false;
  }

  if (a.awayTeam !== b.awayTeam) {
    return false;
  }

  if (a.homeScore !== b.homeScore) {
    return false;
  }

  if (a.awayScore !== b.awayScore) {
    return false;
  }

  if (a.gameDate !== b.gameDate) {
    return false;
  }

  if (a.seasonId !== b.seasonId) {
    return false;
  }

  return true;
};


const modifiedPoints = (original: PlayerPointsData[], newPoints: {[key: string]: [number, number, number]}): PlayerPointsData[] => {
  const returnArray: PlayerPointsData[] = [];
    Object.entries(newPoints).forEach(([playerId, points]) => {
      const originalPoint = original.find((point) => point.playerId === parseInt(playerId));
      if (!originalPoint || points[0] !== originalPoint.goals || points[1] !== originalPoint.assists || points[2] !== originalPoint.pm) {
        returnArray.push({
          playerId: parseInt(playerId),
          goals: points[0],
          assists: points[1],
          pm: points[2],
        });
      }
    });

    // Check for player IDs in original that are not in newPoints
    original.forEach((originalPoint) => {
      if (!newPoints[originalPoint.playerId]) {
        returnArray.push({
          playerId: originalPoint.playerId,
          goals: -1, // Indicate that the player was not in the game
          assists: 0,
          pm: 0,
        });
      }
    });

    return returnArray;
}; 


export { checkGamesEqual, modifiedPoints };