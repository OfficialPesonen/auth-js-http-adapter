import type { Adapter } from "@auth/core/adapters";

export function HTTPAdapter(options?: { authUrl?: string; secret?: string }): Adapter {
  const url = options?.authUrl ?? process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;

  const createRequest = async (functionName: string, data: any) => {
    const isDataString = typeof data === "string";

    const response = await fetch(`${url}/api/auth/adapter/${functionName}`, {
      method: "POST",
      body: isDataString ? data : JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${options?.secret ?? process.env.AUTH_HTTP_ADAPTER_SECRET}`,
        ...(isDataString ? {} : { "Content-Type": "application/json" }),
      },
    });

    const result = await response.json();

    return result;
  };

  return {
    createUser: async (data) => await createRequest("createUser", data),
    getUser: async (id) => await createRequest("getUser", id),
    getUserByEmail: async (email) => await createRequest("getUserByEmail", email),
    getUserByAccount: async (provider_providerAccountId) =>
      await createRequest("getUserByAccount", provider_providerAccountId),
    updateUser: async (data) => await createRequest("updateUser", data),
    deleteUser: async (id) => await createRequest("deleteUser", id),
    linkAccount: async (data) => await createRequest("linkAccount", data),
    unlinkAccount: async (provider_providerAccountId) =>
      await createRequest("unlinkAccount", provider_providerAccountId),
    getSessionAndUser: async (sessionToken) =>
      await createRequest("getSessionAndUser", sessionToken),
    createSession: async (data) => await createRequest("createSession", data),
    updateSession: async (data) => await createRequest("updateSession", data),
    deleteSession: async (sessionToken) => await createRequest("deleteSession", sessionToken),
    createVerificationToken: async (data) => await createRequest("createVerificationToken", data),
    useVerificationToken: async (identifier_token) =>
      await createRequest("useVerificationToken", identifier_token),
  };
}
