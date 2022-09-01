import { DataPermissions } from "@snickerdoodlelabs/objects";

describe("DataPermissions bitwise operation tests", () => {

  test("0x0000000b contains b, a, 8, 1, 0", () => {
    const dp1 = new DataPermissions(0x0000000b);
    const dp2 = new DataPermissions(0x0000000a);
    const dp3 = new DataPermissions(0x00000008);
    const dp4 = new DataPermissions(0x00000001);
    const dp5 = new DataPermissions(0x00000000);

    expect(dp1.contains(dp1)).toBeTruthy();
    expect(dp1.contains(dp2)).toBeTruthy();
    expect(dp1.contains(dp3)).toBeTruthy();
    expect(dp1.contains(dp4)).toBeTruthy();
    expect(dp1.contains(dp5)).toBeTruthy();

  });
  
  test("0x0000000b does not contain c, 4", () => {

    const dp1 = new DataPermissions(0x0000000b);
    const dp2 = new DataPermissions(0x0000000c);
    const dp3 = new DataPermissions(0x00000004);
    expect(dp1.contains(dp2)).toBeFalsy();
    expect(dp1.contains(dp3)).toBeFalsy();
    
  });

})