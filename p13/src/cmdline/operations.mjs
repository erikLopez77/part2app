import { input } from "@inquirer/prompts";
const baseUrl = "http://localhost:5000";
let bearer_token;
export const ops = {
    "Sign In": async () => {
        const creds = {
            username: await input({ message: "Username?" }),
            password: await input({ message: "Password?" }),
        };
        const response = await sendRequest("POST", "/api/signin", creds);
        if (response.success == true) {
            //el token recibido al iniciar sesion se asigna a bearer_token
            bearer_token = response.token;
        };
    },
    "Sign Out": () => { bearer_token = undefined },
    "Get All": () => sendRequest("GET", "/api/results"),
    //solicitar un nombre, que luego
    //se agrega a la cadena de consulta de la solicitud HTTP.
    "Get Name": async () => {
        const name = await input({ message: "Name?" });
        await sendRequest("GET", `/api/results?name=${name}`);
    },
    "Get ID": async () => {
        const id = await input({ message: "ID?" });
        await sendRequest("GET", `/api/results/${id}`);
    },
    "Store": async () => {
        const values = {
            name: await input({ message: "Name?" }),
            age: await input({ message: "Age?" }),
            years: await input({ message: "Years?" })
        };
        await sendRequest("POST", "/api/results", values);
    },
    "Delete": async () => {
        const id = await input({ message: "ID?" });
        await sendRequest("DELETE", `/api/results/${id}`);
    },
    "Replace": async () => {
        const id = await input({ message: "ID?" });
        const values = {
            name: await input({ message: "Name?" }),
            age: await input({ message: "Age?" }),
            years: await input({ message: "Years?" }),
            nextage: await input({ message: "Next Age?" })
        };
        await sendRequest("PUT", `/api/results/${id}`, values);
    },
    "Modify": async () => {
        const id = await input({ message: "ID?" });
        const values = {
            name: await input({ message: "Name?" }),
            age: await input({ message: "Age?" }),
            years: await input({ message: "Years?" }),
            nextage: await input({ message: "Next Age?" })
        };
        await sendRequest("PATCH", `/api/results/${id}`,
            Object.entries(values).filter(([p, v]) => v !== "")
                .map(([p, v]) => ({ op: "replace", path: "/" + p, value: v })),
            "application/json-patch+json");
    },
    "Exit": () => process.exit()
}
const sendRequest = async (method, url, body, contentType) => {
    const headers = { "Content-Type": contentType ?? "application/json" };
    //si bearer token está definido (ya se ha iniciado sesion)
    if (bearer_token) {
        headers["Authorization"] = "Bearer " + bearer_token;
    }//se envía soli. con fetch 
    const response = await fetch(baseUrl + url, {
        method, headers, body: JSON.stringify(body)
    });//si la respuesta tiene edo.200
    if (response.status == 200) {
        //convierte los datos en json y se imprime
        const data = await response.json();
        (Array.isArray(data) ? data : [data])
            .forEach(elem => console.log(JSON.stringify(elem)));
        return data;
    } else {
        console.log(response.status + " " + response.statusText);
    }
}