import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

async function onActivate(plugin: ReactRNPlugin) {
  function numberOfAnswerButtons() {
    return 2;
  };

  plugin.app.registerCSS(
    'queue-container',
    `
     .rn-queue__answer-btn--immediately {
        display: none;
      }
      
      .rn-queue__answer-btn--partial {
        display: none;
      }
      
      .rn-queue__answer-btn--too-soon {
        display: none;
      }
      
      .spaced-repetition__accuracy-buttons {
        grid-template-columns: repeat(${numberOfAnswerButtons()}, minmax(0, 1fr)) !important;
      }
    `
  );
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
