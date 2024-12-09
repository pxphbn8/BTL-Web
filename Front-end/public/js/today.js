let tasks;
// Script để gọi API từ server
document.addEventListener('DOMContentLoaded', () => {
  fetchDataFromServer();
});

async function fetchDataFromServer() {
  try {
    const userID = localStorage.getItem('userID');
    const response = await fetch(`http://localhost:3001/api/today/getToday/${userID}`);
    const responseData = await response.json();

    if (Array.isArray(responseData)) {
      tasks = responseData;
    } else if (typeof responseData === 'object') {
      tasks = [responseData];
    } else {
      console.error('Data from server is not an array or object:', responseData);
      return;
    }

    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = ''; // Xóa nội dung cũ trước khi thêm công việc mới

    tasks.forEach((task, index) => {
      const taskDiv = document.createElement('div');
      taskDiv.classList.add('task');

      const taskInfoDiv = document.createElement('div');
      taskInfoDiv.classList.add('taskInfo');
      taskInfoDiv.innerHTML = `
        <strong>${task.title}</strong><br>
        Due Date: ${task.dueDate}<br>
        Description: ${task.description}
      `;

      taskDiv.appendChild(taskInfoDiv);

      // Kiểm tra nếu công việc đã đến hạn hoặc sắp đến hạn
      const dueDate = new Date(task.dueDate);
      const currentDate = new Date();
      const daysLeft = Math.floor((dueDate - currentDate) / (1000 * 60 * 60 * 24));

      const statusDiv = document.createElement('div');
      statusDiv.classList.add('status');
    
      if (task.isImportant) {
        const importantSpan = document.createElement('span');
        importantSpan.classList.add('important_task');
        importantSpan.textContent = 'important';
        statusDiv.appendChild(importantSpan);
      }
        
      // Thêm biểu tượng thông báo nếu công việc đã đến hạn
      if (daysLeft <= 2 && !task.isCompleted) {
        const alertIcon = document.createElement('span');
        alertIcon.classList.add('bi');
        alertIcon.classList.add('bi-exclamation-triangle');
        alertIcon.classList.add('alert-icon');  // Thêm lớp CSS để tùy chỉnh biểu tượng
        statusDiv.appendChild(alertIcon);
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
      actionButtonsDiv.appendChild(updateButton);

      // Thêm nút Attachment nếu chưa hoàn thành
      if (!task.isCompleted) {
        const attachmentButton = document.createElement('button');
        attachmentButton.classList.add('attachment');
        attachmentButton.textContent = 'Attachment';
        attachmentButton.addEventListener('click', () => openModal('attachmentModal' + index));
        actionButtonsDiv.appendChild(attachmentButton);
      }

      taskDiv.appendChild(actionButtonsDiv);
      taskContainer.appendChild(taskDiv);

      const modalUpdate = createModal('modalUpdate' + index, 'Update Task', task);
      taskContainer.appendChild(modalUpdate);

      // Thêm modal đính kèm
      const attachmentModal = createAttachmentModal('attachmentModal' + index, task);
      taskContainer.appendChild(attachmentModal);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Hàm tạo modal đính kèm tệp
function createAttachmentModal(modalId, task) {
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
    modalTitleDiv.textContent = 'Attach File';
    modalContent.appendChild(modalTitleDiv);

    // Form cho file đính kèm
    const attachmentForm = document.createElement('form');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'attachmentFile';

    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'Upload';
    uploadButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleFileUpload(fileInput.files[0], task);
    });

    attachmentForm.appendChild(fileInput);
    attachmentForm.appendChild(uploadButton);
    modalContent.appendChild(attachmentForm);
    modal.appendChild(modalContent);

    return modal;
}

// Hàm tạo modal cho việc cập nhật
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

  // Tạo form cho modal (tùy vào nội dung mà bạn muốn hiển thị khi Update)
  if (modalTitle === 'Update Task') {
      const updateForm = document.createElement('form');
      
      // Add các trường cập nhật (title, dueDate, description,...)
      updateForm.appendChild(createInput('Title', 'text', task.title));
      updateForm.appendChild(createInput('Due Date', 'date', task.dueDate));
      updateForm.appendChild(createInput('Description', 'text', task.description));
      
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.addEventListener('click', (e) => {
          e.preventDefault();
          // Cập nhật trạng thái 'completed' sau khi ấn Save
          task.isCompleted = true;
          console.log(`Task ${task.title} is now completed.`);
          // Sau khi cập nhật, cần cập nhật lại giao diện (tasks)
          updateTaskStatus(task);
          closeModal(modalId);
      });
      updateForm.appendChild(saveButton);
      modalContent.appendChild(updateForm);
  }

  modal.appendChild(modalContent);
  return modal;
}

// Hàm xử lý file upload
function handleFileUpload(file, task) {
  if (file) {
    console.log(`Uploading file: ${file.name} for task: ${task.title}`);

    // Sau khi tải lên file, cập nhật trạng thái của công việc
    task.isCompleted = true; // Đánh dấu task là đã hoàn thành
    console.log(`Task ${task.title} is now completed.`);

    // Cập nhật giao diện để hiển thị trạng thái hoàn thành
    updateTaskStatus(task);

  } else {
    console.log('No file selected');
  }
}

function createInput(labelText, inputType, value) {
    const inputDiv = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelText + ':';
    inputDiv.appendChild(label);

    const input = document.createElement('input');
    input.type = inputType;
    if(input.type==='checkbox') {
        if(value===1) {input.value=true;}
        else {input.value=false;}
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

// Hàm cập nhật trạng thái của task
function updateTaskStatus(task) {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = ''; // Clear previous tasks

  tasks.forEach((t, index) => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    
    const taskInfoDiv = document.createElement('div');
    taskInfoDiv.classList.add('taskInfo');
    taskInfoDiv.innerHTML = `
      <strong>${t.title}</strong><br>
      Due Date: ${t.dueDate}<br>
      Description: ${t.description}
    `;

    taskDiv.appendChild(taskInfoDiv);

    // Kiểm tra nếu công việc đã đến hạn hoặc sắp đến hạn
    const dueDate = new Date(t.dueDate);
    const currentDate = new Date();
    const daysLeft = Math.floor((dueDate - currentDate) / (1000 * 60 * 60 * 24));

    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');
    
    // Nếu công việc là quan trọng, thêm nhãn 'important'
    if (t.isImportant) {
      const importantSpan = document.createElement('span');
      importantSpan.classList.add('important_task');
      importantSpan.textContent = 'important';
      statusDiv.appendChild(importantSpan);
    }

    // Thêm biểu tượng cảnh báo nếu công việc đã đến hạn và chưa hoàn thành
    if (daysLeft <= 2 && !t.isCompleted) {
      const alertIcon = document.createElement('span');
      alertIcon.classList.add('bi');
      alertIcon.classList.add('bi-exclamation-triangle');
      alertIcon.classList.add('alert-icon');
      statusDiv.appendChild(alertIcon);
    }

    // Nếu công việc đã hoàn thành, hiển thị trạng thái 'completed'
    if (t.isCompleted) {
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
    actionButtonsDiv.appendChild(updateButton);

    // Thêm nút Attachment nếu chưa hoàn thành
    if (!t.isCompleted) {
      const attachmentButton = document.createElement('button');
      attachmentButton.classList.add('attachment');
      attachmentButton.textContent = 'Attachment';
      attachmentButton.addEventListener('click', () => openModal('attachmentModal' + index));
      actionButtonsDiv.appendChild(attachmentButton);
    }

    taskDiv.appendChild(actionButtonsDiv);
    taskContainer.appendChild(taskDiv);

    const modalUpdate = createModal('modalUpdate' + index, 'Update Task', t);
    taskContainer.appendChild(modalUpdate);

    const attachmentModal = createAttachmentModal('attachmentModal' + index, t);
    taskContainer.appendChild(attachmentModal);
  });
}

