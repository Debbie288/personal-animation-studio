/* =========================================================
   MOTIONFORGE STUDIO
   REAL AI IMAGE-TO-VIDEO GENERATOR
   Wan 2.2
   ========================================================= */

import { client } from "https://esm.sh/@gradio/client";


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
      "MotionForge: Real Wan 2.2 generator loaded."
    );

  },


  /* -------------------------------------------------------
     GENERATE REAL VIDEO
     ------------------------------------------------------- */

  async generate(settings) {

    if (this.isGenerating) {
      return;
    }


    this.isGenerating = true;

    this.showGeneratingState();


    try {

      console.log(
        "MotionForge: Connecting to Wan 2.2..."
      );


      /*
       Convert the image used by MotionForge
       into a base64 image string.
      */

      const imageBase64 =
        await this.imageToBase64(
          settings.image
        );


      /*
       Connect to the public Wan 2.2
       Hugging Face Space.
      */

      const app =
        await client(
          "prithivMLmods/Wan2.2-Fast"
        );


      this.updateStatus(
        "Connected to Wan 2.2. Generating your video..."
      );


      /*
       Call the real generate_video endpoint.
      */

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
        "MotionForge Wan result:",
        result
      );


      const videoData =
        result &&
        result.data
          ? result.data[0]
          : null;


      if (!videoData) {

        throw new Error(
          "Wan 2.2 returned no video."
        );

      }


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
     If the scene already contains a data URL,
     use it directly.
    */

    if (
      typeof imageSource === "string" &&
      imageSource.startsWith("data:image/")
    ) {

      return imageSource;

    }


    /*
     Otherwise fetch the image and convert it.
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
          () => resolve(
            reader.result
          );


        reader.onerror =
          () => reject(
            new Error(
              "Could not convert image."
            )
          );


        reader.readAsDataURL(
          blob
        );

      }
    );

  },


  /* -------------------------------------------------------
     SHOW GENERATED VIDEO
     ------------------------------------------------------- */

  async showGeneratedVideo(videoData) {

    let videoUrl = null;


    /*
     Gradio normally returns a file object
     containing a URL.
    */

    if (
      videoData &&
      typeof videoData === "object" &&
      videoData.url
    ) {

      videoUrl =
        videoData.url;

    }


    /*
     Some Gradio responses can return
     a string URL directly.
    */

    if (
      !videoUrl &&
      typeof videoData === "string"
    ) {

      videoUrl =
        videoData;

    }


    if (!videoUrl) {

      throw new Error(
        "The generated video URL was not found."
      );

    }


    /*
     Create the video player.
    */

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


      if (status) {

        status.parentNode.insertBefore(
          video,
          status
        );

      }

    }


    video.src =
      videoUrl;


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
     UI STATES
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


  updateStatus(message) {

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


  showError(message) {

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
   START GENERATOR
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    MotionGenerator.init();

  }
);
