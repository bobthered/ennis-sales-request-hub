<script lang="ts">
	import './layout.css';
	import '#lib/theme.js';
	import { A, Div, Header, Main, P, Span } from 'sveltewind/components';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header class="border-b border-slate-200 bg-white">
	<Div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
		<A href="/" class="text-xl font-bold text-slate-950 no-underline"
			>ennis <Span class="font-normal text-slate-500">/ Sales Request Hub</Span></A
		>
		<A href="/requests">My requests</A>
	</Div>
</Header>
<Div class="border-b border-amber-200 bg-amber-50 px-6 py-3">
	<P class="mx-auto max-w-6xl text-sm text-amber-950"
		>App preview · Sample data only. Sign-in, saving, and uploads are not connected yet.</P
	>
</Div>
<Main id="main" class="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:py-14">
	{@render children()}
</Main>
