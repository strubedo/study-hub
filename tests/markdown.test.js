// Lesson markdown rendering: `ios` fences get prompt/state highlighting; any other
// fence (powershell, text, none) renders as plain escaped monospace code.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInThisContext } from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// The vendored UMD build sets globalThis.marked, as the <script> tag does in the browser.
runInThisContext(readFileSync(join(root, 'assets/vendor/marked.min.js'), 'utf8'));
const { md } = await import('../engine/ui.js');

test('powershell fences render escaped, unhighlighted, with their language class', () => {
  const out = md('```powershell\nGet-ADUser -Filter * | Where-Object { $_.Enabled -eq $true } > users.txt\n```');
  assert.match(out, /<pre><code class="lang-powershell">/);
  assert.match(out, /Where-Object \{ \$_\.Enabled -eq \$true \} &gt; users\.txt/);
  assert.doesNotMatch(out, /tok-/);
});

test('text and unlabelled fences render as plain code', () => {
  assert.match(md('```text\nC:\\> ipconfig /all <adapter>\n```'), /<code class="lang-text">C:\\&gt; ipconfig \/all &lt;adapter&gt;/);
  assert.match(md('```\nplain\n```'), /<code class="lang-text">plain/);
});

test('ios fences keep prompt and state highlighting', () => {
  const out = md('```ios\nR1# show ip interface brief\nGi0/0/0  10.0.0.1  YES manual up  up\n```');
  assert.match(out, /<span class="tok-prompt">R1#<\/span>/);
  assert.match(out, /<span class="tok-up">up<\/span>/);
});
