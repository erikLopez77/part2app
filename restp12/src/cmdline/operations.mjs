import { input } from "@inquirer/prompts";
const baseUrl = "http://localhost:5000";

export const ops = {
    "Get All": () => sendRequest("GET", "/api/results"),
    //solicitar un nombre, que luego
    //se agrega a la cadena de consulta de la solicitud HTTP.
    "Get Name": async () => {
        const name = await input({ message: "Name?"});
        await sendRequest("GET", `/api/results?name=${name}`);
    },
    "Get ID": async () => {
        const id = await input({ message: "ID?"});
        await sendRequest("GET", `/api/results/${id}`);
    },
    "Store": async () => {
        const values = {
            name: await input({message: "Name?"}),
            age: await input({message: "Age?"}),
            years: await input({message: "Years?"})
        };
        await sendRequest("POST", "/api/results", values);
    },
    "Delete": async () => {
        const id = await input({ message: "ID?"});
        await sendRequest("DELETE", `/api/results/${id}`);
    },
    "Exit": () => process.exit()
}
const sendRequest = async (method, url, body, contentType) => {
    const response = await fetch(baseUrl + url, {
        method, headers: { "Content-Type": contentType ?? "application/json"},
        body: JSON.stringify(body)
    });
    if (response.status == 200) {
        const data = await response.json();
        (Array.isArray(data) ? data : [data])
        .forEach(elem => console.log(JSON.stringify(elem)));
    } else {
        console.log(response.status + " " + response.statusText);
    }
}