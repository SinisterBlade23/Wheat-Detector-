🌾 Krishi-Kavach: AI-Powered Crop Disease Detection
Krishi-Kavach is a web-based application that utilizes AI-driven image analysis to detect crop diseases. Users can upload an image of their crop, and the system will predict the disease, provide a confidence score, and recommend treatments and preventive measures.

🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express, Multer

AI Model: Python, TensorFlow, OpenCV

Database: JSON-based disease storage (can be extended to PostgreSQL/MongoDB)

🔹 Features
✅ Upload or capture crop images for disease analysis
✅ AI-based disease prediction with confidence score
✅ Recommended treatments and preventive measures
✅ Dynamic and responsive web interface

🚀 How It Works
1. User uploads a crop image.

2. The backend (Node.js + Express) processes the image and sends it to the AI model (Python + TensorFlow).

3. The model predicts the disease and returns a confidence score.

4. The backend fetches disease details from a JSON database and sends the response to the frontend.

5. The frontend displays the disease name, confidence level, severity, treatments, and preventive measures.

