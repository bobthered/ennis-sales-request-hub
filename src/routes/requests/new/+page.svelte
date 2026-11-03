<script lang="ts">
	import { A, Button, Div, Form, H1, P } from 'sveltewind/components';
</script>

<svelte:head></svelte:head>
<Div class="mx-auto max-w-3xl space-y-6">
	<A href="/requests">My Requests</A><H1>Create a request</H1>
	<P>Start a draft to add project details and files</P>
	<Form method="POST"><Button type="submit">Create a request</Button></Form>
</Div>
