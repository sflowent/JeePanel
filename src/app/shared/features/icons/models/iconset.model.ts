export class IconSet {
  id: string;
  name: string;
  type: string;
  colorize: boolean;

  info?: IconSetInfo;
}

export class IconSetInfo {
  notice: string;
  url: string;
  basePath: string;
  icons: string[];
}
