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
