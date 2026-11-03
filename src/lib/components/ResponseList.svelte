<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { theme as globalTheme } from 'sveltewind/theme';
	import { Card, Div, H2, P } from 'sveltewind/components';
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

<Div {theme} {...restProps} class={classes}>
	{#each responses as response}<Card class="space-y-3 p-5"
			><H2>{response.name} / {response.branch}</H2><P>USD {response.price} / {response.uom}</P
			>{#each Object.entries(response.answers) as [label, answer]}{#if answer}<P
						><strong>{label === 'notes' ? 'Notes' : label}:</strong> {answer}</P
					>{/if}{/each}</Card
		>{:else}<P>No responses yet.</P>{/each}
</Div>
