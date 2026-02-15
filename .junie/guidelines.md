# 📸 Project Core Principles

*Minimalist, mobile-first photo sharing app*

## 1. Vision

Create a calm, mobile-first photo sharing app inspired by early Instagram:

* Photos only (MVP), later short videos 15s max
* Simple chronological feed
* Clean, distraction-free UI
* No ads, no tracking, no growth hacks
* Built and hosted in the EU
* Low cost, low operational overhead

Place for community to share training footage - not soft-porn, rage-bait 

---

## 2. Product Philosophy

### 2.1 Simplicity Over Features

* Every feature must justify its existence.
* Avoid social mechanics that create noise (e.g., infinite engagement loops).
* Prioritize clarity and usability on mobile.

If in doubt: remove, don’t add.

---

### 2.2 Privacy by Non-Collection

The app’s privacy stance is based on **data minimization**, not user restriction.

We:

* Do not track users.
* Do not sell or analyze behavioral data.
* Do not use third-party trackers.
* Do not build user profiles.
* Do not process data beyond what is necessary to run the service.

Users:

* May choose their own username.
* May share what they are comfortable sharing.
* Are responsible for their own content choices.

The system does not encourage identity harvesting, but does not artificially restrict expression either.

Core principle:

> If we don’t collect it, we don’t have to protect it.

---

### 2.3 EU-First Infrastructure

All infrastructure must:

* Be hosted in the EU
* Be GDPR compliant
* Avoid unnecessary cross-border data transfer
* Use providers with transparent data policies

Preference:

* Managed services
* Serverless where possible
* No unnecessary operational burden

---

## 3. MVP Scope

### Included

* Mobile-first web app (PWA)
* User accounts
* Photo upload
* Short caption
* Chronological feed
* Delete own content
* Basic moderation tools

### Excluded (MVP)

* Video
* Stories
* Direct messaging
* Algorithmic ranking
* Ads
* Notifications
* Advanced analytics
* Engagement gamification

---

## 4. Data Model Philosophy

Store only what is necessary to operate:

### Users

* id (UUID)
* username
* email (if used for auth)
* created_at

### Posts

* id
* user_id
* image_url
* thumbnail_url
* caption
* created_at

No:

* behavioral tracking
* location metadata
* device fingerprinting
* interest profiles
* shadow analytics

---

## 5. Image Handling

To balance cost and quality:

* Resize client-side (max ~1080px width)
* Convert to WebP or optimized JPEG
* Strip EXIF metadata
* Store only processed image (no original raw upload)
* Generate thumbnails for feed

Goal:
High perceived quality, low storage cost.

---

## 6. UX Principles

* Mobile-first design
* Generous whitespace
* Photos are the primary visual element
* UI should disappear behind content
* Avoid clutter
* Fast loading
* No dark patterns

Design bias:

> Calm > addictive
> Elegant > flashy
> Focused > feature-rich

---

## 7. Architecture Principles

* Simple architecture
* No premature scaling
* Avoid microservices
* Avoid overengineering
* Prefer managed and serverless services
* Keep operational cost under control (target: €0–10/month early stage)

The system should comfortably handle:

* 100–300 users
* Thousands of photos
* Minimal maintenance effort

---

## 8. Governance & Moderation

* Clear content guidelines
* Manual moderation initially
* Simple reporting mechanism
* Ability to remove content and users

No automated surveillance systems in MVP.

---

## 9. Long-Term Direction

The product should remain:

* Small and intentional
* Sustainable in cost
* Ethically aligned
* Technically maintainable by a small team

Growth is optional. Integrity is not.

---

## 10. Engineering Mindset

* Build for clarity.
* Optimize for simplicity.
* Design for maintainability.
* Think in systems, not just features.

When adding something new, ask:

* Does this increase cognitive load?
* Does this increase data processing?
* Does this increase operational complexity?
* Does this align with the product’s calm philosophy?

> “An exploration of how much product we can remove while still delivering value.”
