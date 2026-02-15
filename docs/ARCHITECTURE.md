
## 🖼 Image Handling

Optimize for performance and cost while maintaining high perceived quality.

* **Client-side resizing:** Max ~1080px width.
* **Format:** Convert to WebP or optimized JPEG.
* **Privacy:** Strip all EXIF metadata.
* **Storage:** Store only processed images (no original raw uploads).
* **Delivery:** Generate and use thumbnails for the feed.

---

## ⚙️ Architecture & Infrastructure

* **Simplicity:** No premature scaling or microservices.
* **EU-First:** All infrastructure must be hosted in the EU and be GDPR compliant.
* **Managed/Serverless:** Prefer managed services to reduce operational overhead.
* **Cost Control:** Target early-stage operational cost: €0–10/month.
* **Capacity:** Design for 100–300 users and thousands of photos initially.

---

## 🧠 Engineering Mindset

* **Build for clarity:** Code should be self-documenting and easy to follow.
* **Optimize for simplicity:** Prefer straightforward solutions over clever ones.
* **Design for maintainability:** Think in systems, not just isolated features.
* **Minimalist approach:** Before adding complexity, ask:
    * Does this increase cognitive load?
    * Does this increase data processing?
    * Does this increase operational complexity?
    * Does this align with the product’s calm philosophy?
