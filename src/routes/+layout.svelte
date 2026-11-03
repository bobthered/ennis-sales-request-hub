<script lang="ts">
	import './layout.css';
	import '#lib/theme.js';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { subtleReveal } from 'sveltewind/transitions';
	import EnnisLogo, { ennisFavicon } from '#lib/components/EnnisLogo.svelte';
	import { Settings, Menu } from '@lucide/svelte';
	import {
		A,
		Button,
		Div,
		Drawer,
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

	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let menuOpen = $state(false);
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
	<link rel="icon" href={ennisFavicon} />
</svelte:head>

<Header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
	<Div class="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
		<A href="/" class="flex min-w-0 items-center gap-2 no-underline"
			><EnnisLogo width={108} height={44} class="rounded bg-white" /><Span
				class="text-sm font-semibold sm:text-base">Sales Request Hub</Span
			></A
		>
		<Div class="flex shrink-0 items-center gap-1 sm:gap-4">
			<A
				class="hidden md:inline-flex"
				href="/requests"
				variants={['button.base', 'button.variant.ghost']}>My Requests</A
			>
			<Form class="hidden md:block" method="POST" action="/requests/new"
				><Button type="submit" variants={['ghost']}>New Request</Button></Form
			>
			<Button
				class="md:hidden"
				variants={['ghost', 'icon']}
				aria-label="Open navigation"
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = true)}><Menu class="size-5" /></Button
			>
			<Popover
				transition={[subtleReveal, { duration: 160 }]}
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
<Drawer
	bind:isVisible={menuOpen}
	title="Navigation"
	position="right"
	transition={[fly, { x: 320, duration: 220 }]}
	class="w-80 max-w-[90vw]"
>
	<Div class="flex flex-col gap-3"
		><A
			href="/"
			onclick={() => (menuOpen = false)}
			variants={['button.base', 'button.variant.ghost']}>Dashboard</A
		><A
			href="/requests"
			onclick={() => (menuOpen = false)}
			variants={['button.base', 'button.variant.ghost']}>My Requests</A
		><Form method="POST" action="/requests/new" onsubmit={() => (menuOpen = false)}
			><Button type="submit" class="w-full" variants={['ghost']}>New Request</Button></Form
		></Div
	>
</Drawer>
<Main id="main" class="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:py-14">
	{@render children()}
</Main>
