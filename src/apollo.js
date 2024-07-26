import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

const client = new ApolloClient({
    link: new HttpLink({
        uri: process.env.VUE_APP_HASURA_GRAPHQL_URI,
        headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': process.env.VUE_APP_HASURA_ADMIN_SECRET,
        },
    }),
    cache: new InMemoryCache(),
});

export default client;
