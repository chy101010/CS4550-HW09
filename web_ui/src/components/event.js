import { Row, Form, Button, Container, Col, Card } from "react-bootstrap";
import { useState, useEffect } from 'react'
// APIS
import { fetch_event, create_invitee, delete_event } from "../api";
import store from "../storage/store";
import { useHistory, Link } from 'react-router-dom';

// API
import { edit_response, delete_invite, create_comment, delete_comment } from '../api'

// Stora
import { useSelector } from 'react-redux'
export default function Event({ match }) {
    let eventId = match.params.id;
    let history = useHistory();
    let event = useSelector(state => state.event);
    let session = useSelector(state => state.session);
    const [invite, setInvite] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchEvent();
    }, [])


    async function fetchEvent() {
        let result = await fetch_event(eventId);
        store.dispatch({ type: "event/set", data: result });
    }

    async function createInvite(ev) {
        ev.preventDefault();
        let data = {
            id: event.id,
            email: invite,
        }
        let result = await create_invitee(data);
        if (result.error) {
            store.dispatch({ type: "error/set", data: result.error })
        }
        else {
            store.dispatch({ type: "success/set", data: "Successfully Invited! Unregisted User Has The Following Default PW: 123456789" })
            fetchEvent();
        }
    }

    async function createComment(ev) {
        ev.preventDefault();
        let data = {
            "body": comment,
            "event_id": event.id,
            "user_id": session.user_id
        }
        let result = await create_comment(data);
        if (result.error) {
            store.dispatch({ type: "error/set", data: result.error })
        }
        else {
            store.dispatch({ type: "success/set", data: "Successfully Commented!" })
            fetchEvent();
        }
    }

    async function deleteEvent(ev) {
        if (window.confirm("Are you sure?")) {
            let eventId = ev.target.getAttribute("data");
            let result = await delete_event({ id: eventId });
            if (result.ok) {
                store.dispatch({ type: "success/set", data: "Successfully Deleted!" })
                history.push("/");
            }
            else {
                store.dispatch({ type: "error/set", data: "Unsuccessful Delete!" })
            }
        }
    }

    function update_invite(ev) {
        setInvite(ev.target.value);
    }

    function update_comment(ev) {
        setComment(ev.target.value);
    }

    async function updateResponse(ev) {
        let invite_id = ev.currentTarget.getAttribute("data");
        let response = ev.currentTarget.value;
        let result = await edit_response({ id: invite_id, invite: { response: response } });
        if (!result.error) {
            store.dispatch({ type: "success/set", data: "Successfully Updated!" });
            fetchEvent();
        }
        else {
            store.dispatch({ type: "error/set", data: result.error });
        }
    }

    async function deleteInvite(ev) {
        let invite_id = ev.currentTarget.getAttribute("data");
        let result = await delete_invite({ id: invite_id });
        if (!result.error) {
            store.dispatch({ type: "success/set", data: `Successfully Deleted Invite: ${invite_id}` });
            fetchEvent();
        }
        else {
            store.dispatch({ type: "error/set", data: result.error });
        }
    }

    async function deleteComment(ev) {
        let comment_id = ev.currentTarget.getAttribute("data");
        let result = await delete_comment({ id: comment_id });
        if (!result.error) {
            store.dispatch({ type: "success/set", data: `Successfully Deleted Comment: ${comment_id}` });
            fetchEvent();
        }
        else {
            store.dispatch({ type: "error/set", data: result.error });
        }
    }


    let invites_cards = [];
    if (event.invites) {
        for (let index = 0; index < event.invites.length; index++) {
            if (!event.invites[index].user.name) {
                event.invites[index].name = "@Unregistered"
            }
            let select_bar = null;
            let delete_button = null;
            if (session.email === event.invites[index].user.email) {
                select_bar = (
                    <select onChange={updateResponse} data={event.invites[index].id}>
                        <option value="yes">yes</option>
                        <option value="no">no</option>
                        <option value="maybe">maybe</option>
                        <option value="unresponded">unresponded</option>
                    </select>
                )
            }
            if (session.email === event.user.email) {
                delete_button = (<button type="button" className="btn-link btn-anchor" data={event.invites[index].id} onClick={deleteInvite}>Delete</button>)
            }
            invites_cards.push(
                <Card key={event.invites[index].id} className="ml-2" style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Invitee Id: {event.invites[index].id}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{event.invites[index].name}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">@{event.invites[index].user.email}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">@{event.invites[index].response}</Card.Subtitle>
                        {select_bar}
                        {delete_button}
                    </Card.Body>
                </Card>
            )
        }
    }

    let comments_row = [];
    if (event.comments) {
        for (let index = 0; index < event.comments.length; index++) {            
            let delete_button = null;
            let edit_link = null;
            if(event.comments[index].user.email === session.email || event.user.email === session.email) {
                edit_link = <Link className="mr-1" to={`/comment/${event.comments[index].id}/edit`}>Edit</Link>;
                delete_button = <button type="button" className="ml-1 btn-link btn-anchor" data={event.comments[index].id} onClick={deleteComment}>Delete</button>;
            }
            comments_row.push(
                <div key={event.comments[index].id} className="float-start p-1 mt-1" style={{ width: '100%' }}>
                    <div className="float-start border ms-1 overflow-auto text-break" style={{ width: "100%", height: "100px" }}>
                        <span>User: <strong>{event.comments[index].user.name}</strong></span>
                        <p className="ml-4 mt-2">
                            {event.comments[index].body}
                        </p>
                        <div className="ml-1">
                            {edit_link}
                            {delete_button}
                        </div>
                    </div>
                </div>
            )
        }
    }

    let edit_link = null;
    let delete_button = null;
    let invite_form = null;
    if (session.email === event.user.email) {
        edit_link = <Link className="mr-1" to={`/event/${event.id}/edit`}>Edit</Link>;
        delete_button = <button type="button" className="ml-1 btn-link btn-anchor" data={event.id} onClick={deleteEvent}> Delete</button>
        invite_form = (
            <Form onSubmit={createInvite}>
                <Form.Group>
                    <Form.Label>Invitee's Email</Form.Label>
                    <Form.Control type="text" onChange={(ev) => update_invite(ev)} value={invite} />
                    <Button variant="primary" type="submit" disabled={invite === ""}> Submit </Button>
                </Form.Group>
            </Form>
        )
    }


    return (
        <Container className="mt-3">
            <Row>
                <h1>{`Event: ${event.name}`}</h1>
            </Row>
            <Row>
                <Col>
                    <ul>
                        <li>{`Event Id: ${event.id}`}</li>
                        <li>{`Host Name: ${event.user.name}`}</li>
                        <li>{`Host Email: ${event.user.email}`}</li>
                        <li>{`Description: ${event.description}`}</li>
                        <li>{`Responses Status: ${event.responses}`}</li>
                        <li>{`Invite Link: http://localhost:3000/event/${event.id}`}</li>
                        {edit_link}
                        {delete_button}
                    </ul>
                </Col>
                <Col>
                    {invite_form}
                </Col>
            </Row>
            <Row className="offset-1">
                {invites_cards}
            </Row>
            <Row className="mt-3" style={{ height: '200px' }}>
                <Form onSubmit={createComment} style={{ width: '100%', height: '100%' }}>
                    <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control as="textarea" rows={4} onChange={(ev) => update_comment(ev)} value={comment} />
                        <Button variant="primary" type="submit" disabled={comment === ""}> Submit </Button>
                    </Form.Group>
                </Form>
            </Row>
            <Row className="offeset-1">
                {comments_row}
            </Row>
        </Container>
    )
}