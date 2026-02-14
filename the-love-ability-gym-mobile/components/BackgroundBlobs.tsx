import React from 'react';

const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#e3eadd] rounded-full blur-[120px] opacity-70"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-[#f2e6e6] rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-[#f0f5ee] rounded-full blur-[90px] opacity-50"></div>
    </div>
  );
};

export default BackgroundBlobs;