import { resolve } from 'node:path';

import { createSanityWatchSupervisor } from './watch-sanity-typegen-lib.mjs';

const supervisor = createSanityWatchSupervisor({
    sanityBin: resolve('node_modules', 'sanity', 'bin', 'sanity'),
    schemaPath: resolve('schema.json'),
});

process.exitCode = await supervisor.done;
