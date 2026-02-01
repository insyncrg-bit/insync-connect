  INSERT INTO founder_applications (
    id,
    user_id,
    founder_name,
    email,
    company_name,
    website,
    vertical,
    stage,
    location,
    funding_goal,
    business_model,
    traction,
    current_ask,
    status,
    logo_url,
    pitchdeck_url,
    application_sections,
    team_members,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    'Alex Rivera',
    'founder@testco.com',
    'CloudSync Technologies',
    'https://cloudsync.tech',
    'Enterprise SaaS',
    'Seed',
    'San Francisco, CA',
    '$2M',
    'We help remote teams collaborate more effectively with AI-powered document synchronization. Our platform eliminates version conflicts and information silos that plague distributed companies. Built 
  specifically for companies with 50-500 employees who struggle with keeping everyone on the same page across multiple tools and time zones.',
    'Currently in beta with 300 users, $8K MRR, 35% MoM growth',
    'We acquire customers through content marketing, SEO optimization, and direct outbound sales to HR and Operations departments at mid-market companies.',
    'approved',
    NULL,
    NULL,
    jsonb_build_object(
      'section1', jsonb_build_object(
        'companyName', 'CloudSync Technologies',
        'website', 'https://cloudsync.tech',
        'linkedIn', 'https://linkedin.com/company/cloudsync',
        'vertical', 'Enterprise SaaS',
        'stage', 'Seed',
        'location', 'San Francisco, CA'
      ),
      'section2', jsonb_build_object(
        'companyOverview', 'We help remote teams collaborate more effectively with AI-powered document synchronization. Our platform eliminates version conflicts and information silos that plague distributed 
  companies. Built specifically for companies with 50-500 employees who struggle with keeping everyone on the same page across multiple tools and time zones.',
        'currentPainPoint', 'Remote teams waste over 2 hours daily searching for the latest version of documents and syncing information across different tools and platforms.',
        'valueDrivers', jsonb_build_array('Scalability', 'Severity & Urgency'),
        'valueDriverExplanations', jsonb_build_object(
          'Scalability', 'Our AI automatically detects conflicts and syncs documents in real-time, eliminating manual version control.',
          'Severity & Urgency', 'Version conflicts cost companies $50K+ annually in lost productivity and missed opportunities.'
        )
      ),
      'section3', jsonb_build_object(
        'customerType', jsonb_build_array('B2B'),
        'pricingStrategies', jsonb_build_array('Subscription'),
        'subscriptionDetails', jsonb_build_object(
          'type', 'Per Seat',
          'billingCycle', 'Both',
          'tiers', 'Starter $19/seat, Pro $49/seat, Enterprise Custom'
        )
      ),
      'section4', jsonb_build_object(
        'gtmAcquisition', 'We acquire customers through content marketing, SEO optimization, and direct outbound sales to HR and Operations departments at mid-market companies.',
        'gtmTimeline', 'Q1: Launch beta, Q2: Product Hunt, Q3: Scale outbound, Q4: Partner channel'
      ),
      'section5', jsonb_build_object(
        'targetGeography', 'North America',
        'targetCustomerDescription', 'Our ideal customer is a remote-first company with 50-500 employees that relies heavily on document collaboration. The decision maker is typically the VP of Operations or 
  CTO.',
        'tamValue', '$50,000,000,000',
        'samValue', '$5,000,000,000',
        'somValue', '$500,000,000',
        'tamCalculation', 'Top-Down',
        'tamBreakdown', 'Global collaboration software market',
        'samBreakdown', 'SMB segment in North America',
        'somBreakdown', '1% market share in 5 years'
      ),
      'section6', jsonb_build_object(
        'competitors', jsonb_build_array(
          jsonb_build_object(
            'name', 'Google Drive',
            'description', 'Cloud storage with basic collaboration',
            'differentiation', 'We provide intelligent conflict resolution and cross-platform sync'
          ),
          jsonb_build_object(
            'name', 'Dropbox',
            'description', 'File sharing and storage platform',
            'differentiation', 'Our AI detects and resolves conflicts automatically without user intervention'
          ),
          jsonb_build_object(
            'name', 'Notion',
            'description', 'All-in-one workspace',
            'differentiation', 'We focus specifically on document sync across existing tools rather than replacing them'
          )
        ),
        'competitiveMoat', 'Our proprietary AI conflict detection algorithm has been trained on over 10 million document merge scenarios. We have filed 2 patents on our real-time synchronization technology. 
  High switching costs due to deep integrations with 50+ business tools create natural lock-in once customers adopt our platform.'
      )
    ),
    jsonb_build_array(
      jsonb_build_object(
        'name', 'Alex Rivera',
        'role', 'CEO & Co-founder',
        'linkedin', 'https://linkedin.com/in/alexrivera',
        'background', 'Former Dropbox PM, 10 years in collaboration software'
      ),
      jsonb_build_object(
        'name', 'Jordan Kim',
        'role', 'CTO & Co-founder',
        'linkedin', 'https://linkedin.com/in/jordankim',
        'background', 'Ex-Google engineer, PhD in distributed systems'
      )
    ),
    NOW(),
    NOW()
  )