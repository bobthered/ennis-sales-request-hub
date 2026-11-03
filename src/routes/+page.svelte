<script lang="ts">
	import { A, Button, Card, Div, Form, H1, H2, P } from 'sveltewind/components';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	const open = $derived(data.requests.filter((r) => r.status === 'open'));
	const drafts = $derived(data.requests.filter((r) => r.status === 'draft'));
</script>

<svelte:head></svelte:head>
<Div class="flex flex-wrap items-center justify-between gap-4"
	><Div><H1>Your sales requests</H1><P>Pick up a draft or review an open request.</P></Div><Form
		method="POST"
		action="/requests/new"><Button type="submit">New Request</Button></Form
	></Div
>
<Div class="grid gap-4 sm:grid-cols-3"
	>{#each [{ label: 'Open requests', count: open.length }, { label: 'Drafts', count: drafts.length }, { label: 'Total requests', count: data.requests.length }] as stat}<Card
			class="space-y-2 p-5"
			><P>{stat.label}</P><P class="text-3xl font-semibold">{stat.count}</P></Card
		>{/each}</Div
>
{#each [{ title: 'Open requests', requests: open }, { title: 'Continue a draft', requests: drafts }] as section}<Div
		class="space-y-4"
		><H2>{section.title}</H2>{#each section.requests as request}<Card
				class="flex flex-wrap items-center justify-between gap-4 p-5"
				><P class="font-semibold">{request.title}</P><A
					href={`/requests/${request.id}${request.status === 'draft' ? '/edit' : ''}`}
					variants={['button.base', 'button.variant.ghost']}
					>{request.status === 'draft' ? 'Continue editing' : 'View request'}</A
				></Card
			>{:else}<P
				>{section.title === 'Open requests' ? 'No open requests yet.' : 'No drafts to finish.'}</P
			>{/each}</Div
	>{/each}
<A href="/requests">View all requests</A>
