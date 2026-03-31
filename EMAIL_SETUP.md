# Email Integration Setup Guide

Your Second Brain dashboard is ready to fetch and reply to emails via your Hostinger account.

## What's Already Built

✅ Email settings modal (email, password, IMAP/SMTP servers)  
✅ Fetch emails from IMAP inbox  
✅ Read and preview emails  
✅ Reply to emails via SMTP  
✅ Netlify backend function (fully configured)  

## To Get Started

### Step 1: Set Up Hostinger App Password

1. Log into your Hostinger account
2. Go to **Email Accounts** → Click your email
3. Click **Manage** 
4. Look for **Security** or **App Passwords**
5. Generate a new app-specific password (NOT your main password)
6. Copy the generated password

### Step 2: Find Your IMAP/SMTP Details

Default Hostinger settings:
- **IMAP Server:** `imap.hostinger.com`
- **IMAP Port:** `993` (secure)
- **SMTP Server:** `smtp.hostinger.com`
- **SMTP Port:** `587` (secure with TLS)

If different, check your Hostinger email settings under "POP3/IMAP Configuration" or contact support.

### Step 3: Configure in Dashboard

1. Open the **Emails** section in your Second Brain dashboard
2. Click **"Configure Email Settings"**
3. Enter:
   - Email address: `your@hostinger.email`
   - App password: (paste the one from Step 1)
   - IMAP Server: `imap.hostinger.com` (or your custom)
   - IMAP Port: `993`
   - SMTP Server: `smtp.hostinger.com` (or your custom)
   - SMTP Port: `587`
4. Click **Save Settings**

### Step 4: Test It

1. Click **Refresh** (🔄 button)
2. You should see your emails populate
3. Click an email to read it
4. Click **Reply** to test sending

## Technical Details

**Backend:** Netlify Functions (`netlify/functions/email-sync.ts`)

**Packages used:**
- `imap` — IMAP client for fetching emails
- `nodemailer` — SMTP client for sending emails
- `mailparser` — Parse email content

**How it works:**
1. Dashboard sends email config to Netlify function
2. Function connects to Hostinger IMAP server
3. Fetches last 20 emails and returns them
4. For replies, function uses SMTP to send email

**Security notes:**
- Credentials are sent via HTTPS (Netlify functions)
- App-specific passwords are safer than account password
- Consider enabling 2FA on your Hostinger account

## Troubleshooting

**"Connection refused" error:**
- Verify IMAP/SMTP server names (check Hostinger settings)
- Ensure ports are correct (993 for IMAP, 587 for SMTP)
- Check that IMAP is enabled in Hostinger email settings

**"Authentication failed" error:**
- Double-check app password (not your main password)
- Make sure email address is exactly correct
- Try generating a new app password in Hostinger

**Emails not showing up:**
- Click Refresh again (first sync takes a moment)
- Check your INBOX folder (others may not sync yet)
- Verify email is configured correctly

**Can't send reply:**
- Verify SMTP server and port are correct
- Check that app password is correct
- Try a test with simple text (no special characters)

## Next Steps

Once working, you can:
- Set up auto-reply filters
- Archive processed emails
- Search/filter emails by sender
- Schedule reply sending
- Set up email forwarding

Questions? Check Hostinger documentation or email support.
