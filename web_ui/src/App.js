import './App.scss';
import { Container} from 'react-bootstrap';

// components
import Register from './components/register'
import Login from './components/login'
import Home from './components/home'
import MyNav from './components/nav'
import NewEvent from './components/newEvent'
import Event from './components/event'
import Users from './users'

// Routers
import { Switch, Route } from 'react-router-dom';
// APIS
import { restore_session } from "./storage/store" 

function App() {
  restore_session();
  return (
    <div>
      <Container>
        <MyNav />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/users" exact>
            <Users />
          </Route>
          <Route path="/events/create" exact>
            <NewEvent />
          </Route>
          <Route path="/events/:id" component={Event} exact/> 
        </Switch>
      </Container>
    </div>
  );
}

export default App;
