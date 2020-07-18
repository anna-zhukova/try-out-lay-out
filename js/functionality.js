var canvas = document.querySelector("#canvas");
// currently selected item
var selected = null;

// returns top and left of the center of the canvas
function calculateCenter(elem) {
  return {
    top:  canvas.offsetTop + canvas.getBoundingClientRect().height / 2 - elem.getBoundingClientRect().height / 2,
    left: canvas.offsetLeft + canvas.getBoundingClientRect().width / 2 - elem.getBoundingClientRect().width / 2
  }
}

// changing selected item
// removing selected class from the previous selected item
// adding selected class to the new selected item
function changeSelected(elem) {
  if (selected != null) {
      selected.classList.remove("selected");
  }
  selected = elem;
  elem.classList.add("selected");
}

// selecting elements from the menu
// adding each of them functionality to add their copies to canvas
var elements = document.querySelectorAll(".dropdown-item, .logo");
elements.forEach(createMovableCopy);

function createMovableCopy(item) {
  item.addEventListener("click", () => {
    copyItem(item);
  });

  function copyItem(item) {
    let newElement;
    // https://www.youtube.com/watch?v=zjYgz50E0mA

    // create copy for image, logo or shape
    if (item.classList.contains("logo") || item.classList.contains("image")) {
      newElement = item.cloneNode(true);

      // remove original classes
      if (newElement.classList.contains("menu-item")) {
        newElement.classList.remove("menu-item");
      } else {
        newElement.classList.remove("dropdown-item");
      }
    }

    // append text according to the icon
    else {
      if (item.classList.contains("shape-menu")) {
        newElement = document.createElement("div");
        if (item.classList.contains("circle")) {
          newElement.classList.add("ellipse");
        }
        newElement.classList.add("shape");

      } else {
        newElement = document.createElement("img");
        switch (true) {
          case item.classList.contains("header"):
            newElement.src = "images/text/heading-b.png";
            newElement.style.width = "220px";
            newElement.style.height = "42px";
            newElement.classList.add("heading");
            break;
          case item.classList.contains("left-sub"):
            newElement.src = "images/text/l-sub-b.png";
            newElement.style.width = "390px";
            newElement.style.height = "76px";
            newElement.classList.add("left");
            newElement.classList.add("sub");
            break;
          case item.classList.contains("center-sub"):
            newElement.src = "images/text/c-sub-b.png";
            newElement.style.width = "390px";
            newElement.style.height = "76px";
            newElement.classList.add("center");
            newElement.classList.add("sub");
            break;
          case item.classList.contains("left-body"):
            newElement.src = "images/text/l-body-b.png";
            newElement.style.width = "586px";
            newElement.style.height = "198px";
            newElement.classList.add("left");
            newElement.classList.add("body");
            break;
          case item.classList.contains("center-body"):
            newElement.src = "images/text/c-body-b.png";
            newElement.style.width = "586px";
            newElement.style.height = "198px";
            newElement.classList.add("center");
            newElement.classList.add("body");
            break;
          default:
            alert("Sorry, something went wrong while adding text to the canvas.");
        }
        newElement.classList.add("text");
      }
    }

    newElement.classList.add("canvas-item");
    canvas.appendChild(newElement);

    // place new element in the center of the canvas
    let pos = calculateCenter(newElement);
    newElement.style.top = pos.top + "px";
    newElement.style.left = pos.left + "px";

    evaluate();

    changeSelected(newElement);
    newElement.addEventListener("click", function() {
      changeSelected(newElement);
    });
  }
}

// https://stackoverflow.com/questions/41725725/access-css-variable-from-javascript
// change the old text image source to the new according to the chosen color
function getNewSource(source, color) {
  return source.slice(0, (source.length) - 5) + color + source.slice((source.length) - 4, source.length);
}

var colorBttns = document.querySelectorAll(".recolor-bttn");

//  get the color code value for each button
var colorBttn1 = getComputedStyle(document.getElementById("green")).getPropertyValue("background-color");
var colorBttn2 = getComputedStyle(document.getElementById("yellow")).getPropertyValue("background-color");
var colorBttn3 = getComputedStyle(document.getElementById("light")).getPropertyValue("background-color");
var colorBttn4 = getComputedStyle(document.getElementById("dark")).getPropertyValue("background-color");

colorBttns.forEach(recolorSelected);

function recolorSelected(button) {
  button.addEventListener("click", () => {
    if (selected === null) {
      alert("Sorry, you haven't selected any elements.");

    } else if (selected.classList.contains("text")) {
      // recolor text depending on which recolor button was clicked
      switch (button.id) {
        case "green":
          selected.src = getNewSource(selected.src, "g");
          break;
        case "yellow":
          selected.src = getNewSource(selected.src, "y");
          break;
        case "light":
          selected.src = getNewSource(selected.src, "l");
          break;
        case "dark":
          selected.src = getNewSource(selected.src, "d");
          break;
        default:
          alert("Sorry, something went wrong while recoloring text");
      }
      evaluate();

    } else if (selected.classList.contains("shape")) {
      // recolor item depending on which recolor button was clicked
      switch (button.id) {
        case "green":
          selected.style.backgroundColor = colorBttn1;
          break;
        case "yellow":
          selected.style.backgroundColor = colorBttn2;
          break;
        case "light":
          selected.style.backgroundColor = colorBttn3;
          break;
        case "dark":
          selected.style.backgroundColor = colorBttn4;
          break;
        default:
          alert("Sorry, something went wrong while recoloring element.");
      }
      evaluate();
    }
  });
}


/* CANVAS RESIZING */
// https://www.youtube.com/watch?v=BjcpcpkZKqE
// https://stackoverflow.com/questions/49268659/javascript-get-100vh-in-pixels

// calculate viewport width in pixels
function vwToPixels(value) {
  return Math.round(window.innerWidth / (100 / value)) + 'px';
}

// get original width and height of canvas
var width = canvas.style.width;
var height = canvas.style.height;

var landscape = document.querySelector("#landscape");
var square = document.querySelector("#square");
var portrait = document.querySelector("#portrait");

landscape.onclick = function() {
  canvas.style.width = width;
  evaluate();
};

square.onclick = function() {
  canvas.style.width = height;
  evaluate();
};

portrait.onclick = function() {
  canvas.style.width = vwToPixels(32);
  evaluate();
};

/* BUTTONS */
var resetButton = document.getElementById("reset");
var deleteButton = document.getElementById("delete");
var frontButton = document.getElementById("front");


resetButton.onclick = function() {
  let button = document.querySelector(".btn-ratio");
  button.classList.add("disabled");
  button.style.color = "#DCDCDC";
  document.querySelector("#ratio").innerHTML = "";

  canvas.innerHTML = "";
  selected = null;
  evaluate();
};

deleteButton.onclick = function() {
  if (selected === null) {
    alert("You haven't selected any elements.");
  } else {
    let toDelete = selected; // da sa na 2 riadky?
    selected = null;
    toDelete.remove();
  }
  evaluate();
};

frontButton.onclick = function() {
  if (selected === null) {
    alert("You haven't selected any elements.");
  } else {
    canvas.removeChild(selected);
    canvas.appendChild(selected);
  }
  evaluate();
};
