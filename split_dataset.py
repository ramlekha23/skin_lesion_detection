from pathlib import Path
import pandas as pd
import shutil

# --------------------------------------------------
# 1. Dataset paths
# --------------------------------------------------

CSV_PATH = Path(
    r"D:\Skin_cancer\Dataset\ISIC_2019_Training_GroundTruth.csv"
)

# This is the newly extracted folder
SOURCE_DIR = Path(
    r"D:\Skin_cancer\Dataset\isic_dataset.zip\ISIC_2019_Training_Input\ISIC_2019_Training_Input"
)

# Organized dataset output folder
OUTPUT_DIR = Path(
    r"D:\Skin_cancer\Dataset\organized_dataset"
)

# --------------------------------------------------
# 2. Check whether paths exist
# --------------------------------------------------

if not CSV_PATH.exists():
    raise FileNotFoundError(
        f"CSV file not found:\n{CSV_PATH}"
    )

if not SOURCE_DIR.exists():
    raise FileNotFoundError(
        f"Image source folder not found:\n{SOURCE_DIR}\n\n"
        "Check the extracted folder path."
    )

# --------------------------------------------------
# 3. Read the CSV file
# --------------------------------------------------

df = pd.read_csv(CSV_PATH)

print("CSV loaded successfully")
print("Total CSV records:", len(df))

# --------------------------------------------------
# 4. Class names
# --------------------------------------------------

class_columns = [
    "MEL",
    "NV",
    "BCC",
    "AK",
    "BKL",
    "DF",
    "VASC",
    "SCC",
    "UNK"
]

# --------------------------------------------------
# 5. Create output folders
# --------------------------------------------------

for class_name in class_columns:
    class_folder = OUTPUT_DIR / class_name
    class_folder.mkdir(
        parents=True,
        exist_ok=True
    )

# --------------------------------------------------
# 6. Find all images recursively
# --------------------------------------------------

image_files = {}

print("\nSearching for images...")

for file in SOURCE_DIR.rglob("*"):

    if file.is_file() and file.suffix.lower() in [
        ".jpg",
        ".jpeg",
        ".png"
    ]:

        # Remove "_downsampled" if present
        image_id = file.stem.replace(
            "_downsampled",
            ""
        ).strip()

        image_files[image_id] = file

print("Images found:", len(image_files))

# --------------------------------------------------
# 7. Organize images according to CSV labels
# --------------------------------------------------

copied = 0
already_exists = 0
missing = 0
unlabelled = 0

print("\nOrganizing images...")

for _, row in df.iterrows():

    image_id = str(row["image"]).strip()

    # Check whether the image exists
    if image_id not in image_files:
        missing += 1
        continue

    # Find the corresponding class
    class_name = None

    for label in class_columns:

        if row[label] == 1:
            class_name = label
            break

    # Skip images without a valid class
    if class_name is None:
        unlabelled += 1
        continue

    source_file = image_files[image_id]

    destination_folder = OUTPUT_DIR / class_name

    destination_file = (
        destination_folder / source_file.name
    )

    # Copy only if it is not already present
    if destination_file.exists():
        already_exists += 1
    else:
        shutil.copy2(
            source_file,
            destination_file
        )
        copied += 1

    # Show progress every 1,000 records
    if (copied + already_exists) % 1000 == 0:
        print(
            "Processed:",
            copied + already_exists,
            "images"
        )

# --------------------------------------------------
# 8. Final result
# --------------------------------------------------

print("\n----------------------------------")
print("Dataset organization completed")
print("----------------------------------")

print("Images found:", len(image_files))
print("Copied images:", copied)
print("Already existed:", already_exists)
print("Missing images:", missing)
print("Unlabelled images:", unlabelled)

print("\nOrganized dataset location:")
print(OUTPUT_DIR)