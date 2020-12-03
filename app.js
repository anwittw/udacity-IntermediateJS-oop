// Grab data from dino.json;
// Async to emulate request to server
let getDinoData = async () => {
  const fetchedData = await fetch("./dino.json");
  const data = await fetchedData.json();
  return data.Dinos;
};

//  App logic is defined in main function
function mainFunction() {
  getDinoData()
    .then((fetchedDinos) => {
      //check form inputs before moving on
      if (checkValidity()) {
        // fetch data from form and prepare human object
        human.setHuman();
        // hide form
        toogleElementVisibility("dino-compare");
        toogleElementVisibility("reset-btn");
        // prepare to add tiles, by setting parent
        tiles.setParent("grid");
        // Create Dino Objects from fetched Dinos, as new Dinosaur
        let dinoObjects = [];
        fetchedDinos.forEach((dino) => dinoObjects.push(new Dinosaur(dino)));
        // Add a tile for each Dinosaur
        // Including the comparison using doComparison with return of human.getFeatures as parameter
        dinoObjects.forEach((obj) =>
          tiles.add(
            obj.imagePath,
            obj.alt,
            obj.doComparison(human.getFeatures())
          )
        );
        // shuffle tiles, before adding human tile
        tiles.shuffle();
        // add another tile to tilesArr
        // Here index is given to make sure human is centered
        tiles.add(
          human.getImagePath(),
          "human",
          human.getName(),
          Math.round(dinoObjects.length / 2)
        );
        // Finally append tiles to DOM, to parent
        tiles.append();
      } else {
        // output input errors to screen
        reportValidity();
      }
    })
    // Having a console.log in catch, to add a simple error handling
    .catch((err) => console.log("An error occurred:", err));
}

// Create Dino Constructor

function Dinosaur(dinoData) {
  this.species = dinoData.species;
  this.diet = dinoData.diet;
  this.weight = dinoData.weight;
  this.fact = dinoData.fact;
  this.imagePath = `/images/${dinoData.species.toLowerCase()}.png`;
  this.alt = dinoData.species;
  this.randomComparisonMethod = Math.floor(Math.random() * 3) + 1;
  this.doComparison = function (humanFeaturesObj) {
    switch (this.randomComparisonMethod) {
      //compare weight
      case 1:
        let differenceInWeight = this.weight - humanFeaturesObj.weight;
        if (differenceInWeight > 0) {
          return `The ${this.species} was ${differenceInWeight} lbs heavier than you are!`;
        } else {
          return `Way to go, you heavy weight! You are ${
            differenceInWeight * -1
          } lbs heavier than the ${this.species} was!`;
        }
      //compare diet
      case 2:
        if (this.diet === humanFeaturesObj.diet) {
          return `Awesome, You and ${this.species} both are ${this.diet} - You could have been good friends!`;
        } else {
          return `While you seem to prefer ${humanFeaturesObj.diet}, the ${this.species} was a fond of being a ${this.diet}`;
        }
        break;
      // no comparison this time, return fact
      default:
        return this.fact;
    }
  };
}

// Use IIFE to get human data from form
const human = (function () {
  // Features Object is equivalent to form input ID'S
  // Human Object is created inside IIFE
  // -> revealing module pattern
  const features = {
    name: "",
    weight: 0,
    diet: "",
    feet: 0,
    inches: 0,
  };

  const imgPath = "/images/human.png";

  //Process for each input field
  function processFormData(id) {
    const element = document.getElementById(id);
    if (element) {
      features[id] = element.value;
    }
  }

  function setHuman() {
    // grab relevant DOM Id's from features Object -> features Object single source of truth
    let ids = Object.keys(features);

    ids.forEach((id) => processFormData(id));
  }

  function getName() {
    return features.name;
  }
  function getFeatures() {
    return {
      weight: Number(features.weight),
      diet: features.diet.toLowerCase(),
    };
  }

  function getImagePath() {
    return imgPath;
  }

  return { setHuman, getName, getFeatures, getImagePath };
})();

const tiles = (function () {
  /*
 ---- private Properties ----
    parent -> parent DOM-Element, set with setParent
    tilesArr -> Array of tiles to be appended to parent
    */

  let parent = null;
  let tilesArr = [];

  // Set parent DOM-Element of tiles to be appended, by ID
  function setParent(id) {
    parent = document.getElementById(id);
  }

  // Using the Fisher-Yates Shuffle
  function shuffle() {
    for (let i = tilesArr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [tilesArr[i], tilesArr[j]] = [tilesArr[j], tilesArr[i]];
    }
  }

  // Method to append tiles to parent element
  function append() {
    tilesArr.forEach((tile) => {
      parent.appendChild(tile);
    });
  }

  // Function to create a single tile and add to tilesArr
  // Optional Parameter index -> to add at defined index
  function add(imgPath, alt, punchline, index = null) {
    const tile = document.createElement("div");
    tile.classList.add("grid-item");
    const img = document.createElement("img");
    img.src = imgPath;
    img.alt = alt;
    tile.appendChild(img);
    if (punchline) {
      const text = document.createElement("h4");
      text.innerText = punchline;
      tile.appendChild(text);
    }
    if (index) {
      tilesArr.splice(index, 0, tile);
    } else {
      tilesArr.push(tile);
    }
  }

  // remove all appended tiles from parent, from DOM
  function remove() {
    parent.innerHTML = "";
  }

  return { setParent, append, shuffle, add, remove };
})();

function toogleElementVisibility(id) {
  const element = document.getElementById(id);
  element.classList.toggle("hidden");
}

// submit button execute main function
const submitButton = document.getElementById("btn");
submitButton.addEventListener("click", mainFunction);

const resetButton = document.getElementById("reset-btn");
resetButton.addEventListener("click", resetComparison);

function resetComparison() {
  tiles.remove();
  toogleElementVisibility("dino-compare");
  toogleElementVisibility("reset-btn");
}
// additonal logic to mimicry browsers check logic,
// since inbuild form api is not used
function checkValidity() {
  const inputs = document.querySelectorAll("input,select");
  return Array.prototype.slice
    .call(inputs)
    .every((input) => input.checkValidity());
}

function reportValidity() {
  const inputs = document.querySelectorAll("input,select");
  inputs.forEach((input) => input.reportValidity());
}
