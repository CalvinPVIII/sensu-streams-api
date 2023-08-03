import dragonBall from "./episodes/DragonBall.ts";
import dragonBallZ from "./episodes/DragonBallZ.ts";
import dragonBallKai from "./episodes/DragonBallKai.ts";
import dragonBallSuper from "./episodes/DragonBallSuper.ts";
import dragonBallGt from "./episodes/DragonBallGt.ts";

import dbMovies from "./movies/dragonBallMovies.ts";
import dbzMovies from "./movies/dragonBallZMovies.ts";
import dbsMovies from "./movies/dragonBallSuperMovies.ts";

import Scraper from "./Scraper.ts";

import { episode, file, sourceFiles, series, StructuredFileInfo } from "../senzuTypes";

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
    dragonballsuper: dbsMovies,
  };

  // This method returns the episodes/links for a given series or movie, it does not return the usable files
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

  // This method does return the direct streamable files for a given episode
  static async getEpisodeFiles(episode: episode): Promise<StructuredFileInfo> {
    // console.log("EPISODE -----");
    // console.log(episode);
    // console.log("---------");
    const files = new Promise<StructuredFileInfo>(async (resolve, reject) => {
      let output: StructuredFileInfo = {
        dubLength: episode.dub.episodeLength,
        subLength: episode.sub.episodeLength,
        episodeInfo: episode.episodeInfo,
        dub: {},
        sub: {},
      };
      await Promise.all(
        episode.sub.sources.map(async (episode) => {
          if (!EpisodeHelper.nonWorkingSources.includes(episode.source)) {
            // if (output.sub[episode.source]) {
            const scrapeMethod = Scraper.scraperMethods[episode.source];
            const files: file[] | "Error" = await scrapeMethod(episode.video);

            if (files && files !== "Error") {
              const result: sourceFiles = { files: files, introOffset: episode.introOffset, outroOffset: episode.outroOffset };
              console.log(result);
              output.sub[episode.source] = result;
              // }
            }
          }
        })
      );
      await Promise.all(
        episode.dub.sources.map(async (episode) => {
          if (!EpisodeHelper.nonWorkingSources.includes(episode.source)) {
            // if (output.dub[episode.source]) {
            const scrapeMethod = Scraper.scraperMethods[episode.source];
            const files: file[] | "Error" = await scrapeMethod(episode.video);
            if (files && files !== "Error") {
              const result: sourceFiles = { files: files, introOffset: episode.introOffset, outroOffset: episode.outroOffset };
              output.dub[episode.source] = result;
            }
            // }
          }
        })
      );
      resolve(output);
    });
    return files;
  }
}
