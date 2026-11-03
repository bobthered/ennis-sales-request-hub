<script lang="ts">
	import { A, Div, H1, P, Table, Thead, Tbody, Tr, Th, Td } from 'sveltewind/components';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	const quantities = $derived(
		[...new Set(data.responses.flatMap((r) => r.prices.map((p) => p.quantity)))].sort(
			(a, b) => a - b
		)
	);
	const legacy = $derived(data.responses.some((r) => !r.prices.length));
</script>

<svelte:head><title>My Responses ? Ennis</title></svelte:head><H1>My Responses</H1><P
	>Responses submitted in this browser. Open a request to review or edit your response.</P
>
{#if data.responses.length}<Div class="overflow-x-auto"
		><Table class="w-full text-sm"
			><Thead
				><Tr
					><Th>Request</Th><Th>Branch</Th>{#each quantities as quantity}<Th
							>Price ({quantity.toLocaleString('en-US')})</Th
						>{/each}{#if legacy}<Th>Price (USD)</Th>{/if}<Th>UOM</Th><Th>Status</Th><Th>Action</Th
					></Tr
				></Thead
			><Tbody
				>{#each data.responses as row}<Tr
						><Td>{row.title}</Td><Td>{row.branch}</Td>{#each quantities as quantity}<Td
								>{row.prices.find((p) => p.quantity === quantity)?.price ?? '-'}</Td
							>{/each}{#if legacy}<Td>{row.prices.length ? '-' : row.price}</Td>{/if}<Td
							>{row.uom}</Td
						><Td>{row.status}</Td><Td
							>{#if row.href}<A href={row.href}>View / edit response</A>{:else}<P
									>Link unavailable</P
								>{/if}</Td
						></Tr
					>{/each}</Tbody
			></Table
		></Div
	>{:else}<P>No responses yet. Responses you submit through a request link will appear here.</P
	>{/if}
