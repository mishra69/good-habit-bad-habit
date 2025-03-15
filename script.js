document.addEventListener("DOMContentLoaded", () => {
    let draggedNote = null;

    document.querySelectorAll(".note").forEach(note => {
        note.addEventListener("dragstart", (event) => {
            draggedNote = event.target;
            setTimeout(() => event.target.style.display = "none", 0);
        });

        note.addEventListener("dragend", (event) => {
            event.target.style.display = "block";
        });
    });

    document.querySelectorAll(".drop-area, .stack").forEach(area => {
        area.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        area.addEventListener("drop", (event) => {
            event.preventDefault();

            let dropZone = event.currentTarget;
            const dropZoneColor = dropZone.getAttribute("data-color");
            const noteColor = draggedNote.classList.contains("red") ? "red" : "blue";

            if (dropZone.classList.contains("drop-area") && dropZoneColor === noteColor) {
                dropZone.appendChild(draggedNote);
            } 
            else if (dropZone.classList.contains("stack") && dropZoneColor === noteColor) {
                dropZone.appendChild(draggedNote);
            }

            updateCount();
            localStorage.setItem("redCount", document.getElementById("red-area").children.length);
            localStorage.setItem("blueCount", document.getElementById("blue-area").children.length);
        });
    });

    function updateCount() {
        document.getElementById("red-count").innerText = document.getElementById("red-area").children.length;
        document.getElementById("blue-count").innerText = document.getElementById("blue-area").children.length;
    }
});
