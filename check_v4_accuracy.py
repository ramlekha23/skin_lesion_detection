import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import GlobalAveragePooling2D, Dropout, Dense
from tensorflow.keras.models import Model

PROJECT_DIR = r"D:\Skin_cancer"

TEST_DIR = os.path.join(
    PROJECT_DIR,
    "Dataset",
    "split_dataset",
    "test"
)

V4_WEIGHTS = os.path.join(
    PROJECT_DIR,
    "skin_cancer_efficientnetb0_v4_best.weights.h5"
)

# Test data
test_datagen = ImageDataGenerator()

test_generator = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=(224, 224),
    batch_size=16,
    class_mode="categorical",
    shuffle=False
)

# Build same V4 model
base_model = EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.30)(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.20)(x)
output = Dense(9, activation="softmax")(x)

model = Model(
    inputs=base_model.input,
    outputs=output
)

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# Load V4 weights
model.load_weights(V4_WEIGHTS)

# Check accuracy only
_, accuracy = model.evaluate(
    test_generator,
    verbose=1
)

print(f"\nV4 TEST ACCURACY: {accuracy * 100:.2f}%")