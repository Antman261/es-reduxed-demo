export const isNever = (x: never): never => {
  throw new Error(`Received value for never: ${x}`)
};
