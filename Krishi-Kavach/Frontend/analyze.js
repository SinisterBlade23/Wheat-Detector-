// Global state management
let isFileDialogOpen = false;
let activeStream = null;

// DOM ready handler
document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements
  const elements = {
    video: document.getElementById('video'),
    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
    takepic: document.getElementById('takepic'),
    capture: document.getElementById('capture'),
    retake: document.querySelector('.retake'),
    fileInput: document.getElementById('fileInput'),
    analyzedImage: document.getElementById('analyzedImage'),
    analysisResults: document.getElementById('analysisResults'),
    analysisDate: document.getElementById('analysisDate')
  };
  
  // Initialize UI state
  elements.analysisResults.style.display = 'none';
  
  // Helper functions
  const helpers = {
    displayImage: function(imageUrl) {
      elements.analyzedImage.src = imageUrl;
      elements.analysisDate.textContent = new Date().toLocaleDateString();
      elements.analysisResults.style.display = 'block';
      elements.analysisResults.scrollIntoView({ behavior: 'smooth' });
    },
    
    stopCameraStream: function() {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
        activeStream = null;
      }
    }
  };
  
  // File upload handling
  elements.fileInput.addEventListener('click', function(event) {
    if (isFileDialogOpen) {
      event.preventDefault();
      return false;
    }
    isFileDialogOpen = true;
  });
  
  elements.fileInput.addEventListener('change', function(event) {
    isFileDialogOpen = false;
    
    const file = event.target.files[0];
    if (file) {
      // Stop any active camera stream when uploading a file
      helpers.stopCameraStream();
      helpers.displayImage(URL.createObjectURL(file));
    }
  });
  
  // Handle dialog cancellation
  window.addEventListener('focus', function() {
    setTimeout(() => { isFileDialogOpen = false; }, 300);
  }, true);
  
  // Camera functionality
  elements.takepic.addEventListener('click', function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          activeStream = stream;
          elements.video.srcObject = stream;
          elements.video.play();
          elements.video.style.display = 'block';
          elements.video.style.position = 'relative';
          elements.capture.style.visibility = 'visible';
        })
        .catch(function(error) {
          console.error("Camera error:", error);
          alert("Could not access camera. Please check permissions.");
        });
    } else {
      alert("Your browser doesn't support camera access.");
    }
  });
  
  elements.capture.addEventListener('click', function() {
    // Draw the video frame to the canvas
    elements.ctx.drawImage(elements.video, 0, 0, elements.canvas.width, elements.canvas.height);
    
    // Hide video elements
    elements.video.style.display = 'none';
    elements.capture.style.visibility = 'hidden';
    elements.canvas.style.display = 'block';
    elements.retake.style.display = 'block';
    
    // Get image and display results
    const imageUrl = elements.canvas.toDataURL('image/png');
    helpers.displayImage(imageUrl);
    
    // Stop the camera stream
    helpers.stopCameraStream();
  });
  
  elements.retake.addEventListener('click', function() {
    // Reset UI
    elements.video.style.display = 'block';
    elements.canvas.style.display = 'none';
    elements.retake.style.display = 'none';
    elements.capture.style.visibility = 'visible';
    elements.analysisResults.style.display = 'none';
    
    // Restart camera
    elements.takepic.click();
  });
});

// Utility functions
function toggleDropdown(id) {
  document.getElementById(id).classList.toggle('active');
}

function saveToHistory() {
  alert("Analysis saved to history!");
}

function downloadReport() {
  alert("Downloading report...");
}
