import RemotionLottie from './FCLottieAnimation';

const LottieAnimation = (props: {
  animObj: object;
  width: number;
  height: number;
}) => {
  const fontName = localStorage.getItem('fontName') || 'Inter';

  return (
    <RemotionLottie
      animationData={props.animObj}
      style={{
        fontFamily: fontName,
        marginTop: -1,
        width: props.width,
        height: props.height,
      }}
      speed={0.5}
    />
  );
};

export default LottieAnimation;
