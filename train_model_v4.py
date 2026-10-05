import os
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import GlobalAveragePooling2D, Dropout, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import (
    ModelCheckpoint,
    EarlyStopping,
    ReduceLROnPlateau
)

# ============================================================
# V4 - EfficientNetB0 Targeted Augmentation
# Starts from V3 best model (71.03% test accuracy)
# ============================================================

PROJECT_DIR = r"D:\Skin_cancer"

TRAIN_DIR = os.path.join(
    PROJECT_DIR,
    "Dataset",
    "split_dataset",
    "train"
)

VAL_DIR = os.path.join(
    PROJECT_DIR,
    "Dataset",
    "split_dataset",
    "val"
)

TEST_DIR = os.path.join(
    PROJECT_DIR,
    "Dataset",
    "split_dataset",
    "test"
)

# V3 best model
V3_WEIGHTS = os.path.join(
    PROJECT_DIR,
    "skin_cancer_efficientnetb0_v3_continue_best.weights.h5"
)

# V4 output
V4_WEIGHTS = os.path.join(
    PROJECT_DIR,
    "skin_cancer_efficientnetb0_v4_best.weights.h5"
)

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
NUM_CLASSES = 9

CLASS_NAMES = [
    "AK",
    "BCC",
    "BKL",
    "DF",
    "MEL",
    "NV",
    "SCC",
    "UNK",
    "VASC"
]

# ------------------------------------------------------------
# Check V3 model exists
# ------------------------------------------------------------

if not os.path.exists(V3_WEIGHTS):
    raise FileNotFoundError(
        f"\nV3 model not found:\n{V3_WEIGHTS}\n"
    )

print("\n" + "=" * 70)
print("EFFICIENTNETB0 V4 - TARGETED AUGMENTATION")
print("=" * 70)

print("\nStarting from V3 best model:")
print("71.03% test accuracy")

# ------------------------------------------------------------
# Training augmentation
# ------------------------------------------------------------
# Stronger than V3, but still realistic for skin images.
#
# IMPORTANT:
# Validation and test images are NOT augmented.
# ------------------------------------------------------------

train_datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.08,
    height_shift_range=0.08,
    zoom_range=0.15,
    shear_range=0.05,
    horizontal_flip=True,
    brightness_range=[0.90, 1.10],
    fill_mode="nearest"
)

val_datagen = ImageDataGenerator()
test_datagen = ImageDataGenerator()

# ------------------------------------------------------------
# Data generators
# ------------------------------------------------------------

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=True,
    seed=42
)

val_generator = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

test_generator = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

print("\nClass mapping:")
print(train_generator.class_indices)

# ------------------------------------------------------------
# Build EfficientNetB0
# ------------------------------------------------------------

print("\nBuilding EfficientNetB0...")

base_model = EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

# Same classification head used in V3
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.30)(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.20)(x)
output = Dense(NUM_CLASSES, activation="softmax")(x)

model = Model(
    inputs=base_model.input,
    outputs=output
)

# ------------------------------------------------------------
# Load V3 best weights
# ------------------------------------------------------------

print("\nLoading V3 best weights...")

model.load_weights(V3_WEIGHTS)

print("V3 weights loaded successfully.")

# ------------------------------------------------------------
# Fine-tuning setup
# ------------------------------------------------------------

# Freeze everything first
for layer in base_model.layers:
    layer.trainable = False

# Unfreeze only the last 20 layers
# BatchNormalization layers remain frozen.
for layer in base_model.layers[-20:]:
    if not isinstance(layer, tf.keras.layers.BatchNormalization):
        layer.trainable = True

trainable_count = sum(
    1 for layer in model.layers if layer.trainable
)

print(f"\nTrainable layers: {trainable_count}")

# ------------------------------------------------------------
# Compile
# ------------------------------------------------------------

model.compile(
    optimizer=Adam(learning_rate=3e-6),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# ------------------------------------------------------------
# Callbacks
# ------------------------------------------------------------

checkpoint = ModelCheckpoint(
    V4_WEIGHTS,
    monitor="val_accuracy",
    mode="max",
    save_best_only=True,
    save_weights_only=True,
    verbose=1
)

early_stopping = EarlyStopping(
    monitor="val_accuracy",
    mode="max",
    patience=2,
    restore_best_weights=True,
    verbose=1
)

reduce_lr = ReduceLROnPlateau(
    monitor="val_accuracy",
    mode="max",
    factor=0.5,
    patience=1,
    min_lr=5e-7,
    verbose=1
)

# ------------------------------------------------------------
# Training
# ------------------------------------------------------------

EPOCHS = 4

print("\n" + "=" * 70)
print("STARTING V4 TRAINING")
print("=" * 70)

print("\nTarget:")
print("Improve current test accuracy: 71.03%")

history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    callbacks=[
        checkpoint,
        early_stopping,
        reduce_lr
    ],
    verbose=1
)

# ------------------------------------------------------------
# Load best V4 weights
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("LOADING BEST V4 MODEL")
print("=" * 70)

if os.path.exists(V4_WEIGHTS):
    model.load_weights(V4_WEIGHTS)
    print("Best V4 weights loaded.")
else:
    print("WARNING: V4 checkpoint was not created.")

# ------------------------------------------------------------
# Validation evaluation
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("VALIDATION EVALUATION")
print("=" * 70)

val_loss, val_accuracy = model.evaluate(
    val_generator,
    verbose=1
)

print(f"\nV4 Validation Loss: {val_loss:.4f}")
print(f"V4 Validation Accuracy: {val_accuracy * 100:.2f}%")

# ------------------------------------------------------------
# Test evaluation
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("TEST EVALUATION")
print("=" * 70)

test_loss, test_accuracy = model.evaluate(
    test_generator,
    verbose=1
)

print(f"\nV4 Test Loss: {test_loss:.4f}")
print(f"V4 TEST ACCURACY: {test_accuracy * 100:.2f}%")

# ------------------------------------------------------------
# Comparison
# ------------------------------------------------------------

old_accuracy = 71.03
new_accuracy = test_accuracy * 100
difference = new_accuracy - old_accuracy

print("\n" + "=" * 70)
print("V3 vs V4 COMPARISON")
print("=" * 70)

print(f"\nV3 Test Accuracy : {old_accuracy:.2f}%")
print(f"V4 Test Accuracy : {new_accuracy:.2f}%")
print(f"Difference       : {difference:+.2f}%")

if new_accuracy > old_accuracy:
    print("\n🎉 V4 IMPROVED OVER V3!")
    print("KEEP V4 MODEL.")
else:
    print("\nV4 did not improve over V3.")
    print("KEEP V3 MODEL: 71.03%")

print("\n" + "=" * 70)
print("V4 TRAINING COMPLETE")
print("=" * 70)

