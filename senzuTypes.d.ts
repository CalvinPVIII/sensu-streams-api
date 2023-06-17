export interface source {
  source: string;
  video: string;
}

export interface languageOption {
  sources: Array<source>;
  episodeLength: number;
}

export interface episode {
  dub: languageOption;
  sub: languageOption;
  episodeInfo: string;
}

export interface series {
  [key: number]: episode;
}

export interface file {
  file: string;
  label: string;
  type: string;
}

export interface StructuredFileInfo {
  dub: { [key: string]: Array<file> };
  sub: { [key: string]: Array<file> };
  episodeInfo: string;
  dubLength: number;
  subLength: number;
}
