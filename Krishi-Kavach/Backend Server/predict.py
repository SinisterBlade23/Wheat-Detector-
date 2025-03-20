import os
import sys
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import json  # Import JSON for clean output

# Suppress TensorFlow warnings/logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
sys.stdout.reconfigure(encoding='utf-8')

# Load trained model
model_path = os.path.join(os.path.dirname(__file__), 'wheat_leaf_densenet.h5')

try:
    model = tf.keras.models.load_model(model_path, compile=False)
except Exception as e:
    print(json.dumps({"error": f"Error loading model: {str(e)}"}))  # Return error as JSON
    sys.exit(1)

# Ensure an image path is provided
if len(sys.argv) < 2:
    print("⚠️ No image path provided. Using default test image.")
    img_path = os.path.join(os.path.dirname(__file__), r'uploads\tan_spot_94.png')
    print(img_path)
else:
    img_path = sys.argv[1]


# Validate if file exists
if not os.path.exists(img_path):
    print(json.dumps({"error": "File not found."}))
    sys.exit(1)

def predict_image(img_path):
    try:
        # Load and preprocess image
        img = image.load_img(img_path, target_size=(224, 224))  
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0) / 255.0  # Normalize

        # Make prediction
        preds = model.predict(x,verbose=0)
        class_idx = np.argmax(preds[0])

        # Define class labels
        class_labels = [
            'Aphid', 'Black Rust', 'Blast', 'Brown Rust', 'Common Root Rot',
            'Fusarium Head Blight', 'Healthy', 'Leaf Blight', 'Mildew', 'Mite',
            'Septoria', 'Smut', 'Stem Fly', 'Tan Spot', 'Yellow Rust'
        ]
        
        predicted_class = class_labels[class_idx]

        # Return JSON output
        return json.dumps({"disease": predicted_class})

    except Exception as e:
        return json.dumps({"error": f"Prediction error: {str(e)}"})

# Print JSON result
print(predict_image(img_path))
