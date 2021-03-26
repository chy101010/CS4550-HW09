// Redux
import { useSelector } from 'react-redux'
// Components
import Login from './login'
import ListEvent from './listEvent'
// API
import { fetch_events } from "../api";
import store from '../storage/store';

export default function Home() {
    const session = useSelector(state => state.session);

    async function fetchEvents() {
        let data = await fetch_events();
        if(!data.error) {
            store.dispatch({type: "events/set", data: data.data});
        }
    }

    if(session) {
        fetchEvents();
        return <ListEvent />
    }
    else {
        return <Login />
    }
}