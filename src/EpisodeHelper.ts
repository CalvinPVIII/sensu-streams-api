import dragonBall from "./episodes/DragonBall.ts";
import dragonBallZ from "./episodes/DragonBallZ.ts";
import dragonBallKai from "./episodes/DragonBallKai.ts";
import dragonBallSuper from "./episodes/DragonBallSuper.ts";
import dragonBallGt from "./episodes/DragonBallGt.ts";

import Scraper from "./Scraper.ts";

import { episode, file, series } from "./Types";

export default class EpisodeHelper {
  static series: { [key: string]: series } = {
    dragonBall: dragonBall,
    dragonBallZ: dragonBallZ,
    dragonBallKai: dragonBallKai,
    dragonBallSuper: dragonBallSuper,
    dragonBallGt: dragonBallGt,
  };
  static nonWorkingSources: Array<string> = ["Gogo", "Gogoanime", "KimAnime", "AllAnime"];

  static updateNonWorkingSources(sourceName: string): string {
    if (this.nonWorkingSources.includes(sourceName)) {
      const index = this.nonWorkingSources.indexOf(sourceName);
      this.nonWorkingSources.splice(index, 1);
      return "removed";
    } else {
      this.nonWorkingSources.push(sourceName);
      return "added";
    }
  }

  static async getEpisodeFiles(episode: episode) {
    // const files = new Promise((resolve, reject) => {
    let subFiles: Array<file> = [];
    let dubFiles: Array<file> = [];
    await Promise.all(
      episode.sub.sources.map((episode) => {
        if (!EpisodeHelper.nonWorkingSources.includes(episode.source)) {
          const scrapeMethod = Scraper.scraperMethods[episode.source];
          console.log(scrapeMethod);
          subFiles.push(scrapeMethod(episode.video));
        }
      })
    );
    await Promise.all(
      episode.dub.sources.map((episode) => {
        if (!EpisodeHelper.nonWorkingSources.includes(episode.source)) {
          const scrapeMethod = Scraper.scraperMethods[episode.source];
          dubFiles.push(scrapeMethod(episode.video));
        }
      })
    );
    return { dub: dubFiles, sub: subFiles };
  }
}
