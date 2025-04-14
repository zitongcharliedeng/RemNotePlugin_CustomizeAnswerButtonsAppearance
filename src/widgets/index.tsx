import { declareIndexPlugin, ReactRNPlugin, AppEvents, SettingEvents } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

type AnswerButton = 'immediately' | 'with-effort' | 'partial' | 'forgotten' | 'too-soon';
interface ButtonSetting {
  id: string;
  buttonName: AnswerButton;
}

async function numberOfAnswerButtonsVisible(plugin: ReactRNPlugin): Promise<number> {
  let visibleCount = 0;
  for (const buttonName of [
    'immediately',
    'with-effort',
    'partial',
    'forgotten',
    'too-soon',
  ]) {
    const isVisible = await plugin.settings.getSetting(`display__${buttonName}`);
    if (isVisible) {
      visibleCount++;
    }
  }
  return visibleCount;
}

async function getSavedDisplayStyleForButton(buttonName: AnswerButton, plugin: ReactRNPlugin): Promise<'none' | 'inherit'> {
  const isVisible = await plugin.settings.getSetting<boolean>(`display__${buttonName}`);
  return isVisible ? 'inherit' : 'none';
}

async function getSavedBackgroundColorStyleForButton(buttonName: AnswerButton, plugin: ReactRNPlugin): Promise<string> {
  const cssColorName = await plugin.settings.getSetting<string>(`background-color__${buttonName}`)
  return cssColorName ?? 'transparent';
}

async function registerPluginCss(plugin: ReactRNPlugin): Promise<void> {
  plugin.app.registerCSS(
    'queue-container',
    `
      .rn-queue__answer-btn--immediately {
        display: ${await getSavedDisplayStyleForButton('immediately', plugin)};
        background-color: ${await getSavedBackgroundColorStyleForButton('immediately', plugin)} !important;
      }

      .rn-queue__answer-btn--with-effort {
        display: ${await getSavedDisplayStyleForButton('with-effort', plugin)};
        background-color: ${await getSavedBackgroundColorStyleForButton('with-effort', plugin)} !important;
      }
      
      .rn-queue__answer-btn--partial {
        display: ${await getSavedDisplayStyleForButton('partial', plugin)};
        background-color: ${await getSavedBackgroundColorStyleForButton('partial', plugin)} !important;
      }
      
      .rn-queue__answer-btn--forgotten {
        display: ${await getSavedDisplayStyleForButton('forgotten', plugin)};
        background-color: ${await getSavedBackgroundColorStyleForButton('forgotten', plugin)} !important;
      }

      .rn-queue__answer-btn--too-soon {
        display: ${await getSavedDisplayStyleForButton('too-soon', plugin)};
        background-color: ${await getSavedBackgroundColorStyleForButton('too-soon', plugin)} !important;
      }

      .spaced-repetition__accuracy-buttons {
        grid-template-columns: repeat(${await numberOfAnswerButtonsVisible(plugin)}, minmax(0, 1fr)) !important;
      }
    `
  );
}

async function onActivate(plugin: ReactRNPlugin): Promise<void> {
  const allBooleanPluginSettings: ButtonSetting[] = [
    { id: "display__immediately", buttonName: "immediately" },
    { id: "display__with-effort", buttonName: "with-effort" },
    { id: "display__partial", buttonName: "partial" },
    { id: "display__forgotten", buttonName: "forgotten" },
    { id: "display__too-soon", buttonName: "too-soon" },
  ];
  const allStringPluginSettings: ButtonSetting[] = [
    { id: "background-color__immediately", buttonName: "immediately" },
    { id: "background-color__with-effort", buttonName: "with-effort" },
    { id: "background-color__partial", buttonName: "partial" },
    { id: "background-color__forgotten", buttonName: "forgotten" },
    { id: "background-color__too-soon", buttonName: "too-soon" },
  ];
  const toRegisterAllPluginSettings = [
    ...allBooleanPluginSettings.map((setting) => {
      plugin.event.addListener(AppEvents.SettingChanged, `${setting.id}`, async () => {
        await registerPluginCss(plugin);
      });
      return plugin.settings.registerBooleanSetting({
        id: setting.id,
        title: `Show '${setting.buttonName}' answer button`,
        defaultValue: true,
      })
    })
      ,
    ...allStringPluginSettings.map((setting) => {
      plugin.event.addListener(AppEvents.SettingChanged, `${setting.id}`, async () => {
        await registerPluginCss(plugin);
      });
      return plugin.settings.registerStringSetting({
        id: setting.id,
        title: `Background color for '${setting.buttonName}' answer button. 
          Use a CSS color name or hex code (e.g. #FF5733)`,
        defaultValue: 'transparent',
      })
    }
    )
  ];
  await Promise.all(toRegisterAllPluginSettings);

  // Register the CSS styles for the first time of the session.
  await registerPluginCss(plugin);
}
async function onDeactivate(_: ReactRNPlugin): Promise<void> {}
declareIndexPlugin(onActivate, onDeactivate);
