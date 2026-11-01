const taskTitleInput = document.querySelector("#taskTitle");
const taskDescriptionInput = document.querySelector("#taskDescription");

const addTaskButton = document.querySelector("#addTaskButton");

const activeTasksContainer =
  document.querySelector("#activeTasks");

const completedTasksContainer =
  document.querySelector("#completedTasks");

const achievement =
  document.querySelector("#achievement");

const achievementImage =
  document.querySelector("#achievementImage");

const achievementTitle =
  document.querySelector("#achievementTitle");

const achievementDescription =
  document.querySelector("#achievementDescription");

const achievementSound =
  document.querySelector("#achievementSound");


/* =========================
   КАРТИНКИ АЧІВОК
========================= */

const achievementImages = [
  "images/achievement1.png",
  "images/achievement2.png",
  "images/achievement3.png",
  "images/achievement4.png",
];


/*
  Зберігаємо останню картинку,
  щоб одна й та сама не випадала
  два рази поспіль
*/

let lastAchievementImage = null;


/*
  Тут буде зберігатися таймер.

  Це виправляє проблему, коли
  старий setTimeout() ховає
  нову ачівку.
*/

let achievementTimeout = null;


/* =========================
   ЗАВДАННЯ
========================= */

let tasks =
  JSON.parse(localStorage.getItem("tasks")) || [];


/* Зберегти */

function saveTasks() {

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

}


/* Перше речення опису */

function getFirstSentence(description) {

  if (!description) {
    return "Завдання успішно виконано!";
  }


  const firstSentence =
    description
      .trim()
      .split(/[.!?]/)[0]
      .trim();


  return firstSentence || description;

}


/* Створити HTML завдання */

function createTaskElement(task) {

  const taskElement =
    document.createElement("div");

  taskElement.classList.add("task");


  const taskInfo =
    document.createElement("div");

  taskInfo.classList.add("task-info");


  const title =
    document.createElement("span");

  title.classList.add("task-title");

  title.textContent = task.title;


  const description =
    document.createElement("div");

  description.classList.add(
    "task-description"
  );

  description.textContent =
    task.description;


  const checkbox =
    document.createElement("input");

  checkbox.type = "checkbox";

  checkbox.classList.add(
    "task-checkbox"
  );

  checkbox.checked =
    task.completed;


  checkbox.addEventListener(
    "change",
    () => {

      task.completed =
        checkbox.checked;

      saveTasks();

      renderTasks();


      if (task.completed) {
        showAchievement(task);
      }

    }
  );


  taskInfo.append(
    title,
    description
  );

  taskElement.append(
    taskInfo,
    checkbox
  );


  return taskElement;
}


/* =========================
   ВІДОБРАЖЕННЯ ЗАВДАНЬ
========================= */

function renderTasks() {

  activeTasksContainer.innerHTML = "";

  completedTasksContainer.innerHTML = "";


  const activeTasks =
    tasks.filter(
      task => !task.completed
    );


  const completedTasks =
    tasks.filter(
      task => task.completed
    );


  activeTasks.forEach(task => {

    activeTasksContainer.append(
      createTaskElement(task)
    );

  });


  completedTasks.forEach(task => {

    completedTasksContainer.append(
      createTaskElement(task)
    );

  });


  if (activeTasks.length === 0) {

    activeTasksContainer.innerHTML =
      `<p class="empty-text">
        Немає активних завдань
      </p>`;

  }


  if (completedTasks.length === 0) {

    completedTasksContainer.innerHTML =
      `<p class="empty-text">
        Ще немає виконаних завдань
      </p>`;

  }

}


/* =========================
   ДОДАВАННЯ ЗАВДАННЯ
========================= */

function addTask() {

  const title =
    taskTitleInput.value.trim();

  const description =
    taskDescriptionInput.value.trim();


  if (!title) {

    alert(
      "Введіть назву завдання!"
    );

    return;

  }


  const newTask = {

    id: Date.now(),

    title: title,

    description: description,

    completed: false,

  };


  tasks.push(newTask);


  saveTasks();


  taskTitleInput.value = "";

  taskDescriptionInput.value = "";


  renderTasks();

}


addTaskButton.addEventListener(
  "click",
  addTask
);


/* Enter додає завдання */

taskTitleInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      addTask();

    }

  }
);


/* =========================
   ВИПАДКОВА КАРТИНКА
========================= */

function getRandomAchievementImage() {

  /*
    Якщо картинка лише одна
  */

  if (achievementImages.length === 1) {

    return achievementImages[0];

  }


  /*
    Створюємо список без
    попередньої картинки
  */

  const availableImages =
    achievementImages.filter(
      image =>
        image !== lastAchievementImage
    );


  const randomIndex =
    Math.floor(
      Math.random()
      * availableImages.length
    );


  const selectedImage =
    availableImages[randomIndex];


  lastAchievementImage =
    selectedImage;


  return selectedImage;

}


/* =========================
   ACHIEVEMENT
========================= */

function showAchievement(task) {


  /*
    ЗУПИНЯЄМО старий таймер.

    Це важливо:
    стара ачівка більше не зможе
    сховати нову.
  */

  if (achievementTimeout) {

    clearTimeout(
      achievementTimeout
    );

  }


  /*
    Назва ачівки =
    назва завдання
  */

  achievementTitle.textContent =
    task.title;


  /*
    Опис ачівки =
    перше речення опису
  */

  achievementDescription.textContent =
    getFirstSentence(
      task.description
    );


  /*
    Нова випадкова картинка
  */

  achievementImage.src =
    getRandomAchievementImage();


  /*
    Якщо картинка ще завантажується,
    браузер не буде показувати
    стару як нову.
  */

  achievementImage.alt =
    task.title;


  /*
    Перезапускаємо звук
  */

  achievementSound.currentTime = 0;

  achievementSound.play()
    .catch(() => {

      console.log(
        "Не вдалося відтворити звук"
      );

    });


  /*
    Показуємо ачівку
  */

  achievement.classList.add("show");


  /*
    Створюємо НОВИЙ таймер
  */

  achievementTimeout =
    setTimeout(() => {

      achievement.classList.remove(
        "show"
      );

      achievementTimeout = null;

    }, 5000);

}


/* =========================
   ПЕРШЕ ЗАВАНТАЖЕННЯ
========================= */

renderTasks();