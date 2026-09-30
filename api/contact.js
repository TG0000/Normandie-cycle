const interests = new Set([
  "Conseil",
  "Route",
  "Gravel",
  "Électrique",
  "Entretien",
]);
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
  // Refuse cross-origin browser submissions. Vercel supplies the request host.
  if (req.headers.origin) {
    try {
      if (new URL(req.headers.origin).host !== req.headers.host)
        return res.status(403).json({ error: "Origine refusée." });
    } catch {
      return res.status(403).json({ error: "Origine refusée." });
    }
  }
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Demande invalide." });
  }
  if (!body || typeof body !== "object")
    return res.status(400).json({ error: "Demande invalide." });
  if (body.website) return res.status(400).json({ error: "Demande invalide." });
  const { name, email, message, interest, consent } = body;
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.length > 80 ||
    /[\r\n]/.test(name) ||
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== "string" ||
    message.trim().length < 10 ||
    message.length > 3000 ||
    !interests.has(interest) ||
    consent !== "yes"
  )
    return res
      .status(400)
      .json({ error: "Vérifiez les champs du formulaire." });
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM)
    return res
      .status(503)
      .json({ error: "Le formulaire est momentanément indisponible." });
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Normandie Cycles — Projet ${interest}`,
        text: `Prénom : ${name.trim()}\nE-mail : ${email}\nProjet : ${interest}\n\n${message.trim()}\n\nConsentement au traitement pour répondre à la demande : oui.`,
      }),
    });
    if (!response.ok)
      return res.status(502).json({ error: "Envoi indisponible." });
    const result = await response.json();
    if (!result.id)
      return res.status(502).json({ error: "Envoi non confirmé." });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Envoi indisponible." });
  }
}
