const form = document.getElementById("productForm");
const db = firebase.firestore();

// Cloudinary setup
const cloudName = "dhe9pzyyn";
const uploadPreset = "zency_preset"; // We'll use unsigned upload preset (you need to create it in your Cloudinary dashboard)

// Image/video upload function
async function uploadToCloudinary(file, folder) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${file.type.startsWith("video") ? "video" : "image"}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.productName.value;
  const id = form.productId.value;
  const price = parseFloat(form.productPrice.value);
  const discount = parseFloat(form.productDiscount.value);
  const size = form.productSize.value;
  const category = form.productCategory.value;
  const stock = form.inStock.value;

  const imageFiles = form.productImages.files;
  const videoFile = form.productVideo.files[0];

  if (imageFiles.length === 0 || imageFiles.length > 5) {
    alert("Please upload 1–5 images.");
    return;
  }

  try {
    const imageUrls = [];

    // Uploading images to Cloudinary
    for (let i = 0; i < imageFiles.length; i++) {
      const url = await uploadToCloudinary(imageFiles[i], `zency/products/${id}`);
      imageUrls.push(url);
    }

    // Uploading video (if any)
    let videoUrl = "";
    if (videoFile) {
      videoUrl = await uploadToCloudinary(videoFile, `zency/products/${id}`);
    }

    const productData = {
      name,
      id,
      price,
      discount,
      size,
      category,
      stock,
      images: imageUrls,
      video: videoUrl || null,
      created: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("products").add(productData);
    alert("✅ Product added successfully!");
    form.reset();

  } catch (error) {
    console.error("❌ Error uploading product:", error);
    alert("Upload failed. Check console for more info.");
  }
});
