<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import {
		A,
		Button,
		Card,
		Div,
		Form,
		Input,
		H2,
		P,
		Table,
		Thead,
		Tbody,
		Tr,
		Th,
		Td
	} from 'sveltewind/components';
	import { theme as globalTheme } from 'sveltewind/theme';
	type Props = ComponentProps<typeof Card> & {
		creator?: boolean;
		askHref?: string;
		questions: { id: string; askedBy: string; question: string; answer: string }[];
		message?: string;
	};
	let {
		creator = false,
		askHref = '',
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
	<Div class="flex items-center justify-between gap-4"
		><H2>Questions & Answers</H2>{#if !creator && askHref}<A
				href={askHref}
				variants={['button.base']}>Ask a question</A
			>{/if}</Div
	>
	<P>Questions and the request creator's answers are visible to everyone with the request link.</P>
	{#if message}<P role="alert">{message}</P>{/if}
	<Div
		class="max-w-full min-w-0 overflow-x-auto"
		tabindex={0}
		role="region"
		aria-label="Scrollable table"
		><Table class="w-max min-w-full text-sm"
			><Thead
				><Tr
					><Th scope="col">Asked by</Th><Th scope="col">Question</Th><Th scope="col">Answer</Th></Tr
				></Thead
			><Tbody>
				{#each questions as question}<Tr
						><Td>{question.askedBy}</Td><Td class="max-w-md break-words whitespace-pre-wrap"
							>{question.question}</Td
						><Td
							>{#if creator}<Form
									method="POST"
									class="flex min-w-64 flex-row flex-nowrap items-center gap-2 space-y-0"
								>
									<Input type="hidden" name="id" value={question.id} /><Input
										id={`answer-${question.id}`}
										aria-label={`Answer to: ${question.question}`}
										name="answer"
										value={question.answer}
										required
										maxlength={10000}
										class="min-w-0 flex-1"
									/><Button type="submit" class="shrink-0">Save</Button></Form
								>
							{:else}<P class="max-w-md break-words whitespace-pre-wrap"
									>{question.answer || 'Awaiting an answer'}</P
								>{/if}</Td
						></Tr
					>{:else}<Tr><Td colspan={3}>No questions yet.</Td></Tr>{/each}
			</Tbody></Table
		></Div
	></Card
>
