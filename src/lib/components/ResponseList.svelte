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
			uom: string;
			answers: Record<string, string>;
		}[];
	} = $props();
	const classes = $derived(theme.resolve('responseList', variants, className));
</script>

<Div {theme} {...restProps} class={`${classes} overflow-x-auto`}>
	{#if responses.length}<Table class="w-full text-sm"
			><Thead
				><Tr
					><Th scope="col">Name</Th><Th scope="col">Branch</Th><Th scope="col">Price (USD)</Th><Th
						scope="col">UOM</Th
					><Th scope="col">Answers</Th></Tr
				></Thead
			><Tbody
				>{#each responses as response}<Tr
						><Td>{response.name}</Td><Td>{response.branch}</Td><Td>{response.price}</Td><Td
							>{response.uom}</Td
						><Td
							>{#each Object.entries(response.answers) as [label, answer]}{#if answer}<P
										>{label}: {answer}</P
									>{/if}{/each}</Td
						></Tr
					>{/each}</Tbody
			></Table
		>{:else}<P>No responses yet.</P>{/if}</Div
>
