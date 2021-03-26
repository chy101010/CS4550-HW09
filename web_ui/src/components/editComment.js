import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router";

// APIS
import { edit_comment, fetch_comment } from '../api'
import store from "../storage/store";

export default function EditComment({ match }) {
    let history = useHistory();
    let commentId = match.params.id;
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchComment();
    }, [])

    async function fetchComment() {
        let result = await fetch_comment({ id: commentId });
        if(result.error) {
            store.dispatch({type: "error/set", data: "Not Authorized!"});
            history.push("/");
        }
        else {
            setComment(result.data.body);
        }
    }

    function update(ev) {
        setComment(ev.target.value);
    }

    async function onSubmit(ev) {
        ev.preventDefault();
        let result = await edit_comment({id: commentId, comment: {body: comment}});
        if(result.error) {
            store.dispatch({type: "error/set", data: result.error});
        }
        else {
            store.dispatch({type: "success/set", data: `Successully Updated Comment: ${commentId}`});
            history.push(`/event/${result.data.event.id}`)
        }
    }

    return (
        <div>
            <h1>Edit Comment</h1>
            <Form onSubmit={onSubmit}>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" onChange={(ev) => update(ev)} value={comment} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={comment === ""}> Submit </Button>
            </Form>
        </div>
    )
}