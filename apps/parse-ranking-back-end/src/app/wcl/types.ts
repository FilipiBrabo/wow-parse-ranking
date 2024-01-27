export type GuildReportsResponse = {
  guildData: {
    guild: {
      name: string;
      attendance: {
        data: {
          startTime: number;
          code: string;
          players: {
            name: string;
            type: string;
          }[];
        }[];
      };
    };
  };
};
export type Rank = {
  lockedIn: boolean;
  rankPercent: number;
  historicalPercent: number;
  todayPercent: number;
  rankTotalParses: number;
  historicalTotalParses: number;
  todayTotalParses: number;
  guild: {
    id?: number | null;
    name?: string | null;
    faction?: number | null;
  };
  report: {
    code: string;
    startTime: number;
    fightID: number;
  };
  duration: number;
  startTime: number;
  amount: number;
  bracketData: number;
  spec: string;
  bestSpec: string;
  class: number;
  faction: number;
};

export type EncounterRanking = {
  bestAmount: number;
  medianPerformance: number;
  averagePerformance: number;
  totalKills: number;
  fastestKill: number;
  difficulty: number;
  metric: string;
  partition: number;
  zone: number;
  ranks: Rank[];
};

export type CharacterRankingsResponse = {
  characterData: {
    character: {
      //TODO: how to include other properties (name, id, classId)
      [key: string]: EncounterRanking;
    };
  };
};
