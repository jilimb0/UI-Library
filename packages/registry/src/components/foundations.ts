import { actionsComponents } from './actions';
import { dataDisplayComponents } from './data-display';
import { feedbackComponents } from './feedback';
import { formsComponents } from './forms';
import { layoutComponents } from './layout';
import { mediaComponents } from './media';
import { navigationComponents } from './navigation';
import { overlaysComponents } from './overlays';
import type { RegistryComponent } from './shared';
import { typographyComponents } from './typography';

export * from './shared';

export const foundationalComponents: RegistryComponent[] = [
  ...actionsComponents,
  ...navigationComponents,
  ...typographyComponents,
  ...feedbackComponents,
  ...mediaComponents,
  ...formsComponents,
  ...layoutComponents,
  ...overlaysComponents,
  ...dataDisplayComponents,
];
