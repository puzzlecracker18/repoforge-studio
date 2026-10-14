const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('function parseBenefitRows(featuresRaw) {');
const end = html.indexOf('function updateViralAuditScore()', start);
const escapeStart = html.indexOf('function escXml(unsafe) {');
const escapeEnd = html.indexOf('function showToast(msg) {', escapeStart);
assert.ok(start >= 0 && end > start, 'README helpers and renderer are present');
assert.ok(escapeStart >= 0 && escapeEnd > escapeStart, 'HTML escaping helper is present');

const features = '**Fast | readable**: **Keeps it safe** with <script>alert(1)</script> & quick `CLI` setup.\n- **No extra dependencies**: Keeps installs small.\nPlain-language detail';
const elements = {
  'meta-repo': { value: 'demo/project' },
  'meta-tagline': { value: 'A demo project' },
  'meta-install': { value: 'npm run start' },
  'banner-lang': { value: 'JavaScript' },
  'readme-features-input': { value: features },
  'badge-ci': { checked: false },
  'badge-license': { checked: false },
  'badge-zerodep': { checked: false },
  'badge-bench': { checked: false },
  'readme-raw-code': { textContent: '' },
  'readme-rendered-view': { innerHTML: '' }
};
const context = {
  state: {
    benchRows: [
      { ours: true, name: 'RepoForge', val: 'demo metric' },
      { ours: false, name: 'Baseline', val: 'example metric' }
    ],
    generatedSVGs: {
      banner: '<svg>banner</svg>',
      terminal: '<svg>terminal</svg>',
      benchmark: '<svg>benchmark</svg>'
    }
  },
  document: {
    getElementById(id) {
      assert.ok(elements[id], `unexpected DOM lookup: ${id}`);
      return elements[id];
    }
  },
  updateViralAuditScore() {}
};

const source = `${html.slice(escapeStart, escapeEnd)}\n${html.slice(start, end)}\nthis.renderReadmePreview = renderReadmePreview;`;
new vm.Script(source).runInNewContext(context);
context.renderReadmePreview();

let markdown = elements['readme-raw-code'].textContent;
let preview = elements['readme-rendered-view'].innerHTML;
assert.ok(markdown.includes('| Fast \\| readable | **Keeps it safe** with <script>alert(1)</script> & quick `CLI` setup. |'));
assert.ok(markdown.includes('| Additional detail | Plain-language detail |'));
assert.ok(markdown.includes('| Implementation | Metric Result | Status |'));
assert.ok(markdown.includes('| :--- | :---: | :--- |'));
assert.ok(!markdown.includes('|| Implementation |'));
assert.ok(!markdown.includes('## License'));
assert.ok(!markdown.includes('g++ -std=c++20'));
assert.ok(preview.includes('<table class="min-w-full text-xs sm:text-sm">'));
assert.ok(preview.includes('>Fast | readable</th>'));
assert.ok(preview.includes('<strong class="text-[var(--text-primary)] font-semibold">Keeps it safe</strong>'));
assert.ok(preview.includes('&lt;script&gt;alert(1)&lt;/script&gt; &amp; quick <code'));
assert.ok(!preview.includes('<script>alert(1)</script>'), 'user HTML remains escaped in preview');

elements['readme-features-input'].value = '';
context.renderReadmePreview();
markdown = elements['readme-raw-code'].textContent;
preview = elements['readme-rendered-view'].innerHTML;
assert.ok(markdown.includes('| Capability | Benefit |'));
assert.ok(markdown.includes('| --- | --- |'));
assert.ok(!markdown.includes('| Additional detail |'));
assert.ok(preview.includes('<tbody></tbody>'));

elements['readme-features-input'].value = features;
elements['badge-license'].checked = true;
context.renderReadmePreview();
markdown = elements['readme-raw-code'].textContent;
preview = elements['readme-rendered-view'].innerHTML;
assert.ok(markdown.includes('## License\n\nReleased under the **MIT License**'));
assert.ok(markdown.includes('![License]'));
assert.ok(preview.includes('license // MIT'));

console.log('PASS: generated README tables, Markdown/HTML escaping, and checkbox-gated MIT text work.');
