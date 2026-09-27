// Loaded once the page is idle by MotionProvider, keeping the animation engine out of the
// critical path. domAnimation covers animate/variants/whileInView/exit; nothing uses layout or drag.
import { domAnimation } from "motion/react";

export default domAnimation;
