import { Row, Form, Button } from "react-bootstrap";
import {useState, useEffect} from 'react'
// APIS
import { fetch_event } from "../api";

export default function Event({match}) {
    let eventId = match.params.id;
    const [event, setEvent] = useState({});

    useEffect(() => {
        fetchEvent();
    })

    async function fetchEvent() {
        let result = await fetch_event(eventId);
        setEvent(result);
    }

    return (
        <div>
            <Row>
                {/* <h1>{`Event: ${event.name}`}</h1>
                <ul>
                    <li>{`Event: ${event.id}`}</li>
                    <li>{`Host:Unkown`}</li>
                    <li>{`Description: ${event.description}`}</li>
                    <li>{`Responses Status: ${event.responses}`}</li>
                </ul> */}
            </Row>
        </div>
    )
}