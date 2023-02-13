import { useEffect, useState } from "react";
import { resetSeason } from "../utils/season-handler";
import { Buffer } from 'buffer'

export const TimetableManager = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        const targetUrl = `http://localhost:3000/frcapi/v3.0/2023/events?districtCode=ISR`;
        const myHeaders = new Headers();
        myHeaders.append("If-Modified-Since", "");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        } as RequestInit;

        fetch(targetUrl, requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        console.log(events)
        resetSeason();
    }, []);

    return (
        <div>
            <h1>Timetable Manager</h1>
        </div>
    );
};