#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('Starting Clawdbot gateway...');
console.log('Port:', process.env.PORT || 18789);

// Run clawdbot gateway in foreground mode without config file
// Uses environment variables and defaults
const gateway = spawn('npx', [
  'clawdbot',
  'gateway',
  'run',
  '--bind',
  '0.0.0.0',
  '--port',
  process.env.PORT || '18789',
  '--allow-unconfigured'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CLAWDBOT_NO_SYSTEMD: '1',
    CLAWDBOT_GATEWAY_MODE: 'local',
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
