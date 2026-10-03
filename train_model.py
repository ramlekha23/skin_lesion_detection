import os
import random
import shutil

import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping


# ============================================================
# 1. PROJECT / DATASET PATHS
# ============================================================

PROJECT_DIR = r"D:\Skin_cancer"

SOURCE_DIR = os.path.join(
    PROJECT_DIR,
    "Dataset",
    "organized_dataset"
)

SPLIT_DIR = os.path.join(
    PROJECT_DIR,
    "Dataset",
    "split_dataset"
)

TRAIN_DIR = os.path.join(SPLIT_DIR, "train")
VAL_DIR = os.path.join(SPLIT_DIR, "val")
TEST_DIR = os.path.join(SPLIT_DIR, "test")


# ============================================================
# 2. SETTINGS
# ============================================================

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 20

TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

RANDOM_SEED = 42


# ============================================================
# 3. CHECK SOURCE DATASET
# ============================================================

print("\n" + "=" * 60)
print("SKIN CANCER CLASSIFICATION - EFFICIENTNETB0")
print("=" * 60)

print("\nChecking dataset...")

if not os.path.exists(SOURCE_DIR):
    raise FileNotFoundError(
        f"\nSource dataset was not found:\n{SOURCE_DIR}\n\n"
        "Please make sure your organized_dataset folder exists."
    )

print(f"Source dataset found:\n{SOURCE_DIR}")


# ============================================================
# 4. CREATE TRAIN / VALIDATION / TEST SPLIT
# ============================================================

def create_dataset_split():

    # Check whether split already exists
    if (
        os.path.exists(TRAIN_DIR)
        and os.path.exists(VAL_DIR)
        and os.path.exists(TEST_DIR)
    ):
        print("\nTrain/validation/test folders already exist.")
        print("Using the existing split.")
        return

    print("\nCreating dataset split...")
    print("Train      : 70%")
    print("Validation : 15%")
    print("Test       : 15%")

    os.makedirs(TRAIN_DIR, exist_ok=True)
    os.makedirs(VAL_DIR, exist_ok=True)
    os.makedirs(TEST_DIR, exist_ok=True)

    # Get class folders
    classes = [
        folder
        for folder in os.listdir(SOURCE_DIR)
        if os.path.isdir(os.path.join(SOURCE_DIR, folder))
    ]

    classes.sort()

    if len(classes) == 0:
        raise RuntimeError(
            f"No class folders were found in:\n{SOURCE_DIR}"
        )

    print(f"\nNumber of classes: {len(classes)}")
    print("Classes:")

    for class_name in classes:
        print(f"  - {class_name}")

    random.seed(RANDOM_SEED)

    valid_extensions = (
        ".jpg",
        ".jpeg",
        ".png",
        ".bmp",
        ".webp"
    )

    for class_name in classes:

        source_class_dir = os.path.join(
            SOURCE_DIR,
            class_name
        )

        train_class_dir = os.path.join(
            TRAIN_DIR,
            class_name
        )

        val_class_dir = os.path.join(
            VAL_DIR,
            class_name
        )

        test_class_dir = os.path.join(
            TEST_DIR,
            class_name
        )

        os.makedirs(train_class_dir, exist_ok=True)
        os.makedirs(val_class_dir, exist_ok=True)
        os.makedirs(test_class_dir, exist_ok=True)

        # Get images
        images = [
            file
            for file in os.listdir(source_class_dir)
            if file.lower().endswith(valid_extensions)
        ]

        random.shuffle(images)

        total = len(images)

        if total == 0:
            print(
                f"\nWARNING: No images found for class "
                f"'{class_name}'"
            )
            continue

        train_count = int(total * TRAIN_RATIO)
        val_count = int(total * VAL_RATIO)

        train_images = images[:train_count]

        val_images = images[
            train_count:
            train_count + val_count
        ]

        test_images = images[
            train_count + val_count:
        ]

        print(
            f"\n{class_name}: "
            f"{total} total | "
            f"{len(train_images)} train | "
            f"{len(val_images)} val | "
            f"{len(test_images)} test"
        )

        # Copy training images
        for image_name in train_images:

            source = os.path.join(
                source_class_dir,
                image_name
            )

            destination = os.path.join(
                train_class_dir,
                image_name
            )

            shutil.copy2(source, destination)

        # Copy validation images
        for image_name in val_images:

            source = os.path.join(
                source_class_dir,
                image_name
            )

            destination = os.path.join(
                val_class_dir,
                image_name
            )

            shutil.copy2(source, destination)

        # Copy test images
        for image_name in test_images:

            source = os.path.join(
                source_class_dir,
                image_name
            )

            destination = os.path.join(
                test_class_dir,
                image_name
            )

            shutil.copy2(source, destination)

    print("\nDataset split completed.")


create_dataset_split()


# ============================================================
# 5. VERIFY SPLIT DIRECTORIES
# ============================================================

for directory in [TRAIN_DIR, VAL_DIR, TEST_DIR]:

    if not os.path.exists(directory):

        raise FileNotFoundError(
            f"\nRequired directory does not exist:\n{directory}"
        )

print("\nDataset directories:")
print(f"Train: {TRAIN_DIR}")
print(f"Val  : {VAL_DIR}")
print(f"Test : {TEST_DIR}")


# ============================================================
# 6. DATA AUGMENTATION
# ============================================================

print("\nCreating image generators...")

train_datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.10,
    height_shift_range=0.10,
    zoom_range=0.10,
    horizontal_flip=True,
    vertical_flip=True
)

val_datagen = ImageDataGenerator()

test_datagen = ImageDataGenerator()


# ============================================================
# 7. LOAD TRAINING DATA
# ============================================================

print("\nLoading training images...")

train_data = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=True,
    seed=RANDOM_SEED
)


# ============================================================
# 8. LOAD VALIDATION DATA
# ============================================================

print("\nLoading validation images...")

val_data = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)


# ============================================================
# 9. LOAD TEST DATA
# ============================================================

print("\nLoading test images...")

test_data = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)


# ============================================================
# 10. DISPLAY DATASET INFORMATION
# ============================================================

NUM_CLASSES = len(train_data.class_indices)

print("\n" + "=" * 60)
print("DATASET INFORMATION")
print("=" * 60)

print(f"Training images   : {train_data.samples}")
print(f"Validation images : {val_data.samples}")
print(f"Test images       : {test_data.samples}")
print(f"Number of classes : {NUM_CLASSES}")

print("\nClass mapping:")

for class_name, class_index in train_data.class_indices.items():
    print(f"{class_index}: {class_name}")


# ============================================================
# 11. CREATE EFFICIENTNETB0 MODEL
# ============================================================

print("\n" + "=" * 60)
print("CREATING EFFICIENTNETB0 MODEL")
print("=" * 60)

base_model = EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze EfficientNet base
base_model.trainable = False


# ============================================================
# 12. ADD CLASSIFICATION HEAD
# ============================================================

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
# 13. COMPILE MODEL
# ============================================================

model.compile(
    optimizer=Adam(
        learning_rate=0.0001
    ),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)


# ============================================================
# 14. DISPLAY MODEL
# ============================================================

print("\nModel summary:\n")

model.summary()


# ============================================================
# 15. MODEL FILE PATHS
# ============================================================

BEST_WEIGHTS_PATH = os.path.join(
    PROJECT_DIR,
    "skin_cancer_efficientnetb0_best.weights.h5"
)

FINAL_WEIGHTS_PATH = os.path.join(
    PROJECT_DIR,
    "skin_cancer_efficientnetb0_final.weights.h5"
)


# ============================================================
# 16. CALLBACKS
# ============================================================

checkpoint = ModelCheckpoint(
    BEST_WEIGHTS_PATH,
    monitor="val_accuracy",
    save_best_only=True,
    save_weights_only=True,
    mode="max",
    verbose=1
)


early_stop = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True,
    verbose=1
)


# ============================================================
# 17. TRAIN MODEL
# ============================================================

print("\n" + "=" * 60)
print("STARTING TRAINING")
print("=" * 60)

print(f"\nEpochs     : {EPOCHS}")
print(f"Batch size : {BATCH_SIZE}")
print(f"Image size : {IMAGE_SIZE}")
print(f"Classes    : {NUM_CLASSES}")

history = model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS,
    callbacks=[
        checkpoint,
        early_stop
    ]
)


# ============================================================
# 18. LOAD BEST WEIGHTS
# ============================================================

print("\n" + "=" * 60)
print("LOADING BEST MODEL WEIGHTS")
print("=" * 60)

if os.path.exists(BEST_WEIGHTS_PATH):

    model.load_weights(
        BEST_WEIGHTS_PATH
    )

    print(
        f"Best weights loaded from:\n"
        f"{BEST_WEIGHTS_PATH}"
    )

else:

    print(
        "\nWARNING: Best weights file was not found."
    )


# ============================================================
# 19. EVALUATE ON TEST DATA
# ============================================================

print("\n" + "=" * 60)
print("EVALUATING MODEL ON TEST DATA")
print("=" * 60)

test_data.reset()

test_loss, test_accuracy = model.evaluate(
    test_data,
    verbose=1
)


print("\n" + "=" * 60)
print("TEST RESULTS")
print("=" * 60)

print(f"Test Loss     : {test_loss:.4f}")
print(f"Test Accuracy : {test_accuracy:.4f}")
print(
    f"Test Accuracy : {test_accuracy * 100:.2f}%"
)


# ============================================================
# 20. SAVE FINAL WEIGHTS
# ============================================================

print("\nSaving final model weights...")

model.save_weights(
    FINAL_WEIGHTS_PATH
)

print(
    f"Final weights saved to:\n"
    f"{FINAL_WEIGHTS_PATH}"
)


# ============================================================
# 21. SAVE CLASS NAMES
# ============================================================

CLASS_NAMES_PATH = os.path.join(
    PROJECT_DIR,
    "class_names.txt"
)

with open(
    CLASS_NAMES_PATH,
    "w",
    encoding="utf-8"
) as file:

    for class_name in train_data.class_indices.keys():

        file.write(
            class_name + "\n"
        )


print(
    f"Class names saved to:\n"
    f"{CLASS_NAMES_PATH}"
)


# ============================================================
# 22. TRAINING COMPLETE
# ============================================================

print("\n" + "=" * 60)
print("TRAINING COMPLETED SUCCESSFULLY")
print("=" * 60)

print("\nFiles created:")

print(
    f"\nBest weights:\n"
    f"{BEST_WEIGHTS_PATH}"
)

print(
    f"\nFinal weights:\n"
    f"{FINAL_WEIGHTS_PATH}"
)

print(
    f"\nClass names:\n"
    f"{CLASS_NAMES_PATH}"
)

print("\nDone!")