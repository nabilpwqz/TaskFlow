## 🚀 TaskFlow — Freelance Marketplace Platform

**Live Site:** [https://taskflow-app-opal.vercel.app/](https://taskflow-app-opal.vercel.app/)

TaskFlow is a full-stack SaaS marketplace that connects clients with high-quality freelance professionals across development, design, writing, and marketing. Built with scalability, clean architecture, and production standards in mind.

---

## 🧠 Project Vision

TaskFlow is not a demo project. It’s designed as a **real-world marketplace system** with:

* Secure authentication
* Scalable backend architecture
* Modular frontend structure
* Real data handling (no placeholders)
* SaaS-grade UI/UX

---

## ⚙️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript (strict mode)
* Tailwind CSS
* Recharts (analytics)

### Backend

* Next.js API Routes (server-side)
* TypeScript
* MongoDB + Mongoose

### Authentication

* JWT (HTTP-only cookies)

---

## 🏗️ Architecture

```
/app            → Next.js app router pages
/components     → Reusable UI components
/features       → Feature-based modules
/hooks          → Custom React hooks
/lib            → Configs & utilities
/services       → API service layer
/types          → TypeScript types
/utils          → Helper functions

/server
  /models       → Mongoose schemas
  /controllers  → Business logic
  /routes       → API routes
  /middleware   → Auth & error handling
```

### Principles Applied:

* Separation of concerns
* Service-layer abstraction
* Reusable component system
* Scalable folder structure

---

## 🔥 Core Features

### 🌐 Landing Experience

* Sticky responsive navbar
* Hero section with CTA
* 7+ sections:

  * Features
  * Categories
  * Stats (charts)
  * Testimonials
  * FAQ
  * Blog preview
  * Newsletter CTA

---

### 📦 Marketplace System

* Service listings with:

  * Image
  * Title
  * Description
  * Price / rating
* Equal-sized responsive cards
* Skeleton loaders

---

### 🔍 Explore Page

* Search functionality
* Filtering (category, price, rating)
* Sorting
* Pagination

---

### 📄 Service Details Page

* Image gallery
* Full description
* Specs
* Reviews
* Related services

---

### 🔐 Authentication System

* Register / Login
* JWT (secure cookies)
* Form validation
* Error handling
* Demo login support

---

### 🛡️ Protected Features

#### ➕ Add Service (`/items/add`)

* Title
* Short + full description
* Price
* Image

#### 📊 Manage Services (`/items/manage`)

* View all user services
* Delete functionality
* Clean dashboard layout

---

### 📄 Additional Pages

* About
* Contact
* Blog

---

## 🗄️ Database Design

### User Schema

```ts
{
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}
```

### Item (Service) Schema

```ts
{
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  image: string;
  userId: ObjectId;
  createdAt: Date;
}
```

✔ Indexed fields for performance
✔ Relationship: User → Services

---

## 🔌 API Endpoints

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Services

```
GET    /api/items
GET    /api/items/:id
POST   /api/items
DELETE /api/items/:id
GET    /api/items/user
```

---

## 🔄 Authentication Flow

1. User logs in
2. JWT generated
3. Stored in HTTP-only cookie
4. Middleware validates token
5. Protected routes unlocked

---

## 🎨 UI System

* Max 3 primary colors + neutral palette
* Consistent spacing & typography
* Same card dimensions across app
* Mobile-first responsive design
* No placeholder content

---

## ⚡ Performance Optimizations

* Lazy loading components
* Skeleton loaders
* Optimized images
* Efficient API calls

---

## 🚀 Deployment

### Frontend + Backend

* Deployed on **Vercel**

### Database

* MongoDB Atlas

---

## 🔑 Demo Access

```
User Account
Email: demo@taskflow.io
Password: demo123



Admin Account
Email: admin@taskflow.io
Password: admin123
```

---

## 📈 Why This Project Stands Out

* Real SaaS architecture (not CRUD demo)
* Clean TypeScript implementation
* Secure auth system
* Scalable backend structure
* Strong UI consistency
* Production-ready mindset

---

## 🧩 Future Improvements

* Payment integration (Stripe)
* Real-time chat (WebSockets)
* Freelancer bidding system
* Reviews & rating algorithm
* Admin analytics dashboard

---

## 🧑‍💻 Author

*Nabil*
-Full Stack Developer 
