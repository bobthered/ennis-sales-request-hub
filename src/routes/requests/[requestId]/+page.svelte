<script lang="ts">
	import { Button, Card, Div, H2, P } from 'sveltewind/components';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head><title>Request overview · Ennis</title></svelte:head>
<Card class="space-y-4 bg-white p-6"
	><H2>Project details</H2><P>{data.request.description}</P><P
		>Response visibility: creator only. Each recipient will also be able to see their own response.</P
	><P>No due date set.</P></Card
>
<Card class="space-y-4 bg-white p-6"
	><H2>Share this request</H2><P
		>When publishing is connected, copy the recipient link into an email.</P
	><P>A recipient link will be available after the request is created.</P></Card
>
<Card class="space-y-3 bg-white p-6"><H2>Shared attachments</H2><P>No files attached.</P></Card>
<Div class="flex flex-wrap gap-3"
	><Button disabled>Close request</Button><Button disabled variants={['danger']}
		>Delete request</Button
	></Div
>
