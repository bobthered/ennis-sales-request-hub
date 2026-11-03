<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { theme as globalTheme } from 'sveltewind/theme';
	import { Div, Table, Thead, Tbody, Tr, Th, Td, P } from 'sveltewind/components';
	let {
		responses,
		class: className = '',
		theme = globalTheme,
		variants = [],
		...restProps
	}: ComponentProps<typeof Div> & {
		responses: {
			disposition: string;
			name: string;
			branch: string;
			price: string;
			prices: { quantity: number; price: string }[];
			uom: string;
			answers: Record<string, string>;
			questionAnswers: { label: string; answer: string }[];
		}[];
	} = $props();
	const quantities = $derived(
		[...new Set(responses.flatMap((r) => r.prices.map((p) => p.quantity)))].sort((a, b) => a - b)
	);
	const legacy = $derived(responses.some((r) => r.disposition !== 'no-quote' && !r.prices.length));
	const questionLabels = $derived([
		...new Set(responses.flatMap((r) => r.questionAnswers.map((q) => q.label)))
	]);
	const classes = $derived(theme.resolve('responseList', variants, className));
</script>

<Div
	{theme}
	{...restProps}
	class={`${classes} max-w-full min-w-0 overflow-x-auto`}
	tabindex={0}
	role="region"
	aria-label="Responses table"
>
	{#if responses.length}<Table class="w-max min-w-full text-sm"
			><Thead
				><Tr
					><Th scope="col">Name</Th><Th scope="col">Branch</Th><Th scope="col">Response</Th
					>{#each quantities as quantity}<Th scope="col"
							>Price ({quantity.toLocaleString('en-US')})</Th
						>{/each}{#if legacy}<Th scope="col">Price (USD)</Th>{/if}<Th scope="col">UOM</Th><Th
						scope="col">Notes</Th
					>{#each questionLabels as label}<Th
							scope="col"
							class="max-w-xs min-w-48 break-words whitespace-normal">{label}</Th
						>{/each}</Tr
				></Thead
			><Tbody
				>{#each responses as response}<Tr
						><Td>{response.name}</Td><Td>{response.branch}</Td><Td
							>{response.disposition === 'no-quote' ? 'No quote' : 'Quoted'}</Td
						>{#each quantities as quantity}<Td
								>{response.prices.find((p) => p.quantity === quantity)?.price ?? '-'}</Td
							>{/each}{#if legacy}<Td>{response.prices.length ? '-' : response.price}</Td>{/if}<Td
							>{response.uom}</Td
						><Td class="max-w-xs min-w-48 break-words whitespace-pre-wrap"
							>{response.answers.notes || '-'}</Td
						>{#each questionLabels as label}<Td
								class="max-w-xs min-w-48 break-words whitespace-pre-wrap"
								>{response.questionAnswers.find((q) => q.label === label)?.answer || '-'}</Td
							>{/each}</Tr
					>{/each}</Tbody
			></Table
		>{:else}<P>No responses yet.</P>{/if}</Div
>
