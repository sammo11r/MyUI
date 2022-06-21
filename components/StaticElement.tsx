import React from "react";

import { DashboardElementType, StaticElementProps } from "../utils/customTypes";
import { elementType } from "../consts/enum";

/**
 * Convert text to media
 *
 * @param {string} text
 * @param {string} mediaDisplaySetting
 * @return {*}  {JSX.Element}
 */
function convertText(text: string, mediaDisplaySetting: string): JSX.Element {
  // Check if the text ends with a media extension
  if (
    mediaDisplaySetting == "MEDIA" &&
    (text.endsWith(".gif") ||
      text.endsWith(".png") ||
      text.endsWith(".jpg") ||
      text.endsWith(".jpeg"))
  ) {
    return (
      // Display the image
      <img height={"100%"} width={"100%"} src={text} />
    );
  } else if (
    mediaDisplaySetting == "MEDIA" &&
    (text.endsWith(".mp4") || text.endsWith(".mp3"))
  ) {
    return (
      // Display the video
      <video height={"100%"} width={"100%"} src={text} controls controlsList="nofullscreen" />
    );
  } else {
    return (
      // Display the text
      <p className="dashboard-text">{text}</p>
    );
  }
}

/**
 * @export
 * @param {StaticElementProps} {
 *   text,
 *   style,
 *   mediaDisplaySetting
 * }
 * @return {*}  {JSX.Element}
 */
export default function StaticElement({
  text,
  style,
  mediaDisplaySetting,
}: StaticElementProps): JSX.Element {
  return <div style={style}>{convertText(text, mediaDisplaySetting)}</div>;
}

/**
 * An empty element used for locations where an element type is required
 */
export const emptyElement: DashboardElementType = {
  name: "",
  ordering: { by: undefined, direction: undefined },
  type: elementType.STATIC,
  query: "",
  text: "",
  x: 0,
  y: 0,
  w: 0,
  h: 0,
};
