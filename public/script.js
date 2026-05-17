
async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    alert(data.message || data.error);
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        alert('Bem-vindo ' + data.name);
    } else {
        alert(data.error);
    }
}

async function loadJobs() {
    const response = await fetch('/jobs');
    const jobs = await response.json();

    const jobsDiv = document.getElementById('jobs');

    jobs.forEach(job => {
        jobsDiv.innerHTML += `
            <div class="item">
                <strong>${job.title}</strong><br>
                ${job.company} - ${job.location}
            </div>
        `;
    });
}

async function loadCourses() {
    const response = await fetch('/courses');
    const courses = await response.json();

    const coursesDiv = document.getElementById('courses');

    courses.forEach(course => {
        coursesDiv.innerHTML += `
            <div class="item">
                <strong>${course.title}</strong><br>
                ${course.platform}
            </div>
        `;
    });
}

loadJobs();
loadCourses();
