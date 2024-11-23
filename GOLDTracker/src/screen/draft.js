// PostCreationScreen.js
import React, { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";

import {
  ActivityIndicator,
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useItems } from "../components/ItemsContext";
import { firebaseApp, firestore, db, storage } from "../../firebaseConfig";
import "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  addDoc,
  collection,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";
import { COLORS } from "../theme/theme";

const PostCreationScreen = ({ navigation }) => {
  const { handleNewPost } = useItems();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [condition, setCondition] = useState("");
  const [itemId, setItemId] = useState("") //add a new attribute
  const [isPosting, setIsPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // get the auth instance
  const auth = getAuth(firebaseApp);
  const [userDisplayName, setUserDisplayName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);

  let user_email = user?.email;

  useEffect(() => {
    // Function to fetch user profile
    const fetchUserProfile = async () => {
      if (user && user.email) {
        const docRef = doc(firestore, "users", user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDisplayName(userData.name || user.displayName); // Use Firestore name or Auth display name
          setUserLocation(userData.location); // Fetch location from Firestore
        } else {
          console.log("No user profile found in Firestore");
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const options = [
    { label: "New", value: 0 },
    { label: "Used - Like New", value: 1 },
    { label: "Used - Good", value: 2 },
    { label: "Used - Fair", value: 3 },
  ];

  // Function to handle form submission, should add to our firebase database
  const handleSubmit = async () => {
    if (isPosting) return;

    if (
      !title ||
      !price ||
      !description ||
      !category ||
      condition === "" ||
      !imageUrl
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate that price, condition, and category can be converted to numbers
    const numericPrice = Number(price);
    const numericCondition = Number(condition);
    const numericCategory = Number(category);

    if (
      isNaN(numericPrice) ||
      isNaN(numericCondition) ||
      isNaN(numericCategory)
    ) {
      alert("Price, condition, and category must be numeric values");
      return;
    }

    setIsPosting(true);

    const currentTime = new Date();

    const timePosted = {
      dayOfWeek: currentTime.toLocaleString("en-US", { weekday: "long" }), // Eg. Monday
      date: currentTime.getDate(), // Day of the month
      month: currentTime.toLocaleString("en-US", { month: "long" }), // Eg. December
      year: currentTime.getFullYear(), // Year
    };



    // upload the image here
    console.log(imageUrl);
    const downloadURL = await uploadImage(imageUrl, "image");
    console.log(downloadURL);


    // Construct the data object with validated numeric values
    const data = {
      title: title,
      price: numericPrice,
      desc: description,
      category: numericCategory,
      condition: numericCondition,
      imageURL: downloadURL,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      lister: user_email, // Assuming user_email is defined elsewhere in your code
      isSelling: true,
      timePosted: currentTime.toISOString(),
      listerDisplayName: userDisplayName,
      listerLocation: userLocation,
      datePosted: timePosted,
      id: itemId,
    };

    // Show the data for debugging purposes

    // Add the listing with the data
    await addListing(data);
    //console.log("after: ", data.id);
    
    // Display the formatted data in an alert
    alert("Listing Added");

    // Clear the form, making values back to default
    setTitle("");
    setPrice("");
    setDescription("");
    setCategory(null);
    setImageUrl("");
    setCondition("");
    setDescription("");
    setIsPosting(false);
  };
  async function addListing(data) {
    console.log("Adding listing");

    // Reference to the users collection
    const listingCol = collection(firestore, "listings");

    const usersCol = collection(firestore, "users");

    // const imgURL = data.imageURL;
    const userEmail = data.lister;

    // Add a new document with a generated id
    // await addDoc(listingCol, data);

    const docRef = await addDoc(listingCol, data);
   //console.log("data: ", data.id);

    const userDocRef = doc(usersCol, userEmail);
    console.log("Get doc user ref: ", userDocRef);
    const userDocSnap = await getDoc(userDocRef);
    console.log("Get doc user ref.");

    const userData = userDocSnap.data();
    const updatedMyListings = userData.myListings || [];
    updatedMyListings.push({
      listingId: docRef.id,
      imageURL: data.imageURL,
    });
    await updateDoc(docRef, { id: docRef.id });
    console.log("Before await update doc");

    // Update the user document with the updated myListings array
    await updateDoc(userDocRef, { myListings: updatedMyListings });
    console.log("Image URL added to myListings.");
  }

  // Function to handle image selection
  const selectImage = async () => {
    // Requesting the permission to access the camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // this happen when we post item
    if (!result.cancelled) {
      // if we want multiple images we can make a for loop that iterates thru
      // assets from indices 0 -> n
      setImageUrl(result.assets[0].uri);
      setImageWidth(result.assets[0].width);
      setImageHeight(result.assets[0].height);

      console.log(result.assets[0].width);
      console.log(result.assets[0].height);
      // await uploadImage(result.assets[0].uri, "image");
    }
  };

  async function uploadImage(uri, fileType) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Return a promise that resolves with the download URL
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setUploadProgress(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            resolve(downloadURL); // Resolve the promise with the download URL
          });
        }
      );
    });
  }

  return (
    // here are the inputs that users enter on the screen
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          {isPosting && (
            <View style={styles.overlayStyle}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.loadingText}>
                Posting {Math.round(uploadProgress)}%
              </Text>
            </View>
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="What are you selling?"
              value={title}
              onChangeText={setTitle}
              style={styles.largeInput}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Decribe your item..."
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.largeInput, styles.descriptionInput]}
            />

            <Text style={styles.label}>Price</Text>
            <View style={styles.priceInputContainer}>
              <FontAwesome
                name="dollar"
                size={20}
                color={COLORS.yellow}
                style={styles.dollarIcon}
              />
              <TextInput
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                style={styles.priceInput}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.pickerGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                value={category}
                items={[
                  { label: "Clothing", value: "0" },
                  { label: "Electronics", value: "1" },
                  { label: "Home", value: "2" },
                  { label: "Vehicles", value: "3" },
                  { label: "Education", value: "4" },
                  { label: "Collectibles", value: "5" },
                  { label: "Health & Beauty", value: "6" },
                  { label: "Sports & Outdoors", value: "7" },
                  { label: "Arts & Crafts", value: "8" },
                  { label: "Pet", value: "9" },
                  { label: "Tools & Equipment", value: "10" },
                  { label: "Others", value: "11" },
                ]}
                useNativeAndroidPickerStyle={false} // To customize the picker style on Android
                style={{
                  inputIOS: styles.pickerInput,
                  iconContainer: styles.pickerIconContainer,
                }}
                placeholder={{ label: "Select a category...", value: null }}
                Icon={() => {
                  return <Entypo name="chevron-down" size={24} color="grey" />;
                }}
              />
            </View>
          </View>

          <Text style={styles.label}>Condition</Text>
          <View style={styles.choicesContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.choice,
                  condition === option.value ? styles.choiceSelected : null,
                ]}
                onPress={() => setCondition(option.value)}
              >
                <Text style={styles.choiceText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.imageUploadRow}>
            <TouchableOpacity
              style={styles.imageUploadContainer}
              onPress={selectImage}
            >
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
              ) : (
                <>
                  <Entypo name="image" size={28} color="grey" />
                  <Text style={styles.uploadImageText}>Add Image</Text>
                </>
              )}
              {imageUrl && (
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={selectImage} // assuming this is the method to change the image
                >
                  <AntDesign
                    name="pluscircle"
                    size={24}
                    color={COLORS.yellow}
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <View style={styles.imageDetailsContainer}>
              {/* Place other elements related to the image here if necessary */}
            </View>
          </View>

          <TouchableOpacity
            style={styles.postItemButton}
            onPress={handleSubmit}
            disabled={isPosting}
          >
            {isPosting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.postItemButtonText}>Post Item</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Darker overlay for better readability
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 16,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  selectImageButton: {
    backgroundColor: "#007bff", // Blue
    borderRadius: 5,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  selectImageButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  postItemButton: {
    backgroundColor: "#0C356A",
    borderRadius: 5,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  postItemButtonText: {
    color: "#FFC436",
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  choicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly", // Distribute space evenly between choices
    marginBottom: 20,
  },
  choice: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 10,
    margin: 5,
    flexGrow: 1,
  },
  choiceSelected: {
    backgroundColor: COLORS.yellow,
  },
  choiceText: {
    color: COLORS.darkBlue,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  publishButton: {
    backgroundColor: "yellow",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  publishButtonText: {
    // Your text styles for the publish button
  },
  descriptionInputContainer: {
    marginVertical: 16,
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 10,
  },
  descriptionInput: {
    minHeight: 120, // Set a minimum height for description input for a bigger box
    textAlignVertical: "top", // Align text to top for multiline input
    paddingTop: 15, // Add padding at the top
    paddingBottom: 10, // Add padding at the bottom
    paddingHorizontal: 10, // Padding on the sides
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  imageUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "grey",
    borderRadius: 10,
    padding: 16,
  },
  imageUploadIcon: {
    marginRight: 10,
  },
  imageUploadText: {
    // Your text styles
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  imageUploadContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    width: "25%", // Set this to your desired width
    aspectRatio: 1,
    marginRight: 16,
  },
  imagePlaceholder: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImageText: {
    color: "grey",
    marginTop: 8,
  },
  imageOverlayIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: COLORS.yellow,
    padding: 8,
    borderRadius: 50,
  },
  imageDetailsContainer: {
    width: "50%",
  },
  imageUploadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20, // Space between each group of inputs
  },
  pickerGroup: {
    marginBottom: 20, // Space between the picker and other content
  },
  largeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10, // Rounded corners
    fontSize: 16, // Larger font size
  },
  descriptionInput: {
    minHeight: 120, // Set a minimum height for description input for a bigger box
    textAlignVertical: "top", // Align text to top for multiline input
    justifyContent: "flex-start",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: "center",
    backgroundColor: "#f8f8f8", // Light gray background for the picker
    position: "relative",
  },
  pickerInput: {
    fontSize: 16, // Consistent font size with other inputs
  },
  pickerIconContainer: {
    top: "50%",
    right: 10,
    transform: [{ translateY: -12 }],
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingLeft: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  dollarIcon: {
    marginRight: 10,
  },
  priceInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
  },
  editIcon: {
    position: "absolute",
    right: 5,
    bottom: 5,
  },
});

export default PostCreationScreen;
