<script lang="ts">
	import NameInput from '#lib/components/NameInput.svelte';
	import { A, Button, Card, Div, Form, H2, Input, Label, P, Textarea } from 'sveltewind/components';
	import ResponseList from '#lib/components/ResponseList.svelte';
	import type { PageProps } from './$types';
	let editing = $state(false);
	let { data, params, form }: PageProps = $props();
</script>

<svelte:head></svelte:head>
{#if !data.own || editing}
	<Button
		type="submit"
		form="response-details"
		name="disposition"
		value="no-quote"
		formnovalidate
		variants={['outline']}>No quote</Button
	>{/if}
<Card class="space-y-3 bg-white p-6"
	><H2>Before you respond</H2><P
		>Responding is optional. {data.request.visibility === 'shared'
			? 'Responses will be visible to everyone with the link.'
			: 'Only the creator and you will see your response.'}</P
	><H2>Requested quantities</H2><P
		>{data.request.quantities.map((q) => q.toLocaleString('en-US')).join(', ') ||
			'Not specified'}</P
	><P>Pricing UOM: {data.request.pricingUom}</P>
	<H2>Shared attachments</H2>
	{#each data.request.attachments as file}<A href={`/r/${params.token}/files/${file.key}`} download
			>{file.name}</A
		>{:else}<P>No files attached.</P>{/each}
	{#if data.request.due}<P>Due: {data.request.due}</P>{/if}
</Card>
<Card class="space-y-5 bg-white p-6"
	><H2>Your response</H2>
	{#if form?.success}<P role="status">Response saved.</P>{/if}
	{#if form?.message}<P role="alert">{form.message}</P>{/if}
	{#if data.own && !editing}<Button type="button" onclick={() => (editing = true)}
			>Edit response</Button
		>{:else}
		<Form id="response-details" method="POST" class="space-y-5"
			><Input type="hidden" name="operation" value={data.own ? 'edit' : 'create'} />
			<Div class="space-y-2"
				><Label for="name">Your name</Label><NameInput
					id="name"
					name="name"
					value={data.own?.name ?? ''}
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
					value={data.own?.branch ?? ''}
					required
					maxlength={200}
					class="w-full"
				/></Div
			>
			{#if data.request.quantities.length}{#each data.request.quantities as quantity}<Div
						class="space-y-2"
						><Label for={`price-${quantity}`}
							>Price ({quantity.toLocaleString('en-US')}) ? USD / {data.request.pricingUom}</Label
						><Input
							id={`price-${quantity}`}
							name={`price-${quantity}`}
							type="number"
							min="0"
							step="0.01"
							required
							value={data.own?.prices.find((p) => p.quantity === quantity)?.price ?? ''}
							class="w-full"
						/></Div
					>{/each}{:else}
				<Div class="space-y-2"
					><Label for="price">Pricing (USD / {data.request.pricingUom})</Label><Input
						id="price"
						name="price"
						value={data.own?.price ?? ''}
						required
						type="number"
						min="0"
						step="0.01"
						class="w-full"
					/></Div
				>{/if}

			{#each data.request.questions as question, i}<Div class="space-y-2"
					><Label for={`question-${i}`}>{question}</Label><Textarea
						id={`question-${i}`}
						name={`question-${i}`}
						value={data.own?.questionAnswers.find((q) => q.label === question)?.answer ?? ''}
						maxlength={20000}
						class="w-full"
					/></Div
				>{/each}
			<Div class="space-y-2"
				><Label for="notes">Notes</Label><Textarea
					id="notes"
					name="notes"
					value={data.own?.answers.notes ?? ''}
					rows={4}
					class="w-full"
				/></Div
			>
			<Button type="submit">{data.own ? 'Save changes' : 'Submit response'}</Button></Form
		>
	{/if}</Card
>
<H2>{data.request.visibility === 'shared' ? 'Responses' : 'Your saved response'}</H2><ResponseList
	responses={data.responses}
/>
