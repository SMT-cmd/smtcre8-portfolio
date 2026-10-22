export async function onRequestGet({env}) {
 const enabled=Boolean(env.ENQUIRIES_DB && env.TURNSTILE_SECRET && env.TURNSTILE_SITE_KEY && env.IP_HASH_PEPPER && env.ADMIN_API_KEY);
 return Response.json({enabled,sitekey:enabled?env.TURNSTILE_SITE_KEY:null},{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
