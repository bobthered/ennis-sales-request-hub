<script lang="ts">
	import { A, Button, Card, Div, Form, Input, Label, H2, P } from 'sveltewind/components';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>

<svelte:head><title>Request overview</title></svelte:head>
<Card class="space-y-4 bg-white p-6">
	<H2>Project details</H2><P>{data.request.description || 'No project details yet'}</P>
	<P>Status: {data.request.status}</P>
	<P
		>{data.request.visibility === 'shared'
			? 'Responses visible to everyone with the request link'
			: 'Responses visible to you and each response owner'}</P
	>
	<P>{data.request.due ? `Due date: ${data.request.due}` : 'No due date set'}</P>
	{#if data.request.questions}<P class="whitespace-pre-line">{data.request.questions}</P>{/if}
</Card>
<Card class="space-y-4 bg-white p-6"
	><H2>Share this request</H2><P
		>Share project details and attachments by email. Recipients can submit pricing and answers using
		the link.</P
	>
	{#if form?.shareUrl || data.shareUrl}
		<Label for="share-link">Recipient link</Label><Input
			id="share-link"
			readonly
			value={form?.shareUrl || data.shareUrl}
			class="w-full"
			onclick={(event) => event.currentTarget.select()}
		/>
		<A href={form?.shareUrl || data.shareUrl}>Open recipient view</A>
		<P>Select and copy this link into your email.</P>
	{/if}
	{#if form?.message}<P role="alert">{form.message}</P>{/if}
	<Form method="POST" action="?/share"
		><Button type="submit" disabled={data.request.status !== 'open'}>Get share link</Button></Form
	>
	<P class="text-sm">This link stays available here. Save your request first to enable sharing.</P
	></Card
>
<Card class="space-y-3 bg-white p-6"
	><H2>Shared attachments</H2>
	{#each data.request.attachments as file (file.key)}<Div
			><A href={`/api/requests/${data.request.id}/files/${file.key}`} download>{file.name}</A></Div
		>{:else}<P>No files attached</P>{/each}
</Card>
<Form
	method="POST"
	action="?/delete"
	onsubmit={(event) => {
		if (!confirm('Delete this request and all its attachments? This cannot be undone.'))
			event.preventDefault();
	}}
>
	<Button type="submit" variants={['danger']}>Delete request</Button></Form
>
