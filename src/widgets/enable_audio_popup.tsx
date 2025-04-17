
import {
    renderWidget,
  } from "@remnote/plugin-sdk";
  
  /**
   * Returns a React component that plays a silent sound when manually clicked.
   * This allows proceeding invocations of Audio in other components to work for the rest
   * of the session.
   * 
   * This the current plugin workaround for: stackoverflow.com/questions/49930680
   */
  function EnableAudioPopup(): JSX.Element {
    return (
      <>
        {
          <div
            className="flex flex-col rounded-md border border-solid rn-clr-background-primary rn-clr-content-primary p-4"
          >
            <div>
              Play this silent audio to enable answer sound effects for the rest of the session.
            </div>
            <br/>
            <audio controls className="w-full max-w-xs mx-auto block">
              <source src="https://www.myinstants.com/media/sounds/1-second-silence.mp3" type="audio/mpeg"/>
            </audio>
            <br/>
            <div>
              After, you can close this popup by clicking anywhere else.
            </div>
          </div>
        }
      </>
    );
  }
  
  renderWidget(EnableAudioPopup);
  