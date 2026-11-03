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
			name: string;
			branch: string;
			price: string;
			prices: { quantity: number; price: string }[];
			uom: string;
			answers: Record<string, string>;
		}[];
	} = $props();
	const quantities = $derived(
		[...new Set(responses.flatMap((r) => r.prices.map((p) => p.quantity)))].sort((a, b) => a - b)
	);
	const legacy = $derived(responses.some((r) => !r.prices.length));
	const classes = $derived(theme.resolve('responseList', variants, className));
</script>

<Div {theme} {...restProps} class={`${classes} overflow-x-auto`}>
	{#if responses.length}<Table class="w-full text-sm"
			><Thead
				><Tr
					><Th scope="col">Name</Th><Th scope="col">Branch</Th>{#each quantities as quantity}<Th
							scope="col">Price ({quantity.toLocaleString('en-US')})</Th
						>{/each}{#if legacy}<Th scope="col">Price (USD)</Th>{/if}<Th scope="col">UOM</Th><Th
						scope="col">Notes</Th
					><Th scope="col">Additional answers</Th></Tr
				></Thead
			><Tbody
				>{#each responses as response}<Tr
						><Td>{response.name}</Td><Td>{response.branch}</Td>{#each quantities as quantity}<Td
								>{response.prices.find((p) => p.quantity === quantity)?.price ?? '-'}</Td
							>{/each}{#if legacy}<Td>{response.prices.length ? '-' : response.price}</Td>{/if}<Td
							>{response.uom}</Td
						><Td>{response.answers.notes || '-'}</Td><Td
							>{#each Object.entries(response.answers) as [label, answer]}{#if label !== 'notes' && answer}<P
										>{label}: {answer}</P
									>{/if}{/each}</Td
						></Tr
					>{/each}</Tbody
			></Table
		>{:else}<P>No responses yet.</P>{/if}</Div
>
