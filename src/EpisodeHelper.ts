import dragonBall from "./episodes/DragonBall.ts";
import dragonBallZ from "./episodes/DragonBallZ.ts";
import dragonBallKai from "./episodes/DragonBallKai.ts";
import dragonBallSuper from "./episodes/DragonBallSuper.ts";
import dragonBallGt from "./episodes/DragonBallGt.ts";

import dbMovies from "./movies/dragonBallMovies.ts";
import dbzMovies from "./movies/dragonBallZMovies.ts";
import dbsmovies from "./movies/dragonBallMovies.ts";

import Scraper from "./Scraper.ts";

import { episode, file, series } from "../senzuTypes";

export default class EpisodeHelper {
  static episodes: { [key: string]: series } = {
    dragonball: dragonBall,
    dragonballz: dragonBallZ,
    dragonballkai: dragonBallKai,
    dragonballsuper: dragonBallSuper,
    dragonballgt: dragonBallGt,
  };

  static movies: { [key: string]: series } = {
    dragonball: dbMovies,
    dragonballz: dbzMovies,
    dragonballsuper: dbsmovies,
  };

  static getMedia(mediaType: string, seriesName?: string): { [key: string]: series } | null | series {
    if (mediaType.toLowerCase() === "movies") {
      if (seriesName) {
        const series = EpisodeHelper.movies[seriesName.toLowerCase()];
        if (series) {
          return series;
        }
      }
      return EpisodeHelper.movies;
    } else if (mediaType.toLowerCase() === "episodes") {
      if (seriesName) {
        const series = EpisodeHelper.episodes[seriesName.toLowerCase()];
        if (series) {
          return series;
        }
      }
      return EpisodeHelper.episodes;
    } else {
      return null;
    }
  }

  static nonWorkingSources: Array<string> = ["Gogo", "Gogoanime", "KimAnime"];

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
    const files = new Promise(async (resolve, reject) => {
      let subFiles: Array<file> = [];
      let dubFiles: Array<file> = [];
      await Promise.all(
        episode.sub.sources.map(async (episode) => {
          if (!EpisodeHelper.nonWorkingSources.includes(episode.source)) {
            const scrapeMethod = Scraper.scraperMethods[episode.source];
            const files = await scrapeMethod(episode.video);
            console.log(files);
            if (files && files !== "Error") {
              subFiles.push(files);
            }
          }
        })
      );
      await Promise.all(
        episode.dub.sources.map(async (episode) => {
          if (!EpisodeHelper.nonWorkingSources.includes(episode.source)) {
            const scrapeMethod = Scraper.scraperMethods[episode.source];
            const files = await scrapeMethod(episode.video);
            if (files && files !== "Error") {
              dubFiles.push(files);
            }
          }
        })
      );
      resolve({ dub: dubFiles, sub: subFiles });
    });
    return files;
  }
}
