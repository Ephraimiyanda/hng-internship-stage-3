import React from "react";
import {Image} from "@nextui-org/react";

interface PhotoProps {
  index: number;
  onClick?: (event: React.MouseEvent<HTMLImageElement>, args: { photo: any; index: number }) => void;
  photo: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  margin: string;
  direction: string;
  top?: string;
  left?: string;
}

const imgWithClick = { cursor: "pointer" };

const Photo: React.FC<PhotoProps> = ({ index, onClick, photo, margin, direction, top, left }) => {
  const imgStyle: React.CSSProperties = { margin: margin };
  if (direction === "column") {
    imgStyle.position = "absolute";
    imgStyle.left = left || "0"; // Default value if left is not provided
    imgStyle.top = top || "0"; // Default value if top is not provided
  }

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (onClick) {
      onClick(event, { photo, index });
    }
  };

  return (
    <Image
    className="max-h-[280px] max-w-[250px] w-full float-right"
    radius="none"
    isZoomed
      style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
      {...photo}
      onClick={onClick ? handleClick : undefined}
      alt="img"
    />
  );
};

export default Photo;
