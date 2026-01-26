#!/usr/bin/env node

/**
 * Comprehensive End-to-End Audit Test Suite
 * Tests all endpoints, database operations, memory, and matching algorithms
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { performance } from 'perf_hooks';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key for full access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
  },
  tests: [],
  performance: {
    memory: {},
    endpoints: {},
    database: {},
  },
  errors: [],
  warnings: [],
};

// Helper functions
function logTest(name, status, message = '', duration = null) {
  const result = {
    name,
    status, // 'pass', 'fail', 'warning'
    message,
    duration,
    timestamp: new Date().toISOString(),
  };
  testResults.tests.push(result);
  testResults.summary.total++;
  if (status === 'pass') testResults.summary.passed++;
  else if (status === 'fail') testResults.summary.failed++;
  else if (status === 'warning') testResults.summary.warnings++;
  
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  const durationStr = duration ? ` (${duration.toFixed(2)}ms)` : '';
  console.log(`${icon} ${name}${durationStr}`);
  if (message) console.log(`   ${message}`);
}

function logError(error, context) {
  const errorInfo = {
    context,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  };
  testResults.errors.push(errorInfo);
  console.error(`❌ ERROR in ${context}:`, error.message);
}

function logWarning(message, context) {
  const warning = {
    context,
    message,
    timestamp: new Date().toISOString(),
  };
  testResults.warnings.push(warning);
  console.warn(`⚠️  WARNING in ${context}: ${message}`);
}

// Memory tracking
const memoryUsage = {
  initial: null,
  peak: null,
  current: null,
};

function trackMemory() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    if (!memoryUsage.initial) {
      memoryUsage.initial = usage;
    }
    memoryUsage.current = usage;
    if (!memoryUsage.peak || usage.heapUsed > memoryUsage.peak.heapUsed) {
      memoryUsage.peak = usage;
    }
  }
}

// ============================================
// TEST DATA GENERATION
// ============================================

const testUsers = {
  founders: [],
  investors: [],
  analysts: [],
};

async function generateTestData() {
  console.log('\n📊 Generating comprehensive test data...\n');
  
  // Generate 10 founders with diverse profiles
  const founderProfiles = [
    { vertical: 'AI/ML', stage: 'Pre-seed', location: 'San Francisco, CA', sector: 'AI/ML' },
    { vertical: 'AI/ML', stage: 'Seed', location: 'Boston, MA', sector: 'AI/ML' },
    { vertical: 'FinTech', stage: 'Seed', location: 'New York, NY', sector: 'FinTech' },
    { vertical: 'FinTech', stage: 'Series A', location: 'San Francisco, CA', sector: 'FinTech' },
    { vertical: 'Health', stage: 'Pre-seed', location: 'Boston, MA', sector: 'Health' },
    { vertical: 'Health', stage: 'Series A', location: 'San York, NY', sector: 'Health' },
    { vertical: 'Climate', stage: 'Pre-seed', location: 'Seattle, WA', sector: 'Climate' },
    { vertical: 'Climate', stage: 'Seed', location: 'Boston, MA', sector: 'Climate' },
    { vertical: 'DevTools', stage: 'Seed', location: 'San Francisco, CA', sector: 'DevTools' },
    { vertical: 'SaaS', stage: 'Series A', location: 'New York, NY', sector: 'SaaS' },
  ];
  
  for (let i = 0; i < founderProfiles.length; i++) {
    const profile = founderProfiles[i];
    const email = `audit-founder-${i + 1}@test.com`;
    const password = 'TestPassword123!';
    
    try {
      // Create user
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      
      if (userError && !userError.message.includes('already registered')) {
        throw userError;
      }
      
      let userId;
      if (userData?.user) {
        userId = userData.user.id;
      } else {
        // User exists, get it
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const user = existingUsers.users.find(u => u.email === email);
        userId = user?.id;
      }
      
      if (!userId) {
        logWarning(`Could not create/get user for ${email}`, 'generateTestData');
        continue;
      }
      
      // Check if application exists
      const { data: existing } = await supabase
        .from('founder_applications')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existing) {
        testUsers.founders.push({ userId, email });
        continue;
      }
      
      // Create founder application
      const { error: appError } = await supabase
        .from('founder_applications')
        .insert({
          user_id: userId,
          founder_name: `Founder ${i + 1}`,
          email,
          company_name: `${profile.vertical} Startup ${i + 1}`,
          website: `https://startup${i + 1}.example.com`,
          vertical: profile.vertical,
          stage: profile.stage,
          location: profile.location,
          funding_goal: `$${(i + 1) * 500}K`,
          business_model: i % 2 === 0 ? 'B2B' : 'B2C',
          traction: `$${(i + 1) * 100}K ARR, ${(i + 1) * 10} customers`,
          current_ask: `Looking for ${profile.stage} funding`,
          status: 'approved',
          application_sections: {
            company_information: {
              company_name: `${profile.vertical} Startup ${i + 1}`,
              website: `https://startup${i + 1}.example.com`,
            },
            your_team_company_overview: {
              company_pitch: `We are building a ${profile.vertical} solution that solves critical problems in the market. Our platform leverages cutting-edge technology to deliver value to customers.`,
            },
            value_proposition: {
              problem_statement: `The market faces significant challenges in ${profile.vertical.toLowerCase()} that we are uniquely positioned to solve.`,
              value_delivery_types: ['Cost Reduction', 'Efficiency', 'Innovation'],
            },
            business_model: {
              customer_type: i % 2 === 0 ? 'B2B' : 'B2C',
              business_structure: 'SaaS subscription model',
              pricing_strategy: ['Subscription', 'Usage-based'],
            },
            go_to_market: {
              acquisition_strategy: 'Direct sales and partnerships',
              gtm_timeline: '6-12 months to first customer',
            },
            market_sizing: {
              ideal_customer_profile: `Target customers in ${profile.vertical}`,
              target_geography: 'North America',
              tam_value: `$${(i + 1) * 10}B`,
              sam_value: `$${i + 1}B`,
              som_value: `$${(i + 1) * 100}M`,
            },
          },
        });
      
      if (appError) {
        logError(appError, `generateTestData - founder ${i + 1}`);
      } else {
        testUsers.founders.push({ userId, email });
      }
    } catch (error) {
      logError(error, `generateTestData - founder ${i + 1}`);
    }
  }
  
  // Generate 10 investors with diverse profiles
  const investorProfiles = [
    { sectors: ['AI/ML', 'Health'], stages: ['Seed', 'Series A'], location: 'San Francisco, CA' },
    { sectors: ['AI/ML'], stages: ['Pre-seed', 'Seed'], location: 'Boston, MA' },
    { sectors: ['FinTech'], stages: ['Series A', 'Series B+'], location: 'New York, NY' },
    { sectors: ['FinTech'], stages: ['Seed', 'Series A'], location: 'San Francisco, CA' },
    { sectors: ['Health'], stages: ['Pre-seed', 'Seed'], location: 'Boston, MA' },
    { sectors: ['Climate'], stages: ['Pre-seed', 'Seed'], location: 'Seattle, WA' },
    { sectors: ['Climate'], stages: ['Seed', 'Series A'], location: 'Boston, MA' },
    { sectors: ['DevTools'], stages: ['Seed', 'Series A'], location: 'San Francisco, CA' },
    { sectors: ['SaaS'], stages: ['Series A', 'Series B+'], location: 'New York, NY' },
    { sectors: ['Consumer', 'Marketplace'], stages: ['Pre-seed', 'Seed'], location: 'Los Angeles, CA' },
  ];
  
  for (let i = 0; i < investorProfiles.length; i++) {
    const profile = investorProfiles[i];
    const email = `audit-investor-${i + 1}@test.com`;
    const password = 'TestPassword123!';
    
    try {
      // Create user
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      
      if (userError && !userError.message.includes('already registered')) {
        throw userError;
      }
      
      let userId;
      if (userData?.user) {
        userId = userData.user.id;
      } else {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const user = existingUsers.users.find(u => u.email === email);
        userId = user?.id;
      }
      
      if (!userId) {
        logWarning(`Could not create/get user for ${email}`, 'generateTestData');
        continue;
      }
      
      // Check if application exists
      const { data: existing } = await supabase
        .from('investor_applications')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existing) {
        testUsers.investors.push({ userId, email });
        continue;
      }
      
      // Create investor application
      const { error: appError } = await supabase
        .from('investor_applications')
        .insert({
          user_id: userId,
          firm_name: `${profile.sectors[0]} Capital ${i + 1}`,
          website: `https://capital${i + 1}.example.com`,
          hq_location: profile.location,
          firm_description: `Early-stage VC focused on ${profile.sectors.join(' and ')} startups.`,
          aum: `$${(i + 1) * 50}M`,
          fund_vintage: `${2020 + i}`,
          fund_type: 'Venture Capital',
          ownership_target: '15-25%',
          lead_follow: i % 2 === 0 ? 'Lead' : 'Follow',
          portfolio_count: `${(i + 1) * 5}`,
          top_investments: `Portfolio${i + 1}A, Portfolio${i + 1}B, Portfolio${i + 1}C`,
          geographic_focus: 'North America',
          thesis_statement: `We invest in ${profile.sectors.join(' and ')} companies that solve real problems.`,
          sub_themes: profile.sectors.map(s => `${s} Innovation`),
          sector_tags: profile.sectors,
          stage_focus: profile.stages,
          check_sizes: [`$${(i + 1) * 250}K - $${(i + 1) * 2}M`],
          status: 'active',
          public_profile: true,
          b2b_b2c: 'B2B',
          revenue_models: ['Subscription', 'SaaS'],
          customer_types: ['Enterprise', 'SMB'],
          operating_support: ['Go-to-Market', 'Sales', 'Product'],
          time_to_first_response: '24-48 hours',
          time_to_decision: '2-4 weeks',
          gives_no_with_feedback: true,
        });
      
      if (appError) {
        logError(appError, `generateTestData - investor ${i + 1}`);
      } else {
        testUsers.investors.push({ userId, email });
      }
    } catch (error) {
      logError(error, `generateTestData - investor ${i + 1}`);
    }
  }
  
  console.log(`✅ Created ${testUsers.founders.length} founders and ${testUsers.investors.length} investors\n`);
}

// ============================================
// DATABASE OPERATION TESTS
// ============================================

async function testDatabaseOperations() {
  console.log('\n🗄️  Testing Database Operations...\n');
  trackMemory();
  
  // Test 1: Founder Applications CRUD
  const startTime = performance.now();
  try {
    if (testUsers.founders.length === 0) {
      logTest('Founder Applications - Read', 'fail', 'No test founders available');
      return;
    }
    
    const founder = testUsers.founders[0];
    
    // READ
    const { data: founderData, error: readError } = await supabase
      .from('founder_applications')
      .select('*')
      .eq('user_id', founder.userId)
      .single();
    
    if (readError) throw readError;
    if (!founderData) throw new Error('Founder application not found');
    
    const readDuration = performance.now() - startTime;
    logTest('Founder Applications - Read', 'pass', `Found founder: ${founderData.company_name}`, readDuration);
    testResults.performance.database['founder_read'] = readDuration;
    
    // UPDATE
    const updateStart = performance.now();
    const { error: updateError } = await supabase
      .from('founder_applications')
      .update({ traction: 'Updated traction: $1M ARR' })
      .eq('user_id', founder.userId);
    
    if (updateError) throw updateError;
    const updateDuration = performance.now() - updateStart;
    logTest('Founder Applications - Update', 'pass', 'Successfully updated founder application', updateDuration);
    testResults.performance.database['founder_update'] = updateDuration;
    
  } catch (error) {
    logTest('Founder Applications - CRUD', 'fail', error.message);
    logError(error, 'testDatabaseOperations - Founder CRUD');
  }
  
  // Test 2: Investor Applications CRUD
  try {
    if (testUsers.investors.length === 0) {
      logTest('Investor Applications - Read', 'fail', 'No test investors available');
      return;
    }
    
    const investor = testUsers.investors[0];
    
    // READ
    const readStart = performance.now();
    const { data: investorData, error: readError } = await supabase
      .from('investor_applications')
      .select('*')
      .eq('user_id', investor.userId)
      .single();
    
    if (readError) throw readError;
    if (!investorData) throw new Error('Investor application not found');
    
    const readDuration = performance.now() - readStart;
    logTest('Investor Applications - Read', 'pass', `Found investor: ${investorData.firm_name}`, readDuration);
    testResults.performance.database['investor_read'] = readDuration;
    
    // UPDATE
    const updateStart = performance.now();
    const { error: updateError } = await supabase
      .from('investor_applications')
      .update({ firm_description: 'Updated description' })
      .eq('user_id', investor.userId);
    
    if (updateError) throw updateError;
    const updateDuration = performance.now() - updateStart;
    logTest('Investor Applications - Update', 'pass', 'Successfully updated investor application', updateDuration);
    testResults.performance.database['investor_update'] = updateDuration;
    
  } catch (error) {
    logTest('Investor Applications - CRUD', 'fail', error.message);
    logError(error, 'testDatabaseOperations - Investor CRUD');
  }
  
  // Test 3: Connection Requests
  try {
    if (testUsers.founders.length === 0 || testUsers.investors.length === 0) {
      logTest('Connection Requests - Create', 'warning', 'Need both founders and investors');
      return;
    }
    
    const founder = testUsers.founders[0];
    const investor = testUsers.investors[0];
    
    // CREATE
    const createStart = performance.now();
    const { data: connData, error: createError } = await supabase
      .from('connection_requests')
      .insert({
        requester_user_id: founder.userId,
        requester_type: 'founder',
        target_user_id: investor.userId,
        target_type: 'investor',
        status: 'pending',
        sync_note: 'Test connection request from audit',
      })
      .select()
      .single();
    
    if (createError && !createError.message.includes('duplicate')) {
      throw createError;
    }
    
    const createDuration = performance.now() - createStart;
    if (connData) {
      logTest('Connection Requests - Create', 'pass', 'Successfully created connection request', createDuration);
      testResults.performance.database['connection_create'] = createDuration;
      
      // READ
      const readStart = performance.now();
      const { data: readData, error: readError } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('id', connData.id)
        .single();
      
      if (readError) throw readError;
      const readDuration = performance.now() - readStart;
      logTest('Connection Requests - Read', 'pass', 'Successfully read connection request', readDuration);
      
      // UPDATE
      const updateStart = performance.now();
      const { error: updateError } = await supabase
        .from('connection_requests')
        .update({ status: 'accepted' })
        .eq('id', connData.id);
      
      if (updateError) throw updateError;
      const updateDuration = performance.now() - updateStart;
      logTest('Connection Requests - Update', 'pass', 'Successfully updated connection request', updateDuration);
      
      // DELETE
      const deleteStart = performance.now();
      const { error: deleteError } = await supabase
        .from('connection_requests')
        .delete()
        .eq('id', connData.id);
      
      if (deleteError) throw deleteError;
      const deleteDuration = performance.now() - deleteStart;
      logTest('Connection Requests - Delete', 'pass', 'Successfully deleted connection request', deleteDuration);
    } else {
      logTest('Connection Requests - Create', 'warning', 'Connection request may already exist');
    }
    
  } catch (error) {
    logTest('Connection Requests - CRUD', 'fail', error.message);
    logError(error, 'testDatabaseOperations - Connection Requests');
  }
  
  // Test 4: Messages
  try {
    if (testUsers.founders.length === 0 || testUsers.investors.length === 0) {
      logTest('Messages - Create', 'warning', 'Need both founders and investors');
      return;
    }
    
    const founder = testUsers.founders[0];
    const investor = testUsers.investors[0];
    
    // CREATE
    const createStart = performance.now();
    const { data: msgData, error: createError } = await supabase
      .from('messages')
      .insert({
        sender_user_id: founder.userId,
        receiver_user_id: investor.userId,
        content: 'Test message from audit suite',
      })
      .select()
      .single();
    
    if (createError) throw createError;
    const createDuration = performance.now() - createStart;
    logTest('Messages - Create', 'pass', 'Successfully created message', createDuration);
    testResults.performance.database['message_create'] = createDuration;
    
    // READ
    const readStart = performance.now();
    const { data: readData, error: readError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', msgData.id)
      .single();
    
    if (readError) throw createError;
    const readDuration = performance.now() - readStart;
    logTest('Messages - Read', 'pass', 'Successfully read message', readDuration);
    
    // UPDATE (mark as read)
    const updateStart = performance.now();
    const { error: updateError } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', msgData.id);
    
    if (updateError) throw updateError;
    const updateDuration = performance.now() - updateStart;
    logTest('Messages - Update', 'pass', 'Successfully updated message', updateDuration);
    
    // DELETE
    const deleteStart = performance.now();
    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('id', msgData.id);
    
    if (deleteError) throw deleteError;
    const deleteDuration = performance.now() - deleteStart;
    logTest('Messages - Delete', 'pass', 'Successfully deleted message', deleteDuration);
    
  } catch (error) {
    logTest('Messages - CRUD', 'fail', error.message);
    logError(error, 'testDatabaseOperations - Messages');
  }
  
  // Test 5: Analyst Profiles
  try {
    if (testUsers.investors.length === 0) {
      logTest('Analyst Profiles - Create', 'warning', 'Need investors to create analyst profiles');
      return;
    }
    
    const investor = testUsers.investors[0];
    
    // Get investor application to get firm_id
    const { data: investorApp } = await supabase
      .from('investor_applications')
      .select('id')
      .eq('user_id', investor.userId)
      .single();
    
    if (!investorApp) {
      logTest('Analyst Profiles - Create', 'warning', 'Investor application not found');
      return;
    }
    
    // Create analyst user
    const analystEmail = 'audit-analyst-1@test.com';
    const { data: analystUserData, error: analystUserError } = await supabase.auth.admin.createUser({
      email: analystEmail,
      password: 'TestPassword123!',
      email_confirm: true,
    });
    
    let analystUserId;
    if (analystUserData?.user) {
      analystUserId = analystUserData.user.id;
    } else {
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const user = existingUsers.users.find(u => u.email === analystEmail);
      analystUserId = user?.id;
    }
    
    if (!analystUserId) {
      logTest('Analyst Profiles - Create', 'warning', 'Could not create analyst user');
      return;
    }
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('analyst_profiles')
      .select('id')
      .eq('user_id', analystUserId)
      .maybeSingle();
    
    if (existingProfile) {
      logTest('Analyst Profiles - Create', 'warning', 'Analyst profile already exists');
      return;
    }
    
    // CREATE
    const createStart = performance.now();
    const { data: profileData, error: createError } = await supabase
      .from('analyst_profiles')
      .insert({
        user_id: analystUserId,
        firm_id: investorApp.id,
        name: 'Test Analyst',
        title: 'Senior Analyst',
        firm_name: 'Test Firm',
        email: analystEmail,
        location: 'San Francisco, CA',
        vertical: 'AI/ML',
        one_liner: 'Test analyst profile',
        profile_completed: true,
      })
      .select()
      .single();
    
    if (createError) throw createError;
    const createDuration = performance.now() - createStart;
    logTest('Analyst Profiles - Create', 'pass', 'Successfully created analyst profile', createDuration);
    
    // READ
    const readStart = performance.now();
    const { data: readData, error: readError } = await supabase
      .from('analyst_profiles')
      .select('*')
      .eq('id', profileData.id)
      .single();
    
    if (readError) throw readError;
    const readDuration = performance.now() - readStart;
    logTest('Analyst Profiles - Read', 'pass', 'Successfully read analyst profile', readDuration);
    
    // UPDATE
    const updateStart = performance.now();
    const { error: updateError } = await supabase
      .from('analyst_profiles')
      .update({ title: 'Principal Analyst' })
      .eq('id', profileData.id);
    
    if (updateError) throw updateError;
    const updateDuration = performance.now() - updateStart;
    logTest('Analyst Profiles - Update', 'pass', 'Successfully updated analyst profile', updateDuration);
    
    // DELETE
    const deleteStart = performance.now();
    const { error: deleteError } = await supabase
      .from('analyst_profiles')
      .delete()
      .eq('id', profileData.id);
    
    if (deleteError) throw deleteError;
    const deleteDuration = performance.now() - deleteStart;
    logTest('Analyst Profiles - Delete', 'pass', 'Successfully deleted analyst profile', deleteDuration);
    
  } catch (error) {
    logTest('Analyst Profiles - CRUD', 'fail', error.message);
    logError(error, 'testDatabaseOperations - Analyst Profiles');
  }
  
  trackMemory();
}

// ============================================
// MATCHMAKING ENDPOINT TESTS
// ============================================

async function testMatchmakingEndpoint() {
  console.log('\n🔗 Testing Matchmaking Endpoint...\n');
  trackMemory();
  
  // Test 1: Founder to Investors matching
  try {
    if (testUsers.founders.length === 0) {
      logTest('Matchmaking - Founder to Investors', 'fail', 'No test founders available');
      return;
    }
    
    const founder = testUsers.founders[0];
    const startTime = performance.now();
    
    const { data, error } = await supabase.functions.invoke('matchmaking', {
      body: {
        user_id: founder.userId,
        match_type: 'founder_to_investors',
        limit: 10,
      },
    });
    
    const duration = performance.now() - startTime;
    
    if (error) {
      logTest('Matchmaking - Founder to Investors', 'fail', error.message, duration);
      logError(error, 'testMatchmakingEndpoint - Founder to Investors');
      return;
    }
    
    if (!data || !data.matches) {
      logTest('Matchmaking - Founder to Investors', 'fail', 'No matches returned', duration);
      return;
    }
    
    const matchCount = Array.isArray(data.matches) ? data.matches.length : 0;
    logTest('Matchmaking - Founder to Investors', 'pass', `Found ${matchCount} matches`, duration);
    testResults.performance.endpoints['matchmaking_founder_to_investors'] = duration;
    
    // Validate match structure
    if (matchCount > 0) {
      const firstMatch = data.matches[0];
      const requiredFields = ['investor_id', 'firm_name', 'match_score', 'match_label', 'fit_breakdown'];
      const missingFields = requiredFields.filter(field => !(field in firstMatch));
      
      if (missingFields.length > 0) {
        logTest('Matchmaking - Match Structure Validation', 'fail', `Missing fields: ${missingFields.join(', ')}`);
      } else {
        logTest('Matchmaking - Match Structure Validation', 'pass', 'All required fields present');
      }
      
      // Validate score range
      if (firstMatch.match_score < 0 || firstMatch.match_score > 100) {
        logTest('Matchmaking - Score Range Validation', 'fail', `Invalid score: ${firstMatch.match_score}`);
      } else {
        logTest('Matchmaking - Score Range Validation', 'pass', `Score within valid range: ${firstMatch.match_score}`);
      }
    }
    
  } catch (error) {
    logTest('Matchmaking - Founder to Investors', 'fail', error.message);
    logError(error, 'testMatchmakingEndpoint - Founder to Investors');
  }
  
  // Test 2: Investor to Founders matching
  try {
    if (testUsers.investors.length === 0) {
      logTest('Matchmaking - Investor to Founders', 'fail', 'No test investors available');
      return;
    }
    
    const investor = testUsers.investors[0];
    const startTime = performance.now();
    
    const { data, error } = await supabase.functions.invoke('matchmaking', {
      body: {
        user_id: investor.userId,
        match_type: 'investor_to_founders',
        limit: 10,
      },
    });
    
    const duration = performance.now() - startTime;
    
    if (error) {
      logTest('Matchmaking - Investor to Founders', 'fail', error.message, duration);
      logError(error, 'testMatchmakingEndpoint - Investor to Founders');
      return;
    }
    
    if (!data || !data.matches) {
      logTest('Matchmaking - Investor to Founders', 'fail', 'No matches returned', duration);
      return;
    }
    
    const matchCount = Array.isArray(data.matches) ? data.matches.length : 0;
    logTest('Matchmaking - Investor to Founders', 'pass', `Found ${matchCount} matches`, duration);
    testResults.performance.endpoints['matchmaking_investor_to_founders'] = duration;
    
  } catch (error) {
    logTest('Matchmaking - Investor to Founders', 'fail', error.message);
    logError(error, 'testMatchmakingEndpoint - Investor to Founders');
  }
  
  // Test 3: Invalid match_type
  try {
    if (testUsers.founders.length === 0) {
      logTest('Matchmaking - Invalid match_type', 'warning', 'No test founders available');
      return;
    }
    
    const founder = testUsers.founders[0];
    const { data, error } = await supabase.functions.invoke('matchmaking', {
      body: {
        user_id: founder.userId,
        match_type: 'invalid_type',
      },
    });
    
    if (error || (data && data.error)) {
      logTest('Matchmaking - Invalid match_type', 'pass', 'Correctly rejected invalid match_type');
    } else {
      logTest('Matchmaking - Invalid match_type', 'fail', 'Should have rejected invalid match_type');
    }
    
  } catch (error) {
    logTest('Matchmaking - Invalid match_type', 'pass', 'Correctly threw error for invalid match_type');
  }
  
  // Test 4: Missing user_id
  try {
    const { data, error } = await supabase.functions.invoke('matchmaking', {
      body: {
        match_type: 'founder_to_investors',
      },
    });
    
    if (error || (data && data.error)) {
      logTest('Matchmaking - Missing user_id', 'pass', 'Correctly rejected missing user_id');
    } else {
      logTest('Matchmaking - Missing user_id', 'fail', 'Should have rejected missing user_id');
    }
    
  } catch (error) {
    logTest('Matchmaking - Missing user_id', 'pass', 'Correctly threw error for missing user_id');
  }
  
  trackMemory();
}

// ============================================
// MATCHING ALGORITHM TESTS
// ============================================

async function testMatchingAlgorithm() {
  console.log('\n🧮 Testing Matching Algorithm Logic...\n');
  trackMemory();
  
  // Test 1: Sector matching
  try {
    if (testUsers.founders.length === 0 || testUsers.investors.length === 0) {
      logTest('Matching Algorithm - Sector Matching', 'warning', 'Need both founders and investors');
      return;
    }
    
    // Find an AI/ML founder
    const aiFounder = testUsers.founders.find((_, i) => i === 0); // First founder should be AI/ML
    if (!aiFounder) {
      logTest('Matching Algorithm - Sector Matching', 'warning', 'Could not find AI/ML founder');
      return;
    }
    
    const { data } = await supabase.functions.invoke('matchmaking', {
      body: {
        user_id: aiFounder.userId,
        match_type: 'founder_to_investors',
        limit: 20,
      },
    });
    
    if (data && data.matches && data.matches.length > 0) {
      // Check if AI/ML investors are prioritized
      const aiInvestors = data.matches.filter(m => 
        m.sector_tags && m.sector_tags.includes('AI/ML')
      );
      
      if (aiInvestors.length > 0) {
        logTest('Matching Algorithm - Sector Matching', 'pass', `Found ${aiInvestors.length} AI/ML investors in matches`);
      } else {
        logTest('Matching Algorithm - Sector Matching', 'warning', 'No AI/ML investors found in matches');
      }
    }
    
  } catch (error) {
    logTest('Matching Algorithm - Sector Matching', 'fail', error.message);
    logError(error, 'testMatchingAlgorithm - Sector Matching');
  }
  
  // Test 2: Stage matching
  try {
    if (testUsers.founders.length === 0) {
      logTest('Matching Algorithm - Stage Matching', 'warning', 'No test founders available');
      return;
    }
    
    const founder = testUsers.founders[0];
    const { data: founderData } = await supabase
      .from('founder_applications')
      .select('stage')
      .eq('user_id', founder.userId)
      .single();
    
    if (!founderData) {
      logTest('Matching Algorithm - Stage Matching', 'warning', 'Could not fetch founder data');
      return;
    }
    
    const { data } = await supabase.functions.invoke('matchmaking', {
      body: {
        user_id: founder.userId,
        match_type: 'founder_to_investors',
        limit: 20,
      },
    });
    
    if (data && data.matches && data.matches.length > 0) {
      // Check if stage-focused investors are prioritized
      const stageMatches = data.matches.filter(m => 
        m.stage_focus && m.stage_focus.includes(founderData.stage)
      );
      
      if (stageMatches.length > 0) {
        logTest('Matching Algorithm - Stage Matching', 'pass', `Found ${stageMatches.length} stage-aligned investors`);
      } else {
        logTest('Matching Algorithm - Stage Matching', 'warning', 'No stage-aligned investors found');
      }
    }
    
  } catch (error) {
    logTest('Matching Algorithm - Stage Matching', 'fail', error.message);
    logError(error, 'testMatchingAlgorithm - Stage Matching');
  }
  
  // Test 3: Score distribution
  try {
    if (testUsers.founders.length === 0) {
      logTest('Matching Algorithm - Score Distribution', 'warning', 'No test founders available');
      return;
    }
    
    const founder = testUsers.founders[0];
    const { data } = await supabase.functions.invoke('matchmaking', {
      body: {
        user_id: founder.userId,
        match_type: 'founder_to_investors',
        limit: 20,
      },
    });
    
    if (data && data.matches && data.matches.length > 0) {
      const scores = data.matches.map(m => m.match_score || 0);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);
      
      logTest('Matching Algorithm - Score Distribution', 'pass', 
        `Avg: ${avgScore.toFixed(1)}, Min: ${minScore}, Max: ${maxScore}`);
      
      // Check if scores are sorted (descending)
      const isSorted = scores.every((score, i) => i === 0 || scores[i - 1] >= score);
      if (isSorted) {
        logTest('Matching Algorithm - Score Sorting', 'pass', 'Matches are sorted by score (descending)');
      } else {
        logTest('Matching Algorithm - Score Sorting', 'fail', 'Matches are not properly sorted');
      }
    }
    
  } catch (error) {
    logTest('Matching Algorithm - Score Distribution', 'fail', error.message);
    logError(error, 'testMatchingAlgorithm - Score Distribution');
  }
  
  trackMemory();
}

// ============================================
// PERFORMANCE & MEMORY TESTS
// ============================================

async function testPerformance() {
  console.log('\n⚡ Testing Performance & Memory...\n');
  
  // Memory test
  trackMemory();
  testResults.performance.memory.initial = memoryUsage.initial;
  testResults.performance.memory.peak = memoryUsage.peak;
  testResults.performance.memory.current = memoryUsage.current;
  
  if (memoryUsage.initial && memoryUsage.current) {
    const heapIncrease = memoryUsage.current.heapUsed - memoryUsage.initial.heapUsed;
    const heapIncreaseMB = (heapIncrease / 1024 / 1024).toFixed(2);
    
    logTest('Memory - Heap Usage', 'pass', 
      `Initial: ${(memoryUsage.initial.heapUsed / 1024 / 1024).toFixed(2)}MB, ` +
      `Current: ${(memoryUsage.current.heapUsed / 1024 / 1024).toFixed(2)}MB, ` +
      `Increase: ${heapIncreaseMB}MB`);
    
    if (heapIncrease > 100 * 1024 * 1024) { // 100MB threshold
      logTest('Memory - Heap Usage', 'warning', 'Significant memory increase detected');
    }
  }
  
  // Database query performance test
  try {
    const queryStart = performance.now();
    const { data, error } = await supabase
      .from('founder_applications')
      .select('id, company_name, stage, vertical')
      .limit(100);
    
    const queryDuration = performance.now() - queryStart;
    
    if (error) throw error;
    
    logTest('Performance - Database Query (100 records)', 'pass', 
      `Fetched ${data?.length || 0} records in ${queryDuration.toFixed(2)}ms`, queryDuration);
    
    if (queryDuration > 1000) {
      logTest('Performance - Database Query', 'warning', 'Query took longer than 1 second');
    }
    
  } catch (error) {
    logTest('Performance - Database Query', 'fail', error.message);
    logError(error, 'testPerformance - Database Query');
  }
  
  // Matchmaking performance test (multiple runs)
  try {
    if (testUsers.founders.length === 0) {
      logTest('Performance - Matchmaking (Multiple Runs)', 'warning', 'No test founders available');
      return;
    }
    
    const founder = testUsers.founders[0];
    const runs = 3;
    const durations = [];
    
    for (let i = 0; i < runs; i++) {
      const startTime = performance.now();
      const { error } = await supabase.functions.invoke('matchmaking', {
        body: {
          user_id: founder.userId,
          match_type: 'founder_to_investors',
          limit: 10,
        },
      });
      const duration = performance.now() - startTime;
      
      if (error) throw error;
      durations.push(duration);
    }
    
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    logTest('Performance - Matchmaking (Multiple Runs)', 'pass', 
      `Avg: ${avgDuration.toFixed(2)}ms, Min: ${minDuration.toFixed(2)}ms, Max: ${maxDuration.toFixed(2)}ms`);
    
    if (avgDuration > 5000) {
      logTest('Performance - Matchmaking', 'warning', 'Average matchmaking time exceeds 5 seconds');
    }
    
  } catch (error) {
    logTest('Performance - Matchmaking (Multiple Runs)', 'fail', error.message);
    logError(error, 'testPerformance - Matchmaking');
  }
}

// ============================================
// REPORT GENERATION
// ============================================

function generateReport() {
  console.log('\n📊 Generating Audit Report...\n');
  
  const report = {
    ...testResults,
    performance: {
      ...testResults.performance,
      memory: {
        initial_heap_mb: memoryUsage.initial ? (memoryUsage.initial.heapUsed / 1024 / 1024).toFixed(2) : null,
        peak_heap_mb: memoryUsage.peak ? (memoryUsage.peak.heapUsed / 1024 / 1024).toFixed(2) : null,
        current_heap_mb: memoryUsage.current ? (memoryUsage.current.heapUsed / 1024 / 1024).toFixed(2) : null,
      },
    },
  };
  
  // Write report to file
  const reportPath = join(__dirname, '..', 'audit-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Generate summary
  console.log('\n' + '='.repeat(80));
  console.log('AUDIT REPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`Total Tests: ${report.summary.total}`);
  console.log(`✅ Passed: ${report.summary.passed}`);
  console.log(`❌ Failed: ${report.summary.failed}`);
  console.log(`⚠️  Warnings: ${report.summary.warnings}`);
  console.log(`\nSuccess Rate: ${((report.summary.passed / report.summary.total) * 100).toFixed(1)}%`);
  
  if (report.summary.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    report.tests.filter(t => t.status === 'fail').forEach(test => {
      console.log(`  - ${test.name}: ${test.message}`);
    });
  }
  
  if (report.summary.warnings > 0) {
    console.log('\n⚠️  WARNINGS:');
    report.tests.filter(t => t.status === 'warning').forEach(test => {
      console.log(`  - ${test.name}: ${test.message}`);
    });
  }
  
  if (report.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    report.errors.forEach(error => {
      console.log(`  - ${error.context}: ${error.error}`);
    });
  }
  
  console.log('\n📈 PERFORMANCE METRICS:');
  console.log(`  Memory - Initial: ${report.performance.memory.initial_heap_mb}MB`);
  console.log(`  Memory - Peak: ${report.performance.memory.peak_heap_mb}MB`);
  console.log(`  Memory - Current: ${report.performance.memory.current_heap_mb}MB`);
  
  if (Object.keys(report.performance.endpoints).length > 0) {
    console.log('\n  Endpoint Performance:');
    Object.entries(report.performance.endpoints).forEach(([endpoint, duration]) => {
      console.log(`    - ${endpoint}: ${duration.toFixed(2)}ms`);
    });
  }
  
  if (Object.keys(report.performance.database).length > 0) {
    console.log('\n  Database Performance:');
    Object.entries(report.performance.database).forEach(([operation, duration]) => {
      console.log(`    - ${operation}: ${duration.toFixed(2)}ms`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📄 Full report saved to: ${reportPath}`);
  console.log('='.repeat(80) + '\n');
}

// ============================================
// MAIN EXECUTION
// ============================================

async function runAudit() {
  console.log('🚀 Starting End-to-End Audit Test Suite...\n');
  console.log('='.repeat(80));
  
  try {
    // Step 1: Generate test data
    await generateTestData();
    
    // Step 2: Test database operations
    await testDatabaseOperations();
    
    // Step 3: Test matchmaking endpoint
    await testMatchmakingEndpoint();
    
    // Step 4: Test matching algorithm
    await testMatchingAlgorithm();
    
    // Step 5: Test performance and memory
    await testPerformance();
    
    // Step 6: Generate report
    generateReport();
    
    // Exit with appropriate code
    process.exit(testResults.summary.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    logError(error, 'runAudit - Main Execution');
    generateReport();
    process.exit(1);
  }
}

// Run the audit
runAudit();
