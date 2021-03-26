import store from './storage/store';


// Session 
function get_token() {
    let state = store.getState();
    return state?.session?.token;
}

// API Post w/o x-auth
export async function api_post(path, data) {
    let opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };
    let text = await fetch("http://hw09-api.citronk.com/api/v1" + path, opts);
    return await text.json();
}

// Login
export async function api_login(email, password) {
    let data = await api_post("/session", {email, password});
    return data;
}

// Create User
export async function create_user(user) {
    let data = await api_post("/users", {user});
    return data;
}

// PATCH
async function api_patch(data, path) {
    let token = get_token();
    let opts = {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json',
            'x-auth': token,
        },
        body: JSON.stringify(data),
    }
    let text = await fetch(`http://hw09-api.citronk.com/api/v1${path}`, opts)
    return text.json();
}

// Update a comment
export async function edit_comment(data) {
    let result = await api_patch(data, `/comments/${data.id}`);
    return result;
}


// Update Events
export async function edit_event(data) {
    let result = await api_patch(data, `/events/${data.id}`);
    return result;
}


// Update User
export async function edit_user(data) {
    let result = await api_patch(data, `/users/${data.id}`)
    return result;
}

// Update Invite
export async function edit_response(data) {
    let result = await api_patch(data, `/invites/${data.id}`);
    return result;
}

// Fetch
async function api_fetch(path) {
    let token = get_token();
    let opts = {
        method: 'GET',
        headers: {
            'x-auth': token,
        },
    };
    let text = await fetch(`http://hw09-api.citronk.com/api/v1${path}`, opts);
    return text.json();
}

// Fetch Comment
export async function fetch_comment(id) {
    let result = await api_fetch(`/comments/${id.id}`);
    return result;
}

// Fetch Event
export async function fetch_event(id) {
    let result = await api_fetch(`/events/${id}`);
    return result.data;
}


// Fetch participated Events
export async function fetch_events() {
    let result = await api_fetch(`/events`);
    return result;
}

// Fetch User
export async function fetch_user(user_id) {
    let result = await api_fetch(`/users/${user_id}`);
    return result;
}


// Delete
async function api_delete(path, data) {
    let token = get_token();
    let opts  = {
        method: "DELETE",
        headers: {
            'x-auth': token,
        },
        body: JSON.stringify(data)
    }
    let text = await fetch(`http://hw09-api.citronk.com/api/v1${path}`, opts);
    return text;
}

// Delete A Comment
export async function delete_comment(id) {
    let result = await api_delete(`/comments/${id.id}`, id);
    return result;
}

// Delete An Invite
export async function delete_invite(id) {
    let result = await api_delete(`/invites/${id.id}`, id);
    return result;
}

// Delete An Event
export async function delete_event(id) {
    let result = await api_delete(`/events/${id.id}`, id);
    return result;
}


// Create Event
export async function create_events(event) {
    let token = get_token();
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
        "http://hw09-api.citronk.com/api/v1/events", opts);
    return await text.json();
}

// Create Invitee
export async function create_invitee(invitee) {
    let token = get_token();
    let data = new FormData();
    data.append("event_id", invitee.id);
    data.append("email", invitee.email);
    let opts = {
        method: 'POST',
        body: data,
        headers: {
            'x-auth': token,
        }
    }
    let text = await fetch(
        "http://hw09-api.citronk.com/api/v1/invites", opts);
    return await text.json();
}

// Create a comment
export async function create_comment(comment) {
    let token = get_token();
    let data = {"comment": comment};
    let opts = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json',
            'x-auth': token,
        }
    }
    let text = await fetch(
        "http://hw09-api.citronk.com/api/v1/comments", opts);
    return await text.json();
}