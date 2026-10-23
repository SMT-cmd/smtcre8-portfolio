import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
test('featured products follow the approved priority', () => {
 const page=read('public/index.html');
 const featured=page.split('class="ref-grid studio-project-grid"')[1]?.split('<p class="ref-note">')[0] || '';
 const names=['Global Webstores','HomeFit Challenge','SkillForge Digital','Praylume','SLT Trade Hub'];
 const positions=names.map(name=>featured.indexOf('<h3>'+name+'</h3>'));
 assert.ok(positions.every(position=>position>=0), 'all priority projects must be featured');
 assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
 assert.ok(!featured.includes('Traylim'));
});
test('header logo has no CSS white tile in either theme', () => {
 const css=read('public/assets/styles.css');
 const marker=css.slice(css.lastIndexOf('/* Header logo:'));
 assert.match(marker,/\.site-header \.wordmark img\{[^}]*background:transparent/);
 assert.match(marker,/html\[data-theme="dark"\] \.site-header \.wordmark img\{[^}]*background:transparent/);
});

test('work directory indexes SkillForge projects and proper brand assets',()=>{
 const homepage=read('public/index.html');
 const directory=read('public/work/index.html');
 for(const name of ['SkillForge Digital','SkillForge Trading Journal','SkillForge Portal','Naturally Tiwa Skincare']) assert.ok(directory.includes('<h3>'+name+'</h3>'), name);
 for(const page of [homepage,directory]){
  assert.ok(page.includes('/assets/projects/homefit-official.svg'));
  assert.ok(page.includes('/assets/projects/metaforge-icon.svg'));
 }
 assert.ok(read('public/assets/projects/homefit-official.svg').includes('data:image/webp;base64'));
 assert.ok(read('public/assets/projects/metaforge-icon.svg').includes('forgePrimary'));
});


test('original extracted S8 and SkillForge source artwork are published',()=>{
 const homepage=read('public/index.html');
 const directory=read('public/work/index.html');
 assert.ok(homepage.includes('/assets/s8-original-transparent.webp'));
 for (const page of [homepage,directory]) assert.ok(page.includes('/assets/projects/skillforge-official.jpg'));
 const webp=readFileSync(new URL('../public/assets/s8-original-transparent.webp',import.meta.url));
 assert.equal(webp.subarray(0,4).toString(),'RIFF');
 assert.equal(webp.subarray(8,12).toString(),'WEBP');
 assert.ok(webp.length>25000,'the hero must not regress to the tiny embedded preview');
 const jpeg=readFileSync(new URL('../public/assets/projects/skillforge-official.jpg',import.meta.url));
 assert.equal(jpeg[0],0xff); assert.equal(jpeg[1],0xd8);
});


test('responsive S8 does not consume a second grid row on small screens', () => {
 const html=read('public/index.html');
 const css=read('public/assets/styles.css');
 assert.match(html, /class="s8-hero-art" aria-hidden="true"/);
 assert.match(html, /src="\/assets\/s8-original-transparent.webp"/);
 const mobile=css.slice(css.lastIndexOf('/* 2026-10-22: The original S8'));
 assert.match(mobile, /@media \(max-width:950px\)/);
 assert.match(mobile, /\.ref-hero \{\s*display:block/);
 assert.match(mobile, /\.ref-hero \.s8-hero-art \{\s*position:absolute/);
 assert.match(mobile, /\.ref-hero \.s8-hero-art img \{[\s\S]*?opacity:/);
 assert.match(mobile, /@media \(max-width:540px\)/);
 assert.match(read('public/assets/app.js'), /icon\.src='\/assets\/s8-original-transparent\.webp'/);
});
test('original repository identity files are preserved byte-for-byte', async () => {
 const {createHash}=await import('node:crypto');
 const gitSha=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 const path='./';
 const root=new URL('../public/assets/projects/',import.meta.url);
 assert.equal(gitSha(readFileSync(new URL('skillforge-official.jpg',root))),
   '69b600e74bef2b3669518caed0ec9093ae136e68', 'SkillForge JPEG must match the upstream logo');
 assert.equal(gitSha(readFileSync(new URL('naturally-tiwa-official.png',root))),
   '0a9077bf0f9bf99215eb0df3b89c0c66f9383070','Naturally Tiwa PNG must match the source');
 for(const page of [read('public/index.html'),read('public/work/index.html')]) {
   assert.match(page,/\/assets\/projects\/skillforge-official\.jpg/);
 }
 assert.match(read('public/work/index.html'),/\/assets\/projects\/naturally-tiwa-official\.png/);
 const directory=read('public/work/index.html');
 assert.ok(!directory.includes('<option value="Community">Community</option><option value="Community">'));
});


test('premium editorial homepage features authentic projects and responsive bento gallery',()=>{
 const home=read('public/index.html');
 const work=read('public/work/index.html');
 const css=read('public/assets/premium-studio.css');
 assert.match(home,/premium-studio\.css/);
 assert.match(work,/premium-studio\.css/);
 assert.match(home,/class="wrap ref-hero studio-hero"/);
 assert.match(home,/class="ref-grid studio-project-grid"/);
 assert.equal((home.match(/class="ref-project(?: spotlight)?"/g)||[]).length,7);
 assert.match(home,/class="studio-device-display"/);
 assert.match(home,/Brand presentation mockups using source logos—not screenshots/);
 assert.match(home,/src="\/assets\/projects\/metaforge-icon\.svg"/);
 assert.match(work,/src="\/assets\/projects\/metaforge-icon\.svg"/);
 assert.match(css,/\.studio-project-grid\.ref-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/\.studio-directory \.projects-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/\.studio-hero \.s8-hero-art\{position:absolute/);
 assert.doesNotMatch(home,/50\+|100\+|99%|award-winning creative studio/i,
   'do not invent portfolio awards, user counts or achievements');
});
test('case studies inherit the same premium stylesheet',async()=>{
 const {readdirSync}=await import('node:fs');
 const names=readdirSync(new URL('../public/work/',import.meta.url),{withFileTypes:true})
  .filter(d=>d.isDirectory()).map(d=>d.name);
 for(const slug of names){
  const html=read('public/work/'+slug+'/index.html');
  assert.match(html,/premium-studio\.css/,'missing premium styles on '+slug);
 }
});
