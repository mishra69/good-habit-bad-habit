document.addEventListener("DOMContentLoaded", () => {
    let draggedNote = null;

    // Initialize the page based on localStorage or default state
    initializeFromStorage();

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
            saveState();
        });
    });

    function updateCount() {
        document.getElementById("red-count").innerText = document.getElementById("red-area").children.length;
        document.getElementById("blue-count").innerText = document.getElementById("blue-area").children.length;
    }

    function saveState() {
        // Save counts
        localStorage.setItem("redCount", document.getElementById("red-area").children.length);
        localStorage.setItem("blueCount", document.getElementById("blue-area").children.length);
        
        // Save distribution of notes
        const redStackCount = document.querySelector(".red-stack").children.length;
        const blueStackCount = document.querySelector(".blue-stack").children.length;
        
        localStorage.setItem("redStackCount", redStackCount);
        localStorage.setItem("blueStackCount", blueStackCount);
        
        // Save that we have persisted data
        localStorage.setItem("hasPersistedData", "true");
    }

    function initializeFromStorage() {
        const hasPersistedData = localStorage.getItem("hasPersistedData") === "true";
        
        if (!hasPersistedData) {
            // Use default state - already set in HTML
            updateCount();
            return;
        }
        
        // Get persisted counts
        const redCount = parseInt(localStorage.getItem("redCount") || "0");
        const blueCount = parseInt(localStorage.getItem("blueCount") || "0");
        const redStackCount = parseInt(localStorage.getItem("redStackCount") || "3");
        const blueStackCount = parseInt(localStorage.getItem("blueStackCount") || "3");
        
        // Clear existing notes
        document.querySelector(".red-stack").innerHTML = "";
        document.querySelector(".blue-stack").innerHTML = "";
        document.getElementById("red-area").innerHTML = "";
        document.getElementById("blue-area").innerHTML = "";
        
        // Recreate red notes
        for (let i = 0; i < redStackCount; i++) {
            createNote("red", document.querySelector(".red-stack"));
        }
        for (let i = 0; i < redCount; i++) {
            createNote("red", document.getElementById("red-area"));
        }
        
        // Recreate blue notes
        for (let i = 0; i < blueStackCount; i++) {
            createNote("blue", document.querySelector(".blue-stack"));
        }
        for (let i = 0; i < blueCount; i++) {
            createNote("blue", document.getElementById("blue-area"));
        }
        
        // Update displayed counts
        updateCount();
    }

    function createNote(color, parent) {
        const note = document.createElement("div");
        note.className = `note ${color}`;
        note.draggable = true;
        
        // Add event listeners to new notes
        note.addEventListener("dragstart", (event) => {
            draggedNote = event.target;
            setTimeout(() => event.target.style.display = "none", 0);
        });

        note.addEventListener("dragend", (event) => {
            event.target.style.display = "block";
        });
        
        parent.appendChild(note);
        return note;
    }
});
