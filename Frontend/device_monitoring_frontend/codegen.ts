import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  generates: {
    // Queries & Mutations (Alarm Service)
    "src/graphql/generated/alarmService.ts": {
      schema: "http://localhost:5147/graphql",
      documents: [
        "src/graphql/operations/queries/**/*.graphql",
        "src/graphql/operations/mutations/**/*.graphql",
      ],
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },

    // Subscriptions (Gateway)
    "src/graphql/generated/gatewayservice.ts": {
      schema: "http://localhost:5260/graphql",
      documents: "src/graphql/operations/subscriptions/**/*.graphql",
      plugins: ["typescript", "typescript-operations"],
    },
  },
};

export default config;
