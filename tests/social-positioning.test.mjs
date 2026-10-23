import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const root=new URL('../public/',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
function pages(){
 const items=[];
 function visit(path){
  for(const e of readdirSync(new URL(path,root),{withFileTypes:true})){
   const next=path+e.name;
   if(e.isDirectory())visit(next+'/');
   else if(next.endsWith('.html'))items.push(next);
  }
 }
 visit('');
 return items;
}
function jpegSize(bytes){
 assert.equal(bytes[0],0xff); assert.equal(bytes[1],0xd8);
 let p=2;
 while(p<bytes.length){
  if(bytes[p++]!==0xff)continue;
  const marker=bytes[p++];
  if(marker===0xd9||marker===0xda)break;
  const len=bytes.readUInt16BE(p);
  if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb].includes(marker))
   return {height:bytes.readUInt16BE(p+3),width:bytes.readUInt16BE(p+5)};
  p+=len;
 }
 throw Error('JPEG has no dimensions');
}
test('approved S8 social preview is a standard 1200 x 630 JPEG supported by link crawlers',()=>{
 const bytes=readFileSync(new URL('assets/smtcre8-social-preview.jpg',root));
 assert.ok(bytes.length>8500);
 assert.deepEqual(jpegSize(bytes),{width:1200,height:630});
 const brand=readFileSync(new URL('assets/s8-original-transparent.webp',root));
 assert.equal(brand.subarray(0,4).toString(),'RIFF');
});
test('every static page has unique canonical URL and absolute sharing image metadata',()=>{
 const seen=new Set();
 for(const path of pages()){
  const html=read(path);
  const expected=path==='index.html'?'https://smtcre8.pages.dev/':
   path==='404.html'?'https://smtcre8.pages.dev/404':
   'https://smtcre8.pages.dev/'+path.replace(/index\.html$/,'');
  assert.ok(html.includes('<link rel="canonical" href="'+expected+'">'),'canonical missing: '+path);
  assert.ok(html.includes('<meta property="og:url" content="'+expected+'">'),'og:url missing: '+path);
  assert.match(html,/property="og:image" content="https:\/\/smtcre8\.pages\.dev\/assets\/smtcre8-social-preview\.jpg"/,'missing image: '+path);
  assert.match(html,/property="og:image:width" content="1200"/);
  assert.match(html,/property="og:image:height" content="630"/);
  assert.match(html,/name="twitter:card" content="summary_large_image"/);
  assert.match(html,/name="twitter:image" content="https:\/\/smtcre8\.pages\.dev\/assets\/smtcre8-social-preview\.jpg"/);
  assert.ok(!seen.has(expected),'duplicate canonical: '+expected);
  seen.add(expected);
 }
 assert.ok(seen.size>=22);
});
test('homepage commercially represents forex tutor and digital innovator without returns promises',()=>{
 const home=read('index.html'),about=read('about/index.html'),forex=read('forex-education/index.html');
 assert.match(home,/Forex Tutor/);
 assert.match(home,/Digital Innovator/);
 assert.match(home,/id="forex-education"/);
 assert.match(home,/Forex tutoring &amp; trading education/);
 assert.match(home,/Digital products &amp; business innovation/);
 assert.match(home,/no guaranteed returns|not guaranteed|not guaranteed returns|never guaranteed|not guaranteed outcomes|not guaranteed/i);
 assert.match(about,/Forex tutor/);
 assert.match(forex,/pip calculations/i);
 assert.match(forex,/risk management/i);
 assert.match(forex,/no profits or trading outcomes are guaranteed/i);
 assert.match(forex,/https:\/\/www\.slttradehub\.trade\//);
 assert.match(read('sitemap.xml'),/https:\/\/smtcre8\.pages\.dev\/forex-education\//);
});
test('contact prefill for education and digital enquiries preserves consent and backend protections',()=>{
 const js=read('assets/app.js'),contact=read('contact/index.html');
 assert.match(js,/interest==='forex-education'/);
 assert.match(js,/interest==='digital-build'/);
 assert.match(js,/form\.elements\.kind\.value='consultation'/);
 assert.match(js,/window\.turnstile/);
 assert.match(contact,/Forex tutoring &amp; education/);
 assert.match(contact,/id="consent"/);
});
