//////////////////////////////// CANVAS RELATED ////////////////////////////////
var canvas = document.querySelector("#canvas");

var canvasRect = canvas.getBoundingClientRect();

var firstQuarter = {
  left:   canvasRect.left,
  top:    canvasRect.top,
  right:  canvasRect.left + canvasRect.width / 2,
  bottom: canvasRect.top + canvasRect.height / 2
}

var secondQuarter = {
  left:   canvasRect.left + canvasRect.width / 2,
  top:    canvasRect.top,
  right:  canvasRect.right,
  bottom: canvasRect.top + canvasRect.height / 2
}

var thirdQuarter = {
  left:   canvasRect.left + canvasRect.width / 2,
  top:    canvasRect.top + canvasRect.height / 2,
  right:  canvasRect.right,
  bottom: canvasRect.bottom
}

var fourthQuarter = {
  left:   canvasRect.left,
  top:    canvasRect.top + canvasRect.height / 2,
  right:  canvasRect.left + canvasRect.width / 2,
  bottom: canvasRect.bottom
}

var canvasQuarters = [firstQuarter, secondQuarter, thirdQuarter, fourthQuarter];

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// HELP /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// http://jsfiddle.net/Lqh3mjr5/
// https://math.stackexchange.com/questions/99565/simplest-way-to-calculate-the-intersect-area-of-two-rectangles
// return intersection area of two items
function calculateIntersectionArea(rect1, rect2) {
  let intersectionX = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
  let intersectionY = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
  return intersectionX * intersectionY;
}

// check if the item is in the center of the canvas
function isCenterAligned(element) {
  let canvasCenter = canvasRect.left + canvasRect.width / 2;
  let rect = element.getBoundingClientRect();
  let elemCenter = {
    left: rect.left + rect.width * 0.4,
    right: rect.right - rect.width * 0.4
  }
  return (elemCenter.left <= canvasCenter && canvasCenter <= elemCenter.right);
}

// adding element into the list of items contained in each quarter
function getQuartersContent(object, quarters) {
  let rect = object.getBoundingClientRect();
  for (c = 0; c < 4; c++) {
    let rectArea = rect.width * rect.height;
    let intersectArea = calculateIntersectionArea(rect, canvasQuarters[c]);
    if (intersectArea >= rectArea * 0.5) {
      quarters[c].push(object);
    }
  }
}

// get color of the text from the name of the file in the source
function getTextColor(text) {
  return text.src.slice((text.src.length) - 5, (text.src.length) - 4);
}

// return message that helps user to put object in the optical center
function helpOpticalCenter(object) {
  let rect = object.getBoundingClientRect();
  let objCenter = {
    x: (rect.left + rect.width / 2),
    y: (rect.top + rect.height / 2)
  }
  let opticalCenter = {
    x: (canvasRect.left + canvasRect.width / 2),
    y: (canvasRect.height * 0.46) + canvasRect.top
  }

  let xDiff = Math.round(objCenter.x - opticalCenter.x);
  let horizontal = "";
  if (xDiff < 0) {
    horizontal += Math.abs(xDiff) + " pixel" + (Math.abs(xDiff) === 1 ? " to the right" : "s to the right");
  } else if (xDiff > 0){
    horizontal += xDiff + " pixel" + (xDiff === 1 ? " to the left" : "s to the left");
  }

  let yDiff = Math.round(objCenter.y - opticalCenter.y);
  let vertical = "";
  if (yDiff < 0) {
    vertical += Math.abs(yDiff) + " pixel" + (Math.abs(yDiff)  === 1  ? " to the bottom" : "s to the bottom");
  } else if (yDiff > 0){
    vertical += yDiff + " pixel" + (yDiff === 1 ? " to the top" : "s to the top");
  }

  if (horizontal.length > 0 && vertical.length > 0) {
    return horizontal + " and " + vertical + ".\r\n";
  }
  return horizontal + vertical + ".\r\n";
}

function helpBalanced() {
  // console.log("helpBalanced")
  // let vertical = document.createElement("div");
  // let horizontal = document.createElement("div");
  //
  // vertical.classList.add("line")
  // vertical.style.height = canvas.style.height
  // vertical.style.width = '1px'
  // vertical.style.top = canvasRect.top + canvasRect.height
  // vertical.style.left = canvasRect.left
  //
  // horizontal.classList.add("line")
  // horizontal.style.width = canvas.style.width
  // horizontal.style.height = '1px'
  // horizontal.style.top = canvasRect.top + canvasRect.height
  // horizontal.style.left = canvasRect.left
  //
  // document.getElementsByTagName("BODY")[0].appendChild(vertical)
  // document.getElementsByTagName("BODY")[0].appendChild(horizontal)
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// HELP /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//****************************************************************************************************************************************

/////////////////////////////////// WARNINGS ///////////////////////////////////
////////////////////////// enumerations with objects ///////////////////////////
// https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/
// https://www.geeksforgeeks.org/object-freeze-javascript/ FEEZE
// https://stackoverflow.com/questions/33124058/object-freeze-vs-const
const WarningsEnum = Object.freeze({
  "border": 1,
  "balance": 2,
  "overlapping": 3,
  "textUnder": 4,
  "logoUnder": 5,
  "textShapeContrast": 6,
  "logoShapeContrast": 7,
  "textOverImage": 8,
  "textImageContrast": 9,
  "textImagePattern": 10,
  "textContrastUpper": 11,
  "textContrastMiddle": 12,
  "textContrastBottom": 13,
  "logoOverImage": 14,
  "logoImagePattern": 15,
  "logoContrastMiddle": 16,
  "textSize": 17,
  "centerAlignment": 18,
  "inconsistentAlignment": 19
})

function showMessage(btn, cnt, msg) {
  let button = document.querySelector(btn);
  button.classList.remove("disabled");
  button.style.color = "#B22222";

  let container = document.querySelector(cnt);
  container.innerHTML += "<p>" + msg + "</p>";
  if (container.id === "balance") {
    container.innerHTML += "<button type='button' class='btn bttn' data-toggle='modal' data-target='#balanceModal'>Show Me Some Examples</button>";
  }
}

let message = "";
function getWarnings(warnings){
  warnings.forEach(function(value) {
    switch (value) {

      case WarningsEnum.border:
      message = "Elements should be kept away from the edges of the page, especially if you want to print your design. Having elements too close to the edge can result in elements getting cut off.";
      showMessage(".btn-border", "#border", message);
      break;

      case WarningsEnum.balance:
      message = "Lack of balance in a design can irritate the viewer and impair communication. Balance is achieved by two forces of equal strength that pull in opposite directions, or by multiple forces pulling in different directions whose strengths offset one another.";
      showMessage(".btn-balance", "#balance", message);
      // helpBalanced(); TODO
      break;

      case WarningsEnum.overlapping:
      message = "In graphic design, overlapping is used to draw attention, create emphasis or depth. Consider moving overlapping elements apart, unless overlapping of elements is wanted.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.textUnder:
      message = "Text is underneath an element and cannot be read. Consider moving text and element apart.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.logoUnder:
      message = "The logotype is a significant part of a design and should not be overlapped by other elements.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.textShapeContrast:
      message = "Text is placed over a shape with the same color, and it cannot be read. Consider changing text or shape color.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.logoShapeContrast:
      message = "The logotype is placed over a shape with the same color. The logotype is a significant part of a design, and it should always be seen. Consider changing shape color.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.textOverImage:
      message = "When text is placed over an image, the image does not convey the message effectively.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.textImageContrast:
      message = "The color contrast between the text and the image is too low. Consider changing text color.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.textImagePattern:
      message = "Text is not visible and should not be placed on a pattern.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.textContrastUpper:
      message = "The color contrast between the text and the upper part of this image is too low. Consider changing text color.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.textContrastMiddle:
      message = "The text should not be placed in the middle of this image. Take into consideration the composition of the image when placing text over an image.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.textContrastBottom:
      message = "The color contrast between the text and the bottom part of this image is too low. Consider changing text color.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.logoOverImage:
      message = "When logotype is placed over an image, the image does not convey the message effectively.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.logoImagePattern:
      message = "The logotype is not visible and should not be placed on a pattern.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.logoContrastMiddle:
      message = "The logotype should not be placed in the middle of this image. Consider the composition of the image when placing a logotype over an image.";
      showMessage(".btn-overlapping", "#overlapping", message);
      break;

      case WarningsEnum.textSize:
      message = "Text size is too small compared to the size of the canvas, and it may be unreadable.";
      showMessage(".btn-text-size", "#text-size", message);
      break;

      case WarningsEnum.centerAlignment:
      message = "The text with center alignment should be placed in the center of the canvas.";
      showMessage(".btn-alignment", "#alignment", message);
      break;

      case WarningsEnum.inconsistentAlignment:
      message = "Different text alignments are used in the design. Inconsistent text alignment can lead to a messy and unstructured design.";
      showMessage(".btn-alignment", "#alignment", message);
      break;

      default:
      alert("Unknown error appeared");
    }
  })
}

function markErrors(objects, errors) {
  for (i = 0; i < objects.length; i ++) {
    if (errors.includes(objects[i])) {
      objects[i].classList.add("message-blink");
    } else {
      objects[i].classList.remove("message-blink");
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// GENERAL EVAL /////////////////////////////////
function evaluate() {
  // hide all messages from last evaluation
  let buttons = document.querySelectorAll(".message-container > a");
  for (i = 0; i < buttons.length; i++) {
    buttons[i].classList.add("disabled");
    buttons[i].style.color = "#DCDCDC";
  }
  var messages = document.querySelectorAll(".collapse");
  for (i = 0; i < messages.length; i++) {
    messages[i].innerHTML = "";
  }

  let objects = document.querySelectorAll(".canvas-item");
  let output = document.querySelector(".output");
  let outputError = document.querySelector(".errorMessage");
  let warnings = new Set();
  let errors = [];

  let message = "";
  let messageError = "";

  if (objects.length === 0) {
    message += "Your canvas is empty!";
  } else if (objects.length === 1) {

    let border = isOnTheBorder(objects[0].getBoundingClientRect());
    if (border !== 0) {
      warnings.add(border);
      errors.push(objects[0]);
    }

    if (objects[0].classList.contains("text")) {
      if (!isReadable(objects[0])) {
        warnings.add(17);
        errors.push(objects[0]);
      }
    }

    if (!isInOpticalCenter(objects[0])) {
      messageError = "Object is not in the optical center. \r\n Optical center is " + helpOpticalCenter(document.querySelectorAll(".canvas-item")[0]);
      errors.push(objects[0]);
    }

  } else {
    evaluateComposition(objects, warnings, errors);
  }

  if (message.length === 0 && warnings.size === 0 && errors.length === 0) {
    message += "Composition is OK. \r\n";
  } else {
    getWarnings (warnings);
  }

  markErrors(objects, errors);
  outputError && (outputError.innerHTML = messageError);
  output && (output.innerHTML = message);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// EVAL /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function evaluateComposition(objects, warnings, errors) {
  let texts = document.querySelectorAll(".text.canvas-item");
  let quartersContent = [[], [], [], []];


  // for every object on the canvas
  for (i = 0; i < objects.length; i++) {

    let border = isOnTheBorder(objects[i].getBoundingClientRect());
    if (border !== 0) {
      warnings.add(border);
      errors.push(objects[i]);
    }

    if (objects[i].classList.contains("text")) {

      // check if all center alligned texts are in the center of the canvas
      if (objects[i].classList.contains("center")) {
        let centerAlignment = isCenterAligned(objects[i]);
        if (!centerAlignment) {
          warnings.add(18);
          errors.push(objects[i]);
        }
      }

      if (!isReadable(objects[i])) {
        warnings.add(17);
        errors.push(objects[i]);
      }
    }

    for (j = i + 1; j < objects.length; j++) {
      let overlapping = isOverlapping(objects[i], objects[j]);
      if (overlapping !== 0) {
        // text is underneath something
        if (objects[i].classList.contains("text")){
            warnings.add(4);
            errors.push(objects[i]);
            errors.push(objects[j]);

        // text is underneath something
        } else if (objects[i].classList.contains("logo")) {
            warnings.add(5);
            errors.push(objects[i]);
            errors.push(objects[j]);

        // only shapes and images are overlapping
        // warn user that objects are overlapping but do not mark it as an error
        } else if (objects[j].classList.contains("shape") || objects[j].classList.contains("image")) {
          warnings.add(overlapping);

        // logo or text are placed over shape or image
        } else {
          let type = objects[j];
          let background = objects[i];

          // check text contrast
          if (type.classList.contains("text")) {
            if (background.classList.contains("shape")) {
              if (!isShapeContrasted(type, background)) {
                warnings.add(6);
                errors.push(type);
              } else {
                warnings.add(3);
              }
            }

            else if (background.classList.contains("image")) {
              let contrast = checkImageContrast(type, background);
              if (contrast !== 0) {
                warnings.add(contrast);
                errors.push(type);
              }
              warnings.add(8);
            }
          }

          // check logo contrast (objects[j].classList.contains("logo"))
          else {
            if (background.classList.contains("shape")) {
              if (getComputedStyle(background).getPropertyValue("background-color") === "rgb(0, 0, 0)") {
                warnings.add(7);
                errors.push(type);
              } else {
                warnings.add(3);
              }
            }

            else if (background.classList.contains("image")) {
              if (background.classList.contains("pattern")) {
                warnings.add(15);
                errors.push(type);
              }
              let composition = checkImageComposition(type, background);
              if (composition !== 0) {
                warnings.add(composition);
                errors.push(type);
              }
              warnings.add(14);
            }
          }
        }
      }
    }

    getQuartersContent(objects[i], quartersContent);
  }

  if (texts.length > 0) {
    let inconsistentAlignment = isCorrectlyAligned(texts);
    if (inconsistentAlignment !== 0) {
      warnings.add(inconsistentAlignment);
    }
  }

  let balance = isBalanced(quartersContent, objects);
  if (balance !== 0) {
    warnings.add(balance);
  }
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// TODO /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// return true if one of the sides is smaller than minimum
function checkSize(width, height, minWidth, minHeight) {
  console.log("actual"+ width + " " + height)
  console.log("min"+ minWidth + " " + minHeight)
  return (width < minWidth || height < minHeight)
}

// return false if text size is too small
function isReadable(text) {
  let small = false;

  let objWidth = text.getBoundingClientRect().width / window.innerWidth * 100;
  let objHeight = text.getBoundingClientRect().height / window.innerWidth * 100;

  console.log("pixels size " + text.getBoundingClientRect().width + " " + text.getBoundingClientRect().height)

  if (text.classList.contains("heading")) {
    small = checkSize(objWidth, objHeight, 6.63, 1.25);

  } else if (text.classList.contains("sub")) {
    small = checkSize(objWidth, objHeight, 17.19, 3.3);

  } else if (text.classList.contains("body")) {
    small = checkSize(objWidth, objHeight, 25.92, 8.57);
  }
  return !small;
}

//****************************************************************************************************************************************
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// DONE /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************************************

// return true if object is contained in the optical center area at least 90%
function isInOpticalCenter(object) {
  let rect = object.getBoundingClientRect();
  let rectArea = rect.width * rect.height;

  let opticalCenter = {
    left:  (canvasRect.left + canvasRect.width / 2) - rect.width / 2,
    top:   (canvasRect.height * 0.46) + canvasRect.top - rect.height / 2,
    right: (canvasRect.left + canvasRect.width / 2) + rect.width / 2,
    bottom:(canvasRect.height * 0.46) + canvasRect.top + rect.height / 2
  }

  let intersectArea = calculateIntersectionArea(rect, opticalCenter);

  return intersectArea >= rectArea * 0.9
}

// return true if text color is different than shape color
function isShapeContrasted(type, shape) {
  let typeColor = getTextColor(type);
  let shapeColor = getComputedStyle(shape).getPropertyValue("background-color");
  return !((typeColor === "b" && shapeColor === "rgb(0, 0, 0)") ||
    (typeColor === "g" && shapeColor === "rgb(0, 100, 0)") ||
    (typeColor === "y" && shapeColor === "rgb(238, 184, 104)") ||
    (typeColor === "l" && shapeColor === "rgb(70, 130, 180)") ||
    (typeColor === "d" && shapeColor === "rgb(8, 61, 119)"))
}

// returns 1 if object is too close to the canvas border
function isOnTheBorder(objRect) {
  if (canvasRect.left + 20 >= objRect.left || canvasRect.top + 20 >= objRect.top ||
      canvasRect.right - 20 <= objRect.right || canvasRect.bottom - 20 <= objRect.bottom) {
        return 1;
    }
  return 0;
}

// BALANCE
// if two adjacent quarters of the canvas are empty
// check if all the items are at least centered
function isBalanced(quarters, elements) {
  if ((quarters[0].length === 0 && quarters[1].length === 0) || (quarters[1].length === 0 && quarters[2].length === 0) ||
    (quarters[2].length === 0 && quarters[3].length === 0) || (quarters[3].length === 0 && quarters[0].length === 0)) {
      for (i = 0; i < elements.length; i++) {
        if (!isCenterAligned(elements[i])) {
          return 2;
        }
      }
  }
  return 0;
}

// https://time2hack.com/checking-overlap-between-elements/
// return 3 if objects are overlapping
function isOverlapping(object1, object2) {
  let rect1 = object1.getBoundingClientRect();
  let rect2 = object2.getBoundingClientRect();
  if (!(rect1.right < rect2.left || rect1.left > rect2.right ||
    rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
      return 3;
  }
  return 0;
}

// check contrast between text and image
function checkImageContrast(text, image) {
  if (image.classList.contains("plain")) {
    let textColor = getTextColor(text);
    if (textColor === "l" || textColor === "y") {
       return 9;
    }
    return 0;

  } else if (image.classList.contains("pattern")) {
    return 10;
  }
  return checkImageComposition(text, image);
}

// check color contrast between type and certain part of an image
function checkImageComposition(type, image) {
  let rect = type.getBoundingClientRect();
  let typeArea = rect.width * rect.height;
  let textColor = getTextColor(type);

  let imgRect = image.getBoundingClientRect();
  let upperPart = {
    left: imgRect.left,
    top: canvasRect.top,
    right: imgRect.right,
    bottom: imgRect.top + imgRect.height * 0.4
  }
  let middlePart = {
    left: imgRect.left,
    top: imgRect.top + imgRect.height * 0.4,
    right: imgRect.right,
    bottom: imgRect.bottom - imgRect.height * 0.3
  }
  let bottomPart = {
    left: imgRect.left,
    top: imgRect.bottom - imgRect.height * 0.3,
    right: imgRect.right,
    bottom: canvasRect.bottom
  }

  let upperIntersectArea = calculateIntersectionArea(rect, upperPart);
  let middleIntersectArea = calculateIntersectionArea(rect, middlePart);
  let bottomIntersectArea = calculateIntersectionArea(rect, bottomPart);

  if (type.classList.contains("logo")) {
    if (middleIntersectArea >= typeArea * 0.7) {
      return 16;
    }
    return 0;
  }

  if (upperIntersectArea >= typeArea * 0.7) {
    if (textColor === "l") {
      return 11;
    }
    return 0;
  } else if (bottomIntersectArea >= typeArea * 0.7) {
    if (textColor === "y") {
      return 13;
    }
    return 0;
  }
  return 12;
}


// ALIGNMENT
// returns 19 if the alignment is inconsistent
function isCorrectlyAligned(texts) {
  let center = false;
  let left = false;

  for (i = 0; i < texts.length; i++) {
    if (texts[i].classList.contains("center")) {
      center = true;
    } else if (texts[i].classList.contains("left")) {
      left = true;
    }
  }

  if (center && left) {
    return 19;
  }
  return 0;
}
