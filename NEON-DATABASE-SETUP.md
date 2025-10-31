# Neon PostgreSQL Database Setup Guide

This guide will walk you through setting up a hosted PostgreSQL database using Neon for your Impara News application.

## Step 1: Create a Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign Up"** (you can use GitHub, Google, or email)
3. Verify your email if required

## Step 2: Create a New Project

1. After logging in, click **"Create a project"** or **"New Project"**
2. Fill in the project details:
   - **Project name**: `impara-news` (or your preferred name)
   - **Region**: Choose the closest region to your users (e.g., US East, EU Central, Asia Pacific)
   - **PostgreSQL version**: Use the default (latest version, currently 16)
3. Click **"Create Project"**

## Step 3: Get Your Database Connection String

1. After project creation, you'll see a **Connection Details** page
2. Look for the **Connection string** section
3. Select **"Prisma"** from the dropdown (this formats it correctly for your app)
4. Copy the connection string - it will look like this:
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
5. **IMPORTANT**: Save this connection string securely - you'll need it in the next step

## Step 4: Update Your .env File

1. Open your `.env` file in the Backend folder
2. Replace the existing `DATABASE_URL` with your Neon connection string:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"
   ```
3. Save the file

**Example:**
```env
PORT=4000
CORS_ORIGIN=http://localhost:5173

# PostgreSQL Database URL (Neon Hosted)
DATABASE_URL="postgresql://impara_user:AbCd1234XyZ@ep-cool-cloud-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=7d

ALLOWED_USERS=admin@impara.com,user@impara.com
```

## Step 5: Push Your Database Schema to Neon

Now you need to create all your tables in the Neon database:

1. Open a terminal in your Backend folder
2. Run the following command:
   ```bash
   npm run prisma:push
   ```
3. You should see output like:
   ```
   Prisma schema loaded from prisma\schema.prisma
   Datasource "db": PostgreSQL database "neondb"
   
   🚀  Your database is now in sync with your Prisma schema.
   ✔ Generated Prisma Client
   ```

## Step 6: Seed Your Database (Optional but Recommended)

If you want to populate your database with initial data:

1. Run the seed script:
   ```bash
   npm run prisma:seed
   ```
   
   Or manually run your seed files:
   ```bash
   node seed-basic.js
   node create-admin.js
   ```

## Step 7: Verify the Connection

Test that your application can connect to the database:

1. Run the test script:
   ```bash
   node test-db.js
   ```
2. You should see a success message confirming the connection

## Step 8: Start Your Application

1. Start your backend server:
   ```bash
   npm run dev
   ```
2. Your application should now be connected to the Neon hosted database!

## Step 9: View Your Database (Optional)

You can view and manage your database in two ways:

### Option A: Neon Console
1. Go to your Neon dashboard at [https://console.neon.tech](https://console.neon.tech)
2. Select your project
3. Click on **"Tables"** or **"SQL Editor"** to view/edit data

### Option B: Prisma Studio
1. Run this command in your Backend folder:
   ```bash
   npm run prisma:studio
   ```
2. This opens a web interface at `http://localhost:5555` where you can view and edit your data

## Migrating Existing Data (If You Have Local Data)

If you have existing data in your local PostgreSQL database that you want to move to Neon:

### Method 1: Using pg_dump (Recommended for large datasets)

1. Export your local database:
   ```bash
   pg_dump -h localhost -U postgres -d impara_news -F c -f impara_news_backup.dump
   ```

2. Restore to Neon (you'll need to install pg_restore):
   ```bash
   pg_restore -h ep-xxxxx.region.aws.neon.tech -U username -d neondb -F c impara_news_backup.dump
   ```

### Method 2: Using Prisma (Recommended for small datasets)

1. Keep your local `DATABASE_URL` temporarily
2. Export data using Prisma Studio or custom scripts
3. Switch to Neon `DATABASE_URL`
4. Run `npm run prisma:push`
5. Import data using your seed scripts or Prisma Studio

## Important Notes

### Free Tier Limits
- **Storage**: 512 MB
- **Data transfer**: 0.5 GB/month
- **Compute**: Shared compute with auto-suspend after 5 minutes of inactivity
- **Branches**: 10 branches (great for development/staging)

### Security Best Practices
1. ✅ **Never commit** your `.env` file to Git
2. ✅ Keep your `.env.example` updated (without real credentials)
3. ✅ Use different databases for development, staging, and production
4. ✅ Rotate your database password periodically
5. ✅ Use Neon's branching feature for testing migrations

### Connection Pooling (For Production)
If you're deploying to a serverless environment (Vercel, Netlify Functions, etc.), use Neon's connection pooling:

1. In Neon dashboard, go to your project
2. Find the **"Pooled connection"** string
3. Use this instead of the direct connection string:
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
   ```

## Troubleshooting

### Error: "Can't reach database server"
- Check your internet connection
- Verify the connection string is correct
- Ensure `sslmode=require` is in the connection string

### Error: "Authentication failed"
- Double-check your username and password in the connection string
- Regenerate the password in Neon dashboard if needed

### Error: "Database does not exist"
- Make sure you're using the correct database name (usually `neondb`)
- Check the Neon dashboard for the exact database name

### Slow queries
- Neon free tier uses shared compute
- Consider upgrading to a paid plan for dedicated resources
- Use Neon's auto-suspend feature to save compute time

## Next Steps

1. ✅ Set up environment variables for production deployment
2. ✅ Create a staging branch in Neon for testing
3. ✅ Set up automated backups (available in paid plans)
4. ✅ Monitor your database usage in the Neon dashboard

## Support

- **Neon Documentation**: [https://neon.tech/docs](https://neon.tech/docs)
- **Neon Discord**: [https://discord.gg/neon](https://discord.gg/neon)
- **Prisma Documentation**: [https://www.prisma.io/docs](https://www.prisma.io/docs)

---

**You're all set!** Your Impara News application is now using a production-ready hosted PostgreSQL database. 🚀
