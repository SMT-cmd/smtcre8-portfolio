import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const homepage = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/assets/premium-studio.css', import.meta.url), 'utf8');

test('commercial section keeps its label and headline grouped and aligned', () => {
  assert.match(homepage, /class="studio-commercial-head"><p class="studio-eyebrow">WHAT I BRING TO THE TABLE<\/p><h2>Knowledge you can apply/);
  assert.match(css, /\.studio-commercial-head\{display:grid;justify-items:start;align-items:start/);
  assert.match(css, /\.studio-commercial-head \.studio-eyebrow\{margin:0\}/);
  assert.match(css, /\.studio-commercial-head h2\{[^}]*max-width:100%/);
});

test('genuine Global Webstores and SkillForge captures render without cropping', () => {
  for (const project of ['global-webstores-explore-capture.jpg', 'skillforge-website-capture.jpg']) {
    assert.ok(homepage.includes('/assets/projects/' + project));
  }
  assert.match(css, /\.studio-project-grid \.ref-project-top \.stage-capture img\{[^}]*object-fit:contain;object-position:center top/s);
  assert.match(css, /\.studio-device \.device-art\.device-art-screen img\{[^}]*object-fit:contain;object-position:center top/s);
  assert.match(css, /\.studio-project-grid \.stage-browser-chrome span\{[^}]*text-overflow:ellipsis/);
});
