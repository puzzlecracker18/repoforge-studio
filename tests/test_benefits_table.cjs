const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(script => script.trim());

inlineScripts.forEach((script, index) => {
  new vm.Script(script, { filename: `inline-${index}.js` });
});

const start = html.indexOf('function parseBenefitRows(featuresRaw) {');
const end = html.indexOf('function renderReadmePreview()', start);
assert.ok(start >= 0 && end > start, 'benefit-table helpers are present');

const context = {};
new vm.Script(`${html.slice(start, end)}\nthis.parseRows = parseBenefitRows;\nthis.buildTable = buildBenefitsTable;`)
  .runInNewContext(context);

const rows = context.parseRows(
  '**Quick setup**: Remove repetitive steps.\n- **Comparison**: Save time | compare results.\nPlain-language detail'
);
assert.deepEqual(JSON.parse(JSON.stringify(rows)), [
  { capability: 'Quick setup', benefit: 'Remove repetitive steps.' },
  { capability: 'Comparison', benefit: 'Save time | compare results.' },
  { capability: 'Additional detail', benefit: 'Plain-language detail' }
]);
assert.equal(context.buildTable(rows), [
  '| Capability | Benefit |',
  '| --- | --- |',
  '| Quick setup | Remove repetitive steps. |',
  '| Comparison | Save time \\| compare results. |',
  '| Additional detail | Plain-language detail |'
].join('\n'));

console.log(`PASS: ${inlineScripts.length} inline scripts parse; benefit table rows and pipe escaping work.`);
