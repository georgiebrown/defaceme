import consumer from "./consumer"

consumer.subscriptions.create("DrawingChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    drawLine(data.fromx, data.fromy, data.tox, data.toy, data.strokeColour, data.lineWidth, data.opType);
  }
});

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

  // Draw image
  var img = new Image();   // Create new img element
  img.addEventListener('load', function() {
    context.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
                   0, 0, canvas.width, canvas.height);
  // Load Lines from DB
  loadLines();
  // execute drawImage statements here
  }, false);
  img.setAttribute('crossorigin', 'anonymous');
  img.src = 'https://res.cloudinary.com/daqhmzr2j/image/upload/v1595396224/Screen_Shot_2020-07-22_at_3.36.06_pm_tzyswl.png'; // Set source path

  // ensure canvassize is updated if window is resized
  window.addEventListener('resize', reportWindowSize);

  // Use MemCanvas to store drawings/photo before resize
  var inMemCanvas = document.createElement('canvas');
  var inMemCtx = inMemCanvas.getContext('2d');

  function reportWindowSize() {
    inMemCanvas.width = canvas.width;
    inMemCanvas.height = canvas.height;
    inMemCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, inMemCanvas.width, inMemCanvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.drawImage(inMemCanvas, 0, 0, inMemCanvas.width, inMemCanvas.height, 0, 0, canvas.width, canvas.height);
  }

  function loadLines() {
    const lineDataEle = document.querySelector("#line-data");
    const parsedLines = JSON.parse(lineDataEle.dataset.lines);
    parsedLines.forEach((line) => {
      console.log([parseFloat(line.from_x),
        parseFloat(line.from_y),
        parseFloat(line.to_x),
        parseFloat(line.to_y),
        line.colour,
        line.width,
        line.op_type]);

      drawLine(parseFloat(line.from_x),
        parseFloat(line.from_y),
        parseFloat(line.to_x),
        parseFloat(line.to_y),
        line.colour,
        line.width,
        line.op_type);
    });
  }

  var prev = {};
  let shouldPaint = false;
  var timeSinceLastSend = Date.now();
  // Mouse Event Listeners
  // mouse down
  document.addEventListener("mousedown", (event) => {
    shouldPaint = true;
    prev.x = event.pageX / canvas.width.toFixed(4);
    prev.y = event.pageY / canvas.height.toFixed(4);
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
      var x = event.pageX / canvas.width.toFixed(4);
      var y = event.pageY / canvas.height.toFixed(4);

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
    prev.x = event.changedTouches[0].pageX / canvas.width.toFixed(4);
    prev.y = event.changedTouches[0].pageY / canvas.height.toFixed(4);
  });
  // mobile touch up
  document.addEventListener("touchend", (event) => {
    shouldPaint = false;
  });
  // mobile touch move
  document.addEventListener("touchmove", (event) => {
    //if we are drawing, and its been over 10ms since last update
    if(shouldPaint && Date.now() - timeSinceLastSend > 20){
      //get mouse coords
      var x = event.changedTouches[0].pageX / canvas.width.toFixed(4);
      var y = event.changedTouches[0].pageY / canvas.height.toFixed(4);

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

  // changing colour with buttons
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(event) {
      console.log(this)
      event.preventDefault();
      context.strokeStyle = this.style.backgroundColor;
    });
  });

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
  });

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
});

//function to draw a line
function drawLine(fromx, fromy, tox, toy, strokeColour, lineWidth, opType){
  // Get context
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");

  context.beginPath();

  context.strokeStyle = strokeColour;
  context.lineWidth = lineWidth;
  context.globalCompositeOperation = opType;

  context.moveTo(fromx * canvas.width, fromy * canvas.height);
  context.lineTo(tox * canvas.width, toy * canvas.height);
  context.stroke();
}
