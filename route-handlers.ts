import { NextRequest, NextResponse } from "next/server";
import { Adapter } from "@auth/core/adapters";

export const httpAdapterRouteHandlers = ({ adapter }: { adapter: Adapter }) => {
  const isValidRequest = (req: NextRequest) => {
    const expectedSecret = process.env.AUTH_HTTP_ADAPTER_SECRET;
    const inputSecret = req.headers.get("Authorization")?.split(" ")[1];
    return inputSecret === expectedSecret;
  };

  return {
    POST: async (req: NextRequest, { params }: { params: { function: keyof Adapter } }) => {
      if (!isValidRequest(req)) {
        return NextResponse.json({ message: "Invalid authorization header" }, { status: 403 });
      }

      const adapterFunction = adapter[params.function];
      if (!adapterFunction) {
        return NextResponse.json({ message: "Invalid function name" }, { status: 400 });
      }

      const isJson = req.headers.get("Content-Type") === "application/json";
      const input = isJson ? await req.json() : await req.text();

      try {
        const result = await adapterFunction(input, {} as never);
        return NextResponse.json(result, { status: 200 });
      } catch (e) {
        console.error("Error executing HTTP Adapter function:", e);
        return NextResponse.json({ message: "Unknown error" }, { status: 500 });
      }
    },
  };
};
