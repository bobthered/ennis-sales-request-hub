<script lang="ts">
	import { A, Button, Card, Div, H2, P } from 'sveltewind/components';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
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
	><H2>Share this request</H2><P>Recipient links and responses are not connected yet</P></Card
>
<Card class="space-y-3 bg-white p-6"
	><H2>Shared attachments</H2>
	{#each data.request.attachments as file (file.key)}<Div
			><A href={`/api/requests/${data.request.id}/files/${file.key}`} download>{file.name}</A></Div
		>{:else}<P>No files attached</P>{/each}
</Card>
<Div class="flex flex-wrap gap-3"
	><Button disabled>Close request</Button><Button disabled variants={['danger']}
		>Delete request</Button
	></Div
>
