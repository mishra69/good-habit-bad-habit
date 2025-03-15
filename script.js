document.addEventListener("DOMContentLoaded", () => {
    let draggedNote = null;
    let isDragging = false;
    let startY = 0;

    // Initialize the page based on localStorage or default state
    initializeFromStorage();

    // Add event listeners to all notes
    function addNoteEventListeners(note) {
        // Mouse drag events
        note.addEventListener("dragstart", (event) => {
            draggedNote = event.target;
            setTimeout(() => event.target.style.display = "none", 0);
        });

        note.addEventListener("dragend", (event) => {
            event.target.style.display = "block";
            draggedNote = null;
        });

        // Touch events for mobile
        note.addEventListener("touchstart", (event) => {
            draggedNote = event.target;
            isDragging = true;
            startY = event.touches[0].clientY;
            event.target.classList.add("being-touched");
            // Prevent default to stop scrolling while starting drag
            event.preventDefault();
        }, { passive: false });

        note.addEventListener("touchmove", (event) => {
            if (isDragging) {
                // Calculate how far we've moved
                const deltaY = Math.abs(event.touches[0].clientY - startY);
                
                // If we've moved more than 10px, it's a drag not a tap
                if (deltaY > 10) {
                    // Prevent scrolling during drag
                    event.preventDefault();
                }
            }
        }, { passive: false });

        note.addEventListener("touchend", (event) => {
            if (!isDragging) return;
            
            const touch = event.changedTouches[0];
            const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
            
            let dropZone = null;
            // Find if we're over a drop zone or stack
            for (const element of elementsAtPoint) {
                if (element.classList.contains("drop-area") || element.classList.contains("stack")) {
                    dropZone = element;
                    break;
                }
            }

            if (dropZone) {
                const dropZoneColor = dropZone.getAttribute("data-color");
                const noteColor = draggedNote.classList.contains("red") ? "red" : "blue";

                if ((dropZone.classList.contains("drop-area") || dropZone.classList.contains("stack")) 
                    && dropZoneColor === noteColor) {
                    dropZone.appendChild(draggedNote);
                    updateCounts();
                    saveState();
                }
            }

            draggedNote.classList.remove("being-touched");
            draggedNote = null;
            isDragging = false;
        });

        note.addEventListener("touchcancel", (event) => {
            if (draggedNote) {
                draggedNote.classList.remove("being-touched");
                draggedNote = null;
                isDragging = false;
            }
        });
    }

    // Add event listeners to all initial notes
    document.querySelectorAll(".note").forEach(note => {
        addNoteEventListeners(note);
    });

    // Prevent default touchmove on containers to avoid scrolling while dragging
    document.querySelectorAll(".drop-area, .stack").forEach(area => {
        area.addEventListener("touchmove", (event) => {
            if (isDragging) {
                event.preventDefault();
            }
        }, { passive: false });
        
        // Regular mouse drop events
        area.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        area.addEventListener("drop", (event) => {
            event.preventDefault();

            if (!draggedNote) return;
            
            let dropZone = event.currentTarget;
            const dropZoneColor = dropZone.getAttribute("data-color");
            const noteColor = draggedNote.classList.contains("red") ? "red" : "blue";

            if (dropZone.classList.contains("drop-area") && dropZoneColor === noteColor) {
                dropZone.appendChild(draggedNote);
            } 
            else if (dropZone.classList.contains("stack") && dropZoneColor === noteColor) {
                dropZone.appendChild(draggedNote);
            }

            updateCounts();
            saveState();
        });
    });

    function updateCounts() {
        // Update individual counts
        const redCount = document.getElementById("red-area").children.length;
        const blueCount = document.getElementById("blue-area").children.length;
        
        document.getElementById("red-count").innerText = redCount;
        document.getElementById("blue-count").innerText = blueCount;
        
        // Calculate and update net count (G - F, or Blue - Red)
        const netCount = blueCount - redCount;
        const netCountElement = document.getElementById("net-counter");
        
        // Update value
        netCountElement.innerText = netCount;
        
        // Update styling based on value
        netCountElement.classList.remove("positive", "negative", "zero");
        if (netCount > 0) {
            netCountElement.classList.add("positive");
        } else if (netCount < 0) {
            netCountElement.classList.add("negative");
        } else {
            netCountElement.classList.add("zero");
        }
    }

    function saveState() {
        // Save individual counts
        const redCount = document.getElementById("red-area").children.length;
        const blueCount = document.getElementById("blue-area").children.length;
        
        localStorage.setItem("redCount", redCount);
        localStorage.setItem("blueCount", blueCount);
        
        // Save net count
        localStorage.setItem("netCount", blueCount - redCount);
        
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
            updateCounts();
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
        updateCounts();
    }

    function createNote(color, parent) {
        const note = document.createElement("div");
        note.className = `note ${color}`;
        note.draggable = true;
        
        // Add event listeners to new notes
        addNoteEventListeners(note);
        
        parent.appendChild(note);
        return note;
    }
});