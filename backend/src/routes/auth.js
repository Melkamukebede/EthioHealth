// ============================================
// AUTH ROUTES - Register & Login
// ============================================

const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { generateToken, verifyToken } = require('../middleware/auth');

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }
        
        // Create user
        const user = await userService.createUser(name, email, password);
        
        // Generate token
        const token = generateToken(user);
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user,
                token
            }
        });
        
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        
        // Login user
        const user = await userService.loginUser(email, password);
        
        // Generate token
        const token = generateToken(user);
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
        
    } catch (err) {
        res.status(401).json({
            success: false,
            message: err.message
        });
    }
});

// GET /api/v1/auth/me - Get current user
router.get('/me', verifyToken, (req, res) => {
    const user = userService.getUserById(req.user.id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    res.json({
        success: true,
        data: { user }
    });
});

module.exports = router;
