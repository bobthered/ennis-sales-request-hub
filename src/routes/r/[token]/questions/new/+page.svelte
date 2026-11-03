<script lang="ts">
	import NameInput from '#lib/components/NameInput.svelte';
	import { A, Button, Card, Form, H2, Input, Label, P, Textarea } from 'sveltewind/components';
	import type { PageProps } from './$types';
	let { params, form }: PageProps = $props();
</script>

<svelte:head></svelte:head><A href={`/r/${params.token}/questions`}>Back to Questions & Answers</A
><Card class="space-y-4"
	><H2>Ask a question</H2>{#if form?.message}<P role="alert">{form.message}</P>{/if}<Form
		method="POST"
		class="space-y-3"
		><Label for="ask-name">Your name</Label><NameInput
			id="ask-name"
			name="name"
			required
			maxlength={200}
		/><Label for="question">Your question</Label><Textarea
			id="question"
			name="question"
			required
			maxlength={5000}
			rows={4}
		/><Button type="submit">Post question</Button></Form
	></Card
>
