import api from "../api";
import type {
  SystemSpecsResponse,
  RabbitMQHealth,
  RabbitMQOverview,
  RabbitMQQueueGroup,
  RabbitMQPublishRequest,
  RabbitMQShovel,
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
