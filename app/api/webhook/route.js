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

    // Only process incoming messages
    if (body.event_type !== "message.received") {
      return Response.json({ ok: true });
    }

    const message = body.message;
    if (!message) {
      return Response.json({ ok: true });
    }

    const messageId = message.message_id;
    const subject = message.subject || "(no subject)";
    const emailBody = message.extracted_text || message.text || "";

    if (!emailBody.trim()) {
      return Response.json({ ok: true });
    }

    // Call Claude
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

    // Reply via AgentMail
    await agentmail.inboxes.messages.reply({
      inboxId: INBOX_ID,
      messageId: messageId,
      text: reply,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
