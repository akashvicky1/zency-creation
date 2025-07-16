const productList = document.getElementById("productList");
const db = firebase.firestore();

const whatsappGroupLink = "https://chat.whatsapp.com/JfwRCFXzBA2Jg10oVF34eo?mode=r_t";

db.collection("products")
  .orderBy("created", "desc")
  .onSnapshot((snapshot) => {
    productList.innerHTML = "";

    if (snapshot.empty) {
      productList.innerHTML = "<p style='color:#ccc;text-align:center'>No products found.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();

      const sizes = data.size ? `<p><strong>Sizes:</strong> ${data.size}</p>` : "";
      const discount = data.discount
        ? `<span style="text-decoration:line-through; color:#999">₹${data.price}</span> <span style="color:#00ffd5;font-weight:bold;">₹${data.discount}</span>`
        : `<span style="color:#00ffd5;font-weight:bold;">₹${data.price}</span>`;

      const imagesHTML = (data.images || [])
        .map(
          (url) => `<img src="\${url}" alt="Product Image" loading="lazy" style="margin-bottom:8px;" />`
        )
        .join("");

      const videoHTML = data.video
        ? `<video controls style="width:100%;margin-top:10px;"><source src="\${data.video}" type="video/mp4" /></video>`
        : "";

      productList.innerHTML += \`
        <div class="card">
          \${imagesHTML}
          \${videoHTML}
          <h3 style="margin:10px 0;">\${data.name}</h3>
          <p><strong>Category:</strong> \${data.category}</p>
          <p class="price">\${discount}</p>
          \${sizes}
          <a class="ask-btn" href="\${whatsappGroupLink}?text=Hi%2C%20I'm%20interested%20in%20\${encodeURIComponent(data.name)}%20(Product%20ID:%20\${encodeURIComponent(data.id)})" target="_blank">💬 Ask Price</a>
        </div>
      \`;
    });
  }, (err) => {
    productList.innerHTML = "<p style='color:red;text-align:center'>⚠️ Failed to load products</p>";
    console.error("❌ Firestore error:", err);
  });
