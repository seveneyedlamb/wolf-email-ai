#!/usr/bin/env node
import { AgentMailClient } from "agentmail";

const client = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY,
});

const INBOX_ID = "jailsucks@agentmail.to";
const VERCEL_URL = process.env.VERCEL_URL;

if (!VERCEL_URL) {
  console.error("Set VERCEL_URL env var");
  process.exit(1);
}

const webhookUrl = `https://${VERCEL_URL}/api/webhook`;
console.log(`Creating webhook: ${webhookUrl}`);

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
