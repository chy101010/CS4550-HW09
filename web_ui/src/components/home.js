// Redux
import { useSelector } from 'react-redux'

// Components
import Login from './login'

export default function Home() {
    const session = useSelector(state => state.session);
    if(session) {
        return <h1>Events</h1>
    }
    else {
        return <Login />
    }
}