import React from 'react';
import { Composition } from 'remotion';
import { PhysioPulsePromo } from './PhysioPulsePromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PhysioPulsePromo"
        component={PhysioPulsePromo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
