
import { Player } from '@remotion/player';
import animationData from './animation.json';
import MyComposition from './MyComposition';
import './videoPlayer.css';

const VideoPlayer: React.FC = () => {

  return (
    <div className="container">
      <div className='player'>
        <Player
          durationInFrames={60 * 201}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={60}
          loop={true}
          component={MyComposition}
          controls={true}
          showVolumeControls={true}
          allowFullscreen={true}
          clickToPlay={true}
          spaceKeyToPlayOrPause={true}
          inputProps={{
            play: true,
            animeObj: animationData,
          }}
          style={{ backgroundColor: 'black', width: '100%' }}
        />
      </div>
      <button
        onClick={() => {
          console.log('render button clicked')
        }}
        className='renderButton'
      >
        <p>
          Render Video
        </p>
      </button>
    </div>
  );
};
export default VideoPlayer;
