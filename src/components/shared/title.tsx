import React from "react";

interface TitleProps {
  title?: string;
  className?: string;
}

const TitleHeader = (props: TitleProps) => {
  return (
    <div className={`font-semibold text-base md:text-lg ${props.className} `}>
      {props.title}
    </div>
  );
};

export default TitleHeader;
