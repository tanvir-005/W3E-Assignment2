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

/* Nearby Properties */

const propertySort = document.getElementById("property-sort");
let propertyMap = null;
let propertyMarkers = [];
let propertyData = [];
let selectedPropertyIndex = -1;
let lockedPropertyIndex = -1;
let hoveredPropertyIndex = -1;

const FAVORITES_STORAGE_KEY = "stayandplay-favourites";

let favoritePropertyIds = loadFavoritePropertyIds();

function loadFavoritePropertyIds() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]"
        );

        return new Set(
            Array.isArray(saved) ? saved.map(String) : []
        );
    } catch (error) {
        console.warn("Could not load favourites:", error);
        return new Set();
    }
}

function saveFavoritePropertyIds() {
    try {
        localStorage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify([...favoritePropertyIds])
        );
    } catch (error) {
        console.warn("Could not save favourites:", error);
    }
}

function getPropertyFavoriteId(item) {
    return item?.ID != null ? String(item.ID) : "";
}

function updateFavoriteButton(card, item) {
    const heart = card.querySelector(".favorite-button");

    if (!heart || !item) return;

    const favoriteId = getPropertyFavoriteId(item);
    const isFavorite = favoritePropertyIds.has(favoriteId);

    heart.dataset.favoriteId = favoriteId;

    heart.classList.toggle("is-favorite", isFavorite);

    heart.setAttribute(
        "aria-pressed",
        String(isFavorite)
    );

    heart.setAttribute(
        "alt",
        isFavorite
            ? "Remove from favourites"
            : "Add to favourites"
    );
}

function toggleFavorite(card) {
    const heart = card.querySelector(".favorite-button");

    if (!heart) return;

    const index = Array.from(propertyCards).indexOf(card);
    const favoriteId = heart.dataset.favoriteId;

    if (!favoriteId || !propertyData[index]) return;

    if (favoritePropertyIds.has(favoriteId)) {
        favoritePropertyIds.delete(favoriteId);
    } else {
        favoritePropertyIds.add(favoriteId);
    }

    saveFavoritePropertyIds();

    updateFavoriteButton(card, propertyData[index]);
}

const propertyCards = document.querySelectorAll(
    ".carousel-track > .r11, " +
    ".carousel-track > .r12, " +
    ".carousel-track > .r13, " +
    ".carousel-track > .r21, " +
    ".carousel-track > .r22, " +
    ".carousel-track > .r23"
);

const PROPERTY_IMAGE_PREFIX =
    "https://beta.imgservice.rentbyowner.com/640x300/";

function getPropertyLimit() {
    return window.innerWidth <= 1024 ? 4 : 6;
}

function getPropertyApiUrl(sort, limit) {
    const params = new URLSearchParams();

    params.set("limit", limit);

    if (sort === "highest-price") {
        params.set("highest-price", "true");
    } else if (sort === "lowest-price") {
        params.set("lowest-price", "true");
    }

    return `/get-property?${params.toString()}`;
}

function formatPropertyPrice(price) {
    if (typeof price !== "number") {
        return price;
    }

    return price.toLocaleString("en-US", {
        maximumFractionDigits: 2
    });
}

function getPropertyDescription(property) {
    const amenities = (property.TopAmenities || [])
        .map(amenity => amenity.Name)
        .filter(Boolean);

    if (property.Counts?.Occupancy != null) {
        amenities.push(`Sleeps ${property.Counts.Occupancy}`);
    }

    return amenities.join(" - ");
}

function getPropertyRating(property) {
    const score = property.ReviewScore;

    if (typeof score !== "number") {
        return "";
    }

    const rating = score > 5 ? score / 2 : score;
    const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));

    return "★".repeat(roundedRating) +
           "☆".repeat(5 - roundedRating);
}

function getPropertySite(partner) {
    if (!partner?.URL) {
        return "";
    }

    try {
        return new URL(partner.URL).hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
}

function updatePropertyCard(card, item) {
    const property = item.Property || {};
    const location = item.GeoInfo?.Display || "";
    const partner = item.Partner || {};

    const imageArea = card.querySelector(".img-area");
    const review = card.querySelector(".review");
    const title = card.querySelector("h3");
    const site = card.querySelector(".site");
    const price = card.querySelector(".price");
    const description = card.querySelector(".desc-area p");
    const locationElement = card.querySelector(".location");

    if (imageArea) {
        imageArea.style.backgroundImage =
            `url("${PROPERTY_IMAGE_PREFIX}${property.FeatureImage}")`;
    }

    if (review) {
        review.textContent = getPropertyRating(property);
    }

    if (title) {
        title.textContent = property.PropertyName || "";
    }

    if (site) {
        site.textContent = getPropertySite(partner);
    }

    if (price) {
        price.textContent =
            `From $${formatPropertyPrice(property.Price)}`;
    }

    if (description) {
        description.textContent = getPropertyDescription(property);
    }

    if (locationElement) {
        locationElement.textContent = location;
    }

    const learnMore = card.querySelector(".learn-more");

    if (learnMore) {
        learnMore.onclick = () => {
            if (partner.URL) {
                window.open(partner.URL, "_blank");
            }
        };
    }


    updateFavoriteButton(card, item);
}

function clearPropertyCard(card) {
    card.style.display = "none";
}

function showPropertyCard(card) {
    card.style.display = "";
}

function initPropertyMap() {
    const mapElement = document.getElementById("property-map");

    if (!mapElement) return;

    propertyMap = new google.maps.Map(mapElement, {
        center: {
            lat: 28.5383,
            lng: -81.3792
        },
        zoom: 10,
        mapId: "DEMO_MAP_ID",
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: "greedy"
    });

    /*
     * If properties have already loaded before Google Maps finished
     * loading, render them now.
     */
    if (propertyData.length > 0) {
        renderPropertyMarkers(propertyData);
    }
}

async function loadProperties(sort = "most-popular") {
    const limit = getPropertyLimit();

    try {
        const response = await fetch(getPropertyApiUrl(sort, limit));

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const properties = await response.json();

        const visibleProperties = properties.slice(0, limit);

        propertyData = visibleProperties;

        propertyCards.forEach(clearPropertyCard);

        visibleProperties.forEach((item, index) => {
            const card = propertyCards[index];

            if (!card) return;

            updatePropertyCard(card, item);
            showPropertyCard(card);
        });

        /*
        * Reset selected state after a new sort/API result.
        */
        selectedPropertyIndex = -1;

        propertyCards.forEach(card => {
            card.classList.remove("map-selected");
        });

        /*
        * Rebuild markers from exactly the same properties
        * used for the cards.
        */
        renderPropertyMarkers(propertyData);

        /*
         * Reset mobile carousel position after changing the
         * property order/content.
         */
        if (window.innerWidth <= 1024) {
            resortTrack.scrollTo({
                left: 0,
                behavior: "auto"
            });

            resortIndex = 0;

            resortDots.forEach((dot, i) => {
                dot.classList.toggle("active", i === 0);
            });
        }

    } catch (error) {
        console.error("Failed to load properties:", error);
    }
}

propertySort.addEventListener("change", function () {
    loadProperties(this.value);
});

let lastPropertyLimit = getPropertyLimit();

window.addEventListener("resize", function () {
    const currentLimit = getPropertyLimit();

    if (currentLimit !== lastPropertyLimit) {
        lastPropertyLimit = currentLimit;
        loadProperties(propertySort.value);
    }
});


const resortTrack = document.querySelector(".carousel-track");
const resortPrev = document.querySelector(".carousel-prev");
const resortNext = document.querySelector(".carousel-next");
const resortDots = document.querySelectorAll(".carousel-dot");
let resortIndex = 0;
loadProperties(propertySort.value);


function getVisiblePropertyCount() {
    return getPropertyLimit();
}

function goToResort(index) {
    const count = getVisiblePropertyCount();

    if (count <= 0) return;

    resortIndex = (index + count) % count;

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
    if (window.innerWidth > 1024) return;

    const index = Math.round(
        resortTrack.scrollLeft / resortTrack.clientWidth
    );

    const count = getVisiblePropertyCount();

    if (index >= 0 && index < count) {
        resortIndex = index;

        resortDots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === resortIndex);
        });
    }
});

function renderPropertyMarkers(properties) {
    if (!propertyMap || !window.google?.maps) return;

    // Remove old markers
    propertyMarkers.forEach(marker => {
        if (marker) marker.map = null;
    });

    propertyMarkers = [];

    const bounds = new google.maps.LatLngBounds();

    properties.forEach((item, index) => {
        const lat = Number(item.GeoInfo?.Lat);
        const lng = Number(item.GeoInfo?.Lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat, lng },
            map: propertyMap,
            content: createMarkerContent(false),
            title: item.Property?.PropertyName || `Property ${index + 1}`,
            zIndex: 1
        });

        marker.addListener("click", () => {
            // Clicking the already-locked marker releases it.
            if (lockedPropertyIndex === index) {
                lockedPropertyIndex = -1;
                hoveredPropertyIndex = -1;
                selectedPropertyIndex = -1;

                propertyMarkers.forEach(marker => {
                    if (!marker) return;

                    marker.content = createMarkerContent(false);
                    marker.zIndex = 1;
                });

                propertyCards.forEach(card => {
                    card.classList.remove("map-selected");
                });

                return;
            }

            // Clicking another marker creates a new lock.
            selectProperty(index, {
                centerMap: true,
                scrollCard: true
            });
        });

        propertyMarkers[index] = marker;

        bounds.extend({ lat, lng });
    });

    if (!bounds.isEmpty()) {
        propertyMap.fitBounds(bounds);

        google.maps.event.addListenerOnce(
            propertyMap,
            "bounds_changed",
            () => {
                if (propertyMap.getZoom() > 15) {
                    propertyMap.setZoom(15);
                }
            }
        );
    }
}

function createMarkerContent(isSelected = false) {
    const fill = isSelected ? "#93D99A" : "#71D0E6";

    const marker = document.createElement("div");

    marker.innerHTML = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="52"
            viewBox="0 0 42 52">

            <path
                d="M21 2
                   C10.5 2 2 10.5 2 21
                   C2 34.5 21 50 21 50
                   C21 50 40 34.5 40 21
                   C40 10.5 31.5 2 21 2Z"
                fill="${fill}"
                stroke="#222f24"
                stroke-width="2.5"/>

            <circle
                cx="21"
                cy="21"
                r="6"
                fill="#222f24"/>
        </svg>
    `;

    marker.style.width = "42px";
    marker.style.height = "52px";
    marker.style.transform = "translate(-50%, -100%)";

    return marker;
}

function selectProperty(index, options = {}) {
    const {
        centerMap = false,
        scrollCard = false
    } = options;

    if (!propertyData[index]) return;

    // Clicking a card/marker creates a new locked selection.
    lockedPropertyIndex = index;
    hoveredPropertyIndex = -1;
    selectedPropertyIndex = index;

    updatePropertySelection(index);

    if (centerMap && propertyMarkers[index]) {
        const position = propertyMarkers[index].position;

        if (position) {
            propertyMap.panTo(position);
        }
    }

    if (scrollCard) {
        const card = propertyCards[index];

        if (card) {
            card.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest"
            });
        }
    }
}

function updatePropertySelection(index) {
    selectedPropertyIndex = index;

    propertyMarkers.forEach((marker, markerIndex) => {
        if (!marker) return;

        const isSelected = markerIndex === index;

        marker.content = createMarkerContent(isSelected);

        marker.zIndex = isSelected ? 1000 : 1;
    });

    propertyCards.forEach((card, cardIndex) => {
        card.classList.toggle(
            "map-selected",
            cardIndex === index
        );
    });
}

propertyCards.forEach((card, index) => {

    card.addEventListener("mouseenter", () => {
        if (!propertyMarkers[index]) return;

        /*
         * If this is a different card from the currently
         * locked selection, the lock is released.
         */
        if (
            lockedPropertyIndex !== -1 &&
            lockedPropertyIndex !== index
        ) {
            lockedPropertyIndex = -1;
        }

        hoveredPropertyIndex = index;

        updatePropertySelection(index);
    });

    card.addEventListener("mouseleave", () => {

        /*
         * Do not release the selection just because the mouse
         * left the card.
         *
         * If there is a locked selection, keep it.
         */
        if (lockedPropertyIndex !== -1) {
            updatePropertySelection(lockedPropertyIndex);
            hoveredPropertyIndex = -1;
            return;
        }

        /*
         * No locked selection means this was only a hover.
         * Release it completely.
         */
        if (hoveredPropertyIndex === index) {
            hoveredPropertyIndex = -1;
            selectedPropertyIndex = -1;

            propertyMarkers.forEach(marker => {
                if (!marker) return;

                marker.content = createMarkerContent(false);
                marker.zIndex = 1;
            });

            propertyCards.forEach(propertyCard => {
                propertyCard.classList.remove("map-selected");
            });
        }
    });

    card.addEventListener("click", () => {
        selectProperty(index, {
            centerMap: true
        });
    });

    const favoriteButton = card.querySelector(".favorite-button");

    if (favoriteButton) {
        favoriteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleFavorite(card);
        });
    }
});