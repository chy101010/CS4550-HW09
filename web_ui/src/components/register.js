import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react';
import pick from 'lodash/pick';

// storage
import store from '../storage/store';

// Router
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

// APIS
import { create_user } from "../api";

function Register() {
    let history = useHistory();
    const [user, setUser] = useState({
        name: "", email: "", pass1: "", pass2: "",
    });

    // on success redirect to login, else display the error
    function onSubmit(ev) {
        ev.preventDefault();
        let data = pick(user, ['name', 'email', 'password']);
        create_user(data).then((data) => {
            if (data.error) {
                store.dispatch({type: "error/set", data: data.error});
            }
            else {
                store.dispatch({type: "success/set", data: `Hello ${user.name}, You have successfully registered, and now you can Log In!`});
                store.dispatch({type: "user/set", data: data.data});
                history.push("/login");
            }
        });
    }

    function check_pass(p1, p2) {
        if (p1 !== p2) {
            return "Passwords don't match.";
        }

        if (p1.length < 8) {
            return "Password too short.";
        }
        return "";
    }

    function check_email(email) {
        if (!email) {
            return "Can't Be Empty"
        }
        else {
            return "";
        }
    }

    function check_name(name) {
        if (!name) {
            return "Can't Be Empty"
        }
        else {
            return "";
        }
    }

    function update(field, ev) {
        let u1 = Object.assign({}, user);
        u1[field] = ev.target.value;
        u1.password = u1.pass1;
        u1.pass_msg = check_pass(u1.pass1, u1.pass2);
        u1.email_msg = check_email(u1.email);
        u1.name_msg = check_name(u1.name);
        setUser(u1);
        let action = {
            type: "error/clear"
        }
        store.dispatch(action);
    }

    return (
        <div>
            <h2>Register</h2>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" onChange={(ev) => update("name", ev)} value={user.name} />
                    <p>{user.name_msg}</p>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" onChange={(ev) => update("email", ev)} value={user.email} />
                    <p>{user.email_msg}</p>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={(ev) => update("pass1", ev)} value={user.pass1} />
                    <p>{user.pass_msg}</p>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" onChange={(ev) => update("pass2", ev)} value={user.pass2} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={user.pass_msg !== "" || user.name_msg !== "" || user.email_msg !== ""}> Submit </Button>
                <Link to="/login">Login</Link>
            </Form>
        </div>
    );
}

function state2props(_state) {
    return {};
}

export default connect(state2props)(Register);