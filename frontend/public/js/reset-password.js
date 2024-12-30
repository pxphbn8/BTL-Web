document.addEventListener('DOMContentLoaded', () => {
  // Lấy token từ trường hidden input
  const token = document.getElementById('token').value;
  console.log('Token from hidden input:', token); // Kiểm tra token trong console

  document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
      document.getElementById('error').textContent = 'Passwords do not match!';
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();
      if (result.success) {
        document.getElementById('message').textContent = 'Password reset successfully!';
        document.getElementById('error').textContent = '';
      } else {
        document.getElementById('error').textContent = result.message;
      }
    } catch (error) {
      document.getElementById('error').textContent = 'An error occurred. Please try again.';
    }
  });
});
