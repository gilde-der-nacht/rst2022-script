export type GameRound = {
  active: boolean;
  duration: number;
  id: string;
  maxPlayerCount: number;
  minPlayerCount: number;
  name: string;
  repetition: number;
};

export type Entry = {
  identification: string;
  timestamp: string;
  privateBody: {
    intro?: Record<never, never>;
    name: string;
    email: string;
    secret: string;
    catering?: number;
    companion1?: string;
    companion2?: string;
    crime?: boolean;
    fantasy?: boolean;
    gameRounds?: GameRound[];
    horror?: boolean;
    kioskDuration?: number;
    likeToMaster?: boolean;
    likeToPlay?: boolean;
    modern?: boolean;
    scifi?: boolean;
    timeSlotSaturday1?: boolean;
    timeSlotSaturday2?: boolean;
    timeSlotSaturday3?: boolean;
    timeSlotSaturday4?: boolean;
    timeSlotSunday1?: boolean;
    timeSlotSunday2?: boolean;
    timeSlotSunday3?: boolean;
    atLeastOnceSaved?: boolean;
    workshop1?: boolean;
    workshop2?: boolean;
    workshop3?: boolean;
  };
};

export type CleanedGameRound = {
  name: string;
  duration: number;
  maxPlayerCount: number;
  minPlayerCount: number;
  repetition: [number, string];
};

export type CleanedData = {
  id: string;
  timestamp: string;
  email: string;
  name: string;
  saved: boolean;
  wantsToPlay: boolean;
  interests: string[];
  wantsToGuide: boolean;
  gameRounds: CleanedGameRound[];
  helpAtKioskInHours: number;
  willAttendOnSaturday: boolean;
  willAttendOnSunday: boolean;
  catering: [number, string];
  workshops: number[];
  people: number;
};
