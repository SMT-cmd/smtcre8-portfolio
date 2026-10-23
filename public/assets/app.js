(() => {
 const menu = document.getElementById('siteNav');
 const toggle = document.getElementById('navToggle');
 toggle?.addEventListener('click', () => { const open = menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
 menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
 // Keep forex education discoverable across all authored pages, not just the homepage.
 if(menu && !menu.querySelector('a[href="/forex-education/"]')){
   const learn=document.createElement('a');learn.href='/forex-education/';learn.textContent='Forex education';
   const first=menu.querySelector('a');first?.insertAdjacentElement('afterend',learn);
 }
 const path = location.pathname.replace(/\/$/,'') || '/';
 menu?.querySelectorAll('a').forEach(a => {const href=new URL(a.href).pathname.replace(/\/$/,'')||'/'; if(href===path||(path.startsWith('/work/')&&href==='/work')) a.setAttribute('aria-current','page');});
 const search = document.getElementById('projectSearch');
 const filter = document.getElementById('projectCategory');
 function applyFilter(){const normalise=s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'');const q=normalise(search?.value),cat=filter?.value||'all';const cards=[...document.querySelectorAll('#projectsGrid .case-card')];let count=0;cards.forEach(card=>{const match=(cat==='all'||card.dataset.category===cat)&&normalise(card.dataset.keywords).includes(q);card.hidden=!match;if(match)count++;});const countEl=document.getElementById('resultsCount'),noResults=document.getElementById('noResults');if(countEl)countEl.textContent=`${count} project${count===1?'':'s'} shown`;if(noResults)noResults.hidden=count>0;}
 search?.addEventListener('input',applyFilter);filter?.addEventListener('change',applyFilter);
 document.querySelectorAll('img[data-fallback-image]').forEach(img => img.addEventListener('error', () => {img.hidden=true;if(img.nextElementSibling)img.nextElementSibling.hidden=false;}));

 // Keep the accepted S8 artwork, without inventing a replacement identity.
 document.querySelectorAll('.wordmark').forEach(mark=>{
   if(mark.querySelector('img'))return;
   const icon=document.createElement('img');
   icon.src='/assets/s8-original-transparent.webp';
   icon.width=42;icon.height=38;icon.alt='';icon.decoding='async';icon.setAttribute('aria-hidden','true');
   mark.insertBefore(icon,mark.firstChild);
 });
 let theme='light';
 try{theme=localStorage.getItem('smtcre8-theme')==='dark'?'dark':'light';}catch(e){}
 document.documentElement.dataset.theme=theme;
 const themeButton=document.createElement('button');
 themeButton.type='button';themeButton.className='theme-toggle';
 const syncTheme=()=>{
   const dark=document.documentElement.dataset.theme==='dark';
   themeButton.textContent=dark?'☀ Light mode':'☾ Dark mode';
   themeButton.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
   themeButton.setAttribute('aria-pressed',String(dark));
 };
 syncTheme();
 themeButton.addEventListener('click',()=>{
   const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
   document.documentElement.dataset.theme=next;
   try{localStorage.setItem('smtcre8-theme',next);}catch(e){}
   syncTheme();
 });
 menu?.appendChild(themeButton);

 // The portfolio consumes only publicly published book metadata from the Trading Library.
 // On an unavailable feed, keep the original verified book as the visible fallback.
 const shelf=document.getElementById('portfolioBooks');
 if(shelf){
   const source='https://library.slttradehub.trade/api/portfolio-books';
   fetch(source,{mode:'cors',credentials:'omit',signal:AbortSignal.timeout(9000)})
     .then(r=>{if(!r.ok)throw Error('catalogue unavailable');return r.json();})
     .then(data=>{
       if(!Array.isArray(data.books)||!data.books.length)return;
       const cards=document.createDocumentFragment();let valid=0;
       for(const entry of data.books.slice(0,12)){
         if(!entry||typeof entry.title!=='string'||typeof entry.url!=='string')continue;
         let url,imageUrl;
         try{url=new URL(entry.url);if(url.protocol!=='https:'||url.hostname!=='library.slttradehub.trade')continue;
           imageUrl=new URL(entry.cover_url,source);
           if(imageUrl.protocol!=='https:')continue;
         }catch{continue;}
         const card=document.createElement('article');card.className='portfolio-book';
         const img=document.createElement('img');img.src=imageUrl.href;img.alt=entry.title+' book cover';img.loading='lazy';
         const copy=document.createElement('div'),kind=document.createElement('span');kind.className='book-type';kind.textContent=entry.category||'Trading book';
         const title=document.createElement('h3');title.textContent=entry.title+(entry.subtitle?' — '+entry.subtitle:'');
         const summary=document.createElement('p');summary.textContent=(entry.description||'Explore this title in the Trading Library.').slice(0,240);
         const link=document.createElement('a');link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Explore this book ↗';
         copy.append(kind,title,summary,link);card.append(img,copy);cards.append(card);valid++;
       }
       if(valid)shelf.replaceChildren(cards);
     })
     .catch(()=>{/* Keep the source-backed static book fallback. */});
 }

 const form=document.getElementById('enquiryForm');if(!form)return;
 const status=document.getElementById('formStatus'),btn=form.querySelector('button[type=submit]'),mount=document.getElementById('turnstileMount');
 const params=new URLSearchParams(location.search),kind=params.get('type');if(['project','partnership','consultation','general'].includes(kind))form.elements.kind.value=kind;
 const projectSlug=params.get('project')||'';
 const interest=params.get('topic');
 if(interest==='forex-education'){
   form.elements.kind.value='consultation';
   if(!form.elements.message.value)form.elements.message.value='I would like to enquire about forex tutoring or learning materials. My current level and learning goals are: ';
 }else if(interest==='digital-build'){
   form.elements.kind.value='project';
   if(!form.elements.message.value)form.elements.message.value='I would like to discuss building a website, application or digital product. My idea and requirements are: ';
 }

 const knownProjects={'global-webstores':'Global Webstores','homefit-challenge':'HomeFit Challenge','praylume':'Praylume','my-rp':'MY-RP','slt-trade-hub':'SLT Trade Hub','letterhead-engine':'Letterhead Engine','unileh-print-hub':'Unilesh Print Hub','meta-receipt-engine':'MetaForge Receipt Engine','rare-root-collections':'Rare Root Collections','afrinethub':'AfriNet Hub','beccatee-atelier':'Beccatee Atelier','crispykaras':'SMT Crispy Akaras','skillforge-correction':'SkillForge Digital','projectbiuld':'ResearchHub','slttn':'SLT Trading Library'};
 if(Object.hasOwn(knownProjects,projectSlug)){
   const title=knownProjects[projectSlug];
   const banner=document.getElementById('projectInterest');
   if(banner){banner.hidden=false;banner.textContent='Inspired by: '+title;}
   form.elements.kind.value='project';
   if(!form.elements.message.value)form.elements.message.value='I saw '+title+' on SMTCRE8 and would like to discuss a related project. My idea is: ';
 }
 let enabled=false,widgetId=null;
 const msg=(text,good=false)=>{status.textContent=text;status.className='form-status '+(good?'ok':'error');};
 const loadScript=()=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;s.defer=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
 btn.disabled=true;
 fetch('/api/config',{cache:'no-store',headers:{Accept:'application/json'}}).then(async r=>{if(!r.ok)throw Error('unavailable');const data=await r.json();if(!data.enabled||!data.sitekey)throw Error('unconfigured');await loadScript();if(typeof window.turnstile==='undefined')throw Error('challenge-unavailable');widgetId=window.turnstile.render(mount,{sitekey:data.sitekey,theme:'dark'});enabled=true;btn.disabled=false;status.textContent='Secure form is ready.';}).catch(()=>{btn.disabled=true;msg('Online enquiries are not yet enabled on this deployment. Please use the public GitHub link in the meantime.');});
 form.addEventListener('submit',async ev=>{ev.preventDefault();if(!enabled){msg('The secure enquiry service is not configured.');return;}if(!form.reportValidity())return;const v=window.turnstile?.getResponse(widgetId);if(!v){msg('Please complete the security check.');return;}const data=Object.fromEntries(new FormData(form));delete data['cf-turnstile-response'];data.turnstileToken=v;data.consent=Boolean(form.elements.consent.checked);btn.disabled=true;btn.textContent='Sending…';msg('Submitting securely…',true);try{const res=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await res.json().catch(()=>({}));if(!res.ok)throw new Error(result.error||'The enquiry could not be submitted.');msg('Thank you — your enquiry has been received. Reference: '+result.reference,true);form.reset();window.turnstile?.reset(widgetId);}catch(err){msg(err.message||'Could not send your enquiry. Please try again.');window.turnstile?.reset(widgetId);}finally{btn.disabled=false;btn.textContent='Send enquiry ↗';}});
})();
