const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt
} = require("graphql");

const PlayerType = new GraphQLObjectType({
  name: "Player",
  fields: () => ({
    platformInfo: { type: PlatformInfoType },
    segments: { type: SegmentList },
    availableSegments: { type: SegmentList },
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
    },
    goalShotRatio: { type: PerformanceType },
    seasonRewardLevel: { type: PerformanceType },
    matchesPlayed: { type: PerformanceType }
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
    attributes: { type: AttributesType },
    stats: {
      type: StatsType
    }
  })
});

const MetaDataType = new GraphQLObjectType({
  name: "Metadata",
  fields: () => ({
    name: { type: GraphQLString },
    startDate: { type: DateType },
    endDate: { type: DateType },
    result: { type: GraphQLString },
    playlist: { type: GraphQLString },
    dateCollected: { type: DateType }
  })
});

const AttributesType = new GraphQLObjectType({
  name: "Attributes",
  fields: () => ({
    season: { type: GraphQLInt }
  })
});

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
    displayValue: { type: GraphQLString },
    value: { type: GraphQLFloat },
    metadata: { type: SeasonRewardsMetadata }
  })
});

const SeasonRewardsMetadata = new GraphQLObjectType({
  name: "SeasonRewardsMetadata",
  fields: () => ({
    rankName: { type: GraphQLString },
    iconUrl: { type: GraphQLString }
  })
});

const SessionsType = new GraphQLObjectType({
  name: "Session",
  fields: () => ({
    metadata: { type: MetaDataType },
    matches: { type: GraphQLList(MatchesType) }
  })
});

const MatchesType = new GraphQLObjectType({
  name: "Matches",
  fields: () => ({
    metadata: { type: MetaDataType },
    stats: { type: OverviewType }
  })
});

const DateType = new GraphQLObjectType({
  name: "Date",
  fields: () => ({
    value: { type: GraphQLString }
  })
});

const SegmentList = new GraphQLList(SegmentsType);

const SessionsList = new GraphQLList(SessionsType);

module.exports = {
  PlayerType,
  SessionsList,
  SegmentList
};
