# ⚡ Git & GitHub Assistant — Your Intelligent Coding Companion

> **College CIE-3 Artificial Intelligence Project**  
> An interactive, modern, full-stack web application designed to help students, beginners, and junior developers master Git version control, understand GitHub collaboration workflows, troubleshoot tricky terminal errors, and test their skills with interactive quizzes.

---

## 🌟 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Design & Visual Experience](#-design--visual-experience)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [Installation & Quick Start](#-installation--quick-start)
- [Environment Configuration (LLM Setup)](#-environment-configuration-llm-setup)
- [How the AI Dual-Mode System Works](#-how-the-ai-dual-mode-system-works)
- [Example Questions & Prompts](#-example-questions--prompts)
- [Academic Context (CIE-3)](#-academic-context-cie-3)
- [Limitations & Future Scope](#-limitations--future-scope)
- [License](#-license)

---

## 🚀 Project Overview

Version control is the backbone of modern software engineering. However, novice programmers and university students frequently struggle with:
1. Understanding the difference between local Git repositories and remote GitHub remotes.
2. Memorizing syntax for branching, stashing, and rebasing.
3. Deciphering confusing terminal error messages like `fatal: not a git repository` or `rejected non-fast-forward`.
4. Navigating pull request reviews and resolving merge conflicts safely without losing code.

**Git & GitHub Assistant** addresses this educational gap by offering a cohesive developer dashboard that pairs an intelligent conversational mentor with an interactive command explorer, step-by-step guides, paste-and-solve error diagnostics, conceptual learning cards, and interactive knowledge checks.

---

## ✨ Key Features

### 1. 🤖 AI Chatbot (Core Feature)
- **Interactive Mentorship**: Answers questions on Git commands, GitHub workflows, SSH keys, branching, merge conflicts, `.gitignore`, PRs, and GitHub Pages.
- **Dual-Mode AI Engine**:
  - **Online LLM Mode**: Leverages Google Gemini 2.0 Flash API for fluid, comprehensive reasoning when an API key is provided.
  - **Offline Local Mode**: Built-in keyword-matching heuristic engine that maps queries directly to structured knowledge without needing any internet connection or API credits.
- **Developer UX**: Markdown rendering with syntax-highlighted code blocks, one-click "Copy Code" buttons, message copy actions, typing indicator, auto-scroll, Enter-to-send, and Shift+Enter for multiline input.
- **Session Preservation**: Saves past conversations in local session storage; users can revisit previous threads or click "New Chat" / "Clear Chat" anytime.

### 2. ⌨️ Git Command Explorer
- **Comprehensive Command Library**: Categorized into *Getting Started, Repository Management, File Tracking, Commits, Branching, Merging, Remote Repositories, Undoing Changes,* and *Troubleshooting*.
- **Quick-Reference Cards**: Each card details command name, syntax, clear explanation, and realistic code examples with one-click copy buttons.
- **Live Search & Filtering**: Real-time filtering by category pills and instant text search across commands, syntax, and descriptions.

### 3. 📖 GitHub Step-by-Step Guide
- **8 Practical Interactive Tutorials**:
  1. Create a GitHub repository
  2. Connect a local project to GitHub
  3. Upload code for the first time
  4. Push subsequent changes
  5. Create and switch branches
  6. Create a pull request (PR)
  7. Resolve a merge conflict
  8. Create a professional README file
- **Rich Guidance**: Includes step numbering, command snippets, expected terminal outputs, warnings against destructive actions (such as `git reset --hard`), and common beginner pitfalls.

### 4. 🔍 Git Error Troubleshooter
- **Interactive Paste & Analyze**: Paste raw terminal error output into the diagnostic box to receive probable root causes, safe step-by-step remediation, and copyable terminal commands.
- **Unknown Error Fallback**: If an error isn't found in the local database, the assistant provides troubleshooting heuristics and offers a single-click button to query the AI Chatbot with the full error trace.
- **Searchable Common Error Database**: Expandable cards for 8 notorious Git errors including public key permission denials, non-fast-forward push rejections, and overwritten local changes.

### 5. 💡 Git Concepts Learning Center
- **14 Beginner-Friendly Concepts**: Covers *What is Git, What is GitHub, Version Control Systems, Repositories, Commits, Branches, Merges, Clones, Forks, Pull Requests, Merge Conflicts, .gitignore,* and *README.md*.
- **Git vs. GitHub Comparison Matrix**: Dedicated comparison table highlighting differences in execution environment, internet requirements, cost, and primary roles.

### 6. 🧠 Interactive Quiz Mode
- **20 Multiple-Choice Questions**: Tests foundational Git knowledge, branching strategies, commit mechanics, and GitHub best practices.
- **Instant Educational Feedback**: Questions are shuffled dynamically. Submitting an answer instantly reveals green/red visual indicators and a detailed explanation of why the correct answer is right.
- **Scoring & Performance Analysis**: Live progress bar, percentage calculation, and evaluative grading messages with instant restart capability.

### 7. 🔎 Command Palette / Global Search (`Ctrl + K`)
- Fast modal searching across commands, errors, tutorials, and concepts with direct navigation shortcuts.

---

## 🎨 Design & Visual Experience

- **Cinematic Dark Theme**: Deep black (`#0a0a0f`) and midnight navy (`#10101a`, `#161625`).
- **Vibrant Accents**: Electric purple (`#7c4dff`), royal blue (`#448aff`), mint green (`#69f0ae`), and subtle cyan (`#18ffff`).
- **Glassmorphism**: Subtle translucent frosted cards with delicate borders (`rgba(255, 255, 255, 0.06)`).
- **Typography**: Clean, professional typography pairing **Inter** for UI elements and **JetBrains Mono** for code and terminal syntaxes.
- **Responsive Layout**: Fluid desktop dashboard, collapsible navigation drawer, and mobile drawer overlay.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript (ES6+) | Clean, responsive, dependency-free client application |
| **Backend** | Python Flask (`>=3.0.0`) | Lightweight REST API server and template renderer |
| **HTTP Client** | Python `requests` | Secure server-side proxy calls to LLM APIs |
| **Environment** | `python-dotenv` | Secure `.env` file management without committing secrets |
| **AI Layer** | Google Gemini 2.0 Flash / Local Knowledge Base | High-speed LLM reasoning with offline heuristic fallback |
| **Data Format** | JSON (`git-commands`, `git-errors`, `git-tutorials`, `git-concepts`, `quiz-questions`) | Modular, readable, and extendable knowledge store |

---

## 📂 Folder Structure

```text
gitmate-ai/
├── .env.example                    # Template for environment configuration
├── app.py                          # Flask application server & AI service layer
├── requirements.txt                # Python dependencies
├── README.md                       # Comprehensive project documentation
├── templates/
│   └── index.html                  # Main single-page application template
└── static/
    ├── css/
    │   └── style.css               # Premium dark-theme stylesheet
    ├── js/
    │   └── app.js                  # Complete application logic & interactivity
    └── data/
        ├── git-commands.json       # Categorized Git commands library
        ├── git-errors.json         # Common Git errors & troubleshooting rules
        ├── git-tutorials.json      # Step-by-step GitHub workflow tutorials
        ├── git-concepts.json       # Visual learning cards & comparison table
        └── quiz-questions.json     # 20-question randomized multiple choice quiz
```

---

## ⚡ Installation & Quick Start

### 1. Prerequisites
- **Python 3.10+** installed on your system.
- **Git** installed on your machine.

### 2. Clone or Open the Repository
```bash
cd c:/Users/nayan/Downloads/gitmate-ai
```

### 3. (Optional but recommended) Create a Virtual Environment
```bash
# On Windows PowerShell
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Start the Server
```bash
python app.py
```

### 6. Open in Browser
Visit your browser at:
```
http://localhost:5000
```

---

## 🔑 Environment Configuration (LLM Setup)

**Git & GitHub Assistant** functions completely out-of-the-box using its built-in local knowledge base without any external credentials.

To enable online **Google Gemini LLM** responses:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/apikey).
3. Open `.env` and set your key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=5000
   ```
4. Restart the Flask server:
   ```bash
   python app.py
   ```
5. The status indicator in the top header and chat badge will automatically display **Online (Gemini AI)**.

---

## 🧠 How the AI Dual-Mode System Works

1. **Client Request**: The frontend sends the user message and conversation history to `/api/chat`.
2. **LLM Evaluation**: If `GEMINI_API_KEY` is present in the environment, the backend formats a conversation prompt with a system instruction constraining the model to Git & GitHub developer education.
3. **Local Fallback**: If the API key is not configured, or if the external API call fails/times out, **Git & GitHub Assistant** seamlessly switches to its **Local Heuristic Knowledge Base**:
   - Matches keywords against curated command signatures, workflow guides, and error resolutions.
   - Calculates weighted keyword overlap scores to select the most relevant educational response.
   - Transparently indicates to the user whether the answer originated from `Gemini AI` or the `Local Knowledge Base` (never faking LLM connectivity).

---

## 💬 Example Questions & Prompts

Try asking Git & GitHub Assistant:
- *"How do I upload my local project to GitHub for the first time?"*
- *"What is the difference between git fetch and git pull?"*
- *"Explain how to resolve a merge conflict in simple terms."*
- *"How do I set up an SSH key for GitHub authentication?"*
- *"Fix error: fatal: remote origin already exists"*
- *"What should I put in my .gitignore file for a Python web app?"*
- *"Explain Git branching and how git switch differs from git checkout."*

---

## 🎓 Academic Context (CIE-3)

- **Course**: Artificial Intelligence (CIE-3)
- **Project Title**: Git & GitHub Assistant — Your Intelligent Coding Companion
- **Project Domain**: Educational Technology & Intelligent Conversational Agents
- **Core AI Concepts Demonstrated**:
  - Natural Language Intent Detection & Keyword Weighting
  - Fallback Knowledge Retrieval Architecture
  - LLM Prompt Engineering & Context Management
  - Interactive Diagnostic Decision Trees (Error Troubleshooting)
  - Objective Knowledge Verification (Self-Scoring Quiz Engine)

---

## ⚠️ Limitations & Future Scope

### Current Limitations:
- The local fallback uses keyword mapping rather than full semantic vector embeddings (which would require downloading heavy model weights).
- Destructive terminal commands are intentionally not executed directly on the host operating system for student safety.

### Future Scope:
- Integration of an in-browser WebAssembly virtual Git terminal (e.g. isomorphic-git) for live interactive sandbox practice.
- Voice-assisted speech-to-text queries for accessibility.
- Automatic Git commit message generation from staged git diffs.

---

## 📄 License
This project is licensed under the MIT License — feel free to use and adapt it for learning and academic demonstration.
