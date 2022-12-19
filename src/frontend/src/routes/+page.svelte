<script lang="ts">
	import {canisterInstallCode, canisterStatus} from "$lib/providers/ic.providers";
	import {authStore} from "$lib/stores/auth.store";

	const params = {
		canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
		identity: $authStore.identity
	};

	const status = async () => {
		try {
			const status = await canisterStatus(params);

			console.log(status)
		} catch (err) {
			console.error(err);
		}
	}

	let inputWasm: HTMLInputElement | undefined;

	const handleSubmit = async ($event: MouseEvent | TouchEvent) => {
		$event.preventDefault();

		try {
			const file = inputWasm?.files[0];
			await canisterInstallCode({...params, file});

			console.log('Success');
		} catch (err) {
			console.error(err);
		}
	}

	const signIn = async () => await authStore.signIn();
</script>

<h1>Test</h1>

<p>Canister ID: {params.canisterId}</p>

<p>Signed in: {$authStore.identity?.getPrincipal().toText()} (<button on:click={signIn}>Sign-in</button>)</p>

<button on:click={status}>Query status</button>

<form
		on:submit={async ($event) => await handleSubmit($event)}
		on:keypress={($event) => {
    $event.key === 'Enter' && $event.preventDefault();
  }}>
	<input
			bind:this={inputWasm}
			type="file"
			multiple={false}/>

	<button type="submit">
		Upload
	</button>
</form>