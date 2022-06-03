import React from "react";

function convertText(text: string): JSX.Element {
  if (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif')) {
    return (
      <img height={"100%"} width={"100%"} src={text} />
    );
  } else if (text.endsWith('.mp4') || text.endsWith('.mp3')) {
    return (
      <video height={"100%"} width={"100%"} controls>
        <source src={text} type="video/mp4" />
      </video>
    );
  } else {
    return (
      <p style={{height:"100%", width:"100%", overflow:"auto"}}>{text}</p>
    );
  }
}

function StaticElement({text, style}: any): JSX.Element {
  return (
    <div style={style}>
      {convertText(text)}
    </div>
  );
}

export default StaticElement;
