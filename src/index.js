document.addEventListener("DOMContentLoaded", function () {
  const placeType = document.getElementById("placeType");
  const ratingFields = document.getElementById("ratingFields");
  const addButton = document.getElementById("addButton");
  const placeList = document.getElementById("placeList");

  function updateRatingFields() {
    ratingFields.innerHTML = "";
    const categories =
      placeType.value === "restaurant"
        ? ["Location", "Menu", "Service", "Price", "Special"]
        : ["Location", "Service", "Room", "Price", "Breakfast"];

    categories.forEach((category) => {
      const fieldContainer = document.createElement("div");
      fieldContainer.className = "ratingField";

      const label = document.createElement("label");
      label.textContent = `${category}: `;
      label.className = "ratingLabel"; //

      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 10;
      input.value = 5;
      input.className = "ratingInput";

      // Append label and input to container
      fieldContainer.appendChild(label);
      fieldContainer.appendChild(input);
      ratingFields.appendChild(fieldContainer); //
    });
  }

  function addPlace() {
    const name = document.getElementById("placeInput").value.trim();
    if (!name) return alert("Please enter a place name.");

    const ratings = [...document.querySelectorAll(".ratingInput")].map(
      (input) => input.value
    );
    const categories =
      placeType.value === "restaurant"
        ? ["Location", "Menu", "Service", "Price", "Special"]
        : ["Location", "Service", "Room", "Price", "Breakfast"];

    const place = { name, type: placeType.value, ratings };

    let places = JSON.parse(localStorage.getItem("places")) || [];
    places.push(place);
    localStorage.setItem("places", JSON.stringify(places));

    document.getElementById("placeInput").value = "";
    updateRatingFields();
    renderList();
  }

  function renderList() {
    placeList.innerHTML = "";
    let places = JSON.parse(localStorage.getItem("places")) || [];

    places.forEach(({ name, type, ratings }) => {
      const categories =
        type === "restaurant"
          ? ["Location", "Menu", "Service", "Price", "Special"]
          : ["Location", "Service", "Room", "Price", "Breakfast"];

      const ratingText = categories
        .map((cat, i) => `${cat}: ${ratings[i]}`)
        .join(" | ");

      const li = document.createElement("li");
      li.innerHTML = `<strong>${name}</strong> (${type})<br>${ratingText}`;
      placeList.appendChild(li);
    });
  }

  placeType.addEventListener("change", updateRatingFields);
  addButton.addEventListener("click", addPlace);

  updateRatingFields(); // Initialize fields
  renderList(); // Load existing places from storage on page load
});
