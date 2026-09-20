# 🚀 Deployment Guide for Velocity Fleet (College Project)

Since this is a full-stack application (React Frontend + Node.js Backend + MySQL Database), you need to deploy all three parts.

Here is the easiest, 100% free way to deploy your college project so it looks professional for your professors:

## Step 1: Deploy the MySQL Database
You can't use XAMPP localhost for a live website. You need a cloud database.
1. Go to **Aiven** (aiven.io) or **Railway** (railway.app) and create a free MySQL database.
2. Get your credentials: `Host`, `Port`, `User`, `Password`, `Database Name`.
3. Use a tool like MySQL Workbench or DBeaver to connect to this new cloud database.
4. Run the `mysql_schema.sql` and `sample_data.sql` files (located in your `backend` folder) to create your tables and sample cars.

## Step 2: Deploy the Node.js Backend
1. Go to **Render.com** and create a free account.
2. Click **New Web Service** and connect your GitHub repository (you must upload the `vechile rental/backend` folder to a GitHub repo first).
3. Set the Root Directory to `backend` (if it's inside a folder) or leave it empty if the repo is just the backend.
4. Set the Build Command to `npm install` and Start Command to `npm start`.
5. **CRUCIAL:** Add Environment Variables in Render:
   - `DB_HOST` = (your Aiven/Railway host)
   - `DB_USER` = (your Aiven/Railway user)
   - `DB_PASSWORD` = (your Aiven/Railway password)
   - `DB_NAME` = `vehicle_rental`
   - `JWT_SECRET` = `your_super_secret_jwt_key_here`
6. Click Deploy. Once finished, Render will give you a live URL (e.g., `https://velocity-api.onrender.com`).

## Step 3: Deploy the React Frontend to Vercel
1. Open your frontend code (`lovable-temp` folder).
2. Create a file named `.env` in the root folder (next to package.json) and add this line:
   ```
   VITE_API_URL=https://velocity-api.onrender.com
   ```
   *(Replace the URL with your actual Render backend URL)*
3. Upload this `lovable-temp` folder to a NEW GitHub repository.
4. Go to **Vercel.com**, log in with GitHub, and click **Add New Project**.
5. Select your frontend repository.
6. In the **Environment Variables** section on Vercel, add `VITE_API_URL` and set its value to your Render backend URL.
7. Click **Deploy**.

🎉 **That's it!** Your Vercel URL (e.g. `velocity-fleet.vercel.app`) is now live and talking to your live backend and database!
