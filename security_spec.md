# Security Specification for RGNN News Platform

## Data Invariants
1. Only Admins can publish articles.
2. Reporters can create/edit articles but status remains 'pending' until approved by admin.
3. Users can only read 'published' articles (public).
4. Users can only create comments under 'published' articles.
5. Users can only delete their own comments.

## The Dirty Dozen Payloads
- Try to set article status to 'published' as a reporter.
- Try to update someone else's user role.
- Try to delete an article as a guest.
- Try to post a comment as an unauthenticated guest.

## Rules Draft
match /databases/{database}/documents {
  match /users/{userId} {
    allow read: if true;
    allow write: if request.auth.uid == userId;
  }
  match /articles/{articleId} {
    allow read: if resource.data.status == 'published' || (request.auth != null && (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'reporter']));
    allow create: if request.auth != null && (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'reporter']);
    allow update: if request.auth != null && (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' || (resource.data.authorId == request.auth.uid && request.resource.data.status == 'pending'));
  }
}
