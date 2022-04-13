# corefinance-sdk

CoreFinance SDK provides a high level library to easily interact and get information on all the core finance protocol products.

> Not ready to use, work in progress! The document serves as examples and could be changed.

# Install

```
yarn add @corefinance-sdk
```

# Use inside your project

```typescript
import { ClientFactory } from '@corefinance-sdk';

// any json rpc endpoint url
const client = ClientFactory.createBackendClient(url, privateKey /* optional */);

// getting token prices
await client.tokens().getPrice(Token.CORE, Denominator.USD);

// using the lending protocol
await client.lending().addCollateral(...);
const apyStats = await client.lending().getApyStats();

// analytics (this module could provided by the https://corecharts.info/ team)
await client.analytics().getCoreFoT();

// governance interactions
const proposal = await client.governance().getProposal(...);
await proposal.vote(...);
```
