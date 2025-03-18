import tensorflow as tf
import numpy as np
import cv2
import os
from tensorflow.keras.preprocessing import image

# Load the trained model
model = tf.keras.models.load_model('wheat_disease_model.h5')

# Define class labels (update these based on your dataset classes)
class_labels = ['Healthy', 'Leaf Rust', 'Stem Rust', 'Other Disease']  # Modify accordingly

# Function to preprocess image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Expand dimensions to fit model input
    img_array /= 255.0  # Normalize pixel values
    return img_array

# Function to predict disease
def predict_disease(img_path):
    img_array = preprocess_image(img_path)
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions)  # Get index of highest probability
    confidence = np.max(predictions) * 100  # Confidence percentage
    return class_labels[predicted_class], confidence

# Test with a sample image
sample_image = 'test_wheat_image.jpg'  # Change this to your test image path
if os.path.exists(sample_image):
    disease, confidence = predict_disease(sample_image)
    print(f"Predicted Disease: {disease} (Confidence: {confidence:.2f}%)")
else:
    print("Error: Test image not found. Please provide a valid image path.")
