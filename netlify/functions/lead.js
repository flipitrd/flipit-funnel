export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    return { statusCode: 500, body: 'Missing MAKE_WEBHOOK_URL environment variable' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const allowed = ['fecha','nombre','telefono','pais','direccion','nivel','paquete','monto','deposito','enfoque','notas'];
    const clean = {};
    for (const key of allowed) {
      clean[key] = payload[key] == null ? '' : String(payload[key]).slice(0, 1000);
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(clean)
    });

    if (!response.ok) {
      return { statusCode: 502, body: 'Webhook error' };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    return { statusCode: 400, body: 'Invalid request' };
  }
}
