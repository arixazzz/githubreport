# 🙌 Contribution Guide (CONTRIBUTING.md)

> 🇬🇧 English  
> 🇮🇩 [Bahasa Indonesia](./CONTRIBUTING_ID.md)

Thank you for contributing to this project! To maintain code quality and ensure smooth team collaboration, please follow the standard workflow below:

---

## 🚀 Development Workflow

### 1. Create a New Branch

Always work on a new branch, **never directly on `main`**:

```bash
git checkout -b feat/feature-or-bugfix-name
```

---

### 2. Commit Changes

Use descriptive and conventional commit messages: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

Example:

```bash
git commit -m "fix: fix input validation on login form"
```

---

### 3. Push and Auto Pull Request

After committing, push your branch:

```bash
git push origin feat/feature-or-bugfix-name
```

✅ **If successful**, it will automatically:

- Create a PR from your branch to `main`  
- Use the default PR template  
- You will be **mentioned and assigned** as the PR owner  

⚠️ **If not automatic**, create a manual PR:

- Go to the **Pull Requests** tab on GitHub  
- Click **"New Pull Request"**  
- Select `main` as base and your branch as compare  
- Ensure the PR template is fully filled

---

## 📋 PR Template (REQUIRED)

Every PR must include the following checklist:

- [x] Tested locally and runs without error  
- [x] Does not directly modify files in `main`  
- [ ] PR description explains feature/fix briefly  
- [ ] Self-reviewed before submitting  

> ❌ PRs without a complete checklist will not be reviewed/merged

---

## 👀 Review & Merge

- A team reviewer will check your code and provide feedback  
- Once approved, the PR will be merged into `main`  
- Unused PRs **must be closed**

---

## 🧰 Automated Tools

- `Reviewdog + ESLint` will automatically comment on linting issues  
- `GitHub Actions` verifies installation and runs lint checks on PRs

---

Thank you and happy contributing! 💪
