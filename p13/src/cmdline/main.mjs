import { select } from "@inquirer/prompts";
import { ops } from "./operations.mjs";
(async function run() {
    let loop = true;
    //para solicitar al usuario que elija una operación a
    //realizar
    while (loop) {
        const selection = await select({
            message: "Select an operation",
            choices: [...Object.keys(ops).map(k => {return { value: k }})]
        });
        await ops[selection]();
    }
})();