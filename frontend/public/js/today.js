let tasks;

document.addEventListener('DOMContentLoaded', fetchDataFromServer);

async function fetchDataFromServer() {
  try {
    const userID = localStorage.getItem('userID');
    const response = await fetch(`http://localhost:3001/api/today/getToday/${userID}`);
    tasks = await response.json();

    tasks = Array.isArray(tasks) ? tasks : [tasks];
    renderTasks();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderTasks() {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskDiv = createElement('div', { class: 'task' }, [
      createTaskInfo(task),
      createTaskStatus(task),
      createActionButtons(task, index),
      createModal(`modalUpdate${index}`, 'Update Task', task, index),
      createAttachmentModal(`attachmentModal${index}`, task),
    ]);

    taskContainer.appendChild(taskDiv);
  });
}

function createTaskInfo(task) {
  return createElement('div', { class: 'taskInfo' }, [
    createElement('strong', {}, task.title),
    createElement('div', {}, `Due Date: ${task.dueDate}`),
    createElement('div', {}, `Description: ${task.description}`)
  ]);
}

function createTaskStatus(task) {
  const statusDiv = createElement('div', { class: 'status' });

  if (task.isImportant) {
    statusDiv.appendChild(createElement('span', { class: 'important_task' }, 'important'));
  }

  const daysLeft = Math.floor((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 2 && !task.isCompleted) {
    statusDiv.appendChild(createElement('span', { class: 'bi bi-exclamation-triangle alert-icon' }));
  }

  if (task.isCompleted) {
    statusDiv.appendChild(createElement('span', { class: 'completed_task' }, 'completed'));
  }

  return statusDiv;
}

function createActionButtons(task, index) {
  const actionDiv = createElement('div', { class: 'action-buttons' });

  actionDiv.appendChild(createButton('Update', 'update', () => openModal(`modalUpdate${index}`)));

  if (!task.isCompleted) {
    actionDiv.appendChild(createButton('Attachment', 'attachment', () => openModal(`attachmentModal${index}`)));
  }

  return actionDiv;
}

function createModal(modalId, modalTitle, task, index) {
  return createElement('div', { class: 'modal', id: modalId }, [
    createElement('div', { class: 'modal-content' }, [
      createElement('span', { class: 'close', onclick: () => closeModal(modalId) }, '&times;'),
      createElement('h2', {}, modalTitle),
      createModalForm(task, modalId)
    ])
  ]);
}

function createAttachmentModal(modalId, task) {
  return createElement('div', { class: 'modal', id: modalId }, [
    createElement('div', { class: 'modal-content' }, [
      createElement('span', { class: 'close', onclick: () => closeModal(modalId) }, '&times;'),
      createElement('h2', {}, 'Attach File'),
      createAttachmentForm(task)
    ])
  ]);
}

function createModalForm(task, modalId) {
  const form = createElement('form', {}, [
    createInput('Title', 'text', task.title, task._id),
    createInput('Is Completed', 'checkbox', task.isCompleted, task._id),
    createButton('Save', '', (e) => {
      e.preventDefault();
      updateTaskStatus(task._id, {
        title: document.getElementById(`title-${task._id}`).value,
        isCompleted: document.getElementById(`is-completed-${task._id}`).checked,
      });
      closeModal(modalId);
    })
  ]);

  return form;
}

function createAttachmentForm(task) {
  return createElement('form', {}, [
    createElement('input', { type: 'file', id: 'attachmentFile' }),
    createButton('Upload', '', (e) => {
      e.preventDefault();
      const file = document.getElementById('attachmentFile').files[0];
      handleFileUpload(file, task);
    })
  ]);
}

async function updateTaskStatus(taskId, updatedData) {
  try {
    const response = await fetch(`http://localhost:3001/api/tasks/update/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    console.log('Task updated:', await response.json());
    fetchDataFromServer(); // Reload tasks
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

async function handleFileUpload(file, task) {
  if (file) {
    try {
      console.log(`Uploading file: ${file.name} for task: ${task.title}`);

      const formData = new FormData();
      formData.append('file', file); // Thêm tệp vào form data
      formData.append('fileName', file.name); // Tên file (có thể lấy từ input hoặc thêm thông tin khác nếu cần)

      const userID = localStorage.getItem('userID'); // Lấy userID từ localStorage

      // Gửi tệp qua API để upload
      const response = await fetch('http://localhost:3001/api/uploadFile/uploadfile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userID}` // Gửi userID (nếu có trong server)
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('File uploaded successfully:', data);
        updateTaskStatus(task._id, { isCompleted: true }); // Cập nhật task là đã hoàn thành
        fetchDataFromServer(); // Reload tasks
      } else {
        console.error('Error uploading file:', data.message);
      }

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  } else {
    console.log('No file selected');
  }
}


// Utility functions
function createElement(tag, attrs = {}, content = '') {
  const elem = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('on')) {
      elem[key] = value;
    } else {
      elem.setAttribute(key, value);
    }
  }
  if (Array.isArray(content)) {
    content.forEach(child => elem.appendChild(child));
  } else {
    elem.innerHTML = content;
  }
  return elem;
}

function createButton(text, className, onClick) {
  return createElement('button', { class: className, onclick: onClick }, text);
}

function createInput(labelText, inputType, value, taskId) {
  return createElement('div', {}, [
    createElement('label', {}, `${labelText}:`),
    createElement('input', {
      type: inputType,
      id: `${labelText.toLowerCase().replace(' ', '-')}-${taskId}`,
      ...(inputType === 'checkbox' ? { checked: value } : { value }),
    })
  ]);
}

function openModal(id) {
  document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}
