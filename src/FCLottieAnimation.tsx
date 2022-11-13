import React, { CSSProperties, memo } from "react";
import lottie, { AnimationItem } from "lottie-web";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import _ from "lodash";
const getNextFrame = (
  currentFrame: number,
  totalFrames: number,
  loop?: boolean
) => {
  return !loop
    ? Math.min(currentFrame, totalFrames)
    : currentFrame % totalFrames;
};
// Simple and limited interface to start with
interface RemotionLottieProps {
  animationData?: any;
  className?: string;
  loop?: boolean;
  path?: string;
  speed?: number;
  style?: CSSProperties;
}
const RemotionLottie = memo(
  ({
    animationData,
    className,
    loop,
    path,
    speed = 1,
    style
  }: RemotionLottieProps) => {
    const animationRef = React.useRef<AnimationItem>();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [handle] = React.useState(delayRender);
    const frame = useCurrentFrame();

    React.useEffect(() => {
      if (!containerRef.current) {
        return;
      }
      function parseAnimationData() {
        if (animationData == null || typeof animationData !== "object")
          return animationData;
        // https://github.com/mifi/react-lottie-player/issues/11#issuecomment-879310039
        // https://github.com/chenqingspring/vue-lottie/issues/20
        if (typeof animationData.default === "object") {
          return _.cloneDeep(animationData.default);
        }
        // cloneDeep to prevent memory leak. See #35
        return _.cloneDeep(animationData);
      }
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        autoplay: false,
        animationData: parseAnimationData(),
        path
      });
      const { current: animation } = animationRef;
      const onComplete = () => {
        animation.setSpeed(speed);
        continueRender(handle);
      };
      animation.addEventListener("DOMLoaded", onComplete);
      return () => {
        animation.removeEventListener("DOMLoaded", onComplete);
        animation.destroy();
        animationRef.current = undefined;
      };
    }, [animationData, handle, path, speed]);
    React.useEffect(() => {
      if (!animationRef.current) {
        return;
      }
      const { totalFrames } = animationRef.current;
      const expectedFrame = frame * speed;
      // Switch the last param to `true` to loop it
      const segment = getNextFrame(expectedFrame, totalFrames, loop);
      animationRef.current.goToAndStop(segment, true);
    }, [frame, animationData, loop, speed]);
    return <div ref={containerRef} className={className} style={style} />;
  }
);
export default RemotionLottie;