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