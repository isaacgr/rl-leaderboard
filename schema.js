const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt
} = require("graphql");

const axios = require("axios");

const PlayerType = new GraphQLObjectType({
  name: "Player",
  fields: () => ({
    platformInfo: { type: PlatformInfoType },
    segments: { type: SegmentList },
    overview: {
      type: OverviewType,
      resolve(parent, args) {
        const stats = parent.segments.map((segment) => {
          if (segment.type === "overview") {
            return segment.stats;
          }
        })[0];
        return stats;
      }
    }
  })
});

const OverviewType = new GraphQLObjectType({
  name: "Overview",
  fields: () => ({
    wins: {
      type: PerformanceType
    },
    goals: {
      type: PerformanceType
    },
    saves: {
      type: PerformanceType
    },
    mVPs: {
      type: PerformanceType
    },
    shots: {
      type: PerformanceType
    },
    assists: {
      type: PerformanceType
    }
  })
});

const PlatformInfoType = new GraphQLObjectType({
  name: "PlatformInfo",
  fields: () => ({
    platformUserHandle: {
      type: GraphQLString
    },
    avatarUrl: { type: GraphQLString }
  })
});

const SegmentsType = new GraphQLObjectType({
  name: "Playlist",
  fields: () => ({
    type: {
      type: GraphQLString
    },
    metadata: { type: MetaDataType },
    stats: {
      type: StatsType
    }
  })
});

const SegmentList = new GraphQLList(SegmentsType);

const StatsType = new GraphQLObjectType({
  name: "Stats",
  fields: () => ({
    tier: { type: TierType },
    division: { type: TierType },
    matchesPlayed: { type: PerformanceType },
    winStreak: { type: PerformanceType },
    rating: { type: PerformanceType }
  })
});

const TierType = new GraphQLObjectType({
  name: "Tier",
  fields: () => ({
    metadata: { type: MetaDataType }
  })
});

const PerformanceType = new GraphQLObjectType({
  name: "Performance",
  fields: () => ({
    percentile: { type: GraphQLString },
    displayName: { type: GraphQLString },
    value: { type: GraphQLInt }
  })
});

const MetaDataType = new GraphQLObjectType({
  name: "Metadata",
  fields: () => ({
    name: { type: GraphQLString }
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
          .then((res) => res.data.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
