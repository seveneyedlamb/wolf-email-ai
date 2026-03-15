#!/usr/bin/env node

/**
 * Run this ONCE after deploying to Vercel:
 *   AGENTMAIL_API_KEY=am_xxx VERCEL_URL=your-app.vercel.app node setup.mjs
 */

import { AgentMailClient } from "agentmail";

const client = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY,
});

const INBOX_ID = "jailsucks@agentmail.to";
const VERCEL_URL = process.env.VERCEL_URL;

if (!VERCEL_URL) {
  console.error("Set VERCEL_URL env var (e.g. your-app.vercel.app)");
  process.exit(1);
}

const webhookUrl = `https://${VERCEL_URL}/api/webhook`;

console.log(`Creating webhook: ${webhookUrl}`);
console.log(`Inbox: ${INBOX_ID}`);

try {
  const webhook = await client.webhooks.create({
    url: webhookUrl,
    eventTypes: ["message.received"],
    inboxIds: [INBOX_ID],
  });
  console.log("Webhook created:", webhook);
} catch (err) {
  console.error("Error:", err.message || err);
}
