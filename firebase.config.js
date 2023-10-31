const { initializeApp } = require("firebase/app");

const { getStorage, ref, listAll, deleteObject } = require("firebase/storage");

const multer = require("multer");

const firebaseConfig = {
  apiKey: "AIzaSyADXwnGlAF8Fevy14QbWDqdWQN-XkvDV9w",
  authDomain: "lms-system-1e155.firebaseapp.com",
  projectId: "lms-system-1e155",
  storageBucket: "lms-system-1e155.appspot.com",
  messagingSenderId: "689515691440",
  appId: "1:689515691440:web:7be80c72995e3b9f006a75",
  measurementId: "G-X6P8XLF321",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

const deleteProductImages = async (imageUrls) => {
  const storage = getStorage();
  try {
    const deletePromises = imageUrls.map(async (imageUrl) => {
      const httpsReference = ref(storage, imageUrl);
      deleteObject(ref(storage, httpsReference._location.path));
    });
    await Promise.all(deletePromises);
    console.log("Old product images deleted successfully");
  } catch (error) {
    console.log("Error deleting old product images:", error);
  }
};

module.exports = {
  deleteProductImages,
  upload,
  storage,
};
