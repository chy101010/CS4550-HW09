import store from './storage/store';

// API Get
export async function api_get(path) {
    let text = await fetch("http://localhost:4000/api/v1" + path, {});
    let resp = await text.json();
    return resp.data;
}

// API Post
export async function api_post(path, data) {
    let opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };
    let text = await fetch("http://localhost:4000/api/v1" + path, opts);
    return await text.json();
}

// Login
export function api_login(email, password) {
    api_post("/session", {email, password}).then((data) => {
        if(data.session) {
            let action = {
                type: 'session/set',
                data: data.session,
            };
            store.dispatch(action);
        }
        else if(data.error) {
            let action = {
                type: 'error/set',
                data: data.error,
            };
            store.dispatch(action);
        }
    });
}

export async function create_user(user) {
    let data = await api_post("/users", {user});
    return data;
}

export async function create_events(event) {
    let state = store.getState();
    let token = state?.session?.token;
    let data = new FormData();
    data.append("name", event.name);
    data.append("date", event.date);
    data.append("description", event.description);
    let opts = {
        method: 'POST',
        body: data,
        headers: {
            'x-auth': token,
        }
    }
    let text = await fetch(
        "http://localhost:4000/api/v1/events", opts);
    return await text.json();
}

export async function fetch_event(id) {
    api_get(`/events/${id}`).then((data) => {
        console.log(data);
    });
}

// Get users
export function fetch_users() {
    api_get("/users").then((data) => store.dispatch({
        type: 'users/set',
        data: data,
    }));
}

export function load_defaults() {
    fetch_users();
}