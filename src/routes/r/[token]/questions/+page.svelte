<script lang="ts">
	import QuestionsAnswers from '#lib/components/QuestionsAnswers.svelte';
	import type { PageProps } from './$types';
	let { data, params }: PageProps = $props();
</script>

<svelte:head><title>Questions & Answers</title></svelte:head><QuestionsAnswers
	questions={data.questions}
	askHref={`/r/${params.token}/questions/new`}
/>
