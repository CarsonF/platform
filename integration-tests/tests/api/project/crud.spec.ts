import { ProjectType } from 'testkit/gql/graphql';
import { updateProjectSlug } from '../../../testkit/flow';
import { initSeed } from '../../../testkit/seed';

test.concurrent(
  'creating a project should result in creating the development, staging and production targets',
  async ({ expect }) => {
    const { createOrg } = await initSeed().createOwner();
    const { createProject } = await createOrg();
    const { targets } = await createProject(ProjectType.Single);

    expect(targets).toHaveLength(3);
    expect(targets).toContainEqual(
      expect.objectContaining({
        cleanId: 'development',
        name: 'development',
      }),
    );
    expect(targets).toContainEqual(
      expect.objectContaining({
        cleanId: 'staging',
        name: 'staging',
      }),
    );
    expect(targets).toContainEqual(
      expect.objectContaining({
        cleanId: 'production',
        name: 'production',
      }),
    );
  },
);

test.concurrent(`changing a project's slug should result changing its name`, async ({ expect }) => {
  const { createOrg, ownerToken } = await initSeed().createOwner();
  const { createProject, organization } = await createOrg();
  const { project } = await createProject(ProjectType.Single);

  const renameResult = await updateProjectSlug(
    {
      organization: organization.cleanId,
      project: project.cleanId,
      slug: 'bar',
    },
    ownerToken,
  ).then(r => r.expectNoGraphQLErrors());

  expect(renameResult.updateProjectSlug.error).toBeNull();
  expect(renameResult.updateProjectSlug.ok?.project.name).toBe('bar');
  expect(renameResult.updateProjectSlug.ok?.project.cleanId).toBe('bar');
  expect(renameResult.updateProjectSlug.ok?.selector.project).toBe('bar');
});

test.concurrent(
  `changing a project's slug to the same value should keep the same slug`,
  async ({ expect }) => {
    const { createOrg, ownerToken } = await initSeed().createOwner();
    const { createProject, organization } = await createOrg();
    const { project } = await createProject(ProjectType.Single);

    const renameResult = await updateProjectSlug(
      {
        organization: organization.cleanId,
        project: project.cleanId,
        slug: project.cleanId,
      },
      ownerToken,
    ).then(r => r.expectNoGraphQLErrors());

    expect(renameResult.updateProjectSlug.error).toBeNull();
    expect(renameResult.updateProjectSlug.ok?.project.name).toBe(project.cleanId);
    expect(renameResult.updateProjectSlug.ok?.project.cleanId).toBe(project.cleanId);
    expect(renameResult.updateProjectSlug.ok?.selector.project).toBe(project.cleanId);
  },
);

test.concurrent(
  `changing a project's slug to a taken value should result in an error`,
  async ({ expect }) => {
    const { createOrg, ownerToken } = await initSeed().createOwner();
    const { createProject, organization, projects } = await createOrg();
    const { project } = await createProject(ProjectType.Single);
    const { project: project2 } = await createProject(ProjectType.Single);

    const renameResult = await updateProjectSlug(
      {
        organization: organization.cleanId,
        project: project.cleanId,
        slug: project2.cleanId,
      },
      ownerToken,
    ).then(r => r.expectNoGraphQLErrors());

    expect(renameResult.updateProjectSlug.ok).toBeNull();
    expect(renameResult.updateProjectSlug.error?.message).toBe('Project slug is already taken');

    // Ensure the project slug was not changed
    await expect(projects()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: project.id,
          cleanId: project.cleanId,
          name: project.cleanId,
        }),
        expect.objectContaining({
          id: project2.id,
          cleanId: project2.cleanId,
          name: project2.cleanId,
        }),
      ]),
    );
  },
);

test.concurrent(
  `changing a project's slug to a slug taken by another organization should be possible`,
  async ({ expect }) => {
    const { createOrg, ownerToken } = await initSeed().createOwner();
    const { createProject, organization, projects } = await createOrg();
    const { createProject: createProject2, organization: organization2 } = await createOrg();
    const { project } = await createProject(ProjectType.Single);
    const { project: project2 } = await createProject2(ProjectType.Single);

    const renameResult = await updateProjectSlug(
      {
        organization: organization.cleanId,
        project: project.cleanId,
        slug: project2.cleanId,
      },
      ownerToken,
    ).then(r => r.expectNoGraphQLErrors());

    expect(renameResult.updateProjectSlug.error).toBeNull();
    expect(renameResult.updateProjectSlug.ok?.project.name).toBe(project2.cleanId);
    expect(renameResult.updateProjectSlug.ok?.project.cleanId).toBe(project2.cleanId);
    expect(renameResult.updateProjectSlug.ok?.selector.project).toBe(project2.cleanId);
  },
);

test.concurrent(
  `changing a project's slug to "view" should result in an error`,
  async ({ expect }) => {
    const { createOrg, ownerToken } = await initSeed().createOwner();
    const { createProject, organization } = await createOrg();
    const { project } = await createProject(ProjectType.Single);

    const renameResult = await updateProjectSlug(
      {
        organization: organization.cleanId,
        project: project.cleanId,
        slug: 'view',
      },
      ownerToken,
    ).then(r => r.expectNoGraphQLErrors());

    expect(renameResult.updateProjectSlug.ok).toBeNull();
    expect(renameResult.updateProjectSlug.error?.message).toBeDefined();
  },
);

test.concurrent(
  `changing a project's slug to "new" should result in an error`,
  async ({ expect }) => {
    const { createOrg, ownerToken } = await initSeed().createOwner();
    const { createProject, organization } = await createOrg();
    const { project } = await createProject(ProjectType.Single);

    const renameResult = await updateProjectSlug(
      {
        organization: organization.cleanId,
        project: project.cleanId,
        slug: 'new',
      },
      ownerToken,
    ).then(r => r.expectNoGraphQLErrors());

    expect(renameResult.updateProjectSlug.ok).toBeNull();
    expect(renameResult.updateProjectSlug.error?.message).toBeDefined();
  },
);

test.concurrent(
  `changing a project's slug to "new" should result in an error`,
  async ({ expect }) => {
    const { createOrg, ownerToken } = await initSeed().createOwner();
    const { createProject, organization } = await createOrg();
    const { project } = await createProject(ProjectType.Single);

    const renameResult = await updateProjectSlug(
      {
        organization: organization.cleanId,
        project: project.cleanId,
        slug: 'new',
      },
      ownerToken,
    ).then(r => r.expectNoGraphQLErrors());

    expect(renameResult.updateProjectSlug.ok).toBeNull();
    expect(renameResult.updateProjectSlug.error?.message).toBeDefined();
  },
);
