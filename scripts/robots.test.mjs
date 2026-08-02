import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const robotsSource = fs.readFileSync('src/app/robots.ts', 'utf8');
const compiledRobots = ts.transpileModule(robotsSource, {
    compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2017,
    },
}).outputText;

function getRobots(environment) {
    const previousEnvironment = { ...process.env };
    for (const key of ['NODE_ENV', 'VERCEL_ENV']) delete process.env[key];
    Object.assign(process.env, environment);

    try {
        const testModule = { exports: {} };
        vm.runInNewContext(compiledRobots, {
            module: testModule,
            exports: testModule.exports,
            process,
            require: (specifier) => {
                if (specifier === '@/lib/company-info') {
                    return {
                        COMPANY_INFO: { siteUrl: 'https://www.hexoprint.fr' },
                    };
                }
                throw new Error(`Unexpected module: ${specifier}`);
            },
        });
        return testModule.exports.default();
    } finally {
        for (const key of Object.keys(process.env)) delete process.env[key];
        Object.assign(process.env, previousEnvironment);
    }
}

function fromRobotsModule(value) {
    return JSON.parse(JSON.stringify(value));
}

test('allows production indexing only for Vercel production or local production', () => {
    assert.ok(Array.isArray(getRobots({ NODE_ENV: 'production' }).rules));
    assert.ok(
        Array.isArray(
            getRobots({ NODE_ENV: 'development', VERCEL_ENV: 'production' })
                .rules
        )
    );

    for (const environment of [
        { NODE_ENV: 'production', VERCEL_ENV: 'preview' },
        { NODE_ENV: 'development', VERCEL_ENV: 'development' },
        { NODE_ENV: 'development' },
    ]) {
        assert.deepEqual(fromRobotsModule(getRobots(environment).rules), {
            userAgent: '*',
            disallow: '/',
        });
    }
});

test('applies protected paths to every explicit search bot', () => {
    const rules = getRobots({
        NODE_ENV: 'production',
        VERCEL_ENV: 'production',
    }).rules;
    assert.ok(Array.isArray(rules));

    const blockedPaths = ['/api/', '/studio/', '/_vercel/', '/admin/'];
    for (const userAgent of [
        'Googlebot',
        'Bingbot',
        'OAI-SearchBot',
        'ChatGPT-User',
        'PerplexityBot',
    ]) {
        assert.deepEqual(
            fromRobotsModule(
                rules.find((rule) => rule.userAgent === userAgent)
            ),
            { userAgent, allow: '/', disallow: blockedPaths }
        );
    }
});
