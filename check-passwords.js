const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            password: true
        }
    });

    console.log('User password hashes:');
    users.forEach(u => {
        // Only print first 10 chars for security
        console.log(`${u.email}: ${u.password.substring(0, 10)}... (length: ${u.password.length})`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
