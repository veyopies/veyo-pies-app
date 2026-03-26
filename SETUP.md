# Veyo Pies App — Deployment Guide

## What You Need Before Starting
- Stripe account with Publishable Key + Secret Key
- Vercel account (free) connected to GitHub
- Gmail account for order notifications (veyopies@gmail.com works)
- A Gmail App Password (not your regular Gmail password — see Step 4)

---

## Step 1: Upload to GitHub

1. Go to github.com and sign in
2. Click the **+** button → **New repository**
3. Name it `veyo-pies-app`, set it to **Private**, click **Create repository**
4. On your computer, open Terminal and run:
   ```
   cd path/to/veyo-pies-app
   git init
   git add .
   git commit -m "Initial Veyo Pies app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/veyo-pies-app.git
   git push -u origin main
   ```

---

## Step 2: Deploy on Vercel

1. Go to vercel.com and sign in
2. Click **Add New → Project**
3. Select your `veyo-pies-app` GitHub repo
4. Click **Deploy** (leave all settings as default)
5. Vercel will give you a URL like `veyo-pies-app.vercel.app` — that's your app!

---

## Step 3: Add Your Stripe Keys to Vercel

1. In Vercel, go to your project → **Settings → Environment Variables**
2. Add each of these one at a time:

| Name | Value |
|------|-------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key (starts with `sk_live_`) |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (starts with `pk_live_`) |
| `NOTIFY_EMAIL` | `veyopies@gmail.com` |
| `NOTIFY_EMAIL_PASSWORD` | Your Gmail App Password (see Step 4) |
| `STRIPE_WEBHOOK_SECRET` | Get this in Step 5 |

3. After adding variables, go to **Deployments** and click **Redeploy**

---

## Step 4: Get a Gmail App Password

Gmail requires an "App Password" for sending automated emails (not your regular password).

1. Go to myaccount.google.com
2. Click **Security** → **2-Step Verification** (turn it on if not already)
3. Go back to Security → scroll down to **App passwords**
4. Select app: **Mail**, device: **Other** → type "Veyo Pies App"
5. Click **Generate** — copy the 16-character password
6. Use this as your `NOTIFY_EMAIL_PASSWORD` in Vercel

---

## Step 5: Set Up Stripe Webhook (so you get order emails)

1. Go to stripe.com → **Developers → Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://your-vercel-url.vercel.app/api/webhook`
4. Select event: `checkout.session.completed`
5. Click **Add endpoint**
6. Click the webhook → **Reveal signing secret** → copy it
7. Add it to Vercel as `STRIPE_WEBHOOK_SECRET` and redeploy

---

## Step 6: Test It!

1. Open your Vercel URL in Safari on your iPhone
2. Add a pie to your cart and go to checkout
3. Use Stripe's test card: **4242 4242 4242 4242**, any future date, any CVC
4. You should be redirected to a success page and receive an order email

To switch from test mode to live payments, just swap your Stripe keys from `sk_test_` to `sk_live_` in Vercel environment variables.

---

## Your App URL
Once deployed: `https://veyo-pies-app.vercel.app`

You can also add a custom domain (like `order.veyopies.com`) in Vercel → Settings → Domains.
