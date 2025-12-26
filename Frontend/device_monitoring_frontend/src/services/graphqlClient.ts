// src/services/graphqlClient.ts
import { alarmServiceBaseURL } from "@/utils/helpervariables";
import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  `${alarmServiceBaseURL}/graphql`,
  {
    credentials: "include", // if cookies/auth
    headers: {
      "Content-Type": "application/json",
    },
  }
);
