document.addEventListener('DOMContentLoaded', () => {
    checkOverdueTasks();
  });
  
  async function checkOverdueTasks() {
    try {
      const userID = localStorage.getItem('userID');  // Lấy userID từ localStorage
  
      const response = await fetch(`http://localhost:3001/api/tasks/getTask/${userID}`);
      const tasks = await response.json();
  
      // Kiểm tra xem dữ liệu có hợp lệ không
      if (!Array.isArray(tasks)) {
        console.error('Invalid tasks data from server:', tasks);
        return;
      }
  
      // Lọc các công việc quá hạn (dueDate đã qua và chưa hoàn thành)
      const overdueTasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);  // Chuyển dueDate thành đối tượng Date
        const currentDate = new Date();          // Lấy ngày hiện tại
        return dueDate < currentDate && !task.isCompleted;  // Công việc quá hạn và chưa hoàn thành
      });
  
      // Hiển thị công việc quá hạn
      const overdueContainer = document.getElementById('overdueContainer');
      overdueContainer.innerHTML = '';  // Xóa nội dung cũ
  
      if (overdueTasks.length === 0) {
        overdueContainer.innerHTML = '<p>No overdue tasks found!</p>';
        return;
      }
  
      overdueTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task', 'overdue');  // Thêm class "overdue"
  
        taskDiv.innerHTML = `
          <strong>${task.title}</strong><br>
          Due Date: ${new Date(task.dueDate).toLocaleDateString()}<br>
          Description: ${task.description}<br>
          <span class="important_task">${task.isImportant ? 'Important' : ''}</span>
        `;
  
        overdueContainer.appendChild(taskDiv);  // Thêm task vào container
      });
  
      console.log('Overdue tasks:', overdueTasks);
  
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }
  