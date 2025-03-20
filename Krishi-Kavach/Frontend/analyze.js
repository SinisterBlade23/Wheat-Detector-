let takepic = document.getElementById('takepic');

let capture = document.getElementById('capture');

let canvas = document.getElementById('canvas');

let ctx = canvas.getContext("2d");
let retake = document.querySelector(".retake");

takepic.addEventListener('click', () => {

    let video = document.getElementById('video');
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })

            .then(function (s) {
                video.srcObject = s;
                video.play();
                capture.style.visibility = "visible";
                video.style.position = "relative";



            })
            .catch(function (error) {
                console.error("Unable to get video");
            })



    }
    else { console.log("No media device found"); }
})

capture.addEventListener('click', () => {

    video.style.display = "none";


    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
    retake.style.display = "block";

});

retake.addEventListener('click', () => {
    video.style.display = "block";
    canvas.style.display = "none";
    retake.style.display = "none";
    capture.style.visibility = "visible";
});



// test code

// Function to toggle dropdowns
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.classList.toggle('active');
}

// Function to save to history
function saveToHistory() {
    alert("Analysis saved to history!");
}

// Function to download report
function downloadReport() {
    alert("Downloading report...");
}

// Handle file input change
document.addEventListener('DOMContentLoaded', function () {
    // Hide analysis results by default
    document.getElementById('analysisResults').style.display = 'none';

    // File upload handling
    document.getElementById('fileInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            // Create a URL for the selected image
            const imageUrl = URL.createObjectURL(file);

            // Set the image source
            document.getElementById('analyzedImage').src = imageUrl;

            // Set current date
            const today = new Date();
            document.getElementById('analysisDate').textContent = today.toLocaleDateString();

            // Show the analysis container
            document.getElementById('analysisResults').style.display = 'block';

            // Scroll to the analysis container
            document.getElementById('analysisResults').scrollIntoView({ behavior: 'smooth' });

            // In a real application, you would send the image to your server for analysis
            // and then populate the results with the response data
        }
    });

    // Camera functionality
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('capture');
    const retakeButton = document.querySelector('.retake');
    const takePicButton = document.getElementById('takepic');

    // Take photo button click
    takePicButton.addEventListener('click', function () {
        // Access the user's camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    video.srcObject = stream;
                    video.play();

                    // Show video and capture button
                    video.style.display = 'block';
                    captureButton.style.visibility = 'visible';
                })
                .catch(function (error) {
                    console.error("Camera error: ", error);
                    alert("Could not access camera. Please check permissions.");
                });
        } else {
            alert("Your browser doesn't support camera access.");
        }
    });

    // Capture button click
    captureButton.addEventListener('click', function () {
        const context = canvas.getContext('2d');

        // Draw the video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to image URL
        const imageUrl = canvas.toDataURL('image/png');

        // Set the image source
        document.getElementById('analyzedImage').src = imageUrl;

        // Set current date
        const today = new Date();
        document.getElementById('analysisDate').textContent = today.toLocaleDateString();

        // Show the analysis container
        document.getElementById('analysisResults').style.display = 'block';

        // Hide video elements
        video.style.display = 'none';
        captureButton.style.visibility = 'hidden';
        retakeButton.style.display = 'block';

        // Stop the camera stream
        const stream = video.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }

        // Scroll to the analysis container
        document.getElementById('analysisResults').scrollIntoView({ behavior: 'smooth' });
    });

    // Retake button click
    retakeButton.addEventListener('click', function () {
        // Hide analysis results
        document.getElementById('analysisResults').style.display = 'none';

        // Reset camera
        takePicButton.click();

        // Hide retake button
        retakeButton.style.display = 'none';
    });
});


// test end 