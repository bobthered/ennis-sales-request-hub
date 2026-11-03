<script lang="ts">
	import { A, Div, H1, P } from 'sveltewind/components';
</script>

<svelte:head
	><title>Ennis Sales Request Hub</title><meta
		name="description"
		content="One place for project requests, branch responses, and shared answers."
	/></svelte:head
>
<Div class="max-w-3xl space-y-6">
	<P class="text-sm font-semibold tracking-widest text-primary-700 uppercase dark:text-primary-300"
		>Less email. Clearer answers.</P
	>
	<H1>One request. Everyone on the same page.</H1>
	<P class="text-lg"
		>Share project details, collect branch responses, and answer questions in one place.</P
	>
	<Div class="flex flex-wrap gap-3"
		><A href="/requests/new" variants={['button.base']}>New Request</A><A
			href="/requests"
			variants={['button.base', 'button.variant.ghost']}>My Requests</A
		></Div
	>
</Div>
