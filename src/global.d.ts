declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: Record<string, unknown>;
  }
}

declare global {
  interface WindowEventMap {
    "chatbot-open": CustomEvent;
    "chatbot-inquire": CustomEvent<{ name: string; price: string }>;
  }
}

export {};
