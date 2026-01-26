# Supabase Edge Functions API

This directory contains Supabase Edge Functions (Deno-based serverless functions) for the In-Sync Connect platform.

## Functions

### `matchmaking`

AI-powered matchmaking service that matches founders with investors based on compatibility scoring.

**Endpoint:** `POST /functions/v1/matchmaking`

**Request Body:**
```json
{
  "user_id": "uuid",
  "match_type": "founder_to_investors" | "investor_to_founders",
  "limit": 20 // optional, default 20
}
```

**Response:**
```json
{
  "matches": [
    {
      "investor_id": "uuid",
      "user_id": "uuid",
      "firm_name": "string",
      "match_score": 85,
      "match_label": "Strong fit",
      "why_this_match": ["reason1", "reason2", "reason3"],
      "potential_concerns": ["concern1", "concern2"],
      "fit_breakdown": {
        "sector_fit": 100,
        "stage_fit": 90,
        "geography_fit": 80,
        "business_model_fit": 85,
        "thesis_similarity": 75,
        "why_yes_alignment": 70,
        "value_add_fit": 80,
        "total": 85
      }
    }
  ],
  "improvement_suggestions": ["suggestion1", "suggestion2"],
  "total_investors": 50,
  "matches_found": 25
}
```

**Features:**
- Hard filtering (sector exclusions, geography conflicts, business model conflicts)
- Compatibility scoring (7 dimensions with weighted scoring)
- AI-powered thesis similarity matching
- Diversity ranking (ensures variety in top matches)
- Explainability (why matches, concerns, improvement suggestions)

**Environment Variables:**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (bypasses RLS)
- `LOVABLE_API_KEY` - Optional, for AI-powered thesis matching

## Development

### Local Development

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve matchmaking --env-file .env.local
```

### Deploy

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy matchmaking
```

## Testing

Functions can be tested using the Supabase Dashboard or via curl:

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/matchmaking \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid",
    "match_type": "founder_to_investors"
  }'
```

## Architecture

All functions use:
- **Deno runtime** (Supabase Edge Functions)
- **CORS headers** for cross-origin requests
- **Service role key** for database access (bypasses RLS)
- **Error handling** with proper HTTP status codes
