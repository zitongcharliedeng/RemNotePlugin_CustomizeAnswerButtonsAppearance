import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

async function onActivate(plugin: ReactRNPlugin) {
  function numberOfAnswerButtons() {
    return 2;
  };

  function getSavedDisplayStyleForButton(button: string) {
    switch (button) {
      case 'immediately':
        return 'none';
      case 'with-effort':
        return 'inherit';
      case 'partial':
        return 'none';
      case 'forgotten':
        return 'none';
      case 'too-soon':
        return 'inherit';
      default:
        return 'inherit';
    }
  }

  plugin.app.registerCSS(
    'queue-container',
    `
      .rn-queue__answer-btn--immediately {
        display: ${getSavedDisplayStyleForButton('immediately')};
      }

      .rn-queue__answer-btn--with-effort {
        display: ${getSavedDisplayStyleForButton('with-effort')};
      }
      
      .rn-queue__answer-btn--partial {
        display: ${getSavedDisplayStyleForButton('partial')};
      }
      
      .rn-queue__answer-btn--forgotten {
        display: ${getSavedDisplayStyleForButton('forgotten')};
      }

      .rn-queue__answer-btn--too-soon {
        display: ${getSavedDisplayStyleForButton('too-soon')};
      }

      .spaced-repetition__accuracy-buttons {
        grid-template-columns: repeat(${numberOfAnswerButtons()}, minmax(0, 1fr)) !important;
      }
    `
  );
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
