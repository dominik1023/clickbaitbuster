// Function to save the entered words and phrases to local storage
function saveWords() {
  const inputs = document.querySelectorAll(".word-input");
  const words = new Set();
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const word = input.value.trim();
    if (word) {
      words.add(word);
    }
  }
  chrome.storage.local.set({ words: Array.from(words) }, function () {
    console.log("Words saved");
  });
}

// Retrieve the saved words and phrases from local storage
chrome.storage.local.get({ words: [] }, function (result) {
  const words = new Set(result.words);
  words.forEach((word) => {
    const group = document.createElement("div");
    group.classList.add("input-group");
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("word-input");
    input.value = word;
    input.disabled = true;
    group.appendChild(input);
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", function () {
      const newWord = prompt("Enter the updated word or phrase");
      if (newWord) {
        words.delete(word);
        words.add(newWord);
        input.value = newWord;
        saveWords();
      }
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
      document.getElementById("input-container").removeChild(group);
      words.delete(word);
      saveWords();
    });
    group.appendChild(editBtn);
    group.appendChild(deleteBtn);
    document.getElementById("input-container").appendChild(group);
  });
  addInput();
});

// Function to add a new input field
function addInput() {
  const container = document.getElementById("input-container");
  const group = document.createElement("div");
  group.classList.add("input-group");
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("word-input");
  input.placeholder = "Enter word or phrase";
  group.appendChild(input);
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", function () {
    const word = prompt("Enter the updated word or phrase");
    if (word) {
      input.value = word;
      saveWords();
    }
  });
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", function () {
    container.removeChild(group);
    saveWords();
  });
  group.appendChild(editBtn);
  group.appendChild(deleteBtn);
  container.appendChild(group);
  input.focus();
}

document.addEventListener("keydown", function (event) {
  const input = event.target;
  if (
    event.keyCode === 13 &&
    input.classList.contains("word-input") &&
    input.value.trim() !== ""
  ) {
    saveWords();
    const nextInput = input.parentElement.nextSibling
      ? input.parentElement.nextSibling.querySelector(".word-input")
      : null;
    if (nextInput) {
      nextInput.focus();
    } else {
      addInput();
    }
    event.preventDefault();
  }
});

// Add an event listener to the add button to add a new input field
document.getElementById("add-btn").addEventListener("click", function () {
  addInput();
});

// Add an event listener to the save button to save the entered words and phrases
document.getElementById("save-btn").addEventListener("click", saveWords);

// Retrieve the saved words and phrases from local storage
chrome.storage.local.get(null, function (result) {
  let index = 0;
  const words = new Set();
  for (const key in result) {
    if (key.startsWith("word")) {
      const word = result[key];
      if (word.trim() !== "") {
        words.add(word);
      }
      index++;
    }
  }
  if (index == 0) {
    addInput();
  } else {
    for (const container of titleContainers) {
      const title = container.textContent.trim();
      if (words.has(title)) {
        container.closest("ytd-video-renderer").style.border = "2px solid red";
      }
    }
  }
});

// Add an event listener for the scroll event to check for new title containers
window.addEventListener("scroll", function () {
  titleContainers = document.querySelectorAll("#video-title");
  for (const container of titleContainers) {
    const title = container.textContent.trim();
    if (!titles.has(title)) {
      titles.add(title);
      if (words.has(title)) {
        container.closest("ytd-video-renderer").style.border = "2px solid red";
      }
    }
  }
});
