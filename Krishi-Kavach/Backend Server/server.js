const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../Frontend')));

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

        console.log(`📌 Raw model output: ${stdout.trim()}`);  // Log raw output

        try {
            const result = JSON.parse(stdout.trim());  // ✅ Parse JSON output
            console.log(`✅ Parsed result:`, result);  // Log parsed JSON

            res.json({
                disease: result.disease,  // ✅ Send correct key
                imageUrl: `/uploads/${req.file.filename}`
            });
        } catch (parseError) {
            console.error("❌ Error parsing model output:", parseError);
            res.status(500).json({ error: 'Invalid model output.' });
        }
    });
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
