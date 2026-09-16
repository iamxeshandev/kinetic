import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const RegisterRequest = z
  .object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.union([z.null(), z.string()]),
  })
  .passthrough();
const Response = z.object({ message: z.string() }).passthrough();
const LoginRequest = z
  .object({ email: z.string(), password: z.string(), rememberMe: z.boolean() })
  .passthrough();
const EWorkspaceRole = z.unknown();
const WorkspaceDto = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    role: EWorkspaceRole,
    isPersonal: z.boolean(),
    members: z.union([z.number(), z.string()]),
  })
  .passthrough();
const MeDto = z
  .object({
    id: z.string().uuid(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.union([z.null(), z.string()]),
    avatarUrl: z.union([z.null(), z.string()]),
    currentWorkspace: z.union([z.null(), WorkspaceDto]),
  })
  .passthrough();
const ResponseOfMeDto = z
  .object({ data: MeDto, message: z.string() })
  .partial()
  .passthrough();
const MeRequest = z
  .object({ firstName: z.string(), lastName: z.union([z.null(), z.string()]) })
  .passthrough();
const IFormFile = z.instanceof(File);
const postApiAuthmeavatar_Body = z
  .object({ avatar: IFormFile })
  .partial()
  .passthrough();
const ResponseOfstring = z
  .object({ data: z.union([z.null(), z.string()]), message: z.string() })
  .partial()
  .passthrough();
const EProjectStatus = z.unknown();
const EPriority = z.unknown();
const EProjectRole = z.unknown();
const ProjectMemberDto = z
  .object({
    id: z.string().uuid(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.union([z.null(), z.string()]),
    avatarUrl: z.union([z.null(), z.string()]),
    role: EProjectRole,
  })
  .passthrough();
const ProjectDto = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.union([z.null(), z.string()]),
    status: EProjectStatus,
    priority: EPriority,
    role: EProjectRole,
    isFavorite: z.boolean(),
    dueDate: z.union([z.null(), z.string()]),
    team: z.union([z.null(), z.array(ProjectMemberDto)]),
  })
  .passthrough();
const ResponseOfListOfProjectDto = z
  .object({
    data: z.union([z.null(), z.array(ProjectDto)]),
    message: z.string(),
  })
  .partial()
  .passthrough();
const ProjectRequest = z
  .object({
    name: z.string(),
    description: z.union([z.null(), z.string()]),
    status: EProjectStatus,
    priority: EPriority,
    isFavorite: z.boolean(),
    dueDate: z.union([z.null(), z.string()]),
    leadIds: z.union([z.null(), z.array(z.string().uuid())]),
    memberIds: z.union([z.null(), z.array(z.string().uuid())]),
  })
  .passthrough();
const ResponseOfProjectDto = z
  .object({ data: ProjectDto, message: z.string() })
  .partial()
  .passthrough();
const ResponseOfListOfProjectMemberDto = z
  .object({
    data: z.union([z.null(), z.array(ProjectMemberDto)]),
    message: z.string(),
  })
  .partial()
  .passthrough();
const SectionDto = z
  .object({ id: z.string().uuid(), name: z.string() })
  .passthrough();
const ResponseOfListOfSectionDto = z
  .object({
    data: z.union([z.null(), z.array(SectionDto)]),
    message: z.string(),
  })
  .partial()
  .passthrough();
const SectionRequest = z.object({ name: z.string() }).passthrough();
const ResponseOfSectionDto = z
  .object({ data: SectionDto, message: z.string() })
  .partial()
  .passthrough();
const MoveSectionRequest = z
  .object({
    previousSectionId: z.union([z.null(), z.string()]),
    nextSectionId: z.union([z.null(), z.string()]),
  })
  .passthrough();
const JsonElement = z.unknown();
const SubtaskDto = z
  .object({
    id: z.string().uuid(),
    taskId: z.string().uuid(),
    name: z.string(),
  })
  .passthrough();
const TaskAttachmentDto = z
  .object({
    id: z.string().uuid(),
    fileName: z.string(),
    contentType: z.string(),
    size: z.union([z.number(), z.string()]),
    downloadUrl: z.string(),
  })
  .passthrough();
const TaskDto = z
  .object({
    id: z.string().uuid(),
    sectionId: z.string().uuid(),
    name: z.string(),
    description: z.union([z.null(), JsonElement]),
    priority: EPriority,
    dueDate: z.union([z.null(), z.string()]),
    completedAt: z.union([z.null(), z.string()]),
    assignedAt: z.union([z.null(), z.string()]),
    assignee: z.union([z.null(), ProjectMemberDto]),
    subtasks: z.union([z.null(), z.array(SubtaskDto)]),
    attachments: z.union([z.null(), z.array(TaskAttachmentDto)]),
  })
  .passthrough();
const ResponseOfListOfTaskDto = z
  .object({ data: z.union([z.null(), z.array(TaskDto)]), message: z.string() })
  .partial()
  .passthrough();
const TaskRequest = z
  .object({
    sectionId: z.string().uuid(),
    name: z.string(),
    description: z.union([z.null(), JsonElement]),
    priority: EPriority,
    dueDate: z.union([z.null(), z.string()]),
    assigneeId: z.union([z.null(), z.string()]),
  })
  .passthrough();
const ResponseOfTaskDto = z
  .object({ data: TaskDto, message: z.string() })
  .partial()
  .passthrough();
const MoveTaskRequest = z
  .object({
    sectionId: z.string().uuid(),
    previousTaskId: z.union([z.null(), z.string()]),
    nextTaskId: z.union([z.null(), z.string()]),
  })
  .passthrough();
const ResponseOfListOfTaskAttachmentDto = z
  .object({
    data: z.union([z.null(), z.array(TaskAttachmentDto)]),
    message: z.string(),
  })
  .partial()
  .passthrough();
const postApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdattachments_Body =
  z
    .object({
      ContentType: z.string(),
      ContentDisposition: z.string(),
      Headers: z.record(z.array(z.string())),
      Length: z.union([z.number(), z.string()]),
      Name: z.string(),
      FileName: z.string(),
    })
    .partial()
    .passthrough();
const ResponseOfTaskAttachmentDto = z
  .object({ data: TaskAttachmentDto, message: z.string() })
  .partial()
  .passthrough();
const ResponseOfListOfSubtaskDto = z
  .object({
    data: z.union([z.null(), z.array(SubtaskDto)]),
    message: z.string(),
  })
  .partial()
  .passthrough();
const SubtaskRequest = z.object({ name: z.string() }).passthrough();
const ResponseOfSubtaskDto = z
  .object({ data: SubtaskDto, message: z.string() })
  .partial()
  .passthrough();
const UserDto = z
  .object({
    id: z.string().uuid(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.union([z.null(), z.string()]),
    avatarUrl: z.union([z.null(), z.string()]),
    role: EWorkspaceRole,
    joinedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const ResponseOfListOfUserDto = z
  .object({ data: z.union([z.null(), z.array(UserDto)]), message: z.string() })
  .partial()
  .passthrough();
const UserRequest = z
  .object({
    email: z.string(),
    firstName: z.string(),
    lastName: z.union([z.null(), z.string()]),
    avatarUrl: z.union([z.null(), z.string()]),
    role: EWorkspaceRole,
  })
  .passthrough();
const ResponseOfUserDto = z
  .object({ data: UserDto, message: z.string() })
  .partial()
  .passthrough();
const ResponseOfListOfWorkspaceDto = z
  .object({
    data: z.union([z.null(), z.array(WorkspaceDto)]),
    message: z.string(),
  })
  .partial()
  .passthrough();
const WorkspaceRequest = z.object({ name: z.string() }).passthrough();
const ResponseOfWorkspaceDto = z
  .object({ data: WorkspaceDto, message: z.string() })
  .partial()
  .passthrough();

export const schemas = {
  RegisterRequest,
  Response,
  LoginRequest,
  EWorkspaceRole,
  WorkspaceDto,
  MeDto,
  ResponseOfMeDto,
  MeRequest,
  IFormFile,
  postApiAuthmeavatar_Body,
  ResponseOfstring,
  EProjectStatus,
  EPriority,
  EProjectRole,
  ProjectMemberDto,
  ProjectDto,
  ResponseOfListOfProjectDto,
  ProjectRequest,
  ResponseOfProjectDto,
  ResponseOfListOfProjectMemberDto,
  SectionDto,
  ResponseOfListOfSectionDto,
  SectionRequest,
  ResponseOfSectionDto,
  MoveSectionRequest,
  JsonElement,
  SubtaskDto,
  TaskAttachmentDto,
  TaskDto,
  ResponseOfListOfTaskDto,
  TaskRequest,
  ResponseOfTaskDto,
  MoveTaskRequest,
  ResponseOfListOfTaskAttachmentDto,
  postApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdattachments_Body,
  ResponseOfTaskAttachmentDto,
  ResponseOfListOfSubtaskDto,
  SubtaskRequest,
  ResponseOfSubtaskDto,
  UserDto,
  ResponseOfListOfUserDto,
  UserRequest,
  ResponseOfUserDto,
  ResponseOfListOfWorkspaceDto,
  WorkspaceRequest,
  ResponseOfWorkspaceDto,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/api/Auth/login",
    alias: "postApiAuthlogin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: LoginRequest,
      },
    ],
    response: ResponseOfMeDto,
  },
  {
    method: "post",
    path: "/api/Auth/logout",
    alias: "postApiAuthlogout",
    requestFormat: "json",
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "get",
    path: "/api/Auth/me",
    alias: "getApiAuthme",
    requestFormat: "json",
    response: ResponseOfMeDto,
  },
  {
    method: "post",
    path: "/api/Auth/me",
    alias: "postApiAuthme",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: MeRequest,
      },
    ],
    response: ResponseOfMeDto,
  },
  {
    method: "post",
    path: "/api/Auth/me/avatar",
    alias: "postApiAuthmeavatar",
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApiAuthmeavatar_Body,
      },
    ],
    response: ResponseOfstring,
  },
  {
    method: "post",
    path: "/api/Auth/register",
    alias: "postApiAuthregister",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RegisterRequest,
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "patch",
    path: "/api/Auth/switch/:workspaceId",
    alias: "patchApiAuthswitchWorkspaceId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfMeDto,
  },
  {
    method: "get",
    path: "/api/Workspaces",
    alias: "getApiWorkspaces",
    requestFormat: "json",
    response: ResponseOfListOfWorkspaceDto,
  },
  {
    method: "post",
    path: "/api/Workspaces",
    alias: "postApiWorkspaces",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string() }).passthrough(),
      },
    ],
    response: ResponseOfWorkspaceDto,
  },
  {
    method: "get",
    path: "/api/Workspaces/:workspaceId",
    alias: "getApiWorkspacesWorkspaceId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfWorkspaceDto,
  },
  {
    method: "put",
    path: "/api/Workspaces/:workspaceId",
    alias: "putApiWorkspacesWorkspaceId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string() }).passthrough(),
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfWorkspaceDto,
  },
  {
    method: "delete",
    path: "/api/Workspaces/:workspaceId",
    alias: "deleteApiWorkspacesWorkspaceId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "delete",
    path: "/api/workspaces/:workspaceId/Favorites",
    alias: "deleteApiworkspacesWorkspaceIdFavorites",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "entityId",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "post",
    path: "/api/workspaces/:workspaceId/Favorites/:entityId",
    alias: "postApiworkspacesWorkspaceIdFavoritesEntityId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "entityId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "entityType",
        type: "Query",
        schema: z.unknown(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/Projects",
    alias: "getApiworkspacesWorkspaceIdProjects",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfListOfProjectDto,
  },
  {
    method: "post",
    path: "/api/workspaces/:workspaceId/Projects",
    alias: "postApiworkspacesWorkspaceIdProjects",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ProjectRequest,
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfProjectDto,
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/Projects/:projectId",
    alias: "getApiworkspacesWorkspaceIdProjectsProjectId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfProjectDto,
  },
  {
    method: "put",
    path: "/api/workspaces/:workspaceId/Projects/:projectId",
    alias: "putApiworkspacesWorkspaceIdProjectsProjectId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ProjectRequest,
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfProjectDto,
  },
  {
    method: "delete",
    path: "/api/workspaces/:workspaceId/Projects/:projectId",
    alias: "deleteApiworkspacesWorkspaceIdProjectsProjectId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/Projects/:projectId/members",
    alias: "getApiworkspacesWorkspaceIdProjectsProjectIdmembers",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfListOfProjectMemberDto,
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/projects/:projectId/sections",
    alias: "getApiworkspacesWorkspaceIdprojectsProjectIdsections",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfListOfSectionDto,
  },
  {
    method: "post",
    path: "/api/workspaces/:workspaceId/projects/:projectId/sections",
    alias: "postApiworkspacesWorkspaceIdprojectsProjectIdsections",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string() }).passthrough(),
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfSectionDto,
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/projects/:projectId/sections/:sectionId",
    alias: "getApiworkspacesWorkspaceIdprojectsProjectIdsectionsSectionId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "sectionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfSectionDto,
  },
  {
    method: "put",
    path: "/api/workspaces/:workspaceId/projects/:projectId/sections/:sectionId",
    alias: "putApiworkspacesWorkspaceIdprojectsProjectIdsectionsSectionId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string() }).passthrough(),
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "sectionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfSectionDto,
  },
  {
    method: "delete",
    path: "/api/workspaces/:workspaceId/projects/:projectId/sections/:sectionId",
    alias: "deleteApiworkspacesWorkspaceIdprojectsProjectIdsectionsSectionId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "sectionId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "moveTasksTo",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "deleteTasks",
        type: "Query",
        schema: z.boolean().optional(),
      },
    ],
    response: ResponseOfSectionDto,
  },
  {
    method: "patch",
    path: "/api/workspaces/:workspaceId/projects/:projectId/sections/:sectionId/move",
    alias:
      "patchApiworkspacesWorkspaceIdprojectsProjectIdsectionsSectionIdmove",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: MoveSectionRequest,
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "sectionId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks",
    alias: "getApiworkspacesWorkspaceIdprojectsProjectIdTasks",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfListOfTaskDto,
  },
  {
    method: "post",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks",
    alias: "postApiworkspacesWorkspaceIdprojectsProjectIdTasks",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: TaskRequest,
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfTaskDto,
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId",
    alias: "getApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfTaskDto,
  },
  {
    method: "put",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId",
    alias: "putApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: TaskRequest,
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfTaskDto,
  },
  {
    method: "delete",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId",
    alias: "deleteApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/attachments",
    alias: "getApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdattachments",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfListOfTaskAttachmentDto,
  },
  {
    method: "post",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/attachments",
    alias:
      "postApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdattachments",
    requestFormat: "form-url",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema:
          postApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdattachments_Body,
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfTaskAttachmentDto,
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/attachments/:attachmentId",
    alias:
      "getApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdattachmentsAttachmentId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "attachmentId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfTaskAttachmentDto,
  },
  {
    method: "delete",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/attachments/:attachmentId",
    alias:
      "deleteApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdattachmentsAttachmentId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "attachmentId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/attachments/:attachmentId/download",
    alias:
      "getApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdattachmentsAttachmentIddownload",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "attachmentId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
  },
  {
    method: "patch",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/move",
    alias: "patchApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdmove",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: MoveTaskRequest,
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/subtasks",
    alias: "getApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdsubtasks",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfListOfSubtaskDto,
  },
  {
    method: "post",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/subtasks",
    alias: "postApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdsubtasks",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string() }).passthrough(),
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfSubtaskDto,
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/subtasks/:subtaskId",
    alias:
      "getApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdsubtasksSubtaskId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "subtaskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfSubtaskDto,
  },
  {
    method: "put",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/subtasks/:subtaskId",
    alias:
      "putApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdsubtasksSubtaskId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string() }).passthrough(),
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "subtaskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfSubtaskDto,
  },
  {
    method: "delete",
    path: "/api/workspaces/:workspaceId/projects/:projectId/Tasks/:taskId/subtasks/:subtaskId",
    alias:
      "deleteApiworkspacesWorkspaceIdprojectsProjectIdTasksTaskIdsubtasksSubtaskId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "taskId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "subtaskId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/Users",
    alias: "getApiworkspacesWorkspaceIdUsers",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfListOfUserDto,
  },
  {
    method: "post",
    path: "/api/workspaces/:workspaceId/Users",
    alias: "postApiworkspacesWorkspaceIdUsers",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserRequest,
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfUserDto,
  },
  {
    method: "get",
    path: "/api/workspaces/:workspaceId/Users/:userId",
    alias: "getApiworkspacesWorkspaceIdUsersUserId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfUserDto,
  },
  {
    method: "put",
    path: "/api/workspaces/:workspaceId/Users/:userId",
    alias: "putApiworkspacesWorkspaceIdUsersUserId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserRequest,
      },
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: ResponseOfUserDto,
  },
  {
    method: "delete",
    path: "/api/workspaces/:workspaceId/Users/:userId",
    alias: "deleteApiworkspacesWorkspaceIdUsersUserId",
    requestFormat: "json",
    parameters: [
      {
        name: "workspaceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
