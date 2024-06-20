const yearElement = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

const today = new Date();

let currentFullYear = today.getFullYear();

yearElement.innerHTML = `&copy${currentFullYear} `;
lastModified.innerHTML = `Last Modification: ${document.lastModified}`;

const mainNav = document.querySelector("#navMenu");
const hamButton = document.querySelector('#menu');

hamButton.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamButton.classList.toggle('show');
})

const temples = [
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },
    {
        templeName: "Manti Utah",
        location: "Manti, Utah, United States",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },
    {
        templeName: "Payson Utah",
        location: "Payson, Utah, United States",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },
    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },
    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, United States",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
        templeName: "Lima Perú",
        location: "Lima, Perú",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },
    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },
    {
        templeName: "Seattle Washington",
        location: "Bellevue, Washington",
        dedicated: "1980, November, 17",
        area: 110000,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/seattle-washington/400x250/seatlle-temple-lds-933559-wallpaper.jpg"
    },
    {
        templeName: "Bountiful Utah",
        location: "Bountiful, Utah",
        dedicated: "1995, January, 8",
        area: 104000,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/bountiful-utah/400x250/bountiful-temple-766347-wallpaper.jpg"
    },
    {
        templeName: "Oakland California",
        location: "Oakland, California",
        dedicated: "1964, November, 17",
        area: 80157,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/oakland-california/400x250/01-Oakland-Temple-Exterior-2236889.jpg"
    }
];

const containerElement = document.getElementById("container");

const displayTemples = (temples) => {
    containerElement.innerHTML = "";
    temples.forEach(displayTemple);
}

function displayTemple(temple) {

    let ae = document.createElement('article');

    let h3 = document.createElement('h3');
    h3.textContent = temple.templeName;

    let location = document.createElement('p');
    location.innerHTML = `<span id="blue">Location:</span> ${temple.location}`;

    let dedicated = document.createElement('p');
    dedicated.innerHTML = `<span id="blue">Dedicated:</span> ${temple.dedicated}`;

    let size = document.createElement('p');
    size.innerHTML = `<span id="blue">Size:</span> ${temple.area} sq ft`;

    let img = document.createElement('img');
    img.setAttribute("src", temple.imageUrl);
    img.setAttribute("alt", temple.templeName);
    img.setAttribute("loading", "lazy");

    ae.appendChild(h3);
    ae.appendChild(location);
    ae.appendChild(dedicated);
    ae.appendChild(size);
    ae.appendChild(img);

    containerElement.appendChild(ae);
}

displayTemples(temples);

let title = document.querySelector("#title");

document.querySelector("#home").addEventListener("click", () => {
    title.textContent = "Home";
    displayTemples(temples);
});

document.querySelector("#old").addEventListener("click", () => {
    title.textContent = "Old";
    displayTemples(temples.filter(temple => new Date(temple.dedicated) < new Date(1900, 0, 1)));
});

document.querySelector("#new").addEventListener("click", () => {
    title.textContent = "New";
    displayTemples(temples.filter(temple => new Date(temple.dedicated) > new Date(2000, 0, 1)));
});

document.querySelector("#large").addEventListener("click", () => {
    title.textContent = "Large";
    displayTemples(temples.filter(temple => temple.area > 90000));
});

document.querySelector("#small").addEventListener("click", () => {
    title.textContent = "Small";
    displayTemples(temples.filter(temple => temple.area < 10000));
});