document.addEventListener('DOMContentLoaded', () => {
  fetchCommentsFromServer();
});

let comments = [];  // Mảng chứa tất cả bình luận
let taskTitle = ''; // Biến chứa title của task

// Lấy bình luận và task từ server
async function fetchCommentsFromServer() {
  try {
    const taskID = localStorage.getItem('taskID'); // Giả sử taskID được lưu trong localStorage
    if (!taskID) {
      console.error('TaskID is missing in localStorage.');
      return;
    }

    // Fetch task data to get its title
    const taskResponse = await fetch(`http://localhost:3001/api/tasks/getTask/${taskID}`);
    const taskData = await taskResponse.json();
    
    if (taskData && taskData.title) {
      taskTitle = taskData.title;  // Lưu title của task
    } else {
      console.error('Task not found or title is missing');
      return;
    }

    // Fetch comments data
    const commentsResponse = await fetch(`http://localhost:3001/api/comments/getComments/${taskID}`);
    const data = await commentsResponse.json();
    
    if (Array.isArray(data)) {
      comments = data;
      displayComments();
    } else {
      console.error('Error: Data is not an array');
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}

// Hiển thị các bình luận trên giao diện
function displayComments() {
  const commentsContainer = document.getElementById('commentsContainer');
  commentsContainer.innerHTML = '';  // Làm sạch container trước khi hiển thị lại

  // Hiển thị title của task
  const taskTitleDiv = document.createElement('div');
  taskTitleDiv.classList.add('task-title');
  taskTitleDiv.innerHTML = `<h3>Task: ${taskTitle}</h3>`;
  commentsContainer.appendChild(taskTitleDiv);

  comments.forEach((comment) => {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    
    commentDiv.innerHTML = `
      <strong>${comment.user}</strong>: ${comment.text} <br>
      <small>Posted on: ${comment.date}</small>
      <button class="delete-comment" data-id="${comment.id}">Delete</button>
    `;

    // Thêm sự kiện xóa cho từng bình luận
    const deleteButton = commentDiv.querySelector('.delete-comment');
    deleteButton.addEventListener('click', () => deleteComment(comment.id));

    commentsContainer.appendChild(commentDiv);
  });
}

// Thêm bình luận mới
async function addComment() {
  const commentText = document.getElementById('newCommentText').value;
  if (!commentText.trim()) {
    alert('Please enter a comment!');
    return;
  }

  try {
    const taskID = localStorage.getItem('taskID');
    if (!taskID) {
      console.error('TaskID is missing in localStorage.');
      return;
    }

    const newComment = {
      user: 'Current User', // Có thể thay thế bằng tên người dùng thực tế
      text: commentText,
      date: new Date().toLocaleString(),
      taskID: taskID
    };

    const response = await fetch('http://localhost:3001/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newComment)
    });

    const addedComment = await response.json();

    if (addedComment) {
      comments.push(addedComment);  // Thêm bình luận mới vào mảng
      displayComments();  // Hiển thị lại danh sách bình luận
      document.getElementById('newCommentText').value = '';  // Xóa nội dung ô nhập
    } else {
      console.error('Failed to add comment');
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
}

// Xóa bình luận
async function deleteComment(commentID) {
  try {
    const response = await fetch(`http://localhost:3001/api/comments/deleteComment/${commentID}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      comments = comments.filter(comment => comment.id !== commentID);  // Xóa bình luận khỏi mảng
      displayComments();  // Hiển thị lại danh sách bình luận
    } else {
      console.error('Failed to delete comment');
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
}

// Thêm sự kiện cho nút "Add Comment"
document.getElementById('addCommentButton').addEventListener('click', addComment);
