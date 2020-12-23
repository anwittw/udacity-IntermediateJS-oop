/
const $submitButton = document.getElementById("btn");
const $resetButton = document.getElementById("reset-btn");

function toogleElementVisibility(id) {
  const element = document.getElementById(id);
  element.classList.toggle("hidden");
}

function resetComparison() {
  tiles.removeFromDom();
  tiles.empty();
  toogleElementVisibility("dino-compare");
  toogleElementVisibility("reset-btn");
}

function checkInputValidity() {
  const inputs = document.querySelectorAll("input,select");
  return Array.prototype.slice
    .call(inputs)
    .every((input) => input.checkInputValidity());
}

function reportInputValidity() {
  const inputs = document.querySelectorAll("input,select");
  inputs.forEach((input) => input.reportInputValidity());
}

/*
Create the 
- Dinosaur
- Human
- Tiles
Objects.. 
*/

function Dinosaur(dinoData) {
  this.species = dinoData.species;
  this.diet = dinoData.diet;
  this.weight = dinoData.weight;
  this.height = dinoData.height;
  this.fact = dinoData.fact;
  this.imagePath = `/images/${dinoData.species.toLowerCase()}.png`;
  this.alt = dinoData.species;
  this.randomComparisonMethod = Math.floor(Math.random() * 4) + 1;
  this.doComparison = function (humanFeaturesObj) {
    if (this.species === "Pigeon") return this.fact;
    switch (this.randomComparisonMethod) {
      case 1:
        let differenceInWeight = this.weight - humanFeaturesObj.weight;
        if (differenceInWeight > 0) {
          return `The ${this.species} was ${differenceInWeight} lbs heavier than you are!`;
        } else {
          return `Way to go, you heavy weight! You are ${
            differenceInWeight * -1
          } lbs heavier than the ${this.species} was!`;
        }
      case 2:
        if (this.diet === humanFeaturesObj.diet) {
          return `Awesome, You and ${this.species} both are ${this.diet} - You could have been good friends!`;
        } else {
          return `While you seem to prefer ${humanFeaturesObj.diet}, the ${this.species} was a fond of being a ${this.diet}`;
        }
      case 3:
        if (this.height > humanFeaturesObj.height) {
          return `With ${this.height} feet, the ${this.species} was way taller, than you are!`;
        } else {
          return `You are at least ${humanFeaturesObj.height} greater than the ${this.species} was!`;
        }
      default:
        return this.fact;
    }
  };
}

const human = (function () {
  const features = {
    name: "",
    weight: 0,
    diet: "",
    feet: 0,
    inches: 0,
    totalFeet: 0,
  };

  const imgPath = "/images/human.png";

  function processFormData(id) {
    const element = document.getElementById(id);
    if (element) {
      features[id] = element.value;
    }
  }

  function setHuman() {
    let ids = Object.keys(features);
    ids.forEach((id) => processFormData(id));
    calculateTotalFeet();
  }

  function calculateTotalFeet() {
    features.totalFeet = Math.round(
      Number(features.feet) + Number(features.inches) / 12
    );
  }

  function getName() {
    return features.name;
  }

  function getFeatures() {
    return {
      weight: Number(features.weight),
      diet: features.diet.toLowerCase(),
      height: Number(features.totalFeet),
    };
  }

  function getImagePath() {
    return imgPath;
  }

  return { setHuman, getName, getFeatures, getImagePath };
})();

const tiles = (function () {
  let parent = null;
  let tilesArr = [];

  function setParent(id) {
    parent = document.getElementById(id);
  }

  function shuffle() {
    for (let i = tilesArr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [tilesArr[i], tilesArr[j]] = [tilesArr[j], tilesArr[i]];
    }
  }

  function append() {
    let $tilesArr = new DocumentFragment();
    tilesArr.forEach((tile) => $tilesArr.appendChild(tile));
    parent.appendChild($tilesArr);
  }

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

  function removeFromDom() {
    parent.innerHTML = "";
  }

  function empty() {
    tilesArr = [];
  }

  return { setParent, append, shuffle, add, removeFromDom, empty };
})();

/* 
Grabbing data from dino.json, simulating an async request
*/ 

const getDinoData = async () => {
  const fetchedData = await fetch("./dino.json");
  const data = await fetchedData.json();
  return data.Dinos;
};

/*
The mainFunction orchestrates the app logic
*/

function mainFunction() {
  getDinoData()
    .then((fetchedDinos) => {
      if (checkInputValidity()) {
        human.setHuman();
        toogleElementVisibility("dino-compare");
        toogleElementVisibility("reset-btn");
        tiles.setParent("grid");
        let dinoObjects = [];
        fetchedDinos.forEach((dino) => dinoObjects.push(new Dinosaur(dino)));
        dinoObjects.forEach((obj) =>
          tiles.add(
            obj.imagePath,
            obj.alt,
            obj.doComparison(human.getFeatures())
          )
        );
        tiles.shuffle();
        tiles.add(
          human.getImagePath(),
          "human",
          human.getName(),
          Math.round(dinoObjects.length / 2)
        );
        tiles.append();
      } else {
        reportInputValidity();
      }
    })
    .catch((err) => console.log("An error occurred:", err));
}

/*
Coupling main function to the frontend
*/ 

$submitButton.addEventListener("click", mainFunction);
$resetButton.addEventListener("click", resetComparison);
