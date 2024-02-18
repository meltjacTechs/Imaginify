import React from 'react';

const TransformedImage = ({ image, type, title, 
    transformationConfig, isTransforming, setIsTransforming,
hasDownload = false}: TransformedImageProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>
      </div>
    </div>
  );
}

export default TransformedImage;
