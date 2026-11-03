<script lang="ts">
	import { pricingUnits } from '#lib/pricing.js';
	import { untrack, tick, type ComponentProps } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import {
		A,
		Button,
		Card,
		Div,
		Form,
		H2,
		Input,
		Label,
		Option,
		P,
		Select,
		Textarea
	} from 'sveltewind/components';
	import { theme as globalTheme } from 'sveltewind/theme';
	type Attachment = { name: string; key: string; size: number };
	type Draft = {
		quantities: number[];
		canEditQuantities: boolean;
		pricingUom: string;
		id: string;
		title: string;
		description: string;
		due: string;
		visibility: string;
		questions: string;
		attachments: Attachment[];
		status: string;
	};
	type Props = ComponentProps<typeof Card> & { request: Draft; errorMessage?: string };
	let {
		request,
		errorMessage = '',
		class: className = '',
		theme = globalTheme,
		variants = [],
		...restProps
	}: Props = $props();
	const classes = $derived(theme.resolve('requestEditor', variants, className));
	let detailsForm = $state<HTMLFormElement | null>(null);
	let attachments = $state<Attachment[]>([]);
	$effect(() => {
		attachments = request.attachments;
	});
	let quantities = $state<(number | '')[]>(
		untrack(() => (request.quantities.length ? [...request.quantities] : ['']))
	);
	async function changeQuantityRows(index?: number) {
		if (index === undefined) quantities = [...quantities, ''];
		else quantities = quantities.filter((_, i) => i !== index);
		await tick();
		void autosave();
	}
	let questions = $state<string[]>(
		untrack(() => (request.questions ? request.questions.split('\n') : []))
	);
	async function changeQuestionRows(index?: number) {
		if (index === undefined) questions = [...questions, ''];
		else questions = questions.filter((_, i) => i !== index);
		await tick();
		void autosave();
	}
	let status = $state('Draft created');
	let dirty = $state(false);
	let working = $state(false);
	let uploading = $state(false);
	let submitting = false;
	let pending: FormData | null = null;
	let queue: Promise<boolean> = Promise.resolve(true);
	const endpoint = $derived(`/api/requests/${request.id}`);
	async function send(values: FormData) {
		const response = await fetch(endpoint, { method: 'POST', body: values });
		const data = await response.json();
		if (!response.ok) throw new Error(data.message || 'Unable to save. Please try again.');
		return data;
	}
	function autosave() {
		if (!detailsForm) return Promise.resolve(false);
		dirty = true;
		pending = new FormData(detailsForm);
		if (working) return queue;
		working = true;
		status = 'Saving draft...';
		queue = (async () => {
			try {
				while (pending) {
					const values = pending;
					pending = null;
					await send(values);
				}
				dirty = false;
				status = 'Draft saved';
				return true;
			} catch (e) {
				status = e instanceof Error ? e.message : 'Unable to save draft';
				return false;
			} finally {
				working = false;
			}
		})();
		return queue;
	}
	async function finish(event: SubmitEvent) {
		if (submitting) return;
		event.preventDefault();
		if (uploading || !(await autosave())) return;
		submitting = true;
		detailsForm?.requestSubmit();
	}
	async function upload(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const values = new FormData(form);
		uploading = true;
		try {
			if (!(await autosave())) return;
			const data = await send(values);
			attachments = [...attachments, data];
			status = 'File attached to draft';
			form.reset();
		} catch (e) {
			status = e instanceof Error ? e.message : 'Upload failed';
		} finally {
			uploading = false;
		}
	}
	beforeNavigate(({ cancel }) => {
		if (dirty || uploading) cancel();
	});
</script>

<svelte:window
	onbeforeunload={(event) => {
		if (dirty || uploading) {
			event.preventDefault();
			event.returnValue = '';
		}
	}}
/>
<Card {theme} {...restProps} class={classes}>
	<H2>Request details</H2>
	<P>Your draft already exists. Changes and attachments are saved as you work</P>
	{#if errorMessage}<P role="alert" class="text-neutral-700 dark:text-neutral-300">{errorMessage}</P
		>{/if}
	<Form
		id="request-details"
		method="POST"
		bind:element={detailsForm}
		oninput={() => autosave()}
		onchange={() => autosave()}
		onsubmit={finish}
		class="space-y-5"
	>
		<Div class="space-y-2"
			><Label for="title">Project title</Label><Input
				id="title"
				name="title"
				value={request.title}
				required
				maxlength={200}
				class="w-full"
			/></Div
		>
		<Div class="space-y-2"
			><Label for="description">Project details (optional)</Label><Textarea
				id="description"
				name="description"
				value={request.description}
				maxlength={20000}
				rows={4}
				class="w-full"
			/></Div
		>
		{#if request.canEditQuantities || request.quantities.length}<Div
				class="space-y-3 rounded-md border border-neutral-200 bg-transparent p-4 dark:border-neutral-800"
				><H2>Quantities</H2><P class="text-sm"
					>Add at least one quantity. Responders price each quantity using the selected UOM.
					Quantities can be edited until the first response arrives.</P
				>
				{#each quantities as quantity, i}<Div class="flex items-center gap-2"
						><Label for={`quantity-${i}`}>Quantity {i + 1}</Label><Input
							id={`quantity-${i}`}
							name="quantities"
							type="number"
							min="1"
							step="1"
							required
							bind:value={quantities[i]}
							disabled={!request.canEditQuantities}
							class="min-w-0 flex-1"
						/>{#if !request.canEditQuantities}<Input
								type="hidden"
								name="quantities"
								value={quantity}
							/>{:else if quantities.length > 1}<Button
								type="button"
								variants={['danger']}
								onclick={() => changeQuantityRows(i)}>Remove</Button
							>{/if}</Div
					>{/each}
				{#if request.canEditQuantities}<Button
						type="button"
						variants={['outline']}
						disabled={quantities.length >= 20}
						onclick={() => changeQuantityRows()}>Add quantity</Button
					>{/if}</Div
			>
		{/if}<Div class="space-y-2"
			><Label for="pricingUom">Pricing UOM</Label><Select
				id="pricingUom"
				name="pricingUom"
				value={request.pricingUom}
				disabled={request.status === 'closed'}
				class="w-full"
				>{#each pricingUnits as unit}<Option value={unit.value}>{unit.label}</Option>{/each}</Select
			>{#if request.status === 'closed'}<Input
					type="hidden"
					name="pricingUom"
					value={request.pricingUom}
				/>{/if}<P class="text-sm"
				>New or revised quotes use this unit. Existing quotes keep their recorded unit.</P
			></Div
		>
		<Div class="space-y-2"
			><Label for="due">Due date (optional)</Label><Input
				id="due"
				name="due"
				type="date"
				value={request.due}
				class="w-full"
			/></Div
		>
		<Div class="space-y-2"
			><Label for="visibility">Who can see responses?</Label><Select
				id="visibility"
				name="visibility"
				value={request.visibility}
				class="w-full"
				><Option value="creator-only">Only me (recipients can see their own)</Option><Option
					value="shared">Everyone with the request link</Option
				></Select
			></Div
		>
		<Div
			class="space-y-3 rounded-md border border-neutral-200 bg-transparent p-4 dark:border-neutral-800"
			><H2>Additional questions</H2><P class="text-sm"
				>Add questions for responders. Every answer is optional. Questions are fixed when published.</P
			>
			{#each questions as question, i}<Div class="flex items-center gap-2"
					><Label for={`question-${i}`}>Question {i + 1}</Label><Input
						id={`question-${i}`}
						name="questions"
						bind:value={questions[i]}
						maxlength={500}
						disabled={request.status !== 'draft'}
						class="min-w-0 flex-1"
					/>{#if request.status !== 'draft'}<Input
							type="hidden"
							name="questions"
							value={question}
						/>{:else}<Button
							type="button"
							variants={['danger']}
							onclick={() => changeQuestionRows(i)}>Remove</Button
						>{/if}</Div
				>{/each}
			{#if request.status === 'draft'}<Button
					type="button"
					variants={['outline']}
					disabled={questions.length >= 30}
					onclick={() => changeQuestionRows()}>Add question</Button
				>{/if}
		</Div>
	</Form>
	<Div class="space-y-3">
		<H2>Shared attachments</H2>
		{#each attachments as file (file.key)}<Div
				><A href={`/api/requests/${request.id}/files/${file.key}`} download>{file.name}</A><P
					class="text-sm">{Math.ceil(file.size / 1024)} KB</P
				></Div
			>{/each}
		{#if !attachments.length}<P>No files attached</P>{/if}
		<Form
			method="POST"
			enctype="multipart/form-data"
			onsubmit={upload}
			class="space-y-3 rounded-md border border-neutral-200 p-4 dark:border-neutral-800"
		>
			<Input type="hidden" name="operation" value="upload" />
			<Label for="file">Add a file</Label><Div class="flex items-center gap-3"
				><Input
					id="file"
					name="file"
					type="file"
					required
					disabled={uploading || request.status === 'closed'}
					class="min-w-0 flex-1"
				/><Button
					type="submit"
					variants={['outline']}
					disabled={uploading || request.status === 'closed'}
					class="shrink-0">{uploading ? 'Uploading...' : 'Attach file'}</Button
				></Div
			>
			<P class="text-sm">Up to 1 MB per file, 3 MB total, and 10 files per request</P>
		</Form>
	</Div>
	<P role="status" aria-live="polite" class="text-sm">{status}</P>
	<Button type="submit" form="request-details" disabled={uploading || request.status === 'closed'}
		>Save request</Button
	>
</Card>
