# 📹 VideoAppNext

**VideoAppNext** is a modern video application built with **TypeScript** and **React-based technology** ( React Native / Expo ).
The project is structured in a modular way, making it easy to scale, maintain, and extend with new features related to video playback and management.

App is made in React Native for Android and iOS.

---

## 🚀 Features

* 📁 Clean and modular project structure
* ⚛️ Built with React and TypeScript
* 🔌 Global state management using Context API / @TanStack/ReactQuerry
* 📦 Preconfigured TypeScript and Babel setup
* 🌍 Environment-based configuration using `.env`
* 🎥 Ready for video-related components and logic

---

## 🧱 Project Structure

```
📦 VideoAppNext
 ┣ 📂 assets               # Static assets (images, fonts, videos)
 ┣ 📂 components           # Reusable UI components
 ┣ 📂 contexts             # React Contexts for global state
 ┣ 📂 src                  # Main application source code
 ┣ 📜 App.tsx              # Root application component
 ┣ 📜 index.ts             # Application entry point
 ┣ 📜 app.json             # App configuration
 ┣ 📜 babel.config.js      # Babel configuration
 ┣ 📜 tsconfig.json        # TypeScript configuration
```

---

## 🛠️ Requirements

* Node.js 14+
* npm or yarn
* TypeScript-compatible environment

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jakub728/VideoAppNext.git
   cd VideoAppNext
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**

   * Create a `.env` file if required
   * Make account GCS: YouTube Data API v3
   * Add API_KEY and BASE_URL to variables

---

## ▶️ Running the App

### Development mode

```bash
npm run dev
# or
yarn dev
```

### React Native / Expo (if applicable)

```bash
npm start
# or
yarn start
```

---

## 🧠 How It Works

* **App.tsx** – main application component
* **contexts/** – handles global app state (e.g. video state, user data)
* **components/** – UI and functional components
* **assets/** – static resources

This structure allows easy expansion of video players, lists, authentication, or streaming features.

---

## 🧪 Testing

Testing can be added later using tools like Jest or React Testing Library.

```bash
npm test
# or
yarn test
```

---


## 📬 Contact

If you have questions or suggestions, feel free to open an issue or contact the repository owner
sulisz.jakub@gmail.com
