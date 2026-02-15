#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 18789;

console.log('='.repeat(50));
console.log('Starting Clawdbot Server on Render');
console.log('Port:', PORT);
console.log('='.repeat(50));

// Create a simple HTTP server to keep Render happy
// Render needs an open port to consider the service "live"
const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      service: 'clawdbot-gateway',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ HTTP server listening on 0.0.0.0:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  // Now start the Clawdbot gateway in the background
  console.log('\n🚀 Starting Clawdbot gateway...\n');
  
  const gateway = spawn('npx', ['clawdbot', 'gateway', 'run', '--allow-unconfigured'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      CLAWDBOT_NO_SYSTEMD: '1',
      CLAWDBOT_GATEWAY_MODE: 'local',
      CLAWDBOT_GATEWAY_PORT: '8080',  // Different port for gateway API
      NODE_ENV: 'production'
    }
  });
  
  gateway.on('error', (err) => {
    console.error('❌ Gateway error:', err);
  });
  
  gateway.on('exit', (code) => {
    console.log(`⚠️ Gateway exited with code: ${code}`);
    if (code !== 0) {
      console.log('Gateway will restart automatically...');
    }
  });
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
