// js/admin.js

const form = document.getElementById("productForm");
const db = firebase.firestore();

// Your Cloudinary config
const CLOUD_NAME = "dhe9pzyyn";
const UPLOAD_PRESET = "zency_preset";

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

    // Upload Images to Cloudinary
    for (let i = 0; i < imageFiles.length; i++) {
      const formData = new FormData();
      formData.append("file", imageFiles[i]);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", `zency/products/${id}`);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      imageUrls.push(data.secure_url);
    }

    // Upload Video (if any)
    let videoUrl = "";
    if (videoFile) {
      const videoData = new FormData();
      videoData.append("file", videoFile);
      videoData.append("upload_preset", UPLOAD_PRESET);
      videoData.append("resource_type", "video");
      videoData.append("folder", `zency/products/${id}`);

      const videoRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
        method: "POST",
        body: videoData
      });

      const videoJson = await videoRes.json();
      videoUrl = videoJson.secure_url;
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
    console.error("❌ Upload Error:", error);
    alert("Upload failed. Check console for details.");
  }
});
