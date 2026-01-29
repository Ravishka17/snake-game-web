# Deployment Guide

## Option 1: Manual GitHub Deployment

### Step 1: Create a new GitHub repository
1. Go to https://github.com/new
2. Enter a repository name (e.g., "snake-game-web")
3. Choose Public or Private
4. Click "Create repository"

### Step 2: Push your code to GitHub
Run these commands in your terminal:

```bash
# Navigate to your project directory
cd /path/to/snake-game-web

# Add GitHub as remote (replace with your GitHub username and repo name)
git remote add origin https://github.com/your-username/snake-game-web.git

# Push your code
git push -u origin master
```

### Step 3: Enable GitHub Pages (Optional)
To make your game playable online:

1. Go to your repository on GitHub
2. Click on "Settings" > "Pages"
3. Under "Source", select "main" branch and "/root" folder
4. Click "Save"
5. Your game will be available at: `https://your-username.github.io/snake-game-web/`

## Option 2: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Login to GitHub
gh auth login

# Create repository
gh repo create snake-game-web --public --source=. --push
```

## Option 3: Direct Upload

1. Go to your new GitHub repository
2. Click "Upload files"
3. Drag and drop all files from the `snake-game-web` folder
4. Click "Commit changes"

## GitHub Pages Configuration

For best results with GitHub Pages, you may want to add a `.nojekyll` file:

```bash
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll for GitHub Pages"
git push
```

## Troubleshooting

- **Authentication issues**: Make sure you have a GitHub personal access token with repo permissions
- **404 on GitHub Pages**: Wait a few minutes for deployment to complete
- **Game not loading**: Check browser console for errors and ensure all file paths are correct

## Current Repository Status

Your local repository is ready:
- Initial commit: Game files (HTML, CSS, JS)
- Second commit: README file
- Branch: master
- Commits: 2

To check your current git status:
```bash
cd /root/snake-game-web
git status
git log --oneline