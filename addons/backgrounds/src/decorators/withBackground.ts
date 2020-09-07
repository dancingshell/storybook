import { StoryFn as StoryFunction, StoryContext, useMemo, useEffect } from '@storybook/addons';

import { PARAM_KEY as BACKGROUNDS_PARAM_KEY } from '../constants';
import { clearStyles, addStyles, getBackgroundColorByName } from '../helpers';

export const withBackground = (StoryFn: StoryFunction, context: StoryContext) => {
  const { globals, parameters } = context;
  const globalsBackgroundColor = globals[BACKGROUNDS_PARAM_KEY]?.value;
  const backgroundsConfig = parameters[BACKGROUNDS_PARAM_KEY];

  const selectedBackgroundColor = useMemo(() => {
    if (backgroundsConfig.disable) {
      return 'transparent';
    }

    return getBackgroundColorByName(
      globalsBackgroundColor,
      backgroundsConfig.values,
      backgroundsConfig.default
    );
  }, [backgroundsConfig, globalsBackgroundColor]);

  const isActive = useMemo(
    () => selectedBackgroundColor && selectedBackgroundColor !== 'transparent',
    [selectedBackgroundColor]
  );

  const selector =
    context.viewMode === 'docs' ? `#anchor--${context.id} .docs-story` : '.sb-show-main';

  const backgroundStyles = useMemo(() => {
    return `
      ${selector} {
        background-color: ${selectedBackgroundColor} !important;
        transition: background-color 0.3s;
      }
    `;
  }, [selectedBackgroundColor, selector]);

  useEffect(() => {
    const selectorId =
      context.viewMode === 'docs'
        ? `addon-backgrounds-docs-${context.id}`
        : `addon-backgrounds-color`;

    if (!isActive) {
      clearStyles(selectorId);
      return;
    }

    addStyles(selectorId, backgroundStyles);
  }, [isActive, backgroundStyles, context]);

  return StoryFn();
};
