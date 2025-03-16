# post-it

# Habit Counter Application Documentation

## User Documentation

### What is the Habit Counter?

The Habit Counter is a simple visual tool designed to help you track both positive and negative habits. It uses a balance system where good habits (blue) and bad habits (red) can cancel each other out, helping you see your overall progress toward better behavior patterns.

### How to Use the App

1. **Adding Habits**
   - Each blue note represents a positive habit you've completed
   - Each red note represents a negative habit you're trying to reduce
   - Drag notes from the stacks to their matching colored drop zones

2. **Understanding Your Counts**
   - The F Area (red) shows your count of negative habits
   - The G Area (blue) shows your count of positive habits
   - The Net Count displays G minus F (positive habits minus negative ones)

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

The Habit Counter is a web application built with vanilla HTML, CSS, and JavaScript. It implements a drag-and-drop interface for tracking habits with visual feedback and state persistence.

### Technical Architecture

1. **HTML Structure**
   - Main container with two stack-drop wrappers (red and blue)
   - Each wrapper contains a stack and a drop area
   - Net counter displays the difference between blue and red counts
   - Description container at the bottom explains the application purpose

2. **CSS Features**
   - Flexbox layout for responsive design
   - Mobile-first media queries for different screen sizes
   - Visual feedback for touch and drag operations
   - Color-coded elements for intuitive user experience

3. **JavaScript Functionality**
   - Event listeners for both mouse and touch interactions
   - State management for drag-and-drop operations
   - localStorage implementation for data persistence
   - Dynamic creation and management of note elements

### Key Components

1. **Drag and Drop System**
   - Mouse events: dragstart, dragend, dragover, drop
   - Touch events: touchstart, touchmove, touchend, touchcancel
   - Color validation to ensure notes can only be dropped in matching zones

2. **State Management**
   - Individual counts for red and blue notes
   - Net count calculation (G - F)
   - Visual styling based on count values

3. **Persistence Layer**
   - localStorage to save current state
   - Stores counts, note distribution, and net count
   - State restoration on page load

4. **Touch Support**
   - Custom touch event handling for mobile devices
   - Prevents page scrolling during drag operations
   - Detects valid drop targets through elementsFromPoint API

### Implementation Details

1. **Note Creation**
   - Notes are created as div elements with appropriate classes
   - Event listeners are attached to each note
   - Notes can be dynamically added to both stacks and drop areas

2. **Count Management**
   - updateCounts() handles all count updates
   - Individual area counts and net count are updated simultaneously
   - Styling changes based on count values

3. **State Persistence**
   - saveState() stores all necessary data in localStorage
   - initializeFromStorage() reconstructs the application state
   - Fallback to default state if no saved data exists

### Future Enhancements

Potential features to consider:
1. User-defined habit names on notes
2. Date tracking for habit completion
3. Weekly/monthly summaries
4. More note colors for different habit categories
5. Export/import functionality for data backup

This documentation provides both a user guide for people using the Habit Counter and technical details for developers who may need to maintain or extend the application.
