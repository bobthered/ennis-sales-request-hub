<script lang="ts">
	import { A, Div, H1, Tabs, P } from 'sveltewind/components';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
</script>

<Div class="space-y-3"
	><A href="/requests">← My requests</A><H1>{data.request.title || 'Untitled request'}</H1><P
		>Creator workspace</P
	></Div
>
<Tabs
	aria-label="Request sections"
	tabs={[
		{ title: 'Overview', value: `/requests/${data.request.id}` },
		{ title: 'Edit request', value: `/requests/${data.request.id}/edit` },
		{ title: 'Responses', value: `/requests/${data.request.id}/responses` },
		{ title: 'Questions & Answers', value: `/requests/${data.request.id}/questions` }
	]}
	bind:value={
		() => page.url.pathname,
		(value) => {
			void goto(value);
		}
	}
	class="flex flex-wrap gap-2"
/>
{@render children()}
