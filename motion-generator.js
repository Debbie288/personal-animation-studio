/* =========================================================
   MOTIONFORGE STUDIO
   REAL AI IMAGE-TO-VIDEO GENERATOR
   WAN 2.2
   DIAGNOSTIC VERSION
   ========================================================= */

import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";


const MotionGenerator = {

  isGenerating: false,


  /* -------------------------------------------------------
     START
     ------------------------------------------------------- */

  init() {

    const button =
      document.getElementById("generateAnimationBtn");

    const promptInput =
      document.getElementById("motionPrompt");

    const durationInput =
      document.getElementById("generatorDuration");


    if (!button) {

      console.error(
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


        await this.generate({

          prompt: prompt,

          duration: duration,

          image: scene.image

        });

      }
    );


    console.log(
      "MotionForge: Diagnostic generator loaded."
    );

  },


  /* -------------------------------------------------------
     GENERATE
     ------------------------------------------------------- */

  async generate(settings) {

    if (this.isGenerating) {
      return;
    }


    this.isGenerating = true;

    this.showGeneratingState();


    try {

      this.updateStatus(
        "Preparing image..."
      );


      console.log(
        "MotionForge: Image source:",
        settings.image
      );


      const imageBase64 =
        await this.imageToBase64(
          settings.image
        );


      console.log(
        "MotionForge: Image converted successfully."
      );


      this.updateStatus(
        "Connecting to Wan 2.2..."
      );


      const app =
        await Client.connect(
          "prithivMLmods/Wan2.2-Fast"
        );


      console.log(
        "MotionForge: Connected to Wan 2.2."
      );


      this.updateStatus(
        "Connected. Sending video request..."
      );


      const duration =
        Math.min(
          Math.max(
            Number(settings.duration) || 5,
            0.5
          ),
          5
        );


      console.log(
        "MotionForge: Sending request:",
        {
          prompt: settings.prompt,
          duration: duration
        }
      );


      /*
       Use the exact endpoint and
       named parameters from the
       live Wan 2.2 API.
      */

      const result =
        await app.predict(
          "/generate_video",
          {
            image_b64:
              imageBase64,

            prompt:
              settings.prompt,

            steps:
              4,

            negative_prompt:
              "blurry, distorted face, deformed body, extra limbs, bad anatomy, flickering, warped image",

            duration_seconds:
              duration,

            guidance_scale:
              1,

            guidance_scale_2:
              1,

            seed:
              42,

            randomize_seed:
              true
          }
        );


      console.log(
        "MotionForge: RAW WAN RESULT:",
        result
      );


      if (!result) {

        throw new Error(
          "The Wan API returned an empty response."
        );

      }


      if (!result.data) {

        throw new Error(
          "The Wan API response contains no data."
        );

      }


      console.log(
        "MotionForge: RESULT DATA:",
        result.data
      );


      const responseData =
        Array.isArray(result.data)
          ? result.data[0]
          : result.data;


      console.log(
        "MotionForge: RESPONSE DATA:",
        responseData
      );


      /*
       The Wan Space returns an object
       containing the generated video.
      */

      let videoData = null;


      if (
        responseData &&
        typeof responseData === "object"
      ) {

        videoData =
          responseData.video;

      }


      /*
       Fallback if the response itself
       is a video string.
      */

      if (
        !videoData &&
        typeof responseData === "string"
      ) {

        videoData =
          responseData;

      }


      if (!videoData) {

        throw new Error(
          "Wan returned data, but no video field was found. Raw response: " +
          JSON.stringify(
            responseData
          )
        );

      }


      console.log(
        "MotionForge: VIDEO RECEIVED."
      );


      this.updateStatus(
        "Video received. Loading preview..."
      );


      await this.showGeneratedVideo(
        videoData
      );


      this.showReadyState();


    } catch (error) {

      console.error(
        "================================================="
      );

      console.error(
        "MOTIONFORGE REAL ERROR:"
      );

      console.error(
        error
      );

      console.error(
        "================================================="
      );


      this.showDetailedError(
        error
      );


    } finally {

      this.isGenerating =
        false;

    }

  },


  /* -------------------------------------------------------
     IMAGE → BASE64
     ------------------------------------------------------- */

  async imageToBase64(
    imageSource
  ) {

    if (

      typeof imageSource === "string" &&

      imageSource.startsWith(
        "data:image/"
      )

    ) {

      return imageSource;

    }


    if (!imageSource) {

      throw new Error(
        "No image source was provided."
      );

    }


    const response =
      await fetch(
        imageSource
      );


    if (!response.ok) {

      throw new Error(
        "Could not download the image. HTTP status: " +
        response.status
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
                "FileReader could not convert the image."
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
     SHOW VIDEO
     ------------------------------------------------------- */

  async showGeneratedVideo(
    videoData
  ) {

    if (!videoData) {

      throw new Error(
        "Video data was empty."
      );

    }


    let video =
      document.getElementById(
        "motionForgeGeneratedVideo"
      );


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


      if (
        status &&
        status.parentNode
      ) {

        status.parentNode.insertBefore(
          video,
          status
        );

      }

    }


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

      video.src =
        "data:video/mp4;base64," +
        videoData;

    }

    else {

      throw new Error(
        "The returned video has an unsupported format."
      );

    }


    video.load();


    try {

      await video.play();

    } catch (error) {

      console.log(
        "Video loaded. Automatic playback was blocked."
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
      "Preparing image..."
    );

  },


  /* -------------------------------------------------------
     NORMAL STATUS
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
     SUCCESS
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
     DETAILED ERROR
     ------------------------------------------------------- */

  showDetailedError(
    error
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


    if (!status) {
      return;
    }


    let errorMessage =
      "Unknown error";


    if (error) {

      if (error.message) {

        errorMessage =
          error.message;

      }

      else {

        try {

          errorMessage =
            JSON.stringify(
              error,
              null,
              2
            );

        } catch {

          errorMessage =
            String(error);

        }

      }

    }


    status.className =
      "generator-status";


    status.style.whiteSpace =
      "pre-wrap";


    status.style.textAlign =
      "left";


    status.style.padding =
      "12px";


    status.style.marginTop =
      "12px";


    status.style.borderRadius =
      "12px";


    status.style.background =
      "rgba(255,0,0,0.08)";


    status.style.border =
      "1px solid rgba(255,0,0,0.2)";


    status.textContent =
      "AI video generation failed.\n\n" +
      "REAL ERROR:\n" +
      errorMessage;


    console.error(
      "MotionForge displayed error:",
      errorMessage
    );

  }

};


/* =========================================================
   START GENERATOR
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    MotionGenerator.init();

  }
);
