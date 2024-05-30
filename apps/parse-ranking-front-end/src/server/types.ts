// TODO: add wcl API v2 documentation link
// Is there a way to infer this types from their schema?
// This types are the ones that we get when querying WCL API

export type WclGuildReportsResponse = {
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

export type WclRank = {
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

export type WclEncounterRanking = {
  bestAmount: number;
  medianPerformance: number;
  averagePerformance: number;
  totalKills: number;
  fastestKill: number;
  difficulty: number;
  metric: string;
  partition: number;
  zone: number;
  ranks: WclRank[];
};

export type WclCharacterWithRanks = {
  [key: string]: WclEncounterRanking;
} & { id: number; name: string; classID: number };

export type WclCharacterRankingsResponse = {
  characterData: {
    character: WclCharacterWithRanks;
  };
};
