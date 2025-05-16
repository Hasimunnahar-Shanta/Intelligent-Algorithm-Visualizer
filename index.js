document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
  
    fetch('/get_user')  // hits your Flask backend
      .then(response => response.json())
      .then(data => {
        if (data.loggedIn) {
          authButton.textContent = `Hello, ${data.username}`;
          authButton.onclick = () => {
            // maybe show a dropdown later with 'Logout' option
            alert("You're already logged in!");
          };
        } else {
          authButton.onclick = () => {
            window.location.href = '/login';  // redirect to login page
          };
        }
      })
      .catch(err => {
        console.error('Error fetching user:', err);
      });
  });
  

// Placeholder for dynamic loading functionality later
console.log("Welcome to Algorithm Visualizer!");

// Later: You can use JS to dynamically inject different algorithm visualizers into the main-content section

