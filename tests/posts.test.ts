import { test, expect } from '../fixtures';
import { buildRole, buildUser, buildCategory, buildPost } from '../helpers/testData';
import { createRoleViaApi, createUserViaApi, createCategoryViaApi, createPostViaApi } from '../helpers/api';

test.describe('Posts CRUD', () => {
  test('creates a new post', async ({ postsPage, trackRoleForCleanup, trackUserForCleanup, trackCategoryForCleanup, trackPostForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackRoleForCleanup(createdRole.id);

    const author = buildUser({ roleLabel: role.name });
    const createdAuthor = await createUserViaApi(request, {
      name: author.name,
      email: author.email,
      roleId: createdRole.id,
      status: author.status,
    });
    trackUserForCleanup(createdAuthor.id);

    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, category);
    trackCategoryForCleanup(createdCategory.id);

    const post = buildPost({
      authorLabel: author.name,
      categoryLabel: category.name,
    });

    await test.step('navigate to the posts page', async () => {
      await postsPage.goto();
      await postsPage.openPostsPage();
    });

    await test.step('fill and submit the create form', async () => {
      await postsPage.openCreateForm();
      await postsPage.fillForm(post);
    });

    const created = await postsPage.submitAndWaitForApi('POST');
    trackPostForCleanup(created.id);

    await test.step('verify success toast and row data', async () => {
      await postsPage.expectSuccessToast('Post created successfully');
      await postsPage.expectRow(post.title, {
        authorLabel: post.authorLabel,
        status: post.status,
      });
    });
  });

  test('edits an existing post', async ({ postsPage, trackRoleForCleanup, trackUserForCleanup, trackCategoryForCleanup, trackPostForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackRoleForCleanup(createdRole.id);

    const author = buildUser({ roleLabel: role.name });
    const createdAuthor = await createUserViaApi(request, {
      name: author.name,
      email: author.email,
      roleId: createdRole.id,
      status: author.status,
    });
    trackUserForCleanup(createdAuthor.id);

    const originalCategory = buildCategory();
    const originalCategoryCreated = await createCategoryViaApi(request, originalCategory);
    trackCategoryForCleanup(originalCategoryCreated.id);

    const updatedCategory = buildCategory();
    const updatedCategoryCreated = await createCategoryViaApi(request, updatedCategory);
    trackCategoryForCleanup(updatedCategoryCreated.id);

    const original = buildPost({
      authorLabel: author.name,
      categoryLabel: originalCategory.name,
    });
    const created = await createPostViaApi(request, {
      title: original.title,
      content: original.content,
      authorId: createdAuthor.id,
      categoryId: originalCategoryCreated.id,
      status: original.status,
    });
    trackPostForCleanup(created.id);

    const updated = buildPost({
      title: `Edit ${original.title}`,
      content: `Updated ${original.content}`,
      authorLabel: author.name,
      categoryLabel: updatedCategory.name,
      status: 'published',
    });

    await test.step('navigate to the posts page', async () => {
      await postsPage.goto();
      await postsPage.openPostsPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await postsPage.expectRow(original.title, {
        authorLabel: original.authorLabel,
        status: original.status,
      });
    });

    await test.step('edit and submit', async () => {
      await postsPage.openEditForm(original.title);
      await postsPage.fillForm(updated);
      await postsPage.submitButton.click();
    });

    await test.step('verify success toast and updated row', async () => {
      await postsPage.expectSuccessToast('Post updated successfully');
      await postsPage.expectRow(updated.title, {
        authorLabel: updated.authorLabel,
        status: updated.status,
      });
      await expect(postsPage.row(updated.title).getByTestId('data-publishedAt')).not.toHaveText('—');
    });
  });

  test('deletes an existing post', async ({ postsPage, trackRoleForCleanup, trackUserForCleanup, trackCategoryForCleanup, request }) => {
    // No trackPostForCleanup here on purpose — deleting the post via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackRoleForCleanup(createdRole.id);

    const author = buildUser({ roleLabel: role.name });
    const createdAuthor = await createUserViaApi(request, {
      name: author.name,
      email: author.email,
      roleId: createdRole.id,
      status: author.status,
    });
    trackUserForCleanup(createdAuthor.id);

    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, category);
    trackCategoryForCleanup(createdCategory.id);

    const post = buildPost({
      authorLabel: author.name,
      categoryLabel: category.name,
    });
    await createPostViaApi(request, {
      title: post.title,
      content: post.content,
      authorId: createdAuthor.id,
      categoryId: createdCategory.id,
      status: post.status,
    });

    await test.step('navigate to the posts page', async () => {
      await postsPage.goto();
      await postsPage.openPostsPage();
    });

    await test.step('verify the pre-existing row', async () => {
      await postsPage.expectRow(post.title, {
        authorLabel: post.authorLabel,
        status: post.status,
      });
    });

    await test.step('delete via UI', async () => {
      await postsPage.deletePost(post.title);
      await postsPage.expectSuccessToast('Post deleted successfully');
    });

    await test.step('verify the row is gone', async () => {
      await expect(postsPage.postsDataTable).not.toContainText(post.title);
    });
  });
});
