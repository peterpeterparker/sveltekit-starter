<script lang="ts">
	import { authStore } from '$lib/stores/auth.store';
	import { browser } from '$app/environment';

	const syncAuthStore = async () => {
		if (!browser) {
			return;
		}

		try {
			await authStore.sync();
		} catch (err) {
			console.error(err);
		}
	};
</script>

{#await syncAuthStore()}
	<p>Loading...</p>
{:then _}
	<slot />
{/await}
