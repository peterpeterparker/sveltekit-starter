<script lang="ts">
	import {canisterInstallCode, canisterInstallCodeFromUrl, canisterStatus} from "$lib/providers/ic.providers";
	import {authStore} from "$lib/stores/auth.store";
	import {sha256} from "$lib/utils/crypto.utils";

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
	let inputWasmCheck: HTMLInputElement | undefined;
	let inputWasmUrl: HTMLInputElement | undefined;

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

	const handleSubmitUrl = async ($event: MouseEvent | TouchEvent) => {
		$event.preventDefault();

		console.log('Upload', inputWasmUrl?.value);

		try {
			await canisterInstallCodeFromUrl({...params, url: inputWasmUrl.value ?? ''});

			console.log('Success');
		} catch (err) {
			console.error(err);
		}
	}

	const signIn = async () => await authStore.signIn();

	const hash = "d9d9e6726464e4316ed4d797a3451aba0ba41560ca04608c7eda1c45c74080eb";

	const checkHash = async () => {
		const sha = await sha256(inputWasmCheck?.files?.[0]);
		console.log(sha === hash);
	}
</script>

<h1>Test</h1>

<p>Canister ID: {params.canisterId}</p>

<p>Signed in: {$authStore.identity?.getPrincipal().toText()} (<button on:click={signIn}>Sign-in</button>)</p>

<button on:click={status}>Query status</button>

<h2>Upload wasm</h2>

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

<h2>Download wasm</h2>


<form
		on:submit={async ($event) => await handleSubmitUrl($event)}
		on:keypress={($event) => {
    $event.key === 'Enter' && $event.preventDefault();
  }}>
	<input
			bind:this={inputWasmUrl}
			type="text"/>

	<button type="submit">
		Download
	</button>
</form>


<h2>Check hash</h2>

<p>Expected hash: {hash}</p>

<input
		bind:this={inputWasmCheck}
		type="file"
		multiple={false} on:change={checkHash}/>