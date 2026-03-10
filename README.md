
<div align="center">

# 🔗 MERN URL Shortener

A production-ready **URL Shortener** built with the **MERN Stack (MongoDB, Express, React, Node.js)** using **TypeScript**, **Drizzle ORM**, and **Next.js**.  
It provides a seamless way to shorten long URLs, track analytics, and manage links — all through a modern, responsive UI.

</div>

---
## PHOTO 📸

<img width="2992" height="1644" alt="image" src="https://github.com/user-attachments/assets/e6959dc3-729b-4bc8-9094-6d8effae4cc4" />

<img width="3018" height="1692" alt="image" src="https://github.com/user-attachments/assets/dca83604-78b1-4739-8e42-cb275fa807ca" />

<img width="3022" height="1688" alt="image" src="https://github.com/user-attachments/assets/c8fa41c2-f947-403d-8e25-5d93a6e160bc" />

<img width="3010" height="1702" alt="image" src="https://github.com/user-attachments/assets/e67ed07d-db33-4938-8057-3057ea3137d3" />

<img width="3016" height="1162" alt="image" src="https://github.com/user-attachments/assets/80d1e881-773f-4016-bb56-8420454375a6" />

<img width="3024" height="1188" alt="image" src="https://github.com/user-attachments/assets/59e89284-b558-47eb-8749-f75344f5765f" />

<img width="2066" height="280" alt="image" src="https://github.com/user-attachments/assets/e2e7ad14-4345-423a-bc78-eaec4b880b89" />

<img width="3024" height="1472" alt="image" src="https://github.com/user-attachments/assets/1ad99610-82d0-409a-9b1b-bac292a27c6d" />

<img width="3006" height="584" alt="image" src="https://github.com/user-attachments/assets/2154afe8-599b-47fe-812c-5e1cc5affb2a" />

<img width="1074" height="160" alt="image" src="https://github.com/user-attachments/assets/116870b7-e686-488b-89d4-e6b98fc395d7" />

<img width="874" height="188" alt="image" src="https://github.com/user-attachments/assets/93fa8364-9d53-4b7c-b2ef-4e8b8a2e7537" />

<img width="732" height="460" alt="image" src="https://github.com/user-attachments/assets/b9082b6e-dda5-4d3b-94cd-3ff6bdfbded1" />



---

## 🌐 Live Demo

🚀 **Deployed App:** [URL-SHORTENER](mern-url-shortener-deployment.vercel.app)

---

## ✨ Features

✅ **Shorten URLs instantly** – Generate short, clean, shareable links
📊 **Track analytics** – Count and monitor URL visits
🧩 **Type-safe backend** – Built entirely with TypeScript
⚙️ **Drizzle ORM** – Lightweight, modern database layer
🌍 **Responsive UI** – Optimized for desktop and mobile
🚀 **Fast build & runtime** – Powered by Bun + Next.js
☁️ **Deployed on Orchids** – Cloud-ready and production optimized

---

## 🛠️ Tech Stack

| Layer          | Technologies                            |
| -------------- | --------------------------------------- |
| **Frontend**   | Next.js, React, TypeScript, TailwindCSS |
| **Backend**    | Node.js, Express.js, Drizzle ORM        |
| **Database**   | MongoDB                                 |
| **Build Tool** | Bun                                     |
| **Deployment** | Vercel Platform                         |

---

## 📂 Project Structure

```
📦 URL_shortner
├── drizzle/              # Database ORM setup (Drizzle)
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # React UI components
│   ├── pages/            # Next.js pages
│   ├── lib/              # Utility and helper functions
│   └── server/           # Express backend logic
├── middleware.ts         # Next.js middleware for redirects
├── drizzle.config.ts     # Drizzle ORM configuration
├── next.config.ts        # Next.js configuration
├── .env                  # Environment variables
├── README.md
└── bun.lock / package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/RAJVEER42/URL_shortner.git
cd URL_shortner
```

### 2️⃣ Install dependencies

```bash
bun install   # or npm install
```

### 3️⃣ Environment configuration

Create a `.env` file in the root directory:

```bash
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:3000
```

### 4️⃣ Run the development server

```bash
bun run dev   # or npm run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000).

---

## 🧠 How It Works

1. The user enters a **long URL** in the frontend form.
2. The frontend sends a request to the **Express backend API**.
3. The backend:

   * Validates the URL.
   * Generates a unique short code.
   * Saves the mapping to **MongoDB** via **Drizzle ORM**.
4. When a user visits the short link, they are **redirected** to the original URL.
5. Analytics are optionally logged for each visit.

---

## 🧩 API Endpoints

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| `POST` | `/api/shorten`  | Create a new shortened URL   |
| `GET`  | `/api/:shortId` | Redirect to the original URL |
| `GET`  | `/api/urls`     | Fetch all shortened URLs     |

Example:

```bash
POST /api/shorten
Content-Type: application/json
{
  "url": "https://example.com"
}
```

Response:

```json
{
  "shortUrl": "https://short.ly/abc123"
}
```

---

## 🧰 Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `bun run dev`   | Run the development server |
| `bun run build` | Build for production       |
| `bun run start` | Start production server    |
| `bun run lint`  | Lint the codebase          |

---

## 🧑‍💻 Development Notes

* Built using **TypeScript** for end-to-end type safety
* **Drizzle ORM** used for schema management and migrations
* Uses **Next.js Middleware** for dynamic redirects
* Frontend styling powered by **TailwindCSS**
* Environment variables managed via `.env`

---

## 🚀 Deployment

This project is deployed on **Orchids Cloud** using Bun for fast builds and startup times.

**Live Deployment:**
👉 [URL-SHORTENER](mern-url-shortener-deployment.vercel.app)

To deploy your own instance:

```bash
bun run build
bun run start
```

---

## 📈 Future Enhancements

* [ ] Add user authentication (login to manage links)
* [ ] Add analytics dashboard with charts
* [ ] Support custom short URLs
* [ ] QR code generation
* [ ] API key–based usage limits

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch (`feature/awesome-feature`)
3. Commit your changes
4. Push to your branch and open a PR

---

## 🪪 License

This project is open-source under the **MIT License**.

---

## 🧡 Acknowledgements

* [Next.js](https://nextjs.org/)
* [Drizzle ORM](https://orm.drizzle.team/)
* [MongoDB](https://www.mongodb.com/)
* [TailwindCSS](https://tailwindcss.com/)
* [Bun](https://bun.sh/)

---

## ~ Rajveer Bishnoi ✨


---
