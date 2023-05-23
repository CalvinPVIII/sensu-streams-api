interface source {
  source: string;
  video: string;
}

interface languageOption {
  sources: Array<source>;
  episodeLength: number;
}

interface episode {
  dub: languageOption;
  sub: languageOption;
  episodeInfo: string;
}

interface series {
  [key: number]: episode;
}

interface file {
  file: string;
  label: string;
  type: string;
}
