<script lang="ts">
	import ResponseList from '#lib/components/ResponseList.svelte';
	import { H2 } from 'sveltewind/components';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head></svelte:head><H2>Responses</H2><ResponseList responses={data.responses} />
