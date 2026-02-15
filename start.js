#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('Starting Clawdbot gateway...');
console.log('Port:', process.env.PORT || 18789);

// Use npx to run clawdbot in foreground mode (no systemd)
const gateway = spawn('npx', [
  'clawdbot',
  'gateway',
  'run',  // Changed from 'start' to 'run' - runs in foreground without systemd
  '--bind',
  '0.0.0.0',
  '--port',
  process.env.PORT || '18789'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CLAWDBOT_NO_SYSTEMD: '1',
    NODE_ENV: 'production'
  }
});

gateway.on('error', (err) => {
  console.error('Failed to start gateway:', err);
  process.exit(1);
});

gateway.on('exit', (code) => {
  console.log('Gateway exited with code:', code);
  process.exit(code || 0);
});
