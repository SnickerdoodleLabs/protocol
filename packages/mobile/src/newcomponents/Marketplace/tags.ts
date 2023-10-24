import { ETag, URLString } from "@snickerdoodlelabs/objects";

export interface ITagItem {
  tag: ETag;
  iconUrl: string;
  defaultDisplayName: string;
}

export const tags: ITagItem[] = [
  {
    tag: ETag.DeFi,
    defaultDisplayName: "Defi",
    iconUrl: require("../../assets/images/category-defi.png"),
  },
  {
    tag: ETag.Web3_Gaming,
    defaultDisplayName: "Web3 Gaming",
    iconUrl: require("../../assets/images/category-gaming.png"),
  },
  {
    tag: ETag.Play_To_Earn_Games,
    defaultDisplayName: "Play-To-Earn Games",
    iconUrl: require("../../assets/images/category-playEarn.png"),
  },
  {
    tag: ETag.NFT_Collectibles,
    defaultDisplayName: "NFT Collectibles",
    iconUrl: require("../../assets/images/category-nft.png"),
  },
  {
    tag: ETag.Art,
    defaultDisplayName: "Art",
    iconUrl: require("../../assets/images/category-art.png"),
  },
  {
    tag: ETag.Music,
    defaultDisplayName: "Music",
    iconUrl: require("../../assets/images/category-music.png"),
  },
  {
    tag: ETag.Food_and_Beverage,
    defaultDisplayName: "Food and Beverage",
    iconUrl: require("../../assets/images/category-foods.png"),
  },
  {
    tag: ETag.Social_Dapps,
    defaultDisplayName: "Social Dapps",
    iconUrl: require("../../assets/images/category-socialDapps.png"),
  },
  {
    tag: ETag.Investing_Trading,
    defaultDisplayName: "Investing/Trading",
    iconUrl: require("../../assets/images/category-trading.png"),
  },
  {
    tag: ETag.Virtual_Fashion,
    defaultDisplayName: "Virtual Fashion",
    iconUrl: require("../../assets/images/category-fashion.png"),
  },
  {
    tag: ETag.Virtual_Real_Estate,
    defaultDisplayName: "Virtual Real Estate",
    iconUrl: require("../../assets/images/category-realEstate.png"),
  },
  {
    tag: ETag.PFPs,
    defaultDisplayName: "PFPs",
    iconUrl: require("../../assets/images/category-pfps.png"),
  },
  {
    tag: ETag.DAOs,
    defaultDisplayName: "DAOs",
    iconUrl: require("../../assets/images/category-daos.png"),
  },
  {
    tag: ETag.Event_Tickets,
    defaultDisplayName: "Event Tickets",
    iconUrl: require("../../assets/images/category-tickets.png"),
  },
  {
    tag: ETag.Metaverse,
    defaultDisplayName: "Metaverse",
    iconUrl: require("../../assets/images/category-metaverse.png"),
  },
  {
    tag: ETag.Gambling,
    defaultDisplayName: "Gambling",
    iconUrl: require("../../assets/images/category-gambling.png"),
  },
  {
    tag: ETag.Sports,
    defaultDisplayName: "Sports",
    iconUrl: require("../../assets/images/category-sports.png"),
  },
];
