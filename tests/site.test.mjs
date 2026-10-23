import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';import {join} from 'node:path';import {pathToFileURL} from 'node:url';
const root=new URL('../',import.meta.url).pathname;const pub=join(root,'public');
test('all 15 static case-study routes and curated metadata',()=>{const names=readdirSync(join(pub,'work'),{withFileTypes:true}).filter(v=>v.isDirectory()).map(v=>v.name);assert.equal(names.length,15);for(const n of names){const t=readFileSync(join(pub,'work',n,'index.html'),'utf8');assert.match(t,/<h1>/);assert.match(t,/THE STARTING POINT|THE IDEA|THE DIRECTION|THE STARTING POINT/);assert.match(t,/MY CONTRIBUTION/);assert.match(t,/\/contact\/\?type=project&amp;project=/);assert.match(t,/What the|INSIDE THE PROJECT|THE EXPERIENCE/);}});
test('all main pages have metadata navigation and consistent tagline',()=>{for(const n of ['','work','contact','about','privacy']){let h=readFileSync(join(pub,n,'index.html'),'utf8');assert.match(h,/<meta name="description"/);assert.match(h,/Skip to content/);assert.match(h,/Human Vision. AI Power. Real Innovation./);}});
test('no private repository source links',()=>{const html=[];function walk(dir){for(const item of readdirSync(dir,{withFileTypes:true})){const p=join(dir,item.name);if(item.isDirectory())walk(p);else if(p.endsWith('.html'))html.push(readFileSync(p,'utf8'));}}walk(pub);const text=html.join('\n');for(const name of ['Gwebstore','homefit-challenge','Praylume','slt-tradehub','Slt-Trade-Hub','META-RECEIPT-ENGINE-PRO'])assert.ok(!text.includes('github.com/SMT-cmd/'+name),'private link '+name);});
test('enquiry schema validation rejects invalid payloads',async()=>{const {validate}=await import('../functions/api/enquiry.js');const valid={name:'Test Person',email:'test@example.com',kind:'project',message:'I would like to discuss building an online catalogue.',consent:true,turnstileToken:'0123456789012',website:''};assert.equal(validate(valid),null);for(const bad of [{email:'bad'}, {message:'hi'}, {kind:'spam'}, {consent:false}, {website:'bot'}, {turnstileToken:''}])assert.ok(validate({...valid,...bad}));});
test('unconfigured forms must not accept enquiries',async()=>{const {onRequestPost}=await import('../functions/api/enquiry.js');const r=await onRequestPost({request:new Request('https://example.com/api/enquiry',{method:'POST'}),env:{}});assert.equal(r.status,503);});
test('public site security headers and no inline event handlers',()=>{const h=readFileSync(join(pub,'_headers'),'utf8');assert.match(h,/Content-Security-Policy/);let source=readFileSync(join(pub,'index.html'),'utf8');assert.ok(!/onerror\s*=|onclick\s*=/.test(source));});

test('homepage uses approved S8 and exposes trading books',()=>{
 const h=readFileSync(join(pub,'index.html'),'utf8');
 assert.match(h,/s8-hero-art/);
 assert.match(h,/s8-approved-preview\.svg/);
 assert.match(h,/id="portfolioBooks"/);
 assert.match(h,/synthetic-indices-101\.png/);
 assert.doesNotMatch(h,/Independent thinker, creator &amp; builder/);
});
test('project directory uses official local assets with valid case-study routes',()=>{
 const work=readFileSync(join(pub,'work','index.html'),'utf8');
 const all=[...work.matchAll(/class="case-card"/g)];
 assert.equal(all.length,19);
 assert.doesNotMatch(work,/unverified release|no verified public launch/i);
 for(const [,asset] of work.matchAll(/src="(\/assets\/projects\/[^"]+)"/g)){
   assert.ok(readFileSync(join(pub,asset.replace(/^\//,''))).byteLength>0,'missing project asset '+asset);
 }
 for(const [,slug] of work.matchAll(/href="\/work\/([^/]+)\/"/g)){
   assert.match(readFileSync(join(pub,'work',slug,'index.html'),'utf8'),/<h1>/);
 }
});
test('book feed is cross-origin permitted only to the library origin',()=>{
 const headers=readFileSync(join(pub,'_headers'),'utf8');
 assert.match(headers,/connect-src 'self' https:\/\/challenges\.cloudflare\.com https:\/\/library\.slttradehub\.trade/);
 const js=readFileSync(join(pub,'assets','app.js'),'utf8');
 assert.match(js,/\/api\/portfolio-books/);
 assert.match(js,/data\.books/);
 assert.match(js,/replaceChildren\(cards\)/);
 assert.match(js,/url\.hostname!=='library\.slttradehub\.trade'/);
});
test('project enquiry carries project identity without exposing form secrets',()=>{
 const js=readFileSync(join(pub,'assets','app.js'),'utf8');
 const form=readFileSync(join(pub,'contact','index.html'),'utf8');
 assert.match(form,/id="projectInterest"/);
 assert.match(js,/params\.get\('project'\)/);
 assert.match(js,/Object\.hasOwn\(knownProjects,projectSlug\)/);
});

test('SMTCRE8 share card and forex tutoring commercial positioning',()=>{
 const home=readFileSync(join(pub,'index.html'),'utf8'),about=readFileSync(join(pub,'about','index.html'),'utf8'),work=readFileSync(join(pub,'work','index.html'),'utf8');
 assert.match(home,/Digital innovator/);
 assert.match(home,/id="services"/);
 assert.match(home,/studio-service-grid/);
 assert.match(home,/Forex tutoring/);
 assert.match(home,/Forex tutoring is educational/);
 assert.match(about,/Digital innovator/);
 assert.match(about,/market structure and price action/);
 assert.match(work,/forex education/i);
 for(const doc of [home,about,work]){
  assert.match(doc,/property="og:image" content="https:\/\/smtcre8\.pages\.dev\/assets\/social-preview\.jpg"/);
  assert.match(doc,/name="twitter:card" content="summary_large_image"/);
 }
 const bytes=readFileSync(join(pub,'assets','social-preview.jpg'));
 assert.ok(bytes.length>5000);assert.equal(bytes[0],255);assert.equal(bytes[1],216);
});
