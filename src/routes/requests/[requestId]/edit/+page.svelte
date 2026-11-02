<script lang="ts">
	import RequestEditor from '#lib/components/RequestEditor.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head><title>Edit request · Ennis</title></svelte:head>
<RequestEditor initialTitle={data.request.title} initialDescription={data.request.description} />
