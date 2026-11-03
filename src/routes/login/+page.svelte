<script lang="ts">
	import { A, Card, H1, P } from 'sveltewind/components';
</script>

<svelte:head><title>Sign in · Ennis</title></svelte:head>
<Card class="mx-auto max-w-lg space-y-5 bg-white p-8"
	><H1>Creator sign-in</H1><P
		>Sign-in will let you create and manage your own requests. Recipients will use their emailed
		link.</P
	><P>Authentication is not connected yet.</P><A href="/requests" variants={['button.base']}
		>My Requests</A
	></Card
>
