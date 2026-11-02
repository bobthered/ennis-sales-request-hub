<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import {
		Button,
		Card,
		Div,
		H2,
		Input,
		Label,
		Option,
		P,
		Select,
		Textarea
	} from 'sveltewind/components';
	import { theme as globalTheme } from 'sveltewind/theme';
	type Props = ComponentProps<typeof Card> & { initialTitle?: string; initialDescription?: string };
	let {
		initialTitle = '',
		initialDescription = '',
		class: className = '',
		theme = globalTheme,
		variants = [],
		...restProps
	}: Props = $props();
	const classes = $derived(theme.resolve('requestEditor', variants, className));
</script>

<Card {theme} {...restProps} class={classes}>
	<H2>Request details</H2>
	<Div class="space-y-2"
		><Label for="title">Project title</Label><Input
			id="title"
			name="title"
			value={initialTitle}
			class="w-full"
			placeholder="What do you need help with?"
		/></Div
	>
	<Div class="space-y-2"
		><Label for="description">Project details</Label><Textarea
			id="description"
			name="description"
			value={initialDescription}
			rows={4}
			class="w-full"
		/></Div
	>
	<Div class="space-y-2"
		><Label for="due">Due date (optional)</Label><Input
			id="due"
			name="due"
			type="date"
			class="w-full"
		/></Div
	>
	<Div class="space-y-2"
		><Label for="visibility">Who can see responses?</Label><Select
			id="visibility"
			name="visibility"
			class="w-full"
			><Option value="creator-only">Only me (recipients can see their own)</Option><Option
				value="shared">Everyone with the request link</Option
			></Select
		></Div
	>
	<Div class="space-y-2"
		><Label for="questions">Additional questions</Label><Textarea
			id="questions"
			name="questions"
			rows={3}
			class="w-full"
			placeholder="For example: What is your production lead time?"
		/><P class="text-sm">Name, branch, and pricing are included in this starter form.</P></Div
	>
	<Div class="space-y-2"
		><Label for="attachments">Shared attachments</Label><Input
			id="attachments"
			type="file"
			multiple
			disabled
			class="w-full"
		/><P class="text-sm">File uploads will be available once storage is connected.</P></Div
	>
	<P class="text-sm">Form preview only. Creating and saving requests is not connected yet.</P>
	<Button disabled>Save request</Button>
</Card>
