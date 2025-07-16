// /user/user.js

import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

const productList = document.getElementById("productList");
const whatsappGroupLink = "https://chat.whatsapp.com/JfwRCFXzBA2Jg10oVF34eo?mode=r_t";

const q = query(collection(db, "products"), orderBy("created", "desc"));

onSnapshot(q, (snapshot) => {
  productList.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    const sizes = data.size ? `<p><strong>Sizes:</strong> ${data.size}</p>` : "";
    const discount = data.discount
      ? `<span style="text-decoration:line-through; color:#ccc">₹${data.price}</span> <span style="color:#00ffd5">₹${data.discount}</span>`
      : `<span style="color:#00ffd5">₹${data.price}</span>`;

    const imagesHTML = (data.images || []).map(url => `<img src="${url}" loading="lazy" />`).join("");
    const videoHTML = data.video
      ? `<video controls><source src="${data.video}" type="video/mp4"></video>`
      : "";

    productList.innerHTML += `
      <div class="card">
        ${imagesHTML}
        ${videoHTML}
        <h3>${data.name}</h3>
        <p><strong>Category:</strong> ${data.category}</p>
        <p class="price">${discount}</p>
        ${sizes}
        <a class="ask-btn" href="${whatsappGroupLink}?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(data.name)}%20(Product%20ID:%20${data.id})" target="_blank">💬 Ask Price</a>
      </div>
    `;
  });
});
