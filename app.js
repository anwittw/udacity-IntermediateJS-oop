let getDinoData = async () => {
  const fetchedData = await fetch("./dino.json");
  const data = await fetchedData.json();
  return data;
};

function mainFunction() {
  getDinoData().then((result) => {
    //!DELETE
    console.log(result.Dinos);
    human.setHuman();
    toogleForm();
  });
}

// Create Dino Constructor

// Create Dino Objects

// Create Human Object

// Use IIFE to get human data from form
let human = (function () {
  // Features Object is equivalent to form input ID'S
  const features = {
    name: "",
    weight: 0,
    diet: "",
    feet: 0,
    inches: 0,
  };

  //Process for each input field
  function processFormData(id) {
    const element = document.getElementById(id);
    if (element && features[id]) {
      features[id] = element.value;
    }
  }

  function setHuman() {
    // grab relevant DOM Id's from features Object -> features Object single source of truth
    let ids = Object.keys(features);
    ids.forEach((id) => processFormData(id));
    //! DELETE
    console.log("processed form:", features);
  }

  function getName() {
    return features.name;
  }
  function getFeetAndInches() {
    return [features.feet, features.inches];
  }
  function getWeight() {
    return features.weight;
  }
  function getDiet() {
    return features.diet;
  }

  return { setHuman, getName, getFeetAndInches, getWeight, getDiet };
})();

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.

// Generate Tiles for each Dino in Array

// Shuffle Dino tiles

//Add Human Tile in middle

// Add tiles to DOM

// Remove form from screen

function toogleForm() {
  const form = document.getElementById("dino-compare");
  form.classList.toggle("hidden");
}

// On button click, prepare and display infographic

const submitButton = document.getElementById("btn");
submitButton.addEventListener("click", mainFunction);
