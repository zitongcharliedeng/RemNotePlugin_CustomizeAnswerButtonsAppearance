import { declareIndexPlugin, ReactRNPlugin, AppEvents } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

type AnswerButton = 'immediately' | 'with-effort' | 'partial' | 'forgotten' | 'too-soon';

async function onActivate(plugin: ReactRNPlugin) {
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

  function numberOfAnswerButtons() {
    return 2;
  };

  async function getSavedDisplayStyleForButton(buttonName: AnswerButton): Promise<'none' | 'inherit'> {
    const isVisible = await plugin.settings.getSetting(buttonName)
    return isVisible ? 'inherit' : 'none';
  }

  // Only necessary to update CSS when it is needed (i.e. when the answer queue is opened)
  plugin.event.addListener(AppEvents.QueueEnter, undefined, async () => {
    plugin.app.registerCSS(
      'queue-container',
      `
        .rn-queue__answer-btn--immediately {
          display: ${await getSavedDisplayStyleForButton('immediately')};
        }
  
        .rn-queue__answer-btn--with-effort {
          display: ${await getSavedDisplayStyleForButton('with-effort')};
        }
        
        .rn-queue__answer-btn--partial {
          display: ${await getSavedDisplayStyleForButton('partial')};
        }
        
        .rn-queue__answer-btn--forgotten {
          display: ${await getSavedDisplayStyleForButton('forgotten')};
        }
  
        .rn-queue__answer-btn--too-soon {
          display: ${await getSavedDisplayStyleForButton('too-soon')};
        }
  
        .spaced-repetition__accuracy-buttons {
          grid-template-columns: repeat(${numberOfAnswerButtons()}, minmax(0, 1fr)) !important;
        }
      `
    );
  });

}

async function onDeactivate(_: ReactRNPlugin) { }

declareIndexPlugin(onActivate, onDeactivate);
