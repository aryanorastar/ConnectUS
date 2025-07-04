import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, type Identity } from "@dfinity/agent";

// 1. Create an auth client
let authClient: AuthClient;

export const initAuth = async (): Promise<AuthClient> => {
  authClient = await AuthClient.create({
    idleOptions: {
      disableIdle: true,
    },
  });
  return authClient;
};

// 2. Login function
export const login = async (): Promise<Identity | null> => {
  if (!authClient) {
    await initAuth();
  }

  // Always use the production Internet Identity canister
  const identityProvider = "https://identity.ic0.app";

  console.log("Using identity provider:", identityProvider);

  return new Promise((resolve) => {
    authClient.login({
      identityProvider,
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        console.log("Login successful, principal:", identity.getPrincipal().toText());
        resolve(identity);
      },
      onError: (error) => {
        console.error("Login failed:", error);
        resolve(null);
      },
    });
  });
};

// 3. Logout function
export const logout = async (): Promise<void> => {
  if (!authClient) {
    return;
  }
  await authClient.logout();
};

// 4. Check authentication status
export const isAuthenticated = async (): Promise<boolean> => {
  if (!authClient) {
    await initAuth();
  }
  return await authClient.isAuthenticated();
};

// 5. Get current identity
export const getCurrentIdentity = (): Identity | null => {
  if (!authClient) {
    return null;
  }
  return authClient.getIdentity();
};
