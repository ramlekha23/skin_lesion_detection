import os
import numpy as np
import tensorflow as tf

from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing import image


# ============================================================
# 1. PATHS
# ============================================================

PROJECT_DIR = r"D:\Skin_cancer"

MODEL_PATH = os.path.join(
    PROJECT_DIR,
    "skin_cancer_efficientnetb0_v4_best.weights.h5"
)

CLASS_NAMES_PATH = os.path.join(
    PROJECT_DIR,
    "class_names.txt"
)

# CHANGE THIS TO YOUR IMAGE
IMAGE_PATH = r"D:\Skin_cancer\test_image.jpg"


# ============================================================
# 2. LOAD CLASS NAMES
# ============================================================

with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as file:
    class_names = [
        line.strip()
        for line in file
        if line.strip()
    ]

print("\nClasses:")
print(class_names)


# ============================================================
# 3. CREATE SAME MODEL USED FOR TRAINING
# ============================================================

NUM_CLASSES = len(class_names)

base_model = EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

base_model.trainable = False


x = base_model.output

x = GlobalAveragePooling2D()(x)

x = Dropout(0.30)(x)

x = Dense(
    128,
    activation="relu"
)(x)

x = Dropout(0.20)(x)

output = Dense(
    NUM_CLASSES,
    activation="softmax"
)(x)


model = Model(
    inputs=base_model.input,
    outputs=output
)


# ============================================================
# 4. LOAD TRAINED WEIGHTS
# ============================================================

model.load_weights(MODEL_PATH)

print("\nTrained weights loaded successfully!")


# ============================================================
# 5. LOAD IMAGE
# ============================================================

img = image.load_img(
    IMAGE_PATH,
    target_size=(224, 224)
)

img_array = image.img_to_array(img)

img_array = np.expand_dims(
    img_array,
    axis=0
)


# ============================================================
# 6. PREDICTION
# ============================================================

predictions = model.predict(img_array)

predicted_index = np.argmax(predictions[0])

predicted_class = class_names[predicted_index]

confidence = predictions[0][predicted_index] * 100


# ============================================================
# 7. DISPLAY RESULT
# ============================================================

print("\n" + "=" * 50)
print("SKIN CANCER PREDICTION RESULT")
print("=" * 50)

print(f"\nImage          : {IMAGE_PATH}")
print(f"Predicted Class: {predicted_class}")
print(f"Confidence     : {confidence:.2f}%")

print("\nAll Class Probabilities:")

for class_name, probability in zip(
    class_names,
    predictions[0]
):
    print(
        f"{class_name:5s} : {probability * 100:.2f}%"
    )

print("\n" + "=" * 50)