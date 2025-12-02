# Verification Plan

## 1. Core Features
- [ ] **Authentication**: (Mocked or real?) Need to check how auth is handled.
- [ ] **Profile**:
    - [ ] View Profile
    - [ ] Update Profile (Image, Bio)
- [ ] **Posts**:
    - [ ] Create Post (Text, Image, Tags)
    - [ ] List Posts (Feed)
    - [ ] View Post Details
    - [ ] Edit Post
    - [ ] Delete Post
- [ ] **Interactions**:
    - [ ] Like/Unlike
    - [ ] Bookmark/Unbookmark
- [ ] **Comments**:
    - [ ] Add Comment
    - [ ] List Comments
- [ ] **News Integration**:
    - [ ] Fetch News
    - [ ] Summarize News (AI)

## 2. Verification Strategy
1.  **Code Analysis**: Check `app/api` implementation details.
2.  **Automated Scripts**: Run existing scripts (`check-posts.js`, etc.) and create new ones for missing coverage.
3.  **Browser Walkthrough**: Use `browser_subagent` to simulate user actions.

## 3. Current Status
- [ ] Initial Code Analysis
- [ ] API Verification
- [ ] UI Verification
