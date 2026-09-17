/* =========================================================
   MOTIONFORGE STUDIO
   AI MOTION GENERATOR
   ========================================================= */

const MotionGenerator = {

  isGenerating: false,

  init() {

    const generateButton =
      document.getElementById("generateAnimationBtn");

    const promptInput =
      document.getElementById("motionPrompt");

    const durationInput =
      document.getElementById("generatorDuration");

    const intensityInput =
      document.getElementById("generatorIntensity");

    if (!generateButton) return;

    generateButton.addEventListener(
      "click",
      () => {

        const prompt =
          promptInput
            ? promptInput.value.trim()
            : "";

        if (!prompt) {

          alert(
            "Describe how you want the image to move first."
          );

          return;
        }

        this.generate({
          prompt: prompt,
          duration: durationInput
            ? Number(durationInput.value)
            : 5,
          intensity: intensityInput
            ? Number(intensityInput.value)
            : 50
        });

      }
    );

  },


  generate(settings) {

    if (this.isGenerating) return;

    const scene =
      typeof getCurrentScene === "function"
        ? getCurrentScene()
        : null;

    if (!scene || !scene.image) {

      alert(
        "Upload an image before generating animation."
      );

      return;
    }


    this.isGenerating = true;

    this.showGeneratingState();


    /*
      IMPORTANT:

      This is the generator interface/foundation.
      A real AI video model will be connected here.

      We deliberately do NOT pretend that CSS
      animation is AI video generation.
    */


    setTimeout(() => {

      this.showReadyState(
        settings
      );

      this.isGenerating = false;

    }, 1800);

  },


  showGeneratingState() {

    const button =
      document.getElementById(
        "generateAnimationBtn"
      );

    const status =
      document.getElementById(
        "generatorStatus"
      );

    if (button) {

      button.disabled = true;

      button.textContent =
        "Generating...";

    }

    if (status) {

      status.className =
        "generator-status generating";

      status.textContent =
        "Preparing your animation...";

    }

  },


  showReadyState(settings) {

    const button =
      document.getElementById(
        "generateAnimationBtn"
      );

    const status =
      document.getElementById(
        "generatorStatus"
      );

    if (button) {

      button.disabled = false;

      button.textContent =
        "Generate Animation";

    }

    if (status) {

      status.className =
        "generator-status ready";

      status.textContent =
        "Animation instructions ready.";
    }


    console.log(
      "MotionForge animation request:",
      settings
    );

  }

};


/* ---------- START GENERATOR ---------- */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    MotionGenerator.init();

  }
);
