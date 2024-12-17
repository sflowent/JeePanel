import { TextFont } from './features/text/models/text-font.model';
import { clone } from './functions/clone';

export const DefaultValues = {
  // ValueFont: () => TextFont.fromAutoSize (30, 25),
  // LabelFont:  () => TextFont.fromAutoSize (25, 20),
  ValueFont: () => TextFont.fromSize (18),
  LabelFont:  () => TextFont.fromSize (12),
};
