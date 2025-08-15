# Quick Setup Guide to Fix Server Error

## Step 1: Create Environment Variables File

Create a `.env.local` file in your project root with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Step 2: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon key
4. Replace the placeholder values in `.env.local`

## Step 3: Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```
Or use any random string for development.

## Step 4: Restart Your Development Server

After creating the `.env.local` file:
```bash
npm run dev
# or
yarn dev
```

## What Was Fixed

1. ✅ Created `next.config.js` file
2. ✅ Updated Supabase client with error handling
3. ✅ Updated NextAuth configuration with fallbacks
4. ✅ Added proper error handling for missing environment variables

## Common Issues

- **Server Error**: Usually means missing environment variables
- **Authentication Issues**: Check NEXTAUTH_SECRET and NEXTAUTH_URL
- **Database Connection**: Verify Supabase URL and keys

## Next Steps

1. Set up your Supabase database
2. Create the users table (see ENV_SETUP.md for SQL)
3. Test the application
