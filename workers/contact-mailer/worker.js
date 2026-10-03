// Recibe { name, email, website, message, lang, page } ya validado por la Pages Function
// y lo envía como email a la dirección verificada en Email Routing.
import { EmailMessage } from 'cloudflare:email';

const FROM = 'formulario@nachomascort.com';
const TO = 'nacho.mascort@gmail.com';

// Quita saltos de línea para que nadie pueda inyectar cabeceras
const oneLine = (value, max) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

const base64Utf8 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/.{1,76}/g, '$&\r\n');
};

const encodeHeader = (text) => `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(text)))}?=`;

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const data = await request.json().catch(() => null);
    if (!data) return new Response('Bad request', { status: 400 });

    const name = oneLine(data.name, 100);
    const email = oneLine(data.email, 254);
    const website = oneLine(data.website, 200);
    const page = oneLine(data.page, 300);
    const lang = data.lang === 'en' ? 'EN' : 'ES';
    const message = String(data.message ?? '').slice(0, 5000);
    if (!name || !email || !message) return new Response('Bad request', { status: 400 });

    const body = [
      `Nombre: ${name}`,
      `Email: ${email}`,
      website ? `Web: ${website}` : null,
      `Idioma: ${lang}`,
      page ? `Página: ${page}` : null,
      '',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n');

    const raw = [
      `From: ${encodeHeader('Formulario nachomascort.com')} <${FROM}>`,
      `To: <${TO}>`,
      `Reply-To: ${encodeHeader(name)} <${email}>`,
      `Subject: ${encodeHeader(`Contacto web: ${name}`)}`,
      `Message-ID: <${crypto.randomUUID()}@nachomascort.com>`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      base64Utf8(body),
    ].join('\r\n');

    try {
      await env.MAILER.send(new EmailMessage(FROM, TO, raw));
    } catch (error) {
      console.error(error);
      return new Response('Send failed', { status: 502 });
    }
    return new Response('OK');
  },
};
