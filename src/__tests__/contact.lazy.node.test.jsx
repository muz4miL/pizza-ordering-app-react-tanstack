import { fireEvent, render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Route } from "../routes/contact.lazy";

const queryClient = new QueryClient();

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

test("can submit contact form", async () => {
  fetchMocker.mockResponseOnce(JSON.stringify({ status: "ok" }));
  const screen = render(
    <QueryClientProvider client={queryClient}>
      <Route.options.component />
    </QueryClientProvider>
  );

  const nameInput = screen.getByPlaceholderText("name");
  const emailInput = screen.getByPlaceholderText("email");
  const messageInput = screen.getByPlaceholderText("message");

  const testData = {
    name: "Brian",
    email: "sho@gmail.com",
    message: "let me learn! ",
  };

  fireEvent.change(nameInput, { target: { value: testData.name } });
  fireEvent.change(emailInput, { target: { value: testData.email } });
  fireEvent.change(messageInput, { target: { value: testData.message } });

  const btn = screen.getByRole("button");
  fireEvent.click(btn);

  const h3 = await screen.findByRole("heading", { level: 3 });

  expect(h3.innerText).toContain("Submitted!");

  const requests = fetchMocker.requests();
  expect(requests.length).toBe(1);
  expect(requests[0].url).toMatch(/\/api\/contact$/);
  expect(fetchMocker).toHaveBeenCalledWith("/api/contact", {
    body: JSON.stringify(testData),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
});
