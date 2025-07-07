<<<<<<< HEAD
﻿console.log('🔍 Starting CallOfCode health check...');
console.log('✅ Health check placeholder - Phoenix v3.1');
console.log('📊 SUMMARY: System ready');
=======
/**
 * @ai-reasoning Using JavaScript to avoid ts-node setup complexity
 * @performance Target: <100ms execution time
 */

const { execSync } = require('child_process');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');

// Try to load dotenv, but don't fail if not available (CI environments)
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('⚠️  dotenv not available - using environment variables directly');
}

const results = [];

function addResult(category, status, message, details) {
  results.push({ category, status, message, details });
}

function checkEnv(vars) {
  const missing = vars.filter((k) => !process.env[k]);
  
  if (missing.length) {
    addResult('Environment', 'fail', `Missing ${missing.length} required variables`, missing.join(', '));
    return false;
  }
  
  addResult('Environment', 'pass', 'All required environment variables present');
  return true;
}

function checkDirectory(dirPath, critical = true) {
  if (!existsSync(dirPath)) {
    addResult('Filesystem', critical ? 'fail' : 'warn', `Missing directory: ${dirPath}`);
    return false;
  }
  
  addResult('Filesystem', 'pass', `Found directory: ${dirPath}`);
  return true;
}

function run(cmd, critical = false) {
  try {
    const output = execSync(cmd, { 
      encoding: 'utf8',
      stdio: 'pipe' 
    }).trim();
    
    addResult('Command', 'pass', cmd, output.split('\n')[0]);
    return true;
  } catch (e) {
    addResult('Command', critical ? 'fail' : 'warn', `${cmd} failed`, e.message);
    return false;
  }
}

// Main execution
console.log('🔍 Starting CallOfCode health check...\n');

// Environment checks
checkEnv([
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]);

// Build output checks
checkDirectory('./out', false);
checkDirectory('./.next', false);

// Tool version checks
run('node --version');
run('npm --version');

// Generate report
console.log('\n🏥 CALLOFCODE HEALTH CHECK REPORT');
console.log('═'.repeat(50));

const categories = [...new Set(results.map(r => r.category))];

categories.forEach(category => {
  const categoryResults = results.filter(r => r.category === category);
  const failed = categoryResults.filter(r => r.status === 'fail').length;
  const warned = categoryResults.filter(r => r.status === 'warn').length;
  
  const icon = failed > 0 ? '❌' : warned > 0 ? '⚠️' : '✅';
  console.log(`\n${icon} ${category.toUpperCase()}`);
  
  categoryResults.forEach(result => {
    const statusIcon = result.status === 'pass' ? '✓' : result.status === 'warn' ? '!' : '✗';
    console.log(`  ${statusIcon} ${result.message}`);
    if (result.details) {
      console.log(`    → ${result.details}`);
    }
  });
});

// Summary
const totalPassed = results.filter(r => r.status === 'pass').length;
const totalFailed = results.filter(r => r.status === 'fail').length;
const totalWarned = results.filter(r => r.status === 'warn').length;

console.log('\n' + '═'.repeat(50));
console.log(`📊 SUMMARY: ${totalPassed} passed, ${totalWarned} warnings, ${totalFailed} failed`);

process.exit(totalFailed > 0 ? 1 : 0);
>>>>>>> main
