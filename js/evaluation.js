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
    if (intersectArea >= rectArea * 0.7) {
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
    y: (rect.top + rect.height / 2),
  }
  let opticalCenter = {
    x: (canvasRect.left + canvasRect.width / 2),
    y: (canvasRect.height * 0.46) + canvasRect.top
  }

  let xDiff = Math.round(objCenter.x - opticalCenter.x)
  let horizontal = ""
  if (xDiff < 0) {
    horizontal += Math.abs(xDiff) + " pixel" + (Math.abs(xDiff) === 1 ? " to the right" : "s to the right")
  } else if (xDiff > 0){
    horizontal += xDiff + " pixel" + (xDiff === 1 ? " to the left" : "s to the left")
  }

  let yDiff = Math.round(objCenter.y - opticalCenter.y)
  let vertical = ""
  if (yDiff < 0) {
    vertical += Math.abs(yDiff) + " pixel" + (Math.abs(yDiff)  === 1  ? " to the bottom" : "s to the bottom")
  } else if (yDiff > 0){
    vertical += yDiff + " pixel" + (yDiff === 1 ? " to the top" : "s to the top")
  }

  if (horizontal.length > 0 && vertical.length > 0) {
    return horizontal + " and " + vertical + ".\r\n"
  }
  return horizontal + vertical + ".\r\n"
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
  "optical": 1,
  "border": 2,
  "overlapping": 3,
  "balance": 4,
  "centerAlignment": 5,
  "inconsistentAlignment": 6,
  "textUnderAll": 7,
  "textUnderText": 8,
  "textUnderElem": 9,
  "textOverImage": 10,
  "imageContrast": 11,
  "imagePattern": 12,
  "imageContrastUpper": 13,
  "imageContrastMiddle": 14,
  "imageContrastBottom": 15,
  "shapeContrast": 16,
  "textOverLogo": 17


  // "readability":4
})

function getWarnings(warnings){
  let result = ""

  warnings.forEach(function(value) {
    switch (value) {
      case WarningsEnum.optical:
      result += "Object is not in the optical center. \r\n Optical center is "
      result += helpOpticalCenter(document.querySelectorAll(".canvas-item")[0])
      break;

      case WarningsEnum.border:
      result += "Elements should not be too close to the canvas border.\r\n"
      break;

      case WarningsEnum.overlapping:
      result += "Objects are overlapping.\r\n"
      break;

      case WarningsEnum.balance:
      result += "Composition is not balanced well.\r\n"
      // helpBalanced()
      break;

      case WarningsEnum.centerAlignment:
      result += "Center aligned text should be placed in the center of the canvas.\r\n"
      break;

      case WarningsEnum.inconsistentAlignment:
      result += "Inconsistent text alignment.\r\n"
      break;

      case WarningsEnum.textUnderAll:
      result += "Texsts are overlapping.\r\nText is underneath other elements and it can't bee seen.\r\n"
      break;

      case WarningsEnum.textUnderText:
      result += "Texsts are overlapping.\r\n"
      break;

      case WarningsEnum.textUnderElem:
      result += "Text is underneath other elements and it can't bee seen.\r\n"
      break;

      case WarningsEnum.textOverImage:
      result += "When the text is placed over the image, the image does not convey message as effectively.\r\n"
      break;

      case WarningsEnum.imageContrast:
      result += "Low color contrast between the text and the image.\r\n"
      break;

      case WarningsEnum.imagePattern:
      result += "Text can not be placed over a pattern.\r\n";
      break;

      case WarningsEnum.imageContrastUpper:
      result += "Low color contrast between the text and the upper part of this image.\r\n"
      break;

      case WarningsEnum.imageContrastMiddle:
      result += "Text can not be placed in the middle part of this image.\r\n"
      break;

      case WarningsEnum.imageContrastBottom:
      result += "Low color contrast between the text and the bottom part of this image.\r\n"
      break;

      case WarningsEnum.shapeContrast:
      result += "Text is placed over a shape with the same color.\r\n"
      break;

      case WarningsEnum.textOverLogo:
      result += "Logo and text can not be overlapping.\r\n"
      break;




      default:
      alert("Unknown error appeared")
    }
  })

  return result
}

function markErrors(objects, errors) {
  // console.log("marking errors")
  // console.log(objects)
  // console.log(errors)
  for (i = 0; i < objects.length; i ++) {
    if (errors.includes(objects[i])) {
      objects[i].classList.add("error-blink")
    } else {
      objects[i].classList.remove("error-blink")
    }
  }
}


///////////////////////////////// GENERAL EVAL /////////////////////////////////
function evaluate() {
  let objects = document.querySelectorAll(".canvas-item");
  let warnings = new Set();
  let errors = []
  let evaluation = "";

  if (objects.length === 0) {
    evaluation += "Your canvas is empty!";
  } else if (objects.length === 1) {

    // if (objects[0].classList.contains("text") || objects[0].classList.contains("logo")) {
    //   let readability = checkReadability([objects[0]])
    //   if (readability !== 0) {
    //     warnings.add(readability)
    //     errors.push(objects[0])
    //   }
    // }

    let center = isInOpticalCenter(objects[0])
    if (center !== 0) {
      warnings.add(center)
      errors.push(objects[0])
    }

  } else {
    evaluation += evaluateComposition(objects, warnings, errors);
  }

  if (objects.length > 0 && warnings.size === 0) { // && errors.length === 0
    evaluation = "Composition is OK. \r\n";
  } else if (warnings.size > 0) { // else ??
    evaluation += getWarnings (warnings)
  }

  markErrors(objects, errors)

  let text = document.querySelector(".errors");
  text && (text.innerText = evaluation);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// EVAL /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function evaluateComposition(objects, warnings, errors) {
  let message = "";
  let texts = document.querySelectorAll(".text.canvas-item");
  let textUnder = [];
  let textOver = [];
  let quartersContent = [[], [], [], []];


  // for every object on the canvas
  for (i = 0; i < objects.length; i++) {

    let border = isOnTheBorder(objects[i].getBoundingClientRect());
    if (border !== 0) {
      warnings.add(border)
      errors.push(objects[i])
    }

    // check if all center alligned texts are in the center of the canvas
    if (objects[i].classList.contains("center")) {
      let centerAlignment = isCenterAligned(objects[i]);
      if (!centerAlignment) {
        warnings.add(5)
        errors.push(objects[i])
      }
    }

    for (j = i + 1; j < objects.length; j++) {
      let overlapping = isOverlapping(objects[i], objects[j])
      if (overlapping !== 0) {

        // image can be placed over shape or image in some cases
        if (!((objects[i].classList.contains("image") && objects[j].classList.contains("text")) ||
              (objects[i].classList.contains("shape") && objects[j].classList.contains("text")))) {
          warnings.add(overlapping)
          errors.push(objects[i])
          errors.push(objects[j])
        }

        // create list of pairs of the items where one of them is text
        if (objects[i].classList.contains("text")) {
          textUnder.push([objects[i], objects[j]]);
        } else if (objects[j].classList.contains("text")) {
          textOver.push([objects[i], objects[j]]);
        }
      }
    }

    getQuartersContent(objects[i], quartersContent);
  }

  if (texts.length > 0) {
    let inconsistentAlignment = isCorrectlyAligned(texts)
    if (inconsistentAlignment !== 0) {
      warnings.add(inconsistentAlignment)
    }

    if (textUnder.length > 0) {
      let under = isTextUnder(textUnder)
      if (under !== 0) {
        warnings.add(under)
      }
    }

    if (textOver.length > 0) {
      let toFix = []
      let contrast = textContrast(textOver, toFix)
      if (contrast !== 0) {
        warnings.add(contrast)
        for (i = 0; i < toFix.length; i++) {
          errors.push(toFix[i])
        }
      }
    }
  // message += checkReadability(texts);
  }

  let balance = isBalanced(quartersContent, objects)
  if (balance !== 0) {
    warnings.add(balance)
  }
  return message;
}
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// TODO /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function textContrast(pairs, errors){
  for (i = 0 ; i < pairs.length; i++) {
    let element = pairs[i][0];
    let text = pairs[i][1];

    if (element.classList.contains("image")) {
      var imageContrast = photoOverlapping(element, text)
      if (imageContrast !== 0) {
        errors.push(text)
        return imageContrast
      }
      return 10

    } else if (element.classList.contains("shape")) {

      let textColor = getTextColor(text);
      let shapeColor = getComputedStyle(element).getPropertyValue("background-color");

      if ((textColor === "b" && shapeColor === "rgb(0, 0, 0)") ||
        (textColor === "g" && shapeColor === "rgb(0, 100, 0)") ||
        (textColor === "y" && shapeColor === "rgb(238, 184, 104)") ||
        (textColor === "l" && shapeColor === "rgb(70, 130, 180)") ||
        (textColor === "d" && shapeColor === "rgb(8, 61, 119)")) {
          errors.push(text)
          return 16
      }
      return 0

    } else {
      return 17
    }
  }
  return 0
}

function photoOverlapping(image, text) {
  if (image.classList.contains("plain")) {
    let textColor = getTextColor(text);
    if (textColor === "l" || textColor === "y") {
       return 11
    }
    return 0

  } else if (image.classList.contains("pattern")) {
    return 12

  } else if (image.classList.contains("contrast")) {

    return photoOverlappingContrast(image, text);
  }
}

function photoOverlappingContrast(image, text) {
  let rect = text.getBoundingClientRect();
  let rectArea = rect.width * rect.height;
  let textColor = getTextColor(text);

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

  if (upperIntersectArea >= rectArea * 0.7) {
    if (textColor === "l") {
      return 13
    }
    return 0
  } else if (bottomIntersectArea >= rectArea * 0.7) {
    if (textColor === "y") {
      return 15
    }
    return 0
  }
  return 14
}














// check if distortion occured, add/remove error class depending on it
// function checkDistortion(text, ratio, minRatio, maxRatio) {
//   if (ratio < minRatio || ratio > maxRatio) {
//     text.classList.add("error-blink");
//     return true
//   }
//   text.classList.remove("error-blink");
//   return false
// }

// check if text size is too small, add/remove error class depending on it
function checkSize(text, height, width, minHeight, minWidth) {
  if (height < minHeight || width < minWidth) {
    text.classList.add("error-blink");
    return true
  }
  text.classList.remove("error-blink");
  return false
}

function checkReadability(texts) {
  let message = "";
  let disorted = false;
  let small = false;

  for (i = 0; i < texts.length; i++) {
    let objWidth = texts[i].getBoundingClientRect().width / window.innerWidth * 100
    let objHeight = texts[i].getBoundingClientRect().height / window.innerWidth * 100
    // let ratio = (objWidth / objHeight).toFixed(1)

    if (texts[i].classList.contains("header")) {
      // disorted |= checkDistortion(texts[i], ratio, 3, 4)
      //18pt
      small |= checkSize(texts[i], objHeight, objWidth, 4, 15)

    } else if (texts[i].classList.contains("sub")) {
      // disorted |= checkDistortion(texts[i], ratio, 4.4, 5.5)
      //14pt
      small |= checkSize(texts[i], objHeight, objWidth, 3, 15)
      console.log(objWidth, objHeight)

      //height 0 na zaciatku z nejakeho dovodu

    } else if (texts[i].classList.contains("body")) {
      // disorted |= checkDistortion(texts[i], ratio, 2.0, 2.7)
      //11pt - body
      small |= checkSize(texts[i], objHeight, objWidth, 7.7, 20)
      console.log(objWidth, objHeight)
    }
  }

  if (small) {
    message += ("Text size is too small compared to the size of the canvas, and it can be unreadable.\r\n")
  }
  // if (disorted) {
  //   message += ("Text distortions decreases readability and cannot be tolerated.\r\n")
  // }
  return message
}

//****************************************************************************************************************************************
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// DONE /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//****************************************************************************************************************************************

// return 1 if object is not contained in the optical center area at least 90%
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

  if (intersectArea < rectArea * 0.9) {
    return 1
  }
  return 0
}

// return 2 if object is too close to the canvas border
function isOnTheBorder(objRect) {
  if (canvasRect.left + 20 >= objRect.left || canvasRect.top + 20 >= objRect.top ||
      canvasRect.right - 20 <= objRect.right || canvasRect.bottom - 20 <= objRect.bottom) {
        return 2
    }
  return 0
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

// BALANCE
// if two adjacent quarters of the canvas are empty
// check if all the items are at least centered
function isBalanced(quarters, elements) {
  if ((quarters[0].length === 0 && quarters[1].length === 0) || (quarters[1].length === 0 && quarters[2].length === 0) ||
    (quarters[2].length === 0 && quarters[3].length === 0) || (quarters[3].length === 0 && quarters[0].length === 0)) {
      for (i = 0; i < elements.length; i++) {
        if (!isCenterAligned(elements[i])) {
          return 4;
        }
      }
  }
  return 0;
}

// ALIGNMENT
// returns 6 if the alignment is inconsistent
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
    return 6
  }
  return 0
}

// returns 8 if some texts are overlapping
// returns 9 if some text is underneath other item
// return 7 if both are true
function isTextUnder(pairs) {
  var text = false
  var elem = false
  var noneTexstAreUnder = true

  for (i = 0; i < pairs.length; i++) {
    if (pairs[i][0].classList.contains("text")) {
      if (pairs[i][1].classList.contains("text")) {
        text = true
      } else {
        elem = true
      }
      noneTexstAreUnder &= false
    }
  }

  if (noneTexstAreUnder) {
    return 0
  }
  if (text && elem) {
    return 7
  }
  return text ? 8 : 9
}
