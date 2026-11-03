<script lang="ts">
	import './layout.css';
	import '#lib/theme.js';
	import { onMount } from 'svelte';
	import { Settings } from '@lucide/svelte';
	import {
		A,
		Button,
		Div,
		Form,
		Header,
		Label,
		Main,
		Option,
		P,
		Popover,
		Select,
		Span
	} from 'sveltewind/components';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let preference = $state('os');
	onMount(() => {
		const sync = () => {
			preference = document.documentElement.dataset.themePreference ?? 'os';
		};
		sync();
		window.addEventListener('ennis-theme-applied', sync);
		return () => window.removeEventListener('ennis-theme-applied', sync);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
	<Div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
		<A href="/" class="text-xl font-bold text-slate-950 no-underline dark:text-slate-50"
			>ennis <Span class="font-normal text-slate-500 dark:text-slate-400">/ Sales Request Hub</Span
			></A
		>
		<Div class="flex items-center gap-4">
			<A href="/requests" variants={['button.base', 'button.variant.ghost']}>My Requests</A>
			<Form method="POST" action="/requests/new"
				><Button type="submit" variants={['ghost']}>New Request</Button></Form
			>
			<Popover
				role="dialog"
				aria-label="Appearance settings"
				class="w-56 space-y-3"
				placement="bottom"
			>
				{#snippet trigger(props)}
					<Button {...props} aria-label="Settings" title="Settings" variants={['ghost', 'icon']}
						><Settings aria-hidden="true" class="size-5" /></Button
					>
				{/snippet}
				<Label for="theme-preference">Appearance</Label>
				<Select
					id="theme-preference"
					class="w-full"
					value={preference}
					onchange={(event) =>
						window.dispatchEvent(
							new CustomEvent('ennis-theme-preference', { detail: event.currentTarget.value })
						)}
				>
					<Option value="dark">Dark</Option><Option value="light">Light</Option><Option value="os"
						>OS</Option
					>
				</Select>
				<P class="text-sm">OS follows your device’s appearance.</P>
			</Popover>
		</Div>
	</Div>
</Header>
<Div
	class="border-b border-amber-200 bg-amber-50 px-6 py-3 dark:border-amber-900 dark:bg-amber-950"
>
	<P class="mx-auto max-w-6xl text-sm text-amber-950 dark:text-amber-100"
		>MVP preview · Requests and attachments save to MongoDB. Recipient responses are not connected
		yet.</P
	>
</Div>
<Main id="main" class="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:py-14">
	{@render children()}
</Main>
