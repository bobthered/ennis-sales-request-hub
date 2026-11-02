<script lang="ts">
	import { A, Card, Div, H1, H2, P } from 'sveltewind/components';
</script>

<svelte:head
	><title>Ennis Sales Request Hub</title><meta
		name="description"
		content="One place for project requests, branch responses, and shared answers."
	/></svelte:head
>
<Div class="max-w-3xl space-y-6">
	<P class="text-sm font-semibold tracking-widest text-primary-700 uppercase"
		>Less email. Clearer answers.</P
	>
	<H1>One request. Everyone on the same page.</H1>
	<P class="text-lg"
		>Share project details, collect branch responses, and answer questions in one place.</P
	>
	<Div class="flex flex-wrap gap-3"
		><A href="/requests" variants={['button.base']}>Explore my requests</A><A
			href="/r/demo"
			variants={['button.base', 'button.variant.outline']}>Preview recipient experience</A
		></Div
	>
</Div>
<Div class="grid gap-5 md:grid-cols-3">
	{#each [{ title: 'Create', text: 'Add project details, questions, a due date, and shared files.' }, { title: 'Share', text: 'Copy the request link into an email. Recipients do not need an account.' }, { title: 'Review', text: 'Find responses and shared clarifications together, without the email chain.' }] as step}
		<Card class="space-y-3 bg-white p-6"><H2>{step.title}</H2><P>{step.text}</P></Card>
	{/each}
</Div>
