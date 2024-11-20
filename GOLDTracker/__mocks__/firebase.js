//Firebase mock created from this tutorial: https://techunderthesun.in/post/setting-up-tests-in-expo-app-using-jest/
import firebasemock from 'firebase-mock'

const mockdatabase = new firebasemock.MockFirebase();
const mockauth = new firebasemock.MockFirebase();
const mockFirestore = new firebasemock.MockFirestore();

const mocksdk = new firebasemock.MockFirebaseSdk(
    (path) => (path ? mockdatabase.child(path) : mockdatabase),
    () => mockauth,
    () => mockFirestore,
)

export default mocksdk