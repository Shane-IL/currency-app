import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";

import Loader from "./index";

describe("Loader", () => {
    it("renders", () => {
        render(
            <RecoilRoot>
                <Loader />
            </RecoilRoot>
        );
    });
});
