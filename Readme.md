# Calendar App

A modern, feature-rich, and user-friendly calendar web application built with React.  
Manage your events, important milestones, and deadlines with ease.  
Perfect for students, professionals, and anyone who wants to stay organized!

---

## ✨ Features

- **Month, Week, and Day Views:**  
  Switch seamlessly between different calendar layouts.
- **Event Management:**  
  Add, edit, delete, and mark events as completed.
- **Event Filtering:**  
  Filter by month, upcoming, completed, and more.
- **Conflict Detection:**  
  Instantly see scheduling conflicts and overlaps.
- **Search:**  
  Quickly find events by title or description.
- **Responsive UI:**  
  Optimized for both desktop and mobile devices.
- **Sidebar with Mini Calendar & Upcoming Events**
- **Themes:**  
  Supports light and dark themes.
- **Persistent Storage:**  
  Events are saved in your browser’s localStorage.

---

## 📁 Project Structure

```
client/src/
  components/
    Calendar/
      Calendar.jsx
      CalendarHeader.jsx
      CalendarGrid.jsx
      WeekView.jsx
      DayView.jsx
      UpcomingEvents.jsx
      ViewSelector.jsx
      FilterDropdown.jsx
      helpers.js
    EventModal.jsx
    MiniCalendar.jsx
    ThemeToggle.jsx
  contexts/
    ...
  styles/
    Calender.css
  events.json
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ramprasanth7119/calender-app.git
cd calender-app/client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝 Sample Events Data

Events are stored in [`events.json`](events.json).  
You can customize or seed your own events here.  
The app will also persist your events locally (browser localStorage).

---

## 🛠️ Tech Stack

- **Frontend:** React, React Icons, React Toastify
- **Styling:** Tailwind CSS (or custom CSS)
- **State Management:** React Hooks, Context (if needed)
- **Persistence:** localStorage

---

## 📦 Customization

- To use your own events, edit `events.json`.
- To change styles, edit `src/styles/Calender.css` (and components).
- All code is modular and easy to extend.

---

## 🤝 Contributing

Pull requests and suggestions are welcome!  
Feel free to open an issue or submit a Pull Request.


## 🙋‍♂️ Author

- [Ramprasanth7119](https://github.com/Ramprasanth7119)

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/be167973-1d93-4992-b95d-1db215830e3c)

