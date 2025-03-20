document.addEventListener("DOMContentLoaded", function () {
    fetchLatestPrediction();
});

// Handle Camera Capture
document.getElementById('takepic').addEventListener('click', () => {
    let video = document.getElementById('video');
    let capture = document.getElementById('capture');

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
                capture.style.visibility = "visible";
            })
            .catch((error) => console.error("Unable to access webcam:", error));
    } else {
        console.log("No media device found");
    }
});

document.getElementById('capture').addEventListener('click', () => {
    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext("2d");

    video.style.display = "none";
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";

    // Convert captured image to file and send for analysis
    canvas.toBlob((blob) => {
        let file = new File([blob], "captured_image.png", { type: "image/png" });
        displayUploadedImage(URL.createObjectURL(blob));
        sendImageForPrediction(file);
    }, 'image/png');
});

// Handle File Upload
document.querySelector('.upload-btn').addEventListener('click', () => {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event) => {
        let file = event.target.files[0];
        if (file) {
            displayUploadedImage(URL.createObjectURL(file));
            sendImageForPrediction(file);
        }
    };
    fileInput.click();
});

// Display uploaded image inside the upload box
function displayUploadedImage(imageSrc) {
    let uploadBox = document.querySelector('.upload-box');
    uploadBox.innerHTML = `<img src="${imageSrc}" alt="Uploaded Image" style="max-width: 100%; height: auto; border-radius: 10px;">`;
}

// Send Image for Prediction
function sendImageForPrediction(file) {
    let formData = new FormData();
    formData.append('cropImage', file);

    fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("📌 Received response:", data); // ✅ Log full response

        if (data.error) {
            document.getElementById('disease-name').innerText = "Prediction failed: " + data.error;
        } else {
            document.getElementById('disease-name').innerText = data.disease; // ✅ Corrected key
        }
    })
    .catch(error => console.error('❌ Error in fetch:', error));
}
// Fetch Latest Prediction
function fetchLatestPrediction() {
    fetch('http://localhost:5000/latest-prediction')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('disease-name').innerText = "Error: " + data.error;
            } else {
                document.getElementById('disease-name').innerText = data.disease;
            }
        })
        .catch(error => console.error("Error fetching latest prediction:", error));
}
