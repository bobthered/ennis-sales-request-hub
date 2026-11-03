import { theme } from 'sveltewind/theme';
import { classic } from 'sveltewind/themes';

// Static app-wide configuration only. Never store user state in this singleton.
theme.set.theme(structuredClone(classic));
theme.update.base('button', 'min-h-11 font-semibold');
theme.update.base('input', 'min-h-11');
theme.update.base('select', 'min-h-11');
theme.update.base('h1', 'text-3xl font-semibold tracking-tight sm:text-4xl');
theme.update.base('h2', 'text-xl font-semibold tracking-tight');
theme.update.base('card', 'dark:bg-slate-900');
theme.set.component('requestEditor', { base: 'space-y-5 bg-white p-6 sm:p-8' });
theme.set.component('questionsAnswers', { base: 'space-y-5 bg-white p-6 sm:p-8' });
