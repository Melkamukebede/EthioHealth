const app = require('./app');

const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, () => {
    console.log('============================================');
    console.log('   EthioHealth AI API Server');
    console.log('   Running on port: ' + PORT);
    console.log('   Environment: ' + (process.env.NODE_ENV || 'production'));
    console.log('   Started: ' + new Date().toISOString());
    console.log('============================================');
});

process.on('SIGTERM', () => {
    console.log('Server shutting down...');
    server.close(() => process.exit(0));
});
