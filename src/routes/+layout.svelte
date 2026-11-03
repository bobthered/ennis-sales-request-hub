<script lang="ts">
	import './layout.css';
	import '#lib/theme.js';
	import { page } from '$app/state';
	import { pageTitle } from '#lib/page-title.js';
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
		Input,
		Main,
		Option,
		Popover,
		Select,
		Span
	} from 'sveltewind/components';

	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	const title = $derived(
		pageTitle(
			page.url.pathname,
			page.params,
			(page.data as { request?: { title?: string } }).request?.title
		)
	);
	let outsideDown = false;
	let menuOpen = $state(false);
	let yourName = $state('');
	function saveName(value: string) {
		yourName = value;
		try {
			localStorage.setItem('ennis-name', value);
		} catch {}
		window.dispatchEvent(new Event('ennis-name-changed'));
	}
	let preference = $state('os');
	onMount(() => {
		try {
			yourName = localStorage.getItem('ennis-name') || '';
		} catch {}
		const sync = () => {
			preference = document.documentElement.dataset.themePreference ?? 'os';
		};
		sync();
		window.addEventListener('ennis-theme-applied', sync);
		return () => window.removeEventListener('ennis-theme-applied', sync);
	});
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="icon" href={ennisFavicon} />
</svelte:head>

<Header class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
	<Div class="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
		<A
			href="/"
			class="flex min-w-0 items-center gap-2 text-neutral-950 no-underline hover:text-neutral-950 dark:text-neutral-50 dark:hover:text-neutral-50"
			><EnnisLogo width={108} height={44} class="shrink-0" /><Span
				class="text-sm font-semibold sm:text-base">Sales Request Hub</Span
			></A
		>
		<Div class="flex shrink-0 items-center gap-0">
			<A
				class="hidden min-h-9 px-3 py-2 text-sm md:inline-flex"
				href="/requests"
				variants={['button.base', 'button.variant.ghost']}>My Requests</A
			>
			<A
				href="/responses"
				class="hidden min-h-9 px-3 py-2 text-sm md:inline-flex"
				variants={['button.base', 'button.variant.ghost']}>My Responses</A
			>
			<Form class="hidden md:block" method="POST" action="/requests/new"
				><Button type="submit" class="text-sm" variants={['ghost']}>New Request</Button></Form
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
					<Button
						class="hidden md:inline-flex"
						{...props}
						aria-label="Settings"
						title="Settings"
						variants={['ghost', 'icon']}><Settings aria-hidden="true" class="size-5" /></Button
					>
				{/snippet}
				<Label for="your-name">Your Name</Label><Input
					id="your-name"
					value={yourName}
					maxlength={200}
					autocomplete="name"
					class="w-full"
					oninput={(event) => saveName(event.currentTarget.value)}
				/>
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
			</Popover>
		</Div>
	</Div>
</Header>
<Drawer
	bind:isVisible={menuOpen}
	title="Navigation"
	onpointerdown={(event) => {
		const r = event.currentTarget.getBoundingClientRect();
		outsideDown =
			event.clientX < r.left ||
			event.clientX > r.right ||
			event.clientY < r.top ||
			event.clientY > r.bottom;
	}}
	onclick={(event) => {
		const r = event.currentTarget.getBoundingClientRect();
		if (
			outsideDown &&
			(event.clientX < r.left ||
				event.clientX > r.right ||
				event.clientY < r.top ||
				event.clientY > r.bottom)
		)
			menuOpen = false;
		outsideDown = false;
	}}
	position="right"
	transition={[fly, { x: 320, duration: 220 }]}
	class="w-80 max-w-[90vw]"
>
	<Div class="flex flex-col gap-3"
		><A
			href="/"
			class="min-h-9 w-full justify-start px-3 py-2 text-left text-sm"
			onclick={() => (menuOpen = false)}
			variants={['button.base', 'button.variant.ghost']}>Dashboard</A
		><A
			href="/requests"
			class="min-h-9 w-full justify-start px-3 py-2 text-left text-sm"
			onclick={() => (menuOpen = false)}
			variants={['button.base', 'button.variant.ghost']}>My Requests</A
		><A
			href="/responses"
			class="min-h-9 w-full justify-start px-3 py-2 text-left text-sm"
			onclick={() => (menuOpen = false)}
			variants={['button.base', 'button.variant.ghost']}>My Responses</A
		>
		<Form method="POST" action="/requests/new" onsubmit={() => (menuOpen = false)}
			><Button
				type="submit"
				class="min-h-9 w-full justify-start px-3 py-2 text-left text-sm"
				variants={['ghost']}>New Request</Button
			></Form
		></Div
	>
	<Div class="mt-6 space-y-3 border-t border-neutral-200 pt-6 dark:border-neutral-800"
		><Label for="mobile-your-name">Your Name</Label><Input
			id="mobile-your-name"
			value={yourName}
			maxlength={200}
			autocomplete="name"
			class="w-full"
			oninput={(event) => saveName(event.currentTarget.value)}
		/>
		<Label for="mobile-appearance">Appearance</Label><Select
			id="mobile-appearance"
			class="w-full"
			value={preference}
			onchange={(event) =>
				window.dispatchEvent(
					new CustomEvent('ennis-theme-preference', { detail: event.currentTarget.value })
				)}
			><Option value="dark">Dark</Option><Option value="light">Light</Option><Option value="os"
				>OS</Option
			></Select
		></Div
	>
</Drawer>
<Main id="main" class="mx-auto w-full max-w-6xl min-w-0 space-y-8 px-6 py-10 sm:py-14">
	{@render children()}
</Main>
