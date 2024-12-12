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

    if (Array.isArray(responseData)) {
      tasks = responseData;
    } else if (typeof responseData === 'object') {
      tasks = [responseData];
    } else {
      console.error('Data from server is not an array or object:', responseData);
      return;
    }

    tasks.forEach((task, index) => {
      const taskContainer = document.getElementById('taskContainer');
      const taskDiv = document.createElement('div');
      taskDiv.classList.add('task');
      taskDiv.setAttribute('data-task-id', task.task_id); // Đảm bảo mỗi task có data-task-id

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

      const updateButton = document.createElement('button');
      updateButton.classList.add('update');
      updateButton.textContent = 'Update';
      updateButton.addEventListener('click', () => openModal('modalUpdate' + index));

      const commentButton = document.createElement('button');
      commentButton.classList.add('comment');
      commentButton.textContent = 'Comment';
      commentButton.addEventListener('click', () => {
        localStorage.setItem("currentTask", task.task_id);
        openCommentForm(task); 
      });

      actionButtonsDiv.appendChild(updateButton);
      actionButtonsDiv.appendChild(commentButton);
      taskDiv.appendChild(actionButtonsDiv);

      // Kiểm tra và tạo phần tử comment container nếu chưa có
      let commentContainer = taskDiv.querySelector('.comments');
      if (!commentContainer) {
        commentContainer = document.createElement('div');
        commentContainer.classList.add('comments');
        taskDiv.appendChild(commentContainer);
      }

      taskContainer.appendChild(taskDiv);

      // Thêm modal Update
      const modalUpdate = createModal('modalUpdate' + index, 'Update Task', task);
      taskContainer.appendChild(modalUpdate);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}



function createModal(modalId, modalTitle, task) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.id = modalId;

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const closeSpan = document.createElement('span');
  closeSpan.className = 'close';
  closeSpan.innerHTML = '&times;';
  closeSpan.addEventListener('click', () => closeModal(modalId));
  modalContent.appendChild(closeSpan);

  const modalTitleDiv = document.createElement('h2');
  modalTitleDiv.textContent = modalTitle;
  modalContent.appendChild(modalTitleDiv);

  const modalForm = document.createElement('form');
  const inputTitle = createInput('Title', 'text', task.title);
  inputTitle.className = 'newinfo';
  modalForm.appendChild(inputTitle);

  const inputDueDate = createInput('Due Date', 'date', task.dueDate);
  inputDueDate.className = 'newinfo';
  modalForm.appendChild(inputDueDate);

  const inputDescription = createInput('Description', 'text', task.description);
  inputDescription.className = 'newinfo';
  modalForm.appendChild(inputDescription);

  const inputIsImportant = createInput('Is Important', 'checkbox', task.isImportant);
  inputIsImportant.className = 'newinfo';
  modalForm.appendChild(inputIsImportant);

  const inputIsCompleted = createInput('Is Completed', 'checkbox', task.isCompleted);
  inputIsCompleted.className = 'newinfo';
  modalForm.appendChild(inputIsCompleted);

  if (modalTitle === 'Update Task') {
    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.textContent = 'Save Update';
    saveButton.addEventListener('click', () => closeModal(modalId));
    modalForm.appendChild(saveButton);
  }

  modalContent.appendChild(modalForm);
  modal.appendChild(modalContent);

  return modal;
}

function createInput(labelText, inputType, value) {
  const inputDiv = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText + ':';
  inputDiv.appendChild(label);

  const input = document.createElement('input');
  input.type = inputType;
  if (input.type === 'checkbox') {
    input.checked = value;
  } else {
    input.value = value;
  }

  switch (labelText) {
    case "Title":
      input.id = "title";
      break;
    case "Due Date":
      input.id = "dueDate";
      break;
    case "Description":
      input.id = "description";
      break;
    case "Is Important":
      input.id = "isImportant";
      break;
    default:
      input.id = 'isCompleted';
  }

  inputDiv.appendChild(input);

  return inputDiv;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
}

// Hàm mở form comment
async function openCommentForm(task) {
  const taskContainer = document.getElementById('taskContainer');
  const taskId = task.task_id;
  
  // Gọi API lấy các comment đã có
  const response = await fetch(`http://localhost:3001/api/comments/getAllComments/${taskId}`);
  const comments = await response.json();

  const commentModal = document.createElement('div');
  commentModal.classList.add('modal');
  commentModal.id = 'commentModal' + taskId;

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const closeSpan = document.createElement('span');
  closeSpan.className = 'close';
  closeSpan.innerHTML = '&times;';
  closeSpan.addEventListener('click', () => closeModal('commentModal' + taskId));
  modalContent.appendChild(closeSpan);

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
  taskContainer.appendChild(commentModal);

  openModal('commentModal' + taskId);

  // Hiển thị các comment hiện có
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comments');
  comments.forEach((comment) => {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `<strong>${comment.userId}</strong>: ${comment.comment}`;
    commentDiv.appendChild(commentElement);
  });
  
  // Thêm commentDiv vào modal
  modalContent.appendChild(commentDiv);
}

// Lưu comment vào server
async function saveComment(taskId, comment) {
  try {
    const userId = localStorage.getItem('userID');

    // Kiểm tra giá trị của userId và comment
    if (!userId || !comment) {
      alert('User ID or comment is missing.');
      return;
    }

    const response = await fetch('http://localhost:3001/api/comments/addComment/' + userId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId: taskId,
        comment: comment,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      alert('Comment submitted successfully!');

      // Thêm comment vào DOM
      const taskDiv = document.querySelector(`#taskContainer .task[data-task-id='${taskId}'] .comments`);
      
      if (taskDiv) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `<strong>${responseData.userName}</strong>: ${comment}`;
        taskDiv.appendChild(commentDiv);
      }

      closeModal('commentModal' + taskId);
    } else {
      alert('Failed to submit comment.');
    }
  } catch (error) {
    console.error('Error saving comment:', error);
    alert('There was an error saving the comment.');
  }
}
