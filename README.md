# post-it

# Habit Counter Application Documentation

## User Documentation

### What is the Habit Counter?

The Habit Counter is a simple visual tool designed to help you track both positive and negative habits. It uses a balance system where good habits (blue) and bad habits (red) can cancel each other out, helping you see your overall progress toward better behavior patterns.

### How to Use the App

1. **Adding Habits**
   - Each blue note represents a positive habit you've completed
   - Each red note represents a negative habit you're trying to reduce
   - Drag notes from the "Good Habit" or "Bad Habit" stacks to the Habit Balance Area

2. **Understanding Balance**
   - When you add a blue note (good habit), your net count increases
   - When you add a red note (bad habit), your net count decreases
   - If you drop a note of the opposite color onto the Habit Balance Area, they cancel each other out - both notes return to their stacks
   - This represents how good habits can offset bad ones in your daily routine

3. **Interpreting Your Net Count**
   - Positive number (green): You have more good habits than bad ones
   - Zero (gray): Your good and bad habits are in balance
   - Negative number (red): You have more bad habits to work on

4. **Persistence**
   - Your habit counts are automatically saved
   - When you return to the app, your previous counts will still be there

5. **Mobile Usage**
   - The app works on mobile devices through touch gestures
   - Touch and drag notes to the appropriate areas
   - The layout adapts to smaller screens automatically

## Developer Documentation

### Project Overview

The Habit Counter is a web application built with vanilla HTML, CSS, and JavaScript. It implements a drag-and-drop interface for tracking habits with visual feedback, habit cancellation logic, and state persistence.

### Technical Architecture

1. **HTML Structure**
   - Main container with two stack containers (good and bad habits)
   - Single unified balance area that accepts both types of notes
   - Net counter displays the difference between good and bad habits
   - Description container at the bottom explains the application purpose

2. **CSS Features**
   - Modern color scheme with subtle gradients and shadows
   - Flexbox layout for responsive design
   - Interactive elements with hover and touch feedback
   - Mobile-first media queries for different screen sizes
   - Visual feedback for interaction states

3. **JavaScript Functionality**
   - Event listeners for both mouse and touch interactions
   - Habit balancing logic (cancellation of opposite habits)
   - State management for drag-and-drop operations
   - localStorage implementation for data persistence
   - Dynamic creation and management of note elements

### Key Components

1. **Drag and Drop System**
   - Mouse events: dragstart, dragend, dragover, drop
   - Touch events: touchstart, touchmove, touchend, touchcancel
   - Validation to ensure notes are handled correctly

2. **Habit Balancing Logic**
   - Single balance area that accepts both note types
   - Automatic cancellation when opposite notes interact
   - Visual feedback when notes cancel each other out
   - Return of canceled notes to their respective stacks

3. **State Management**
   - Net count calculation (Good - Bad)
   - Visual styling based on count values
   - Tracking of note distribution between stacks and balance area

4. **Persistence Layer**
   - localStorage to save current state
   - Stores note counts, distribution, and net count
   - State restoration on page load

5. **Touch Support**
   - Custom touch event handling for mobile devices
   - Prevents page scrolling during drag operations
   - Detects valid drop targets through elementsFromPoint API

### Implementation Details

1. **Note Interaction**
   - Notes can be dragged from stacks to the balance area
   - Opposite-colored notes cancel each other out automatically
   - Same-colored notes accumulate in the balance area
   - Visual feedback during dragging operations

2. **Balance Mechanics**
   - `handleDrop` function manages the core balancing logic
   - Notes of the same color accumulate
   - Notes of opposite colors trigger the cancellation effect
   - Both notes return to their respective stacks when cancelled

3. **State Persistence**
   - `saveState` stores all necessary data in localStorage
   - `initializeFromStorage` reconstructs the application state
   - Fallback to default state if no saved data exists

### Future Enhancements

Potential features to consider:
1. User-defined habit names on notes
2. Date tracking for habit completion
3. Weekly/monthly summaries
4. Habit streaks and statistics
5. Export/import functionality for data backup
6. Different note colors for categorizing habits
7. Animation effects for the cancellation mechanism

This documentation provides both a user guide for people using the Habit Counter and technical details for developers who may need to maintain or extend the application.
