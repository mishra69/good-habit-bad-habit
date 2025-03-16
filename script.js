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
                handleDrop(dropZone);
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
            handleDrop(dropZone);
        });
    });

    function handleDrop(dropZone) {
        if (!draggedNote) return;
        
        // If this is a stack, only allow notes of matching color
        if (dropZone.classList.contains("stack")) {
            const dropZoneColor = dropZone.getAttribute("data-color");
            const noteColor = draggedNote.classList.contains("red") ? "red" : "blue";
            
            if (dropZoneColor === noteColor) {
                dropZone.appendChild(draggedNote);
                updateCounts();
                saveState();
            }
            return;
        }
        
        // For the balance area (accepts both colors)
        if (dropZone.classList.contains("balance-area")) {
            const droppedNoteColor = draggedNote.classList.contains("red") ? "red" : "blue";
            
            // Process the balance area logic
            const balanceArea = document.getElementById("balance-area");
            const existingNotes = Array.from(balanceArea.children);
            
            // If no notes in balance area, simply add the new note
            if (existingNotes.length === 0) {
                balanceArea.appendChild(draggedNote);
            } 
            // If dropped note is same color as existing notes, simply add it
            else {
                const existingNoteColor = existingNotes[0].classList.contains("red") ? "red" : "blue";
                
                if (droppedNoteColor === existingNoteColor) {
                    balanceArea.appendChild(draggedNote);
                } else {
                    // If dropped note is opposite color, cancel one out
                    // Get the first existing note to remove
                    const noteToRemove = existingNotes[0];
                    
                    // Make sure we store the color before removing from DOM
                    const noteToRemoveColor = noteToRemove.classList.contains("red") ? "red" : "blue";
                    
                    // Remove the opposing note from balance area
                    balanceArea.removeChild(noteToRemove);
                    
                    // Put the opposing note back in its stack
                    if (noteToRemoveColor === "red") {
                        document.querySelector(".red-stack").appendChild(noteToRemove);
                    } else {
                        document.querySelector(".blue-stack").appendChild(noteToRemove);
                    }
                    
                    // Put the dragged note back in its stack
                    if (droppedNoteColor === "red") {
                        document.querySelector(".red-stack").appendChild(draggedNote);
                    } else {
                        document.querySelector(".blue-stack").appendChild(draggedNote);
                    }
                }
            }
            
            updateCounts();
            saveState();
        }
    }

    function updateCounts() {
        // Count red and blue notes in the balance area
        const balanceArea = document.getElementById("balance-area");
        let redCount = 0;
        let blueCount = 0;
        
        Array.from(balanceArea.children).forEach(note => {
            if (note.classList.contains("red")) {
                redCount++;
            } else if (note.classList.contains("blue")) {
                blueCount++;
            }
        });
        
        // Due to our cancellation logic, we should only have one type of note
        // But we calculate both to be safe
        
        // Calculate net count (Blue - Red)
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
        const balanceArea = document.getElementById("balance-area");
        
        // Count notes by color in the balance area
        let redBalanceCount = 0;
        let blueBalanceCount = 0;
        
        Array.from(balanceArea.children).forEach(note => {
            if (note.classList.contains("red")) {
                redBalanceCount++;
            } else if (note.classList.contains("blue")) {
                blueBalanceCount++;
            }
        });
        
        // Save counts of notes in balance area
        localStorage.setItem("redBalanceCount", redBalanceCount);
        localStorage.setItem("blueBalanceCount", blueBalanceCount);
        
        // Save net count
        localStorage.setItem("netCount", blueBalanceCount - redBalanceCount);
        
        // Save stack counts
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
        const redBalanceCount = parseInt(localStorage.getItem("redBalanceCount") || "0");
        const blueBalanceCount = parseInt(localStorage.getItem("blueBalanceCount") || "0");
        const redStackCount = parseInt(localStorage.getItem("redStackCount") || "3");
        const blueStackCount = parseInt(localStorage.getItem("blueStackCount") || "3");
        
        // Clear existing notes
        document.querySelector(".red-stack").innerHTML = "";
        document.querySelector(".blue-stack").innerHTML = "";
        document.getElementById("balance-area").innerHTML = "";
        
        // Recreate red notes in stack
        for (let i = 0; i < redStackCount; i++) {
            createNote("red", document.querySelector(".red-stack"));
        }
        
        // Recreate blue notes in stack
        for (let i = 0; i < blueStackCount; i++) {
            createNote("blue", document.querySelector(".blue-stack"));
        }
        
        // Recreate notes in balance area
        // Due to our cancellation logic, we should only have one type of note in the balance area
        if (redBalanceCount > 0) {
            for (let i = 0; i < redBalanceCount; i++) {
                createNote("red", document.getElementById("balance-area"));
            }
        } else if (blueBalanceCount > 0) {
            for (let i = 0; i < blueBalanceCount; i++) {
                createNote("blue", document.getElementById("balance-area"));
            }
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