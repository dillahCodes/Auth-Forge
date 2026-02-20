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

export function IconWithText({ icon: Icon, text, ...props }: IconTextProps) {
  return (
    <div {...props} className={`flex items-center gap-1.5 ${props.wrapperProps?.className}`}>
      <Icon size={props.size || 24} />
      <p {...props.textProps}>{text}</p>
    </div>
  );
}
