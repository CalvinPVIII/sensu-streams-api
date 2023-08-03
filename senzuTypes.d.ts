export interface source {
  source: string;
  video: string;
  introOffset: number;
  outroOffset: number;
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

export interface sourceFiles {
  files: Array<file>;
  introOffset: number;
  outroOffset: number;
}

export interface StructuredFileInfo {
  dub: { [key: string]: sourceFiles };
  sub: { [key: string]: sourceFiles };
  episodeInfo: string;
  dubLength: number;
  subLength: number;
}
