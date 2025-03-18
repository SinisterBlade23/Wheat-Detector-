import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam
import os

# Path to your dataset directory
base_dir = '/home/rushil/data/'  # Update this to your actual path

# Data generators with training/validation split
train_datagen = ImageDataGenerator(
    rescale=1.0/255.0,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    validation_split=0.2  # Use 20% of the data for validation
)

train_generator = train_datagen.flow_from_directory(
    base_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='training'  # Set as training data
)

val_generator = train_datagen.flow_from_directory(
    base_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='validation'  # Set as validation data
)

# Load pre-trained DenseNet121 model + higher level layers
base_model = DenseNet121(weights='imagenet', include_top=False)

# Add global average pooling layer
x = base_model.output
x = GlobalAveragePooling2D()(x)

# Add fully connected layer and a logistic layer with 3 classes
predictions = Dense(3, activation='softmax')(x)

# Model to train
model = Model(inputs=base_model.input, outputs=predictions)

# Freeze all convolutional DenseNet layers
for layer in base_model.layers:
    layer.trainable = False

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.001), loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(
    train_generator,
    epochs=3,
    validation_data=val_generator
)

# Save the trained model
model.save('wheat_leaf_densenet.h5')
