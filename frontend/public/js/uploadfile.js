// Thêm sự kiện tải file khi DOM được load
document.addEventListener('DOMContentLoaded', initializeFileUpload);

// Hàm khởi tạo phần tử upload file và gắn vào modal cập nhật
function initializeFileUpload() {
  const updateModals = document.querySelectorAll('.modal-content form');

  updateModals.forEach((form, index) => {
    // Tạo phần tử input để upload file
    const fileInput = createElement('input', {
      type: 'file',
      id: `fileUpload-${index}`,
      name: 'fileUpload',
    });

    // Tạo nút Upload
    const uploadButton = createButton('Upload File', 'upload-btn', (e) => {
      e.preventDefault();
      handleFileUpload(fileInput.files[0]);
    });

    // Thêm file input và nút Upload vào form
    form.appendChild(fileInput);
    form.appendChild(uploadButton);
  });
}

// Hàm xử lý upload file
async function handleFileUpload(file) {
  if (!file) {
    console.log('No file selected');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:3001/api/uploadfile', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log('File uploaded successfully:', result);
      alert('File uploaded successfully');
    } else {
      console.error('Upload failed:', response.statusText);
      alert('File upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading file');
  }
}

// Utility function để tạo phần tử DOM
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

// Utility function để tạo nút
function createButton(text, className, onClick) {
  return createElement('button', { class: className, onclick: onClick }, text);
}
