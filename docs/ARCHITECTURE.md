# 🏗 Architecture Guidelines

> For a detailed technical map, see [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md).

## 🖼 Media Handling
- **Resizing**: Client-side max ~1080px width.
- **Format**: Convert to WebP or optimized JPEG.
- **Privacy**: Strip all EXIF metadata on client.
- **Storage**: Store only processed images (no originals).
- **Delivery**: Use thumbnails for feed.

---

## ⚙️ Principles & Infrastructure
- **Simplicity**: No premature scaling or microservices.
- **EU-First**: Hosted in EU, GDPR compliant.
- **Managed**: Prefer serverless/managed to reduce overhead.
- **Cost**: Target €0–10/month.
- **Capacity**: Initial design for 100–300 users.

---

## 🧠 Engineering Mindset
- **Clarity**: Code should be self-documenting.
- **Simplicity**: Straightforward over clever.
- **Alignment**: Every feature must align with the "calm" philosophy.
