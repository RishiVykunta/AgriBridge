const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const users = await prisma.user.findMany({
            include: { roles: true }
        });

        console.log(`Found ${users.length} users:`);
        users.forEach(u => {
            console.log(`- Email: "${u.email}"`);
            console.log(`  Name: ${u.name}`);
            console.log(`  Password Hash (start): ${u.password.substring(0, 10)}... (Length: ${u.password.length})`);
            console.log(`  Roles: ${u.roles.map(r => `${r.role} (${r.status})`).join(', ')}`);
        });
    } catch (err) {
        console.error('Error fetching users:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
