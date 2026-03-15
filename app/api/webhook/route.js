import { AgentMailClient } from "agentmail";
import Anthropic from "@anthropic-ai/sdk";

const INBOX_ID = "jailsucks@agentmail.to";

const agentmail = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI assistant responding via email to an investigative journalist who is incarcerated and has no internet access. He can only communicate through a jail tablet email system. Be direct, thorough, and useful. If he asks you to research something, give him everything you know. If he asks you to draft something, draft it completely. If he asks you to compose a Substack post, write the entire thing. No filler, no pleasantries, just answers. His name is Jason Allen Cataldo, also known as The Wise Wolf.`;

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("FULL WEBHOOK PAYLOAD:", JSON.stringify(body, null, 2));

    if (body.event_type !== "message.received") {
      return Response.json({ ok: true });
    }

    const message = body.message;
    if (!message) {
      console.log("No message in payload");
      return Response.json({ ok: true });
    }

    console.log("message_id:", JSON.stringify(message.message_id));
    console.log("message_id type:", typeof message.message_id);
    console.log("subject:", JSON.stringify(message.subject));
    console.log("text type:", typeof message.text);
    console.log("extracted_text type:", typeof message.extracted_text);

    const messageId = message.message_id;
    const subject = message.subject || "(no subject)";
    const emailBody = message.extracted_text || message.text || "";

    if (!emailBody.trim()) {
      return Response.json({ ok: true });
    }

    console.log("Calling Claude...");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Subject: ${subject}\n\n${emailBody}`,
        },
      ],
    });

    const reply = response.content[0].text;
    console.log("Claude replied, length:", reply.length);

    console.log("Sending reply via AgentMail...");
    console.log("INBOX_ID:", INBOX_ID, "type:", typeof INBOX_ID);
    console.log("messageId:", messageId, "type:", typeof messageId);

    await agentmail.inboxes.messages.reply(INBOX_ID, messageId, {
      text: reply,
    });

    console.log("Reply sent successfully");
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
