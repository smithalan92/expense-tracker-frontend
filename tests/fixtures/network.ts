export function makeNetworkError() {
  const err = new Error("Network Error") as any;
  err.isAxiosError = true;
  err.code = "ERR_NETWORK";
  return err;
}
