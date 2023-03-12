import { Select } from "antd";
import { env } from "process";
import { useEffect, useState } from "react";
import { QualsTable } from "../components/QualsTable";
import { addCompetitionData } from "../utils/firebase";
import { getSelectedSeason } from "../utils/season-handler";

export type Team = {
    teamNumber: number
    station: string
    surrogate: boolean
}

export type Schedule = {
    field: string
    tournamentLevel: string
    description: string
    startTime: string
    matchNumber: number
    teams: Team[]
}

export type CompetitionSchedule = {
    Schedule: Schedule[]
}

export type Events = {
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

export type FRCEvents = {
    eventCount: number
    Events: Events[]
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
            const israelCompetitionsUrl = `/frcapi/v3.0/${seasonYear}/events?districtCode=ISR`;
            const worldChampionshipUrl = `/frcapi/v3.0/${seasonYear}/events?tournamentType=Championship`;
            const tournementScheduleUrl = `/frcapi/v3.0/${seasonYear}/schedule/ISDE1?tournamentLevel=qual`;
            
            const headers = new Headers();
            headers.append("If-Modified-Since", "");
            headers.set('Authorization', 'Basic ' + Buffer.from(env.REACT_APP_FRC_API_TOKEN!).toString('base64'));
            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
            } as RequestInit;

            const response = await (await fetch(israelCompetitionsUrl, requestOptions)).text()
            const data: FRCEvents = JSON.parse(response)
            const eventsfrc = data.Events
            const responseChamp = await (await fetch(worldChampionshipUrl, requestOptions)).text()
            const dataChamp: FRCEvents = JSON.parse(responseChamp)
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
                onChange={async (value) => {
                    await addCompetitionData(`${value}`, seasonYear)
                    setCurrentTournment(`${value}`)
                }}
                defaultValue={{ value: "default", label: "please choose a competition" }}
            >
                {frcEventsOptions}
            </Select>

            <QualsTable seasonYear={seasonYear} tournament={currentTournment}/>
        </div>
    );
};