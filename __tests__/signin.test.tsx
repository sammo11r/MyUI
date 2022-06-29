import React from "react";
import Signin from "../pages/auth/signin";
import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom";
import * as nextAuth from "next-auth/react";
import { signIn, SignInResponse } from "next-auth/react";

const signInFn = jest.spyOn(nextAuth, "signIn");

const onFinish = jest.fn();

jest.mock("next-i18next", () => ({
  __esModule: true,
  useTranslation: jest.fn().mockImplementation(() => {
    return {
      t: jest.fn(),
    }
  }
  )
}))

describe("Signin", () => {
  it("renders a signin form", () => {
    render(<Signin />);

    const row = screen.getByTestId("row-element");
    const form = screen.getByTestId("form-element");
    const formTitle = screen.getByTestId("form-title");
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitForm = screen.getByTestId("submit-form");
    const submitButton = screen.getByTestId("submit-button");

    expect(row).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(formTitle).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitForm).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("signs in to application", async () => {
    const validEmail = "validemail@test.com";
    const validPassword = "testPassword";
    const authConfig = { callbackUrl: undefined, redirect: false };

    onFinish.mockReturnValue(() => {
      signIn("login-credentials", {
        username: validEmail,
        password: validPassword,
      });
    });

    render(<Signin />);

    const emailInput = screen.getByTestId(/username-input/i);
    const passwordInput = screen.getByTestId(/password-input/i);
    const signInButton = screen.getByTestId(/submit-button/i);

    user.type(emailInput, validEmail);
    user.type(passwordInput, validPassword);

    await user.click(signInButton);

    waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
    waitFor(() =>
      expect(signInFn).toHaveBeenCalledWith(
        validEmail,
        validPassword,
        authConfig
      )
    );
    waitFor(() => expect(signInFn).toHaveBeenCalledTimes(1));
    waitFor(() => expect(signInFn).toReturnWith(Promise.resolve(true)));
  });

  it("does not sign in with empty credentials", async () => {
    const validEmail = "validemail@test.com";
    const authConfig = { callbackUrl: undefined, redirect: false };

    onFinish.mockReturnValue(() => {
      signIn("login-credentials", {
        username: validEmail,
        password: "",
      });
    });

    render(<Signin />);

    const emailInput = screen.getByTestId(/username-input/i);
    const signInButton = screen.getByTestId(/submit-button/i);

    user.type(emailInput, validEmail);

    await user.click(signInButton);

    waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
    waitFor(() =>
      expect(signInFn).toHaveBeenCalledWith(
        validEmail,
        "",
        authConfig
      )
    );
    waitFor(() => expect(signInFn).toHaveBeenCalledTimes(1));
    waitFor(() => expect(signInFn).toReturnWith({
      error: "Password is required",
    } as SignInResponse));
  });
});
