import { renderHook, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { usePizzaOfTheDay } from "../usePizzaOfTheDay";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

const testPizza = {
  id: "calibrese",
  name: "The Calibrese",
  captegory: "Supreme",
  description: "lol pizza with all my favourite toppings",
  image: "/pizzas/calabrese/webp",
  size: { S: 12.25, M: 16.25, L: 20 },
};

test("gives null when first called ", async () => {
  fetchMocker.mockResponseOnce(JSON.stringify(testPizza));
  const { result } = renderHook(() => usePizzaOfTheDay());
  expect(result.current).toBeNull();
});

test("to call the api and give back the pizza of the day", async () => {
  fetchMocker.mockResponseOnce(JSON.stringify(testPizza));
  const { result } = renderHook(() => usePizzaOfTheDay());
  await waitFor(() => {
    expect(result.current).toEqual(testPizza);
  });
  expect(fetchMocker).toHaveBeenCalledWith("/api/pizza-of-the-day");
});
