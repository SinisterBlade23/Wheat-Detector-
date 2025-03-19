let takepic= document.getElementById('takepic');

let capture= document.getElementById('capture');

let canvas= document.getElementById('canvas');

let ctx = canvas.getContext("2d");
let retake= document.querySelector(".retake");

  takepic.addEventListener('click', () => {




let video = document.getElementById('video');
if (navigator.mediaDevices.getUserMedia){
   navigator.mediaDevices.getUserMedia({video:true}) 
     
     .then(function(s) {
        video.srcObject = s;
        video.play();
        capture.style.visibility = "visible";
        video.style.position = "relative";
        


     })
        .catch(function(error){
            console.error("Unable to get video");
        })
        
     

    }
    else {console.log("No media device found");}
})

capture.addEventListener('click', () => {

    video.style.display = "none";

   
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
    retake.style.display ="block";
    
});

retake.addEventListener('click', () => {
    video.style.display = "block";
    canvas.style.display = "none";
    retake.style.display ="none";
    capture.style.visibility="visible";
});
