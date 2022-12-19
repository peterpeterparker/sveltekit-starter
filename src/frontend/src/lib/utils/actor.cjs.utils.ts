import { getAgent } from '$lib/utils/agent.cjs.utils';
import type { ActorConfig, ActorMethod, ActorSubclass, CallConfig } from '@dfinity/agent';
import { Actor, type Identity } from '@dfinity/agent/lib/cjs/index';
import type { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import type { _SERVICE as ICActor } from '../../../../declarations/ic/ic.did';
import { idlFactory as idlFactorIC } from '../../../../declarations/ic/ic.factory.did';


const MANAGEMENT_CANISTER_ID = Principal.fromText('aaaaa-aa');

// Source nns-dapp - dart -> JS bridge
const transform = (_methodName: string, args: unknown[], _callConfig: CallConfig) => {
	const first = args[0] as any;
	let effectiveCanisterId = MANAGEMENT_CANISTER_ID;
	if (first && typeof first === 'object' && first.canister_id) {
		effectiveCanisterId = Principal.from(first.canister_id as unknown);
	}

	return { effectiveCanisterId };
};

export const getICActor = (identity: Identity): Promise<ICActor> =>
	createActor<ICActor>({
		canisterId: MANAGEMENT_CANISTER_ID,
		config: {
			callTransform: transform,
			queryTransform: transform
		},
		idlFactory: idlFactorIC,
		identity
	});

const createActor = async <T = Record<string, ActorMethod>>({
	canisterId,
	idlFactory,
	identity,
	config
}: {
	canisterId: string | Principal;
	idlFactory: IDL.InterfaceFactory;
	identity: Identity;
	config?: Pick<ActorConfig, 'callTransform' | 'queryTransform'>;
}): Promise<ActorSubclass<T>> => {
	const agent = await getAgent({ identity });

	// Creates an actor with using the candid interface and the HttpAgent
	return Actor.createActor(idlFactory, {
		agent,
		canisterId,
		...(config && { config })
	});
};
