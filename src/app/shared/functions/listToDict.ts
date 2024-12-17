export function listToDict<T>(list: T[], idGen: (arg: T) => string): { [key: string]: T } {
  const dict: { [key: string]: T } = {};

  list.forEach(element => {
    const dictKey = idGen(element);
    dict[dictKey] = element;
  });

  return dict;
}
