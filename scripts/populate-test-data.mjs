#!/usr/bin/env node

/**
 * Populate Database with Test Data
 * Creates test users, founder applications, and investor applications
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env.local');
  console.error('💡 These should already be set for your frontend app');
  process.exit(1);
}

// Use service role key if available (bypasses email confirmation), otherwise use anon key
const useServiceRole = !!SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
  SUPABASE_URL, 
  useServiceRole ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_PUBLISHABLE_KEY
);

if (useServiceRole) {
  console.log('✅ Using service role key - users will be created instantly\n');
} else {
  console.log('⚠️  No service role key found - using anon key');
  console.log('   Users will need email confirmation (check Supabase Dashboard)\n');
  console.log('💡 Tip: Add SUPABASE_SERVICE_ROLE_KEY to .env.local for instant user creation\n');
}

// Test data
const testFounders = [
  {
    email: 'founder1@test.com',
    password: 'TestPassword123!',
    founder: {
      founder_name: 'Alex Chen',
      email: 'founder1@test.com',
      company_name: 'AI Health Solutions',
      website: 'https://aihealth.example.com',
      vertical: 'AI/ML',
      stage: 'Seed',
      location: 'San Francisco, CA',
      funding_goal: '$2M',
      business_model: 'B2B SaaS',
      traction: '50 enterprise customers, $500K ARR',
      current_ask: 'Looking for Series A lead investor',
      status: 'approved',
      application_sections: {
        company_information: {
          company_name: 'AI Health Solutions',
          website: 'https://aihealth.example.com',
        },
        your_team_company_overview: {
          company_pitch: 'AI-powered healthcare platform that helps hospitals reduce costs and improve patient outcomes through predictive analytics.',
        },
        value_proposition: {
          problem_statement: 'Hospitals struggle with patient readmission rates and operational inefficiencies.',
          value_delivery_types: ['Cost Reduction', 'Efficiency', 'Patient Outcomes'],
        },
        business_model: {
          customer_type: 'B2B',
          business_structure: 'SaaS subscription model',
          pricing_strategy: ['Subscription', 'Per-seat'],
        },
        go_to_market: {
          acquisition_strategy: 'Direct sales to hospital systems',
          gtm_timeline: '6-12 months to first enterprise customer',
        },
        market_sizing: {
          ideal_customer_profile: 'Large hospital systems with 500+ beds',
          target_geography: 'North America',
          tam_value: '$50B',
          sam_value: '$5B',
          som_value: '$500M',
        },
      },
    },
  },
  {
    email: 'founder2@test.com',
    password: 'TestPassword123!',
    founder: {
      founder_name: 'Sarah Martinez',
      email: 'founder2@test.com',
      company_name: 'ClimateTech Innovations',
      website: 'https://climatetech.example.com',
      vertical: 'Climate',
      stage: 'Pre-seed',
      location: 'Boston, MA',
      funding_goal: '$500K',
      business_model: 'B2B',
      traction: 'Pilot with 3 major corporations',
      current_ask: 'Pre-seed funding to scale pilot program',
      status: 'approved',
      application_sections: {
        company_information: {
          company_name: 'ClimateTech Innovations',
          website: 'https://climatetech.example.com',
        },
        your_team_company_overview: {
          company_pitch: 'Carbon tracking and reduction platform for enterprise sustainability programs.',
        },
        value_proposition: {
          problem_statement: 'Companies need better tools to track and reduce their carbon footprint.',
          value_delivery_types: ['Sustainability', 'Compliance', 'Cost Savings'],
        },
        business_model: {
          customer_type: 'B2B',
          business_structure: 'SaaS platform',
          pricing_strategy: ['Subscription', 'Usage-based'],
        },
        go_to_market: {
          acquisition_strategy: 'Partnerships with sustainability consultancies',
          gtm_timeline: '3-6 months to first paying customer',
        },
        market_sizing: {
          ideal_customer_profile: 'Fortune 500 companies with sustainability goals',
          target_geography: 'Global',
          tam_value: '$30B',
          sam_value: '$3B',
          som_value: '$300M',
        },
      },
    },
  },
  {
    email: 'founder3@test.com',
    password: 'TestPassword123!',
    founder: {
      founder_name: 'David Kim',
      email: 'founder3@test.com',
      company_name: 'FinTech Payments',
      website: 'https://fintechpay.example.com',
      vertical: 'FinTech',
      stage: 'Series A',
      location: 'New York, NY',
      funding_goal: '$5M',
      business_model: 'B2B',
      traction: '$2M ARR, 200+ SMB customers',
      current_ask: 'Series A to expand to enterprise market',
      status: 'approved',
      application_sections: {
        company_information: {
          company_name: 'FinTech Payments',
          website: 'https://fintechpay.example.com',
        },
        your_team_company_overview: {
          company_pitch: 'Modern payment infrastructure for SMBs with transparent pricing and easy integration.',
        },
        value_proposition: {
          problem_statement: 'Small businesses pay high fees and have complex payment setups.',
          value_delivery_types: ['Cost Reduction', 'Ease of Use', 'Transparency'],
        },
        business_model: {
          customer_type: 'B2B',
          business_structure: 'Transaction-based SaaS',
          pricing_strategy: ['Transaction Fee', 'Monthly Subscription'],
        },
        go_to_market: {
          acquisition_strategy: 'Direct sales and partnerships with accounting software',
          gtm_timeline: '12-18 months to scale',
        },
        market_sizing: {
          ideal_customer_profile: 'SMBs processing $100K+ monthly payments',
          target_geography: 'US',
          tam_value: '$100B',
          sam_value: '$10B',
          som_value: '$1B',
        },
      },
    },
  },
];

const testInvestors = [
  {
    email: 'investor1@test.com',
    password: 'TestPassword123!',
    investor: {
      firm_name: 'AI Ventures Fund',
      website: 'https://aiventures.example.com',
      hq_location: 'San Francisco, CA',
      firm_description: 'Early-stage VC focused on AI/ML startups in healthcare and enterprise.',
      aum: '$100M',
      fund_vintage: '2020',
      fund_type: 'Venture Capital',
      ownership_target: '15-25%',
      lead_follow: 'Lead',
      portfolio_count: '25',
      top_investments: 'HealthAI, DataCorp, MLPlatform',
      geographic_focus: 'North America',
      thesis_statement: 'We invest in AI companies that solve real problems in healthcare and enterprise.',
      sub_themes: ['Healthcare AI', 'Enterprise Automation', 'ML Infrastructure'],
      sector_tags: ['AI/ML', 'Health', 'SaaS'],
      stage_focus: ['Seed', 'Series A'],
      check_sizes: ['$500K - $2M'],
      status: 'active',
      public_profile: true,
      b2b_b2c: 'B2B',
      revenue_models: ['Subscription', 'SaaS'],
      customer_types: ['Enterprise', 'SMB'],
      operating_support: ['Go-to-Market', 'Sales', 'Product'],
      time_to_first_response: '24-48 hours',
      time_to_decision: '2-4 weeks',
      gives_no_with_feedback: true,
    },
  },
  {
    email: 'investor2@test.com',
    password: 'TestPassword123!',
    investor: {
      firm_name: 'Climate Capital Partners',
      website: 'https://climatecapital.example.com',
      hq_location: 'Boston, MA',
      firm_description: 'Dedicated to funding climate tech solutions for a sustainable future.',
      aum: '$50M',
      fund_vintage: '2021',
      fund_type: 'Impact Fund',
      ownership_target: '10-20%',
      lead_follow: 'Lead',
      portfolio_count: '15',
      top_investments: 'CarbonTrack, GreenEnergy, SustainableSupply',
      geographic_focus: 'Global',
      thesis_statement: 'We back startups that can meaningfully reduce carbon emissions.',
      sub_themes: ['Carbon Reduction', 'Renewable Energy', 'Sustainable Supply Chain'],
      sector_tags: ['Climate'],
      stage_focus: ['Pre-seed', 'Seed'],
      check_sizes: ['$250K - $1M'],
      status: 'active',
      public_profile: true,
      b2b_b2c: 'B2B',
      revenue_models: ['Subscription', 'Usage-based'],
      customer_types: ['Enterprise'],
      operating_support: ['Partnerships', 'Regulatory'],
      time_to_first_response: '48-72 hours',
      time_to_decision: '3-6 weeks',
      gives_no_with_feedback: true,
    },
  },
  {
    email: 'investor3@test.com',
    password: 'TestPassword123!',
    investor: {
      firm_name: 'FinTech Growth Fund',
      website: 'https://fintechgrowth.example.com',
      hq_location: 'New York, NY',
      firm_description: 'Growth-stage investor in fintech and payments infrastructure.',
      aum: '$200M',
      fund_vintage: '2019',
      fund_type: 'Growth Equity',
      ownership_target: '5-15%',
      lead_follow: 'Follow',
      portfolio_count: '40',
      top_investments: 'PayTech, BankAPI, CryptoPay',
      geographic_focus: 'US',
      thesis_statement: 'We invest in proven fintech companies ready to scale.',
      sub_themes: ['Payments', 'Banking Infrastructure', 'Financial Services'],
      sector_tags: ['FinTech'],
      stage_focus: ['Series A', 'Series B+'],
      check_sizes: ['$2M - $5M'],
      status: 'active',
      public_profile: true,
      b2b_b2c: 'B2B',
      revenue_models: ['Transaction Fee', 'Subscription'],
      customer_types: ['SMB', 'Enterprise'],
      operating_support: ['Sales', 'Marketing', 'Operations'],
      time_to_first_response: '1 week',
      time_to_decision: '4-8 weeks',
      gives_no_with_feedback: false,
    },
  },
];

async function createUser(email, password) {
  if (useServiceRole) {
    // Use admin API - creates user instantly without email confirmation
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (error && !error.message.includes('already registered')) {
      throw error;
    }

    if (data?.user) {
      return data.user.id;
    }

    // User already exists, get the user
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const user = existingUser.users.find(u => u.email === email);
    return user?.id || null;
  } else {
    // Use signUp - requires email confirmation
    // Note: Supabase may reject test emails, so this might not work for @test.com addresses
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      // User might already exist, try to sign in
      if (signUpError.message.includes('already registered')) {
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return signInData?.user?.id || null;
      }
      
      throw signUpError;
    }

    return signUpData?.user?.id || null;
  }
}

async function populateData() {
  console.log('🚀 Starting database population...\n');

  const createdUsers = {
    founders: [],
    investors: [],
  };

  // Create founder users and applications
  console.log('📝 Creating founder users and applications...');
  console.log('  💡 Note: Users may need email confirmation. Check Supabase Dashboard > Authentication > Users\n');
  
  for (const testData of testFounders) {
    try {
      const userId = await createUser(testData.email, testData.password);
      if (!userId) {
        console.log(`  ⚠️  Could not create/get user for ${testData.email}`);
        console.log(`     Try: Sign in manually with ${testData.email} / ${testData.password}`);
        continue;
      }

      // Check if application already exists
      const { data: existing } = await supabase
        .from('founder_applications')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        console.log(`  ✅ Founder application already exists for ${testData.email}`);
        createdUsers.founders.push({ userId, email: testData.email });
        continue;
      }

      const { error } = await supabase
        .from('founder_applications')
        .insert({
          ...testData.founder,
          user_id: userId,
        });

      if (error) {
        console.log(`  ❌ Error creating founder application for ${testData.email}: ${error.message}`);
      } else {
        console.log(`  ✅ Created founder: ${testData.founder.company_name} (${testData.email})`);
        createdUsers.founders.push({ userId, email: testData.email });
      }
    } catch (error) {
      console.log(`  ❌ Error creating founder ${testData.email}: ${error.message}`);
    }
  }

  console.log('\n💰 Creating investor users and applications...');
  for (const testData of testInvestors) {
    try {
      const userId = await createUser(testData.email, testData.password);
      if (!userId) {
        console.log(`  ⚠️  Could not create/get user for ${testData.email}`);
        console.log(`     Try: Sign in manually with ${testData.email} / ${testData.password}`);
        continue;
      }

      // Check if application already exists
      const { data: existing } = await supabase
        .from('investor_applications')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        console.log(`  ✅ Investor application already exists for ${testData.email}`);
        createdUsers.investors.push({ userId, email: testData.email });
        continue;
      }

      const { error } = await supabase
        .from('investor_applications')
        .insert({
          ...testData.investor,
          user_id: userId,
        });

      if (error) {
        console.log(`  ❌ Error creating investor application for ${testData.email}: ${error.message}`);
      } else {
        console.log(`  ✅ Created investor: ${testData.investor.firm_name} (${testData.email})`);
        createdUsers.investors.push({ userId, email: testData.email });
      }
    } catch (error) {
      console.log(`  ❌ Error creating investor ${testData.email}: ${error.message}`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  Founders created: ${createdUsers.founders.length}`);
  console.log(`  Investors created: ${createdUsers.investors.length}`);

  return createdUsers;
}

// Run population
populateData()
  .then((users) => {
    console.log('\n✅ Database population complete!');
    console.log('\n📋 Test Users:');
    console.log('\nFounders:');
    users.founders.forEach(f => {
      console.log(`  - ${f.email} (ID: ${f.userId})`);
    });
    console.log('\nInvestors:');
    users.investors.forEach(i => {
      console.log(`  - ${i.email} (ID: ${i.userId})`);
    });
    console.log('\n💡 Use these credentials to test the API endpoints.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
