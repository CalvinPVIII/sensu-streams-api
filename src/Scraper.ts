import axios from "axios";
import { file } from "./Types.ts";

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

  static async enimeScrape(episodeId: string): Promise<file | Array<file>> {
    const response = await axios.get(`${Scraper.proxy}https://api.consumet.org/anime/enime/watch?episodeId=${episodeId}`);
    const output = response.data.sources.map((source: any) => ({
      file: source.url,
      label: source.quality,
      type: "hls",
    }));

    return output;
  }

  static async gogoApiScrape(url: string): Promise<file | Array<file> | string> {
    const response = await axios.get(Scraper.proxy + url);
    if (response.data.sources) {
      return response.data.sources;
    } else {
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
