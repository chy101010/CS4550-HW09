import { Nav, Col, Row, Alert, Navbar, Button } from "react-bootstrap"
import { NavLink } from 'react-router-dom';

// Storage
import store from '../storage/store';

// Redux
import { useSelector } from 'react-redux'


function Link({ to, children }) {
    return (
        <Nav.Item>
            <NavLink to={to} exact className="nav-link"
                activeClassName="active">
                {children}
            </NavLink>
        </Nav.Item>
    );
}

export default function MyNav() {
    const error = useSelector(state => state.error);
    const success = useSelector(state => state.success);
    const session = useSelector(state => state.session);
    let error_row;
    let success_row;
    let user = "unknown";
    let logout_button;

    function logout(ev) {
        ev.preventDefault();
        store.dispatch({ type: 'session/clear' });
    }

    if (session) {
        user = session.name;
        logout_button = <Nav.Link onSelect={logout} href="/login">Log Out</Nav.Link>;
    }

    if (session) {
        user = session.name;
    }

    if (error) {
        error_row = (
            <Row>
                <Col>
                    <Alert variant="danger">{error}</Alert>
                </Col>
            </Row>
        );
    }

    if (success) {
        success_row = (
            <Row>
                <Col>
                    <Alert variant="success">{success}</Alert>
                </Col>
            </Row>
        );
    }

    return (
        <div>
            <Navbar bg="light">
                <Navbar.Brand>Events App</Navbar.Brand>
                <Nav className="mr-auto">
                    <Link to="/">Home</Link>
                    <Link to="/users">Profile</Link>
                    <Link to="/events/create">Create Event</Link>
                </Nav>
                <Nav>
                    <Navbar.Text> Signed in as: {user} </Navbar.Text>
                    {logout_button}
                </Nav>
            </Navbar>
            { error_row || success_row}
        </div>
    )
}