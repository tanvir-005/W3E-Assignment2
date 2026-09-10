# Assignment Plan

## 1. Date Picker / Booking [DONE]

- Implement the date range picker using Hotel Datepicker.
- Automatically populate check-in and check-out fields from the
    selected range.
- Set the initial price to `$2026`.
- Make the guest field open a guest modal.
- Guest modal must have Guests, Infants, and Pets controls with
    +/- buttons.
- Set minimum guests to 1.
- Prevent past dates from being selected.
- Require check-out to be at least 1 day after check-in.
- Do not allow a single date to be selected.
- Calculate and update total price from the selected dates.

## 2. Express Server [DONE]

- Serve the site using an Express.js HTTP server.
- Create `GET /get-property`.
- Support `most-popular`, `highest-price`, and `lowest-price`
    query parameters.
- Return the corresponding JSON dataset.
- Support `limit` and return only the requested number of items.
- Create `GET /images`.
- Add an `images` directory with 10 property images.
- Return the 10 image paths from `/images`.

## 3. Gallery [DONE]

- Make **View All Images** open a modal.
- Fetch gallery images from `/images`.
- Display images in a scrollable gallery.
- Keep the desktop background fixed while the modal is open.
- Close the modal when clicking outside it.
- On tablet/mobile, support next/previous buttons.
- On tablet/mobile, support touch swipe.
- Show an image counter on tablet/mobile.
- Show a maximum of 5 dot indicators.
- Make the dot indicators slide dynamically with the images.

## 4. Description [DONE]

- Make **Read more** expand the description.
- Add a **Collapse** button.
- Ensure expanding/collapsing does not break other DOM elements.


## 5. Nearby Properties [DONE]

- Add a dropdown with:
    -   Most Popular
    -   Highest Price
    -   Lowest Price
- Default the dropdown to **Most Popular**.
- On page load, call `/get-property`.
- Display the returned properties in Nearby Properties.
- Pass platform-specific `limit`:
    -   Desktop: 6
    -   Mobile: 4
- When the dropdown changes, call the corresponding API and update
    the properties.
- Use the required image service:
    `https://beta.imgservice.rentbyowner.com/640x300/`

## 6. Favorites [DONE]

- Make the Favorite/Heart icon toggle to a red active state.
- Store each property ID in local storage.
- Persist favorites after page reload.
- Keep the favorites list consistent across desktop/tablet/mobile.
- Ensure adding and removing favorites works correctly.

## 7. Map [DONE]

- Add map markers for properties shown in Nearby Properties.
- Hovering a property tile highlights its map marker.
- Clicking a map marker highlights its property tile.

## 8. Validation [INPROGRESS]

- Do not commit the Google Maps API key.
- Exclude the API key using `.gitignore`.
- Run without console errors or warnings.
- Keep the UI stable during all interactions.
- Prevent broken layouts and unexpected behavior.
- Handle edge cases properly.
- Remove unused/dead code.
- Keep the code clean and readable.

## 9. Submission

- Add a clear and concise `README.md` with project run
    instructions.
- Ensure the repository is publicly accessible.
- Do not make any commits after the submission deadline.
