export const logger = {
  log: (message: string, enabled?: boolean): void => {
    if (!enabled) {
      return;
    }
    console.log(message);
  }
};
