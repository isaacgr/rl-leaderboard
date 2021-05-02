const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require("graphql");

const axios = require("axios");

// const DataType = new GraphQLObjectType({
//   name: 'Data',
//   fields: () => ({
//     data: {type: PlayerType}
//   })
// })

const PlayerType = new GraphQLObjectType({
  name: "Player",
  fields: () => ({
    platformInfo: { type: PlatformInfoType }
  })
});

const PlatformInfoType = new GraphQLObjectType({
  name: "PlatformInfo",
  fields: () => ({
    platformUserHandle: {
      type: GraphQLString
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    player: {
      type: PlayerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/${args.id}`,
            { withCredentials: true }
          )
          .then((res) => {
            res.data;
          });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
