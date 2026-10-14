"""
Git & GitHub Assistant — Your Intelligent Coding Companion
Flask Backend Server

This server:
- Serves the single-page application
- Provides a /api/chat endpoint for AI chatbot
- Uses an LLM API (if configured) or falls back to local knowledge base
"""

import os
import json
import re
from flask import Flask, render_template, request, jsonify

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)

# ── Load Knowledge Base ─────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "static", "data")


def load_json(filename):
    filepath = os.path.join(DATA_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


GIT_COMMANDS = load_json("git-commands.json")
GIT_ERRORS = load_json("git-errors.json")
QUIZ_QUESTIONS = load_json("quiz-questions.json")

# ── Local Knowledge Base for Fallback Chat ──────────────────────────────────
KNOWLEDGE_BASE = {
    "git init": {
        "answer": "**`git init`** initializes a new Git repository in your current directory.\n\nIt creates a hidden `.git` folder that stores all version control data.\n\n**Usage:**\n```bash\ncd your-project-folder\ngit init\n```\n\n**What happens:**\n- A `.git` directory is created\n- Your folder is now a Git repository\n- You can start tracking changes with `git add` and `git commit`\n\n> 💡 You only need to run `git init` once per project.",
        "keywords": ["git init", "initialize", "init", "new repository", "create repository", "start git", "setup git"]
    },
    "git add": {
        "answer": "**`git add`** stages your changes for the next commit.\n\n**Stage a specific file:**\n```bash\ngit add filename.txt\n```\n\n**Stage all changes:**\n```bash\ngit add .\n```\n\n**Stage specific types:**\n```bash\ngit add *.html\n```\n\n**How staging works:**\n1. You modify files in your working directory\n2. `git add` moves changes to the **staging area**\n3. `git commit` saves the staged changes as a snapshot\n\n> 💡 Think of staging as preparing a package before shipping it.",
        "keywords": ["git add", "add", "stage", "staging", "track files", "add files"]
    },
    "git commit": {
        "answer": "**`git commit`** saves your staged changes as a permanent snapshot.\n\n**Basic usage:**\n```bash\ngit commit -m \"Your descriptive message here\"\n```\n\n**Good commit messages:**\n- ✅ `\"Add user login form\"`\n- ✅ `\"Fix navigation bug on mobile\"`\n- ❌ `\"update\"` (too vague)\n- ❌ `\"asdfgh\"` (meaningless)\n\n**Amend last commit:**\n```bash\ngit commit --amend -m \"Corrected message\"\n```\n\n> 💡 Each commit gets a unique hash ID and records who made the change and when.",
        "keywords": ["git commit", "commit", "save changes", "snapshot", "commit message"]
    },
    "git status": {
        "answer": "**`git status`** shows the current state of your working directory and staging area.\n\n```bash\ngit status\n```\n\n**It tells you:**\n- Which files are **modified** but not staged\n- Which files are **staged** and ready to commit\n- Which files are **untracked** (new files Git doesn't know about)\n- Which branch you're on\n\n**Short format:**\n```bash\ngit status -s\n# M  modified-file.txt\n# ?? untracked-file.txt\n# A  newly-staged-file.txt\n```\n\n> 💡 Run `git status` frequently to understand what state your project is in.",
        "keywords": ["git status", "status", "check status", "see changes", "what changed"]
    },
    "git push": {
        "answer": "**`git push`** uploads your local commits to a remote repository (like GitHub).\n\n**Basic usage:**\n```bash\ngit push origin main\n```\n\n**First-time push (set upstream):**\n```bash\ngit push -u origin main\n```\n\n**After setting upstream, you can just use:**\n```bash\ngit push\n```\n\n**Common issues:**\n- If rejected, pull first: `git pull origin main`\n- For force push (⚠️ dangerous): `git push --force origin main`\n\n> 💡 Always commit your changes before pushing. Push shares your work with the team.",
        "keywords": ["git push", "push", "upload", "push to github", "send code", "upload code"]
    },
    "git pull": {
        "answer": "**`git pull`** downloads and merges changes from the remote repository into your local branch.\n\n```bash\ngit pull origin main\n```\n\n**What it does (2 steps):**\n1. `git fetch` — downloads new commits from the remote\n2. `git merge` — integrates them into your current branch\n\n**Best practice:**\n- Always pull before pushing to avoid conflicts\n- Pull regularly to stay up-to-date with your team\n\n```bash\ngit pull  # If upstream is set\n```\n\n> 💡 If you get merge conflicts after pulling, resolve them manually, then commit.",
        "keywords": ["git pull", "pull", "download", "fetch", "get latest", "update local"]
    },
    "git clone": {
        "answer": "**`git clone`** creates a local copy of a remote repository.\n\n**Using HTTPS:**\n```bash\ngit clone https://github.com/username/repository.git\n```\n\n**Using SSH:**\n```bash\ngit clone git@github.com:username/repository.git\n```\n\n**Clone into a specific folder:**\n```bash\ngit clone https://github.com/user/repo.git my-folder\n```\n\n**What it does:**\n- Downloads all files, branches, and commit history\n- Automatically sets up `origin` as the remote\n- Creates a directory with the repository name\n\n> 💡 You only need to clone once. After that, use `git pull` to get updates.",
        "keywords": ["git clone", "clone", "download repository", "copy repository", "clone repo"]
    },
    "git branch": {
        "answer": "**Branches** let you work on different features independently.\n\n**List branches:**\n```bash\ngit branch\n```\n\n**Create a new branch:**\n```bash\ngit branch feature-name\n```\n\n**Switch to a branch:**\n```bash\ngit switch feature-name\n# or older syntax:\ngit checkout feature-name\n```\n\n**Create and switch in one command:**\n```bash\ngit switch -c feature-name\ngit checkout -b feature-name\n```\n\n**Delete a branch:**\n```bash\ngit branch -d feature-name\n```\n\n> 💡 The `main` branch is typically the primary branch. Create new branches for features or bug fixes.",
        "keywords": ["git branch", "branch", "branches", "branching", "create branch", "switch branch", "new branch", "git switch", "git checkout"]
    },
    "git merge": {
        "answer": "**`git merge`** combines changes from one branch into another.\n\n**Typical workflow:**\n```bash\n# 1. Switch to the target branch (usually main)\ngit switch main\n\n# 2. Merge the feature branch\ngit merge feature-branch\n```\n\n**If there are no conflicts**, Git creates a merge commit automatically.\n\n**If there are conflicts:**\n1. Git will mark the conflicting files\n2. Open the files and look for `<<<<<<<`, `=======`, `>>>>>>>`\n3. Edit to keep the correct code\n4. Stage and commit:\n```bash\ngit add .\ngit commit -m \"Resolve merge conflicts\"\n```\n\n**Abort a merge:**\n```bash\ngit merge --abort\n```\n\n> 💡 Always test your code after merging to make sure everything works correctly.",
        "keywords": ["git merge", "merge", "combine branches", "merge branches", "merging"]
    },
    "merge conflict": {
        "answer": "**Merge conflicts** happen when Git can't automatically combine changes from two branches because both modified the same lines.\n\n**What you'll see in the file:**\n```\n<<<<<<< HEAD\nYour local changes\n=======\nIncoming remote changes\n>>>>>>> branch-name\n```\n\n**How to resolve:**\n1. Open the conflicting file(s)\n2. Decide which changes to keep (or combine them)\n3. Remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)\n4. Stage the resolved file:\n```bash\ngit add resolved-file.txt\n```\n5. Complete the merge:\n```bash\ngit commit\n```\n\n**Abort if needed:**\n```bash\ngit merge --abort\n```\n\n> 💡 Communication with your team helps avoid merge conflicts. Pull frequently!",
        "keywords": ["merge conflict", "conflict", "resolve conflict", "fix conflict", "conflicts"]
    },
    "github repository": {
        "answer": "**A GitHub repository** is a storage space for your project hosted on GitHub.\n\n**How to create one:**\n1. Go to [github.com](https://github.com) and sign in\n2. Click the **+** icon → **New repository**\n3. Name your repository\n4. Choose public or private\n5. Click **Create repository**\n\n**Connect your local project to GitHub:**\n```bash\n# Initialize Git (if not done)\ngit init\n\n# Add the remote\ngit remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git\n\n# Stage and commit your files\ngit add .\ngit commit -m \"Initial commit\"\n\n# Push to GitHub\ngit push -u origin main\n```\n\n> ⚠️ Replace the URL above with YOUR actual repository URL from GitHub.\n\n> 💡 Public repos are visible to everyone. Private repos are only visible to you and collaborators.",
        "keywords": ["github repository", "create repository", "new repository", "github repo", "upload to github", "upload project", "push to github"]
    },
    "ssh key": {
        "answer": "**SSH keys** provide a secure way to authenticate with GitHub without entering your password each time.\n\n**Generate an SSH key:**\n```bash\nssh-keygen -t ed25519 -C \"your_email@example.com\"\n```\n\n**Start the SSH agent:**\n```bash\neval \"$(ssh-agent -s)\"\n```\n\n**Add your key to the agent:**\n```bash\nssh-add ~/.ssh/id_ed25519\n```\n\n**Copy your public key:**\n```bash\ncat ~/.ssh/id_ed25519.pub\n```\n\n**Add to GitHub:**\n1. Go to GitHub → Settings → SSH and GPG keys\n2. Click **New SSH key**\n3. Paste your public key\n4. Save\n\n**Test connection:**\n```bash\nssh -T git@github.com\n```\n\n> 💡 SSH keys are more secure and convenient than passwords.",
        "keywords": ["ssh", "ssh key", "ssh keys", "generate ssh", "authentication", "publickey", "permission denied"]
    },
    "gitignore": {
        "answer": "**`.gitignore`** tells Git which files and directories to ignore.\n\n**Create a .gitignore file:**\n```bash\ntouch .gitignore\n```\n\n**Common patterns:**\n```\n# Dependencies\nnode_modules/\nvenv/\n__pycache__/\n\n# Environment variables\n.env\n.env.local\n\n# Build outputs\ndist/\nbuild/\n\n# IDE files\n.vscode/\n.idea/\n\n# OS files\n.DS_Store\nThumbs.db\n\n# Logs\n*.log\n```\n\n**Important notes:**\n- Create `.gitignore` before your first commit\n- Files already tracked by Git won't be ignored\n- To stop tracking a file: `git rm --cached filename`\n\n> 💡 GitHub provides template .gitignore files for many languages and frameworks.",
        "keywords": ["gitignore", ".gitignore", "ignore files", "ignore", "exclude files", "git ignore"]
    },
    "readme": {
        "answer": "**`README.md`** is the front page of your GitHub repository.\n\n**Create a README:**\n```bash\ntouch README.md\n```\n\n**Good README structure:**\n```markdown\n# Project Name\n\nShort description of what the project does.\n\n## Features\n- Feature 1\n- Feature 2\n\n## Installation\n```\nsteps to install\n```\n\n## Usage\nHow to use the project.\n\n## Technologies Used\n- HTML, CSS, JavaScript\n- Python Flask\n\n## Contributing\nHow others can contribute.\n\n## License\nMIT License\n```\n\n**Markdown tips:**\n- `#` for headings\n- `**bold**` for bold\n- `` `code` `` for inline code\n- `- item` for bullet lists\n- `[link text](url)` for links\n\n> 💡 A good README makes your project professional and helps others understand it.",
        "keywords": ["readme", "readme.md", "README", "documentation", "project description"]
    },
    "pull request": {
        "answer": "**A Pull Request (PR)** is a way to propose changes on GitHub.\n\n**Workflow:**\n1. Create a branch and make changes:\n```bash\ngit switch -c feature-name\n# Make your changes\ngit add .\ngit commit -m \"Add new feature\"\ngit push origin feature-name\n```\n\n2. Go to your GitHub repository\n3. Click **\"Compare & pull request\"**\n4. Add a title and description\n5. Click **\"Create pull request\"**\n6. Wait for review and approval\n7. Click **\"Merge pull request\"**\n\n**PR best practices:**\n- Write clear descriptions of what changed and why\n- Keep PRs small and focused\n- Request reviews from team members\n- Respond to feedback constructively\n\n> 💡 Pull requests enable code review and collaboration. They're essential in team projects.",
        "keywords": ["pull request", "PR", "merge request", "code review", "pull requests"]
    },
    "fork": {
        "answer": "**Forking** creates your own copy of someone else's repository.\n\n**How to fork:**\n1. Go to the repository on GitHub\n2. Click the **Fork** button (top-right)\n3. Select your account\n\n**After forking:**\n```bash\n# Clone your fork\ngit clone https://github.com/YOUR-USERNAME/forked-repo.git\n\n# Add the original repo as 'upstream'\ngit remote add upstream https://github.com/ORIGINAL-OWNER/repo.git\n\n# Keep your fork updated\ngit fetch upstream\ngit merge upstream/main\n```\n\n**Contributing to open source:**\n1. Fork the repository\n2. Clone your fork\n3. Create a branch\n4. Make changes and commit\n5. Push to your fork\n6. Create a Pull Request to the original repo\n\n> 💡 Forking is the standard way to contribute to open-source projects.",
        "keywords": ["fork", "forking", "fork repository", "open source", "contribute"]
    },
    "github pages": {
        "answer": "**GitHub Pages** lets you host a website directly from a GitHub repository for free.\n\n**Steps to set up:**\n1. Push your HTML/CSS/JS files to a repository\n2. Go to repository **Settings** → **Pages**\n3. Select the branch (usually `main`) and folder (`/ (root)` or `/docs`)\n4. Click **Save**\n\n**Your site will be at:**\n```\nhttps://YOUR-USERNAME.github.io/REPO-NAME/\n```\n\n**Tips:**\n- The main file should be `index.html`\n- It may take a few minutes to deploy\n- Changes are deployed automatically when you push\n\n> 💡 GitHub Pages is perfect for hosting portfolios, project demos, and documentation sites.",
        "keywords": ["github pages", "hosting", "deploy website", "host website", "github.io"]
    },
    "github actions": {
        "answer": "**GitHub Actions** automates workflows directly in your GitHub repository.\n\n**Common uses:**\n- Run tests when code is pushed\n- Build and deploy applications\n- Check code quality\n\n**Basic workflow file** (`.github/workflows/ci.yml`):\n```yaml\nname: CI\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Run tests\n        run: |\n          npm install\n          npm test\n```\n\n**Key concepts:**\n- **Workflow**: Automated process defined in YAML\n- **Trigger**: Event that starts the workflow (push, PR, schedule)\n- **Job**: Set of steps that run on a runner\n- **Step**: Individual task in a job\n\n> 💡 GitHub Actions is free for public repositories with generous limits.",
        "keywords": ["github actions", "CI/CD", "automation", "workflow", "actions", "continuous integration"]
    },
    "git install": {
        "answer": "**Installing Git** on your system:\n\n**Windows:**\n1. Download from [git-scm.com](https://git-scm.com/download/win)\n2. Run the installer\n3. Use default settings (Git Bash is recommended)\n4. Verify: `git --version`\n\n**macOS:**\n```bash\n# Using Homebrew\nbrew install git\n\n# Or install Xcode Command Line Tools\nxcode-select --install\n```\n\n**Linux (Ubuntu/Debian):**\n```bash\nsudo apt update\nsudo apt install git\n```\n\n**After installation, configure:**\n```bash\ngit config --global user.name \"Your Name\"\ngit config --global user.email \"your_email@example.com\"\n```\n\n**Verify installation:**\n```bash\ngit --version\n```\n\n> 💡 After installing, the first thing to do is set your name and email.",
        "keywords": ["install git", "installation", "download git", "setup git", "how to install"]
    },
    "git log": {
        "answer": "**`git log`** shows the commit history of your repository.\n\n**Basic usage:**\n```bash\ngit log\n```\n\n**Compact view:**\n```bash\ngit log --oneline\n```\n\n**Show last N commits:**\n```bash\ngit log -5\n```\n\n**Graph view (visualize branches):**\n```bash\ngit log --oneline --graph --all\n```\n\n**Search commits by message:**\n```bash\ngit log --grep=\"bug fix\"\n```\n\n**Show commits by author:**\n```bash\ngit log --author=\"Nayan\"\n```\n\n> 💡 `git log --oneline --graph --all` is one of the most useful commands for understanding your project's branch structure.",
        "keywords": ["git log", "log", "history", "commit history", "view commits", "git history"]
    },
    "git stash": {
        "answer": "**`git stash`** temporarily saves your uncommitted changes so you can work on something else.\n\n**Save changes:**\n```bash\ngit stash\n```\n\n**Re-apply saved changes:**\n```bash\ngit stash pop\n```\n\n**List all stashes:**\n```bash\ngit stash list\n```\n\n**Apply without removing from stash:**\n```bash\ngit stash apply\n```\n\n**Save with a description:**\n```bash\ngit stash push -m \"Work in progress on login\"\n```\n\n**Drop a stash:**\n```bash\ngit stash drop\n```\n\n**Common use case:**\n1. Working on feature A, need to fix urgent bug\n2. `git stash` — saves feature A work\n3. Fix the bug, commit\n4. `git stash pop` — resume feature A\n\n> 💡 Think of stash as a clipboard for your code changes.",
        "keywords": ["git stash", "stash", "save changes", "temporary save", "stash pop"]
    },
    "git diff": {
        "answer": "**`git diff`** shows the exact changes between different states of your project.\n\n**Unstaged changes (working directory vs staging):**\n```bash\ngit diff\n```\n\n**Staged changes (staging vs last commit):**\n```bash\ngit diff --staged\n```\n\n**Compare two branches:**\n```bash\ngit diff main..feature-branch\n```\n\n**Compare specific file:**\n```bash\ngit diff filename.txt\n```\n\n**Understanding the output:**\n```diff\n- This line was removed (shown in red)\n+ This line was added (shown in green)\n```\n\n> 💡 Use `git diff` to review your changes before committing.",
        "keywords": ["git diff", "diff", "changes", "compare", "differences", "what changed"]
    },
    "git remote": {
        "answer": "**`git remote`** manages connections to remote repositories.\n\n**View remotes:**\n```bash\ngit remote -v\n```\n\n**Add a remote:**\n```bash\ngit remote add origin https://github.com/username/repo.git\n```\n\n**Change remote URL:**\n```bash\ngit remote set-url origin https://github.com/username/new-repo.git\n```\n\n**Remove a remote:**\n```bash\ngit remote remove origin\n```\n\n**Rename a remote:**\n```bash\ngit remote rename origin upstream\n```\n\n> ⚠️ Replace the URL with YOUR actual repository URL.\n\n> 💡 `origin` is the default name for the main remote. You can have multiple remotes.",
        "keywords": ["git remote", "remote", "remote repository", "origin", "remote add", "remote url"]
    },
    "git reset": {
        "answer": "**`git reset`** undoes commits or unstages files.\n\n**Unstage a file (keep changes):**\n```bash\ngit reset HEAD filename.txt\n# or\ngit restore --staged filename.txt\n```\n\n**Undo last commit (keep changes in working directory):**\n```bash\ngit reset --soft HEAD~1\n```\n\n**Undo last commit (keep changes unstaged):**\n```bash\ngit reset HEAD~1\n```\n\n**⚠️ Undo last commit AND discard all changes:**\n```bash\ngit reset --hard HEAD~1\n```\n\n**⚠️ WARNING:** `--hard` permanently deletes your changes. Use with extreme caution!\n\n**Safer alternative for shared branches:**\n```bash\ngit revert <commit-hash>\n```\n\n> 💡 Prefer `git revert` over `git reset --hard` on branches shared with others.",
        "keywords": ["git reset", "reset", "undo commit", "undo", "revert changes", "unstage", "git restore"]
    },
    "what is git": {
        "answer": "**Git** is a **distributed version control system** (VCS) that tracks changes in your code.\n\n**Why use Git?**\n- 📝 **Track changes**: See what changed, who changed it, and when\n- ⏪ **Undo mistakes**: Revert to any previous version\n- 🌿 **Branching**: Work on features independently\n- 👥 **Collaboration**: Multiple people can work on the same project\n- 💾 **Backup**: Your entire project history is saved\n\n**Key concepts:**\n- **Repository (repo)**: A project tracked by Git\n- **Commit**: A snapshot of your project at a point in time\n- **Branch**: An independent line of development\n- **Remote**: A version of your repo hosted online (like GitHub)\n\n**Basic workflow:**\n```bash\ngit init              # Start tracking\ngit add .             # Stage changes\ngit commit -m \"msg\"   # Save snapshot\ngit push              # Upload to remote\n```\n\n> 💡 Git was created by Linus Torvalds (creator of Linux) in 2005.",
        "keywords": ["what is git", "git basics", "version control", "vcs", "explain git", "git definition"]
    },
    "what is github": {
        "answer": "**GitHub** is a **web-based platform** for hosting Git repositories and collaborating on code.\n\n**GitHub provides:**\n- ☁️ **Remote hosting** for Git repositories\n- 👥 **Collaboration tools** (pull requests, issues, code review)\n- 📊 **Project management** (boards, milestones)\n- 🤖 **Automation** (GitHub Actions for CI/CD)\n- 🌐 **Free hosting** (GitHub Pages)\n- 📁 **Open source community** (millions of projects)\n\n**Git vs GitHub:**\n| Feature | Git | GitHub |\n|---------|-----|--------|\n| Type | Software (CLI tool) | Website/Platform |\n| Where | Runs on your computer | Runs in the cloud |\n| Purpose | Track code changes | Host & share repositories |\n| Cost | Free & open source | Free tier + paid plans |\n| Network | Works offline | Requires internet |\n\n**Alternatives to GitHub:**\n- GitLab\n- Bitbucket\n- Azure DevOps\n\n> 💡 You can use Git without GitHub, but GitHub makes collaboration much easier.",
        "keywords": ["what is github", "github", "git vs github", "difference git github", "github platform"]
    }
}

# Greeting patterns
GREETINGS = {
    "keywords": ["hello", "hi", "hey", "greetings", "good morning", "good evening", "howdy", "yo", "sup"],
    "answer": "Hello! 👋 I'm **Git & GitHub Assistant**, your intelligent coding companion.\n\nI can help you with:\n- 🔧 **Git Commands** — learn syntax and usage\n- 📚 **GitHub Workflows** — repos, PRs, branching, collaboration\n- 🐛 **Error Troubleshooting** — diagnose and safely resolve terminal errors\n- 📖 **Concepts** — understand version control architecture\n\nAsk me anything about Git or GitHub! For example:\n- *\"How do I connect my project to GitHub?\"*\n- *\"Explain Git branching with examples\"*\n- *\"Fix error: fatal not a git repository\"*"
}


def find_best_match(query):
    """Find the best matching answer from the knowledge base."""
    query_lower = query.lower().strip()

    # Check greetings
    for kw in GREETINGS["keywords"]:
        if kw in query_lower:
            return GREETINGS["answer"]

    # Score each knowledge base entry
    best_score = 0
    best_answer = None

    for topic, data in KNOWLEDGE_BASE.items():
        score = 0
        for keyword in data["keywords"]:
            keyword_lower = keyword.lower()
            if keyword_lower in query_lower:
                # Longer keyword matches are more specific/valuable
                score += len(keyword_lower.split())
            if query_lower in keyword_lower:
                score += 1

        if score > best_score:
            best_score = score
            best_answer = data["answer"]

    # Check error database
    for error_entry in GIT_ERRORS:
        for keyword in error_entry["keywords"]:
            if keyword.lower() in query_lower:
                causes = "\n".join(f"- {c}" for c in error_entry["causes"])
                fixes = "\n".join(f"- {f}" for f in error_entry["fixes"])
                commands = "\n".join(f"`{c}`" for c in error_entry["commands"])
                best_answer = (
                    f"**Error:** `{error_entry['error']}`\n\n"
                    f"**Description:** {error_entry['description']}\n\n"
                    f"**Common causes:**\n{causes}\n\n"
                    f"**How to fix:**\n{fixes}\n\n"
                    f"**Useful commands:**\n{commands}"
                )
                best_score = 10
                break

    if best_score >= 1:
        return best_answer

    return None


# ── LLM Integration ─────────────────────────────────────────────────────────
LLM_API_KEY = os.environ.get("GEMINI_API_KEY", "")
LLM_ENABLED = bool(LLM_API_KEY)

def call_llm(user_message, conversation_history):
    """Call the Gemini API if configured."""
    if not LLM_ENABLED:
        return None

    try:
        import requests
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={LLM_API_KEY}"

        system_prompt = (
            "You are 'Git & GitHub Assistant', a professional, corporate-grade developer assistant "
            "and intelligent coding companion. You specialize in Git version control, GitHub workflows, "
            "branch management, pull requests, CI/CD, and diagnosing terminal errors. "
            "Provide structured explanations, step-by-step guidance, exact runnable commands with bash code blocks, "
            "expected output, common mistakes to avoid, and safe troubleshooting tips. "
            "Always prioritize code safety and warn users before destructive commands (e.g. git reset --hard)."
        )

        contents = [{"role": "user", "parts": [{"text": system_prompt}]},
                     {"role": "model", "parts": [{"text": "Understood. I am Git & GitHub Assistant, your intelligent coding companion. How can I assist your workflow today?"}]}]

        for msg in conversation_history[-6:]:
            role = "user" if msg["role"] == "user" else "model"
            contents.append({"role": role, "parts": [{"text": msg["content"]}]})

        contents.append({"role": "user", "parts": [{"text": user_message}]})

        payload = {"contents": contents}
        resp = requests.post(url, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"LLM API error: {e}")
        return None


# ── Routes ──────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400

    mode = "local"
    response_text = None

    # Try LLM first if available
    if LLM_ENABLED:
        response_text = call_llm(user_message, history)
        if response_text:
            mode = "llm"

    # Fallback to local knowledge base
    if not response_text:
        response_text = find_best_match(user_message)

    # Ultimate fallback
    if not response_text:
        response_text = (
            "I'm not sure about that specific question. Here's what I can help with:\n\n"
            "- **Git commands**: Ask about `git init`, `git add`, `git commit`, `git push`, etc.\n"
            "- **GitHub**: Repositories, pull requests, forking, GitHub Pages\n"
            "- **Branching**: Create, switch, merge branches\n"
            "- **Errors**: Paste a Git error message and I'll help troubleshoot\n"
            "- **Concepts**: What is Git? What is GitHub? Version control basics\n\n"
            "Try rephrasing your question or ask about a specific Git command!"
        )

    return jsonify({
        "response": response_text,
        "mode": mode
    })


@app.route("/api/status")
def status():
    return jsonify({
        "llm_enabled": LLM_ENABLED,
        "mode": "LLM (Gemini)" if LLM_ENABLED else "Local Knowledge Base"
    })


@app.route("/api/commands")
def get_commands():
    return jsonify(GIT_COMMANDS)


@app.route("/api/errors")
def get_errors():
    return jsonify(GIT_ERRORS)


@app.route("/api/quiz")
def get_quiz():
    return jsonify(QUIZ_QUESTIONS)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
