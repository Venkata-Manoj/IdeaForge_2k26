import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'adminideaforge2k26';
const hash = bcrypt.hashSync(password, 10);

console.log('\nPassword:', password);
console.log('Hash:', hash);
console.log('\nAdd this to your .env file:');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
