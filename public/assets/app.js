(() => {
 const menu = document.getElementById('siteNav');
 const toggle = document.getElementById('navToggle');
 toggle?.addEventListener('click', () => { const open = menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
 menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
 const path = location.pathname.replace(/\/$/,'') || '/';
 menu?.querySelectorAll('a').forEach(a => {const href=new URL(a.href).pathname.replace(/\/$/,'')||'/'; if(href===path||(path.startsWith('/work/')&&href==='/work')) a.setAttribute('aria-current','page');});
 const search = document.getElementById('projectSearch');
 const filter = document.getElementById('projectCategory');
 function applyFilter(){const normalise=s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'');const q=normalise(search?.value),cat=filter?.value||'all';const cards=[...document.querySelectorAll('#projectsGrid .case-card')];let count=0;cards.forEach(card=>{const match=(cat==='all'||card.dataset.category===cat)&&normalise(card.dataset.keywords).includes(q);card.hidden=!match;if(match)count++;});const countEl=document.getElementById('resultsCount'),noResults=document.getElementById('noResults');if(countEl)countEl.textContent=`${count} project${count===1?'':'s'} shown`;if(noResults)noResults.hidden=count>0;}
 search?.addEventListener('input',applyFilter);filter?.addEventListener('change',applyFilter);
 document.querySelectorAll('img[data-fallback-image]').forEach(img => img.addEventListener('error', () => {img.hidden=true;if(img.nextElementSibling)img.nextElementSibling.hidden=false;}));
 const form=document.getElementById('enquiryForm');if(!form)return;
 const status=document.getElementById('formStatus'),btn=form.querySelector('button[type=submit]'),mount=document.getElementById('turnstileMount');
 const params=new URLSearchParams(location.search),kind=params.get('type');if(['project','partnership','consultation','general'].includes(kind))form.elements.kind.value=kind;
 let enabled=false,widgetId=null;
 const msg=(text,good=false)=>{status.textContent=text;status.className='form-status '+(good?'ok':'error');};
 const loadScript=()=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;s.defer=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
 btn.disabled=true;
 fetch('/api/config',{cache:'no-store',headers:{Accept:'application/json'}}).then(async r=>{if(!r.ok)throw Error('unavailable');const data=await r.json();if(!data.enabled||!data.sitekey)throw Error('unconfigured');await loadScript();if(typeof window.turnstile==='undefined')throw Error('challenge-unavailable');widgetId=window.turnstile.render(mount,{sitekey:data.sitekey,theme:'dark'});enabled=true;btn.disabled=false;status.textContent='Secure form is ready.';}).catch(()=>{btn.disabled=true;msg('Online enquiries are not yet enabled on this deployment. Please use the public GitHub link in the meantime.');});
 form.addEventListener('submit',async ev=>{ev.preventDefault();if(!enabled){msg('The secure enquiry service is not configured.');return;}if(!form.reportValidity())return;const v=window.turnstile?.getResponse(widgetId);if(!v){msg('Please complete the security check.');return;}const data=Object.fromEntries(new FormData(form));delete data['cf-turnstile-response'];data.turnstileToken=v;data.consent=Boolean(form.elements.consent.checked);btn.disabled=true;btn.textContent='Sending…';msg('Submitting securely…',true);try{const res=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await res.json().catch(()=>({}));if(!res.ok)throw new Error(result.error||'The enquiry could not be submitted.');msg('Thank you — your enquiry has been received. Reference: '+result.reference,true);form.reset();window.turnstile?.reset(widgetId);}catch(err){msg(err.message||'Could not send your enquiry. Please try again.');window.turnstile?.reset(widgetId);}finally{btn.disabled=false;btn.textContent='Send enquiry ↗';}});
})();
