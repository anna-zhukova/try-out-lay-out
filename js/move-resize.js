// https://interactjs.io

var distortion = false
var prevWidth, prevHeight, prevX, prevY

function getRatio(width, height) {
  return width / height
}

interact('.canvas-item')

  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],

    // enable autoscroll
    autoScroll: true,

    onmove: dragMoveListener
  })

  .resizable({
    edges: { left: true, right: true, bottom: true, top: true },

    modifiers: [
     // keep the edges inside the parent
     interact.modifiers.restrictEdges({
       outer: 'parent'
     }),

     // minimum size
     interact.modifiers.restrictSize({
       min: { width: 48, height: 48 }
     })
    ],

    inertia: true
  })


  .on('resizestart', function(event) {
    var target = event.target
    prevX = (parseFloat(target.getAttribute('data-x')) || 0)
    prevY = (parseFloat(target.getAttribute('data-y')) || 0)
    prevWidth = target.style.width
    prevHeight = target.style.height
  })

  .on('resizemove', function(event) {
    var target = event.target
    var x = (parseFloat(target.getAttribute('data-x')) || 0)
    var y = (parseFloat(target.getAttribute('data-y')) || 0)

    if (event.shiftKey) {
      distortion = false
      // get the aspect ratio of an element
      var ratio = getRatio(target.getBoundingClientRect().width, target.getBoundingClientRect().height)

      // update the element's style
      target.style.width = event.rect.width + 'px'
      target.style.height = event.rect.width / ratio + 'px'

      // translate when resizing from top or left edges
      x += event.deltaRect.left
      y += event.deltaRect.left / ratio

    } else {
      distortion = true

      target.style.width = event.rect.width + 'px'
      target.style.height = event.rect.height + 'px'

      x += event.deltaRect.left
      y += event.deltaRect.top
    }

    target.style.webkitTransform = target.style.transform =
      'translate(' + x + 'px,' + y + 'px)'

    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)

    evaluate()
  })

  .on('resizeend', function(event) {
    var target = event.target
    if (distortion && !(target.classList.contains("logo") )) {

  //     $('#exampleModal').on('show.bs.modal', function (event) {
  //       var button = $(event.relatedTarget) // Button that triggered the modal
  //       var recipient = button.data('whatever') // Extract info from data-* attributes
  //      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  //      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  //     var modal = $(this)
  //     modal.find('.modal-title').text('New message to ' + recipient)
  //     modal.find('.modal-body input').val(recipient)
  //     })


      $('#ratioModal').modal('show')
      document.querySelector("#undo").onclick = function(e){
        target.style.width = prevWidth
        target.style.height = prevHeight

        target.style.webkitTransform = target.style.transform =
          'translate(' + prevX + 'px,' + prevY + 'px)'

        target.setAttribute('data-x', prevX)
        target.setAttribute('data-y', prevY)
      }
    }
  })

function dragMoveListener(event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.webkitTransform = target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
  evaluate()
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener
