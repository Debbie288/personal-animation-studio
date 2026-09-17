/* =========================================
   MOTIONFORGE - FACE ANIMATION ENGINE
   ========================================= */

const FaceAnimation = {

  enabled: false,
  intensity: 50,
  animationFrame: null,

  settings: {
    breathing: true,
    blinking: true,
    headMovement: true,
    subtleMovement: true
  },

  start(imageElement) {

    if (!imageElement) {
      console.log("Face Animation: no image found.");
      return;
    }

    this.enabled = true;

    imageElement.classList.add("character-alive");

    this.animate(imageElement);

    console.log("Character motion enabled.");
  },

  stop(imageElement) {

    this.enabled = false;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (imageElement) {
      imageElement.classList.remove("character-alive");
      imageElement.style.setProperty("--life-x", "0px");
      imageElement.style.setProperty("--life-y", "0px");
      imageElement.style.setProperty("--life-scale", "1");
    }
  },

  animate(imageElement) {

    if (!this.enabled) return;

    const time = performance.now();

    /*
      Very subtle natural movement.

      This does NOT alter the person's identity.
      It creates gentle cinematic movement around
      the character while we prepare the real
      facial-landmark system.
    */

    const breathing =
      Math.sin(time * 0.0015) *
      (this.intensity / 100) *
      0.8;

    const headX =
      Math.sin(time * 0.0007) *
      (this.intensity / 100) *
      1.2;

    const headY =
      Math.sin(time * 0.0009) *
      (this.intensity / 100) *
      0.7;

    const scale =
      1 +
      breathing * 0.0015;

    imageElement.style.setProperty(
      "--life-x",
      `${headX}px`
    );

    imageElement.style.setProperty(
      "--life-y",
      `${headY}px`
    );

    imageElement.style.setProperty(
      "--life-scale",
      scale
    );

    this.animationFrame =
      requestAnimationFrame(
        () => this.animate(imageElement)
      );
  },

  setIntensity(value) {

    this.intensity =
      Math.max(
        0,
        Math.min(100, Number(value))
      );
  }

};
