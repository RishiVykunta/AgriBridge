# AgriBridge

AgriBridge is an e-commerce and community platform tailored for the agricultural sector. It connects farmers, retailers, and agricultural brands to facilitate the buying and selling of seeds, crop protection, crop nutrition, equipment, and services. 

## 🚀 Technologies Used
- **Frontend & Backend**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on Neon)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & bcryptjs based custom authentication
- **Icons**: Lucide React

## 📦 Features
- Role-based user dashboards (Admin, Farmer, Retailer, Consumer).
- Extensive product catalog spanning multiple categories (Seeds, Horticulture, Animal Husbandry).
- Fully functional shopping cart and wishlist system.
- Secure, token-based authentication.

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- A PostgreSQL database string (e.g., from Neon, Supabase, or a local instance)

### 2. Clone the Repository
```bash
git clone https://github.com/RishiVykunta/AgriBridge.git
cd AgriBridge
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root of the project with the following minimum required variables.
```env
# Database connection string
DATABASE_URL="postgres://user:password@host:port/database"

# Secret Key for JWT token generation
JWT_SECRET="your-super-secret-key"
```

### 5. Setup the Database
Run the following Prisma commands to sync your database schema, apply migrations, and optionally seed it with default data.
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Run seed data (optional, to populate initial products/users)
npm run db:seed
```

### 6. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Scripts Breakdown
- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run db:studio`: Opens Prisma Studio to view database contents visually.

---
Built with ❤️ for agriculture.
