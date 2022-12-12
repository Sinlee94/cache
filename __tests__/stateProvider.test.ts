import * as core from "@actions/core";

import { Events, RefKey, State } from "../src/constants";
import {
    IStateProvider,
    NullStateProvider,
    StateProvider
} from "../src/stateProvider";

jest.mock("@actions/core");

beforeAll(() => {
    jest.spyOn(core, "getInput").mockImplementation((name, options) => {
        return jest.requireActual("@actions/core").getInput(name, options);
    });

    jest.spyOn(core, "setOutput").mockImplementation((key, value) => {
        return jest.requireActual("@actions/core").setOutput(key, value);
    });
});

afterEach(() => {
    delete process.env[Events.Key];
    delete process.env[RefKey];
});

test("StateProvider saves states", async () => {
    const getStateMock = jest
        .spyOn(core, "getState")
        .mockImplementation(name =>
            jest.requireActual("@actions/core").getState(name)
        );
    const saveStateMock = jest
        .spyOn(core, "saveState")
        .mockImplementation((key, value) => {
            return jest.requireActual("@actions/core").saveState(key, value);
        });

    const cacheMatchedKey = "node-cache";

    const stateProvider: IStateProvider = new StateProvider();
    stateProvider.setState("stateKey", "stateValue");
    stateProvider.setState(State.CacheMatchedKey, cacheMatchedKey);
    stateProvider.getState("stateKey");
    stateProvider.getCacheState();

    expect(getStateMock).toHaveBeenCalledTimes(2);
    expect(saveStateMock).toHaveBeenCalledTimes(2);
});

test("NullStateProvider saves outputs", async () => {
    const getStateMock = jest
        .spyOn(core, "getState")
        .mockImplementation(name =>
            jest.requireActual("@actions/core").getState(name)
        );
    const setOutputMock = jest
        .spyOn(core, "setOutput")
        .mockImplementation((key, value) => {
            return jest.requireActual("@actions/core").setOutput(key, value);
        });
    const cacheMatchedKey = "node-cache";
    const nullStateProvider: IStateProvider = new NullStateProvider();
    nullStateProvider.setState("outputKey", "outputValue");
    nullStateProvider.setState(State.CacheMatchedKey, cacheMatchedKey);
    nullStateProvider.getState("outputKey");
    nullStateProvider.getCacheState();

    expect(getStateMock).toHaveBeenCalledTimes(0);
    expect(setOutputMock).toHaveBeenCalledTimes(2);
});
