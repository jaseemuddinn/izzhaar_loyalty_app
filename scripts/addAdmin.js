// Usage: node scripts/addAdmin.js <username> <password>
// This script adds a new admin to the MongoDB admins collection.

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in .env.local');
    process.exit(1);
}

async function main() {
    const [, , username, password] = process.argv;
    if (!username || !password) {
        console.error('Usage: node scripts/addAdmin.js <username> <password>');
        process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);

    // Dynamically import the Admin model (ESM)
    const { default: Admin } = await import('../src/models/Admin.js');

    const existing = await Admin.findOne({ username });
    if (existing) {
        console.error('Admin with this username already exists.');
        process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });
    console.log('Admin created successfully!');
    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
