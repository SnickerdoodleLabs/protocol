export default {
    getRandomBase64: jest.fn().mockImplementation(() => {
      console.log("getRandomBase64 mock called");
      return "mockedBase64";
    })
  };