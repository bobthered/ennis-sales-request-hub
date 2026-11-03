<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button, Card, Form, Input, H2, Label, P, Textarea } from 'sveltewind/components';
	import { theme as globalTheme } from 'sveltewind/theme';
	type Props = ComponentProps<typeof Card> & {
		creator?: boolean;
		questions: { id: string; askedBy: string; question: string; answer: string }[];
		message?: string;
	};
	let {
		creator = false,
		questions,
		message = '',
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
	{#if message}<P role="alert">{message}</P>{/if}
	{#each questions as question}<Card class="space-y-3 p-4"
			><P>{question.askedBy}: {question.question}</P>{#if question.answer}<P
					>Answer: {question.answer}</P
				>{:else}<P>Awaiting an answer</P>{/if}{#if creator}<Form method="POST" class="space-y-2"
					><Input type="hidden" name="id" value={question.id} /><Label for={`answer-${question.id}`}
						>Your answer</Label
					><Textarea
						id={`answer-${question.id}`}
						name="answer"
						value={question.answer}
						required
						maxlength={10000}
					/><Button type="submit">Save answer</Button></Form
				>{/if}</Card
		>{:else}<P>No questions yet.</P>{/each}
	{#if !creator}<Form method="POST" class="space-y-3"
			><Label for="ask-name">Your name</Label><Input
				id="ask-name"
				name="name"
				required
				maxlength={200}
			/><Label for="question">Your question</Label><Textarea
				id="question"
				name="question"
				required
				maxlength={5000}
			/><Button type="submit">Ask a question</Button></Form
		>{/if}
</Card>
