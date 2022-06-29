import { render, screen } from "@testing-library/react";
import React from "react";
import renderer from "react-test-renderer";
import StaticElement from "../components/StaticElement";
import "@testing-library/jest-dom";

describe("Static element adapts to content", () => {
  it("Renders text correctly", () => {
    render(<StaticElement 
            text={"Some test text!"} 
            mediaDisplaySetting={"MEDIA"}
          />);
    const renderedElement = screen.getByTestId("static-element");
    expect(renderedElement.firstChild).toBeInstanceOf(HTMLParagraphElement);
  })

  it("Renders png image correctly", () => {
    render(<StaticElement 
            text={"Some_img_url.png"} 
            mediaDisplaySetting={"MEDIA"}
          />);
    const renderedElement = screen.getByTestId("static-element");
    expect(renderedElement.firstChild).toBeInstanceOf(HTMLImageElement);
  })

  it("Renders jpg image correctly", () => {
    render(<StaticElement 
            text={"Some_img_url.jpg"} 
            mediaDisplaySetting={"MEDIA"}
          />);
    const renderedElement = screen.getByTestId("static-element");
    expect(renderedElement.firstChild).toBeInstanceOf(HTMLImageElement);
  })

  it("Renders jpeg image correctly", () => {
    render(<StaticElement 
            text={"Some_img_url.jpeg"} 
            mediaDisplaySetting={"MEDIA"}
          />);
    const renderedElement = screen.getByTestId("static-element");
    expect(renderedElement.firstChild).toBeInstanceOf(HTMLImageElement);
  })

  it("Renders gif correctly", () => {
    render(<StaticElement 
            text={"Some_img_url.gif"} 
            mediaDisplaySetting={"MEDIA"}
          />);
    const renderedElement = screen.getByTestId("static-element");
    expect(renderedElement.firstChild).toBeInstanceOf(HTMLImageElement);
  })

  it("Renders mp3 correctly", () => {
    render(<StaticElement 
            text={"Some_img_url.mp3"} 
            mediaDisplaySetting={"MEDIA"}
          />);
    const renderedElement = screen.getByTestId("static-element");
    expect(renderedElement.firstChild).toBeInstanceOf(HTMLVideoElement);
  })

  it("Renders mp4 correctly", () => {
    render(<StaticElement 
            text={"Some_img_url.mp4"} 
            mediaDisplaySetting={"MEDIA"}
          />);
    const renderedElement = screen.getByTestId("static-element");
    expect(renderedElement.firstChild).toBeInstanceOf(HTMLVideoElement);
  })
})

describe("Snapshot tests for static element adapts to content", () => {
  it("Renders text correctly", () => {
    const tree = renderer
      .create(<StaticElement 
        text={"Some test text!"} 
        mediaDisplaySetting={"MEDIA"}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })

  it("Renders png image correctly", () => {
    const tree = renderer
      .create(<StaticElement 
              text={"Some_img_url.png"} 
              mediaDisplaySetting={"MEDIA"}
            />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })

  it("Renders jpg image correctly", () => {
    const tree = renderer
      .create(<StaticElement 
              text={"Some_img_url.jpg"} 
              mediaDisplaySetting={"MEDIA"}
            />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })

  it("Renders jpeg image correctly", () => {
    const tree = renderer
      .create(<StaticElement 
                text={"Some_img_url.jpeg"} 
                mediaDisplaySetting={"MEDIA"}
              />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })

  it("Renders gif correctly", () => {
    const tree = renderer
      .create(<StaticElement 
                text={"Some_img_url.gif"} 
                mediaDisplaySetting={"MEDIA"}
              />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })

  it("Renders mp3 correctly", () => {
    const tree = renderer
      .create(<StaticElement 
                text={"Some_img_url.mp3"} 
                mediaDisplaySetting={"MEDIA"}
              />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })

  it("Renders mp4 correctly", () => {
    const tree = renderer
      .create(<StaticElement 
                text={"Some_img_url.mp4"} 
                mediaDisplaySetting={"MEDIA"}
              />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})