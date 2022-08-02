import { USERNAME, PASSWORD, URL } from "./_vars.ts";

const headers = new Headers();
headers.set('Authorization', 'Basic ' + btoa(USERNAME + ":" + PASSWORD));

const response = await fetch(URL, { headers });

console.log({ response });
