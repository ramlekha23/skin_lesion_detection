import os

# Path to your organized dataset
dataset_path = r"D:\Skin_cancer\Dataset\organized_dataset"

# Class folders
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

print("Image count in each class:\n")

total = 0

for class_name in classes:

    class_path = os.path.join(dataset_path, class_name)

    # Check whether the class folder exists
    if not os.path.exists(class_path):
        print(class_name, ": Folder not found")
        continue

    count = 0

    # Count image files
    for file in os.listdir(class_path):

        if file.lower().endswith(
            (".jpg", ".jpeg", ".png")
        ):
            count += 1

    print(class_name, ":", count)

    total += count

print("\n------------------------------")
print("Total images:", total)
print("------------------------------")