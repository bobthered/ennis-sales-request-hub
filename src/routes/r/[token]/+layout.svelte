<script lang="ts">
	import { A, Div, H1, Nav, P } from 'sveltewind/components';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
</script>

<Div class="mx-auto w-full max-w-3xl space-y-7">
	<Div class="space-y-3"
		><P class="text-sm font-semibold tracking-widest uppercase">You're invited to respond</P><H1
			>{data.request.title}</H1
		><P>{data.request.description}</P></Div
	>
	<Nav aria-label="Recipient sections" class="flex flex-wrap gap-5 border-b border-slate-200 pb-4"
		><A href="/r/demo">Your response</A><A href="/r/demo/questions">Questions & Answers</A></Nav
	>
	{@render children()}
</Div>
