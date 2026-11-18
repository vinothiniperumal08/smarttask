
const API = "/api/tasks";

// Load tasks
async function loadTasks() {
    try {
        const response = await fetch(API);
        if (!response.ok) throw new Error("Unable to load tasks");

        const tasks = await response.json();

        document.getElementById("total").textContent = tasks.length;

        document.getElementById("pending").textContent =
            tasks.filter(t => t.status === "Pending").length;

        document.getElementById("completed").textContent =
            tasks.filter(t => t.status === "Completed").length;

        const container = document.getElementById("tasks");
        container.innerHTML = "";

        tasks.forEach(task => {
            const div = document.createElement("div");
            div.className = "task";

            const title = document.createElement("h3");
            title.textContent = task.title;

            const description = document.createElement("p");
            description.textContent = task.description || "";

            const details = document.createElement("p");
            details.textContent =
                `Priority: ${task.priority} | Status: ${task.status}`;

            const edit = document.createElement("button");
            edit.textContent = "Edit";
            edit.onclick = () => editTask(task);

            const complete = document.createElement("button");
            complete.textContent = "Complete";
            complete.onclick = () => updateTask(task._id);

            const remove = document.createElement("button");
            remove.textContent = "Delete";
            remove.onclick = () => deleteTask(task._id);

            div.append(title, description, details, edit, complete, remove);
            container.appendChild(div);
        });
    } catch (error) {
        alert(error.message);
    }
}

// Add task
async function addTask() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!title) {
        alert("Please enter a task title");
        return;
    }

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title, description, priority, dueDate
            })
        });

        if (!response.ok) throw new Error("Could not add task");

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("dueDate").value = "";

        loadTasks();
    } catch (error) {
        alert(error.message);
    }
}

// Edit task
async function editTask(task) {
    const newTitle = prompt("Enter new task title:", task.title);

    if (newTitle === null || !newTitle.trim()) return;

    try {
        const response = await fetch(`${API}/${task._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle.trim() })
        });

        if (!response.ok) throw new Error("Could not update task");
        loadTasks();
    } catch (error) {
        alert(error.message);
    }
}


async function updateTask(id) {
    try {
        const response = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Completed" })
        });

        if (!response.ok) throw new Error("Could not update status");
        loadTasks();
    } catch (error) {
        alert(error.message);
    }
}


async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Could not delete task");
        loadTasks();
    } catch (error) {
        alert(error.message);
    }
}

loadTasks();
