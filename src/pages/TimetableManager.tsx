import { Select } from "antd";
import { useEffect, useState } from "react";
import { QualsTable } from "../components/QualsTable";
import { updateData } from "../utils/firebase";
import { getSelectedSeason } from "../utils/season-handler";

type Team = {
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
    teams: Team[]
}

type CompetitionSchedule = {
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
        frcEvents: frcEvents
    }
    errors?: Array<{ message: string }>
}

function addData(Events: Events[], seasonYear: string) {
    const partialURL = `http://localhost:3000/frcapi/v3.0/${seasonYear}/schedule/`
    const myHeaders = new Headers();
    myHeaders.append("If-Modified-Since", "");
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    } as RequestInit;

    Events.forEach(async event => {
        const responseSchedule = await (await fetch(partialURL + event.code + "?tournamentLevel=qual", requestOptions)).text()
        const dataSchedule: CompetitionSchedule = JSON.parse(responseSchedule)
        let id = event.code
        dataSchedule.Schedule.forEach(async qual => {

            await updateData(`seasons/${seasonYear}/${id}/Qual${qual.matchNumber}`, {})
        })
    })
}

export const TimetableManager = () => {
    const { year: seasonYear, name: seasonName } = getSelectedSeason();
    const [events, setEvents] = useState<Events[]>([]);
    const [currentTournment, setCurrentTournment] = useState("didnt choose")

    const frcEventsOptions = events.map((event) => {
        return <option key={event.code} value={event.code}>{event.name}</option>
    })
    useEffect(() => {
        async function getCompetitionData() {
            const israelCompetitionsUrl = `http://localhost:3000/frcapi/v3.0/${seasonYear}/events?districtCode=ISR`;
            const worldChampionshipUrl = `http://localhost:3000/frcapi/v3.0/${seasonYear}/events?tournamentType=Championship`;
            const tournementScheduleUrl = `http://localhost:3000/frcapi/v3.0/${seasonYear}/schedule/ISDE1?tournamentLevel=qual`;

            const myHeaders = new Headers();
            myHeaders.append("If-Modified-Since", "");
            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            } as RequestInit;

            const response = await (await fetch(israelCompetitionsUrl, requestOptions)).text()
            const data: frcEvents = JSON.parse(response)
            const eventsfrc = data.Events
            const responseChamp = await (await fetch(worldChampionshipUrl, requestOptions)).text()
            const dataChamp: frcEvents = JSON.parse(responseChamp)
            eventsfrc.push(dataChamp.Events[0])
            setEvents(eventsfrc)
            const responseSchedule = await (await fetch(tournementScheduleUrl, requestOptions)).text()
            const dataSchedule: CompetitionSchedule = JSON.parse(responseSchedule)
        }
        getCompetitionData()
    }, []);

    return (
        <div>
            <h1>Timetable Manager</h1>
            <Select
                onChange={(value) => setCurrentTournment(value.value)}
                defaultValue={{ value: "default", label: "please choose a competition" }}
            >
                {frcEventsOptions}
            </Select>
            {
                //scoutersubpath will be changed after we do the login page because then we will put the curren team number in the session storage
            }

            <QualsTable seasonYear={seasonYear} tournament={currentTournment}/>
        </div>
    );
};