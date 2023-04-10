const axios = require("axios");
const cheerio = require("cheerio");

export default class Scraper {
  static gogoAnimeScrape = async (url: string) => {
    try {
      const html = await axios.get(url, {
        mode: "cors",
      });
      const $ = cheerio.load(html.data);
      const iframe = $("iframe").toArray()[0].attribs.src;
      const videoId = iframe.match(/(?<=\/e\/)(.*?)(?=\?domain)/gm)[0];

      const response = await axios.get(iframe, {
        mode: "cors",
        headers: {
          referer: url,
        },
      });
      const key = response.data.match(/(?<=skey = ')(.*?)(?=')/gm)[0];
      const videoLink = `https://vidstream.pro/info/${videoId}?domain=gogoanime.lol&skey=${key}`;
      const video = await axios.get(videoLink, {
        mode: "cors",
        headers: {
          referer: iframe,
        },
      });

      return [
        {
          file: video.data.media.sources[1].file,
          referer: videoLink,
          label: "Auto",
          type: "HLS",
        },
      ];
    } catch (error) {
      console.log(error);
      return "error";
    }
  };

  static gogoApiScrape = async (url: string) => {
    try {
      const data = await axios.get(url, {
        mode: "cors",
        timeout: 10000,
      });

      let file = "error";

      for (let i = 0; i < data.data.sources.length; i++) {
        if (data.data.sources[i].file.includes("manifest.prod")) {
          file = [
            {
              file: data.data.sources[i].file,
              label: data.data.sources[i].label,
              type: "hls",
            },
          ];
        }
      }
      if (file === "error") {
        for (let i = 0; i < data.data.sources_bk.length; i++) {
          if (
            data.data.sources_bk[i].type === "hls" ||
            data.data.sources_bk[i].label === "hls P"
          ) {
            file = [
              {
                file: data.data.sources_bk[i].file,
                label: data.data.sources_bk[i].label,
                type: "hls",
              },
            ];
          }
        }
      }
      return file;
    } catch (error) {
      console.log(error);
      return "error";
    }
  };

  static async kimAnimeScrape(url: string) {
    try {
      const data = await axios.get(url);
      const $ = cheerio.load(data.data);
      const page = $.html();
      const link = page.match(/(?<=embed)(.*?)(?=&quot)/gm)[0].slice(1);

      const embedPage = await axios.get(
        "https://kimanime.com/episode/embed" + link
      );
      const $$ = cheerio.load(embedPage.data);
      const video = $$("video");

      let files = [];
      Object.values(video.children("source")).forEach((child) => {
        if (child.attribs && !child.attribs.src.includes("gogo-cdn")) {
          const fileObj = {
            file: child.attribs.src,
            label: child.attribs.size,
            type: child.attribs.type,
          };
          files.push(fileObj);
        }
      });
      if (files.length === 0) {
        return "error";
      }
      return files;
    } catch (error) {
      console.log("error");
      console.log(error);
      return "error";
    }
  }

  static owlOrganizer(url: string) {
    return [
      {
        file: url,
        label: "Auto",
        type: "mp4",
      },
    ];
  }
}
