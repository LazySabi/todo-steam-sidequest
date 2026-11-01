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

const achievementSound =
  document.querySelector("#achievementSound");


// Картинки, які випадково вибираються

const achievementImages = [
  "images/achievement1.png",
  "images/achievement2.png",
  "images/achievement3.png",
  "images/achievement4.png",
];


// Завантажуємо завдання

let tasks =
  JSON.parse(localStorage.getItem("tasks")) || [];


// Зберегти завдання

function saveTasks() {

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

}


// Створити завдання

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


// Відобразити всі завдання

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


  // Повідомлення, якщо список порожній

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


// Додати нове завдання

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


// Steam achievement

function showAchievement(task) {

  // Вибираємо випадкову картинку

  const randomIndex =
    Math.floor(
      Math.random()
      * achievementImages.length
    );


  achievementImage.src =
    achievementImages[randomIndex];


  achievementTitle.textContent =
    task.title;


  // Показуємо повідомлення

  achievement.classList.add("show");


  // Програємо звук

  achievementSound.currentTime = 0;

  achievementSound.play()
    .catch(() => {

      console.log(
        "Браузер заблокував звук"
      );

    });


  // Ховаємо через 5 секунд

  setTimeout(() => {

    achievement.classList.remove("show");

  }, 5000);

}


// Кнопка

addTaskButton.addEventListener(
  "click",
  addTask
);


// Enter у полі назви

taskTitleInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      addTask();
    }

  }
);


// Початкове завантаження

renderTasks();