const form = document.getElementById("productForm");
const db = firebase.firestore();

const cloudName = "dhe9pzyyn";
const uploadPreset = "zency_preset"; // 👈 Your unsigned preset

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.productName.value.trim();
  const id = form.productId.value.trim();
  const price = parseFloat(form.productPrice.value) || 0;
  const discount = parseFloat(form.productDiscount.value) || 0;
  const size = form.productSize.value.trim();
  const category = form.productCategory.value.trim();
  const stock = form.inStock.value;

  const imageFiles = form.productImages.files;
  const videoFile = form.productVideo.files[0];

  if (!name || !id || price <= 0 || discount < 0 || !category || imageFiles.length === 0) {
    alert("Please fill all required fields correctly.");
    return;
  }

  if (imageFiles.length > 5) {
    alert("Please upload a maximum of 5 images.");
    return;
  }

  try {
    const imageUrls = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const url = await uploadToCloudinary(imageFiles[i], "image");
      imageUrls.push(url);
    }

    let videoUrl = "";
    if (videoFile) {
      videoUrl = await uploadToCloudinary(videoFile, "video");
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
    alert("Something went wrong while uploading. Check console.");
  }
});

async function uploadToCloudinary(file, type) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", `zency/products`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.secure_url;
}
