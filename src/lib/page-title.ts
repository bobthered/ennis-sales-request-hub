export function pageTitle(
	pathname: string,
	params: Record<string, string | undefined>,
	requestTitle?: string
) {
	const parts = pathname
		.split('/')
		.filter(Boolean)
		.flatMap((part) => {
			if (part === 'r' && params.token) return [];
			if (part === params.requestId || part === params.token)
				return requestTitle ? [requestTitle] : [];
			if (part === params.editToken || /^[a-f\d]{24,}$/i.test(part) || /^[\da-f-]{36}$/i.test(part))
				return [];
			let decoded = part;
			try {
				decoded = decodeURIComponent(part);
			} catch {}
			const label = decoded.replace(/[-_]/g, ' ');
			return [label.replace(/\b\w/g, (c) => c.toUpperCase())];
		});
	return [...parts.reverse(), 'Ennis - Sales Request Hub'].join(' | ');
}
