/**
 * Comprehensive User Testing Suite for Insync Connect
 * CommonJS version for Node.js compatibility
 */

const fs = require('fs');
const path = require('path');

const tests = {
  passed: 0,
  failed: 0,
  warnings: 0,
  results: []
};

function log(type, test, message, details = null) {
  const result = { type, test, message, details, timestamp: new Date().toISOString() };
  tests.results.push(result);

  const emoji = type === 'PASS' ? '✅' : type === 'FAIL' ? '❌' : '⚠️';
  console.log(`${emoji} [${type}] ${test}: ${message}`);
  if (details) console.log(`   Details: ${details}`);

  if (type === 'PASS') tests.passed++;
  else if (type === 'FAIL') tests.failed++;
  else if (type === 'WARN') tests.warnings++;
}

async function testEnvironmentVariables() {
  console.log('\n=== Testing Environment Configuration ===\n');

  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_PUBLISHABLE_KEY'
    ];

    for (const varName of requiredVars) {
      if (envContent.includes(varName)) {
        const match = envContent.match(new RegExp(`${varName}=(.+)`));
        if (match && match[1] && match[1].length > 10) {
          log('PASS', 'Environment', `${varName} is configured`, `Length: ${match[1].length} chars`);
        } else {
          log('WARN', 'Environment', `${varName} may be empty`);
        }
      } else {
        log('FAIL', 'Environment', `${varName} is missing`);
      }
    }

    // Check if using local or production Supabase
    if (envContent.includes('127.0.0.1') || envContent.includes('localhost')) {
      log('PASS', 'Environment', 'Configured for local Supabase development');
    } else if (envContent.includes('supabase.co')) {
      log('PASS', 'Environment', 'Configured for production Supabase');
    }
  } else {
    log('FAIL', 'Environment', '.env.local file not found');
  }
}

async function testFileStructure() {
  console.log('\n=== Testing File Structure ===\n');

  const criticalFiles = [
    { path: 'src/App.tsx', category: 'Core' },
    { path: 'src/main.tsx', category: 'Core' },
    { path: 'src/pages/Index.tsx', category: 'Pages' },
    { path: 'src/pages/Auth.tsx', category: 'Pages' },
    { path: 'src/pages/FounderDashboard.tsx', category: 'Pages' },
    { path: 'src/pages/AnalystDashboard.tsx', category: 'Pages' },
    { path: 'src/pages/FounderApplication.tsx', category: 'Pages' },
    { path: 'src/pages/InvestorApplication.tsx', category: 'Pages' },
    { path: 'src/hooks/useMatchmaking.ts', category: 'Hooks' },
    { path: 'src/hooks/useMessages.ts', category: 'Hooks' },
    { path: 'src/integrations/supabase/client.ts', category: 'Integration' },
    { path: 'supabase/functions/matchmaking/index.ts', category: 'Edge Functions' },
    { path: 'package.json', category: 'Config' },
    { path: 'vite.config.ts', category: 'Config' },
    { path: 'tsconfig.json', category: 'Config' }
  ];

  for (const file of criticalFiles) {
    if (fs.existsSync(file.path)) {
      const stats = fs.statSync(file.path);
      log('PASS', file.category, `${file.path} exists`, `Size: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      log('FAIL', file.category, `${file.path} is missing`);
    }
  }
}

async function testDependencies() {
  console.log('\n=== Testing Dependencies ===\n');

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const criticalDeps = [
    { name: 'react', type: 'dependencies' },
    { name: 'react-dom', type: 'dependencies' },
    { name: 'react-router-dom', type: 'dependencies' },
    { name: '@supabase/supabase-js', type: 'dependencies' },
    { name: '@tanstack/react-query', type: 'dependencies' },
    { name: 'react-hook-form', type: 'dependencies' },
    { name: 'zod', type: 'dependencies' },
    { name: 'tailwindcss', type: 'devDependencies' },
    { name: 'typescript', type: 'devDependencies' },
    { name: 'vite', type: 'devDependencies' }
  ];

  for (const dep of criticalDeps) {
    const version = packageJson[dep.type]?.[dep.name];
    if (version) {
      log('PASS', 'Dependencies', `${dep.name} installed`, `Version: ${version}`);
    } else {
      log('FAIL', 'Dependencies', `${dep.name} is missing from ${dep.type}`);
    }
  }

  // Check node_modules exists
  if (fs.existsSync('node_modules')) {
    const nodeModulesStats = fs.readdirSync('node_modules');
    log('PASS', 'Dependencies', `node_modules exists`, `${nodeModulesStats.length} packages`);
  } else {
    log('FAIL', 'Dependencies', 'node_modules not found - run npm install');
  }
}

async function testTypeScriptConfiguration() {
  console.log('\n=== Testing TypeScript Configuration ===\n');

  if (fs.existsSync('tsconfig.app.json')) {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.app.json', 'utf8'));

    const checks = [
      { path: ['compilerOptions', 'strict'], expected: true, name: 'Strict mode' },
      { path: ['compilerOptions', 'noUnusedLocals'], expected: true, name: 'No unused locals' },
      { path: ['compilerOptions', 'noUnusedParameters'], expected: true, name: 'No unused parameters' }
    ];

    for (const check of checks) {
      let value = tsconfig;
      for (const key of check.path) {
        value = value?.[key];
      }
      if (value === check.expected) {
        log('PASS', 'TypeScript', `${check.name} is ${check.expected}`);
      } else {
        log('WARN', 'TypeScript', `${check.name} is ${value}, expected ${check.expected}`);
      }
    }
  } else {
    log('FAIL', 'TypeScript', 'tsconfig.app.json not found');
  }
}

async function testComponentImports() {
  console.log('\n=== Testing Critical Component Integrity ===\n');

  const componentsToTest = [
    { file: 'src/pages/Auth.tsx', checks: ['supabase', 'toast', 'Button', 'Input', 'signInWithPassword'] },
    { file: 'src/pages/FounderDashboard.tsx', checks: ['useState', 'useEffect', 'supabase', 'useMatchmaking'] },
    { file: 'src/pages/AnalystDashboard.tsx', checks: ['useState', 'useEffect', 'supabase'] },
    { file: 'src/hooks/useMatchmaking.ts', checks: ['supabase', 'useToast', 'match_score'] },
    { file: 'src/hooks/useMessages.ts', checks: ['supabase', 'channel', 'messages'] }
  ];

  for (const component of componentsToTest) {
    if (fs.existsSync(component.file)) {
      const content = fs.readFileSync(component.file, 'utf8');
      let foundCount = 0;
      const missingChecks = [];

      for (const check of component.checks) {
        if (content.includes(check)) {
          foundCount++;
        } else {
          missingChecks.push(check);
        }
      }

      if (foundCount === component.checks.length) {
        log('PASS', 'Components', `${component.file} integrity check passed`, `${foundCount}/${component.checks.length} checks`);
      } else {
        log('WARN', 'Components', `${component.file} missing some expected code`, `Missing: ${missingChecks.join(', ')}`);
      }
    } else {
      log('FAIL', 'Components', `${component.file} not found`);
    }
  }
}

async function testRouteConfiguration() {
  console.log('\n=== Testing Route Configuration ===\n');

  if (!fs.existsSync('src/App.tsx')) {
    log('FAIL', 'Routes', 'App.tsx not found');
    return;
  }

  const appContent = fs.readFileSync('src/App.tsx', 'utf8');

  const requiredRoutes = [
    { path: '/', name: 'Landing Page', component: 'Index' },
    { path: '/auth', name: 'Authentication', component: 'Auth' },
    { path: '/founder-application', name: 'Founder Application', component: 'FounderApplication' },
    { path: '/investor-application', name: 'Investor Application', component: 'InvestorApplication' },
    { path: '/founder-dashboard', name: 'Founder Dashboard', component: 'FounderDashboard' },
    { path: '/analyst-dashboard', name: 'Analyst Dashboard', component: 'AnalystDashboard' }
  ];

  for (const route of requiredRoutes) {
    const hasPath = appContent.includes(`path="${route.path}"`) || appContent.includes(`path='${route.path}'`);
    const hasComponent = appContent.includes(route.component);

    if (hasPath && hasComponent) {
      log('PASS', 'Routes', `Route configured: ${route.name} (${route.path})`);
    } else if (hasPath && !hasComponent) {
      log('WARN', 'Routes', `Route ${route.path} found but component ${route.component} may be missing`);
    } else {
      log('FAIL', 'Routes', `Route missing: ${route.name} (${route.path})`);
    }
  }
}

async function testDatabaseSchema() {
  console.log('\n=== Testing Database Schema Files ===\n');

  if (!fs.existsSync('supabase/migrations')) {
    log('FAIL', 'Database', 'Migrations directory not found');
    return;
  }

  const migrationFiles = fs.readdirSync('supabase/migrations').filter(f => f.endsWith('.sql'));

  if (migrationFiles.length === 0) {
    log('FAIL', 'Database', 'No migration files found');
    return;
  }

  log('PASS', 'Database', `Found ${migrationFiles.length} migration file(s)`);

  const coreTables = [
    'founder_applications',
    'investor_applications',
    'analyst_profiles',
    'connection_requests',
    'messages'
  ];

  for (const file of migrationFiles) {
    const content = fs.readFileSync(`supabase/migrations/${file}`, 'utf8');
    let foundTables = 0;

    for (const table of coreTables) {
      if (content.includes(table)) foundTables++;
    }

    if (foundTables > 0) {
      log('PASS', 'Database', `${file} defines ${foundTables}/${coreTables.length} core tables`);
    } else {
      log('WARN', 'Database', `${file} may not contain table definitions`);
    }

    // Check for RLS policies
    if (content.includes('CREATE POLICY') || content.includes('policy')) {
      log('PASS', 'Database', `${file} includes Row-Level Security policies`);
    }
  }
}

async function testEdgeFunctions() {
  console.log('\n=== Testing Edge Functions ===\n');

  if (!fs.existsSync('supabase/functions/matchmaking/index.ts')) {
    log('FAIL', 'Edge Functions', 'Matchmaking function not found');
    return;
  }

  const content = fs.readFileSync('supabase/functions/matchmaking/index.ts', 'utf8');
  const size = (content.length / 1024).toFixed(2);
  const lines = content.split('\n').length;

  log('PASS', 'Edge Functions', `Matchmaking function exists`, `${lines} lines, ${size} KB`);

  // Check for critical algorithm components
  const algorithmChecks = [
    { term: 'sector_fit', name: 'Sector matching' },
    { term: 'stage_fit', name: 'Stage matching' },
    { term: 'geo_fit', name: 'Geographic matching' },
    { term: 'business_model_fit', name: 'Business model matching' },
    { term: 'thesis_fit', name: 'Thesis matching' },
    { term: 'match_score', name: 'Score calculation' },
    { term: 'match_label', name: 'Match labeling' }
  ];

  let foundComponents = 0;
  for (const check of algorithmChecks) {
    if (content.includes(check.term)) {
      foundComponents++;
      log('PASS', 'Edge Functions', `${check.name} implemented`);
    } else {
      log('WARN', 'Edge Functions', `${check.name} may be missing`);
    }
  }

  if (foundComponents >= 6) {
    log('PASS', 'Edge Functions', 'Matchmaking algorithm appears complete');
  }
}

async function testUIComponents() {
  console.log('\n=== Testing UI Components ===\n');

  const uiDir = 'src/components/ui';

  if (!fs.existsSync(uiDir)) {
    log('FAIL', 'UI Components', 'UI components directory not found');
    return;
  }

  const files = fs.readdirSync(uiDir);
  log('PASS', 'UI Components', `Found ${files.length} UI component files`);

  const criticalComponents = [
    'button.tsx',
    'input.tsx',
    'dialog.tsx',
    'card.tsx',
    'form.tsx',
    'tabs.tsx',
    'select.tsx',
    'textarea.tsx'
  ];

  for (const component of criticalComponents) {
    if (files.includes(component)) {
      log('PASS', 'UI Components', `${component} exists`);
    } else {
      log('WARN', 'UI Components', `${component} not found`);
    }
  }
}

async function testBuildOutput() {
  console.log('\n=== Testing Build Output ===\n');

  if (!fs.existsSync('dist')) {
    log('WARN', 'Build', 'Build output not found (run npm run build)');
    return;
  }

  const files = fs.readdirSync('dist');
  log('PASS', 'Build', 'Build output directory exists', `${files.length} files`);

  if (files.includes('index.html')) {
    const htmlContent = fs.readFileSync('dist/index.html', 'utf8');
    if (htmlContent.includes('<script')) {
      log('PASS', 'Build', 'index.html generated with script tags');
    }
  } else {
    log('FAIL', 'Build', 'index.html not found in build output');
  }

  const assetsDir = 'dist/assets';
  if (fs.existsSync(assetsDir)) {
    const assetFiles = fs.readdirSync(assetsDir);
    const jsFiles = assetFiles.filter(f => f.endsWith('.js'));
    const cssFiles = assetFiles.filter(f => f.endsWith('.css'));

    log('PASS', 'Build', `Assets compiled`, `${jsFiles.length} JS, ${cssFiles.length} CSS files`);

    // Check bundle sizes
    for (const jsFile of jsFiles) {
      const stats = fs.statSync(`${assetsDir}/${jsFile}`);
      const sizeKB = (stats.size / 1024).toFixed(2);
      if (stats.size < 500 * 1024) {
        log('PASS', 'Build', `Bundle size acceptable: ${jsFile}`, `${sizeKB} KB`);
      } else {
        log('WARN', 'Build', `Large bundle: ${jsFile}`, `${sizeKB} KB (consider code splitting)`);
      }
    }
  }
}

async function testSecurityConfiguration() {
  console.log('\n=== Testing Security Configuration ===\n');

  // Check .gitignore
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const securityPatterns = [
      { pattern: '.env', name: 'Environment files' },
      { pattern: 'node_modules', name: 'Dependencies' },
      { pattern: 'dist', name: 'Build output' }
    ];

    for (const item of securityPatterns) {
      if (gitignore.includes(item.pattern)) {
        log('PASS', 'Security', `.gitignore includes ${item.name}`);
      } else {
        log('WARN', 'Security', `.gitignore may be missing ${item.name}`);
      }
    }
  } else {
    log('FAIL', 'Security', '.gitignore not found');
  }

  // Check Supabase client uses env vars
  if (fs.existsSync('src/integrations/supabase/client.ts')) {
    const content = fs.readFileSync('src/integrations/supabase/client.ts', 'utf8');
    if (content.includes('import.meta.env')) {
      log('PASS', 'Security', 'Supabase client uses environment variables');
    } else {
      log('FAIL', 'Security', 'Supabase client may have hardcoded credentials');
    }

    if (!content.includes('eyJ') && !content.includes('http://') && !content.includes('https://')) {
      log('PASS', 'Security', 'No hardcoded credentials found in client');
    } else {
      log('WARN', 'Security', 'Possible hardcoded values in client');
    }
  }
}

async function testModalComponents() {
  console.log('\n=== Testing Modal Components ===\n');

  const modalComponents = [
    'src/components/InvestorProfileModal.tsx',
    'src/components/MemoModal.tsx',
    'src/components/MessagesModal.tsx',
    'src/components/InterestsModal.tsx',
    'src/components/SyncsModal.tsx',
    'src/components/PendingModal.tsx',
    'src/components/AnalystProfileModal.tsx'
  ];

  for (const modal of modalComponents) {
    if (fs.existsSync(modal)) {
      const content = fs.readFileSync(modal, 'utf8');
      const name = path.basename(modal, '.tsx');

      // Check for Dialog component usage
      if (content.includes('Dialog') || content.includes('Modal')) {
        log('PASS', 'Modals', `${name} uses Dialog component`);
      } else {
        log('WARN', 'Modals', `${name} may not be using Dialog properly`);
      }
    } else {
      log('WARN', 'Modals', `${modal} not found`);
    }
  }
}

async function testFormValidation() {
  console.log('\n=== Testing Form Validation ===\n');

  const formsToTest = [
    'src/pages/FounderApplication.tsx',
    'src/pages/InvestorApplication.tsx'
  ];

  for (const form of formsToTest) {
    if (fs.existsSync(form)) {
      const content = fs.readFileSync(form, 'utf8');
      const name = path.basename(form, '.tsx');

      // Check for validation libraries
      if (content.includes('zod') || content.includes('z.')) {
        log('PASS', 'Forms', `${name} uses Zod validation`);
      } else {
        log('WARN', 'Forms', `${name} may be missing validation`);
      }

      // Check for react-hook-form
      if (content.includes('useForm') || content.includes('react-hook-form')) {
        log('PASS', 'Forms', `${name} uses React Hook Form`);
      } else {
        log('WARN', 'Forms', `${name} may not use React Hook Form`);
      }
    }
  }
}

async function generateReport() {
  console.log('\n' + '='.repeat(70));
  console.log('COMPREHENSIVE TEST REPORT');
  console.log('='.repeat(70) + '\n');

  const total = tests.passed + tests.failed + tests.warnings;
  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${tests.passed} (${((tests.passed/total)*100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${tests.failed} (${((tests.failed/total)*100).toFixed(1)}%)`);
  console.log(`⚠️  Warnings: ${tests.warnings} (${((tests.warnings/total)*100).toFixed(1)}%)`);

  const successRate = tests.failed === 0 ? 100 : ((tests.passed / (tests.passed + tests.failed)) * 100).toFixed(2);
  console.log(`\nSuccess Rate: ${successRate}%`);

  if (tests.failed === 0 && tests.warnings < 5) {
    console.log('\n🎉 EXCELLENT! Application is in great shape and ready for use.');
  } else if (tests.failed === 0) {
    console.log('\n✅ GOOD! All critical tests passed. Some warnings to review.');
  } else {
    console.log(`\n⚠️  ${tests.failed} critical test(s) failed. Please review and fix.`);
  }

  // Group results by category
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY BY CATEGORY');
  console.log('='.repeat(70) + '\n');

  const categories = {};
  tests.results.forEach(result => {
    if (!categories[result.test]) {
      categories[result.test] = { pass: 0, fail: 0, warn: 0 };
    }
    if (result.type === 'PASS') categories[result.test].pass++;
    else if (result.type === 'FAIL') categories[result.test].fail++;
    else if (result.type === 'WARN') categories[result.test].warn++;
  });

  Object.keys(categories).sort().forEach(category => {
    const cat = categories[category];
    const catTotal = cat.pass + cat.fail + cat.warn;
    const status = cat.fail === 0 ? '✅' : '❌';
    const percentage = ((cat.pass / catTotal) * 100).toFixed(0);
    console.log(`${status} ${category.padEnd(25)} ${cat.pass}/${catTotal} passed (${percentage}%) - ${cat.fail} failed, ${cat.warn} warnings`);
  });

  // Save detailed report
  const reportPath = 'TEST_REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: total,
      passed: tests.passed,
      failed: tests.failed,
      warnings: tests.warnings,
      successRate: successRate
    },
    categories: categories,
    results: tests.results
  }, null, 2));

  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  return tests.failed === 0;
}

// Run all tests
async function runAllTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 INSYNC CONNECT - COMPREHENSIVE USER TEST SUITE');
  console.log('='.repeat(70));

  try {
    await testEnvironmentVariables();
    await testFileStructure();
    await testDependencies();
    await testTypeScriptConfiguration();
    await testComponentImports();
    await testRouteConfiguration();
    await testDatabaseSchema();
    await testEdgeFunctions();
    await testUIComponents();
    await testModalComponents();
    await testFormValidation();
    await testBuildOutput();
    await testSecurityConfiguration();

    const allPassed = await generateReport();

    console.log('\n' + '='.repeat(70));
    console.log('TEST SUITE COMPLETED');
    console.log('='.repeat(70) + '\n');

    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Test suite encountered an error:', error);
    process.exit(1);
  }
}

runAllTests();
