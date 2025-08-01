import { render, cleanup } from "@testing-library/react";
import { expect, test, afterEach } from "vitest";
import Pizza from "../Pizza";

afterEach(cleanup);

test("renders pizza with correct name, descriotion and image "),
  async () => {
    const name = "My Favourite Pizza";
    const src = "https://picsum.photos/200";
    const description = "Delicious pizza with all my favorite toppings";

    const screen = render(
      <Pizza name={name} description={description} image={src} />
    );
    const img = screen.getByRole("img");

    expect(img.src).toBe(src);
    expect(img.alt).toBe(name);
  };

afterEach(cleanup);

test("test to have default image if none is provided", async () => {
  const screen = render(
    <Pizza name="something Else" description="super cool pizza" />
  );

  const img = screen.getByRole("img");

  expect(img.src).not.toBe("");
});
