interface source {
  source: string;
  video: string;
  source: string;
  video: string;
  introOffset: number;
  outroOffset: number;
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

interface StructuredFileInfo {
  dub: { [key: string]: Array<file> };
  sub: { [key: string]: Array<file> };
  episodeInfo: string;
  dubLength: number;
  subLength: number;
}
