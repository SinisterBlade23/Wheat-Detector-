// Global state management
let isFileDialogOpen = false;
let activeStream = null;

// DOM ready handler
document.addEventListener('DOMContentLoaded', function () {

    function getElement(id) {
        const el = document.getElementById(id);
        if (!el) console.error(`❌ Element not found: ${id}`);
        return el;
    }

    // Cache DOM elements
    const elements = {
        video: getElement('video'),
        canvas: getElement('canvas'),
        ctx: getElement('canvas').getContext('2d'),
        takepic: getElement('takepic'),
        capture: getElement('capture'),
        retake: getElement('retake'),
        fileInput: getElement('fileInput'),
        analyzedImage: getElement('analyzedImage'),
        analysisResults: getElement('analysisResults'),
        analysisDate: getElement('analysisDate'),
        diseaseName: getElement('diseaseName'),
        diseaseDescription: getElement('diseaseDescription'),
        confidence: getElement('confidence'),
        severityBadge: getElement('severityBadge'),
        treatmentsList: getElement('treatmentsList'),
        preventiveList: getElement('preventiveList')
    };

    // Ensure Analysis Section is Hidden Initially
    elements.analysisResults.style.display = 'none';

    // Function to generate confidence percentage (75% - 100%) and determine severity
    // function generateConfidence() {
    //     const confidence = Math.floor(Math.random() * 26) + 75; // Random 75 - 100%
    //     let severityLevel = "Low Severity";
    //     let severityClass = "low-severity"; // Default class for styling
    
    //     if (confidence >= 96) {
    //         severityLevel = "High Severity";
    //         severityClass = "high-severity"; // Apply high severity class (Red)
    //     } else if (confidence >= 86) {
    //         severityLevel = "Medium Severity";
    //         severityClass = "medium-severity"; // Apply medium severity class (Yellow)
    //     }
    
    //     // Apply class instead of inline styles (better for maintainability)
    //     elements.severityBadge.className = `severity-badge ${severityClass}`;
    
    //     return { confidence, severityLevel };
    // }
    

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
        },

        analyzeImage: function(file) {
            const formData = new FormData();
            formData.append('cropImage', file); // Ensure 'cropImage' matches backend

            showLoader();

            elements.diseaseDescription.textContent = "";  // 7:13

            console.log("📤 Sending image for analysis...");
            fetch('/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {

                hideLoader();
                console.log("✅ Received response:", data);

                if (data.error) {
                    alert('❌ Analysis failed: ' + data.error);
                    return;
                }

                // Generate confidence and severity
                //const { confidence, severityLevel } = generateConfidence();

                // Update UI with analysis data


                // confidence start 
                elements.diseaseName.textContent = data.disease || "Unknown Disease";
                elements.confidence.textContent = `Confidence: ${data.confidence.toFixed(2)}%`;
                elements.confidence.style.display = "inline-block";

                elements.diseaseDescription.textContent = data.definition || "No description available.";
                // Set severity based on confidence
                let severityLevel, severityClass;
                if (data.confidence >= 96) {
                  severityLevel = "High Severity";
                  severityClass = "high-severity";
                } else if (data.confidence >= 86) {
                  severityLevel = "Medium Severity";
                  severityClass = "medium-severity";
                } else {
                  severityLevel = "Low Severity";
                  severityClass = "low-severity";
                }
                elements.severityBadge.textContent = severityLevel;
                elements.severityBadge.className = `severity-badge ${severityClass}`;
                elements.severityBadge.style.display = "inline-block";
             
                

                // confidence end 

                // Populate treatments
                elements.treatmentsList.innerHTML = "";
                if (data.treatments && data.treatments.length > 0) {
                    data.treatments.forEach(treatment => {
                        let li = document.createElement('li');
                        li.textContent = treatment;
                        elements.treatmentsList.appendChild(li);
                    });
                } else {
                    elements.treatmentsList.innerHTML = "<li>No treatments available.</li>";
                }

                // Populate preventive measures
                elements.preventiveList.innerHTML = "";
                if (data.preventiveMeasures && data.preventiveMeasures.length > 0) {
                    data.preventiveMeasures.forEach(measure => {
                        let li = document.createElement('li');
                        li.textContent = measure;
                        elements.preventiveList.appendChild(li);
                    });
                } else {
                    elements.preventiveList.innerHTML = "<li>No preventive measures available.</li>";
                }

                // Show the results section
                elements.analysisResults.style.display = 'block';

            })
            .catch(error => {
                hideLoader();
                console.error('❌ Error:', error);
                alert('❌ Error analyzing image.');
            });
        }
    };

    // File Upload Handling
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
            console.log("📸 Image selected:", file.name);
            helpers.stopCameraStream();
            helpers.displayImage(URL.createObjectURL(file));
            helpers.analyzeImage(file);
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
                    elements.capture.style.visibility = 'visible';
                })
                .catch(function(error) {
                    console.error('Camera error:', error);
                    alert('Could not access camera. Please check permissions.');
                });
        } else {
            alert("Your browser doesn't support camera access.");
        }
    });

    elements.capture.addEventListener('click', function() {
        elements.ctx.drawImage(elements.video, 0, 0, elements.canvas.width, elements.canvas.height);

        elements.video.style.display = 'none';
        elements.capture.style.visibility = 'hidden';
        elements.canvas.style.display = 'block';
        elements.retake.style.display = 'block';

        const imageUrl = elements.canvas.toDataURL('image/png');
        helpers.displayImage(imageUrl);
        helpers.stopCameraStream();
    });

    elements.retake.addEventListener('click', function() {
        elements.video.style.display = 'block';
        elements.canvas.style.display = 'none';
        elements.retake.style.display = 'none';
        elements.capture.style.visibility = 'visible';
        elements.analysisResults.style.display = 'none';
        elements.takepic.click();
    });
});

// Utility functions
function toggleDropdown(id) {
    document.getElementById(id).classList.toggle('active');
}

function saveToHistory() {
    alert('✅ Analysis saved to history!');
}

function downloadReport() {
    alert('📥 Downloading report...');
}


function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}