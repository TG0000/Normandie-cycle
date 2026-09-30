import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/contact.js";
const savedFetch = globalThis.fetch;
const savedEnv = Object.fromEntries(
  ["RESEND_API_KEY", "CONTACT_TO", "CONTACT_FROM"].map((k) => [
    k,
    process.env[k],
  ]),
);
afterEach(() => {
  globalThis.fetch = savedFetch;
  for (const [k, v] of Object.entries(savedEnv)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});
function response() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(c) {
      this.statusCode = c;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    },
  };
}
function request(body = {}) {
  return {
    method: "POST",
    headers: { host: "normandie.example", origin: "https://normandie.example" },
    body: {
      name: "Camille",
      email: "camille@example.fr",
      message: "Un projet de vélo pour mes prochaines sorties.",
      interest: "Gravel",
      consent: "yes",
      ...body,
    },
  };
}
test("refuse les méthodes et origines non autorisées", async () => {
  let res = response();
  await handler({ ...request(), method: "GET" }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "POST");
  res = response();
  await handler(
    {
      ...request(),
      headers: { host: "normandie.example", origin: "https://autre.example" },
    },
    res,
  );
  assert.equal(res.statusCode, 403);
});
test("valide les champs, le consentement et le piège anti-robot", async () => {
  for (const bad of [
    { email: "invalide" },
    { message: "court" },
    { name: "a" },
    { consent: "no" },
    { interest: "unknown" },
    { website: "spam" },
    { name: "Nom\nInjected" },
  ]) {
    const res = response();
    await handler(request(bad), res);
    assert.equal(res.statusCode, 400);
  }
});
test("ne confirme pas un envoi quand le service n’est pas configuré", async () => {
  delete process.env.RESEND_API_KEY;
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.data.ok, undefined);
});
test("transmet un message texte au prestataire et attend son identifiant", async () => {
  process.env.RESEND_API_KEY = "test-only";
  process.env.CONTACT_TO = "shop@example.fr";
  process.env.CONTACT_FROM = "site@example.fr";
  let sent;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    sent = JSON.parse(options.body);
    return { ok: true, json: async () => ({ id: "test-message" }) };
  };
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.data.ok, true);
  assert.equal(sent.reply_to, "camille@example.fr");
  assert.deepEqual(sent.to, ["shop@example.fr"]);
  assert.match(sent.text, /Un projet de vélo/);
  assert.equal(sent.html, undefined);
});
test("un refus, une confirmation absente ou un délai dépassé ne donnent pas de succès", async () => {
  process.env.RESEND_API_KEY = "test-only";
  process.env.CONTACT_TO = "shop@example.fr";
  process.env.CONTACT_FROM = "site@example.fr";
  for (const implementation of [
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({}) }),
    async () => {
      throw new Error("timeout");
    },
  ]) {
    globalThis.fetch = implementation;
    const res = response();
    await handler(request(), res);
    assert.equal(res.statusCode, 502);
    assert.equal(res.data.ok, undefined);
  }
});
