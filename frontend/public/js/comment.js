document.addEventListener("DOMContentLoaded", () => {
    loadComments(); // Gọi hàm loadComments khi trang được load
  });
  
  // Hàm load comment từ server
  async function loadComments() {
    try {
      const userID = localStorage.getItem("userID"); // Lấy userID từ localStorage
      const response = await fetch(`http://localhost:3001/api/comments/getAllComments/${userID}`); // API endpoint
      const comments = await response.json();
      console.log("Fetched comments:", comments); // Kiểm tra dữ liệu từ API
      // Kiểm tra nếu dữ liệu trả về là mảng
      if (Array.isArray(comments)) {
        displayComments(comments);
      } else {
        console.error("Invalid response format:", comments);
        alert("Failed to fetch comments!");
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      alert("Failed to load comments!");
    }
  }
  
  // Hàm hiển thị danh sách comment
  function displayComments(comments) {
    const commentContainer = document.getElementById("commentContainer"); // Container hiển thị comment
    commentContainer.innerHTML = ""; // Xóa nội dung cũ trước khi thêm mới
  
    comments.forEach((comment) => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      const userName = comment.userId?.name || "Unknown User";
    const taskTitle = comment.taskId?.title || "Unknown Task";
  
      commentDiv.innerHTML = `
        <strong>User:</strong> ${comment.userId}<br>
        <strong>Task ID:</strong> ${comment.taskId}<br>
        <strong>Comment:</strong> ${comment.comment}<br>
        <small><em>Posted at: ${new Date(comment.createdAt).toLocaleString()}</em></small>
        <button class="delete-comment" data-id="${comment._id}">Delete</button>
      `;
  
      commentContainer.appendChild(commentDiv);
    });
  
    // Gắn sự kiện xóa cho từng comment
    document.querySelectorAll(".delete-comment").forEach((button) => {
      button.addEventListener("click", (event) => {
        const commentId = event.target.dataset.id;
        deleteComment(commentId);
      });
    });
  }
  
  // Hàm xóa comment
  async function deleteComment(commentId) {
    try {
      const response = await fetch(`http://localhost:3001/api/comments/deleteComment/${commentId}`, {
        method: "DELETE",
      });
  
      const responseData = await response.json();
  
      if (responseData.success) {
        alert("Comment deleted successfully!");
        loadComments(); // Reload comment sau khi xóa
      } else {
        alert("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("There was an error deleting the comment.");
    }
  }
  