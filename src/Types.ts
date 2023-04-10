export type source = {
  source: string;
  video: string;
};

export type languageOption = {
  sources: Array<source>;
  episodeLength: number;
};

export type episode = {
  dub: languageOption;
  sub: languageOption;
  episodeInfo: string;
};

export type series = {
  [key: number]: episode;
};
