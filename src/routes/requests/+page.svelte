<script lang="ts">
	import { A, Button, Card, Div, Form, H1, H2, P } from 'sveltewind/components';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head><title>My Requests</title></svelte:head>
<Div class="flex flex-wrap items-start justify-between gap-5">
	<Div class="space-y-2"><H1>My Requests</H1><P>Requests created in this browser</P></Div>
	<Form method="POST" action="/requests/new"><Button type="submit">Create a request</Button></Form>
</Div>
{#each data.requests as request (request.id)}
	<Card class="space-y-3 bg-white p-6"
		><H2>{request.title}</H2><P
			>{request.status === 'draft' ? 'Draft' : request.status === 'open' ? 'Open' : 'Closed'}</P
		><A href={`/requests/${request.id}/edit`}>Edit request</A></Card
	>
{:else}
	<Card class="space-y-4 bg-white p-6"
		><H2>No requests yet</H2><P>Create a request to get started</P></Card
	>
{/each}
