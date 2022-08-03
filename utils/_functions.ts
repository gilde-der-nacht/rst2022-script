import { Entry } from "./_types.ts";
import { config as dotEnvConfig } from "https://deno.land/x/dinoenv@v1.1.0/mod.ts";

export function getDotEnvVariables(
  path = ".env",
): {
  USERNAME: string;
  PASSWORD: string;
  URL: string;
  TEST_ADDRESSES: string[];
} {
  dotEnvConfig({ path }); // remove redundant path option when https://github.com/crewdevio/dino_env/pull/2 gets merged/resolved
  const USERNAME = Deno.env.get("USERNAME");
  if (typeof USERNAME === "undefined") {
    throw new Error("Missing USERNAME");
  }
  const PASSWORD = Deno.env.get("PASSWORD");
  if (typeof PASSWORD === "undefined") {
    throw new Error("Missing PASSWORD");
  }
  const URL = Deno.env.get("URL");
  if (typeof URL === "undefined") {
    throw new Error("Missing URL");
  }
  const TEST_ADDRESSES = Deno.env.get("TEST_ADDRESSES");
  if (typeof TEST_ADDRESSES === "undefined") {
    throw new Error("Missing TEST_ADDRESSES");
  }
  return { USERNAME, PASSWORD, URL, TEST_ADDRESSES: TEST_ADDRESSES.split(",") };
}

export function filterTestsAndDuplicates(entries: Entry[]): Entry[] {
  const { TEST_ADDRESSES } = getDotEnvVariables();
  const map: { [_: string]: Entry } = {};
  entries
    .filter((entry) => typeof entry.privateBody.intro === "undefined")
    .filter((entry) => {
      return TEST_ADDRESSES.indexOf(entry.privateBody.email) === -1;
    })
    .forEach((entry) => {
      map[entry.privateBody.secret] = entry;
    });

  return Object.values(map)
    .filter((entry) => !entry.privateBody.name.includes("[DUPLIKAT]"));
}

export function hideMail(email: string): string {
  const start = email.substring(0, 2);
  return (start.padEnd(email.length, "*")).toLowerCase();
}

export function getCatering(int: number | undefined): [number, string] {
  switch (int) {
    case 0:
      return [0, "Ja, ich verpflege mich gerne vor Ort."];
    case 1:
      return [1, "Das weiss ich aktuell noch nicht."];
    case 2:
      return [2, "Nein, ich werde für meine Verpflegung selbst sorgen."];
    default:
      return [9, "Anmeldung noch nicht gestartet"];
  }
}

export function getWorkshops(
  ws1: boolean | undefined,
  ws2: boolean | undefined,
  ws3: boolean | undefined,
): number[] {
  const workshops: number[] = [];
  if (typeof ws1 !== "undefined" && ws1) {
    workshops.push(1);
  }
  if (typeof ws2 !== "undefined" && ws2) {
    workshops.push(2);
  }
  if (typeof ws3 !== "undefined" && ws3) {
    workshops.push(3);
  }
  return workshops;
}

export function getNumberOfPeople(
  privateBody: { companion1?: string; companion2?: string } = {
    companion1: "",
    companion2: "",
  },
): number {
  let counter = 1;
  if (privateBody?.companion1 && privateBody?.companion1?.trim().length > 0) {
    counter++;
  }
  if (privateBody?.companion2 && privateBody?.companion2?.trim().length > 0) {
    counter++;
  }
  return counter;
}

export function comesOnSaturday(privateBody: {
  timeSlotSaturday1?: boolean;
  timeSlotSaturday2?: boolean;
  timeSlotSaturday3?: boolean;
  timeSlotSaturday4?: boolean;
}): boolean {
  return (privateBody.timeSlotSaturday1 || privateBody.timeSlotSaturday2 ||
    privateBody.timeSlotSaturday3 || privateBody.timeSlotSaturday4) ?? false;
}

export function comesOnSunday(privateBody: {
  timeSlotSunday1?: boolean;
  timeSlotSunday2?: boolean;
  timeSlotSunday3?: boolean;
}): boolean {
  return (privateBody.timeSlotSunday1 || privateBody.timeSlotSunday2 ||
    privateBody.timeSlotSunday3) ?? false;
}

export function getInterests(privateBody: {
  crime?: boolean;
  fantasy?: boolean;
  horror?: boolean;
  modern?: boolean;
  scifi?: boolean;
}): string[] {
  return Object.entries({
    Crime: privateBody.crime ?? false,
    Fantasy: privateBody.fantasy ?? false,
    Horror: privateBody.horror ?? false,
    Modern: privateBody.modern ?? false,
    SciFi: privateBody.scifi ?? false,
  })
    .filter(([_, value]) => value)
    .map(([key, _]) => key);
}
