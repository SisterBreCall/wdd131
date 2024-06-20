import { SendElevenText } from '../scripts/elevenlabs.js'

export function BeginAuth() {
    CreateCharacter();
}

let sessionData = [];

const baseUri = "https://api.inworld.ai/studio/v1";
const baseUriRunTime = "https://api.inworld.ai/v1";
const workSpace = "default-f2_q5dyfzo0awwffe65u9q";
const clientID = "TXhBYVVoczhZTXgzTThJNWFUdXhrZXNJWUFDUGsyd2g6d2IzNmNYQkJZUGt5eFREMU02OElRMXcxZE84ek1HbjluZjU4VDBkZXhiNXA0cURRQ2J4UzM2UkczdGFUV1ZRTg==";
const clientIdRunTime = "UHF6WkhibXZ1Q0FLUGc1S0ZhU2RhSDBQelJXNVpGQTM6endWZ2ZTU3pqZzRmODBrbFNEZno4aXdZdUNwVjF2UXQwWEQzazI5ZHg1QTZYT3dscGFQaHBPMWo2WDVuTWJhbQ==";

async function CreateCharacter() {

    let description = "";

    if (localStorage.getItem("gender") == "Male") {
        description = `{character} was born on ${localStorage.getItem("birthDate")} at ${localStorage.getItem("birthPlace")}. He died on ${localStorage.getItem("deathDate")} at ${localStorage.getItem("deathPlace")}. His person id number on FamilySearch is ${localStorage.getItem("pid")}.`;
    }

    else if (localStorage.getItem("gender") == "Female") {
        description = `{character} was born on ${localStorage.getItem("birthDate")} at ${localStorage.getItem("birthPlace")}. She died on ${localStorage.getItem("deathDate")} at ${localStorage.getItem("deathPlace")}. Her person id number on FamilySearch is ${localStorage.getItem("pid")}.`;
    }

    const bodyData = JSON.stringify({
        defaultCharacterDescription: {
            givenName: localStorage.getItem("ancestorName"),
            description: description,
            characterRole: "ancestor storyteller"
        }
    });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Grpc-Metadata-X-Authorization-Bearer-Type", "studio_api");
    headers.append("Authorization", `Basic ${clientID}`);

    const options = {
        method: "POST",
        headers: headers,
        body: bodyData
    };

    let apiRequest = `${baseUri}/workspaces/${workSpace}/characters`;

    const response = await fetch(apiRequest, options);

    if (response.status == 200) {
        DeployCharacter();
    }
}

async function DeployCharacter() {
    let characterName = localStorage.getItem("ancestorName").toLowerCase();
    characterName = characterName.replaceAll(" ", "_");
    characterName = characterName.replaceAll(".", "");

    localStorage.setItem("characterName", characterName);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Grpc-Metadata-X-Authorization-Bearer-Type", "studio_api");
    headers.append("Authorization", `Basic ${clientID}`);

    const options = {
        method: "POST",
        headers: headers,
        body: ""
    };

    let apiRequest = `${baseUri}/workspaces/${workSpace}/characters/${characterName}:deploy`;

    const response = await fetch(apiRequest, options);

    if (response.status == 200) {
        CreateSession();
    }
}

async function CreateSession() {
    let apiRequest = `${baseUriRunTime}/workspaces/${workSpace}/characters/${localStorage.getItem("characterName")}:openSession`;

    let name = `/workspaces/${workSpace}/characters/${localStorage.getItem("characterName")}`;

    const bodyData = JSON.stringify({
        name: name,
        user: {
            givenName: localStorage.getItem("userName"),
            gender: localStorage.getItem("userGender")
        }
    });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("authorization", `Basic ${clientIdRunTime}`);

    const options = {
        method: "POST",
        headers: headers,
        body: bodyData
    };

    const response = await fetch(apiRequest, options);

    if (response.status == 200) {
        sessionData = await response.json();

        localStorage.setItem("sessionId", sessionData.name);
        localStorage.setItem("characterSessionId", sessionData.sessionCharacters[0].character);

        OpenChat();
    }
}

async function OpenChat() {
    let apiRequest = `${baseUriRunTime}/workspaces/${workSpace}/sessions/${localStorage.getItem("sessionId")}/sessionCharacters/${localStorage.getItem("characterSessionId")}:sendText`;

    const bodyData = JSON.stringify({
        text: "Hello"
    });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("authorization", `Basic ${clientIdRunTime}`);
    headers.append("Grpc-Metadata-session-id", `${localStorage.getItem("sessionId")}`);

    const options = {
        method: "POST",
        headers: headers,
        body: bodyData
    };

    const response = await fetch(apiRequest, options);

    if (response.status == 200) {
        let serverResponse = [];

        serverResponse = await response.json();

        let aiResponse = "";

        for (let i = 0; i < serverResponse.textList.length; i++) {
            aiResponse += serverResponse.textList[i];
        }

        const pElement = document.getElementById("aiOutput");
        pElement.innerText = aiResponse;
        SendElevenText(aiResponse);

        let containerElement = document.getElementById('container');
        containerElement.style.display = "block";
    }

    const sendbutton = document.querySelector('#send');
    const endButton = document.querySelector('#end');
    sendbutton.addEventListener('click', SendText);
    endButton.addEventListener('click', EndSession);
}

async function SendText() {
    let apiRequest = `${baseUriRunTime}/workspaces/${workSpace}/sessions/${localStorage.getItem("sessionId")}/sessionCharacters/${localStorage.getItem("characterSessionId")}:sendText`;

    let userInputElement = document.querySelector('#userInput');
    const userInput = userInputElement.value;
    userInputElement.value = "";

    const bodyData = JSON.stringify({
        text: userInput
    });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("authorization", `Basic ${clientIdRunTime}`);
    headers.append("Grpc-Metadata-session-id", `${localStorage.getItem("sessionId")}`);

    const options = {
        method: "POST",
        headers: headers,
        body: bodyData
    };

    const response = await fetch(apiRequest, options);

    if (response.status == 200) {
        let serverResponse = [];

        serverResponse = await response.json();

        let aiResponse = "";

        for (let i = 0; i < serverResponse.textList.length; i++) {
            aiResponse += serverResponse.textList[i];
        }

        const pElement = document.getElementById("aiOutput");
        pElement.innerText = aiResponse;
        SendElevenText(aiResponse);
    }
}

async function EndSession() {
    let apiRequest = `${baseUri}/workspaces/${workSpace}/characters/${localStorage.getItem("characterName")}`;

    const headers = new Headers();
    headers.append("Grpc-Metadata-X-Authorization-Bearer-Type", "studio_api");
    headers.append("Authorization", `Basic ${clientID}`);

    const options = {
        method: "DELETE",
        headers: headers,
        body: ""
    };

    /*

    const response = await fetch(apiRequest, options);

    if (response.status == 200) {
        let containerElement = document.getElementById('container');
        containerElement.style.display = "none";
    }

    document.get
}