/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { IModelTestUtils } from "../IModelTestUtils.js";
import { IModelHost } from "../../IModelHost.js";

describe("SettingsSchemas", () => {

  // SettingsSchema tests change the state of the IModelHost object. They should always clear
  // the current state before and after they run so they're not affected by, nor influence, other tests running in the same process.
  const restartSession = async () => {
    await IModelHost.shutdown();
    await IModelHost.startup();
  };
  beforeAll(async () => {
    await restartSession();
  });
  afterAll(async () => {
    await restartSession();
  });

  it("add groups", async () => {
    const schemas = IModelHost.settingsSchemas;
    // can't add a group with no name
    expect(() => schemas.addGroup({} as any)).throws(`has no "schemaPrefix" member`);

    schemas.addFile(IModelTestUtils.resolveAssetFile("TestSettings.schema.json"));
    expect(schemas.settingDefs.get("testApp/list/openMode")!.type).equals("string");
    expect(schemas.settingDefs.get("testApp/list/openMode")!.default).equals("singleClick");
    expect(schemas.settingDefs.get("testApp/tree/blah")!.default).equals(true);
  });

});
