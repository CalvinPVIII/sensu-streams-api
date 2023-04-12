import axios from "axios";
// const cheerio = require("cheerio");

export default class Scraper {
  static owlOrganizer(url: string) {
    return [
      {
        file: url,
        label: "Auto",
        type: "mp4",
      },
    ];
  }

  static allAnimeScrape(url: string) {
    axios.get(url).then((response: any) => {
      return {
        file: "https://workfields.backup-server222.lol/" + response.data.match(/lol%2F(.*?)&amp/)[1],
        label: "auto",
        type: "mp4",
      };
    });
  }

  static enimeScrape(episodeId: string) {
    axios.get(`https://api.consumet.org/anime/enime/watch?episodeId=${episodeId}`).then((response: any) => {
      const output = response.data.sources.map((source: any) => ({
        file: source.url,
        label: source.quality,
        type: "hls",
      }));
      return output;
    });
  }

  static gogoApiScrape(url: string) {
    axios.get(url).then((response: any) => {
      if (response.data.sources) {
        console.log(response.data.sources);
        return response.data.sources;
      } else {
        return "Error";
      }
    });
  }

  static scraperMethods: { [key: string]: Function } = {
    "Anime Owl": this.owlOrganizer,
    Gogoapi: this.gogoApiScrape,
    AllAnime: this.allAnimeScrape,
    Enime: this.enimeScrape,
  };
}
