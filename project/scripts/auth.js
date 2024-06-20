import { AddPhoto } from '../scripts/webgpu.js';

const buffer = new Uint8Array(128);
await crypto.getRandomValues(buffer);
const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
const codeVerfier = Array.from(buffer).map((value) => charset[value % charset.length]).join("");

const encoder = new TextEncoder();
const data = encoder.encode(codeVerfier);
const hashed = await crypto.subtle.digest("SHA-256", data);
const base64Encoded = btoa(String.fromCharCode(...new Uint8Array(hashed)));
const codeChallenge = base64Encoded.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

const redirectUri = "https://jonathangibsonstudios.com/theafterlifeai/callback.html";
let baseUri = "https://ident.familysearch.org/cis-web/oauth2/v3/authorization"
const outState = "237589753";
const clientID = "4VC8-TRGP-JZDD-WHN3-SKNQ-5QYB-J4MJ-ZHWV";
const elevenID = "6a27e07bf857ae16c9c384d874b90bc0";

const authRequest = `${baseUri}?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=code&state=${outState}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=openid%20profile%20email%20qualifies_for_affiliate_account%20country`;

let accesstokenData = [];
let memoryList = [];
let memoryIndex = 0;
let memoryChosen = 0;
let personMemoriesIndex = 0;

const buttonDiv = document.querySelector('#buttonDiv');
const ancestorElement = document.createElement('select');
const memoryElement = document.createElement('select');
const ancestorTextElement = document.createElement('p');
const memoryTextElement = document.createElement('p');

let isMemoryActive = false;

function handleRedirect() {
    window.open(authRequest, "_blank");
}

const button = document.getElementById('login');
button.addEventListener('click', handleRedirect);

window.addEventListener('message', function (e) {
    let response = e.data;
    let split = response.split('?');

    response = split[1].split('&');

    const authResponse = response[0].split('=');
    const stateResponse = response[1].split('=');

    if (stateResponse[1] == outState);
    {
        const authCode = authResponse[1];

        GetToken(authCode);
    }
});

async function SendRequest(apiRoute, mode) {
    const bearer = `Bearer ${accesstokenData.access_token}`;

    const apiRequest = `${baseUri}${apiRoute}`;

    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers,
    };

    const response = await fetch(apiRequest, options);

    if (mode == "json") {
        let responseData = [];
        responseData = await response.json();

        return responseData;
    }

    else if (mode == "memories") {
        if (response.status == 200) {
            let responseData = [];
            responseData = await response.json();
            memoryIndex += responseData.sourceDescriptions.length;
            memoryList.push(responseData);
            personMemoriesIndex += 1;
            GetMemories();
        }
        else if (response.status == 204) {
            ProcessMemories();
        }
    }
}

async function GetToken(authCode) {
    baseUri = "https://ident.familysearch.org/cis-web/oauth2/v3/token";

    const bodydata = new URLSearchParams({
        code: authCode,
        client_id: clientID,
        grant_type: "authorization_code",
        code_verifier: codeVerfier
    });

    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const options = {
        method: "POST",
        headers: headers,
        body: bodydata
    };

    const response = await fetch(baseUri, options);

    accesstokenData = await response.json();

    DecodeJWT(accesstokenData.id_token);
}

async function DecodeJWT(idToken) {
    let idInfo = JSON.parse(atob(idToken.split('.')[1]));

    GetCurrentUser();
}

async function GetCurrentUser() {
    baseUri = "https://api.familysearch.org/"

    const currentUser = await SendRequest("platform/users/current", "json");

    GetAncestry(currentUser.users[0].personId);
}

async function GetAncestry(userPid) {
    const apiRoute = "platform/tree/ancestry";
    const person = `?person=${userPid}`;
    const generations = "&generations=4";
    const request = `${apiRoute}${person}${generations}`;

    const ancestry = await SendRequest(request, "json");

    buttonDiv.innerHTML = "";

    let initialOption = document.createElement('option');
    initialOption.setAttribute('disabled', true);
    ancestorElement.appendChild(initialOption);


    for (let i = 0; i < ancestry.persons.length; i++) {
        if (ancestry.persons[i].living == false) {
            let optionElement = document.createElement('option');
            optionElement.text = `${ancestry.persons[i].display.name} (${ancestry.persons[i].id})`;
            optionElement.value = `${ancestry.persons[i].id}`;
            ancestorElement.appendChild(optionElement);
        }
    }

    ancestorTextElement.textContent = "Please choose a deceased ancestor from the list.";

    ancestorElement.addEventListener("change", () => {
        ClearMemoryData();

        GetMemories();
    })

    buttonDiv.appendChild(ancestorTextElement);
    buttonDiv.appendChild(ancestorElement);
}

async function GetMemories() {
    let pidValue = ancestorElement.value;

    const apiRoute = "platform/tree/persons/";
    const memoryCount = "/memories?start=";

    const request = `${apiRoute}${pidValue}${memoryCount}${memoryIndex}`;

    SendRequest(request, "memories");
}

function ProcessMemories() {
    let memoryTitle = [];
    let memoryLocation = [];

    for (let i = 0; i < memoryList.length; i++) {
        for (let j = 0; j < memoryList[i].sourceDescriptions.length; j++) {
            if (memoryList[i].sourceDescriptions[j].artifactMetadata[0].qualifiers[0].name == "http://familysearch.org/v1/Photo") {
                if (memoryList[i].sourceDescriptions[j].titles != null) {
                    memoryLocation.push(memoryList[i].sourceDescriptions[j].about);
                    memoryTitle.push(memoryList[i].sourceDescriptions[j].titles[i].value);
                }
                else if (memoryList[i].sourceDescriptions[j].titles == null) {
                    memoryLocation.push(memoryList[i].sourceDescriptions[j].about);
                    memoryTitle.push("");
                }
            }
        }
    }

    let initialOption = document.createElement('option');
    initialOption.setAttribute('disabled', true);
    memoryElement.appendChild(initialOption);

    for (let i = 0; i < memoryLocation.length; i++) {
        let optionElement = document.createElement('option');
        optionElement.text = memoryTitle[i];
        optionElement.value = memoryLocation[i];
        memoryElement.appendChild(optionElement);
    }

    memoryTextElement.textContent = "Please choose a photo memory from the list."

    buttonDiv.appendChild(memoryTextElement);
    buttonDiv.appendChild(memoryElement);

    memoryElement.addEventListener("change", () => {
        GetPhotoMemory();
    })
}

function ClearMemoryData() {
    memoryList = [];
    personMemoriesIndex = 0;
    memoryIndex = 0;

    try {
        buttonDiv.removeChild(memoryElement);
        buttonDiv.removeChild(memoryTextElement);
        memoryElement.innerHTML = "";
    }
    catch {

    }
}

async function GetPhotoMemory() {
    let location = memoryElement.value;

    const response = await fetch(location);
    const imageBlob = await response.blob();
    const imageBitmap = await createImageBitmap(imageBlob);

    AddPhoto(imageBitmap);
}