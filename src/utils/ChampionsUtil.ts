import { ChampionData } from "../@types/champions/championsResponses";
import { getRedis } from "../redisConfig";

class ChampionsUtil {
  async findChampionsByKey(key: number): Promise<ChampionData | string> {
    const allChampionsRedis = await getRedis("all-champions");
    const allChampions = JSON.parse(allChampionsRedis);

    const championsArray: ChampionData[] = Object.values(allChampions);

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
