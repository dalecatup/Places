document.addEventListener("DOMContentLoaded", function () {
  const placeType = document.getElementById("placeType");
  const ratingFields = document.getElementById("ratingFields");
  const addButton = document.getElementById("addButton");
  const placeList = document.getElementById("placeList");
  const locationInput = document.getElementById("locationInput");

  function updateRatingFields() {
    ratingFields.innerHTML = "";
    const categories =
      placeType.value === "restaurant"
        ? ["Location", "Menu", "Service", "Price", "Special"]
        : ["Location", "Service", "Room", "Price", "Breakfast"];

    categories.forEach((category) => {
      const label = document.createElement("label");
      label.textContent = `${category}: `;
      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 10;
      input.value = 5;
      input.className = "ratingInput";
      ratingFields.appendChild(label);
      ratingFields.appendChild(input);
    });
  }

  function fetchSuggestions(query) {
    if (query.length < 3) return; // Prevent too many requests for short inputs

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        const datalist = document.getElementById("locationSuggestions");
        datalist.innerHTML = ""; // Clear previous suggestions

        data.forEach(({ display_name }) => {
          const option = document.createElement("option");
          option.value = display_name;
          datalist.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching suggestions:", error));
  }

  function addPlace() {
    const name = document.getElementById("placeInput").value.trim();
    const locationQuery = locationInput.value.trim();
    if (!name || !locationQuery)
      return alert("Please enter a place name and location.");

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        locationQuery
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched location data:", data); // ✅ Debugging log

        if (data.length === 0) {
          alert("Location not found!");
          return;
        }

        const lat = data[0].lat;
        const lon = data[0].lon;

        const locationURL = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=17`;

        const ratings = [...document.querySelectorAll(".ratingInput")].map(
          (input) => input.value
        );
        const categories =
          placeType.value === "restaurant"
            ? ["Location", "Menu", "Service", "Price", "Special"]
            : ["Location", "Service", "Room", "Price", "Breakfast"];

        const place = {
          name,
          type: placeType.value,
          ratings,
          locationURL,
          display_name: data[0].display_name,
        };

        let places = JSON.parse(localStorage.getItem("places")) || [];
        places.push(place);
        localStorage.setItem("places", JSON.stringify(places));

        document.getElementById("placeInput").value = "";
        locationInput.value = "";
        updateRatingFields();
        renderList();
      })
      .catch((error) => console.error("Error fetching location:", error));
  }

  function renderList() {
    placeList.innerHTML = "";
    let places = JSON.parse(localStorage.getItem("places")) || [];

    places.forEach(({ name, type, ratings, location, display_name }) => {
      const categories =
        type === "restaurant"
          ? ["Location", "Menu", "Service", "Price", "Special"]
          : ["Location", "Service", "Room", "Price", "Breakfast"];

      const ratingText = categories
        .map((cat, i) => `${cat}: ${ratings[i]}`)
        .join(" | ");

      const li = document.createElement("li");
      li.innerHTML = `<strong>${name}</strong> (${type})<br>
                                    ${ratingText}<br>
                                    <a href="${location}" target="_blank">📍Show in Map</a>`;
      placeList.appendChild(li);
    });
  }

  placeType.addEventListener("change", updateRatingFields);
  addButton.addEventListener("click", addPlace);
  locationInput.addEventListener("input", (e) =>
    fetchSuggestions(e.target.value)
  );

  updateRatingFields();
  renderList();
});
