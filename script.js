const PRICE_PER_NIGHT = 2026;

/* Elements */

const bookingForm = document.getElementById("booking-form");
const dateRangePicker = document.getElementById("date-range-picker");
const checkIn = document.getElementById("check-in");
const checkOut = document.getElementById("check-out");
const checkInWrapper = document.getElementById("check-in-wrapper");
const checkOutWrapper = document.getElementById("check-out-wrapper");
const datepickerOverlay = document.getElementById("datepicker-overlay");

const guestButton = document.getElementById("guest-button");
const guestSummary = document.getElementById("guest-summary");
const guestModal = document.getElementById("guest-modal");
const guestModalClose = document.getElementById("guest-modal-close");
const guestDoneButton = document.getElementById("guest-done-button");

const guestsCount = document.getElementById("guests-count");
const childrenCount = document.getElementById("children-count");
const petsCount = document.getElementById("pets-count");

const pricePerNight = document.getElementById("price-per-night");
const totalPrice = document.getElementById("total-price");

/* Initial values */

let guests = 1;
let children = 0;
let pets = 0;

/* Helper functions */

function formatPrice(price) {
    return `USD $${price.toLocaleString()}`;
}

function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}

function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function updateTotalPrice(nights) {
    totalPrice.textContent = formatPrice(nights * PRICE_PER_NIGHT);
}

/* Datepicker */

const datepicker = new HotelDatepicker(dateRangePicker, {
    format: "YYYY-MM-DD",
    separator: " - ",
    startDate: new Date(),
    minNights: 1,
    selectForward: true,
    autoClose: true,
    showTopbar: true,
    container: document.body,

    onSelectRange: function () {
        const range = dateRangePicker.value;

        if (!range) return;

        const dates = range.split(" - ");

        if (dates.length !== 2) return;

        const checkInDate = parseLocalDate(dates[0]);
        const checkOutDate = parseLocalDate(dates[1]);

        checkIn.textContent = formatDate(checkInDate);
        checkOut.textContent = formatDate(checkOutDate);

        const nights = datepicker.getNights();

        if (nights >= 1) {
            updateTotalPrice(nights);
        }

        hideDatepicker();
    }
});

/* Datepicker open and close */

function openDatepicker() {
    closeGuestModal();
    datepickerOverlay.classList.add("active");
    datepicker.open();
}

function hideDatepicker() {
    datepicker.close();
    datepickerOverlay.classList.remove("active");
}

checkInWrapper.addEventListener("click", openDatepicker);
checkOutWrapper.addEventListener("click", openDatepicker);

datepickerOverlay.addEventListener("click", hideDatepicker);

/* Guest modal */

function openGuestModal() {
    hideDatepicker();
    guestModal.classList.add("active");
}

function closeGuestModal() {
    guestModal.classList.remove("active");
}

guestButton.addEventListener("click", openGuestModal);
guestModalClose.addEventListener("click", closeGuestModal);
guestDoneButton.addEventListener("click", closeGuestModal);

guestModal.addEventListener("click", function (event) {
    if (event.target === guestModal) {
        closeGuestModal();
    }
});

/* Guest counters */

function updateGuestUI() {
    guestsCount.textContent = guests;
    childrenCount.textContent = children;
    petsCount.textContent = pets;

    let summary = `${guests} ${guests === 1 ? "GUEST" : "GUESTS"}`;

    if (children > 0) {
        summary += `, ${children} ${children === 1 ? "CHILD" : "CHILDREN"}`;
    }

    if (pets > 0) {
        summary += `, ${pets} ${pets === 1 ? "PET" : "PETS"}`;
    }

    guestSummary.textContent = summary;

    updateCounterButtons();
}

function updateCounterButtons() {
    const guestMinus = document.querySelector('[data-type="guests"][data-action="minus"]');
    const childrenMinus = document.querySelector('[data-type="children"][data-action="minus"]');
    const petsMinus = document.querySelector('[data-type="pets"][data-action="minus"]');

    guestMinus.disabled = guests <= 1;
    childrenMinus.disabled = children <= 0;
    petsMinus.disabled = pets <= 0;
}

document.querySelectorAll(".counter-button").forEach(function (button) {
    button.addEventListener("click", function () {
        const type = button.dataset.type;
        const action = button.dataset.action;

        if (type === "guests") {
            if (action === "plus") guests++;
            if (action === "minus" && guests > 1) guests--;
        }

        if (type === "children") {
            if (action === "plus") children++;
            if (action === "minus" && children > 0) children--;
        }

        if (type === "pets") {
            if (action === "plus") pets++;
            if (action === "minus" && pets > 0) pets--;
        }

        updateGuestUI();
    });
});

/* Escape key */

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        hideDatepicker();
        closeGuestModal();
    }
});

/* Form submission */

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nights = datepicker.getNights();

    if (nights < 1) {
        alert("Please select a valid check-in and check-out date.");
        return;
    }

    window.open("https://www.booking.com", "_blank");
});

/* Initial display */

pricePerNight.textContent = formatPrice(PRICE_PER_NIGHT);
totalPrice.textContent = formatPrice(PRICE_PER_NIGHT);

updateGuestUI();





const descriptionToggle = document.querySelector(".description-toggle");
const descriptionWrapper = document.querySelector(".description-wrapper");

if (descriptionToggle && descriptionWrapper) {
    descriptionToggle.addEventListener("click", function () {
        const expanded = descriptionWrapper.classList.toggle("expanded");
        descriptionToggle.setAttribute("aria-expanded", String(expanded));

        const toggleLabel = descriptionToggle.querySelector(".toggle-label");
        if (toggleLabel) {
            toggleLabel.textContent = expanded ? "COLLAPSE" : "READ MORE";
        }
    });
}

const viewAllImagesButton = document.getElementById("view-all");
const allImagesModal = document.getElementById("all-images");
const topImagesTrack = document.getElementById("top-images-track");
const topImagesDots = document.getElementById("top-images-dots");
const topImagesCounter = document.getElementById("top-images-counter");
const desktopImages = document.querySelectorAll(".images .left-img img, .images .right-top-img img, .images .right-bottom-img img");
let topImageUrls = [];
let topImageIndex = 0;

function updateTopDots(index) {
    topImagesDots.innerHTML = "";

    const count = Math.min(5, topImageUrls.length);
    const start = topImageUrls.length <= 5
        ? 0
        : Math.max(0, Math.min(index - 2, topImageUrls.length - 5));

    for (let i = 0; i < count; i++) {
        const imageIndex = start + i;

        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "top-images-dot" + (imageIndex === index ? " active" : "");
        dot.setAttribute("aria-label", `Image ${imageIndex + 1}`);
        dot.addEventListener("click", () => goToTopImage(imageIndex));

        topImagesDots.appendChild(dot);
    }

    // Update image counter
    if (topImagesCounter) {
        topImagesCounter.textContent =
            `${index + 1}/${topImageUrls.length}`;
    }
}

function goToTopImage(index) {
    topImageIndex = (index + topImageUrls.length) % topImageUrls.length;
    topImagesTrack.scrollTo({ left: topImageIndex * topImagesTrack.clientWidth, behavior: "smooth" });
    updateTopDots(topImageIndex);
}

async function loadTopImages() {
    try {
        const response = await fetch("/images");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        topImageUrls = await response.json();
        desktopImages.forEach((img, i) => img.src = topImageUrls[i] || topImageUrls[0]);
        topImagesTrack.innerHTML = topImageUrls.map((url, i) => `<div class="top-image-slide"><img src="${url}" alt="Gallery Image ${i + 1}"></div>`).join("");
        updateTopDots(0);
    } catch (error) {
        console.error("Failed to load images:", error);
    }
}

topImagesTrack.addEventListener("scroll", () => {
    const index = Math.round(topImagesTrack.scrollLeft / topImagesTrack.clientWidth);
    if (index !== topImageIndex && index >= 0 && index < topImageUrls.length) {
        topImageIndex = index;
        updateTopDots(index);
    }
});

loadTopImages();

viewAllImagesButton.addEventListener("click", () => {
    allImagesModal.style.display = "flex";
    allImagesModal.style.flexDirection = "column";
    allImagesModal.style.alignItems = "center";
    allImagesModal.innerHTML = topImageUrls.map(url => `<img src="${url}" alt="Gallery Image" class="modal-img">`).join("");
    allImagesModal.innerHTML += `<button class="close-modal" id="close-modal" aria-label="Close modal">&times;</button>`;
    document.getElementById("close-modal").addEventListener("click", () => allImagesModal.style.display = "none");
});

allImagesModal.addEventListener("click", event => {
    if (event.target === allImagesModal) allImagesModal.style.display = "none";
});


const resortTrack = document.querySelector(".carousel-track");
const resortSlides = document.querySelectorAll(".carousel-track > div");
const resortDots = document.querySelectorAll(".carousel-dot");
const resortPrev = document.querySelector(".carousel-prev");
const resortNext = document.querySelector(".carousel-next");

let resortIndex = 0;

function goToResort(index) {
resortIndex = (index + 4) % 4;


resortTrack.scrollTo({
    left: resortIndex * resortTrack.clientWidth,
    behavior: "smooth"
});

resortDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === resortIndex);
});


}

resortNext.addEventListener("click", function () {
goToResort(resortIndex + 1);
});

resortPrev.addEventListener("click", function () {
goToResort(resortIndex - 1);
});

resortDots.forEach(function (dot, index) {
dot.addEventListener("click", function () {
goToResort(index);
});
});

resortTrack.addEventListener("scroll", function () {
const index = Math.round(resortTrack.scrollLeft / resortTrack.clientWidth);


if (index >= 0 && index < 4) {
    resortIndex = index;

    resortDots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === resortIndex);
    });
}


});
