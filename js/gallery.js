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
