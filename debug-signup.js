const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const email = `test-${Date.now()}@example.com`;
    const password = "Password123!";
    const hashed = await bcrypt.hash(password, 12);

    console.log(`Attempting to create user with email: ${email}`);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                name: "Test User",
                phone: "9876543210",
                emailVerified: false,
            },
        });
        console.log('User created successfully:', user.id);
    } catch (err) {
        console.error('Signup Error Detailed:');
        console.error(JSON.stringify(err, null, 2));
    } finally {
        await prisma.$disconnect();
    }
}

main();
