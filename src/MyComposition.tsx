import React, { Fragment } from 'react';
import { Freeze, Sequence } from 'remotion';
import LottieAnimation from './LottieAnimation';
import VideoComponent from './VideoComponent';

const MyComposition = (props: { play?: boolean; animeObj?: any; }) => {
  const seqDetails = {
    from: 0,
    durationInFrames: 9648,
  };
  const freezeFrame = 370;

  return (
    <Fragment>
      <Sequence from={0}>
        <VideoComponent />
      </Sequence>
      <Sequence from={seqDetails.from} durationInFrames={2}>
        <LottieAnimation
          height={1080}
          width={1920}
          animObj={props.animeObj}
        />
      </Sequence>
      <Sequence from={seqDetails.from + 1} durationInFrames={360}>
        <LottieAnimation
          height={1080}
          width={1920}
          animObj={props.animeObj}
        />
      </Sequence>
      <Sequence
        from={seqDetails.from + 360 - 15}
        durationInFrames={
          seqDetails.durationInFrames <= 600
            ? 180
            : seqDetails.durationInFrames - 400
        }
      >
        <Freeze frame={360 + freezeFrame}>
          <LottieAnimation
            height={1080}
            width={1920}
            animObj={props.animeObj}
          />
        </Freeze>
      </Sequence>
      <Sequence from={seqDetails.durationInFrames + seqDetails.from - 120}>
        <Sequence from={-750}>
          <LottieAnimation
            height={1080}
            width={1920}
            animObj={props.animeObj}
          />
        </Sequence>
      </Sequence>
    </Fragment>
  );
};

export default MyComposition;
