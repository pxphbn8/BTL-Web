let tasks;

// Script để gọi API từ server
document.addEventListener('DOMContentLoaded', () => {
  fetchDataFromServer();
});

async function fetchDataFromServer() {
  try {
    const userID = localStorage.getItem('userID');
    const response = await fetch(`http://localhost:3001/api/completed/getCompleted/${userID}`);
    const responseData = await response.json();

    if (!Array.isArray(responseData) && typeof responseData !== 'object') {
      console.error('Data from server is not in the expected format:', responseData);
      return;
    }

    tasks = Array.isArray(responseData) ? responseData : [responseData];

    const taskContainer = document.getElementById('taskContainer');
    tasks.forEach((task, index) => {
      const taskDiv = createTaskElement(task, index);
      taskContainer.appendChild(taskDiv);

      // Add Update modal
      const modalUpdate = createModal('modalUpdate' + index, 'Update Task', task);
      taskContainer.appendChild(modalUpdate);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function createTaskElement(task, index) {
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task');
  taskDiv.setAttribute('data-task-id', task.task_id);

  const taskInfoDiv = document.createElement('div');
  taskInfoDiv.classList.add('taskInfo');
  taskInfoDiv.innerHTML = `
    <strong>${task.title}</strong><br>
    Due Date: ${task.dueDate}<br>
    Description: ${task.description}
  `;
  taskDiv.appendChild(taskInfoDiv);

  const statusDiv = document.createElement('div');
  statusDiv.classList.add('status');
  if (task.isImportant) {
    const importantSpan = document.createElement('span');
    importantSpan.classList.add('important_task');
    importantSpan.textContent = 'important';
    statusDiv.appendChild(importantSpan);
  }
  if (task.isCompleted) {
    const completedSpan = document.createElement('span');
    completedSpan.classList.add('completed_task');
    completedSpan.textContent = 'completed';
    statusDiv.appendChild(completedSpan);
  }
  taskDiv.appendChild(statusDiv);

  const actionButtonsDiv = document.createElement('div');
  actionButtonsDiv.classList.add('action-buttons');

  const commentButton = createActionButton('Comment', () => {
    localStorage.setItem("currentTask", task.task_id);
    openCommentForm(task);
  });

  actionButtonsDiv.appendChild(commentButton);
  taskDiv.appendChild(actionButtonsDiv);

  // Create and append comments container
  let commentContainer = taskDiv.querySelector('.comments');
  if (!commentContainer) {
    commentContainer = document.createElement('div');
    commentContainer.classList.add('comments');
    taskDiv.appendChild(commentContainer);
  }

  return taskDiv;
}

function createActionButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  button.classList.add('comment-button');
  return button;
}

function createModal(modalId, modalTitle, task) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.id = modalId;

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalContent.appendChild(createCloseButton(modalId));

  const modalTitleDiv = document.createElement('h2');
  modalTitleDiv.textContent = modalTitle;
  modalContent.appendChild(modalTitleDiv);

  const modalForm = document.createElement('form');
  modalForm.appendChild(createInput('Title', 'text', task.title));
  modalForm.appendChild(createInput('Due Date', 'date', task.dueDate));
  modalForm.appendChild(createInput('Description', 'text', task.description));
  modalForm.appendChild(createInput('Is Important', 'checkbox', task.isImportant));
  modalForm.appendChild(createInput('Is Completed', 'checkbox', task.isCompleted));

  const saveButton = document.createElement('button');
  saveButton.className = 'save-button';
  saveButton.textContent = 'Save Update';
  saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(modalId);
  });
  modalForm.appendChild(saveButton);

  modalContent.appendChild(modalForm);
  modal.appendChild(modalContent);

  return modal;
}

function createCloseButton(modalId) {
  const closeSpan = document.createElement('span');
  closeSpan.className = 'close';
  closeSpan.innerHTML = '&times;';
  closeSpan.addEventListener('click', () => closeModal(modalId));
  return closeSpan;
}

function createInput(labelText, inputType, value) {
  const inputDiv = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText + ':';
  inputDiv.appendChild(label);

  const input = document.createElement('input');
  input.type = inputType;
  input.value = inputType === 'checkbox' ? value : value;

  switch (labelText) {
    case "Title": input.id = "title"; break;
    case "Due Date": input.id = "dueDate"; break;
    case "Description": input.id = "description"; break;
    case "Is Important": input.id = "isImportant"; break;
    default: input.id = 'isCompleted';
  }

  inputDiv.appendChild(input);
  return inputDiv;
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Hàm mở form comment
async function openCommentForm(task) {
  const taskContainer = document.getElementById('taskContainer');
  const taskId = task.task_id;

  try {
    const response = await fetch(`http://localhost:3001/api/comments/getAllComments/${taskId}`);
    const comments = await response.json();
    
    const commentModal = createCommentModal(taskId);
    taskContainer.appendChild(commentModal);

    openModal('commentModal' + taskId);

    // Hiển thị các comment hiện có
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comments');
    comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.innerHTML = `<strong>${comment.userId}</strong>: ${comment.comment}`;
      commentDiv.appendChild(commentElement);
    });
    commentModal.querySelector('.modal-content').appendChild(commentDiv);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}

function createCommentModal(taskId) {
  const commentModal = document.createElement('div');
  commentModal.classList.add('modal');
  commentModal.id = 'commentModal' + taskId;

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalContent.appendChild(createCloseButton('commentModal' + taskId));

  const modalTitleDiv = document.createElement('h2');
  modalTitleDiv.textContent = 'Add Comment';
  modalContent.appendChild(modalTitleDiv);

  const commentForm = document.createElement('form');
  const commentTextArea = document.createElement('textarea');
  commentTextArea.placeholder = 'Write your comment here...';
  commentForm.appendChild(commentTextArea);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit Comment';
  submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    saveComment(taskId, commentTextArea.value); // Lưu comment khi submit
  });

  commentForm.appendChild(submitButton);
  modalContent.appendChild(commentForm);
  commentModal.appendChild(modalContent);

  return commentModal;
}

// Lưu comment vào server
async function saveComment(taskId, comment) {
  try {
    const userId = localStorage.getItem('userID');
    if (!userId || !comment) {
      alert('User ID or comment is missing.');
      return;
    }

    const response = await fetch('http://localhost:3001/api/comments/addComment/' + userId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, comment }),
    });

    const responseData = await response.json();
    if (responseData.success) {
      alert('Comment submitted successfully!');
      updateCommentInDOM(taskId, comment, responseData.userName);
      closeModal('commentModal' + taskId);
    } else {
      alert('Failed to submit comment.');
    }
  } catch (error) {
    console.error('Error saving comment:', error);
    alert('There was an error saving the comment.');
  }
}

function updateCommentInDOM(taskId, comment, userName) {
  const taskDiv = document.querySelector(`#taskContainer .task[data-task-id='${taskId}'] .comments`);
  if (taskDiv) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `<strong>${userName}</strong>: ${comment}`;
    taskDiv.appendChild(commentDiv);
  }
}
