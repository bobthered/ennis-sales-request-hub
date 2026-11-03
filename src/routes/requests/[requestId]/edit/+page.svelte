<script lang="ts">
	import RequestEditor from '#lib/components/RequestEditor.svelte';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>

<svelte:head><title>Edit request</title></svelte:head>
{#key data.request.id}<RequestEditor request={data.request} errorMessage={form?.message} />{/key}
