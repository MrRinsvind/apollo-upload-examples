import 'isomorphic-fetch'
import { ApolloClient } from 'react-apollo'
import BatchHttpLink from 'apollo-link-batch-http'
import { createApolloFetchUpload } from 'apollo-fetch-upload'

// Used in the browser to share a single Apollo Client instance between
// decorated components.
let apolloClient = null

/**
 * Creates a new Apollo Client instance.
 * @param {Object} [initialState] - Apollo client Redux store initial state.
 * @returns {Object} Apollo Client instance.
 */
const createApolloClient = initialState =>
  new ApolloClient({
    initialState,
    ssrMode: !process.browser,
    networkInterface: new BatchHttpLink({
      fetch: createApolloFetchUpload({
        uri: process.env.API_URI
      })
    })
  })

/**
 * Gets or creates the Apollo Client instance.
 * @param {Object} [initialState] - Apollo client Redux store initial state.
 * @returns {Object} Apollo Client instance.
 */
export default function initApolloClient(initialState) {
  // Create a new client every server-side request so that data isn't shared
  // between connections.
  if (!process.browser) return createApolloClient(initialState)

  // Reuse client on the client-side.
  if (!apolloClient) apolloClient = createApolloClient(initialState)

  return apolloClient
}