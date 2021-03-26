import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

// Storage
import { useSelector } from 'react-redux'
import store from '../storage/store';

// API
import { fetch_user, edit_user } from '../api'

// Router
import { useHistory } from 'react-router-dom';

export default function EditUser() {
    let history = useHistory();
    const session = useSelector(state => state.session);
    const [user, setUser] = useState({
        password: "",
        email: "",
        name: "",
    })

    useEffect(() => {
        fetchUser();
    }, [])

    async function fetchUser() {
        if (session) {
            let data = await fetch_user(session.user_id);
            data.password = "";
            if(data.error) {
                store.dispatch({type: "error/set", data: data.error});
            }
            else {
                let d1 = Object.assign({}, data.data);
                d1.password = "";
                d1.name = d1.name || "";
                if(!d1.name) {
                    store.dispatch({type: "error/set", data: "Complete the Registration By Getting A Name"});
                }
                setUser(d1);
            }
        }
    }

    function check_pass(password) {
        if (password.length < 8) {
            return "Password too short.";
        }
        return "";
    }

    function check_name(name) {
        if (!name) {
            return "Can't Be Empty"
        }
        else {
            return "";
        }
    }

    function check_email(email) {
        if (!email) {
            return "Can't Be Empty"
        }
        else {
            return "";
        }
    }

    function update(field, ev) {
        let u1 = Object.assign({}, user);
        u1[field] = ev.target.value;
        u1.pass_msg = check_pass(u1.password);
        u1.name_msg = check_name(u1.name);
        u1.email_msg = check_email(u1.email);
        setUser(u1);
    }

    async function onSubmit(ev) {
        ev.preventDefault();
        if (window.confirm("You will be logged out if the change is successfully processed. Are you sure? ")) {
            let result = await edit_user({ "id": session.user_id, "user": user });
            if (result.error) {
                store.dispatch({ type: "error/set", data: "Invalid Change" })
            }
            else {
                history.push("/")
                store.dispatch({ type: "session/clear" })
                store.dispatch({ type: "user/set", data: { email: user.email, name: user.name } });
                store.dispatch({ type: "success/set", data: "Account Succefully Updated, Try Log In!" });
            }
        }
    }

    if (session) {
        return (
            <div>
                <h1>User</h1>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" onChange={(ev) => update("email", ev)} value={user.email} />
                        <p>{user.email_msg}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" onChange={(ev) => update("name", ev)} value={user.name} />
                        <p>{user.name_msg}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>New/Old Password</Form.Label>
                        <Form.Control type="text" onChange={(ev) => update("password", ev)} value={user.password} />
                        <p>{user.pass_msg}</p>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={user.email_msg !== "" || user.pass_msg !== "" || user.name_msg !== ""}> Submit </Button>
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