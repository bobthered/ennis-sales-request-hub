<script lang="ts">
	import { A, Div, H1, Tabs, P } from 'sveltewind/components';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { LayoutProps } from './$types';
	let { data, params, children }: LayoutProps = $props();
</script>

<Div class="mx-auto w-full max-w-3xl space-y-7">
	<Div class="space-y-3"
		><P class="text-sm font-semibold tracking-widest uppercase">You're invited to respond</P><H1
			>{data.request.title}</H1
		><P>{data.request.description}</P></Div
	>
	<Tabs
		aria-label="Recipient sections"
		tabs={[
			{ title: 'Your response', value: `/r/${params.token}` },
			{ title: 'Questions & Answers', value: `/r/${params.token}/questions` }
		]}
		bind:value={
			() => page.url.pathname,
			(value) => {
				void goto(value);
			}
		}
	/>
	{@render children()}
</Div>
