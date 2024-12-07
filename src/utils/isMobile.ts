import { UAParser } from "ua-parser-js";

const { device } = UAParser();

const isMobileDevice = device.is("mobile") || device.is("tablet");

export default isMobileDevice;
