import { AUTH_MAX_TIME_TO_LIVE, localIdentityCanisterId } from '$lib/constants/constants';
import { createAuthClient } from '$lib/utils/auth.utils';
import type { Identity } from '@dfinity/agent';
import type { AuthClient } from '@dfinity/auth-client';
import { derived, writable, type Readable } from 'svelte/store';

export interface AuthStore {
	identity: Identity | undefined | null;
}

let authClient: AuthClient | undefined | null;

const initAuthStore = () => {
	const { subscribe, set, update } = writable<AuthStore>({
		identity: undefined
	});

	return {
		subscribe,

		sync: async () => {
			authClient = authClient ?? (await createAuthClient());
			const isAuthenticated: boolean = await authClient.isAuthenticated();

			set({
				identity: isAuthenticated ? authClient.getIdentity() : null
			});
		},

		signIn: () =>
			// eslint-disable-next-line no-async-promise-executor
			new Promise<void>(async (resolve, reject) => {
				authClient = authClient ?? (await createAuthClient());

				await authClient?.login({
					maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
					onSuccess: () => {
						update((state: AuthStore) => ({
							...state,
							identity: authClient?.getIdentity()
						}));

						resolve();
					},
					onError: reject,
					...(localIdentityCanisterId !== null &&
						localIdentityCanisterId !== undefined && {
							identityProvider: `http://${localIdentityCanisterId}.localhost:8000?#authorize`
						})
				});
			}),

		signOut: async () => {
			const client: AuthClient = authClient ?? (await createAuthClient());

			await client.logout();

			// This fix a "sign in -> sign out -> sign in again" flow without window reload.
			authClient = null;

			update((state: AuthStore) => ({
				...state,
				identity: null
			}));
		}
	};
};

export const authStore = initAuthStore();

export const authSignedInStore: Readable<boolean> = derived(
	authStore,
	({ identity }) => identity !== null && identity !== undefined
);
