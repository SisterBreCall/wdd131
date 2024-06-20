const yearElement = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

const today = new Date();

let currentFullYear = today.getFullYear();

yearElement.innerHTML = `&copy${currentFullYear} `;
lastModified.innerHTML = `Last Modification: ${document.lastModified}`;

function reviewCount() {
    let reviewCount = localStorage.getItem("reviewCount") || 1;

    document.querySelector("#reviews").textContent = reviewCount;

    localStorage.setItem("reviewCount", parseInt(reviewCount) + 1);
}

reviewCount();