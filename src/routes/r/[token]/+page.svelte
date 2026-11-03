<script lang="ts">
	import { A, Button, Card, Div, Form, H2, Input, Label, P, Textarea } from 'sveltewind/components';
	import ResponseList from '#lib/components/ResponseList.svelte';
	import type { PageProps } from './$types';
	let { data, params, form }: PageProps = $props();
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
</Card>
<Card class="space-y-5 bg-white p-6"
	><H2>Your response</H2>
	{#if form?.success}<P role="status"
			>Response saved. You can submit again from this browser to update it.</P
		>{/if}
	{#if form?.message}<P role="alert">{form.message}</P>{/if}
	<Form method="POST" class="space-y-5">
		<Div class="space-y-2"
			><Label for="name">Your name</Label><Input
				id="name"
				name="name"
				required
				maxlength={200}
				autocomplete="name"
				class="w-full"
			/></Div
		>
		<Div class="space-y-2"
			><Label for="branch">Branch</Label><Input
				id="branch"
				name="branch"
				required
				maxlength={200}
				class="w-full"
			/></Div
		>
		<Div class="space-y-2"
			><Label for="price">Pricing (USD / {data.request.pricingUom})</Label><Input
				id="price"
				name="price"
				required
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
		{#each data.request.questions as question, i}<Div class="space-y-2"
				><Label for={`question-${i}`}>{question}</Label><Textarea
					id={`question-${i}`}
					name={`question-${i}`}
					maxlength={20000}
					class="w-full"
				/></Div
			>{/each}
		<Button type="submit">Submit response</Button></Form
	>
</Card>
<H2>{data.request.visibility === 'shared' ? 'Responses' : 'Your saved response'}</H2><ResponseList
	responses={data.responses}
/>
