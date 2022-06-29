import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import EditElementModal from "../components/EditElementModal";
import "@testing-library/jest-dom";

import { elementType } from "../consts/enum";
import { EditElementModalState } from "../utils/customTypes";


describe("Render editElementModal", () => {
  const editElementModalState = { visible: true, element: {} } as EditElementModalState;
  const setEditElementModalState = jest.fn()
  const t = jest.fn()

  it("Renders editElementModal when visible is true", () => {
    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);
    
    const editModal = screen.getByTestId("edit-element-modal");
    expect(editModal).toBeInTheDocument();
  })

  it("Does not render editElementModal when visible is false", () => {
    editElementModalState.visible = false;
    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);
    
    expect(screen.queryByTestId("edit-element-modal")).not.toBeInTheDocument();
  })
})

describe("Query edit modal tests", () => {
  beforeEach(() => {
    setEditElementModalState.mockClear();
    editElementModalState.element.query = "";
  })
  
  const editElementModalState = { 
    visible: true, 
    element: { 
      type: elementType.GRIDVIEW,
      query: ""
    } 
  } as EditElementModalState;
  const setEditElementModalState = jest.fn();
  const t = jest.fn()

  it("Input and submit a legal query", (done) => {
    const queryString = "query MyQuery { someTable { someAttribute } }"

    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);
    
    const textInput = screen.getByTestId("edit-element-modal-input-field");
    const submitButton = screen.getByText(/ok/i);
    
    fireEvent.change(textInput, {target: {value: queryString}});
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(setEditElementModalState).toHaveBeenCalledTimes(1);
      expect(setEditElementModalState).toHaveBeenCalledWith({visible: false, element: {
        "h": 0,
        "name": "",
        "ordering": {
          "by": undefined,
          "direction": undefined,
        },
        "query": "",
        "text": "",
        "type": 1,
        "w": 0,
        "x": 0,
        "y": 0,
      }});
      expect(editElementModalState.element.query).toBe(queryString);
      done();
    })
  })

  it("Input and fail to submit a string that is not a query", (done) => {
    const queryString = "notAQuery"

    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);
    
    const textInput = screen.getByTestId("edit-element-modal-input-field");
    const submitButton = screen.getByText(/ok/i);

    fireEvent.change(textInput, {target: {value: queryString}});
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(setEditElementModalState).toHaveBeenCalledTimes(0);
      expect(editElementModalState.element.query).toBe("");
      done();
    })
  })

  it("Input and fail to submit an query containing illegal characters", (done) => {
    const queryString = 'query MyQuery { someTable { Veryi\\egalStr"ng } }'

    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);
    
    const textInput = screen.getByTestId("edit-element-modal-input-field");
    const submitButton = screen.getByText(/ok/i);

    fireEvent.change(textInput, {target: {value: queryString}});
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(setEditElementModalState).toHaveBeenCalledTimes(0);
      expect(editElementModalState.element.query).toBe("");
      done();
    })
  })

  it("Input and fail to submit a query consisting of an empty string", (done) => {
    const queryString = ""

    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);
    
    const textInput = screen.getByTestId("edit-element-modal-input-field");
    const submitButton = screen.getByText(/ok/i);

    fireEvent.change(textInput, {target: {value: undefined}});
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(setEditElementModalState).toHaveBeenCalledTimes(1);
      expect(editElementModalState.element.query).toBe("");
      done();
    })
  })

  it("Cancel editing a query", async () => {
    const oldQuery = "query oldQuery { someTable { someAttribute } }";
    editElementModalState.element.query = oldQuery;
    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);

    const cancelButton = screen.getByText(/cancel/i);

    fireEvent.click(cancelButton);
    
    expect(setEditElementModalState).toHaveBeenCalledTimes(1);
    expect(setEditElementModalState).toHaveBeenCalledWith({visible: false, element: {
      "h": 0,
      "name": "",
      "ordering": {
        "by": undefined,
        "direction": undefined,
      },
      "query": "",
      "text": "",
      "type": 1,
      "w": 0,
      "x": 0,
      "y": 0,
    }});
    expect(editElementModalState.element.query).toBe(oldQuery);
  })
})

describe("Static edit modal tests", () => {
  beforeEach(() => {
    setEditElementModalState.mockClear();
    editElementModalState.element.text = "";
  })

  const editElementModalState = { 
    visible: true, 
    element: { 
      type: elementType.STATIC,
      text: "" 
    } 
  } as EditElementModalState;
  const setEditElementModalState = jest.fn();
  const t = jest.fn();

  it("Input and submit text", (done) => {
    const textString = "someTestString";

    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);
    
    const textInput = screen.getByTestId("edit-element-modal-input-field");
    const submitButton = screen.getByText(/ok/i);
    
    fireEvent.change(textInput, {target: {value: textString}});
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(setEditElementModalState).toHaveBeenCalledTimes(1);
      expect(setEditElementModalState).toHaveBeenCalledWith({visible: false, element: {
        "h": 0,
        "name": "",
        "ordering": {
          "by": undefined,
          "direction": undefined,
        },
        "query": "",
        "text": "",
        "type": 1,
        "w": 0,
        "x": 0,
        "y": 0,
      }});
      expect(editElementModalState.element.text).toBe(textString);
      done();
    })
  })

  it("Input and submit text", (done) => {
    const textString = "someTestString";

    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);
    
    const textInput = screen.getByTestId("edit-element-modal-input-field");
    const submitButton = screen.getByText(/ok/i);
    
    fireEvent.change(textInput, {target: {value: textString}});
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(setEditElementModalState).toHaveBeenCalledTimes(1);
      expect(setEditElementModalState).toHaveBeenCalledWith({visible: false, element: {
        "h": 0,
        "name": "",
        "ordering": {
          "by": undefined,
          "direction": undefined,
        },
        "query": "",
        "text": "",
        "type": 1,
        "w": 0,
        "x": 0,
        "y": 0,
      }});
      expect(editElementModalState.element.text).toBe(textString);
      done();
    })
  })

  it("Input and fail to submit illegal text", (done) => {
    const textString = "veryi\\ega\"";
    editElementModalState.element.text = "";

    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);
    
    const textInput = screen.getByTestId("edit-element-modal-input-field");
    const submitButton = screen.getByText(/ok/i);
    
    fireEvent.change(textInput, {target: {value: textString}});
    fireEvent.click(submitButton);

    setTimeout(() => {
      expect(setEditElementModalState).toHaveBeenCalledTimes(0);
      expect(editElementModalState.element.text).toBe("");
      done();
    })
  })

  it("Cancel editing text", async () => {
    const oldTextString = "someTestString";
    editElementModalState.element.text = oldTextString;

    render(<EditElementModal
      state={editElementModalState}
      setState={setEditElementModalState}
      t={t}
    />);

    const cancelButton = screen.getByText(/cancel/i);

    fireEvent.click(cancelButton);
    
    expect(setEditElementModalState).toHaveBeenCalledTimes(1);
    expect(setEditElementModalState).toHaveBeenCalledWith({visible: false, element: {
      "h": 0,
      "name": "",
      "ordering": {
        "by": undefined,
        "direction": undefined,
      },
      "query": "",
      "text": "",
      "type": 1,
      "w": 0,
      "x": 0,
      "y": 0,
    }});
    expect(editElementModalState.element.text).toBe(oldTextString);
  })
})