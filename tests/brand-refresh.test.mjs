import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
test('featured products follow the approved priority', () => {
 const page=read('public/index.html');
 const featured=page.split('class="ref-grid"')[1].split('</div>\n   <p class="ref-note">')[0];
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
  assert.ok(page.includes('/assets/projects/metaforge-brand.svg'));
 }
 assert.ok(read('public/assets/projects/homefit-official.svg').includes('data:image/webp;base64'));
 assert.ok(read('public/assets/projects/metaforge-brand.svg').includes('MetaForge'));
});
