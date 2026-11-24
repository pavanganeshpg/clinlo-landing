# CLINLO — Intelligent Biometric Mapping & Wellness Center
## Official Landing Page (Static Production Distribution for GitHub Pages)

This repository contains the ultra-optimized, high-fidelity static landing page and interactive 3D Biometric Studio for **CLINLO**, designed to be hosted directly on **GitHub Pages** with a custom domain (`clinlo.com`).

---

### Features & Architecture
- **Interactive 3D Biometric Studio**: Real-time WebGL rendering with Three.js, Draco mesh compression, subsurface scattering, dynamic male/female anatomy switching, and anatomical organ mapping.
- **Pure Static Hosting**: Zero server-side build step required; runs 100% out of the box on GitHub Pages, Cloudflare Pages, Vercel, or any static CDN.
- **Pre-Order & Membership Lead Engine**: Captures user pre-orders with instant ticket generation (`#CLINLO-XXXX`) and dispatches leads directly to `admin@clinlo.com` via serverless FormSubmit AJAX + local backup.
- **Triple Audio Sync**: Real-time synchronized mute/unmute state across Header, Hero CTA, and 3D Studio canvas buttons.
- **100% Mobile & Retina Optimized**: Native touch handling, responsive split-grid layouts, and ultra-fluid 60+ FPS performance.

---

### Deployment to GitHub Pages

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CLINLO Static Landing Page"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME-OR-ORG>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

2. **Configure GitHub Pages in Settings**:
   - Navigate to **Settings** > **Pages** in your GitHub repository.
   - **Source**: Select **GitHub Actions** (recommended) or **Deploy from a branch** (`main` / `/ (root)`).
   - Under **Custom domain**, enter `clinlo.com` (already pre-configured in `CNAME`).
   - Check **Enforce HTTPS**.

3. **Configure DNS Records** (at Dynadot / Cloudflare / DNS registrar):
   - **Apex Domain (`@` / `clinlo.com`)**: Add 4 `A` records:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **Subdomain (`www.clinlo.com`)**: Add 1 `CNAME` record:
     - Host: `www`
     - Target: `<YOUR-GITHUB-USERNAME>.github.io`

4. **Activate Email Receiving for Pre-Orders**:
   - The first time a test pre-order is submitted on `clinlo.com`, FormSubmit sends a one-time verification email to `admin@clinlo.com`.
   - Click **"Activate Form"** in the email.
   - From that moment onward, all customer pre-order leads will be delivered instantly to `admin@clinlo.com`!
