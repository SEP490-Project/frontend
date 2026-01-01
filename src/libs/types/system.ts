export interface MemoryStats {
  alloc: string;
  total_alloc: string;
  sys: string;
  num_gc: number;
  pause_total_ns: string;
}

export interface BuildInfo {
  version: string;
  commit: string;
  build_time: string;
}

export interface NetworkInfo {
  host_name: string;
  ips: string[];
}

export interface KubernetesInfo {
  pod_name: string;
  node_name: string;
  namespace: string;
  pod_ip: string;
}

export interface DiskInfo {
  total: string;
  free: string;
  used: string;
}

export interface SystemSpecsResponse {
  os: string;
  arch: string;
  gomaxprocs?: number;
  num_cpu: number;
  go_version: string;
  goroutines: number;
  memory: MemoryStats;
  uptime: string;
  environment: string;
  build_info: BuildInfo;
  network: NetworkInfo;
  kubernetes: KubernetesInfo;
  disk: DiskInfo;
}

// RabbitMQ Types
export interface RabbitMQHealth {
  connected: boolean;
  management_api: boolean;
  cluster_name?: string;
  rabbitmq_version?: string;
  erlang_version?: string;
  node_name?: string;
}

export interface RabbitMQOverview {
  total_queues: number;
  total_exchanges: number;
  total_messages: number;
  total_messages_ready: number;
  total_messages_unacked: number;
  connection_status: string;
  queue_summary: {
    main_queues: number;
    retry_queues: number;
    dead_letter_queues: number;
    delayed_queues: number;
    total_dlq_messages: number;
  };
}

export interface RabbitMQQueue {
  name: string;
  type: string;
  messages: number;
  messages_ready: number;
  messages_unacknowledged: number;
  consumers: number;
  state: string;
}

export interface RabbitMQQueueGroup {
  main_queue: RabbitMQQueue;
  retry_queue?: RabbitMQQueue;
  dlq?: RabbitMQQueue;
  total_messages: number;
}

export interface RabbitMQShovel {
  name: string;
  vhost: string;
  type: string;
  state: string;
  timestamp?: string;
}

export interface RabbitMQPublishRequest {
  exchange: string;
  routing_key: string;
  payload: string;
  content_type?: string;
}

// AsynQ Types
export interface AsynqOverview {
  status: string;
  total_queues: number;
  total_active: number;
  total_pending: number;
  total_scheduled: number;
  total_retry: number;
  total_archived: number;
  total_completed: number;
  total_processed: number;
  queues: AsynqQueue[];
}

export interface AsynqQueue {
  name: string;
  size: number;
  active: number;
  pending: number;
  scheduled: number;
  retry: number;
  archived: number;
  completed: number;
  processed: number;
  paused: boolean;
  timestamp: string;
}

export interface ActionAsynqQueueRequest {
  queue: "default" | "critical" | "low";
}

export interface AsynQTaskQueries {
  queue: "default" | "critical" | "low";
  state: "scheduled" | "pending" | "active" | "retry" | "archived";
  limit?: number; //default 20
  page?: number; // default 1
}

export interface AsynqTaskResponse {
  tasks: {
    id: string;
    type: string;
    queue: string;
    state: string;
    max_retry: number;
    retried: number;
    next_process_at: string;
    timeout: number;
    deadline: string;
    completed_at: string;
  }[];
}

export interface AsynqQTaskDetail {
  id: string;
  type: string;
  queue: string;
  state: string;
  max_retry: number;
  retried: number;
  next_process_at: string;
  timeout: number;
  deadline: string;
  completed_at: string;
  payload: Record<string, any>;
}

export interface AsynqDeleteTaskRequest {
  queue: "default" | "critical" | "low";
  state: "scheduled" | "pending" | "active" | "retry" | "archived";
  task_id: string;
}

export interface AsynqAchieveTaskRequest {
  queue: "default" | "critical" | "low";
  task_id: string;
}

// Cache types
export interface CacheOverview {
  status: string;
  version: string;
  uptime: string;
  connected_clients: string;
  used_memory: string;
  used_memory_peak: string;
  total_keys: number;
  total_connections_received: string;
  total_commands_processed: string;
  keyspace_hits: string;
  keyspace_misses: string;
  hit_rate: string;
  evicted_keys: string;
  expired_keys: string;
}

export interface CacheResponse {
  keys: CacheKey[];
  total_count: number;
  pattern: string;
}

export interface CacheKey {
  key: string;
  type: string;
  ttl: number;
}

// Job Type
export type JobResponse = Record<string, JobStatus>;
interface JobStatus {
  enabled: boolean;
  last_run: string; // or Date if you parse it
  name: string;
}
