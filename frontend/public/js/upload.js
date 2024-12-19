// import pako from "pako";


export async function handleFileUpload(file, task) {
  console.log(file)
  if (file) {
    try {
      // let fileUrl = await readAsDataURL(file);
      console.log(`Uploading file: ${file.name} for task: ${task.title}`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);

      console.log('FormData content:', [...formData.entries()]);

      const userID = localStorage.getItem('userID');
      if (!userID) {
        console.error('UserID not found in localStorage');
        return;
      }
      const response = await fetch('http://localhost:3001/api/uploadfile/uploadfile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userID}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('File uploaded successfully:', data);
      } else {
        console.error('Error uploading file:', data.message);
      }

    } catch (error) {
      console.error(error);
    }
  } else {
    console.log('No file selected');
  }
}
async function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = reject;
      fr.onload = () => {
          resolve(fr.result);
      }
      fr.readAsDataURL(file);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  
  // Đảm bảo DOM đã tải xong và phần tử fileContainer đã sẵn sàng
 
    const fileContainer = document.getElementById('fileContainer');
    console.log('fileContainer:', fileContainer);
    
    if (fileContainer) {
      fetchUploadedFiles(); // Nếu fileContainer tồn tại, tiếp tục gọi hàm fetchUploadedFiles
    } else {
      console.error('fileContainer not found in the DOM');
    }
});

// Hàm lấy danh sách file từ server
async function fetchUploadedFiles() {
  try {
    const response = await fetch('http://localhost:3001/api/uploadfile/getfiles');
    const data = await response.json();

    if (data.success) {
      renderUploadedFiles(data.files);
    } else {
      console.error('Error fetching uploaded files:', data.message);
    }
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}

// Hàm hiển thị danh sách file đã tải lên
function renderUploadedFiles(files) {
  const fileContainer = document.getElementById('fileContainer');
  if (!fileContainer) {
    console.error('Error: fileContainer not found in the DOM');
    return;
  }

  fileContainer.innerHTML = '';

  if (files.length === 0) {
    fileContainer.innerHTML = '<p>No files uploaded yet.</p>';
    return;
  }

  // Tạo bảng và tiêu đề cột
  const table = document.createElement('table');
  table.classList.add('file-table');
  
  // Tạo tiêu đề bảng
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Title</th>
    <th>File Name</th>
    <th>Path</th>
  
  `;
  // <th>Actions</th>
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Tạo phần thân bảng
  const tbody = document.createElement('tbody');
  
  files.forEach(file => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${file.title}</td>
      <td>${file.attachments[0].fileName}</td>
      <td>${file.attachments[0].filePath}</td>
      <td>
     
      </td>
    `;
    // <button onclick="downloadFile('${file.attachments[0].filePath}')">Download</button>
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  fileContainer.appendChild(table);
}

// Hàm tải file
// function downloadFile(filePath) {
//   if (!filePath) {
//     console.error('File path is invalid.');
//     return;
//   }

//   // Kiểm tra nếu đường dẫn tệp có hợp lệ
//   const link = document.createElement('a');
//   link.href = filePath;
  
//   // Kiểm tra nếu đường dẫn tệp có tồn tại (nếu là URL)
//   fetch(filePath, { method: 'HEAD' })
//     .then(response => {
//       if (response.ok) {
//         // Tạo sự kiện click tự động
//         link.download = filePath.split('/').pop();
//         link.click();
//       } else {
//         console.error('File not found');
//       }
//     })
//     .catch(error => {
//       console.error('Error while checking file existence:', error);
//     });
// }

// document.addEventListener('DOMContentLoaded', () => {
// console.log('DOM fully loaded');
// fetchUploadedFiles();
// });
// // Hàm lấy danh sách file từ server
// async function fetchUploadedFiles() {
// try {
//   const response = await fetch('http://localhost:3001/api/uploadfile/getfiles');
//   const data = await response.json();

//   if (data.success) {
//     renderUploadedFiles(data.files);
//   } else {
//     console.error('Error fetching uploaded files:', data.message);
//   }
// } catch (error) {
//   console.error('Error fetching files:', error);
// }
// }

// // Hàm hiển thị danh sách file đã tải lên
// function renderUploadedFiles(files) {
// const fileContainer = document.getElementById('fileContainer');
// if (!fileContainer) {
//   console.error('Error: fileContainer not found in the DOM');
//   return;
// }
// fileContainer.innerHTML = '';

// if (files.length === 0) {
//   fileContainer.innerHTML = '<p>No files uploaded yet.</p>';
//   return;
// }

// files.forEach(file => {
//   const fileDiv = document.createElement('div');
//   fileDiv.classList.add('file-item');
//   fileDiv.innerHTML = `
//     <p><strong>Title:</strong> ${file.title}</p>
//     <p><strong>File Name:</strong> ${file.attachments[0].fileName}</p>
//     <p><strong>Path:</strong> ${file.attachments[0].filePath}</p>
//   `;
//   fileContainer.appendChild(fileDiv);
// });
// }


