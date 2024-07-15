import * as index from "./index";

describe("index", () => {
  it("exports public API", () => {
    expect(index).toMatchSnapshot();
  });
});
