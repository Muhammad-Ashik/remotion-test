import { Composition } from 'remotion';

import MyComposition from '../MyComposition';

const RemotionVideo: React.FC = () => {
  return (
    <Composition
      id="HelloWorld"
      component={MyComposition}
      durationInFrames={60 * 201}
      fps={60}
      width={1920}
      height={1080}
    />
  );
};

export default RemotionVideo;
