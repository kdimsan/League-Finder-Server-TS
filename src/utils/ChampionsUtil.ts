import axios from "axios";
import { ChampionData } from "../@types/champions/championsResponses";

class ChampionsUtil {
  private readonly CURRENT_PATCH = process.env.CURRENT_PATCH;
  private language = "en_US";
  private readonly championsUrl = `https://ddragon.leagueoflegends.com/cdn/${this.CURRENT_PATCH}/data/${this.language}/champion.json`;

  async findChampionsByKey(key: number): Promise<ChampionData | string> {
    const championsRes: ChampionData = (await axios.get(this.championsUrl)).data
      .data;

    const championsArray: ChampionData[] = Object.values(championsRes);

    const championsWithKey: ChampionData | undefined = championsArray.find(
      (champion) => Number(champion.key) === key
    );

    if (championsWithKey) {
      return championsWithKey;
    } else {
      return "Cannot find champion by its key";
    }
  }
}

module.exports = new ChampionsUtil();
