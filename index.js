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
    }
};

const createUser = () => {
    const payload = { ...state.form, age: Number(state.form.age) };

    api.post("users", payload)
        .then(response => response.json())
        .then(user => alert(`Usuario creado:\n${JSON.stringify(user)}`));
}

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

window.onload = () => {
    api.get("users")
        .then(response => response.json())
        .then(users => {
            const app = document.getElementById("app");
            const table = document.createElement("table");
            const tr = document.createElement("tr");

            tr.innerHTML = `<th>Email</th><th>Name</th><th>Age</th>`;

            table.appendChild(tr);

            const data = users.reduce(decorateUser, []);

            data.forEach(user => {
                const tr = document.createElement("tr");

                tr.innerHTML = `<td>${user.email}</td><td>${user.name}</td><td>${user.age}</td>`;

                table.appendChild(tr);
            });

            const button = document.createElement("button");

            button.innerHTML = "Crear nuevo usuario";

            button.onclick = renderModal;

            table.appendChild(button);

            app.appendChild(table);
        });
};