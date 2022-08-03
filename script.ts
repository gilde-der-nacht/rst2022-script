import {
  comesOnSaturday,
  comesOnSunday,
  filterTestsAndDuplicates,
  getCatering,
  getDotEnvVariables,
  getInterests,
  getNumberOfPeople,
  getWorkshops,
  hideMail,
} from "./utils/_functions.ts";
import type { CleanedData, Entry } from "./utils/_types.ts";

const { USERNAME, PASSWORD, URL } = getDotEnvVariables();

const headers = new Headers();
headers.set("Authorization", "Basic " + btoa(USERNAME + ":" + PASSWORD));

const response = await fetch(URL, { headers });
const data: Entry[] = await response.json();

const dataWithoutTestsAndDuplicates = filterTestsAndDuplicates(data);

const cleanedData: CleanedData[] = dataWithoutTestsAndDuplicates
  .map((entry) => {
    return {
      id: entry.identification,
      timestamp: entry.timestamp,
      name: entry.privateBody.name,
      email: hideMail(entry.privateBody.email),
      saved: entry.privateBody.atLeastOnceSaved ?? false,
      wantsToPlay: entry.privateBody.likeToPlay ?? false,
      interests: getInterests(entry.privateBody),
      wantsToGuide: entry.privateBody.likeToMaster ?? false,
      numberOfRounds: entry.privateBody.gameRounds?.length ?? 0,
      helpAtKioskInHours: entry.privateBody?.kioskDuration ?? 0,
      willAttendOnSaturday: comesOnSaturday(entry.privateBody),
      willAttendOnSunday: comesOnSunday(entry.privateBody),
      catering: getCatering(entry.privateBody.catering),
      workshops: getWorkshops(
        entry.privateBody.workshop1,
        entry.privateBody.workshop2,
        entry.privateBody.workshop3,
      ),
      people: getNumberOfPeople(entry.privateBody),
    };
  });

const aggr = {
  numberOfRegistrations: 0,
  totalAmountOfPeople: 0,
  saved: 0,
  wants: {
    toPlay: 0,
    toGuide: 0,
    toHelp: 0,
  },
  genres: {
    Crime: 0,
    Fantasy: 0,
    Horror: 0,
    Modern: 0,
    SciFi: 0,
  },
  catering: {
    "Ja, ich verpflege mich gerne vor Ort": 0,
    "Das weiss ich aktuell noch nicht": 0,
    "Nein, ich werde für meine Verpflegung selbst sorgen": 0,
    "Anmeldung noch nicht begonnen": 0,
  },
  gameRounds: 0,
  days: {
    saturday: 0,
    sunday: 0,
  },
  hoursOfHelp: 0,
  workshops: {
    "Offene Fragerunde": 0,
    "Warum spiele ich überhaupt Rollenspiele?": 0,
    "Spielerischer Weltenbau": 0,
  },
};

cleanedData.forEach(({
  saved,
  wantsToPlay,
  interests,
  wantsToGuide,
  numberOfRounds,
  helpAtKioskInHours,
  willAttendOnSaturday,
  willAttendOnSunday,
  catering,
  workshops,
  people,
}) => {
  aggr.numberOfRegistrations += 1;
  aggr.totalAmountOfPeople += people;
  if (saved) {
    aggr.saved += people;
  }
  if (wantsToPlay) {
    aggr.wants.toPlay += people;
  }
  if (wantsToGuide) {
    aggr.wants.toGuide += people;
  }
  if (helpAtKioskInHours > 0) {
    aggr.wants.toHelp += people;
    aggr.hoursOfHelp += helpAtKioskInHours * people;
  }
  if (interests.includes("Crime")) {
    aggr.genres.Crime += people;
  }
  if (interests.includes("Fantasy")) {
    aggr.genres.Fantasy += people;
  }
  if (interests.includes("Horror")) {
    aggr.genres.Horror += people;
  }
  if (interests.includes("Modern")) {
    aggr.genres.Modern += people;
  }
  if (interests.includes("SciFi")) {
    aggr.genres.SciFi += people;
  }
  if (catering[0] === 0) {
    aggr.catering["Ja, ich verpflege mich gerne vor Ort"] += people;
  }
  if (catering[0] === 1) {
    aggr.catering["Das weiss ich aktuell noch nicht"] += people;
  }
  if (catering[0] === 2) {
    aggr.catering["Nein, ich werde für meine Verpflegung selbst sorgen"] +=
      people;
  }
  if (catering[0] === 9) {
    aggr.catering["Anmeldung noch nicht begonnen"] += people;
  }
  if (workshops.includes(1)) {
    aggr.workshops["Offene Fragerunde"] += people;
  }
  if (workshops.includes(2)) {
    aggr.workshops["Warum spiele ich überhaupt Rollenspiele?"] += people;
  }
  if (workshops.includes(3)) {
    aggr.workshops["Spielerischer Weltenbau"] += people;
  }
  if (willAttendOnSaturday) {
    aggr.days.saturday += people;
  }
  if (willAttendOnSunday) {
    aggr.days.sunday += people;
  }
  aggr.gameRounds += numberOfRounds;
});

console.log(aggr);
