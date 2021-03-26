import { useState, useEffect } from 'react';
import { Form, Button } from "react-bootstrap";
import pick from 'lodash/pick';
import flatpickr from 'flatpickr'
import { useHistory } from 'react-router-dom';
import store from '../storage/store';

// APIS
import { edit_event, fetch_event } from '../api'

export default function EditEvent({ match }) {
    let history = useHistory();
    let eventId = match.params.id;
    const [event, setEvent] = useState({
        name: "",
        description: "",
        date: "",
    });

    useEffect(() => {
        fetchEvent();
    }, [])

    async function fetchEvent() {
        let result = await fetch_event(eventId);
        let data = pick(result, ['name', 'description', 'date']);
        if(data.error) {
            store.dispatch({type:"error/set", data: data.error});
            history.push("/");
        }
        else {
            setEvent(data);
        }
    }

    async function onSubmit(ev) {
        ev.preventDefault()
        let data =  pick(event, ['name', 'description', 'date']);
        let result = await edit_event({"id": eventId, "event": data});
        if(result.error) {
            store.dispatch({type: "error/set", data: result.error})
        }
        else {
            store.dispatch({type: "success/set", data: "Successfully Updated!"})
            history.push(`/event/${result.data.id}`);
        }
    }

    flatpickr('.date', 
    {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        onChange: function(_selectedDates, dateStr, _instance) {
            let e1 = Object.assign({}, event);
            e1["date"] = dateStr;
            setEvent(e1);
        }
    });

    function update(field, ev) {
        let e1 = Object.assign({}, event);
        e1[field] = ev.target.value;
        setEvent(e1);
    }

    return (
        <div>
            <h2>Edit Event</h2>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" onChange={(ev) => update("name", ev)} value={event.name} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} type="text" onChange={(ev) => update("description", ev)} value={event.description} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Time</Form.Label>
                    <Form.Control type="text" className="date" onChange={(ev) => update("time", ev)} value={event.date} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={event.name === "" || event.date === ""}> Submit </Button>
            </Form>
        </div>
    )
}
