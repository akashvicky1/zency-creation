const form = document.getElementById("productForm");
const db = firebase.firestore();

const cloudName = "dhe9pzyyn";
const uploadPreset = "zency_preset"; // 👈 Your unsigned preset

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
    alert("Something went wrong. Check console.");
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

  const data = await res.json();
  return data.secure_url;
}
