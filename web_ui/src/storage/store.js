import { createStore, combineReducers } from 'redux';

// Session
function save_session(sess) {
  let session = Object.assign({}, sess, { time: Date.now() });
  localStorage.setItem("session", JSON.stringify(session));
}

export function restore_session() {
  let session = localStorage.getItem("session");
  if (!session) {
    return null;
  }
  session = JSON.parse(session);
  let age = Date.now() - session.time;
  let hours = 60 * 60 * 1000;
  if (age < 24 * hours) {
    let action = {
      type: "session/set",
      data: session
    }
    store.dispatch(action);
  }
  else {
    return null;
  }
}

function remove_session() {
  localStorage.removeItem("session");
}

function session(state = null, action) {
  switch (action.type) {
    case 'session/set':
      save_session(action.data);
      return action.data;
    case 'session/clear':
      remove_session();
      return null;
    default:
      return state;
  }
}

function user(state = {}, action) {
  switch (action.type) {
    case 'user/set':
      return action.data;
    default:
      return state;
  }
}

function error(state = null, action) {
  switch (action.type) {
    case 'session/set' || 'error/clear' || 'success/set':
      return null;
    case 'error/set':
      return action.data;
    default:
      return state;
  }
}

function success(state = null, action) {
  switch (action.type) {
    case "success/set":
      return action.data
    case "error/set":
      return null;
    default:
      return state;
  }
}

function events(state = [], action) {
  switch (action.type) {
    case 'events/set':
      return action.data;
    default:
      return state;
  }
}



function event(state = {
  comments: [],
  date: "",
  description: "",
  id: 0,
  invites: [],
  name: "",
  responses: "",
  user: {},
}, action) {
  switch (action.type) {
    case 'event/set':
      return action.data;
    default:
      return state;
  }
}


function root_reducer(state, action) {
  let reducer = combineReducers({
    session, error, user, success, events, event,
  });
  return reducer(state, action);
}



let store = createStore(root_reducer);
export default store;
