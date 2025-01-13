/**
 * Example : sortBy(arr, t => t.a)
 * @param array 
 * @param valueExtractor 
 * @param comparator 
 * @returns 
 */
export function sortBy<T, V>(
    array: T[],
    valueExtractor: (t: T) => V,
    comparator?: (a: V, b: V) => number) {


const c = comparator ?? ((a, b) => a > b ? 1 : -1) 
return array.sort((a, b) => c(valueExtractor(a), valueExtractor(b)))
}