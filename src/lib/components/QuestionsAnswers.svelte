<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button, Card, H2, Label, P, Textarea } from 'sveltewind/components';
	import { theme as globalTheme } from 'sveltewind/theme';
	type Props = ComponentProps<typeof Card> & { creator?: boolean };
	let {
		creator = false,
		class: className = '',
		theme = globalTheme,
		variants = [],
		...restProps
	}: Props = $props();
	const classes = $derived(theme.resolve('questionsAnswers', variants, className));
</script>

<Card {theme} {...restProps} class={classes}>
	<H2>Questions & Answers</H2>
	<P>Questions and the request creator's answers are visible to everyone with the request link.</P>
	<P>No questions yet.</P>
	{#if creator}
		<P>When recipients ask questions, you can answer them here once for everyone.</P>
	{:else}
		<Label for="question">Have a question about this project?</Label><Textarea
			id="question"
			name="question"
			rows={3}
			class="w-full"
		/>
		<P class="text-sm">Posting questions is not connected yet.</P><Button disabled
			>Ask a question</Button
		>
	{/if}
</Card>
