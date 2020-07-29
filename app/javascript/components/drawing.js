
function drawing() {
$(function() {

  const canvas = document.querySelector("canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const context = canvas.getContext("2d");

  context.strokeStyle = "red";
  context.lineWidth = 2;
  context.lineCap = "round";

  let shouldPaint = false;
  // mouse down
  document.addEventListener("mousedown", (event) => {
    shouldPaint = true;
    context.moveTo(event.pageX, event.pageY);
    context.beginPath();
  })
  // mouse up
  document.addEventListener("mouseup", (event) => {
    shouldPaint = false;
  })
  // mouse move
  document.addEventListener("mousemove", (event) => {
    if (shouldPaint){
    context.lineTo(event.pageX, event.pageY);
    context.stroke();
    }
  });

  document.addEventListener("touchstart", (event) => {
    shouldPaint = true;
    context.moveTo(event.pageX, event.pageY);
    context.beginPath();
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
    count += 1;
    console.log(count);
     if (count == 10) {
    context.strokeStyle = "#FF0C93";
    context.lineWidth = 4;
  } else if (count == 11){
    // eraser tool
      context.globalCompositeOperation="destination-out";
      // context.strokeStyle = "#583B0E";
      context.lineWidth = 6;
    }
    else if (count == 20){
      context.globalCompositeOperation="source-over"
      context.strokeStyle = "#583B0E";
      context.lineWidth = 6;
    }
    else if (count == 25){
      // eraser tool
      context.globalCompositeOperation="destination-out";
      // context.strokeStyle = "#583B0E";
      context.lineWidth = 10;
    }
    else if (count == 30){
      context.globalCompositeOperation="source-over"
      context.strokeStyle = "#583B0E";
      context.lineWidth = 10;
    }

  })

  // changing colour with time

setInterval(function(){
  context.strokeStyle = "#FF0C93";
 // do stuff here
}, 30000);

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
