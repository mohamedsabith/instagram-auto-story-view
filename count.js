function find_duplicate_in_array(array) {
  const count = {};
  const result = [];

  array.forEach((item) => {
    if (count[item]) {
      count[item] += 1;
      return;
    }
    count[item] = 1;
  });

  for (let prop in count) {
    if (count[prop] >= 2) {
      result.push(prop);
    }
  }

  return count;
}

export default find_duplicate_in_array