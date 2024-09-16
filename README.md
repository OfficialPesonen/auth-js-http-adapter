# HTTP Adapter for Auth.js

Unofficial HTTP adapter for Auth.js / NextAuth.js.

The purpose of this package is to provide a way to use any other Auth.js adapter through HTTP requests.
This is because some of the adapters are not compatible with Edge Runtimes.

## Installation

```bash npm2yarn
npm install auth-js-http-adapter
```

## Usage

Create a file to the following path `app/api/auth/adapter/[function]/route.ts` and paste the following code:

```ts
import { httpAdapterRouteHandlers } from "auth-js-http-adapter";

// Replace Adapter with a real adapter (such as MongoDBAdapter)
export const { POST } = httpAdapterRouteHandlers({ adapter: Adapter });
```

Update your Auth.js configuration `auth.ts` to use the HTTP adapter:

```ts
import NextAuth from "next-auth";
import { HTTPAdapter } from "auth-js-http-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: HTTPAdapter(),
  providers: [],
});
```

Make sure to set the `AUTH_URL` and `AUTH_HTTP_ADAPTER_SECRET` environment variables.

```dotenv filename=".env.local"
AUTH_URL="http://localhost:3000"
AUTH_HTTP_ADAPTER_SECRET="strong-secret-key"
```

## License

MIT
