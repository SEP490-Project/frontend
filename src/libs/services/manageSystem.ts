import api from "../api";
import type {
  SystemSpecsResponse,
  RabbitMQHealth,
  RabbitMQOverview,
  RabbitMQQueueGroup,
  RabbitMQPublishRequest,
  RabbitMQShovel,
  AsynqOverview,
  AsynQTaskQueries,
  AsynqTaskResponse,
  AsynqQueue,
  ActionAsynqQueueRequest,
  AsynqQTaskDetail,
  AsynqDeleteTaskRequest,
  AsynqAchieveTaskRequest,
  CacheResponse,
  CacheOverview,
  JobResponse,
} from "../types/system";

export const getSystemSpecs = async (): Promise<SystemSpecsResponse> => {
  const response = await api.get<{ data: SystemSpecsResponse }>("admin/system/specs");
  return response.data.data;
};

// RabbitMQ
export const getRabbitHealth = async (): Promise<RabbitMQHealth> => {
  const response = await api.get<{ data: RabbitMQHealth }>("admin/rabbitmq/health");
  return response.data.data;
};

export const getRabbitOverview = async (): Promise<RabbitMQOverview> => {
  const response = await api.get<{ data: RabbitMQOverview }>("admin/rabbitmq/overview");
  return response.data.data;
};

export const getRabbitQueueGroups = async (): Promise<RabbitMQQueueGroup[]> => {
  const response = await api.get<{ data: RabbitMQQueueGroup[] }>("admin/rabbitmq/queues/grouped");
  return response.data.data;
};

export const retryDLQ = async (sourceQueue: string): Promise<void> => {
  await api.post("admin/rabbitmq/dlq/retry", { source_queue: sourceQueue });
};

export const purgeQueue = async (queueName: string): Promise<void> => {
  await api.delete(`admin/rabbitmq/queues/${queueName}/purge`);
};

// --- Shovel Management ---
export const getRabbitShovels = async (): Promise<RabbitMQShovel[]> => {
  const response = await api.get<{ data: RabbitMQShovel[] }>("admin/rabbitmq/shovels");
  return response.data.data;
};

export const deleteShovel = async (shovelName: string): Promise<void> => {
  await api.delete(`admin/rabbitmq/shovels/${shovelName}`);
};

// --- Message Publishing ---
export const publishMessage = async (data: RabbitMQPublishRequest): Promise<void> => {
  await api.post("admin/rabbitmq/publish", data);
};

// --- AsynQ Management ---
export const getAsynqOverview = async (): Promise<AsynqOverview> => {
  const response = await api.get<{ data: AsynqOverview }>("admin/asynq/overview");
  return response.data.data;
};

// Asynq Queues
export const getAsynqQueues = async (queueName: string): Promise<AsynqQueue> => {
  const response = await api.get<{ data: AsynqQueue }>("admin/asynq/queues/stats", {
    params: { queue: queueName },
  });
  return response.data.data;
};

export const pauseAsynqQueue = async (body: ActionAsynqQueueRequest): Promise<void> => {
  await api.patch("admin/asynq/queues/pause", body);
};

export const unPauseAsynqQueue = async (body: ActionAsynqQueueRequest): Promise<void> => {
  await api.patch("admin/asynq/queues/unpause", body);
};

// Asynq Tasks
export const listAsynqTasks = async (queries: AsynQTaskQueries): Promise<AsynqTaskResponse> => {
  const response = await api.get<{ data: AsynqTaskResponse }>("admin/asynq/tasks", {
    params: queries,
  });
  return response.data.data;
};

export const getAsynqTaskDetail = async (queries: {
  queue: string;
  task_id: string;
}): Promise<AsynqQTaskDetail> => {
  const response = await api.get<{ data: AsynqQTaskDetail }>("admin/asynq/tasks/details", {
    params: queries,
  });
  return response.data.data;
};

export const deleteAsynqTask = async (body: AsynqDeleteTaskRequest): Promise<void> => {
  await api.delete("admin/asynq/tasks", { data: body });
};

export const achieveAsynqTask = async (body: AsynqAchieveTaskRequest): Promise<void> => {
  await api.post("admin/asynq/tasks/achieve", body);
};

export const runAsynqTaskImmediately = async (body: AsynqAchieveTaskRequest): Promise<void> => {
  await api.post("admin/asynq/tasks/run", body);
};

//--- Cache Management ---
export const getCacheOverview = async (): Promise<CacheOverview> => {
  const response = await api.get<{ data: CacheOverview }>("admin/cache/overview");
  return response.data.data;
};

// guide: * for all, prefix:* for prefix match
export const listCacheKeys = async (pattern: string): Promise<CacheResponse> => {
  const response = await api.get<{ data: CacheResponse }>("admin/cache/keys", {
    params: { pattern },
  });
  return response.data.data;
};

export const flushAllKey = async (): Promise<void> => {
  await api.delete("admin/cache/keys/flush", { data: { confirm: true } });
};

export const deleteCacheKey = async (keys: string[]): Promise<void> => {
  await api.delete("admin/cache/keys", { data: { keys: keys } });
};

export const getCacheValue = async (key: string): Promise<{ key: string; value: string }> => {
  const response = await api.get<{ data: { key: string; value: string } }>(
    `admin/cache/keys/${key}`,
  );
  return response.data.data;
};

export const setCacheValue = async (key: string, value: string, ttl: number): Promise<void> => {
  await api.post("admin/cache/keys", { key, value, ttl });
};

//--- Job Management ---
export const getAllRegisteredJobs = async (): Promise<JobResponse> => {
  const response = await api.get<{ data: JobResponse }>("jobs");
  return response.data.data;
};

export const triggerJobByName = async (jobName: string): Promise<void> => {
  await api.post(`jobs/trigger/${jobName}`);
};

export const triggerAllJob = async (): Promise<void> => {
  await api.post("jobs/trigger-all");
};
