import gsap from "gsap";

export function fadeIn(selector: string) {
  gsap.fromTo(selector, { opacity: 0 }, { opacity: 1, duration: 1 });
}

export function slideUp(selector: string) {
  gsap.fromTo(
    selector,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6 }
  );
}
