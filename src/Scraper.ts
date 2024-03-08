import axios from "axios";
import { file } from "../senzuTypes";
import { ANIME } from "@consumet/extensions";
export default class Scraper {
  private static proxy = "http://localhost:8080/";
  static urlOrganizer(url: string) {
    return [
      {
        file: url,
        label: "Auto",
        type: "mp4",
      },
    ];
  }

  static async enimeScrape(episodeId: string): Promise<file | Array<file> | string> {
    try {
      const response = await axios.get(`${Scraper.proxy}https://api.consumet.org/anime/enime/watch?episodeId=${episodeId}`, { timeout: 3000 });
      const output: file[] = response.data.sources.map((source: any) => ({
        file: source.url,
        label: source.quality,
        type: "hls",
      }));

      return output;
    } catch (error) {
      console.log(error);
      return "Error";
    }
  }

  static async gogoApiScrape(episodeId: string): Promise<file | Array<file> | string> {
    try {
      const gogoanime = new ANIME.Gogoanime();
      const response = await gogoanime.fetchEpisodeSources(episodeId);
      if (response.sources) {
        const output: file[] = response.sources.map((source) => ({
          file: source.url,
          label: source.quality || "",
          type: source.isM3U8 ? "hls" : "mp4",
        }));

        return output;
      } else {
        return "Error";
      }
    } catch (error) {
      console.log(error);
      return "Error";
    }
  }

  static scraperMethods: { [key: string]: Function } = {
    "Anime Owl": this.urlOrganizer,
    Gogoapi: this.gogoApiScrape,
    AllAnime: this.urlOrganizer,
    Enime: this.enimeScrape,
  };
}
