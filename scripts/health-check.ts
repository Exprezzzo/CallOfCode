import { config } from 'dotenv';
config();
import { execSync } from 'child_process';
import { existsSync } from 'fs';

function checkEnv(vars: string[]) {
  const missing = vars.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('❌ Missing env vars:', missing);
    return false;
  }
  console.log('✅ All env vars present');
  return true;
}

function checkDirectory(path: string) {
  if (!existsSync(path)) {
    console.error(`❌ Missing directory: ${path}`);
    return false;
  }
  console.log(`✅ Found: ${path}`);
  return true;
}

function run(cmd: string) {
  try {
    const out = execSync(cmd, { stdio: 'pipe' }).toString();
    console.log(`✅ ${cmd}\n${out}`);
    return true;
  } catch {
    console.error(`❌ ${cmd} failed`);
    return false;
  }
}

(function runHealthCheck() {
  console.log('🔍 Running system diagnostics...\n');

  checkEnv([
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ]);

  checkDirectory('./out');
  run('ls -la out || echo NO EXPORT');
  run('firebase --version');
  run('node --version');
  run('npm run validate-env');
})();
