# 🚀 Quick Start: Neon Database Setup

Follow these steps to get your Neon database up and running in 5 minutes.

## Step 1: Create Neon Account & Project (2 minutes)

1. Go to **https://neon.tech** and sign up (use GitHub/Google for fastest signup)
2. Click **"Create a project"**
3. Name it: `impara-news`
4. Choose region closest to you
5. Click **"Create Project"**

## Step 2: Get Connection String (1 minute)

1. After project creation, you'll see **Connection Details**
2. In the dropdown, select **"Prisma"**
3. **Copy** the connection string (looks like this):
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```

## Step 3: Update Your .env File (30 seconds)

1. Open `Backend/.env`
2. Replace the `DATABASE_URL` line with your Neon connection string:
   ```env
   DATABASE_URL="postgresql://your-neon-connection-string-here"
   ```
3. **Save** the file

## Step 4: Push Schema to Neon (1 minute)

Open terminal in the `Backend` folder and run:

```bash
npm run prisma:push
```

You should see: ✔ Generated Prisma Client

## Step 5: Create Admin User (30 seconds)

```bash
node create-admin.js
```

Follow the prompts to create your admin account.

## Step 6: Start Your Server (30 seconds)

```bash
npm run dev
```

**Done!** 🎉 Your application is now using Neon hosted database!

---

## Optional: Migrate Existing Data

If you have data in your local database:

```bash
# 1. Export from local database
node migrate-to-neon.js export

# 2. Update .env with Neon connection string (already done above)

# 3. Push schema (already done above)

# 4. Import to Neon
node migrate-to-neon.js import
```

---

## Verify Everything Works

1. **Test database connection:**
   ```bash
   node test-db.js
   ```

2. **View your data in Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```
   Opens at http://localhost:5555

3. **Or view in Neon Console:**
   Go to https://console.neon.tech → Your Project → Tables

---

## Need More Details?

See the full guide: `NEON-DATABASE-SETUP.md`

## Troubleshooting

**Can't connect?**
- Check internet connection
- Verify connection string has `?sslmode=require` at the end
- Make sure you copied the entire connection string

**Authentication failed?**
- Copy the connection string again from Neon dashboard
- Make sure there are no extra spaces in .env file

**Need help?**
- Neon Docs: https://neon.tech/docs
- Neon Discord: https://discord.gg/neon
