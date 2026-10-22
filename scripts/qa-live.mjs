// Read-only smoke test. Never submits personal data or calls the authenticated admin API.
// Usage: node scripts/qa-live.mjs https://your-pages-domain
const base=process.argv[2];
if(!base || !/^https:\/\/[^/]+\/?$/.test(base)){console.error('Usage: node scripts/qa-live.mjs https://your-domain');process.exit(2);}
const routes=[['/',200,'SMTCRE8'],['/work/',200,'Selected'],['/about/',200,'Human'],['/contact/',200,'enquiry'],['/privacy/',200,'privacy'],['/work/my-rp/',200,'MY-RP'],['/work/global-webstores/',200,'Global Webstores'],['/api/config',200,'enabled']];
let errors=0;
for(const [path,status,text] of routes){try{const r=await fetch(new URL(path,base),{redirect:'follow',signal:AbortSignal.timeout(12000)});const html=await r.text();const ok=r.status===status&&html.toLowerCase().includes(text.toLowerCase());console.log(ok?'PASS':'FAIL',r.status,path,ok?'':`expected ${status} containing ${text}`);if(!ok)errors++;if(path==='/api/config'){try{const data=JSON.parse(html);console.log('ENQUIRY_BACKEND',data.enabled?'configured':'disabled');if(!data.enabled)errors++;}catch{errors++;}}}catch(e){console.log('ERROR',path,String(e));errors++;}}
const invalid=await fetch(new URL('/api/admin/enquiries',base),{redirect:'manual',signal:AbortSignal.timeout(12000)}).catch(()=>null);
if(invalid?.status===401)console.log('PASS',401,'/api/admin/enquiries unauthorized');else{console.log('FAIL','admin endpoint did not return 401');errors++;}
if(errors){console.error(`${errors} failure(s)`);process.exitCode=1;}else console.log('Read-only live smoke passed');
