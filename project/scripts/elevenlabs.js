export function SendElevenText(text) {
    SendEleven(text);
}

const elevenID = "6a27e07bf857ae16c9c384d874b90bc0";

async function SendEleven(text) {
    let elevenUri = "";

    if (localStorage.getItem("gender") == "Male") {
        elevenUri = "https://api.elevenlabs.io/v1/text-to-speech/2EiwWnXFnvU5JabPnv8n/stream";
    }

    else if (localStorage.getItem("gender") == "Female") {
        elevenUri = "https://api.elevenlabs.io/v1/text-to-speech/oWAxZDx7w5VEj9dCyTzz/stream";
    }

    const bodyData = JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1"
    });

    const headers = new Headers();
    headers.append("Accept", "audio/mpeg");
    headers.append("Content-Type", "application/json");
    headers.append("xi-api-key", elevenID);

    const options = {
        method: "POST",
        headers: headers,
        body: bodyData
    };

    const response = await fetch(elevenUri, options);

    const audioBuffer = await response.arrayBuffer();

    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });

    const objectURL = URL.createObjectURL(blob);

    const audio = new Audio(objectURL);

    document.body.appendChild(audio);

    audio.play();

    audio.addEventListener('ended', () => {
        audio.parentNode.removeChild(audio);

        URL.revokeObjectURL(objectURL);
    });
}