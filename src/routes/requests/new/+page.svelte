<script lang="ts">
	import { A, Div, H1, P } from 'sveltewind/components';
	import RequestEditor from '#lib/components/RequestEditor.svelte';
</script>

<svelte:head><title>Create a request · Ennis</title></svelte:head>
<Div class="mx-auto max-w-3xl space-y-6"
	><A href="/requests">← My requests</A><H1>Create a request</H1><P
		>Give your branches everything they need to respond.</P
	><RequestEditor /></Div
>
