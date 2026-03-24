import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.string().url().default("http://localhost:4000"),
    VITE_WS_URL: z.string().url().default("ws://localhost:4000"),
    VITE_STORAGE_PUBLIC_URL: z
      .string()
      .url()
      .default("http://localhost:9000/uploads"),
  },
  runtimeEnv: import.meta.env,
})
