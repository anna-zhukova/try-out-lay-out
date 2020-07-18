// https://interactjs.io

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
       min: { width: 50, height: 50 }
     })
    ],

    inertia: true
  })

  .on('resizemove', function(event) {
    var target = event.target
    var x = (parseFloat(target.getAttribute('data-x')) || 0)
    var y = (parseFloat(target.getAttribute('data-y')) || 0)

    if (event.shiftKey) {
      // get the aspect ratio of an element
      var ratio = getRatio(target.getBoundingClientRect().width, target.getBoundingClientRect().height)

      // update the element's style
      target.style.width = event.rect.width + 'px'
      target.style.height = event.rect.width / ratio + 'px'

      // translate when resizing from top or left edges
      x += event.deltaRect.left
      y += event.deltaRect.left / ratio

    } else {
      let button = document.querySelector('.btn-ratio')
      button.classList.remove('disabled')
      button.style.color = 'black'

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
