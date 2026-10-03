import os
import shutil
import random

# Original organized dataset
SOURCE_DIR = r"D:\Skin_cancer\Dataset\organized_dataset"

# New split dataset
OUTPUT_DIR = r"D:\Skin_cancer\Dataset\split_dataset"

# Class names
classes = [
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

# Split percentages
TRAIN_RATIO = 0.70
VALIDATION_RATIO = 0.15
TEST_RATIO = 0.15

# Make the result reproducible
random.seed(42)

# Create train, validation, and test folders
for split in ["train", "validation", "test"]:
    for class_name in classes:
        folder_path = os.path.join(
            OUTPUT_DIR,
            split,
            class_name
        )
        os.makedirs(folder_path, exist_ok=True)

total_train = 0
total_validation = 0
total_test = 0

print("Starting dataset splitting...\n")

for class_name in classes:

    class_path = os.path.join(
        SOURCE_DIR,
        class_name
    )

    if not os.path.exists(class_path):
        print(class_name, ": Folder not found")
        continue

    # Get only image files
    images = [
        file for file in os.listdir(class_path)
        if file.lower().endswith(
            (".jpg", ".jpeg", ".png")
        )
    ]

    # Shuffle images
    random.shuffle(images)

    total_images = len(images)

    # Calculate split sizes
    train_count = int(total_images * TRAIN_RATIO)
    validation_count = int(
        total_images * VALIDATION_RATIO
    )

    # Divide images
    train_images = images[:train_count]

    validation_images = images[
        train_count:
        train_count + validation_count
    ]

    test_images = images[
        train_count + validation_count:
    ]

    # Copy training images
    for image in train_images:

        source_file = os.path.join(
            class_path,
            image
        )

        destination_file = os.path.join(
            OUTPUT_DIR,
            "train",
            class_name,
            image
        )

        shutil.copy2(
            source_file,
            destination_file
        )

    # Copy validation images
    for image in validation_images:

        source_file = os.path.join(
            class_path,
            image
        )

        destination_file = os.path.join(
            OUTPUT_DIR,
            "validation",
            class_name,
            image
        )

        shutil.copy2(
            source_file,
            destination_file
        )

    # Copy testing images
    for image in test_images:

        source_file = os.path.join(
            class_path,
            image
        )

        destination_file = os.path.join(
            OUTPUT_DIR,
            "test",
            class_name,
            image
        )

        shutil.copy2(
            source_file,
            destination_file
        )

    total_train += len(train_images)
    total_validation += len(validation_images)
    total_test += len(test_images)

    print(
        class_name,
        "→ Train:",
        len(train_images),
        "| Validation:",
        len(validation_images),
        "| Test:",
        len(test_images)
    )

print("\n----------------------------------")
print("Dataset splitting completed")
print("----------------------------------")

print("Total training images:", total_train)
print("Total validation images:", total_validation)
print("Total testing images:", total_test)

print("\nSplit dataset location:")
print(OUTPUT_DIR)