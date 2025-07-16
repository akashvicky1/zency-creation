// admin.js

const form = document.getElementById("productForm");
const storage = firebase.storage();
const db = firebase.firestore();

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

    // Uploading images
    for (let i = 0; i < imageFiles.length; i++) {
      const imageRef = storage.ref().child(`products/${id}/image${i + 1}`);
      await imageRef.put(imageFiles[i]);
      const url = await imageRef.getDownloadURL();
      imageUrls.push(url);
    }

    // Uploading video (if any)
    let videoUrl = "";
    if (videoFile) {
      const videoRef = storage.ref().child(`products/${id}/video`);
      await videoRef.put(videoFile);
      videoUrl = await videoRef.getDownloadURL();
    }

    // Final product data
    const productData = {
      name: name,
      id: id,
      price: price,
      discount: discount,
      size: size,
      category: category,
      stock: stock,
      images: imageUrls,
      video: videoUrl || null,
      created: firebase.firestore.FieldValue.serverTimestamp() // ✅ fixed
    };

    await db.collection("products").add(productData);
    alert("✅ Product added successfully!");
    form.reset();

  } catch (error) {
    console.error("❌ Error uploading product:", error);
    alert("Error uploading product. Check console for details.");
  }
});
