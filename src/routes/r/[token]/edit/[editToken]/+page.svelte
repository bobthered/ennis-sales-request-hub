<script lang="ts">
	import { Button, Card, H2, Label, P, Textarea } from 'sveltewind/components';
</script>

<svelte:head></svelte:head>
<Card class="space-y-5 bg-white p-6"
	><H2>Edit your response</H2><P
		>Your personal edit link will let you correct your answers while the request is open. This is a
		preview; no response has been saved.</P
	><Label for="corrections">Response notes</Label><Textarea
		id="corrections"
		rows={4}
		class="w-full"
	/><Button disabled>Save changes</Button></Card
>
