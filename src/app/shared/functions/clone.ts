export function clone(object: any) {
  if (!object){
    return null;
  }
  return JSON.parse(JSON.stringify(object));
}
