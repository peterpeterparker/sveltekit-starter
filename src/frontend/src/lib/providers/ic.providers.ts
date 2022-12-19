import type { CanisterInfo, CanisterStatus } from '$lib/types/canister';
import { getICActor } from '$lib/utils/actor.cjs.utils';
import type { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import type { _SERVICE as ICActor } from '../../../../declarations/ic/ic.did';
import { IDL } from '@dfinity/candid';
import {toArray} from "$lib/utils/did.utils";

const toStatus = (
	status: { stopped: null } | { stopping: null } | { running: null }
): CanisterStatus =>
	'stopped' in status && status.stopped === null
		? 'stopped'
		: 'stopping' in status && status.stopping === null
		? 'stopping'
		: 'running';

export const canisterStatus = async ({
	canisterId,
	identity
}: {
	canisterId: string;
	identity: Identity;
}): Promise<CanisterInfo> => {
	const actor: ICActor = await getICActor(identity);

	const { cycles, status, memory_size } = await actor.canister_status({
		canister_id: Principal.fromText(canisterId)
	});

	return { cycles, status: toStatus(status), memory_size, canisterId };
};

export const canisterInstallCode = async ({file, canisterId, identity}: {
	file: File,
	canisterId: string;
	identity: Identity;
}): Promise<void> => {
	const actor: ICActor = await getICActor(identity);

	const arg = IDL.encode([], []);

	const wasm_module = [...new Uint8Array(await file.arrayBuffer())];

	return actor.install_code(
		{
			arg: [...new Uint8Array(arg)],
			mode: {upgrade: null},
			canister_id: Principal.fromText(canisterId),
			wasm_module
		}
	)
}

const downloadWasm = async (src: string): Promise<Blob> => {
	const wasm: Response = await fetch(src);
	return wasm.blob();
};

export const canisterInstallCodeFromUrl = async ({url, canisterId, identity}: {
	url: string,
	canisterId: string;
	identity: Identity;
}): Promise<void> => {
	const actor: ICActor = await getICActor(identity);

	const arg = IDL.encode([], []);

	const wasmBlob = await downloadWasm(url);

	console.log(wasmBlob);

	const wasm_module = [...new Uint8Array(await wasmBlob.arrayBuffer())];

	return actor.install_code(
		{
			arg: [...new Uint8Array(arg)],
			mode: {reinstall: null},
			canister_id: Principal.fromText(canisterId),
			wasm_module
		}
	)
}