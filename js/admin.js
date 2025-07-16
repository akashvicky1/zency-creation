// /admin/admin.js
import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const category = document.getElementById("product-category").value;
  const images = uploadedImageUrls; // tu jo Cloudinary se URLs save karta hai
  const video = uploadedVideoUrl || null;

  const formData = {
    name,
    price,
    category,
    images,
    video,
    timestamp: new Date(),
  };

  console.log(formData); // check kare sab value mil rahi ya nahi

  try {
    await addDoc(collection(db, "products"), formData); // 🔥 fix yahi hai
    alert("Product added successfully!");
  } catch (err) {
    console.error("Error adding product: ", err);
    alert("Error adding product!");
  }
});
