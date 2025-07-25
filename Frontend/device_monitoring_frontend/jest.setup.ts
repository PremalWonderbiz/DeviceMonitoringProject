if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (value: any) => JSON.parse(JSON.stringify(value));
}