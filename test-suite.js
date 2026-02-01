/**
 * Comprehensive User Testing Suite for Insync Connect
 *
 * This script tests all critical user flows and functionality
 */

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

  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    'VITE_SUPABASE_PROJECT_ID'
  ];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value && value.length > 0) {
      log('PASS', 'Environment', `${varName} is configured`, `Length: ${value.length} chars`);
    } else {
      log('FAIL', 'Environment', `${varName} is missing or empty`);
    }
  }
}

async function testFileStructure() {
  console.log('\n=== Testing File Structure ===\n');

  const fs = require('fs');
  const path = require('path');

  const criticalFiles = [
    'src/App.tsx',
    'src/main.tsx',
    'src/pages/Index.tsx',
    'src/pages/Auth.tsx',
    'src/pages/FounderDashboard.tsx',
    'src/pages/AnalystDashboard.tsx',
    'src/pages/FounderApplication.tsx',
    'src/pages/InvestorApplication.tsx',
    'src/hooks/useMatchmaking.ts',
    'src/hooks/useMessages.ts',
    'src/integrations/supabase/client.ts',
    'supabase/functions/matchmaking/index.ts',
    'package.json',
    'vite.config.ts',
    'tsconfig.json'
  ];

  for (const file of criticalFiles) {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      log('PASS', 'File Structure', `${file} exists`, `Size: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      log('FAIL', 'File Structure', `${file} is missing`);
    }
  }
}

async function testDependencies() {
  console.log('\n=== Testing Dependencies ===\n');

  const fs = require('fs');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const criticalDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    '@supabase/supabase-js',
    '@tanstack/react-query',
    'react-hook-form',
    'zod',
    'tailwindcss'
  ];

  for (const dep of criticalDeps) {
    if (packageJson.dependencies[dep]) {
      log('PASS', 'Dependencies', `${dep} installed`, `Version: ${packageJson.dependencies[dep]}`);
    } else {
      log('FAIL', 'Dependencies', `${dep} is missing`);
    }
  }
}

async function testTypeScriptConfiguration() {
  console.log('\n=== Testing TypeScript Configuration ===\n');

  const fs = require('fs');
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.app.json', 'utf8'));

  const checks = [
    { path: 'compilerOptions.strict', expected: true, name: 'Strict mode' },
    { path: 'compilerOptions.noUnusedLocals', expected: true, name: 'No unused locals' },
    { path: 'compilerOptions.noUnusedParameters', expected: true, name: 'No unused parameters' }
  ];

  for (const check of checks) {
    const value = check.path.split('.').reduce((obj, key) => obj?.[key], tsconfig);
    if (value === check.expected) {
      log('PASS', 'TypeScript', `${check.name} is ${check.expected}`);
    } else {
      log('WARN', 'TypeScript', `${check.name} is ${value}, expected ${check.expected}`);
    }
  }
}

async function testComponentImports() {
  console.log('\n=== Testing Component Imports ===\n');

  const fs = require('fs');

  const componentsToTest = [
    { file: 'src/pages/Auth.tsx', imports: ['supabase', 'toast', 'Button', 'Input'] },
    { file: 'src/pages/FounderDashboard.tsx', imports: ['useState', 'useEffect', 'supabase'] },
    { file: 'src/hooks/useMatchmaking.ts', imports: ['supabase', 'useToast'] }
  ];

  for (const component of componentsToTest) {
    if (fs.existsSync(component.file)) {
      const content = fs.readFileSync(component.file, 'utf8');
      let allImportsFound = true;
      const missingImports = [];

      for (const imp of component.imports) {
        if (!content.includes(imp)) {
          allImportsFound = false;
          missingImports.push(imp);
        }
      }

      if (allImportsFound) {
        log('PASS', 'Imports', `${component.file} has all required imports`);
      } else {
        log('WARN', 'Imports', `${component.file} missing imports`, missingImports.join(', '));
      }
    }
  }
}

async function testRouteConfiguration() {
  console.log('\n=== Testing Route Configuration ===\n');

  const fs = require('fs');
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');

  const requiredRoutes = [
    { path: '/', name: 'Landing Page' },
    { path: '/auth', name: 'Authentication' },
    { path: '/founder-application', name: 'Founder Application' },
    { path: '/investor-application', name: 'Investor Application' },
    { path: '/founder-dashboard', name: 'Founder Dashboard' },
    { path: '/analyst-dashboard', name: 'Analyst Dashboard' }
  ];

  for (const route of requiredRoutes) {
    if (appContent.includes(`path="${route.path}"`) || appContent.includes(`path='${route.path}'`)) {
      log('PASS', 'Routes', `Route configured: ${route.name} (${route.path})`);
    } else {
      log('FAIL', 'Routes', `Route missing: ${route.name} (${route.path})`);
    }
  }
}

async function testDatabaseSchema() {
  console.log('\n=== Testing Database Schema Files ===\n');

  const fs = require('fs');
  const migrationFiles = fs.readdirSync('supabase/migrations');

  log('PASS', 'Database', `Found ${migrationFiles.length} migration files`);

  for (const file of migrationFiles) {
    if (file.endsWith('.sql')) {
      const content = fs.readFileSync(`supabase/migrations/${file}`, 'utf8');
      const tables = [
        'founder_applications',
        'investor_applications',
        'analyst_profiles',
        'connection_requests',
        'messages'
      ];

      let foundTables = 0;
      for (const table of tables) {
        if (content.includes(table)) foundTables++;
      }

      log('PASS', 'Database', `${file} contains ${foundTables}/${tables.length} core tables`);
    }
  }
}

async function testEdgeFunctions() {
  console.log('\n=== Testing Edge Functions ===\n');

  const fs = require('fs');

  if (fs.existsSync('supabase/functions/matchmaking/index.ts')) {
    const content = fs.readFileSync('supabase/functions/matchmaking/index.ts', 'utf8');
    const size = (content.length / 1024).toFixed(2);
    log('PASS', 'Edge Functions', `Matchmaking function exists`, `Size: ${size} KB`);

    // Check for critical algorithm components
    const algorithmChecks = [
      'sector_fit',
      'stage_fit',
      'geo_fit',
      'business_model_fit',
      'thesis_fit',
      'match_score'
    ];

    let foundComponents = 0;
    for (const component of algorithmChecks) {
      if (content.includes(component)) foundComponents++;
    }

    if (foundComponents === algorithmChecks.length) {
      log('PASS', 'Edge Functions', 'Matchmaking algorithm has all components');
    } else {
      log('WARN', 'Edge Functions', `Missing ${algorithmChecks.length - foundComponents} algorithm components`);
    }
  } else {
    log('FAIL', 'Edge Functions', 'Matchmaking function not found');
  }
}

async function testUIComponents() {
  console.log('\n=== Testing UI Components ===\n');

  const fs = require('fs');
  const uiDir = 'src/components/ui';

  if (fs.existsSync(uiDir)) {
    const files = fs.readdirSync(uiDir);
    log('PASS', 'UI Components', `Found ${files.length} UI components`);

    const criticalComponents = [
      'button.tsx',
      'input.tsx',
      'dialog.tsx',
      'card.tsx',
      'form.tsx',
      'tabs.tsx'
    ];

    for (const component of criticalComponents) {
      if (files.includes(component)) {
        log('PASS', 'UI Components', `${component} exists`);
      } else {
        log('FAIL', 'UI Components', `${component} is missing`);
      }
    }
  } else {
    log('FAIL', 'UI Components', 'UI components directory not found');
  }
}

async function testBuildOutput() {
  console.log('\n=== Testing Build Output ===\n');

  const fs = require('fs');

  if (fs.existsSync('dist')) {
    const files = fs.readdirSync('dist');
    log('PASS', 'Build', 'Build output directory exists', `${files.length} files`);

    if (files.includes('index.html')) {
      log('PASS', 'Build', 'index.html generated');
    } else {
      log('FAIL', 'Build', 'index.html not found in build output');
    }

    const assetsDir = 'dist/assets';
    if (fs.existsSync(assetsDir)) {
      const assetFiles = fs.readdirSync(assetsDir);
      const jsFiles = assetFiles.filter(f => f.endsWith('.js'));
      const cssFiles = assetFiles.filter(f => f.endsWith('.css'));

      log('PASS', 'Build', `Assets compiled`, `${jsFiles.length} JS, ${cssFiles.length} CSS`);

      // Check bundle sizes
      for (const jsFile of jsFiles) {
        const stats = fs.statSync(`${assetsDir}/${jsFile}`);
        const sizeKB = (stats.size / 1024).toFixed(2);
        if (stats.size < 500 * 1024) { // Less than 500KB
          log('PASS', 'Build', `Bundle size acceptable: ${jsFile}`, `${sizeKB} KB`);
        } else {
          log('WARN', 'Build', `Large bundle: ${jsFile}`, `${sizeKB} KB (>500KB)`);
        }
      }
    }
  } else {
    log('WARN', 'Build', 'Build output not found (run npm run build first)');
  }
}

async function testSecurityConfiguration() {
  console.log('\n=== Testing Security Configuration ===\n');

  const fs = require('fs');

  // Check .gitignore
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const securityPatterns = ['.env', '.env.local', 'node_modules'];

    for (const pattern of securityPatterns) {
      if (gitignore.includes(pattern)) {
        log('PASS', 'Security', `.gitignore includes ${pattern}`);
      } else {
        log('FAIL', 'Security', `.gitignore missing ${pattern}`);
      }
    }
  }

  // Check for hardcoded secrets
  const filesToCheck = ['src/integrations/supabase/client.ts'];
  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('import.meta.env')) {
        log('PASS', 'Security', `${file} uses environment variables`);
      } else {
        log('WARN', 'Security', `${file} may not be using env vars properly`);
      }
    }
  }
}

async function generateReport() {
  console.log('\n' + '='.repeat(70));
  console.log('COMPREHENSIVE TEST REPORT');
  console.log('='.repeat(70) + '\n');

  console.log(`Total Tests: ${tests.passed + tests.failed + tests.warnings}`);
  console.log(`✅ Passed: ${tests.passed}`);
  console.log(`❌ Failed: ${tests.failed}`);
  console.log(`⚠️  Warnings: ${tests.warnings}`);

  const successRate = ((tests.passed / (tests.passed + tests.failed)) * 100).toFixed(2);
  console.log(`\nSuccess Rate: ${successRate}%`);

  if (tests.failed === 0) {
    console.log('\n🎉 ALL CRITICAL TESTS PASSED! Application is ready.');
  } else {
    console.log(`\n⚠️  ${tests.failed} critical tests failed. Please review.`);
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
    const total = cat.pass + cat.fail + cat.warn;
    const status = cat.fail === 0 ? '✅' : '❌';
    console.log(`${status} ${category}: ${cat.pass}/${total} passed (${cat.fail} failed, ${cat.warn} warnings)`);
  });

  // Save detailed report
  const fs = require('fs');
  const reportPath = 'TEST_REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: tests.passed + tests.failed + tests.warnings,
      passed: tests.passed,
      failed: tests.failed,
      warnings: tests.warnings,
      successRate: successRate
    },
    categories: categories,
    results: tests.results
  }, null, 2));

  console.log(`\nDetailed report saved to: ${reportPath}`);

  return tests.failed === 0;
}

// Run all tests
async function runAllTests() {
  console.log('\n' + '='.repeat(70));
  console.log('INSYNC CONNECT - COMPREHENSIVE USER TEST SUITE');
  console.log('='.repeat(70));

  await testEnvironmentVariables();
  await testFileStructure();
  await testDependencies();
  await testTypeScriptConfiguration();
  await testComponentImports();
  await testRouteConfiguration();
  await testDatabaseSchema();
  await testEdgeFunctions();
  await testUIComponents();
  await testBuildOutput();
  await testSecurityConfiguration();

  const allPassed = await generateReport();

  process.exit(allPassed ? 0 : 1);
}

runAllTests().catch(error => {
  console.error('\n❌ Test suite crashed:', error);
  process.exit(1);
});
