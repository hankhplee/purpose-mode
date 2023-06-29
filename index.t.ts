export {};

declare global {
  interface Window {
    __defineGetter__: Function;
  }
  interface HTMLElement {
    __defineGetter__: Function;
  }
}
