import json

# Load professor data from the JSON file
with open("rmp_prof_clean.json", "r") as file:
    professor_data = json.load(file)

# Sort by department first, then by last name within each department
professor_data_sorted = sorted(professor_data, key=lambda x: (x["department"], x["lastName"]))

# Save the sorted data back to a JSON file
with open("sorted_professors_flat.json", "w") as outfile:
    json.dump(professor_data_sorted, outfile, indent=4)

print("Data has been sorted by department and last name, and saved to 'sorted_professors_flat.json'")
