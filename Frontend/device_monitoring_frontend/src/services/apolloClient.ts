import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

// export const graphqlRequest = async <T>(
//   query: string,
//   variables?: Record<string, any>
// ): Promise<T> => {
//   try {
//     const response = await axios.post(
//       `${alarmServiceBaseURL}/graphql`,
//       {
//         query,
//         variables,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.data.errors) {
//       throw response.data.errors;
//     }

//     return response.data.data;
//   } catch (error: any) {
//     handleAxiosError(error);
//     throw error;
//   }
// };

const httpLink = new HttpLink({
  uri: "http://localhost:5260/graphql",
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:5260/graphql",
    retryAttempts: Infinity,
  })
);

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === "OperationDefinition" && def.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
