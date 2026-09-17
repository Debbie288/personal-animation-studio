/* =========================================================
   MOTIONFORGE STUDIO
   REAL AI IMAGE-TO-VIDEO GENERATOR
   WAN 2.2
   ========================================================= */

import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";


const MotionGenerator = {

  isGenerating: false,


  /* -------------------------------------------------------
     START GENERATOR
     ------------------------------------------------------- */

  init() {

    const button =
      document.getElementById("generateAnimationBtn");

    const promptInput =
      document.getElementById("motionPrompt");

    const durationInput =
      document.getElementById("generatorDuration");

    const intensityInput =
      document.getElementById("generatorIntensity");


    if (!button) {

      console.log(
        "MotionForge: Generate button not found."
      );

      return;
    }


    button.addEventListener(
      "click",
      async () => {

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


        const duration =
          durationInput
            ? Number(durationInput.value)
            : 5;


        const intensity =
          intensityInput
            ? Number(intensityInput.value)
            : 50;


        await this.generate({

          prompt: prompt,

          duration: duration,

          intensity: intensity,

          image: scene.image

        });

      }
    );


    console.log(
      "MotionForge: Wan 2.2 AI generator loaded."
    );

  },


  /* -------------------------------------------------------
     GENERATE VIDEO
     ------------------------------------------------------- */

  async generate(settings) {

    if (this.isGenerating) {
      return;
    }


    this.isGenerating = true;

    this.showGeneratingState();


    try {

      console.log(
        "MotionForge: Preparing image..."
      );


      const imageBase64 =
        await this.imageToBase64(
          settings.image
        );


      console.log(
        "MotionForge: Connecting to Wan 2.2..."
      );


      const app =
        await Client.connect(
          "prithivMLmods/Wan2.2-Fast"
        );


      this.updateStatus(
        "Connected. Generating your AI video..."
      );


      console.log(
        "MotionForge: Sending generation request..."
      );


      const result =
        await app.predict(
          "/generate_video",
          [

            imageBase64,

            settings.prompt,

            4,

            "blurry, distorted face, deformed body, extra limbs, bad anatomy, flickering, warped image",

            Math.min(
              Math.max(
                Number(settings.duration),
                0.5
              ),
              5
            ),

            1,

            1,

            42,

            true

          ]
        );


      console.log(
        "MotionForge: Wan 2.2 result:",
        result
      );


      /*
       Wan 2.2 returns:

       {
         video: "data:video/mp4;base64,...",
         seed: 123
       }
      */

      const responseData =
        result &&
        result.data
          ? result.data[0]
          : null;


      if (!responseData) {

        throw new Error(
          "Wan 2.2 returned no data."
        );

      }


      const videoData =
        responseData.video;


      if (!videoData) {

        throw new Error(
          "Wan 2.2 returned no video."
        );

      }


      console.log(
        "MotionForge: Real video received."
      );


      await this.showGeneratedVideo(
        videoData
      );


      this.showReadyState();


    } catch (error) {

      console.error(
        "MotionForge AI generation error:",
        error
      );


      this.showError(
        "AI video generation failed. Please try again."
      );

    } finally {

      this.isGenerating = false;

    }

  },


  /* -------------------------------------------------------
     IMAGE → BASE64
     ------------------------------------------------------- */

  async imageToBase64(imageSource) {


    /*
     If image is already a data URL,
     use it directly.
    */

    if (

      typeof imageSource === "string" &&

      imageSource.startsWith(
        "data:image/"
      )

    ) {

      return imageSource;

    }


    /*
     Otherwise fetch the image.
    */

    const response =
      await fetch(imageSource);


    if (!response.ok) {

      throw new Error(
        "Could not read the uploaded image."
      );

    }


    const blob =
      await response.blob();


    return new Promise(
      (resolve, reject) => {

        const reader =
          new FileReader();


        reader.onload =
          () => {

            resolve(
              reader.result
            );

          };


        reader.onerror =
          () => {

            reject(
              new Error(
                "Could not convert image."
              )
            );

          };


        reader.readAsDataURL(
          blob
        );

      }
    );

  },


  /* -------------------------------------------------------
     SHOW GENERATED VIDEO
     ------------------------------------------------------- */

  async showGeneratedVideo(
    videoData
  ) {

    if (!videoData) {

      throw new Error(
        "No video data received."
      );

    }


    let video =
      document.getElementById(
        "motionForgeGeneratedVideo"
      );


    /*
     Create video player if it doesn't exist.
    */

    if (!video) {

      video =
        document.createElement(
          "video"
        );


      video.id =
        "motionForgeGeneratedVideo";


      video.controls =
        true;


      video.autoplay =
        true;


      video.loop =
        true;


      video.playsInline =
        true;


      video.style.width =
        "100%";


      video.style.maxWidth =
        "100%";


      video.style.borderRadius =
        "16px";


      video.style.marginTop =
        "16px";


      const status =
        document.getElementById(
          "generatorStatus"
        );


      if (status && status.parentNode) {

        status.parentNode.insertBefore(
          video,
          status
        );

      }

    }


    /*
     Wan already returns a complete
     data:video/mp4;base64,... URL.
    */

    if (
      typeof videoData === "string" &&
      videoData.startsWith(
        "data:video/"
      )
    ) {

      video.src =
        videoData;

    }

    else if (
      typeof videoData === "string"
    ) {

      /*
       Fallback if only raw base64
       is returned.
      */

      video.src =
        "data:video/mp4;base64," +
        videoData;

    }

    else {

      throw new Error(
        "Invalid video data received."
      );

    }


    video.load();


    try {

      await video.play();

    } catch (error) {

      console.log(
        "Video ready. Tap play to watch."
      );

    }


    this.updateStatus(
      "✓ Real AI video generated successfully."
    );

  },


  /* -------------------------------------------------------
     GENERATING STATE
     ------------------------------------------------------- */

  showGeneratingState() {

    const button =
      document.getElementById(
        "generateAnimationBtn"
      );


    if (button) {

      button.disabled =
        true;


      button.textContent =
        "Generating AI Video...";

    }


    this.updateStatus(
      "Preparing your image..."
    );

  },


  /* -------------------------------------------------------
     STATUS
     ------------------------------------------------------- */

  updateStatus(
    message
  ) {

    const status =
      document.getElementById(
        "generatorStatus"
      );


    if (status) {

      status.className =
        "generator-status generating";


      status.textContent =
        message;

    }

  },


  /* -------------------------------------------------------
     READY
     ------------------------------------------------------- */

  showReadyState() {

    const button =
      document.getElementById(
        "generateAnimationBtn"
      );


    if (button) {

      button.disabled =
        false;


      button.textContent =
        "Generate Animation";

    }


    const status =
      document.getElementById(
        "generatorStatus"
      );


    if (status) {

      status.className =
        "generator-status ready";


      status.textContent =
        "✓ Real AI video generated successfully.";

    }

  },


  /* -------------------------------------------------------
     ERROR
     ------------------------------------------------------- */

  showError(
    message
  ) {

    const button =
      document.getElementById(
        "generateAnimationBtn"
      );


    if (button) {

      button.disabled =
        false;


      button.textContent =
        "Generate Animation";

    }


    const status =
      document.getElementById(
        "generatorStatus"
      );


    if (status) {

      status.className =
        "generator-status";


      status.textContent =
        message;

    }

  }

};


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    MotionGenerator.init();

  }
);
