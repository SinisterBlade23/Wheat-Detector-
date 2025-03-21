import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam

# Paths to dataset
train_dir = '/home/rushil/data/train'  
val_dir = '/home/rushil/data/valid'  

# Data generators (without validation_split since we have separate folders)
train_datagen = ImageDataGenerator(
    rescale=1.0/255.0,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(rescale=1.0/255.0)

# Load training data
train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical'
)

# Load validation data
val_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical'
)

# Debugging: Check if all 15 classes are detected
print("Train classes:", train_generator.class_indices)
print("Number of train classes:", len(train_generator.class_indices))

print("Validation classes:", val_generator.class_indices)
print("Number of validation classes:", len(val_generator.class_indices))

# Load pre-trained DenseNet121 model
base_model = DenseNet121(weights='imagenet', include_top=False)

# Add custom layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
predictions = Dense(15, activation='softmax')(x)  # Changed to 15 classes

# Define the model
model = Model(inputs=base_model.input, outputs=predictions)

# Freeze base model layers
for layer in base_model.layers:
    layer.trainable = False

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.001), loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(
    train_generator,
    epochs=30,
    validation_data=val_generator
)

# Save the trained model
model.save('wheat_leaf_densenet.h5')

print("Model training complete and saved as 'wheat_leaf_densenet.h5'")
   
