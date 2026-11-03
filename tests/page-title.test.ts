import { expect, it } from 'vitest';
import { pageTitle } from '../src/lib/page-title.js';
it('builds reversed titles without exposing identifiers', () => {
	expect(pageTitle('/requests/abc123/edit', { requestId: 'abc123' }, 'Print job')).toBe(
		'Edit | Print job | Requests | Ennis - Sales Request Hub'
	);
	expect(
		pageTitle('/r/' + 'a'.repeat(64) + '/questions', { token: 'a'.repeat(64) }, 'Print job')
	).toBe('Questions | Print job | Ennis - Sales Request Hub');
	expect(pageTitle('/requests/' + 'a'.repeat(24), {})).toBe('Requests | Ennis - Sales Request Hub');
	expect(pageTitle('/', {})).toBe('Ennis - Sales Request Hub');
});
