import React from "react";

/**
 * Convert text to media 
 *
 * @param {string} text
 * @return {*}  {JSX.Element}
 */
function convertText(text: string): JSX.Element {
  // Check if the text ends with a media extension
  if (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.jpeg') || text.endsWith('.gif')) {
    return (
      // Display the image
      <img height={"100%"} width={"100%"} src={text} />
    );
  } else if (text.endsWith('.mp4') || text.endsWith('.mp3')) {
    return (
      // Display the video
      <video height={"100%"} width={"100%"} src={text} controls/>
    );
  } else {
    return (
      // Display the text
      <p style={{height:"100%", width:"100%", overflow:"auto"}}>{text}</p>
    );
  }
}

/**
 * @param {*} {text, style}
 * @return {*}  {JSX.Element}
 */
export default function StaticElement({text, style}: any): JSX.Element {
  return (
    <div style={style}>
      {convertText(text)}
    </div>
  );
};
