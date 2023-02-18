import { useEffect, useState } from "react";
import { resetSeason } from "../utils/season-handler";
import { Buffer } from 'buffer'
import { type } from "os";
import { Select } from "antd";
import { getDocumentRef, updateData } from "../utils/firebase";
import { QualsTable } from "../components/QualsTable";
type team = {
    teamNumber: number
    station: string
    surrogate: boolean
}
type Schedule = {
    field: string
    tournamentLevel: string
    description: string
    startTime: string
    matchNumber: number
    teams: team[]
}
type compSchedule = {
    Schedule: Schedule[]
}
type Events = {
    address: string
    allianceCount: string
    city: string
    code: string
    country: string
    dateEnd: string
    dateStart: string
    districtCode: string
    divisionCode: string
    name: string
    stateprov: string
    timezone: string
    type: string
    venue: string
    webcast: Array<any>
    website: string
    weekNumber: number
}
type frcEvents = {
    eventCount: number
    Events: Events[]
}
type JSONResponse = {
    data?: {
        pokemon: frcEvents
    }
    errors?: Array<{ message: string }>
}
function adddata(Events: Events[]) {
    const partialURL = 'http://localhost:3000/frcapi/v3.0/2022/schedule/'
    const myHeaders = new Headers();
    myHeaders.append("If-Modified-Since", "");
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    } as RequestInit;
    Events.forEach(async event => {
        const responseSchedule = await (await fetch(partialURL + event.code + "?tournamentLevel=qual", requestOptions)).text()
        const dataSchedule: compSchedule = JSON.parse(responseSchedule)
        let id = event.code
        dataSchedule.Schedule.forEach(async qual => {

            await updateData("seasons/2022/" + id + "/Qual" + qual.matchNumber, { 0: ["scouter0ccab1c1-3e6f-4cdb-9cae-73049cb73f7a", "alpha kenny", "body"], 1: ["scouter9ce40fb3-f6eb-4017-b719-94d29bf7838d", "Bennie ", "Factor"], 2: ["scouter9b12bba3-cf17-418a-9fa9-f04a3f16dbe2", "Arty ", "Fischel"], 3: ["scouter61e04732-8e87-488c-93cb-5aa51da18003", "Carole", "Singer"], 4: ["scouter602bf228-66b4-4e63-a14f-2083142719b6", "Ben ", "Dover"], 5: ["scouter145c6006-2f1e-4ef6-afb3-c0ed30dfc9a3", "a", "b"] })
        })
    })
    console.log("done!")
}

export const TimetableManager = () => {
    const [events, setEvents] = useState<Events[]>([]);
    const [currentTournment, setCurrentTournment] = useState("didnt choose")

    const frcEventsOptions = events.map((event) => {
        return (<option key={event.code} value={event.code}>{event.name}</option>)
    })
    useEffect(() => {
        async function getCompData() {
            const targetUrl = `http://localhost:3000/frcapi/v3.0/2022/events?districtCode=ISR`;
            const targetUrl2 = `http://localhost:3000/frcapi/v3.0/2022/events?tournamentType=Championship`
            const targetUrl3 = 'http://localhost:3000/frcapi/v3.0/2022/schedule/ISDE1?tournamentLevel=qual'

            const myHeaders = new Headers();
            myHeaders.append("If-Modified-Since", "");

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            } as RequestInit;
            const response = await (await fetch(targetUrl, requestOptions)).text()
            const data: frcEvents = JSON.parse(response)
            const eventsfrc = data.Events
            const responseChamp = await (await fetch(targetUrl2, requestOptions)).text()
            const dataChamp: frcEvents = JSON.parse(responseChamp)
            eventsfrc.push(dataChamp.Events[0])
            setEvents(eventsfrc)
            const responseSchedule = await (await fetch(targetUrl3, requestOptions)).text()
            const dataSchedule: compSchedule = JSON.parse(responseSchedule)
            console.log("started")
        }
        getCompData()
        resetSeason();
    }, []);

    return (
        <div>
            <h1>Timetable Manager</h1>
            <Select
                onChange={(value) => setCurrentTournment("/" + value)}
                defaultValue={{ value: "default", label: "please choose a competiotion" }}
            >
                {frcEventsOptions}

            </Select>
            {
                //scoutersubpath will be changed after we do the login page because then we will put the curren team number in the session storage
            }

            <QualsTable seasonPath="seasons/2022" tournmentsSubPath={currentTournment} scoutersSubPath="tbd" />
        </div>
    );
};