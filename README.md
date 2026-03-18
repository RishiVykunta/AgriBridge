<div align="center">
  <h1>🌱 AgriBridge</h1>
  <p><strong>Empowering the Agriculture Ecosystem through Technology</strong></p>

  <p>
    <a href="https://agri-bridge-jljo.vercel.app/" target="_blank">View Live Demo</a>
    ·
    <a href="https://github.com/RishiVykunta/AgriBridge/issues">Report Bug</a>
    ·
    <a href="https://github.com/RishiVykunta/AgriBridge/issues">Request Feature</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  </p>
</div>

---

## 📖 About The Project

**AgriBridge** is a modern, full-stack e-commerce and community platform specifically tailored for the agricultural sector. It bridges the gap between farmers, retailers, agricultural brands, and consumers, facilitating the seamless trade of seeds, crop protection, equipment, and services. The platform is designed with a focus on usability, security, and scalability to meet the diverse needs of the agricultural community.

### 🌟 Key Features

- 🔐 **Role-Based Authentication**: Secure JWT-based auth system with specific dashboards for Admin, Farmer, Retailer, and Consumer roles.
- 🛍️ **Extensive Catalog**: Browse through well-organized categories like Seeds, Crop Protection, Animal Husbandry, and Organic products.
- 🛒 **Advanced E-Commerce**: Fully functional shopping cart, wishlist, product reviews, and streamlined checkout processes.
- 📈 **Dynamic Sections**: Today's offers, trending products, new arrivals, and featured agricultural brands natively integrated on the homepage.
- 👨‍🌾 **Consultation & Loans**: Integrated forms for specialist consultations and agricultural equipment loan applications.
- 📱 **Mobile-First Design**: Fully responsive, modern UI built with Tailwind CSS v4, ensuring accessibility across all devices.

---

## 🌐 Live Demo

Experience the platform live: [AgriBridge Live Application](https://agri-bridge-jljo.vercel.app/)

---

## 🛠️ Technical Architecture

### Tech Stack
- **Frontend & Backend**: [Next.js](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on Neon)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & `bcryptjs` for secure password hashing
- **Email Service**: Nodemailer & Resend for email verification flows
- **Validation**: Zod for robust schema validation

### Database Schema Overview
The robust Prisma schema is optimized for multi-role user flows and complex e-commerce interactions:
- **Users & Roles**: `User`, `UserRole`, `EmailVerificationToken`, `PasswordResetToken`
- **Catalog & Commerce**: `Product`, `ProductMedia`, `CartItem`, `WishlistItem`, `Review`
- **Services**: `LoanApplication`, `SpecialistConsultation`

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or higher recommended)
- A PostgreSQL database instance (Neon, Supabase, or local)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RishiVykunta/AgriBridge.git
   cd AgriBridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   # Database connection string
   DATABASE_URL="postgres://user:password@host:port/database"
   
   # Secret Key for JWT token generation
   JWT_SECRET="your-super-secret-key"
   ```

4. **Setup the Database**
   Run the following Prisma commands to format the schema, push it to the DB, and generate the client.
   ```bash
   npm run db:generate   # Generate Prisma Client
   npm run db:push       # Push schema to database
   npm run db:seed       # Run seed data (optional)
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` \| `dev:turbo` | Starts the Next.js development server. |
| `npm run build` | Creates an optimized production build. |
| `npm run start` | Runs the built production application. |
| `npm run lint` | Checks code quality and formatting. |
| `npm run db:studio` | Opens Prisma Studio to visually inspect and manage database records. |

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ for the Agriculture Ecosystem.</p>
</div>
