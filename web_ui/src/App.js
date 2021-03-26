import './App.scss';
import { Container} from 'react-bootstrap';

// components
import Register from './components/register'
import Login from './components/login'
import Home from './components/home'
import MyNav from './components/nav'
import NewEvent from './components/newEvent'
import EditEvent from './components/editEvent'
import Event from './components/event'
import EditUser from './components/editUser'
import EditComment from './components/editComment'

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
          <Route path="/user" exact>
            <EditUser />
          </Route>
          <Route path="/events/create" exact>
            <NewEvent />
          </Route>
          <Route path="/event/:id" component={Event} exact/> 
          <Route path="/event/:id/edit" component={EditEvent} exact/> 
          <Route path="/comment/:id/edit" component={EditComment} exact/> 
        </Switch>
      </Container>
    </div>
  );
}

export default App;
