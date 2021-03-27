import { Row, Card, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux'

export default function ListEvents() {
    const events = useSelector(state => state.events);
    const session = useSelector(state => state.session);

    let events_row = [];
    for (let index = 0; index < events.length; index++) {
        const colors = ['dark', 'light']
        const color = colors[index % 2];
        const text = color === 'light' ? 'dark' : 'white';
        let edit_button = null;
        if(session.email === events[index].user.email) {
            edit_button = <Card.Link to={`/event/${events[index].id}/edit`}>Edit</Card.Link>;
        }
        events_row.push(
            <Card className="ml-2 mt-2" bg={color} text={text} key={events[index].id} style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{events[index].name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{events[index].date}</Card.Subtitle>
                    <Card.Text>{events[index].description}</Card.Text>
                    <Card.Link to={`/event/${events[index].id}`}>Show</Card.Link>
                    {edit_button}
                </Card.Body>
            </Card>
        )
    }

    if (events) {
        return (
            <Container>
                <Row>
                    <h1>Events</h1>
                </Row>
                <Row className="d-flex align-content-start flex-wrap offset-1">
                    {events_row}
                </Row>
            </Container>
        )
    }
    else {
        return (<p>Currently, you are particating in any events!</p>)
    }
}