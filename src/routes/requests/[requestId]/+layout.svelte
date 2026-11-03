<script lang="ts">
	import { A, Div, H1, Nav, P } from 'sveltewind/components';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
</script>

<Div class="space-y-3"
	><A href="/requests">← My requests</A><H1>{data.request.title}</H1><P>Creator workspace</P></Div
>
<Nav
	aria-label="Request sections"
	class="flex flex-wrap gap-5 border-b border-slate-200 pb-4 dark:border-slate-800"
	><A href={`/requests/${encodeURIComponent(data.request.id)}`}>Overview</A><A
		href={`/requests/${encodeURIComponent(data.request.id)}/edit`}>Edit request</A
	><A href={`/requests/${encodeURIComponent(data.request.id)}/responses`}>Responses</A><A
		href={`/requests/${encodeURIComponent(data.request.id)}/questions`}>Questions & Answers</A
	></Nav
>
{@render children()}
