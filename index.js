const EXAMPLE_DATA = [
    { name: "Caraanchoa", email: "caraanchoa@gmail.com", age: 20 },
    { name: "Amancio", email: "amancio@gmail.com", age: 999 },
    { name: "Batracio", email: "batracio@gmail.com", age: 50 }
];

const URL = "http://localhost:8080";
const options = {
    mode: "cors",
    headers: {
        "Content-Type": "application/json"
    }
};

const api = {
    get: (path, id = "") => {
        return fetch(`${URL}/${path}/${id}`)
    },
    post: (path, payload) => {
        return fetch(`${URL}/${path}`, {
            ...options,
            method: "POST",
            body: JSON.stringify(payload)
        });
    },
    patch: (path, id = "", payload) => {
        return fetch(`${URL}/${path}/${id}`, {
            ...options,
            method: "POST",
            body: JSON.stringify(payload)
        });
    },
};

let state = {
    form: {
        email: "",
        name: "",
        age: ""
    },
    data: null
};

const createUser = () => {
    const payload = { ...state.form, age: Number(state.form.age) };

    api.post("users", payload)
        .then(response => response.json())
        .then(user => alert(`Usuario creado:\n${JSON.stringify(user)}`))
        .catch(error => console.error(error.toString()));
};

const renderModal = () => {
    const app = document.getElementById("app");
    const modal = document.createElement("div");

    modal.className = "modal";

    const setState = e => {
        const { name, value } = e.target;

        state.form[name] = value;
    };

    Object.keys(state.form).forEach(key => {
        const input = document.createElement("input");

        input.type = "text";
        input.placeholder = key;
        input.value = state.form[key];

        input.name = key;
        input.onchange = setState;

        modal.appendChild(input);
    });

    const button = document.createElement("button");

    button.innerText = "Enviar";
    button.onclick = createUser;

    modal.appendChild(button);

    app.appendChild(modal);
};

const decorateUser = (accum, { name, email, age }) => {
    accum.push({ name, email, age });

    return accum;
};

const sort = e => {
    const key = e.target.innerText;

    state.data = state.data.sort((a, b) => (a[key] > b[key]) - (a[key] < b[key]));

    render(state.data);
};

const render = data => {
    state.data = data;

    const app = document.getElementById("app");

    app.childNodes.forEach((node, index) => app.removeChild(app.childNodes[index]));

    const table = document.createElement("table");
    const tr = document.createElement("tr");

    const names = Object.keys(state.data[0]);

    tr.innerHTML = `<th onclick="sort(event)">${names.join(`</th><th onclick="sort(event)">`)}</th>`;

    table.appendChild(tr);

    state.data.forEach(user => {
        const tr = document.createElement("tr");

        tr.innerHTML = `<td>${Object.values(user).join("</td><td>")}</td>`;

        table.appendChild(tr);
    });

    const button = document.createElement("button");

    button.innerHTML = "Crear nuevo usuario";

    button.onclick = renderModal;

    table.appendChild(button);

    app.appendChild(table);
};

const init = () => {
    api.get("users")
        .then(response => response.json())
        .then(users => render(users.reduce(decorateUser, [])))
        .catch(error => {
            console.error(error.toString());

            render(EXAMPLE_DATA);
        });
};

window.onload = init;