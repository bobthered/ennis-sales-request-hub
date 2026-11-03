import { theme } from 'sveltewind/theme';
import { classic } from 'sveltewind/themes';

// Static app-wide configuration only. Never store user state in this singleton.
const monochrome = structuredClone(classic);
// Convert the shared palette classes to neutral tones, including semantic variants.
function neutralize(value: unknown): unknown {
	if (typeof value === 'string')
		return value
			.replace(/primary-contrast-\d+/g, 'neutral-50')
			.replace(/primary-(\d+)/g, 'neutral-$1')
			.replace(/(?:slate|gray|blue|indigo|rose|red|green|amber|emerald)-(\d+)/g, 'neutral-$1')
			.replace(/dark:(border|inset-ring|ring)-neutral-\d+(?:\/\d+)?/g, 'dark:$1-neutral-800')
			.replace(/(?<![\w:-])(border|inset-ring|ring)-neutral-\d+(?:\/\d+)?/g, '$1-neutral-200');
	if (Array.isArray(value)) return value.map(neutralize);
	if (value && typeof value === 'object')
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, neutralize(v)]));
	return value;
}
theme.set.theme(neutralize(monochrome) as typeof classic);
theme.update.base(
	'button',
	'min-h-9 px-3 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 hover:text-white focus:text-white dark:hover:text-neutral-950 dark:focus:text-neutral-950'
);
theme.update.base('input', 'min-h-9 text-sm');
theme.update.base('select', 'min-h-9 text-sm');
theme.update.base('h1', 'text-3xl font-semibold tracking-tight sm:text-4xl');
theme.update.base('h2', 'text-xl font-semibold tracking-tight');
theme.update.base('card', 'bg-white dark:bg-neutral-900');
theme.set.component('requestEditor', { base: 'space-y-5 bg-white p-6 sm:p-8' });
theme.set.component('questionsAnswers', { base: 'space-y-5 bg-white p-6 sm:p-8' });

theme.set.component('responseList', { base: 'space-y-4' });

// Keep each button variant's label color stable across interaction states.
theme.update.variant(
	'button',
	'outline',
	'inset-ring-neutral-200 dark:inset-ring-neutral-800 text-neutral-950 hover:text-neutral-950 focus:text-neutral-950 dark:text-neutral-50 dark:hover:text-neutral-50 dark:focus:text-neutral-50'
);
theme.set.variant(
	'button',
	'danger',
	'bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 hover:text-white focus:text-white dark:bg-red-600 dark:text-white dark:hover:bg-red-700 dark:focus:bg-red-700 dark:hover:text-white dark:focus:text-white'
);
