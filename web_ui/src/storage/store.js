import { createStore, combineReducers } from 'redux';

function users(state = [], action) {
    switch (action.type) {
    case 'users/set':
        return action.data;
    default:
        return state;
    }
}

function user_form(state = {}, action) {
    switch (action.type) {
    case 'user_form/set':
        return action.data;
    default:
        return state
    }
}

// Session
function save_session(sess) {
  let session = Object.assign({}, sess, {time: Date.now()});
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

function session(state = null, action) {
    switch (action.type) {
      case 'session/set':
        save_session(action.data);
        return action.data;
      case 'session/clear':
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


function root_reducer(state, action) {
    let reducer = combineReducers({
        users, user_form, session, error, user, success
    });
    return reducer(state, action);
}

let store = createStore(root_reducer);
export default store;