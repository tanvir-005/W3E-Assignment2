const PRICE_PER_NIGHT = 2026;


/* =========================================
   ELEMENTS
========================================= */

const dateRangePicker =
    document.getElementById("date-range-picker");

const checkInInput =
    document.getElementById("check-in");

const checkOutInput =
    document.getElementById("check-out");

const checkInWrapper =
    document.getElementById("check-in-wrapper");

const checkOutWrapper =
    document.getElementById("check-out-wrapper");

const totalPrice =
    document.getElementById("total-price");

const guestButton =
    document.getElementById("guest-button");

const guestModal =
    document.getElementById("guest-modal");

const guestModalClose =
    document.getElementById("guest-modal-close");

const guestSummary =
    document.getElementById("guest-summary");

const guestsCount =
    document.getElementById("guests-count");

const infantsCount =
    document.getElementById("infants-count");

const petsCount =
    document.getElementById("pets-count");

const bookingForm =
    document.getElementById("booking-form");

const datepickerOverlay =
    document.createElement("div");

datepickerOverlay.className =
    "datepicker-overlay";

document.body.appendChild(
    datepickerOverlay
);


/* =========================================
   INITIAL GUEST VALUES
========================================= */

let guests = 1;
let infants = 0;
let pets = 0;


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(price) {

    return `USD $${price.toLocaleString()}`;

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDisplayDate(date) {

    return new Intl.DateTimeFormat(
        "en-US",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    ).format(date);

}


/* =========================================
   PARSE YYYY-MM-DD AS LOCAL DATE
========================================= */

function parseLocalDate(dateString) {

    const parts = dateString
        .split("-")
        .map(Number);


    return new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

}


/* =========================================
   UPDATE TOTAL PRICE
========================================= */

function updateTotalPrice(nights) {

    const total =
        nights * PRICE_PER_NIGHT;


    totalPrice.textContent =
        formatPrice(total);

}


/* =========================================
   HOTEL DATEPICKER
========================================= */

const datepicker =
    new HotelDatepicker(
        dateRangePicker,
        {

            format: "YYYY-MM-DD",

            separator: " - ",

            /* Prevent past dates */
            startDate: new Date(),

            /* At least one night */
            minNights: 1,

            /* Checkout must be after check-in */
            selectForward: true,

            autoClose: true,


            onSelectRange: function () {

                const range =
                    dateRangePicker.value;


                if (!range) {
                    return;
                }


                const dates =
                    range.split(" - ");


                if (dates.length !== 2) {
                    return;
                }


                const checkInDate =
                    parseLocalDate(dates[0]);


                const checkOutDate =
                    parseLocalDate(dates[1]);


                checkInInput.value =
                    formatDisplayDate(
                        checkInDate
                    );


                checkOutInput.value =
                    formatDisplayDate(
                        checkOutDate
                    );


                const nights =
                    datepicker.getNights();


                if (nights >= 1) {

                    updateTotalPrice(
                        nights
                    );

                }


                

            }

        }
    );


/* =========================================
   OPEN DATEPICKER
========================================= */

/* =========================================
   DATEPICKER OVERLAY
========================================= */

function showDatepickerOverlay() {

    datepickerOverlay.classList.add(
        "active"
    );

}


function hideDatepickerOverlay() {

    datepickerOverlay.classList.remove(
        "active"
    );

}

function openDatepicker() {

    showDatepickerOverlay();

    datepicker.open();

}


checkInWrapper.addEventListener(
    "click",
    openDatepicker
);


checkOutWrapper.addEventListener(
    "click",
    openDatepicker
);


checkInInput.addEventListener(
    "click",
    openDatepicker
);


checkOutInput.addEventListener(
    "click",
    openDatepicker
);


/* =========================================
   GUEST MODAL
========================================= */

guestButton.addEventListener(
    "click",
    function () {

        guestModal.classList.add(
            "active"
        );

    }
);


guestModalClose.addEventListener(
    "click",
    function () {

        guestModal.classList.remove(
            "active"
        );

    }
);




/* Close modal when background is clicked */

guestModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === guestModal
        ) {

            guestModal.classList.remove(
                "active"
            );

        }

    }
);


/* =========================================
   UPDATE GUEST DISPLAY
========================================= */

function updateGuestUI() {

    guestsCount.textContent =
        guests;


    infantsCount.textContent =
        infants;


    petsCount.textContent =
        pets;


    let summary =
        `${guests} ${
            guests === 1
                ? "GUEST"
                : "GUESTS"
        }`;


    if (infants > 0) {

        summary +=
            `, ${infants} ${
                infants === 1
                    ? "INFANT"
                    : "INFANTS"
            }`;

    }


    if (pets > 0) {

        summary +=
            `, ${pets} ${
                pets === 1
                    ? "PET"
                    : "PETS"
            }`;

    }


    guestSummary.textContent =
        summary;


    updateCounterButtons();

}


/* =========================================
   DISABLE INVALID MINUS BUTTONS
========================================= */

function updateCounterButtons() {

    document
        .querySelectorAll(
            '.counter-button[data-type="guests"][data-action="minus"]'
        )
        .forEach(function (button) {

            button.disabled =
                guests <= 1;

        });


    document
        .querySelectorAll(
            '.counter-button[data-type="infants"][data-action="minus"]'
        )
        .forEach(function (button) {

            button.disabled =
                infants <= 0;

        });


    document
        .querySelectorAll(
            '.counter-button[data-type="pets"][data-action="minus"]'
        )
        .forEach(function (button) {

            button.disabled =
                pets <= 0;

        });

}


/* =========================================
   COUNTER BUTTONS
========================================= */

const counterButtons =
    document.querySelectorAll(
        ".counter-button"
    );


counterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const type =
                    button.dataset.type;


                const action =
                    button.dataset.action;


                /* GUESTS */

                if (
                    type === "guests"
                ) {

                    if (
                        action === "plus"
                    ) {

                        guests++;

                    }


                    if (
                        action === "minus" &&
                        guests > 1
                    ) {

                        guests--;

                    }

                }


                /* INFANTS */

                if (
                    type === "infants"
                ) {

                    if (
                        action === "plus"
                    ) {

                        infants++;

                    }


                    if (
                        action === "minus" &&
                        infants > 0
                    ) {

                        infants--;

                    }

                }


                /* PETS */

                if (
                    type === "pets"
                ) {

                    if (
                        action === "plus"
                    ) {

                        pets++;

                    }


                    if (
                        action === "minus" &&
                        pets > 0
                    ) {

                        pets--;

                    }

                }


                updateGuestUI();

            }
        );

    }
);


/* =========================================
   FORM SUBMISSION
========================================= */

bookingForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const nights =
            datepicker.getNights();


        if (nights < 1) {

            alert(
                "Please select a valid check-in and check-out date."
            );

            return;

        }


        /*
        Booking functionality can redirect here.
        The assignment primarily requires
        the date and price functionality.
        */

        window.open(
            "https://www.booking.com",
            "_blank"
        );

    }
);


/* =========================================
   INITIAL UI
========================================= */

updateGuestUI();

totalPrice.textContent =
    formatPrice(PRICE_PER_NIGHT);


