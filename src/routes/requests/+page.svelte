<script lang="ts">
	import { A, Badge, Card, Div, H1, H2, P } from 'sveltewind/components';
</script>

<svelte:head><title>My requests · Ennis</title></svelte:head>
<Div class="flex flex-wrap items-start justify-between gap-5"
	><Div class="space-y-2"
		><H1>My requests</H1><P>Your project details and branch responses, together.</P></Div
	><A href="/requests/new" variants={['button.base']}>Create a request</A></Div
>
<Card class="space-y-4 bg-white p-6"
	><Badge variants={['info']}>Sample request</Badge><H2>Regional print project pricing</H2><P
		>Collect branch capabilities, estimated pricing, and lead times.</P
	><A href="/requests/demo">Open request →</A></Card
>
