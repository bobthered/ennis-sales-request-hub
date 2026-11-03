<script lang="ts">
	import { onMount, type ComponentProps } from 'svelte';
	import { Input } from 'sveltewind/components';
	import { theme as globalTheme } from 'sveltewind/theme';
	let {
		value = $bindable(''),
		class: className = '',
		theme = globalTheme,
		variants = [],
		...restProps
	}: Omit<ComponentProps<typeof Input>, 'value'> & { value?: string } = $props();
	const classes = $derived(theme.resolve('nameInput', variants, className));
	onMount(() => {
		let previous = '';
		const sync = () => {
			let saved = '';
			try {
				saved = localStorage.getItem('ennis-name') || '';
			} catch {}
			if (!value || value === previous) value = saved;
			previous = saved;
		};
		sync();
		window.addEventListener('ennis-name-changed', sync);
		window.addEventListener('storage', sync);
		return () => {
			window.removeEventListener('ennis-name-changed', sync);
			window.removeEventListener('storage', sync);
		};
	});
</script>

<Input {theme} {...restProps} bind:value class={classes} autocomplete="name" />
