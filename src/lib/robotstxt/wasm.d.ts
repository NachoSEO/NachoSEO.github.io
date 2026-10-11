/** Las Pages Functions importan el .wasm ya compilado */
declare module '*.wasm' {
  const module: WebAssembly.Module;
  export default module;
}
