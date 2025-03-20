const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../Frontend')));

// Load crop disease data
const cropDataPath = path.join(__dirname, '../Frontend/crop_disease.json');
const cropData = JSON.parse(fs.readFileSync(cropDataPath, 'utf8'));

// Serve home.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/home.html'));
});

// Serve analyze.html
app.get('/analyze', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/analyze.html'));
});

// Serve dashboard.html
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dashboard.html'));
});

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Handle image upload & prediction
app.post('/predict', upload.single('cropImage'), (req, res) => {
    if (!req.file) {
        console.error("❌ No file uploaded.");
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const imagePath = path.resolve(__dirname, 'uploads', req.file.filename);
    console.log(`✅ Image received: ${imagePath}`);

    // Run Python model
    exec(`python predict.py "${imagePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error("❌ Error executing predict.py:", stderr);
            return res.status(500).json({ error: 'Prediction failed.', details: stderr });
        }

        console.log(`📌 Raw model output: ${stdout.trim()}`);

        try {
            const result = JSON.parse(stdout.trim());
            console.log(`✅ Parsed result:`, result);

            // Find disease details in JSON file
            const diseaseDetails = cropData.crop_diseases.find(d => 
                d.name.toLowerCase() === result.disease.toLowerCase()
            );

            if (!diseaseDetails) {
                console.error("❌ Disease not found in database.");
                return res.status(404).json({ error: 'Disease details not found.' });
            }

            res.json({
                disease: diseaseDetails.name,
                confidence: result.confidence || "--", // Confidence from model
                definition: diseaseDetails.definition || "No definition available.",
                treatments: diseaseDetails.recommended_treatments || ["No treatments available."],
                preventiveMeasures: diseaseDetails.preventive_measures || ["No preventive measures available."],
                imageUrl: `/uploads/${req.file.filename}`
            });
        } catch (parseError) {
            console.error("❌ Error parsing model output:", parseError);
            res.status(500).json({ error: 'Invalid model output.', details: stdout.trim() });
        }
    });
});

// Fetch disease details separately (Optional API)
app.get('/disease/:name', (req, res) => {
    const diseaseName = req.params.name.toLowerCase();
    const disease = cropData.crop_diseases.find(d => d.name.toLowerCase() === diseaseName);

    if (disease) {
        res.json(disease);
    } else {
        res.status(404).json({ message: 'Disease not found' });
    }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
