# Poth - Book Community Service

A comprehensive Full-Stack Mobile Application designed to bridge the gap between bookshop owners and book enthusiasts. This platform allows shop owners to manage their inventory and customers to discover, track, and review bookshops within their vicinity — and share experiences and ideas about books and bookshops.

---

## Team Members & Responsibilities

This project is a collaborative effort by 6 members, each handling a core module of the system.

|        Member Name         | Student ID |         Assigned Tasks / Modules        |
| -------------------------- | ---------- | --------------------------------------- |
| **Samarasekara S.O.A.N.N** | IT24102080 | **User Management & Review Management** |
| **Thilakarathne G V S**    | IT24101250 | **Blog Management**                     |
| **Ranasinghe R.P.V.K.**    | IT24101829 | **Shop Management**                     |
| **Senevirathne J.A.D.T.**  | IT24100871 | **Book Management**                     |
| **Gangoda E.W.W.M.C.R.B.** | IT24100119 | **Order Management**                    |
| **Wanigasekara Y. A.**     | IT24101780 | **Report Management**                   |

---

## Tech Stack

| Layer            | Technology                             |
| ---------------- | -------------------------------------- |
| **Frontend**     | React Native (Expo), Expo Router       |
| **Backend**      | Node.js, Express.js                    |
| **Database**     | MongoDB Atlas (Mongoose)               |
| **Auth**         | JWT (JSON Web Tokens) & Bcryptjs       |
| **Image Storage**| Cloudinary (uploads handled by Multer) |
| **API Testing**  | Postman                                |

---

## Core Features

- **User Authentication** — Register, login, and manage accounts with JWT-secured sessions
- **Shop Management** — Create and manage bookshop profiles with images and location info
- **Book Management** — Add and browse books with cover images, pricing, and stock info
- **Review Management** — Leave star ratings and written comments on shops and books, with optional **photo uploads** saved to Cloudinary
- **Discovery & Search** — Browse all shops and books with real-time search filtering
- **Image Uploads** — Shop profile images, book covers, and review photos are all hosted on Cloudinary

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- [Expo Go](https://expo.dev/client) app on your phone **or** Android Studio with an emulator
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Cloudinary](https://cloudinary.com/) account (free tier is sufficient)

---

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
npm run dev
```

#### Environment Variables

Create a `.env` file inside the `backend/` directory with the following keys:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Note:** The Cloudinary credentials are required for all image uploads (book covers, shop profiles, and review photos).

---

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
npx expo start --port 8080
```

Scan the QR code with the **Expo Go** app, or press `w` to open in the web browser.

---

## Validation & Business Rules

* **Email:** Every user email address must correctly contain an `@` sign.
* **Password:** Passwords must strictly be more than 8 characters long.
* **Phone / Contact Number:** Both user phone numbers and shop contact numbers must be exactly 10 characters long.
* **Prices & Stock Counts:** Items (`price`, `stockCount`, `totalPrice`) cannot have negative values (min 0).
* **Reviews:** Customers/Shop owners cannot add multiple/duplicate reviews on the same book or shop. Shop owners are strictly forbidden from placing reviews on their own shops.

---

## API Overview

### 👤 Users (`/api/users`)
| Method | Endpoint    | Description | Access |
| ------ | ----------- | ----------- | ------ |
| `POST` | `/register` | Register a new user | Public |
| `POST` | `/login`    | Login and receive a JWT token | Public |
| `PUT`  | `/profile`  | Update logged in user profile | Protected |
| `DELETE`| `/profile` | Delete logged in user profile | Protected |

### 🏬 Shops (`/api/shops`)
| Method | Endpoint      | Description | Access |
| ------ | ------------- | ----------- | ------ |
| `GET`  | `/`           | Get all shops | Public |
| `POST` | `/`           | Create a new shop | Protected |
| `GET`  | `/owner/me`   | Get shops owned by logged-in user | Protected |
| `GET`  | `/:id`        | Get specific shop details | Public |
| `PUT`  | `/:id`        | Update a specific shop | Protected |
| `DELETE`| `/:id`       | Delete a specific shop | Protected |
| `POST` | `/:id/follow` | Toggle following a shop | Protected |

### 📚 Books (`/api/books`)
| Method | Endpoint        | Description | Access |
| ------ | --------------- | ----------- | ------ |
| `GET`  | `/`             | Get all books | Public |
| `POST` | `/`             | Create a new book | Protected |
| `GET`  | `/owner/me`     | Get books owned by logged-in user | Protected |
| `GET`  | `/:id`          | Get specific book details | Public |
| `PUT`  | `/:id`          | Update a specific book | Protected |
| `DELETE`|`/:id`          | Delete a specific book | Protected |
| `GET`  | `/shop/:shopId` | Get all books matching a specific shop | Public |

### 📦 Orders (`/api/orders`)
| Method | Endpoint               | Description | Access |
| ------ | ---------------------- | ----------- | ------ |
| `POST` | `/`                    | Create a new order | Public / Protected |
| `DELETE`| `/:id`                | Delete a specific order | Public / Protected |
| `PUT`  | `/:id/status`          | Update order's operational status | Public / Protected |
| `PUT`  | `/:id/delivery`        | Update order's delivery details | Public / Protected |
| `GET`  | `/reader/:readerId`    | Get orders related to a reader | Public / Protected |
| `GET`  | `/shop/:shopId`        | Get orders related to a shop | Public / Protected |

### ⭐ Reviews (`/api/reviews`)
| Method | Endpoint        | Description | Access |
| ------ | --------------- | ----------- | ------ |
| `GET`  | `/:targetId`    | Get reviews for a specific target | Public |
| `POST` | `/`             | Add a new review to a book or shop | Protected |
| `GET`  | `/me`           | Get logged-in user's posted reviews | Protected |
| `PUT`  | `/:id`          | Update a review | Protected |
| `DELETE`| `/:id`         | Delete a review | Protected |

### 📝 Blogs (`/api/blogs`)
| Method | Endpoint          | Description | Access |
| ------ | ----------------- | ----------- | ------ |
| `GET`  | `/`               | Get all blogs | Public |
| `POST` | `/`               | Create a new blog post | Protected |
| `GET`  | `/:id`            | Get specific blog | Public |
| `PUT`  | `/:id`            | Update an existing blog | Protected |
| `DELETE`| `/:id`           | Delete an existing blog | Protected |
| `POST` | `/:id/like`       | Toggle "like" status | Protected |
| `GET`  | `/:id/comments`   | Fetch all comments attached to a blog | Public |
| `POST` | `/:id/comments`   | Create a new comment onto a blog | Protected |

### 📊 Reports (`/api/reports`)
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| `GET`  | `/`      | Generate or retrieve reports | Protected |
| `POST` | `/`      | Submit a report payload | Protected |

> Review photo uploads use `multipart/form-data` with the field name `image`. Images are stored in Cloudinary under the `poth_uploads` folder.

---

## Branch Structure

| Branch                       | Purpose                             |
| ---------------------------- | ----------------------------------- |
| `main`                       | Stable production-ready code        |
| `dev`                        | Integration branch for all features |
| `nandun_Review_Management`   | User management & review management |

---