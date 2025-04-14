import { declareIndexPlugin, ReactRNPlugin, AppEvents } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

type AnswerButton = 'immediately' | 'with-effort' | 'partial' | 'forgotten' | 'too-soon';

async function numberOfAnswerButtonsVisible(plugin: ReactRNPlugin): Promise<number> {
  let visibleCount = 0;
  for (const buttonId of [
    'immediately',
    'with-effort',
    'partial',
    'forgotten',
    'too-soon',
  ]) {
    const isVisible = await plugin.settings.getSetting(buttonId);
    if (isVisible) {
      visibleCount++;
    }
  }
  return visibleCount;
}

async function getSavedDisplayStyleForButton(buttonName: AnswerButton, plugin: ReactRNPlugin): Promise<'none' | 'inherit'> {
  const isVisible = await plugin.settings.getSetting(buttonName)
  return isVisible ? 'inherit' : 'none';
}

async function registerPluginCss(plugin: ReactRNPlugin): Promise<void> {
  plugin.app.registerCSS(
    'queue-container',
    `
      .rn-queue__answer-btn--immediately {
        display: ${await getSavedDisplayStyleForButton('immediately', plugin)};
      }

      .rn-queue__answer-btn--with-effort {
        display: ${await getSavedDisplayStyleForButton('with-effort', plugin)};
      }
      
      .rn-queue__answer-btn--partial {
        display: ${await getSavedDisplayStyleForButton('partial', plugin)};
      }
      
      .rn-queue__answer-btn--forgotten {
        display: ${await getSavedDisplayStyleForButton('forgotten', plugin)};
      }

      .rn-queue__answer-btn--too-soon {
        display: ${await getSavedDisplayStyleForButton('too-soon', plugin)};
      }

      .spaced-repetition__accuracy-buttons {
        grid-template-columns: repeat(${await numberOfAnswerButtonsVisible(plugin)}, minmax(0, 1fr)) !important;
      }
    `
  );
}

async function onActivate(plugin: ReactRNPlugin): Promise<void> {
  const toRegisterAllPluginSettings = [
    { id: "immediately" },
    { id: "with-effort" },
    { id: "partial" },
    { id: "forgotten" },
    { id: "too-soon" },
  ].map(setting =>
    plugin.settings.registerBooleanSetting({
      id: setting.id,
      title: `Show '${setting.id}' answer button`,
      defaultValue: true,
    })
  );
  await Promise.all(toRegisterAllPluginSettings);

  // Register CSS in case RemNote starts with a queue open (QueueEnter event not fired):
  await registerPluginCss(plugin);
  // Otherwise, only necessary to update CSS from settings when used:
  plugin.event.addListener(AppEvents.QueueEnter, undefined, async () => {
    await registerPluginCss(plugin);
  });
}
async function onDeactivate(_: ReactRNPlugin): Promise<void> {}
declareIndexPlugin(onActivate, onDeactivate);
