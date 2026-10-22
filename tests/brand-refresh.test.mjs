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
