const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt
} = require("graphql");

const { PlayerType, SessionsList, SegmentList } = require("./types");

const axios = require("axios");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    player: {
      type: PlayerType,
      description: "Retrieve lifetime stats for a player",
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/${args.id}`,
            { withCredentials: true }
          )
          .then((res) => res.data.data);
      }
    },
    segments: {
      type: SegmentList,
      description:
        "Retrieve a players stats in each playlist for a given season",
      args: {
        id: { type: GraphQLString },
        season: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/${args.id}/segments/playlist?season=${args.season}`,
            { withCredentials: true }
          )
          .then((res) => res.data.data);
      }
    },
    sessions: {
      type: SessionsList,
      description: "Retreive stats for recent matches",
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/${args.id}/sessions`,
            { withCredentials: true }
          )
          .then((res) => res.data.data.items.slice(0, 10));
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
