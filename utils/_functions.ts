import { Entry } from "./_types.ts";
import { TEST_ADDRESSES } from "./_vars.ts";

export function filterTestsAndDuplicates(entries: Entry[]): Entry[] {
    const map: { [_: string]: Entry } = {};
    entries
        .filter(entry => typeof entry.privateBody.intro === "undefined")
        .filter(entry => {
            return TEST_ADDRESSES.indexOf(entry.privateBody.email) === -1;
        })
        .forEach(entry => {
            map[entry.privateBody.secret] = entry;
        });

    return Object.values(map)
        .filter(entry => !entry.privateBody.name.includes("[DUPLIKAT]"));
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

export function getWorkshops(ws1: boolean | undefined, ws2: boolean | undefined, ws3: boolean | undefined): number[] {
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

export function getNumberOfPeople(privateBody: { companion1?: string, companion2?: string } = { companion1: "", companion2: "" }) {
    let counter = 1;
    if (privateBody?.companion1 && privateBody?.companion1?.trim().length > 0) { counter++ }
    if (privateBody?.companion2 && privateBody?.companion2?.trim().length > 0) { counter++ }
    return counter;
}

export function comesOnSaturday(privateBody: {
    timeSlotSaturday1?: boolean,
    timeSlotSaturday2?: boolean,
    timeSlotSaturday3?: boolean,
    timeSlotSaturday4?: boolean,
}) {
    return (privateBody.timeSlotSaturday1 || privateBody.timeSlotSaturday2 || privateBody.timeSlotSaturday3 || privateBody.timeSlotSaturday4) ?? false;
}

export function comesOnSunday(privateBody: {
    timeSlotSunday1?: boolean,
    timeSlotSunday2?: boolean,
    timeSlotSunday3?: boolean,
}) {
    return (privateBody.timeSlotSunday1 || privateBody.timeSlotSunday2 || privateBody.timeSlotSunday3) ?? false;
}

export function getInterests(privateBody: {
    crime?: boolean,
    fantasy?: boolean,
    horror?: boolean,
    modern?: boolean,
    scifi?: boolean,
}) {
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
