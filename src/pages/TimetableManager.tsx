import { useEffect, useState } from "react";
import { resetSeason } from "../utils/season-handler";
import { Buffer } from 'buffer'
import { type } from "os";
import { Select } from "antd";
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


export const TimetableManager = () => {
    const [events, setEvents] = useState<Events[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const frcEventsOptions = events.map((event) => {
        return (<option key={event.code} value={event.code}>{event.name}</option>)
    })
    useEffect(() => {
        setLoading(true);
        setError(null);
        async function getCompData() {
            const targetUrl = `http://localhost:3000/frcapi/v3.0/2023/events?districtCode=ISR`;
            const targetUrl2 = `http://localhost:3000/frcapi/v3.0/2023/events?tournamentType=Championship`
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
        }
        getCompData()
        resetSeason();
    }, []);

    return (
        <div>
            <h1 onClick={() => {
                console.log(events)
                console.log(events.length)
            }}>Timetable Manager</h1>
            {/* <p>{events[0].name}</p> */}
            <Select

                defaultValue={{ value: events[0].code, label: events[0].name }}
            >
                {frcEventsOptions}

            </Select>
        </div>
    );
};