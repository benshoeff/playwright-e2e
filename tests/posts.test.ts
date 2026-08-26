import { test, expect } from '../fixtures';
import { buildRole, buildUser, buildCategory, buildPost, randomPostStatus } from '../helpers/testData';
import {
  createRoleViaApi,
  createUserViaApi,
  createCategoryViaApi,
  createPostViaApi,
  rolesApiPath,
  usersApiPath,
  categoriesApiPath,
  postsApiPath,
} from '../helpers/api';
import { createViaUi, editViaUi, deleteViaUi } from './crud-helpers';

test.describe('Posts CRUD', () => {
  test('creates a new post', async ({ postsPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const author = buildUser({ roleLabel: role.name });
    const createdAuthor = await createUserViaApi(request, {
      name: author.name,
      email: author.email,
      roleId: createdRole.id,
      status: author.status,
    });
    trackForCleanup(usersApiPath, createdAuthor.id);

    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, category);
    trackForCleanup(categoriesApiPath, createdCategory.id);

    const post = buildPost({
      authorLabel: author.name,
      categoryLabel: category.name,
    });

    const created = await createViaUi(postsPage, {
      entityLabel: 'posts',
      data: post,
      createdName: post.title,
      rowData: {
        authorLabel: post.authorLabel,
        status: post.status,
      },
      toast: 'Post created successfully',
      track: (id) => trackForCleanup(postsApiPath, id),
    });

    await test.step('verify the chosen status was persisted', async () => {
      expect(created.status).toBe(post.status);
    });
  });

  test('edits an existing post', async ({ postsPage, trackForCleanup, request }) => {
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const author = buildUser({ roleLabel: role.name });
    const createdAuthor = await createUserViaApi(request, {
      name: author.name,
      email: author.email,
      roleId: createdRole.id,
      status: author.status,
    });
    trackForCleanup(usersApiPath, createdAuthor.id);

    const originalCategory = buildCategory();
    const originalCategoryCreated = await createCategoryViaApi(request, originalCategory);
    trackForCleanup(categoriesApiPath, originalCategoryCreated.id);

    const updatedCategory = buildCategory();
    const updatedCategoryCreated = await createCategoryViaApi(request, updatedCategory);
    trackForCleanup(categoriesApiPath, updatedCategoryCreated.id);

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
    trackForCleanup(postsApiPath, created.id);

    const updated = buildPost({
      title: `Edit ${original.title}`,
      content: `Updated ${original.content}`,
      authorLabel: author.name,
      categoryLabel: updatedCategory.name,
      status: randomPostStatus(original.status),
    });

    const apiResult = await editViaUi(postsPage, {
      entityLabel: 'posts',
      originalName: original.title,
      originalRowData: {
        authorLabel: original.authorLabel,
        status: original.status,
      },
      updated,
      updatedName: updated.title,
      updatedRowData: {
        authorLabel: updated.authorLabel,
        status: updated.status,
      },
      toast: 'Post updated successfully',
    });

    await test.step('verify the edited fields were persisted', async () => {
      expect(apiResult.status).toBe(updated.status);
    });

    await test.step('verify the post was published', async () => {
      await expect(postsPage.row(updated.title).getByTestId('data-publishedAt')).not.toHaveText('—');
    });
  });

  test('deletes an existing post', async ({ postsPage, trackForCleanup, request }) => {
    // No cleanup for the post on purpose — deleting the post via the UI
    // IS the thing under test, so there's nothing left to clean up afterward.
    const role = buildRole();
    const createdRole = await createRoleViaApi(request, role);
    trackForCleanup(rolesApiPath, createdRole.id);

    const author = buildUser({ roleLabel: role.name });
    const createdAuthor = await createUserViaApi(request, {
      name: author.name,
      email: author.email,
      roleId: createdRole.id,
      status: author.status,
    });
    trackForCleanup(usersApiPath, createdAuthor.id);

    const category = buildCategory();
    const createdCategory = await createCategoryViaApi(request, category);
    trackForCleanup(categoriesApiPath, createdCategory.id);

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

    await deleteViaUi(postsPage, {
      entityLabel: 'posts',
      name: post.title,
      rowData: {
        authorLabel: post.authorLabel,
        status: post.status,
      },
      toast: 'Post deleted successfully',
    });
  });
});
