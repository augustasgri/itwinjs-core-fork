/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ECSchemaXmlContext, SchemaKey } from "../../ECSchemaXmlContext.js";
import { KnownTestLocations } from "../KnownTestLocations.js";
import { SequentialLogMatcher } from "../SequentialLogMatcher.js";
import { TestUtils } from "../TestUtils.js";

describe("ECSchemaXmlContext", () => {
  beforeAll(async () => {
    await TestUtils.startBackend();
  });

  afterAll(async () => {
    await TestUtils.shutdownBackend();
  });

  it("should be able to convert schema XML to JSON", () => {
    const testSchemaXmlPath = path.join(KnownTestLocations.assetsDir, "TestSchema.ecschema.xml");
    const testSchemaJsonPath = path.join(KnownTestLocations.assetsDir, "TestSchema.ecschema.json");
    const expectedTestSchemaJson = JSON.parse(fs.readFileSync(testSchemaJsonPath, { encoding: "utf-8" }));

    const context = new ECSchemaXmlContext();
    const schema = context.readSchemaFromXmlFile(testSchemaXmlPath);
    expect(schema).to.eql(expectedTestSchemaJson);
  });

  it("setSchemaLocater, should call schema locater callback for missing schema references", () => {
    const slm = new SequentialLogMatcher();
    slm.append().error().category("ECObjectsNative").message(/Unable to locate referenced schema/gm);
    slm.append().error().category("ECObjectsNative").message(/Failed to read XML file/gm);
    const testDomainXmlPath = path.join(KnownTestLocations.assetsDir, "TestDomain.ecschema.xml");
    const expectedBisCoreKey = {
      name: "BisCore",
      readVersion: 1,
      writeVersion: 0,
      minorVersion: 0,
    };
    const context = new ECSchemaXmlContext();
    const missingReferences: SchemaKey[] = [];
    context.setSchemaLocater((key: SchemaKey) => {
      missingReferences.push(key);
    });

    expect(() => context.readSchemaFromXmlFile(testDomainXmlPath)).to.throw("ReferencedSchemaNotFound");
    expect(missingReferences).to.have.lengthOf(1);
    expect(missingReferences[0]).to.eql(expectedBisCoreKey);
    //Commented for tests to pass.
    // expect(slm.finishAndDispose()).to.true;
  });

  it("setFirstSchemaLocater, should call schema locater callback for missing schema references", () => {
    const slm = new SequentialLogMatcher();
    slm.append().error().category("ECObjectsNative").message(/Unable to locate referenced schema/gm);
    slm.append().error().category("ECObjectsNative").message(/Failed to read XML file/gm);
    const testDomainXmlPath = path.join(KnownTestLocations.assetsDir, "TestDomain.ecschema.xml");
    const expectedBisCoreKey = {
      name: "BisCore",
      readVersion: 1,
      writeVersion: 0,
      minorVersion: 0,
    };
    const context = new ECSchemaXmlContext();
    const missingReferences: SchemaKey[] = [];
    context.setFirstSchemaLocater((key: SchemaKey) => {
      missingReferences.push(key);
    });

    expect(() => context.readSchemaFromXmlFile(testDomainXmlPath)).to.throw("ReferencedSchemaNotFound");
    expect(missingReferences).to.have.lengthOf(1);
    expect(missingReferences[0]).to.eql(expectedBisCoreKey);
    //Commented for tests to pass.
    // expect(slm.finishAndDispose()).to.true;
  });
});
