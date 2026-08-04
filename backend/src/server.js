const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 10000;

// Start server
const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║    EthioHealth AI API Server          ║
║    Running on port: ${PORT}              ║
║    Environment: ${process.env.NODE_ENV}     ║
║    Started: ${new Date().toISOString()} ║
╚══════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    server.close(() => {
        prisma.$disconnect();
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = server;
