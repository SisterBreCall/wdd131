const yearElement = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

const today = new Date();

let currentFullYear = today.getFullYear();

yearElement.innerHTML = `&copy${currentFullYear} `;
lastModified.innerHTML = `Last Modification: ${document.lastModified}`;

const products = [
    {
        id: "fc-1888",
        name: "flux capacitor",
        avgrating: 4.5
    },
    {
        id: "fc-2050",
        name: "power laces",
        averagerating: 4.7
    },
    {
        id: "fs-1987",
        name: "time circuits",
        averagerating: 3.5
    },
    {
        id: "ac-2000",
        name: "low voltage reactor",
        averagerating: 3.9
    },
    {
        id: "jj-1969",
        name: "warp equalizer",
        averagerating: 5.0
    }
];

function addElements(productArray) {
    let selectElement = document.querySelector("#productname");

    for (let i = 0; i < productArray.length; i++) {
        let optionElement = document.createElement('option');
        optionElement.text = `${productArray[i].name}`;
        optionElement.value = `${productArray[1].id}`;
        selectElement.appendChild(optionElement);
    }
}

addElements(products);