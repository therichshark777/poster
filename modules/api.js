module.exports = {
    handleInput: (inputArray) => {
      if (!Array.isArray(inputArray)) {
        throw new Error("Input must be an array.");
      }
      return inputArray;
    },
  };  