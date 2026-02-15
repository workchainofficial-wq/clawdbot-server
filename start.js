#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('Starting Clawdbot gateway...');
console.log('Port:', process.env.PORT || 18789);

// Use npx to run clawdbot (works with local dependencies)
const gateway = spawn('npx', [
  'clawdbot',
  'gateway',
  'start',
  '--bind',
  '0.0.0.0',
  '--port',
  process.env.PORT || '18789'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CLAWDBOT_NO_SYSTEMD: '1'
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
