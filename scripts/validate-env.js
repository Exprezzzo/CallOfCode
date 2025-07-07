#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Required environment variables
const required = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

// Check if running in CI
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

console.log('🔍 Validating environment variables...');
console.log(`Environment: ${isCI ? 'CI/GitHub Actions' : 'Local'}`);

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  
  if (!isCI) {
    console.error('\n💡 Make sure you have a .env.local file with all required variables');
    console.error('   Copy .env.local.example and fill in the values');
  }
  
  process.exit(1);
}

console.log('✅ All required environment variables present\n');

// Validate Next.js config for static export
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const config = fs.readFileSync(nextConfigPath, 'utf8');
  if (!config.includes("output: 'export'")) {
    console.warn('⚠️  Warning: next.config.js missing "output: \'export\'" for static builds');
  }
}

// Check for dynamic route indicators
const appDir = path.join(process.cwd(), 'app');
if (fs.existsSync(appDir)) {
  const dynamicRoutes = [];
  
  function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (file.match(/^\[.*\]$/)) {
          dynamicRoutes.push(fullPath);
        }
        checkDirectory(fullPath);
      }
    });
  }
  
  checkDirectory(appDir);
  
  if (dynamicRoutes.length > 0) {
    console.warn('⚠️  Found dynamic routes that may prevent static export:');
    dynamicRoutes.forEach(route => console.warn(`   - ${route}`));
    console.warn('\n   Make sure these have generateStaticParams() defined');
  }
}

console.log('🚀 Environment validation complete');