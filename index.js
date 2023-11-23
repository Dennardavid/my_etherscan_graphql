const { ApolloServer } = require("apollo-server"); // Import Apollo Server
const { importSchema } = require("graphql-import"); // Import graphql schema importer
const EtherDataSource = require("./datasource/ethDatasource"); // Import custom Ethereum data source

const typeDefs = importSchema("./schema.graphql"); // Import GraphQL schema from file

require("dotenv").config(); // Load environment variables from .env file

const resolvers = {
  Query: {
    // Resolver to get ETH balance for an address
    etherBalanceByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Resolver to get total supply of Ether
    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Resolver to get latest ETH price
    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Resolver to get average block confirmation time
    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(), // Instantiate Ethereum data source
  }),
});

server.timeout = 0;

server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
