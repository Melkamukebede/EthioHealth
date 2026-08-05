// ============================================
// USER SERVICE - Simple file-based storage
// ============================================

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '../../data/users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users file if not exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

function getUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

async function createUser(name, email, password) {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        throw new Error('Email already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

async function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        throw new Error('Invalid email or password');
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

function getUserById(id) {
    const users = getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

module.exports = { createUser, loginUser, getUserById };
