/* =========================================================
   MOTIONFORGE STUDIO
   Personal Cinematic Animation Studio
   ========================================================= */


/* ---------- APP STATE ---------- */

const state = {

  projectName: "My New Movie",

  currentScene: 0,

  motion: "none",

  intensity: 45,

  duration: 5,

  scenes: [

    {
      id: Date.now(),
      name: "Opening Scene",
      image: null,
      imageName: "",
      motion: "none",
      intensity: 45,
      duration: 5,
      narration: "",
      voice: null,
      music: null,
      sound: null
    }

  ]

};


/* ---------- ELEMENTS ---------- */

const projectName =
  document.getElementById("projectName");

const projectStatus =
  document.getElementById("projectStatus");

const imageInput =
  document.getElementById("imageInput");

const emptyUploadBtn =
  document.getElementById("emptyUploadBtn");

const previewImage =
  document.getElementById("previewImage");

const emptyPreview =
  document.getElementById("emptyPreview");

const previewStage =
  document.getElementById("previewStage");

const animationBadge =
  document.getElementById("animationBadge");

const sceneBadge =
  document.getElementById("sceneBadge");

const intensity =
  document.getElementById("intensity");

const durationSelect =
  document.getElementById("durationSelect");

const sceneList =
  document.getElementById("sceneList");

const sceneCount =
  document.getElementById("sceneCount");

const addSceneBtn =
  document.getElementById("addSceneBtn");

const narrationText =
  document.getElementById("narrationText");

const voiceInput =
  document.getElementById("voiceInput");

const voiceName =
  document.getElementById("voiceName");

const musicInput =
  document.getElementById("musicInput");

const musicName =
  document.getElementById("musicName");

const soundInput =
  document.getElementById("soundInput");

const soundName =
  document.getElementById("soundName");

const playBtn =
  document.getElementById("playBtn");

const progressFill =
  document.getElementById("progressFill");

const currentTime =
  document.getElementById("currentTime");

const durationTime =
  document.getElementById("durationTime");

const saveProjectBtn =
  document.getElementById("saveProjectBtn");

const saveMovieBtn =
  document.getElementById("saveMovieBtn");

const previewMovieBtn =
  document.getElementById("previewMovieBtn");

const fullscreenBtn =
  document.getElementById("fullscreenBtn");

const previewModal =
  document.getElementById("previewModal");

const closeModal =
  document.getElementById("closeModal");

const fullscreenImage =
  document.getElementById("fullscreenImage");

const modalPlayBtn =
  document.getElementById("modalPlayBtn");

const modalSceneName =
  document.getElementById("modalSceneName");

const voiceAudio =
  document.getElementById("voiceAudio");

const musicAudio =
  document.getElementById("musicAudio");

const soundAudio =
  document.getElementById("soundAudio");


/* ---------- MOTION NAMES ---------- */

const motionNames = {

  none: "No Motion",

  zoom: "Cinematic Zoom",

  pan: "Slow Pan",

  float: "Living Frame",

  breath: "Breathing",

  dramatic: "Dramatic"

};


/* ---------- INITIALIZATION ---------- */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderScenes();

    loadScene(0);

    setupMotionButtons();

  }
);


/* ---------- PROJECT NAME ---------- */

projectName.addEventListener(
  "input",
  () => {

    state.projectName =
      projectName.value.trim() ||
      "My New Movie";

    markChanged();

  }
);


/* ---------- IMAGE UPLOAD ---------- */

emptyUploadBtn.addEventListener(
  "click",
  () => {

    imageInput.click();

  }
);


imageInput.addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

      alert("Please select an image file.");

      return;

    }

    const reader =
      new FileReader();

    reader.onload =
      event => {

        const scene =
          getCurrentScene();

        scene.image =
          event.target.result;

        scene.imageName =
          file.name;

        previewImage.src =
          scene.image;

        previewImage.style.display =
          "block";

        emptyPreview.style.display =
          "none";

        renderScenes();

        markChanged();

      };

    reader.readAsDataURL(file);

  }
);


/* ---------- MOTION BUTTONS ---------- */

function setupMotionButtons() {

  const buttons =
    document.querySelectorAll(
      ".motion-card"
    );

  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        buttons.forEach(
          item =>
            item.classList.remove("active")
        );

        button.classList.add("active");

        const motion =
          button.dataset.motion;

        state.motion =
          motion;

        const scene =
          getCurrentScene();

        scene.motion =
          motion;

        scene.intensity =
          Number(intensity.value);

        applyMotion();

        animationBadge.textContent =
          motionNames[motion];

        markChanged();

      }
    );

  });

}


/* ---------- APPLY MOTION ---------- */

function applyMotion() {

  const scene =
    getCurrentScene();

  if (!scene) return;

  previewImage.className =
    "preview-image";

  previewImage.style.setProperty(
    "--motion-duration",
    `${Math.max(
      2,
      scene.duration
    )}s`
  );


  const motion =
    scene.motion;


  if (motion !== "none") {

    previewImage.classList.add(
      `motion-${motion}`
    );

  }


  /*
    Intensity changes animation scale.
    This is the local visual motion layer.
  */

  const intensityValue =
    Number(scene.intensity || 45);

  const scale =
    1 +
    (intensityValue / 1000);

  previewImage.style.setProperty(
    "--motion-scale",
    scale
  );

}


/* ---------- INTENSITY ---------- */

intensity.addEventListener(
  "input",
  () => {

    const scene =
      getCurrentScene();

    if (!scene) return;

    scene.intensity =
      Number(intensity.value);

    applyMotion();

    markChanged();

  }
);


/* ---------- DURATION ---------- */

durationSelect.addEventListener(
  "change",
  () => {

    const scene =
      getCurrentScene();

    if (!scene) return;

    scene.duration =
      Number(durationSelect.value);

    applyMotion();

    durationTime.textContent =
      formatTime(scene.duration);

    markChanged();

  }
);


/* ---------- GET CURRENT SCENE ---------- */

function getCurrentScene() {

  return state.scenes[
    state.currentScene
  ];

}


/* ---------- LOAD SCENE ---------- */

function loadScene(index) {

  if (
    index < 0 ||
    index >= state.scenes.length
  ) {

    return;

  }


  state.currentScene =
    index;


  const scene =
    getCurrentScene();


  if (scene.image) {

    previewImage.src =
      scene.image;

    previewImage.style.display =
      "block";

    emptyPreview.style.display =
      "none";

  } else {

    previewImage.removeAttribute(
      "src"
    );

    previewImage.style.display =
      "none";

    emptyPreview.style.display =
      "flex";

  }


  intensity.value =
    scene.intensity || 45;


  durationSelect.value =
    scene.duration || 5;


  narrationText.value =
    scene.narration || "";


  state.motion =
    scene.motion || "none";


  updateMotionButtons();

  applyMotion();


  sceneBadge.textContent =
    `SCENE ${String(index + 1).padStart(2,"0")}`;


  animationBadge.textContent =
    motionNames[
      scene.motion || "none"
    ];


  durationTime.textContent =
    formatTime(scene.duration || 5);


  if (scene.voice) {

    voiceName.textContent =
      scene.voice.name;

  } else {

    voiceName.textContent =
      "MP3, WAV, M4A";

  }


  if (scene.music) {

    musicName.textContent =
      scene.music.name;

  } else {

    musicName.textContent =
      "Add music";

  }


  if (scene.sound) {

    soundName.textContent =
      scene.sound.name;

  } else {

    soundName.textContent =
      "Rain, footsteps, wind...";

  }


  renderScenes();

}


/* ---------- MOTION BUTTON UPDATE ---------- */

function updateMotionButtons() {

  document
    .querySelectorAll(".motion-card")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.motion ===
        state.motion
      );

    });

}


/* ---------- RENDER SCENES ---------- */

function renderScenes() {

  sceneList.innerHTML = "";

  state.scenes.forEach(
    (scene, index) => {

      const card =
        document.createElement("div");

      card.className =
        "scene-card";

      if (
        index === state.currentScene
      ) {

        card.classList.add("active");

      }


      const image =
        document.createElement("img");

      image.className =
        "scene-thumb";


      if (scene.image) {

        image.src =
          scene.image;

      } else {

        image.alt =
          "Empty scene";

      }


      const info =
        document.createElement("div");

      info.innerHTML = `

        <div class="scene-number">
          SCENE ${String(index + 1).padStart(2,"0")}
        </div>

        <div class="scene-title">
          ${escapeHTML(scene.name)}
        </div>

      `;


      const deleteButton =
        document.createElement("button");

      deleteButton.className =
        "delete-scene";

      deleteButton.textContent =
        "×";


      deleteButton.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          deleteScene(index);

        }
      );


      card.appendChild(image);

      card.appendChild(info);

      card.appendChild(deleteButton);


      card.addEventListener(
        "click",
        () => {

          loadScene(index);

        }
      );


      sceneList.appendChild(card);

    }
  );


  sceneCount.textContent =
    `${state.scenes.length} ${
      state.scenes.length === 1
        ? "scene"
        : "scenes"
    }`;

}


/* ---------- ADD SCENE ---------- */

addSceneBtn.addEventListener(
  "click",
  () => {

    const number =
      state.scenes.length + 1;


    state.scenes.push({

      id: Date.now(),

      name:
        `Scene ${String(number).padStart(2,"0")}`,

      image: null,

      imageName: "",

      motion: "none",

      intensity: 45,

      duration: 5,

      narration: "",

      voice: null,

      music: null,

      sound: null

    });


    loadScene(
      state.scenes.length - 1
    );


    markChanged();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* ---------- DELETE SCENE ---------- */

function deleteScene(index) {

  if (state.scenes.length === 1) {

    alert(
      "Your project needs at least one scene."
    );

    return;

  }


  const confirmed =
    confirm(
      "Delete this scene?"
    );


  if (!confirmed) return;


  state.scenes.splice(
    index,
    1
  );


  if (
    state.currentScene >=
    state.scenes.length
  ) {

    state.currentScene =
      state.scenes.length - 1;

  }


  loadScene(
    state.currentScene
  );


  markChanged();

}


/* ---------- NARRATION ---------- */

narrationText.addEventListener(
  "input",
  () => {

    const scene =
      getCurrentScene();

    if (!scene) return;

    scene.narration =
      narrationText.value;

    markChanged();

  }
);


/* ---------- VOICE ---------- */

voiceInput.addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];

    if (!file) return;


    const scene =
      getCurrentScene();

    scene.voice = {

      name: file.name,

      type: file.type,

      url:
        URL.createObjectURL(file)

    };


    voiceName.textContent =
      file.name;


    voiceAudio.src =
      scene.voice.url;


    markChanged();

  }
);


/* ---------- MUSIC ---------- */

musicInput.addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];

    if (!file) return;


    const scene =
      getCurrentScene();

    scene.music = {

      name: file.name,

      type: file.type,

      url:
        URL.createObjectURL(file)

    };


    musicName.textContent =
      file.name;


    markChanged();

  }
);


/* ---------- SOUND EFFECT ---------- */

soundInput.addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];

    if (!file) return;


    const scene =
      getCurrentScene();

    scene.sound = {

      name: file.name,

      type: file.type,

      url:
        URL.createObjectURL(file)

    };


    soundName.textContent =
      file.name;


    markChanged();

  }
);


/* ---------- PLAY PREVIEW ---------- */

let isPlaying = false;

let previewTimer = null;

let previewStartedAt = 0;


playBtn.addEventListener(
  "click",
  () => {

    togglePreview();

  }
);


function togglePreview() {

  const scene =
    getCurrentScene();

  if (!scene) return;


  if (!scene.image) {

    alert(
      "Add an image to this scene first."
    );

    return;

  }


  if (isPlaying) {

    stopPreview();

  } else {

    startPreview();

  }

}


/* ---------- START PREVIEW ---------- */

function startPreview() {

  const scene =
    getCurrentScene();


  isPlaying = true;

  playBtn.textContent =
    "❚❚";


  applyMotion();


  previewStartedAt =
    Date.now();


  previewTimer =
    setInterval(
      () => {

        const elapsed =
          (Date.now() -
            previewStartedAt) /
          1000;


        const duration =
          scene.duration;


        const percentage =
          Math.min(
            100,
            (elapsed / duration) *
              100
          );


        progressFill.style.width =
          `${percentage}%`;


        currentTime.textContent =
          formatTime(elapsed);


        if (
          elapsed >= duration
        ) {

          stopPreview();

        }

      },
      50
    );


  if (scene.voice) {

    voiceAudio.currentTime =
      0;

    voiceAudio.play()
      .catch(() => {});

  }

}


/* ---------- STOP PREVIEW ---------- */

function stopPreview() {

  isPlaying = false;

  playBtn.textContent =
    "▶";


  clearInterval(
    previewTimer
  );


  previewTimer = null;


  progressFill.style.width =
    "0%";


  currentTime.textContent =
    "00:00";


  voiceAudio.pause();

}


/* ---------- FULLSCREEN ---------- */

fullscreenBtn.addEventListener(
  "click",
  () => {

    const scene =
      getCurrentScene();

    if (!scene.image) {

      alert(
        "Add an image first."
      );

      return;

    }


    fullscreenImage.src =
      scene.image;


    modalSceneName.textContent =
      scene.name;


    previewModal.classList.add(
      "show"
    );

  }
);


closeModal.addEventListener(
  "click",
  () => {

    previewModal.classList.remove(
      "show"
    );

  }
);


modalPlayBtn.addEventListener(
  "click",
  () => {

    const scene =
      getCurrentScene();

    if (!scene.image) return;


    fullscreenImage.className =
      "";


    if (
      scene.motion !== "none"
    ) {

      fullscreenImage.classList.add(
        `motion-${scene.motion}`
      );

      fullscreenImage.style.setProperty(
        "--motion-duration",
        `${scene.duration}s`
      );

    }

  }
);


/* ---------- SAVE PROJECT ---------- */

saveProjectBtn.addEventListener(
  "click",
  saveProject
);


saveMovieBtn.addEventListener(
  "click",
  saveProject
);


function saveProject() {

  const project = {

    projectName:
      state.projectName,

    scenes:
      state.scenes.map(
        scene => ({

          id: scene.id,

          name: scene.name,

          image:
            scene.image,

          imageName:
            scene.imageName,

          motion:
            scene.motion,

          intensity:
            scene.intensity,

          duration:
            scene.duration,

          narration:
            scene.narration

        })
      ),

    savedAt:
      new Date().toISOString()

  };


  try {

    localStorage.setItem(
      "motionforgeProject",
      JSON.stringify(project)
    );


    projectStatus.textContent =
      "Saved ✓";


    setTimeout(
      () => {

        projectStatus.textContent =
          "Ready";

      },
      1800
    );

  } catch (error) {

    alert(
      "Your project is too large for browser storage. We will add better project storage later."
    );

  }

}


/* ---------- LOAD SAVED PROJECT ---------- */

function loadSavedProject() {

  try {

    const saved =
      localStorage.getItem(
        "motionforgeProject"
      );


    if (!saved) return;


    const project =
      JSON.parse(saved);


    if (
      project.projectName
    ) {

      state.projectName =
        project.projectName;

      projectName.value =
        project.projectName;

    }


    if (
      Array.isArray(project.scenes) &&
      project.scenes.length
    ) {

      state.scenes =
        project.scenes;

    }


  } catch (error) {

    console.log(
      "No previous project loaded."
    );

  }

}


/* ---------- PROJECT PREVIEW ---------- */

previewMovieBtn.addEventListener(
  "click",
  () => {

    if (
      !state.scenes.some(
        scene => scene.image
      )
    ) {

      alert(
        "Add at least one image before previewing your movie."
      );

      return;

    }


    loadScene(0);


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });


    setTimeout(
      () => {

        startPreview();

      },
      400
    );

  }
);


/* ---------- SAVE WHEN LEAVING ---------- */

window.addEventListener(
  "beforeunload",
  () => {

    try {

      localStorage.setItem(
        "motionforgeProject",
        JSON.stringify({

          projectName:
            state.projectName,

          scenes:
            state.scenes.map(
              scene => ({

                id: scene.id,

                name: scene.name,

                image:
                  scene.image,

                imageName:
                  scene.imageName,

                motion:
                  scene.motion,

                intensity:
                  scene.intensity,

                duration:
                  scene.duration,

                narration:
                  scene.narration

              })
            )

        })
      );

    } catch (error) {

      console.log(
        "Automatic save unavailable."
      );

    }

  }
);


/* ---------- HELPERS ---------- */

function formatTime(seconds) {

  seconds =
    Math.max(
      0,
      Math.floor(seconds)
    );


  const minutes =
    Math.floor(
      seconds / 60
    );

  const remaining =
    seconds % 60;


  return `${String(minutes).padStart(2,"0")}:${String(remaining).padStart(2,"0")}`;

}


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* ---------- START ---------- */

loadSavedProject();

renderScenes();

loadScene(
  state.currentScene
);
