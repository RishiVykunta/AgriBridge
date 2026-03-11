const { hash, compare } = require('bcryptjs');

async function test() {
    const password = 'Password@123';
    const hashed = await hash(password, 12);
    console.log('Password:', password);
    console.log('Hashed:', hashed);
    const valid = await compare(password, hashed);
    console.log('Valid:', valid);
    const invalid = await compare('WrongPassword', hashed);
    console.log('Invalid:', invalid);
}

test();
