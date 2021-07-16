import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
  const error = screen.queryByText(/error/i);
  expect(error).toBeNull();
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const h1 = document.querySelector("h1");
  expect(h1).toBeInTheDocument();
  expect(h1).toHaveTextContent(/Contact Form/);
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const name = screen.getByLabelText("First Name*");
  expect(name).not.toBeNull();
  fireEvent.change(name, { target: { value: "Rika" } });
  const error = screen.getAllByTestId("error");
  await expect(error).toHaveLength(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const submitButton = screen.queryByRole("button");
  expect(submitButton).not.toBeNull();
  fireEvent.click(submitButton);
  const error = screen.getAllByTestId("error");
  await expect(error).toHaveLength(3);
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText("First Name*");
  const lastName = screen.getByLabelText("Last Name*");
  fireEvent.change(firstName, { target: { value: "Rikaa" } });
  fireEvent.change(lastName, { target: { value: "Ciminieri" } });
  const submitButton = screen.queryByRole("button");
  await fireEvent.click(submitButton);
  const error = screen.getAllByTestId("error");
  expect(error).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const email = screen.getByLabelText("Email*");
  fireEvent.change(email, { target: { value: "peep" } });
  const emailError = await screen.findByText(
    /email must be a valid email address/i
  );
  expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitButton = screen.queryByRole("button");
  fireEvent.click(submitButton);
  const lastNameError = await screen.findByText(
    /lastName is a required field/i
  );
  expect(lastNameError).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText("First Name*");
  const lastName = screen.getByLabelText("Last Name*");
  const email = screen.getByLabelText("Email*");
  const submitButton = screen.queryByRole("button");
  fireEvent.change(firstName, { target: { value: "Rikaa" } });
  fireEvent.change(lastName, { target: { value: "Ciminieri" } });
  fireEvent.change(email, { target: { value: "rikaciminieri@gmail.com" } });
  await fireEvent.click(submitButton);
  const firstNameRender = screen.getByTestId("firstnameDisplay");
  const lastNameRender = screen.getByTestId("lastnameDisplay");
  const emailRender = screen.getByTestId("emailDisplay");
  const messageRender = screen.queryByTestId("messageDisplay");
  expect(firstNameRender).toHaveTextContent("First Name: Rikaa");
  expect(lastNameRender).toHaveTextContent("Last Name: Ciminieri");
  expect(emailRender).toHaveTextContent("Email: rikaciminieri@gmail.com");
  expect(messageRender).toBeNull();
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText("First Name*");
  const lastName = screen.getByLabelText("Last Name*");
  const email = screen.getByLabelText("Email*");
  const message = screen.getByLabelText("Message");
  const submitButton = screen.queryByRole("button");
  fireEvent.change(firstName, { target: { value: "Rikaa" } });
  fireEvent.change(lastName, { target: { value: "Ciminieri" } });
  fireEvent.change(email, { target: { value: "rikaciminieri@gmail.com" } });
  fireEvent.change(message, { target: { value: "This is my message" } });
  await fireEvent.click(submitButton);
  const firstNameRender = screen.getByTestId("firstnameDisplay");
  const lastNameRender = screen.getByTestId("lastnameDisplay");
  const emailRender = screen.getByTestId("emailDisplay");
  const messageRender = screen.getByTestId("messageDisplay");
  expect(firstNameRender).toHaveTextContent("First Name: Rikaa");
  expect(lastNameRender).toHaveTextContent("Last Name: Ciminieri");
  expect(emailRender).toHaveTextContent("Email: rikaciminieri@gmail.com");
  expect(messageRender).toHaveTextContent("Message: This is my message");
});
