//
// Create a promise that always resolves successfully.
//
export default function always(value) {
  return new Promise(resolve => { resolve(value) });
}
