# Wolf Email AI

Email jailsucks@agentmail.to, get Claude back.

## How It Works

1. You send an email to jailsucks@agentmail.to
2. AgentMail fires a webhook to your Vercel function
3. The function sends your email body to Claude
4. Claude's response gets emailed back to you via AgentMail

## Deploy (5 minutes)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "wolf email ai"
git remote add origin https://github.com/YOURUSERNAME/wolf-email-ai.git
git push -u origin main
```

### 2. Deploy on Vercel

Go to vercel.com, import the repo.

Add these environment variables in Vercel project settings:

```
AGENTMAIL_API_KEY = your agentmail api key
ANTHROPIC_API_KEY = your anthropic api key
```

Deploy. Note your deployment URL (e.g. wolf-email-ai.vercel.app).

### 3. Register the webhook (run once)

After deploying, run this from your local machine:

```bash
npm install agentmail
AGENTMAIL_API_KEY=your_key VERCEL_URL=wolf-email-ai.vercel.app node setup.mjs
```

This tells AgentMail to send incoming emails to your Vercel function.

### 4. Test it

Send an email to jailsucks@agentmail.to from any email address. You should get a response from Claude within 30-60 seconds.

## Costs

- Vercel free tier
- AgentMail free tier
- Anthropic: fractions of a cent per email exchange

## Files

```
app/api/webhook/route.js  - The one function that does everything
setup.mjs                  - Run once to register webhook
```

That's it. Two files that matter.
