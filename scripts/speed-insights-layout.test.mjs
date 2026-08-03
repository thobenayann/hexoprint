import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const layoutSource = fs.readFileSync('src/app/layout.tsx', 'utf8');

test('mounts Speed Insights alongside Vercel Analytics in the root layout', () => {
    assert.match(
        layoutSource,
        /import\s*\{\s*SpeedInsights\s*\}\s*from\s*['"]@vercel\/speed-insights\/next['"]/
    );
    assert.match(
        layoutSource,
        /<Analytics\s*\/>(?:\s|\n)*<SpeedInsights\s*\/>/
    );
});
