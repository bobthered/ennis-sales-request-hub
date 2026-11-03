<script lang="ts">
	import { A, Button, Card, Div, H2, Input, Label, P, Textarea } from 'sveltewind/components';
	import type { PageProps } from './$types';
	let { data, params }: PageProps = $props();
</script>

<svelte:head><title>Respond to request · Ennis</title></svelte:head>
<Card class="space-y-3 bg-white p-6"
	><H2>Before you respond</H2><P
		>Responding is optional. {data.request.visibility === 'shared'
			? 'Responses will be visible to everyone with the link.'
			: 'Only the creator and you will see your response.'}</P
	><H2>Shared attachments</H2>
	{#each data.request.attachments as file}<A href={`/r/${params.token}/files/${file.key}`} download
			>{file.name}</A
		>{:else}<P>No files attached.</P>{/each}
	{#if data.request.due}<P>Due: {data.request.due}</P>{/if}
	{#each data.request.questions as question}<P>{question}</P>{/each}</Card
>
<Card class="space-y-5 bg-white p-6"
	><H2>Your response</H2>
	<Div class="space-y-2"
		><Label for="name">Your name</Label><Input
			id="name"
			name="name"
			autocomplete="name"
			class="w-full"
		/></Div
	>
	<Div class="space-y-2"
		><Label for="branch">Branch</Label><Input id="branch" name="branch" class="w-full" /></Div
	>
	<Div class="space-y-2"
		><Label for="price">Estimated pricing (USD)</Label><Input
			id="price"
			name="price"
			type="number"
			min="0"
			step="0.01"
			class="w-full"
		/></Div
	>
	<Div class="space-y-2"
		><Label for="notes">Capabilities, lead time, and notes</Label><Textarea
			id="notes"
			name="notes"
			rows={4}
			class="w-full"
		/></Div
	>
	<P class="text-sm">This is a form preview. Responses cannot be submitted yet.</P><Button disabled
		>Submit response</Button
	>
</Card>
