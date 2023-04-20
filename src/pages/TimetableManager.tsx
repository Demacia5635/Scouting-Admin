import { Select, Space } from "antd";
import { useEffect, useState } from "react";
import { QualsTable } from "../components/QualsTable";
import { addCompetitionData, addCompetitionDataPlayOff, addCompetitionDataPractice } from "../utils/firebase";
import { getSelectedSeason } from "../utils/season-handler";
import { Buffer } from 'buffer';


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
    const [chosenTournmentLevel, setChosenTournmentLevel] = useState("practices")
    const frcEventsOptions = events.map((event) => {
        return <option key={event.code} value={event.code}>{event.name}</option>
    })
    useEffect(() => {
        async function getCompetitionData() {
            const israelCompetitionsUrl = `/frcapi/v3.0/${seasonYear}/events?districtCode=ISR`;
            const worldChampionshipUrl = `/frcapi/v3.0/${seasonYear}/events?tournamentType=ChampionshipDivision`;
            const tournementScheduleUrl = `/frcapi/v3.0/${seasonYear}/schedule/ISDE1?tournamentLevel=qual`;

            const headers = new Headers();
            headers.append("If-Modified-Since", "");
            console.log(process.env.REACT_APP_FRC_API_TOKEN)
            headers.set('Authorization', 'Basic ' + Buffer.from(process.env.REACT_APP_FRC_API_TOKEN!).toString('base64'));
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
            dataChamp.Events.forEach((event) => {
                eventsfrc.push(event)
            })
            setEvents(eventsfrc)
            const responseSchedule = await (await fetch(tournementScheduleUrl, requestOptions)).text()
            const dataSchedule: CompetitionSchedule = JSON.parse(responseSchedule)
        }
        getCompetitionData()
    }, []);

    return (
        <div>
            <h1>Timetable Manager</h1>
            <Space>
                <Select
                    onChange={async (value) => {
                        await addCompetitionData(`${value}`, seasonYear)
                        await addCompetitionDataPlayOff(`${value}`, seasonYear)
                        await addCompetitionDataPractice(`${value}`, seasonYear)
                        setCurrentTournment(`${value}`)
                    }}
                    defaultValue={{ value: "default", label: "please choose a competition" }}
                >
                    {frcEventsOptions}
                </Select>
                <Select
                    onChange={(value) => {
                        setChosenTournmentLevel("" + value)
                    }}
                    defaultValue={{ value: "Practices", label: "practices" }}
                >
                    <option key={"Practices"}>Practices</option>
                    <option key={"Quals"}>Quals</option>
                    <option key={"Playoffs"}>Playoffs</option>
                </Select>
            </Space>

            <QualsTable seasonYear={seasonYear} tournament={currentTournment} Tournmentlvl={chosenTournmentLevel} />
        </div>
    );
};