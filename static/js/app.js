/**
 * Git & GitHub Assistant — Your Intelligent Coding Companion
 * Professional AI Chatbot & Developer Toolkit
 */

// ── Application State ────────────────────────────────────────────────────────
const AppState = {
  currentPanel: 'chat',
  conversationHistory: [],
  chatSessions: [],
  activeSessionId: null,
  isGenerating: false,
  llmEnabled: false,
  llmModeName: 'Local Knowledge Base',

  // Cached data
  commands: [],
  categories: [],
  activeCategory: 'All',
  errors: [],
  tutorials: [],
  concepts: [],
  githubGuides: [],
  quizQuestions: [],

  // Quiz state
  quiz: {
    questions: [],
    currentIndex: 0,
    selectedOption: null,
    isSubmitted: false,
    score: 0
  }
};

// ── Local Fallback Knowledge Base (for Standalone / Offline Demo Mode) ───────
const LOCAL_KNOWLEDGE = {
  "git init": {
    answer: "**`git init`** initializes a new, empty Git repository in your current working directory.\n\nIt generates a hidden `.git` folder containing all version control metadata and object databases.\n\n### Usage:\n```bash\ncd your-project-folder\ngit init\n```\n\n### What happens behind the scenes:\n- A hidden `.git` directory is created.\n- The default branch is established (typically `main`).\n- File changes can now be tracked using `git add` and committed with `git commit`.\n\n> 💡 **Best Practice**: You only need to run `git init` once at the inception of a project.",
    keywords: ["init", "git init", "initialize", "new repo", "start repository", "create repo"]
  },
  "git add": {
    answer: "**`git add`** adds file changes from your working directory to the **staging area** (index), preparing them to be included in the next commit snapshot.\n\n### Common Usages:\n```bash\n# Stage a specific file\ngit add index.html\n\n# Stage all changed, deleted, and newly created files in current directory\ngit add .\n\n# Stage files interactively\ngit add -p\n```\n\n### Workflow Pipeline:\n1. **Working Directory** (Unstaged edits)\n2. ➔ `git add` ➔ **Staging Area** (Prepared package)\n3. ➔ `git commit` ➔ **Local Repository** (Permanent snapshot)\n\n> 💡 **Notice**: Always review `git status` prior to running `git add .` to verify no unwanted secret files are staged.",
    keywords: ["add", "git add", "stage", "staging", "track", "add files"]
  },
  "git commit": {
    answer: "**`git commit`** captures a permanent snapshot of your currently staged changes in the repository history.\n\n### Syntax & Standard Usage:\n```bash\ngit commit -m \"feat: Implement user authentication middleware\"\n```\n\n### Writing Professional Conventional Commits:\n- ✅ `feat: Add dark mode toggle in navbar`\n- ✅ `fix: Prevent null pointer exception on checkout`\n- ✅ `docs: Update API endpoint specifications in README`\n- ❌ `update stuff` *(Unhelpful during code reviews)*\n\n### Amending the Last Commit:\n```bash\ngit commit --amend -m \"docs: Correct typo in deployment notes\"\n```\n\n> 💡 Every commit produces a unique SHA-1/SHA-256 hash identifying author, timestamp, parent commit, and exact code changes.",
    keywords: ["commit", "git commit", "save changes", "snapshot", "commit message"]
  },
  "git status": {
    answer: "**`git status`** displays the condition of the working directory and staging area, revealing which changes are tracked, staged, or untracked.\n\n```bash\ngit status\n```\n\n### Compact Format:\n```bash\ngit status -s\n# Output:\n# M  app.js      (modified and staged)\n#  M style.css   (modified but unstaged)\n# ?? config.json (untracked new file)\n```\n\n> 💡 Run `git status` frequently to avoid accidentally committing temporary build artifacts.",
    keywords: ["status", "git status", "check status", "what changed", "untracked"]
  },
  "git push": {
    answer: "**`git push`** uploads local branch commits to a remote repository such as GitHub or GitLab.\n\n### First-time Push (Establishing Upstream Tracking):\n```bash\ngit push -u origin main\n```\n*The `-u` (or `--set-upstream`) flag links your local `main` branch to `origin/main`.* \n\n### Subsequent Pushes:\n```bash\ngit push\n```\n\n### Pushing a Specific Branch:\n```bash\ngit push origin feature-payments\n```\n\n> ⚠️ **Caution**: Avoid `git push --force` on shared public branches as it overwrites remote history for collaborators.",
    keywords: ["push", "git push", "upload", "publish", "send code", "push to github"]
  },
  "git pull": {
    answer: "**`git pull`** fetches and downloads commits from a remote repository and immediately integrates them into your current local branch.\n\n### Usage:\n```bash\ngit pull origin main\n```\n\n### Behind the Scenes:\n`git pull` is a combination of two operations:\n1. **`git fetch`**: Downloads remote changes without altering your working tree.\n2. **`git merge`**: Integrates fetched commits into your active branch.\n\n> 💡 Always pull before starting work or pushing new changes to avoid out-of-date conflicts.",
    keywords: ["pull", "git pull", "download", "fetch and merge", "update local"]
  },
  "git clone": {
    answer: "**`git clone`** duplicates an existing remote repository onto your local workstation, retrieving full file history, branches, and commit logs.\n\n### Using HTTPS:\n```bash\ngit clone https://github.com/username/repository.git\n```\n\n### Using SSH (Recommended for security):\n```bash\ngit clone git@github.com:username/repository.git\n```\n\n### Clone into a Custom Folder:\n```bash\ngit clone https://github.com/username/repo.git custom-folder\n```",
    keywords: ["clone", "git clone", "download repository", "copy repo"]
  },
  "git branch": {
    answer: "**Branches** represent independent lines of development. They allow developers to build features or test fixes without disrupting stable production code on `main`.\n\n### Essential Branch Commands:\n```bash\n# List all local branches\ngit branch\n\n# Create and switch to a new branch (modern syntax)\ngit switch -c feature-dashboard\n\n# Or using traditional checkout syntax:\ngit checkout -b feature-dashboard\n\n# Switch back to main\ngit switch main\n\n# Safely delete merged branch\ngit branch -d feature-dashboard\n```\n\n> 💡 **Tip**: Keep branch names concise using kebab-case (e.g. `feat-auth`, `fix-navbar-mobile`).",
    keywords: ["branch", "git branch", "create branch", "switch branch", "branching", "git switch", "git checkout"]
  },
  "git merge": {
    answer: "**`git merge`** integrates independent development lines into your current active branch.\n\n### Standard Workflow:\n```bash\n# 1. Switch to the target branch (e.g. main)\ngit switch main\n\n# 2. Integrate feature changes\ngit merge feature-dashboard\n```\n\n### Fast-Forward vs. 3-Way Merge:\n- **Fast-forward**: Occurs if `main` has no new commits since branching; the branch pointer simply moves ahead.\n- **3-Way Merge**: If both branches contain new commits, Git creates an automated merge commit.\n\n> 💡 If changes overlap on the same lines, Git pauses and prompts you to resolve a **Merge Conflict**.",
    keywords: ["merge", "git merge", "combine branches", "integrating"]
  },
  "merge conflict": {
    answer: "A **Merge Conflict** occurs when Git cannot automatically resolve differing edits to the same line across two branches.\n\n### Identifying Conflict Markers in Files:\n```html\n<<<<<<< HEAD (Current branch edits)\n<h1>Dashboard V2</h1>\n=======\n<h1>Enterprise Analytics Dashboard</h1>\n>>>>>>> feature-analytics (Incoming edits)\n```\n\n### How to Resolve:\n1. Open the file in your code editor.\n2. Choose which changes to keep and delete the marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).\n3. Save and stage the resolved file:\n```bash\ngit add filename.html\n```\n4. Finalize the merge:\n```bash\ngit commit -m \"fix: Resolve merge conflicts in dashboard title\"\n```\n\n> ⚠️ To abort a merge and return to the state before merging: `git merge --abort`.",
    keywords: ["conflict", "merge conflict", "resolve conflict", "conflict markers", "fix conflict"]
  },
  "github setup": {
    answer: "### Connecting a Local Project to GitHub:\n\n1. Create an empty repository on [github.com](https://github.com).\n2. In your local project terminal:\n```bash\n# Initialize Git if not already done\ngit init\n\n# Stage and commit your files\ngit add .\ngit commit -m \"feat: Initial project commit\"\n\n# Ensure the branch is named main\ngit branch -M main\n\n# Link remote origin (replace with your repo URL)\ngit remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git\n\n# Push code and set upstream tracking\ngit push -u origin main\n```\n\n> ⚠️ Remember to replace `YOUR-USERNAME` and `YOUR-REPO` with your actual GitHub credentials.",
    keywords: ["connect github", "upload project", "first push", "link repo", "github setup"]
  },
  "ssh": {
    answer: "**SSH Keys** establish a cryptographically secure, passwordless authentication channel between your workstation and GitHub.\n\n### Setup Steps:\n```bash\n# 1. Generate modern Ed25519 key pair\nssh-keygen -t ed25519 -C \"your_email@example.com\"\n\n# 2. Start SSH agent\neval \"$(ssh-agent -s)\"\n\n# 3. Add private key to agent\nssh-add ~/.ssh/id_ed25519\n\n# 4. View and copy public key\ncat ~/.ssh/id_ed25519.pub\n```\n\n5. Open **GitHub ➔ Settings ➔ SSH and GPG keys ➔ New SSH key** and paste the key.\n6. Test connection:\n```bash\nssh -T git@github.com\n```",
    keywords: ["ssh", "ssh key", "authentication", "publickey", "permission denied"]
  },
  "gitignore": {
    answer: "A **`.gitignore`** file specifies untracked patterns that Git should intentionally ignore and not commit.\n\n### Recommended Starter `.gitignore`:\n```text\n# Environment & Credentials\n.env\n*.pem\n\n# Dependencies\nnode_modules/\nvenv/\n__pycache__/\n\n# Build Outputs\ndist/\nbuild/\n*.log\n\n# OS Artifacts\n.DS_Store\nThumbs.db\n```\n\n> 💡 **Notice**: `.gitignore` only applies to files not yet tracked. To untrack an already-committed file: `git rm --cached <file>`.",
    keywords: ["gitignore", ".gitignore", "ignore files", "exclude"]
  },
  "pull request": {
    answer: "A **Pull Request (PR)** is a GitHub feature that allows developers to propose changes from one branch to another, facilitating code reviews, discussions, and automated CI test runs before merging.\n\n### Professional PR Workflow:\n1. Create and switch to a feature branch: `git switch -c feat-api`\n2. Make changes and commit: `git commit -m \"feat: Add REST endpoints\"`\n3. Push branch to GitHub: `git push -u origin feat-api`\n4. On GitHub, click **'Compare & pull request'**.\n5. Fill out the description with summary and testing notes.\n6. Teammates review the diff and approve.\n7. Merge into `main` using **'Squash and merge'** or standard merge.",
    keywords: ["pull request", "pr", "code review", "github pr"]
  }
};

// ── App Initialization ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initStorage();
  initEventListeners();
  await checkSystemStatus();
  await loadApplicationData();
  renderChatHistory();
  renderCommands();
  renderTutorials();
  renderErrors();
  renderConcepts();
  renderGitHubGuides();
  initQuiz();
});

// ── Storage Management ──────────────────────────────────────────────────────
function initStorage() {
  try {
    const saved = localStorage.getItem('git_assistant_sessions');
    if (saved) {
      AppState.chatSessions = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
    AppState.chatSessions = [];
  }
  updateSettingsSessionCount();
}

function saveSessionsToStorage() {
  try {
    localStorage.setItem('git_assistant_sessions', JSON.stringify(AppState.chatSessions));
  } catch (e) {
    console.warn('Failed saving sessions:', e);
  }
  updateSettingsSessionCount();
}

function updateSettingsSessionCount() {
  const el = document.getElementById('settings-session-count');
  if (el) {
    el.textContent = `${AppState.chatSessions.length} conversation${AppState.chatSessions.length === 1 ? '' : 's'}`;
  }
}

// ── System Status & AI Mode ─────────────────────────────────────────────────
async function checkSystemStatus() {
  const statusText = document.getElementById('status-text');
  const modeBadge = document.getElementById('mode-badge');
  const settingsMode = document.getElementById('settings-mode');
  const settingsProvider = document.getElementById('settings-provider');

  try {
    const res = await fetch('/api/status');
    if (res.ok) {
      const data = await res.json();
      AppState.llmEnabled = data.llm_enabled;
      AppState.llmModeName = data.mode;

      if (statusText) {
        statusText.textContent = AppState.llmEnabled ? 'Online (Gemini AI)' : 'Ready (Local AI)';
      }
      if (modeBadge) {
        modeBadge.innerHTML = `<span class="status-dot" style="width:6px;height:6px;animation:none;background:${AppState.llmEnabled ? 'var(--accent-purple)' : 'var(--accent-green)'};"></span> ${AppState.llmModeName}`;
      }
      if (settingsMode) settingsMode.textContent = AppState.llmModeName;
      if (settingsProvider) {
        settingsProvider.textContent = AppState.llmEnabled ? 'Google Gemini 2.0 Flash' : 'Built-in Local Knowledge Base';
      }
      return;
    }
  } catch (e) {
    console.warn('Backend status check returned offline. Local mode enabled.', e);
  }

  // Fallback defaults
  if (statusText) statusText.textContent = 'Assistant Ready (Demo Mode)';
  if (modeBadge) {
    modeBadge.innerHTML = `<span class="status-dot" style="width:6px;height:6px;animation:none;background:var(--accent-green);"></span> Local Demo Mode`;
  }
  if (settingsMode) settingsMode.textContent = 'Local Demo Mode (Fallback)';
  if (settingsProvider) settingsProvider.textContent = 'Built-in Local Knowledge Engine';
}

// ── Load Application Data ───────────────────────────────────────────────────
async function loadApplicationData() {
  const tryFetch = async (url) => {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      // Try with /static prefix if root relative failed
      if (!url.startsWith('/')) {
        try {
          const res2 = await fetch('/' + url);
          if (res2.ok) return await res2.json();
        } catch (e2) {}
      }
    }
    return [];
  };

  const [cmds, errs, quiz, tuts, concs, guides] = await Promise.all([
    tryFetch('static/data/git-commands.json'),
    tryFetch('static/data/git-errors.json'),
    tryFetch('static/data/quiz-questions.json'),
    tryFetch('static/data/git-tutorials.json'),
    tryFetch('static/data/git-concepts.json'),
    tryFetch('static/data/github-guides.json')
  ]);

  AppState.commands = cmds || [];
  AppState.errors = errs || [];
  AppState.quizQuestions = quiz || [];
  AppState.tutorials = tuts || [];
  AppState.concepts = concs || [];
  AppState.githubGuides = guides || [];

  // Extract categories
  const catSet = new Set(['All']);
  AppState.commands.forEach(cat => catSet.add(cat.category));
  AppState.categories = Array.from(catSet);
}

// ── Event Listeners ─────────────────────────────────────────────────────────
function initEventListeners() {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.add('collapsed');
      overlay.classList.remove('visible');
    });
  }

  // Global search shortcut (Ctrl+K or Cmd+K)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
      closeConfirmModal();
    }
  });

  // Chat input listener
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const clearInputBtn = document.getElementById('clear-input-btn');

  if (chatInput) {
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 130) + 'px';

      const hasText = chatInput.value.trim().length > 0;
      if (sendBtn) sendBtn.disabled = !hasText || AppState.isGenerating;
      if (clearInputBtn) clearInputBtn.style.display = hasText ? 'block' : 'none';
    });
  }
}

function clearChatInput() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const clearInputBtn = document.getElementById('clear-input-btn');

  if (chatInput) {
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatInput.focus();
  }
  if (sendBtn) sendBtn.disabled = true;
  if (clearInputBtn) clearInputBtn.style.display = 'none';
}

// ── Toast Notifications ─────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icon = type === 'success' ? '✓' : type === 'error' ? '⚠️' : '⚡';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fade');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 2500);
}

// ── Confirmation Modal ──────────────────────────────────────────────────────
let confirmCallback = null;

function openConfirmModal(title, message, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const titleEl = document.getElementById('confirm-modal-title');
  const msgEl = document.getElementById('confirm-modal-message');
  const btn = document.getElementById('confirm-modal-btn');

  if (!modal) return;

  titleEl.textContent = title;
  msgEl.textContent = message;
  confirmCallback = onConfirm;

  btn.onclick = () => {
    if (confirmCallback) confirmCallback();
    closeConfirmModal();
  };

  modal.style.display = 'flex';
}

function closeConfirmModal() {
  const modal = document.getElementById('confirm-modal');
  if (modal) modal.style.display = 'none';
  confirmCallback = null;
}

// ── Sidebar & Panel Navigation ──────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;

  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    sidebar.classList.toggle('collapsed');
    if (overlay) overlay.classList.toggle('visible', !sidebar.classList.contains('collapsed'));
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

function switchPanel(panelId, navEl) {
  AppState.currentPanel = panelId;

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if (navEl) {
    navEl.classList.add('active');
  } else {
    const targetNav = document.querySelector(`.nav-item[data-panel="${panelId}"]`);
    if (targetNav) targetNav.classList.add('active');
  }

  document.querySelectorAll('.content-panel').forEach(panel => panel.classList.remove('active'));
  const targetPanel = document.getElementById(`panel-${panelId}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
    targetPanel.scrollTop = 0;
  }

  const titles = {
    'chat': 'Git & GitHub Assistant',
    'commands': 'Git Commands Explorer',
    'tutorials': 'Git & GitHub Tutorials',
    'troubleshoot': 'Git Error Troubleshooter',
    'guides': 'GitHub Guides & Workflows',
    'concepts': 'Git Concepts Learning Center',
    'quiz': 'Knowledge Verification Quiz',
    'settings': 'Application Settings'
  };

  const headerTitle = document.getElementById('header-title');
  if (headerTitle) {
    headerTitle.textContent = titles[panelId] || 'Git & GitHub Assistant';
  }

  // Mobile drawer collapse
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.add('collapsed');
    if (overlay) overlay.classList.remove('visible');
  }
}

// ── Chat Session Management ─────────────────────────────────────────────────
function startNewChat() {
  if (AppState.conversationHistory.length > 0) {
    saveCurrentSession();
  }

  AppState.conversationHistory = [];
  AppState.activeSessionId = null;

  const messagesContainer = document.getElementById('messages-container');
  const welcomeScreen = document.getElementById('welcome-screen');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const clearInputBtn = document.getElementById('clear-input-btn');

  if (messagesContainer) {
    messagesContainer.innerHTML = '';
    messagesContainer.classList.remove('visible');
  }
  if (welcomeScreen) welcomeScreen.classList.remove('hidden');
  if (chatInput) {
    chatInput.value = '';
    chatInput.style.height = 'auto';
  }
  if (sendBtn) sendBtn.disabled = true;
  if (clearInputBtn) clearInputBtn.style.display = 'none';

  renderChatHistory();
  switchPanel('chat');
  showToast('New conversation session started', 'info');
}

function saveCurrentSession() {
  if (AppState.conversationHistory.length === 0) return;

  const firstUserMsg = AppState.conversationHistory.find(m => m.role === 'user');
  const title = firstUserMsg ? firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '') : 'Git Session';

  if (AppState.activeSessionId) {
    const existing = AppState.chatSessions.find(s => s.id === AppState.activeSessionId);
    if (existing) {
      existing.messages = [...AppState.conversationHistory];
      existing.updatedAt = Date.now();
      saveSessionsToStorage();
      return;
    }
  }

  const newSession = {
    id: 'session_' + Date.now(),
    title: title,
    messages: [...AppState.conversationHistory],
    updatedAt: Date.now()
  };

  AppState.chatSessions.unshift(newSession);
  AppState.activeSessionId = newSession.id;
  saveSessionsToStorage();
}

function loadChatSession(sessionId) {
  const session = AppState.chatSessions.find(s => s.id === sessionId);
  if (!session) return;

  AppState.activeSessionId = session.id;
  AppState.conversationHistory = [...session.messages];

  const messagesContainer = document.getElementById('messages-container');
  const welcomeScreen = document.getElementById('welcome-screen');

  if (welcomeScreen) welcomeScreen.classList.add('hidden');
  if (messagesContainer) {
    messagesContainer.innerHTML = '';
    messagesContainer.classList.add('visible');

    AppState.conversationHistory.forEach(msg => {
      renderMessage(msg.role, msg.content, false, msg.timestamp);
    });
    scrollToBottom();
  }

  renderChatHistory();
  switchPanel('chat');
}

function promptRenameSession(sessionId, event) {
  if (event) event.stopPropagation();

  const session = AppState.chatSessions.find(s => s.id === sessionId);
  if (!session) return;

  const newTitle = prompt('Enter a new title for this conversation:', session.title);
  if (newTitle && newTitle.trim()) {
    session.title = newTitle.trim();
    saveSessionsToStorage();
    renderChatHistory();
    showToast('Conversation renamed', 'success');
  }
}

function confirmDeleteSession(sessionId, event) {
  if (event) event.stopPropagation();

  openConfirmModal(
    'Delete Conversation',
    'Are you sure you want to permanently delete this conversation history?',
    () => {
      AppState.chatSessions = AppState.chatSessions.filter(s => s.id !== sessionId);
      if (AppState.activeSessionId === sessionId) {
        startNewChat();
      }
      saveSessionsToStorage();
      renderChatHistory();
      showToast('Conversation deleted', 'info');
    }
  );
}

function confirmClearAllHistory() {
  if (AppState.chatSessions.length === 0) {
    showToast('No saved conversations to clear', 'info');
    return;
  }

  openConfirmModal(
    'Clear All Chat History',
    'Are you sure you want to delete all saved conversations? This cannot be undone.',
    () => {
      AppState.chatSessions = [];
      startNewChat();
      saveSessionsToStorage();
      showToast('All chat history cleared', 'info');
    }
  );
}

function confirmClearAllData() {
  openConfirmModal(
    'Reset All Local Data',
    'This will erase all saved conversation sessions, quiz scores, and cached preferences.',
    () => {
      localStorage.removeItem('git_assistant_sessions');
      AppState.chatSessions = [];
      startNewChat();
      saveSessionsToStorage();
      showToast('All local data reset successfully', 'success');
    }
  );
}

function renderChatHistory() {
  const list = document.getElementById('chat-history-list');
  if (!list) return;

  if (AppState.chatSessions.length === 0) {
    list.innerHTML = `
      <div class="chat-history-item" style="color: var(--text-muted); font-style: italic; cursor: default;">
        No conversations yet
      </div>
    `;
    return;
  }

  list.innerHTML = AppState.chatSessions.map(session => {
    const isActive = session.id === AppState.activeSessionId ? 'active' : '';
    const safeTitle = escapeHtml(session.title);

    return `
      <div class="chat-history-item ${isActive}" onclick="loadChatSession('${session.id}')" title="${safeTitle}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="chat-history-title">${safeTitle}</span>
        <div class="chat-history-actions">
          <button class="hist-action-btn" onclick="promptRenameSession('${session.id}', event)" title="Rename">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="hist-action-btn delete" onclick="confirmDeleteSession('${session.id}', event)" title="Delete">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ── Sending & Displaying Messages ───────────────────────────────────────────
function handleInputKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function sendSuggestion(text) {
  switchPanel('chat');
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.value = text;
    sendMessage();
  }
}

async function sendMessage() {
  const chatInput = document.getElementById('chat-input');
  if (!chatInput) return;

  const text = chatInput.value.trim();
  if (!text || AppState.isGenerating) return;

  // Clear input
  clearChatInput();

  // Hide welcome, show messages
  const welcomeScreen = document.getElementById('welcome-screen');
  const messagesContainer = document.getElementById('messages-container');
  if (welcomeScreen) welcomeScreen.classList.add('hidden');
  if (messagesContainer) messagesContainer.classList.add('visible');

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add user message
  renderMessage('user', text, true, timeStr);
  AppState.conversationHistory.push({ role: 'user', content: text, timestamp: timeStr });
  scrollToBottom();

  // Show typing indicator
  AppState.isGenerating = true;
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) typingIndicator.classList.add('visible');
  scrollToBottom();

  let assistantText = null;
  let modeTag = null;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: AppState.conversationHistory.slice(-8)
      })
    });

    if (response.ok) {
      const data = await response.json();
      assistantText = data.response;
      modeTag = data.mode;
    }
  } catch (netErr) {
    console.warn('Network API call unavailable. Falling back to local knowledge engine:', netErr);
  }

  // If backend was unreachable or returned empty, query local fallback knowledge base
  if (!assistantText) {
    assistantText = matchLocalKnowledge(text);
    modeTag = 'local-demo';
  }

  // Hide typing indicator
  if (typingIndicator) typingIndicator.classList.remove('visible');

  const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  renderMessage('assistant', assistantText, true, replyTime, modeTag);
  AppState.conversationHistory.push({ role: 'assistant', content: assistantText, timestamp: replyTime });

  // Update mode badge
  const modeBadge = document.getElementById('mode-badge');
  if (modeBadge) {
    const isLlm = modeTag === 'llm';
    modeBadge.innerHTML = `<span class="status-dot" style="width:6px;height:6px;animation:none;background:${isLlm ? 'var(--accent-purple)' : 'var(--accent-green)'};"></span> ${isLlm ? 'Gemini AI Mode' : 'Local Knowledge Base'}`;
  }

  saveCurrentSession();
  renderChatHistory();

  AppState.isGenerating = false;
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) sendBtn.disabled = chatInput.value.trim().length === 0;
  scrollToBottom();
}

function matchLocalKnowledge(query) {
  const q = query.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|greetings|howdy|sup|good morning|good evening)/i.test(q)) {
    return "Hello! 👋 I'm **Git & GitHub Assistant**, your intelligent coding companion.\n\nI can help you with:\n- ⌨️ **Git Commands**: `init`, `add`, `commit`, `push`, `pull`, `branch`, `stash`, `rebase`\n- 🐙 **GitHub Workflows**: Remote repos, Pull Requests, SSH keys, Pages, Actions\n- 🔍 **Error Diagnostics**: Push rejections, merge conflicts, detached HEAD\n\nHow can I assist your development workflow today?";
  }

  // Best match scoring
  let bestScore = 0;
  let bestAnswer = null;

  for (const [key, item] of Object.entries(LOCAL_KNOWLEDGE)) {
    let score = 0;
    if (q.includes(key.toLowerCase())) score += 6;

    item.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (q.includes(kwLower)) score += kwLower.split(' ').length * 2;
    });

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }

  // Check error library
  AppState.errors.forEach(err => {
    let errScore = 0;
    if (q.includes(err.error.toLowerCase())) errScore += 8;
    err.keywords.forEach(kw => {
      if (q.includes(kw.toLowerCase())) errScore += 3;
    });

    if (errScore > bestScore) {
      bestScore = errScore;
      const causes = err.causes.map(c => `- ${c}`).join('\n');
      const fixes = err.fixes.map(f => `- ${f}`).join('\n');
      const cmds = err.commands.map(c => `\`${c}\``).join(', ');
      bestAnswer = `### Error: \`${err.error}\`\n\n${err.description}\n\n**Probable Causes:**\n${causes}\n\n**Recommended Fixes:**\n${fixes}\n\n**Commands:**\n${cmds}`;
    }
  });

  if (bestScore >= 2 && bestAnswer) {
    return bestAnswer;
  }

  // General fallback
  return `### Git & GitHub Assistant\n\nI understand you're inquiring about: *"**${escapeHtml(query)}**"*\n\nHere are some of the topics I specialize in:\n- **Git Fundamentals**: \`git init\`, \`git add .\`, \`git commit\`, \`git status\`\n- **Branching & Merging**: Creating branches, switching with \`git switch\`, resolving merge conflicts\n- **GitHub Workflows**: Creating repositories, pushing changes, opening Pull Requests\n- **Authentication**: Setting up SSH keys (Ed25519) and Personal Access Tokens\n- **Error Diagnosis**: Paste your terminal error message directly and I will explain how to fix it!\n\n> 💡 Try asking: *"How do I upload my local project to GitHub for the first time?"* or *"Explain Git branching with examples"*`;
}

function renderMessage(role, content, animate = false, timestamp = null, mode = null) {
  const container = document.getElementById('messages-container');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}`;
  if (!animate) msgDiv.style.animation = 'none';

  const avatar = role === 'user' ? '👤' : '⚡';
  const parsedContent = formatMarkdown(content);
  const messageId = 'msg_' + Math.random().toString(36).substring(2, 9);

  let actionsHtml = '';
  if (role === 'assistant') {
    actionsHtml = `
      <div class="msg-actions">
        <button class="msg-action-btn" onclick="copyMessageText('${messageId}', this)" title="Copy entire response">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy
        </button>
      </div>
    `;
  }

  const timeDisplay = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgDiv.innerHTML = `
    <div class="msg-avatar ${role}-avatar">${avatar}</div>
    <div class="msg-content">
      <div class="msg-bubble" id="${messageId}">
        ${parsedContent}
      </div>
      <div class="msg-timestamp">${timeDisplay}</div>
      ${actionsHtml}
    </div>
  `;

  container.appendChild(msgDiv);
}

function scrollToBottom() {
  const container = document.getElementById('messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// ── Markdown Parser ─────────────────────────────────────────────────────────
function formatMarkdown(text) {
  if (!text) return '';

  let html = text;

  // Escape HTML tags to prevent XSS
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Re-allow blockquotes
  html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');

  // Code blocks with syntax highlighting & copy header
  html = html.replace(/```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang.trim() || 'bash';
    const cleanCode = code.trim();
    const encodedCode = encodeURIComponent(cleanCode);
    return `
      <div class="code-block-header">
        <span class="code-lang">${escapeHtml(language)}</span>
        <button class="copy-code-btn" onclick="copyDecodedCode('${encodedCode}', this)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy Code
        </button>
      </div>
      <pre><code class="language-${language}">${cleanCode}</code></pre>
    `;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headings
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Markdown Tables
  html = html.replace(/(?:^\|.+?\|\r?\n){2,}/gm, (tableText) => {
    const lines = tableText.trim().split('\n');
    if (lines.length < 2) return tableText;

    let tableHtml = '<table>';
    lines.forEach((line, index) => {
      const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
      if (index === 0) {
        tableHtml += '<thead><tr>' + cells.map(c => `<th>${c.trim()}</th>`).join('') + '</tr></thead><tbody>';
      } else if (index === 1 && line.includes('---')) {
        // Separator
      } else {
        tableHtml += '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
      }
    });
    tableHtml += '</tbody></table>';
    return tableHtml;
  });

  // Unordered lists
  html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Paragraph breaks
  html = html.replace(/\n\n/g, '<p></p>');

  return html;
}

// ── Git Command Explorer ────────────────────────────────────────────────────
function renderCommands() {
  const tabsContainer = document.getElementById('cmd-filter-tabs');
  const gridContainer = document.getElementById('commands-grid');
  if (!tabsContainer || !gridContainer) return;

  // Render Tabs
  tabsContainer.innerHTML = AppState.categories.map(cat => {
    const activeClass = cat === AppState.activeCategory ? 'active' : '';
    return `<button class="filter-tab ${activeClass}" onclick="selectCategory('${escapeHtml(cat)}')">${escapeHtml(cat)}</button>`;
  }).join('');

  // Filter commands
  const searchInput = document.getElementById('cmd-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = [];

  AppState.commands.forEach(group => {
    if (AppState.activeCategory === 'All' || group.category === AppState.activeCategory) {
      group.commands.forEach(cmd => {
        if (!query ||
            cmd.name.toLowerCase().includes(query) ||
            cmd.syntax.toLowerCase().includes(query) ||
            cmd.description.toLowerCase().includes(query) ||
            (cmd.example && cmd.example.toLowerCase().includes(query))) {
          filtered.push({ ...cmd, category: group.category });
        }
      });
    }
  });

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 6px;">No commands match your query "${escapeHtml(query)}"</p>
        <p style="font-size: 0.85rem;">Try searching for "clone", "commit", "push", or select "All".</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered.map(cmd => {
    const encodedSyntax = encodeURIComponent(cmd.syntax);
    const encodedExample = cmd.example ? encodeURIComponent(cmd.example) : '';
    return `
      <div class="command-card" id="cmd-${cmd.name.replace(/\s+/g, '-')}">
        <div class="cmd-name">
          <span>${escapeHtml(cmd.name)}</span>
          <span style="font-size: 0.7rem; font-weight: 500; color: var(--accent-purple); background: rgba(124,77,255,0.1); padding: 2px 8px; border-radius: 10px;">
            ${escapeHtml(cmd.category)}
          </span>
        </div>
        <div class="cmd-description">${escapeHtml(cmd.description)}</div>
        <div class="cmd-syntax" style="display:flex; justify-content:space-between; align-items:center;">
          <code>${escapeHtml(cmd.syntax)}</code>
          <button class="copy-btn" onclick="copyDecodedCode('${encodedSyntax}', this)" title="Copy syntax">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          </button>
        </div>
        ${cmd.example ? `
          <div class="cmd-example">
            <div class="cmd-example-label">Example</div>
            <div style="position:relative;">
              <pre><code>${escapeHtml(cmd.example)}</code></pre>
              <button class="copy-btn" style="position:absolute; right:8px; top:8px;" onclick="copyDecodedCode('${encodedExample}', this)" title="Copy example">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function selectCategory(category) {
  AppState.activeCategory = category;
  renderCommands();
}

function filterCommands() {
  renderCommands();
}

// ── Git & GitHub Step-by-Step Tutorials ─────────────────────────────────────
function renderTutorials() {
  const container = document.getElementById('tutorials-list');
  if (!container) return;

  if (AppState.tutorials.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Loading step-by-step tutorials...</div>`;
    return;
  }

  container.innerHTML = AppState.tutorials.map((tut, index) => {
    const isFirst = index === 0 ? 'expanded' : '';
    const stepsHtml = tut.steps.map(s => {
      const encodedCode = s.code ? encodeURIComponent(s.code) : '';
      return `
        <div class="tutorial-step">
          <div class="step-label">Step ${s.step}: ${escapeHtml(s.title)}</div>
          <div class="step-text">${escapeHtml(s.instruction)}</div>
          ${s.code ? `
            <div class="step-code">
              <code>${escapeHtml(s.code)}</code>
              <button class="copy-btn" onclick="copyDecodedCode('${encodedCode}', this)" title="Copy command">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </button>
            </div>
          ` : ''}
          ${s.result ? `<div class="step-result">✓ <strong>Expected Output:</strong> ${escapeHtml(s.result)}</div>` : ''}
          ${s.warning ? `<div class="step-warning">⚠️ <strong>Notice:</strong> ${escapeHtml(s.warning)}</div>` : ''}
          ${s.mistake ? `<div class="step-mistake">✗ <strong>Common Pitfall:</strong> ${escapeHtml(s.mistake)}</div>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="tutorial-card ${isFirst}" id="tutorial-${tut.id}">
        <div class="tutorial-header" onclick="toggleTutorial(this)">
          <div class="tutorial-number">${tut.id}</div>
          <div class="tutorial-title">${escapeHtml(tut.title)}</div>
          <div class="tutorial-toggle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="tutorial-body">
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">${escapeHtml(tut.description)}</p>
          ${stepsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function toggleTutorial(headerEl) {
  const card = headerEl.closest('.tutorial-card');
  if (card) card.classList.toggle('expanded');
}

// ── Git Error Troubleshooter ────────────────────────────────────────────────
function renderErrors() {
  const container = document.getElementById('errors-grid');
  if (!container) return;

  const searchInput = document.getElementById('error-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = AppState.errors;
  if (query) {
    filtered = AppState.errors.filter(err =>
      err.error.toLowerCase().includes(query) ||
      err.description.toLowerCase().includes(query) ||
      err.keywords.some(k => k.toLowerCase().includes(query))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        No errors matching "${escapeHtml(query)}" found in database.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((err, i) => {
    const isFirst = i === 0 && !query ? 'expanded' : '';
    const causesList = err.causes.map(c => `<li>${escapeHtml(c)}</li>`).join('');
    const fixesList = err.fixes.map(f => `<li>${escapeHtml(f)}</li>`).join('');
    const cmdsChips = err.commands.map(cmd => {
      const encoded = encodeURIComponent(cmd);
      return `
        <span class="error-cmd-chip" onclick="copyDecodedCode('${encoded}', this)" title="Click to copy">
          <code>${escapeHtml(cmd)}</code>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </span>
      `;
    }).join('');

    return `
      <div class="error-list-card ${isFirst}" id="err-${i}">
        <div class="error-list-header" onclick="toggleErrorCard(this)">
          <div class="error-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="error-name">${escapeHtml(err.error)}</div>
          <div class="tutorial-toggle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="error-list-body">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 6px 0 12px;">${escapeHtml(err.description)}</p>
          <div class="error-section">
            <div class="error-section-title">Common Causes</div>
            <ul>${causesList}</ul>
          </div>
          <div class="error-section">
            <div class="error-section-title">Recommended Fixes</div>
            <ul>${fixesList}</ul>
          </div>
          <div class="error-section">
            <div class="error-section-title">Quick Commands</div>
            <div class="error-commands">${cmdsChips}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleErrorCard(headerEl) {
  const card = headerEl.closest('.error-list-card');
  if (card) card.classList.toggle('expanded');
}

function filterErrors() {
  renderErrors();
}

function analyzeError() {
  const input = document.getElementById('error-paste-input');
  const resultDiv = document.getElementById('error-result');
  if (!input || !resultDiv) return;

  const pastedText = input.value.trim().toLowerCase();
  if (!pastedText) {
    resultDiv.className = 'error-result visible';
    resultDiv.innerHTML = `
      <div style="color: var(--accent-orange); font-size: 0.88rem;">
        ⚠️ Please paste an error message into the box first. For example: <code>fatal: not a git repository</code>.
      </div>
    `;
    return;
  }

  // Find best matching error
  let bestMatch = null;
  let highestScore = 0;

  AppState.errors.forEach(err => {
    let score = 0;
    const errText = err.error.toLowerCase();

    if (pastedText.includes(errText) || errText.includes(pastedText)) {
      score += 10;
    }

    err.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (pastedText.includes(kwLower)) {
        score += kwLower.length;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = err;
    }
  });

  resultDiv.className = 'error-result visible';

  if (bestMatch && highestScore >= 3) {
    const causes = bestMatch.causes.map(c => `<li>${escapeHtml(c)}</li>`).join('');
    const fixes = bestMatch.fixes.map(f => `<li>${escapeHtml(f)}</li>`).join('');
    const commands = bestMatch.commands.map(cmd => {
      const encoded = encodeURIComponent(cmd);
      return `
        <span class="error-cmd-chip" onclick="copyDecodedCode('${encoded}', this)" title="Click to copy">
          <code>${escapeHtml(cmd)}</code>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </span>
      `;
    }).join('');

    resultDiv.innerHTML = `
      <div class="error-result-title">🚨 Matched: ${escapeHtml(bestMatch.error)}</div>
      <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:12px;">${escapeHtml(bestMatch.description)}</p>
      <div class="error-section">
        <div class="error-section-title">Probable Causes</div>
        <ul>${causes}</ul>
      </div>
      <div class="error-section">
        <div class="error-section-title">Safe Troubleshooting Steps</div>
        <ul>${fixes}</ul>
      </div>
      <div class="error-section">
        <div class="error-section-title">Suggested Safe Commands</div>
        <div class="error-commands">${commands}</div>
      </div>
    `;
  } else {
    // Unknown error fallback with option to ask chatbot
    const escapedInput = escapeHtml(input.value.trim());
    resultDiv.innerHTML = `
      <div class="error-result-title" style="color: var(--accent-orange);">⚠️ Exact Cause Could Not Be Determined</div>
      <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 8px 0 12px;">
        We couldn't locate an exact match for this error in our quick-fix database. Common reasons include:
      </p>
      <ul style="font-size: 0.85rem; color: var(--text-secondary); padding-left: 18px; margin-bottom: 14px;">
        <li>Syntax error or typo in your Git command arguments</li>
        <li>Custom remote server configuration or enterprise proxy issue</li>
        <li>Missing repository context or uncommitted merge conflict</li>
      </ul>
      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <button class="analyze-btn" style="margin-top:0;" onclick="askChatbotAboutError('${encodeURIComponent(input.value.trim())}')">
          Ask Git &amp; GitHub Assistant in Chat 💬
        </button>
        <span style="font-size: 0.78rem; color: var(--text-muted);">
          Our AI assistant will analyze the full error with detailed step-by-step guidance.
        </span>
      </div>
    `;
  }
}

function askChatbotAboutError(encodedError) {
  const errorText = decodeURIComponent(encodedError);
  sendSuggestion(`How do I fix this Git error: ${errorText}`);
}

// ── GitHub Guides Panel ─────────────────────────────────────────────────────
function renderGitHubGuides() {
  const container = document.getElementById('github-guides-grid');
  if (!container) return;

  if (AppState.githubGuides.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Loading GitHub workflow guides...</div>`;
    return;
  }

  container.innerHTML = AppState.githubGuides.map(guide => {
    const stepsList = guide.steps ? guide.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('') : '';

    return `
      <div class="concept-card" id="guide-${guide.id}">
        <div class="concept-icon">${guide.icon}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div class="concept-title" style="margin-bottom:0;">${escapeHtml(guide.title)}</div>
          <span style="font-size:0.68rem; padding:2px 8px; border-radius:10px; background:rgba(68,138,255,0.1); color:var(--accent-blue);">
            ${escapeHtml(guide.category)}
          </span>
        </div>
        <div class="concept-text" style="margin-bottom:10px;">${escapeHtml(guide.summary)}</div>
        <div style="font-size:0.75rem; color:var(--accent-purple-light); font-weight:600; text-transform:uppercase; margin-bottom:4px;">Workflow Steps</div>
        <ol style="font-size:0.82rem; color:var(--text-secondary); padding-left:18px; margin-bottom:10px;">
          ${stepsList}
        </ol>
        ${guide.proTip ? `
          <div style="background:rgba(24,255,255,0.05); border:1px solid rgba(24,255,255,0.15); border-radius:var(--radius-sm); padding:8px 10px; font-size:0.8rem; color:var(--accent-cyan);">
            💡 <strong>Pro Tip:</strong> ${escapeHtml(guide.proTip)}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// ── Git Concepts Learning Center ────────────────────────────────────────────
function renderConcepts() {
  const container = document.getElementById('concepts-grid');
  if (!container) return;

  if (AppState.concepts.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Loading Git concepts...</div>`;
    return;
  }

  container.innerHTML = AppState.concepts.map(concept => {
    if (concept.isComparison) {
      // Comparison Table Card
      const rows = concept.comparison.map(c => `
        <tr>
          <td><strong>${escapeHtml(c.aspect)}</strong></td>
          <td><code>${escapeHtml(c.git)}</code></td>
          <td>${escapeHtml(c.github)}</td>
        </tr>
      `).join('');

      return `
        <div class="concept-card" style="grid-column: 1 / -1;">
          <div class="concept-icon">${concept.icon}</div>
          <div class="concept-title">${escapeHtml(concept.title)}</div>
          <div class="concept-text">${escapeHtml(concept.description)}</div>
          <div style="overflow-x:auto;">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Feature / Dimension</th>
                  <th>Git (Local Tool)</th>
                  <th>GitHub (Cloud Platform)</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    const pointsList = concept.points ? concept.points.map(p => `<li>${escapeHtml(p)}</li>`).join('') : '';

    return `
      <div class="concept-card" id="concept-${concept.id}">
        <div class="concept-icon">${concept.icon}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div class="concept-title" style="margin-bottom:0;">${escapeHtml(concept.title)}</div>
          <span style="font-size:0.68rem; padding:2px 8px; border-radius:10px; background:rgba(68,138,255,0.1); color:var(--accent-blue);">
            ${escapeHtml(concept.tag)}
          </span>
        </div>
        <div class="concept-text">${escapeHtml(concept.description)}</div>
        ${pointsList ? `<ul style="font-size:0.8rem; color:var(--text-secondary); padding-left:16px; margin:10px 0;">${pointsList}</ul>` : ''}
        ${concept.example ? `
          <div style="margin-top:10px; background:#0d0d18; padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <div style="font-size:0.7rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; margin-bottom:4px;">Quick Example</div>
            <code style="font-size:0.78rem; color:var(--accent-cyan); white-space:pre-wrap;">${escapeHtml(concept.example)}</code>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// ── Interactive Quiz Mode ───────────────────────────────────────────────────
function initQuiz() {
  if (AppState.quizQuestions.length === 0) return;

  AppState.quiz.questions = [...AppState.quizQuestions].sort(() => 0.5 - Math.random());
  AppState.quiz.currentIndex = 0;
  AppState.quiz.score = 0;
  AppState.quiz.selectedOption = null;
  AppState.quiz.isSubmitted = false;

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const { questions, currentIndex, score } = AppState.quiz;

  if (currentIndex >= questions.length) {
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    let message = "Outstanding! You're a true Git & GitHub Master!";
    if (percentage < 60) {
      message = "Good attempt! Review the Git Concepts and Commands sections, then try again.";
    } else if (percentage < 85) {
      message = "Great job! You have a solid grasp of Git workflows.";
    }

    container.innerHTML = `
      <div class="quiz-score-card">
        <div class="score-circle">
          <div class="score-value">${score}/${total}</div>
          <div class="score-label">Final Score</div>
        </div>
        <div class="score-percentage">${percentage}% Accuracy</div>
        <div class="score-message">${message}</div>
        <button class="restart-btn" onclick="initQuiz()">
          Restart Quiz ↺
        </button>
      </div>
    `;
    return;
  }

  const q = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const letters = ['A', 'B', 'C', 'D'];

  const optionsHtml = q.options.map((opt, i) => {
    let classes = 'quiz-option';
    if (AppState.quiz.selectedOption === i) classes += ' selected';
    if (AppState.quiz.isSubmitted) {
      classes += ' disabled';
      if (i === q.correct) classes += ' correct';
      else if (AppState.quiz.selectedOption === i) classes += ' incorrect';
    }

    return `
      <div class="${classes}" onclick="selectQuizOption(${i})">
        <span class="option-letter">${letters[i]}</span>
        <span>${escapeHtml(opt)}</span>
      </div>
    `;
  }).join('');

  const submitDisabled = AppState.quiz.selectedOption === null || AppState.quiz.isSubmitted;

  container.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
      <div class="quiz-progress-text">Question ${currentIndex + 1} of ${questions.length} • Score: ${score}</div>
    </div>

    <div class="quiz-question-card">
      <div class="quiz-question-number">Question ${currentIndex + 1}</div>
      <div class="quiz-question-text">${escapeHtml(q.question)}</div>
      <div class="quiz-options">${optionsHtml}</div>

      <div class="quiz-explanation ${AppState.quiz.isSubmitted ? 'visible' : ''}">
        <strong>💡 Explanation:</strong> ${escapeHtml(q.explanation)}
      </div>

      ${!AppState.quiz.isSubmitted ? `
        <button class="quiz-submit-btn" id="quiz-btn" onclick="submitQuizAnswer()" ${submitDisabled ? 'disabled' : ''}>
          Submit Answer
        </button>
      ` : `
        <button class="quiz-next-btn" id="quiz-btn" onclick="nextQuizQuestion()">
          ${currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question →'}
        </button>
      `}
    </div>
  `;
}

function selectQuizOption(index) {
  if (AppState.quiz.isSubmitted) return;
  AppState.quiz.selectedOption = index;
  renderQuizQuestion();
}

function submitQuizAnswer() {
  if (AppState.quiz.selectedOption === null || AppState.quiz.isSubmitted) return;

  AppState.quiz.isSubmitted = true;
  const q = AppState.quiz.questions[AppState.quiz.currentIndex];

  if (AppState.quiz.selectedOption === q.correct) {
    AppState.quiz.score += 1;
    showToast('Correct answer! +1 Point', 'success');
  } else {
    showToast('Incorrect — review the explanation below', 'error');
  }

  renderQuizQuestion();
}

function nextQuizQuestion() {
  AppState.quiz.currentIndex += 1;
  AppState.quiz.selectedOption = null;
  AppState.quiz.isSubmitted = false;
  renderQuizQuestion();
}

// ── Global Search Modal (Ctrl+K) ────────────────────────────────────────────
function openSearchModal() {
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('global-search-input');
  if (modal) {
    modal.classList.add('visible');
    if (input) {
      input.value = '';
      input.focus();
      globalSearch('');
    }
  }
}

function closeSearchModal(event) {
  if (event && event.target && event.target.id !== 'search-modal' && !event.target.classList.contains('modal-close-btn')) return;
  const modal = document.getElementById('search-modal');
  if (modal) modal.classList.remove('visible');
}

function globalSearch(query) {
  const resultsDiv = document.getElementById('search-results');
  if (!resultsDiv) return;

  const q = query.toLowerCase().trim();
  if (!q) {
    resultsDiv.innerHTML = `
      <div class="search-empty">Type to search across Git commands, tutorials, errors, guides, and concepts...</div>
    `;
    return;
  }

  const results = [];

  // Search Commands
  AppState.commands.forEach(group => {
    group.commands.forEach(cmd => {
      if (cmd.name.toLowerCase().includes(q) || cmd.syntax.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q)) {
        results.push({
          type: 'command',
          icon: '⌨️',
          title: cmd.name,
          subtitle: cmd.description,
          action: () => {
            closeSearchModal();
            switchPanel('commands');
            const searchInput = document.getElementById('cmd-search');
            if (searchInput) {
              searchInput.value = cmd.name;
              filterCommands();
            }
          }
        });
      }
    });
  });

  // Search Errors
  AppState.errors.forEach(err => {
    if (err.error.toLowerCase().includes(q) || err.description.toLowerCase().includes(q) || err.keywords.some(k => k.toLowerCase().includes(q))) {
      results.push({
        type: 'error',
        icon: '🔍',
        title: err.error,
        subtitle: err.description,
        action: () => {
          closeSearchModal();
          switchPanel('troubleshoot');
          const errSearch = document.getElementById('error-search');
          if (errSearch) {
            errSearch.value = err.error;
            filterErrors();
          }
        }
      });
    }
  });

  // Search Tutorials
  AppState.tutorials.forEach(tut => {
    if (tut.title.toLowerCase().includes(q) || tut.description.toLowerCase().includes(q)) {
      results.push({
        type: 'tutorial',
        icon: '📖',
        title: tut.title,
        subtitle: tut.description,
        action: () => {
          closeSearchModal();
          switchPanel('tutorials');
          const el = document.getElementById(`tutorial-${tut.id}`);
          if (el) {
            el.classList.add('expanded');
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  });

  // Search GitHub Guides
  AppState.githubGuides.forEach(guide => {
    if (guide.title.toLowerCase().includes(q) || guide.summary.toLowerCase().includes(q)) {
      results.push({
        type: 'guide',
        icon: guide.icon || '🐙',
        title: guide.title,
        subtitle: guide.summary,
        action: () => {
          closeSearchModal();
          switchPanel('guides');
          const el = document.getElementById(`guide-${guide.id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  // Search Concepts
  AppState.concepts.forEach(conc => {
    if (conc.title.toLowerCase().includes(q) || conc.description.toLowerCase().includes(q)) {
      results.push({
        type: 'concept',
        icon: conc.icon || '💡',
        title: conc.title,
        subtitle: conc.description,
        action: () => {
          closeSearchModal();
          switchPanel('concepts');
          const el = document.getElementById(`concept-${conc.id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  if (results.length === 0) {
    resultsDiv.innerHTML = `
      <div class="search-empty">No results found for "${escapeHtml(q)}". Try searching for "init", "branch", "pull", or "conflict".</div>
    `;
    return;
  }

  resultsDiv.innerHTML = results.slice(0, 12).map((item, idx) => {
    return `
      <div class="search-result-item" id="search-item-${idx}">
        <div class="search-result-icon">${item.icon}</div>
        <div class="search-result-text">
          <div class="search-result-title">${escapeHtml(item.title)}</div>
          <div class="search-result-section">${escapeHtml(item.subtitle.slice(0, 75))}${item.subtitle.length > 75 ? '...' : ''}</div>
        </div>
      </div>
    `;
  }).join('');

  results.slice(0, 12).forEach((item, idx) => {
    const el = document.getElementById(`search-item-${idx}`);
    if (el) el.addEventListener('click', item.action);
  });
}

// ── Clipboard Utility ───────────────────────────────────────────────────────
function copyDecodedCode(encodedText, btnEl) {
  const text = decodeURIComponent(encodedText);
  copyToClipboard(text, btnEl, 'Code snippet copied to clipboard');
}

function copyMessageText(msgId, btnEl) {
  const el = document.getElementById(msgId);
  if (!el) return;
  copyToClipboard(el.innerText, btnEl, 'Message response copied to clipboard');
}

function copyToClipboard(text, btnEl, toastMsg = 'Copied to clipboard') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showCopiedFeedback(btnEl);
      showToast(toastMsg, 'success');
    }).catch(() => {
      fallbackCopyText(text, btnEl, toastMsg);
    });
  } else {
    fallbackCopyText(text, btnEl, toastMsg);
  }
}

function fallbackCopyText(text, btnEl, toastMsg) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopiedFeedback(btnEl);
    showToast(toastMsg, 'success');
  } catch (err) {
    console.error('Fallback copy failed:', err);
    showToast('Failed to copy to clipboard', 'error');
  }
  document.body.removeChild(textarea);
}

function showCopiedFeedback(btnEl) {
  if (!btnEl) return;
  const originalHtml = btnEl.innerHTML;
  btnEl.classList.add('copied');
  btnEl.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    Copied!
  `;
  setTimeout(() => {
    btnEl.classList.remove('copied');
    btnEl.innerHTML = originalHtml;
  }, 2000);
}

// ── Helper Utilities ────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
