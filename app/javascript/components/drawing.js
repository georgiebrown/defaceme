
function drawing() {
$(function() {
  const csrfToken = document.querySelector('meta[name=csrf-token]').content
  const canvas = document.querySelector("canvas");

  //Set  Canvas size to fill window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Get context
  const context = canvas.getContext("2d");

  //Set Initial 'pen' type
  var strokeColour = "#FF0000";
  var lineWidth = 2;
  var opType = "source-over";
  context.lineCap = "round";

  var prev = {};
  let shouldPaint = false;
  var timeSinceLastSend = Date.now();
  // Mouse Event Listeners
  // mouse down
  document.addEventListener("mousedown", (event) => {
    shouldPaint = true;
    prev.x = event.pageX;;
    prev.y = event.pageY;
  })
  // mouse up
  document.addEventListener("mouseup", (event) => {
    shouldPaint = false;
  })
  // mouse move
  document.addEventListener("mousemove", (event) => {
    //if we are drawing, and its been over 10ms since last update
    if(shouldPaint && Date.now() - timeSinceLastSend > 20){
      //get mouse coords
      var x = event.pageX;
      var y = event.pageY;

      var drawData = {
          from_x: prev.x,
          from_y: prev.y,
          to_x: x,
          to_y: y
      }

      console.log(drawData);
      //create ajax request to /updateline
      //data is prev coordinates and current coordinates and color
      $.ajax({
        method: 'POST',
        url: '/updateline',
        data: {
          from_x: prev.x,
          from_y: prev.y,
          to_x: x,
          to_y: y,
          colour: strokeColour,
          width: lineWidth,
          op_type: opType
        },
        headers: { 'X-CSRF-Token': csrfToken }
      });

      // drawLine
      drawLine(prev.x, prev.y, x, y, strokeColour, lineWidth, opType)

      // Reset time since last send
      timeSinceLastSend = Date.now();
      prev.x = x;
      prev.y = y;
    }
  });

  //Touch Event Listeners
  document.addEventListener("touchstart", (event) => {
    shouldPaint = true;
    var x = event.pageX;
    var y = event.pageY;
    prev.x = x;
    prev.y = y;
  })
  // mobile touch up
  document.addEventListener("touchend", (event) => {
    shouldPaint = false;
  })
  // mobile touch move
  document.addEventListener("touchmove", (event) => {
    if (shouldPaint){
    context.lineTo(event.pageX, event.pageY);
    context.stroke();
    }
  });


  // App.messages = App.cable.subscriptions.create(‘LineChannel’, {
  // received: function(data) {
  //   drawLine(data.fromx, data.fromy, data.tox, data.toy, data.color)
  // }
  // });

  //function to draw a line
  function drawLine(fromx, fromy, tox, toy, strokeColour, lineWidth, opType){
   context.beginPath();

   context.strokeStyle = strokeColour;
   context.lineWidth = lineWidth;
   context.globalCompositeOperation = opType;

   context.moveTo(fromx, fromy);
   context.lineTo(tox, toy);
   context.stroke();
  }

  // changing colour with buttons
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(event) {
      console.log(this)
      event.preventDefault();
      context.strokeStyle = this.style.backgroundColor;
    })
})

  // changing colour with clicks

  let count = 0;

  document.addEventListener('click', (event) => {
    // Could refactor with object i.e.{ 10 => [color, width. optype],... }
    count += 1;
    console.log(count);
     if (count == 10) {
      strokeColour = "#FF0C93";
      lineWidth = 4;
      opType = "source-over";
  } else if (count == 11){
    // eraser tool
      lineWidth = 6;
      opType = "destination-out";
    }
    else if (count == 20){
      strokeColour = "#583B0E";
      lineWidth = 6;
      opType = "source-over";
    }
    else if (count == 25){
      // eraser tool
      lineWidth = 10;
      opType = "destination-out";
    }
    else if (count == 30){
      strokeColour = "#583B0E";
      lineWidth = 10;
      opType = "source-over";
    }
  })

// changing colour with time

// setInterval(function(){
//   context.strokeStyle = "#FF0C93";
//  // do stuff here
// }, 30000);

//CLOUDINARY upload every 1 minute
    var CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/daqhmzr2j/upload'
    var CLOUDINARY_UPLOAD_PRESET = 't6x6glso'
    var folder = 'Defaceme'

setInterval(function(){
  context.strokeStyle = "#583B0E";

   var file = canvas.toDataURL();


    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder)

    axios({
      url: CLOUDINARY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
  }).then(function(res){
    console.log(res);
  }).catch(function(err){
    conosl.error(err);
  });

}, 60000);

  // //clear button
  // document.getElementById('clear').addEventListener('click', function() {
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  // }, false);

  // const saveButton = document.querySelector(".save");
  // saveButton.addEventListener('click', () => {
  //   console.log("clicked")
  //   // document.getElementById("canvasimg").style.border = "2px solid";
  //   var dataURL = canvas.toDataURL();
  //   document.getElementById("canvasimg").src = dataURL;
  //   document.getElementById("canvasimg").style.display = "inline";
  //   document.getElementById("canvasimg").style.backgroundImage = "url('https://res.cloudinary.com/daqhmzr2j/image/upload/v1595396224/Screen_Shot_2020-07-22_at_3.36.06_pm_tzyswl.png')";
  //   imageUrl.push(dataURL);
  // });


  // Draw image

   var img = new Image();   // Create new img element
    img.addEventListener('load', function() {
      context.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
                   0, 0, canvas.width, canvas.height);
  // execute drawImage statements here
  }, false);
  img.setAttribute('crossorigin', 'anonymous');
  img.src = 'https://res.cloudinary.com/daqhmzr2j/image/upload/v1595396224/Screen_Shot_2020-07-22_at_3.36.06_pm_tzyswl.png'; // Set source path


});

}
export { drawing };
