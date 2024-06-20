const yearElement = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

const today = new Date();

let currentFullYear = today.getFullYear();

yearElement.innerHTML = `&copy${currentFullYear} `;
lastModified.innerHTML = `Last Modification: ${document.lastModified}`;

function calc(temp, wind) {
    if (temp <= 50) {
        if (wind > 3) {
            let chill = calculateWindChill(temp, wind)
            chill = chill.toFixed(1);
            return `${chill}° F`
        }
    }
    else {
        return "N/A";
    }
}

function calculateWindChill(temp, speed) {
    return 35.74 + 0.6215 * temp - 35.75 * (speed ** 0.16) + 0.4275 * temp * (speed ** 0.16);
}

const temperature = 30;
const windspeed = 5;

const windChill = calc(temperature, windspeed);

chillElement = document.querySelector("#wind");
chillElement.innerHTML = windChill;