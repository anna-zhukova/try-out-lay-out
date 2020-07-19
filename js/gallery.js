// Open the Modal
function openModal() {
  document.getElementById("gallery").style.display = "block";
}

// Close the Modal
function closeModal() {
  document.getElementById("gallery").style.display = "none";
}

var index = 1;
showImage(index);

// Next/previous controls
function changeImage(n) {
  showImage(index += n);
}

function currentImage(n) {
  showImage(index = n);
}

function showImage(n) {
  var images = document.getElementsByClassName("image");
  if (n > images.length) {index = 1}
  if (n < 1) {index = images.length}
  for (i = 0; i < images.length; i++) {
    images[i].style.display = "none";
  }
  images[index-1].style.display = "block";
}

function filterSelection(c) {
  var x = document.querySelectorAll(".row div");
  if (c == "all") {
    x.forEach(element => element.style.visibility = "visible");
  } else {
    console.log(c)
    console.log(x)
    for (i = 0; i < x.length; i++) {
      console.log(x[i].classList[x[i].classList.length - 1])
      x[i].style.visibility = "hidden";
      if (x[i].classList.contains(c)) {
        x[i].style.visibility = "visible";
      }
    }
  }
}

// filterSelection("all") // Execute the function and show all columns
// function filterSelection(c) {
//   var x = document.getElementsByClassName(".row div");
//   if (c == "all") c = "";
//   // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
//   for (i = 0; i < x.length; i++) {
//     w3RemoveClass(x[i], "show");
//     if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
//   }
// }
//
// // Show filtered elements
// function w3AddClass(element, name) {
//   var i, arr1, arr2;
//   arr1 = element.className.split(" ");
//   arr2 = name.split(" ");
//   for (i = 0; i < arr2.length; i++) {
//     if (arr1.indexOf(arr2[i]) == -1) {
//       element.className += " " + arr2[i];
//     }
//   }
// }
//
// // Hide elements that are not selected
// function w3RemoveClass(element, name) {
//   var i, arr1, arr2;
//   arr1 = element.className.split(" ");
//   arr2 = name.split(" ");
//   for (i = 0; i < arr2.length; i++) {
//     while (arr1.indexOf(arr2[i]) > -1) {
//       arr1.splice(arr1.indexOf(arr2[i]), 1);
//     }
//   }
//   element.className = arr1.join(" ");
// }
//
// // Add active class to the current button (highlight it)
// var btnContainer = document.getElementById("myBtnContainer");
// var btns = btnContainer.getElementsByClassName("btn");
// for (var i = 0; i < btns.length; i++) {
//   btns[i].addEventListener("click", function(){
//     var current = document.getElementsByClassName("active");
//     current[0].className = current[0].className.replace(" active", "");
//     this.className += " active";
//   });
// }
