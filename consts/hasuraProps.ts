import { HasuraProps } from "../utils/customTypes";

export const hasuraProps = { hasuraSecret: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET as String,
    hasuraEndpoint: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT as | RequestInfo | URL } as HasuraProps;