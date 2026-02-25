import React from "react";
import { IconType } from "react-icons";

type WrapperProps = React.HTMLAttributes<HTMLDivElement>;
type TextProps = React.HTMLAttributes<HTMLParagraphElement>;

interface IconTextProps {
  icon: IconType;
  text?: string;
  size?: number;
  wrapperProps?: WrapperProps;
  textProps?: TextProps;
}

export function IconWithText({ icon: Icon, text, size = 24, wrapperProps, textProps }: IconTextProps) {
  return (
    <div {...wrapperProps} className={`flex items-center gap-1.5 ${wrapperProps?.className ?? ""}`}>
      <Icon size={size} />
      <p {...textProps}>{text}</p>
    </div>
  );
}
