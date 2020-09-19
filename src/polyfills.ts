if (!Array.prototype.flat) {
  Array.prototype.flat = function () {
    return (this as any).reduce((acc, val) => {
      if (Array.isArray(val)) {
        return acc.concat(val);
      }
      acc.push(val);

      return acc;
    }, []);
  };
}
