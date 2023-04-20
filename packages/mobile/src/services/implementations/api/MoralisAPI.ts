import { ChainId } from "@snickerdoodlelabs/objects";
import axios from "axios";
axios.defaults.withCredentials = true;
const BASEURI = "https://deep-index.moralis.io/api/v2/";
export class MoralisAPI {
  public async getAllNFTs(accountAddress: string, chain: string) {
    try {
      const response = await axios.get(
        BASEURI +
          accountAddress +
          `/nft?chain=${chain}&format=decimal&normalizeMetadata=true`,
        {
          headers: {
            accept: "application/json",
            "X-API-Key":
              "tyShpEU75uIoFFn0aUjKftEgLQwuq365cfUWwr6DFil68QRW4C86OgbJJjiz2oRp",
          },
        },
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  public async getTokens(accountAddress: string, chainId: ChainId) {
    try {
      const response = await axios.get(
        `https://api.covalenthq.com/v1/${chainId}/address/${accountAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false`,
        {
          headers: {
            accept: "application/json",
            Authorization: "Basic Y2tleV9lZTI3N2UyYTBlOTU0MjgzOGNmMzAzMjU2NjU6",
          },
        },
      );
      return response.data.data.items;
    } catch (err) {
      console.log(err);
    }
  }
}
