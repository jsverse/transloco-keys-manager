if (!Array.prototype.flat) {
  Array.prototype.flat = function() {
    return this.reduce((acc, val) => {
      if (Array.isArray(val)) {
        return acc.concat(val);
      }
      acc.push(val);

      return acc;
    }, []);
  };
}
