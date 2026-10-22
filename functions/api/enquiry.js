const kinds=new Set(['project','partnership','consultation','general']);
const JSON_HEADERS={'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
function fail(status,error){return new Response(JSON.stringify({error}),{status,headers:JSON_HEADERS});}
function safeText(v,min,max){return typeof v==='string'&&v.trim().length>=min&&v.trim().length<=max&& !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v);}
export function validate(data){if(!data||typeof data!=='object'||Array.isArray(data))return 'Invalid submission.';if(data.website)return 'Rejected submission.';if(!safeText(data.name,2,100))return 'Please provide your name.';if(!safeText(data.email,5,254)|| !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))return 'Please provide a valid email.';if(!kinds.has(data.kind))return 'Please choose an enquiry type.';if(data.organisation&& !safeText(data.organisation,1,120))return 'Organisation is too long.';if(!safeText(data.message,25,5000))return 'Please write a message of 25 to 5000 characters.';if(data.consent!==true)return 'Privacy consent is required.';if(!safeText(data.turnstileToken,10,2048))return 'Security check is required.';return null;}
async function digest(value){const bytes=new TextEncoder().encode(value);const hash=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');}
export async function onRequestPost({request,env}){
 if(!env.ENQUIRIES_DB||!env.TURNSTILE_SECRET||!env.IP_HASH_PEPPER||!env.ADMIN_API_KEY) return fail(503,'Enquiries are temporarily unavailable.');
 const origin=request.headers.get('origin');const expected=new URL(request.url).origin;
 if(origin && origin!==expected) return fail(403,'Cross-origin submissions are not accepted.');
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return fail(415,'Send JSON data.');
 if(Number(request.headers.get('content-length')||'0')>12000)return fail(413,'Submission is too large.');
 let data;try{const raw=await request.text();if(raw.length>12000)return fail(413,'Submission is too large.');data=JSON.parse(raw);}catch{return fail(400,'Invalid JSON body.');}
 const error=validate(data);if(error)return fail(400,error);
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';const iphash=await digest(ip+'|'+env.IP_HASH_PEPPER);const now=Math.floor(Date.now()/1000);const windowStart=now-3600;
 try{
   const recent=await env.ENQUIRIES_DB.prepare('SELECT COUNT(*) AS n FROM enquiries WHERE ip_hash=? AND created_at>?').bind(iphash,windowStart).first();
   if((recent?.n||0)>=3)return fail(429,'Too many requests. Please try again later.');
   const verdict=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:data.turnstileToken,remoteip:ip})});
   if(!verdict.ok)return fail(503,'Security verification is unavailable.');
   const result=await verdict.json();if(!result.success||result.hostname!==new URL(request.url).hostname)return fail(403,'Security check failed. Refresh and try again.');
   const id=crypto.randomUUID();
   await env.ENQUIRIES_DB.prepare('INSERT INTO enquiries (id,created_at,name,email,organisation,kind,message,ip_hash) VALUES (?,?,?,?,?,?,?,?)').bind(id,now,data.name.trim(),data.email.trim().toLowerCase(),(data.organisation||'').trim(),data.kind,data.message.trim(),iphash).run();
   return new Response(JSON.stringify({reference:id.split('-')[0]}),{status:201,headers:JSON_HEADERS});
 }catch{return fail(503,'Submission could not be processed. Please retry.');}
}
export async function onRequest({request,env}){if(request.method==='POST')return onRequestPost({request,env});return fail(405,'Method not allowed.');}
