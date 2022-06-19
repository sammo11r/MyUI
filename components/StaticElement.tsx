import React from "react";

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
  } else if (mediaDisplaySetting == "MEDIA" && (text.endsWith(".mp4") || text.endsWith(".mp3"))) {
    return (
      // Display the video
      <video height={"100%"} width={"100%"} src={text} controls />
    );
  } else {
    return (
      // Display the text
      <p className="dashboard-text">{text}</p>
    );
  }
}

/**
 * @param {*} {text, style}
 * @return {*}  {JSX.Element}
 */
export default function StaticElement({ text, style, mediaDisplaySetting }: any): JSX.Element {
  return <div style={style}>{convertText(text, mediaDisplaySetting)}</div>;
}
