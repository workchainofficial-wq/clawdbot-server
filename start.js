#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Clawdbot gateway...');
console.log('Port:', process.env.PORT || 18789);

// Config file path
const configPath = path.join(__dirname, 'config.yaml');

// Use npx to run clawdbot in foreground mode
// Config is loaded via CLAWDBOT_CONFIG_PATH environment variable
const gateway = spawn('npx', [
  'clawdbot',
  'gateway',
  'run',
  '--bind',
  '0.0.0.0',
  '--port',
  process.env.PORT || '18789',
  '--allow-unconfigured'  // Allow running without full setup
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CLAWDBOT_NO_SYSTEMD: '1',
    CLAWDBOT_CONFIG_PATH: configPath,
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
