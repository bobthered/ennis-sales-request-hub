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
		Label,
		P,
		Table,
		Thead,
		Tbody,
		Tr,
		Th,
		Td,
		Textarea
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
	<Div class="overflow-x-auto"
		><Table class="w-full text-sm"
			><Thead
				><Tr
					><Th scope="col">Asked by</Th><Th scope="col">Question</Th><Th scope="col">Answer</Th></Tr
				></Thead
			><Tbody>
				{#each questions as question}<Tr
						><Td>{question.askedBy}</Td><Td class="whitespace-pre-wrap">{question.question}</Td><Td
							>{#if creator}<Form method="POST" class="space-y-2"
									><Input type="hidden" name="id" value={question.id} /><Label
										for={`answer-${question.id}`}>Your answer</Label
									><Textarea
										id={`answer-${question.id}`}
										name="answer"
										value={question.answer}
										required
										maxlength={10000}
									/><Button type="submit">Save answer</Button></Form
								>{:else}<P class="whitespace-pre-wrap">{question.answer || 'Awaiting an answer'}</P
								>{/if}</Td
						></Tr
					>{:else}<Tr><Td colspan={3}>No questions yet.</Td></Tr>{/each}
			</Tbody></Table
		></Div
	></Card
>
