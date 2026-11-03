<script lang="ts">
	import QuestionsAnswers from '#lib/components/QuestionsAnswers.svelte';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>

<svelte:head><title>Questions & Answers</title></svelte:head><QuestionsAnswers
	questions={data.questions}
	message={form?.message}
	creator
/>
