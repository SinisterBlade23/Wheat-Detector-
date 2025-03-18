import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import matplotlib.pyplot as plt

# Load the trained model
model = tf.keras.models.load_model('wheat_leaf_densenet.h5')

def predict_image(img_path):
    # Load and preprocess the image
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = x / 255.0  # Normalize the image

    # Make predictions
    preds = model.predict(x)
    class_idx = np.argmax(preds[0])

    # Class labels
    class_labels = ['Aphid', 'Black Rust', 'Blast', 'Brown Rust', 'Common Root Rot', 'Fusarium Head Blight', 
                'Healthy', 'Leaf Blight', 'Mildew', 'Mite', 'Septoria', 'Smut', 'Stem fly', 'Tan spot', 'Yellow Rust']
    predicted_class = class_labels[class_idx]

    # Print the prediction
    print(f'Image path: {img_path}')
    print('Predicted class:', predicted_class)

    # Display the image
    plt.imshow(img)
    plt.title(f'Predicted class: {predicted_class}')
    plt.axis('off')
    plt.show()  

# Example usage
img_path = '/home/rushil/rust.jpg'  # Replace with your image path
predict_image(img_path)
