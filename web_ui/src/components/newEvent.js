import { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import pick from 'lodash/pick';

// Storage
import { useSelector } from 'react-redux'

// Router
import { useHistory } from 'react-router-dom';

// Date Picker
import flatpickr from 'flatpickr'

// Storage
import store from '../storage/store';

// APIS
import { create_events } from '../api'

export default function NewEvent() {
    let history = useHistory();
    const session = useSelector(state => state.session);
    const [event, setEvent] = useState({
        name: "",
        description: "",
        date: "",
    })
    
    async function onSubmit(ev) {
        ev.preventDefault();
        let data = pick(event, ['name', 'description', 'date']);
        create_events(data).then((data) => {
            if(data.error) {
                let action = {
                    type: "error/set",
                    data: data.error
                }
                store.dispatch(action);
            }else {
                let action = {
                    type: "success/set",
                    data: `Event: "${event.name}" has been successfully created!`
                }
                store.dispatch(action);
                history.push(`/event/${data.data.id}`);
            }
        })
    }

    function check_name(name) {
        if(!name) {
            return "Can't Be Empty";
        }
        else {
            return "";
        }
    }

    function check_date(date) {
        if(!date) {
            return "Can't Be Empty";
        }
        else {
            return "";
        }
    }

    flatpickr('.date', 
    {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        onChange: function(_selectedDates, dateStr, _instance) {
            let e1 = Object.assign({}, event);
            e1["date"] = dateStr;
            e1.date_msg = check_date(e1.date);
            setEvent(e1);
        }
    });

    function update(field, ev) {
        let e1 = Object.assign({}, event);
        e1[field] = ev.target.value;
        e1.name_msg = check_name(e1.name);
        setEvent(e1);
    }

    if(session) {
        return(
            <div>
                <h2>New Event</h2>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" onChange={(ev) => update("name", ev)} value={event.name} />
                        <p>{event.name_msg}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} type="text" onChange={(ev) => update("description", ev)} value={event.description} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Time</Form.Label>
                        <Form.Control type="date" className="date" onChange={(ev) => update("date", ev)} value={event.date}/>
                        <p>{event.date_msg}</p>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={event.name_msg !== "" || event.date_msg !== ""}> Submit </Button>
                </Form>
            </div>
        )
    }
    else {
        let action = {
            type: "error/set",
            data: "Required Login! Go to Home!"
        }
        store.dispatch(action);
        return <div></div>
    }
}