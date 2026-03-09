# AgriBridge

AgriBridge is an e-commerce and community platform tailored for the agricultural sector. It connects farmers, retailers, and agricultural brands to facilitate the buying and selling of seeds, crop protection, crop nutrition, equipment, and services.

## 🌐 Live Demo
👉 https://agri-bridge-jljo.vercel.app/

Explore the deployed application and experience the platform's features including product browsing, shopping cart functionality, and role-based dashboards.

---

## 🚀 Technologies Used
- **Frontend & Backend**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on Neon)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & bcryptjs based custom authentication
- **Icons**: Lucide React

---

## 📦 Features
- Role-based user dashboards (**Admin, Farmer, Retailer, Consumer**)
- Extensive product catalog spanning multiple categories (**Seeds, Horticulture, Animal Husbandry**)
- Fully functional **shopping cart and wishlist system**
- Secure **JWT-based authentication system**
- Modern responsive UI built with **Tailwind CSS**

---

## 🛠️ Local Setup Instructions

### 1️⃣ Prerequisites
- Node.js (**v18 or higher recommended**)
- A PostgreSQL database connection string (from Neon, Supabase, or local PostgreSQL)

---

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/RishiVykunta/AgriBridge.git
cd AgriBridge
```

---

### 3️⃣ Install Dependencies
```bash
npm install
```

---

### 4️⃣ Configure Environment Variables
Create a `.env` file in the root of the project.

```env
# Database connection string
DATABASE_URL="postgres://user:password@host:port/database"

# Secret Key for JWT token generation
JWT_SECRET="your-super-secret-key"
```

---

### 5️⃣ Setup the Database

Run the following Prisma commands to generate the client and sync the database schema.

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Run seed data (optional)
npm run db:seed
```

---

### 6️⃣ Start the Development Server

```bash
npm run dev
```

Open the application in your browser:

```
http://localhost:3000
```

---

## 📝 Scripts Breakdown

| Script | Description |
|------|-------------|
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Runs the production server |
| `npm run lint` | Checks code quality using ESLint |
| `npm run db:studio` | Opens Prisma Studio to manage database visually |

---

## 📌 Project Repository
GitHub Repository:  
https://github.com/RishiVykunta/AgriBridge

---

Built to empower the **agriculture ecosystem** and connect **farmers, retailers, and agricultural brands** through technology.
