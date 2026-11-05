import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect, test } from 'vitest';
import type { SvApi } from '../../../core/config.ts';
import packageJsonTask from './tasks/package-json.ts';

test('package-json: clears the stale .svelte-kit directory', async () => {
	const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'sv-package-json-'));
	fs.writeFileSync(path.join(cwd, 'package.json'), '{}');
	fs.mkdirSync(path.join(cwd, '.svelte-kit', 'types'), { recursive: true });
	fs.writeFileSync(path.join(cwd, '.svelte-kit', 'tsconfig.json'), '{}');

	const sv = { devDependency() {} } as unknown as SvApi;

	try {
		await packageJsonTask.run({ cwd, sv, dependencyVersion: () => undefined } as never);
		expect(fs.existsSync(path.join(cwd, '.svelte-kit'))).toBe(false);
	} finally {
		fs.rmSync(cwd, { recursive: true, force: true });
	}
});
