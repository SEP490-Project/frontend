import { useEffect, useState, useCallback, useRef } from "react";
import {
  getSystemSpecs,
  getRabbitHealth,
  getRabbitOverview,
  getRabbitQueueGroups,
  retryDLQ,
  purgeQueue,
  deleteShovel,
  getRabbitShovels,
  publishMessage,
  getAsynqOverview,
  listAsynqTasks,
  getAsynqTaskDetail,
  pauseAsynqQueue,
  unPauseAsynqQueue,
  deleteAsynqTask,
  achieveAsynqTask,
  runAsynqTaskImmediately,
  getCacheOverview,
  listCacheKeys,
  flushAllKey,
  deleteCacheKey,
  getCacheValue,
  setCacheValue,
  getAllRegisteredJobs,
  triggerJobByName,
  triggerAllJob,
} from "../../../libs/services/manageSystem";
import type {
  SystemSpecsResponse,
  RabbitMQHealth,
  RabbitMQOverview,
  RabbitMQQueueGroup,
  RabbitMQShovel,
  AsynqOverview,
  AsynqTaskResponse,
  AsynqQTaskDetail,
  CacheOverview,
  CacheResponse,
  JobResponse,
} from "../../../libs/types/system";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
  Server,
  Cpu,
  Activity,
  Box,
  RotateCw,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Database,
  MessageSquare,
  Layers,
  Network,
  Play,
  RefreshCw,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
// import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@radix-ui/react-select";
import { Label } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SystemDashboard = () => {
  const [activeTab, setActiveTab] = useState("system");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Infrastructure Monitor</h1>
        <p className="text-muted-foreground">
          Live system resources and message broker management.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="system">System Resources</TabsTrigger>
          <TabsTrigger value="rabbitmq">RabbitMQ Manager</TabsTrigger>
          <TabsTrigger value="asynq">AsynQ Manager</TabsTrigger>
          <TabsTrigger value="cache">Cache Manager</TabsTrigger>
          <TabsTrigger value="job">Job Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <SystemSpecsTab />
        </TabsContent>

        <TabsContent value="rabbitmq">
          <RabbitMQTab />
        </TabsContent>

        <TabsContent value="asynq">
          <AsynQTab />
        </TabsContent>

        <TabsContent value="cache">
          <CacheTab />
        </TabsContent>

        <TabsContent value="job">
          <JobTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ==========================================
// 1. SYSTEM SPECS TAB (Consolidated)
// ==========================================
const SystemSpecsTab = () => {
  const [specs, setSpecs] = useState<SystemSpecsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemSpecs()
      .then(setSpecs)
      .catch(() => toast.error("Failed to load system specs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!specs) return <div>Data unavailable</div>;

  const k8s = specs.kubernetes;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Host Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Server className="h-4 w-4" /> Runtime Environment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {specs.os}{" "}
            <span className="text-sm font-normal text-muted-foreground">({specs.arch})</span>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Go Version" value={specs.go_version} />
            <Row label="Goroutines" value={specs.goroutines} />
            <Row label="Uptime" value={specs.uptime} />
            <Row label="Build Ver" value={specs.build_info.version} />
          </div>
        </CardContent>
      </Card>

      {/* CPU & Memory */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Cpu className="h-4 w-4" /> Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {specs.num_cpu} <span className="text-sm font-normal text-muted-foreground">Cores</span>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="GOMAXPROCS" value={specs.gomaxprocs} />
            <Row label="Mem Alloc" value={specs.memory.alloc} />
            <Row label="Sys Mem" value={specs.memory.sys} />
            <Row label="GC Pause" value={specs.memory.pause_total_ns} />
          </div>
        </CardContent>
      </Card>

      {/* Disk Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4" /> Storage (Root)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{specs.disk?.total || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Used</p>
                <p className="text-lg font-bold text-yellow-600">{specs.disk?.used || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Free</p>
                <p className="text-lg font-bold text-green-600">{specs.disk?.free || "N/A"}</p>
              </div>
            </div>
            {specs.disk?.total !== "N/A" && (
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full"
                  style={{
                    width: `${(parseFloat(specs.disk.used) / parseFloat(specs.disk.total)) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Kubernetes Identity */}
      <Card className="md:col-span-2 lg:col-span-3 bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Box className="h-4 w-4" /> Kubernetes Identity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <Row label="Pod Name" value={k8s?.pod_name || "N/A"} />
              <Row label="Namespace" value={k8s?.namespace || "N/A"} />
            </div>
            <div className="space-y-2">
              <Row label="Node Name" value={k8s?.node_name || "N/A"} />
              <Row label="Pod IP" value={k8s?.pod_ip || "N/A"} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==========================================
// 2. RABBITMQ MANAGEMENT TAB
// ==========================================
const RabbitMQTab = () => {
  const [health, setHealth] = useState<RabbitMQHealth | null>(null);
  const [overview, setOverview] = useState<RabbitMQOverview | null>(null);
  const [groups, setGroups] = useState<RabbitMQQueueGroup[]>([]);
  const [shovels, setShovels] = useState<RabbitMQShovel[]>([]);
  const [loading, setLoading] = useState(true);

  // Refresh Control State
  const [refreshInterval, setRefreshInterval] = useState<string>("15000");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [h, o, g, s] = await Promise.all([
        getRabbitHealth(),
        getRabbitOverview(),
        getRabbitQueueGroups(),
        getRabbitShovels(),
      ]);
      setHealth(h);
      setOverview(o);
      setGroups(g);
      setShovels(s);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch RabbitMQ data");
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  // Handle Auto-Refresh Logic
  useEffect(() => {
    fetchData();

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (refreshInterval !== "0") {
      intervalRef.current = setInterval(fetchData, parseInt(refreshInterval));
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, refreshInterval]);

  // Actions
  const handleRetryDLQ = async (queue: string) => {
    try {
      await retryDLQ(queue);
      toast.success(`Retry shovel initiated for ${queue}`);
      fetchData(); // Immediate refresh to see the shovel
    } catch {
      toast.error("Failed to retry DLQ");
    }
  };

  const handlePurge = async (queue: string) => {
    if (!confirm(`Are you sure you want to purge ${queue}?`)) return;
    try {
      await purgeQueue(queue);
      toast.success(`${queue} purged`);
      fetchData();
    } catch {
      toast.error("Failed to purge queue");
    }
  };

  const handleDeleteShovel = async (name: string) => {
    try {
      await deleteShovel(name);
      toast.success("Shovel deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete shovel");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* TOOLBAR: Health & Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-card border rounded-lg shadow-sm">
        {/* Connection Status */}
        <div className="flex items-center gap-4">
          {health?.connected ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle2 className="h-5 w-5" />
              <div className="flex flex-col">
                <span className="leading-none">Connected</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {health.cluster_name} (v{health.rabbitmq_version})
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-500 font-medium">
              <AlertTriangle className="h-5 w-5" /> Disconnected
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <PublishMessageDialog onPublish={fetchData} />

          <div className="h-6 w-px bg-border mx-1 hidden md:block" />

          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No Refresh</SelectItem>
              <SelectItem value="10000">10s</SelectItem>
              <SelectItem value="15000">15s</SelectItem>
              <SelectItem value="30000">30s</SelectItem>
              <SelectItem value="60000">60s</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchData()}
            disabled={isRefreshing}
            title="Refresh Now"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Queues"
          value={overview?.total_queues || 0}
          icon={<Layers className="h-4 w-4" />}
        />
        <StatCard
          title="Total Messages"
          value={overview?.total_messages || 0}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <StatCard
          title="Ready"
          value={overview?.total_messages_ready || 0}
          sub="Messages ready to process"
        />
        <StatCard
          title="DLQ Messages"
          value={overview?.queue_summary.total_dlq_messages || 0}
          sub="Messages in Dead Letter"
          highlight
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COL: Queue Topology */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Queue Topology</CardTitle>
              <CardDescription>Grouped by functional domain (Main + Retry + DLQ)</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full pr-4">
                <div className="space-y-4">
                  {groups?.map((group) => (
                    <div key={group.main_queue.name} className="border rounded-lg p-4 bg-card/50">
                      <div className="flex justify-between items-center mb-4">
                        <div className="overflow-hidden">
                          <h3
                            className="font-semibold text-lg truncate"
                            title={group.main_queue.name}
                          >
                            {group.main_queue.name}
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{group.main_queue.consumers} consumers</Badge>
                            <Badge
                              variant={
                                group.main_queue.state === "running" ? "secondary" : "destructive"
                              }
                            >
                              {group.main_queue.state}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right pl-4">
                          <div className="text-2xl font-bold">{group.total_messages}</div>
                          <div className="text-xs text-muted-foreground">Total msgs</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <QueueStatusBox
                          label="Main"
                          count={group.main_queue.messages}
                          color="bg-primary/10"
                          onPurge={() => handlePurge(group.main_queue.name)}
                        />

                        {group.retry_queue ? (
                          <QueueStatusBox
                            label="Retry"
                            count={group.retry_queue.messages}
                            color="bg-yellow-500/10"
                            onPurge={() => handlePurge(group.retry_queue!.name)}
                          />
                        ) : (
                          <EmptyBox label="No Retry" />
                        )}

                        {group.dlq ? (
                          <div
                            className={`p-3 rounded border flex flex-col justify-between ${group.dlq.messages > 0 ? "bg-red-500/10 border-red-200" : "bg-muted/30"}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">DLQ</span>
                              <span className="font-mono font-bold">{group.dlq.messages}</span>
                            </div>
                            {group.dlq.messages > 0 && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full mt-2"
                                onClick={() => handleRetryDLQ(group.dlq!.name)}
                              >
                                <RotateCw className="mr-2 h-3 w-3" /> Retry All
                              </Button>
                            )}
                          </div>
                        ) : (
                          <EmptyBox label="No DLQ" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COL: Shovels & Utils */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-4 w-4" /> Active Shovels
              </CardTitle>
              <CardDescription>Dynamic movers (Retries)</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full pr-2">
                {(shovels?.length || 0) === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No active shovels running.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shovels?.map((shovel) => (
                      <div
                        key={shovel.name}
                        className="flex items-center justify-between p-3 border rounded-md bg-muted/20"
                      >
                        <div className="overflow-hidden">
                          <div className="font-medium text-sm truncate" title={shovel.name}>
                            {shovel.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 capitalize">
                            {shovel.state}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDeleteShovel(shovel.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. AsynQ MANAGEMENT TAB
// ==========================================
const AsynQTab = () => {
  const [overview, setOverview] = useState<AsynqOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState<string>("default");
  const [selectedState, setSelectedState] = useState<
    "scheduled" | "pending" | "active" | "retry" | "archived"
  >("pending");
  const [tasks, setTasks] = useState<AsynqTaskResponse["tasks"]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AsynqQTaskDetail | null>(null);
  const [taskDetailLoading, setTaskDetailLoading] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      const data = await getAsynqOverview();
      setOverview(data);
    } catch {
      toast.error("Failed to fetch AsynQ overview");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setTasksLoading(true);
    try {
      const data = await listAsynqTasks({
        queue: selectedQueue as "default" | "critical" | "low",
        state: selectedState,
        limit: 20,
        page: 1,
      });
      // Extract tasks array from response
      setTasks(data?.tasks || []);
    } catch {
      toast.error("Failed to fetch tasks");
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  }, [selectedQueue, selectedState]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    if (selectedQueue && selectedState) {
      fetchTasks();
    }
  }, [selectedQueue, selectedState, fetchTasks]);

  const handlePauseQueue = async (queueName: string, isPaused: boolean) => {
    try {
      if (isPaused) {
        await unPauseAsynqQueue({ queue: queueName as "default" | "critical" | "low" });
        toast.success(`Queue "${queueName}" resumed`);
      } else {
        await pauseAsynqQueue({ queue: queueName as "default" | "critical" | "low" });
        toast.success(`Queue "${queueName}" paused`);
      }
      fetchOverview();
    } catch {
      toast.error("Failed to update queue status");
    }
  };

  const handleViewTaskDetail = async (taskId: string) => {
    setTaskDetailLoading(true);
    try {
      const data = await getAsynqTaskDetail({ queue: selectedQueue, task_id: taskId });
      setSelectedTask(data);
    } catch {
      toast.error("Failed to fetch task details");
    } finally {
      setTaskDetailLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteAsynqTask({
        queue: selectedQueue as "default" | "critical" | "low",
        state: selectedState,
        task_id: taskId,
      });
      toast.success("Task deleted successfully");
      fetchTasks();
      setSelectedTask(null);
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleArchiveTask = async (taskId: string) => {
    try {
      await achieveAsynqTask({
        queue: selectedQueue as "default" | "critical" | "low",
        task_id: taskId,
      });
      toast.success("Task archived successfully");
      fetchTasks();
      setSelectedTask(null);
    } catch {
      toast.error("Failed to archive task");
    }
  };

  const handleRunTask = async (taskId: string) => {
    try {
      await runAsynqTaskImmediately({
        queue: selectedQueue as "default" | "critical" | "low",
        task_id: taskId,
      });
      toast.success("Task scheduled to run immediately");
      fetchTasks();
    } catch {
      toast.error("Failed to run task");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RotateCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stateColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    retry: "bg-orange-100 text-orange-800",
    archived: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">AsynQ Overview</h2>
        <Button variant="outline" size="sm" onClick={fetchOverview} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {overview && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{overview.total_queues}</p>
                <p className="text-xs text-muted-foreground">Queues</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{overview.total_active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{overview.total_pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{overview.total_scheduled}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{overview.total_retry}</p>
                <p className="text-xs text-muted-foreground">Retry</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{overview.total_archived}</p>
                <p className="text-xs text-muted-foreground">Archived</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{overview.total_processed}</p>
                <p className="text-xs text-muted-foreground">Processed</p>
              </CardContent>
            </Card>
          </div>

          {/* Queues Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" /> Queues
              </CardTitle>
              <CardDescription>Manage your AsynQ queues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Queue</th>
                      <th className="text-center p-3 font-medium">Size</th>
                      <th className="text-center p-3 font-medium">Active</th>
                      <th className="text-center p-3 font-medium">Pending</th>
                      <th className="text-center p-3 font-medium">Scheduled</th>
                      <th className="text-center p-3 font-medium">Retry</th>
                      <th className="text-center p-3 font-medium">Archived</th>
                      <th className="text-center p-3 font-medium">Status</th>
                      <th className="text-center p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.queues?.map((queue) => (
                      <tr key={queue.name} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-mono font-medium">{queue.name}</td>
                        <td className="text-center p-3">{queue.size}</td>
                        <td className="text-center p-3 text-green-600">{queue.active}</td>
                        <td className="text-center p-3 text-yellow-600">{queue.pending}</td>
                        <td className="text-center p-3 text-blue-600">{queue.scheduled}</td>
                        <td className="text-center p-3 text-orange-600">{queue.retry}</td>
                        <td className="text-center p-3 text-gray-600">{queue.archived}</td>
                        <td className="text-center p-3">
                          <Badge variant={queue.paused ? "destructive" : "default"}>
                            {queue.paused ? "Paused" : "Running"}
                          </Badge>
                        </td>
                        <td className="text-center p-3">
                          <Button
                            variant={queue.paused ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePauseQueue(queue.name, queue.paused)}
                          >
                            {queue.paused ? (
                              <>
                                <Play className="h-3 w-3 mr-1" /> Resume
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" /> Pause
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" /> Tasks
              </CardTitle>
              <CardDescription>Browse and manage tasks by queue and state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Queue:</span>
                  <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {overview.queues?.map((q) => (
                        <SelectItem key={q.name} value={q.name}>
                          {q.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">State:</span>
                  <Select
                    value={selectedState}
                    onValueChange={(v) => setSelectedState(v as typeof selectedState)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="retry">Retry</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm" onClick={fetchTasks} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
              </div>

              {/* Tasks Table */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Task List */}
                <div className="border rounded-lg">
                  <ScrollArea className="h-80">
                    {tasksLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <RotateCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : tasks.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No tasks found
                      </div>
                    ) : (
                      <div className="divide-y">
                        {tasks?.map((task) => (
                          <div
                            key={task.id}
                            className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedTask?.id === task.id ? "bg-muted" : ""
                            }`}
                            onClick={() => handleViewTaskDetail(task.id)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs truncate max-w-[150px]">
                                {task.id}
                              </span>
                              <Badge className={stateColors[task.state] || "bg-gray-100"}>
                                {task.state}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium mt-1">{task.type}</p>
                            <p className="text-xs text-muted-foreground">
                              Retried: {task.retried}/{task.max_retry}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Task Detail */}
                <div className="border rounded-lg p-4">
                  {taskDetailLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <RotateCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : selectedTask ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Task Details</h4>
                        <Badge className={stateColors[selectedTask.state] || "bg-gray-100"}>
                          {selectedTask.state}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-muted-foreground">ID:</span>
                          <span className="col-span-2 font-mono text-xs break-all">
                            {selectedTask.id}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="col-span-2 font-medium">{selectedTask.type}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-muted-foreground">Queue:</span>
                          <span className="col-span-2">{selectedTask.queue}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-muted-foreground">Retry:</span>
                          <span className="col-span-2">
                            {selectedTask.retried} / {selectedTask.max_retry}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-muted-foreground">Next Process:</span>
                          <span className="col-span-2 text-xs">
                            {selectedTask.next_process_at
                              ? new Date(selectedTask.next_process_at).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-muted-foreground">Deadline:</span>
                          <span className="col-span-2 text-xs">
                            {selectedTask.deadline
                              ? new Date(selectedTask.deadline).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                      </div>

                      {/* Payload */}
                      <div>
                        <span className="text-sm text-muted-foreground">Payload:</span>
                        <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(selectedTask.payload, null, 2)}
                        </pre>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleRunTask(selectedTask.id)}
                          className="gap-1"
                        >
                          <Play className="h-3 w-3" /> Run Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchiveTask(selectedTask.id)}
                          className="gap-1"
                        >
                          <Box className="h-3 w-3" /> Archive
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTask(selectedTask.id)}
                          className="gap-1"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Select a task to view details
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

const CacheTab = () => {
  const [overview, setOverview] = useState<CacheOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchPattern, setSearchPattern] = useState("*");
  const [keysData, setKeysData] = useState<CacheResponse | null>(null);
  const [keysLoading, setKeysLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [selectedKeyDetail, setSelectedKeyDetail] = useState<{ key: string; value: string } | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);

  // New key form state
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyData, setNewKeyData] = useState({ key: "", value: "", ttl: 3600 });
  const [savingKey, setSavingKey] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      const data = await getCacheOverview();
      setOverview(data);
    } catch {
      toast.error("Failed to fetch cache overview");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchKeys = useCallback(async (pattern: string = "*") => {
    setKeysLoading(true);
    try {
      const data = await listCacheKeys(pattern);
      setKeysData(data);
    } catch {
      toast.error("Failed to fetch cache keys");
      setKeysData(null);
    } finally {
      setKeysLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchKeys();
  }, [fetchOverview, fetchKeys]);

  const handleSearch = () => {
    fetchKeys(searchPattern);
    setSelectedKeys(new Set());
    setSelectedKeyDetail(null);
  };

  const handleViewKeyDetail = async (key: string) => {
    setDetailLoading(true);
    try {
      const data = await getCacheValue(key);
      setSelectedKeyDetail(data);
    } catch {
      toast.error("Failed to fetch key value");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeleteSelectedKeys = async () => {
    if (selectedKeys.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedKeys.size} key(s)?`)) return;

    try {
      await deleteCacheKey(Array.from(selectedKeys));
      toast.success(`Deleted ${selectedKeys.size} key(s)`);
      setSelectedKeys(new Set());
      setSelectedKeyDetail(null);
      fetchKeys(searchPattern);
      fetchOverview();
    } catch {
      toast.error("Failed to delete keys");
    }
  };

  const handleFlushAll = async () => {
    if (!confirm("⚠️ WARNING: This will delete ALL cache keys. Are you absolutely sure?")) return;
    if (!confirm("This action cannot be undone. Type 'yes' to continue.")) return;

    try {
      await flushAllKey();
      toast.success("All cache keys flushed");
      setSelectedKeys(new Set());
      setSelectedKeyDetail(null);
      fetchKeys(searchPattern);
      fetchOverview();
    } catch {
      toast.error("Failed to flush cache");
    }
  };

  const handleSaveNewKey = async () => {
    if (!newKeyData.key.trim() || !newKeyData.value.trim()) {
      toast.error("Key and value are required");
      return;
    }

    setSavingKey(true);
    try {
      await setCacheValue(newKeyData.key, newKeyData.value, newKeyData.ttl);
      toast.success("Cache key saved successfully");
      setShowNewKeyForm(false);
      setNewKeyData({ key: "", value: "", ttl: 3600 });
      fetchKeys(searchPattern);
      fetchOverview();
    } catch {
      toast.error("Failed to save cache key");
    } finally {
      setSavingKey(false);
    }
  };

  const toggleKeySelection = (key: string) => {
    const newSet = new Set(selectedKeys);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setSelectedKeys(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedKeys.size === (keysData?.keys?.length || 0)) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(keysData?.keys?.map((k) => k.key) || []));
    }
  };

  const formatTTL = (ttl: number): string => {
    if (ttl === -1) return "No expiry";
    if (ttl === -2) return "Expired";
    if (ttl < 60) return `${ttl}s`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)}m ${ttl % 60}s`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)}h ${Math.floor((ttl % 3600) / 60)}m`;
    return `${Math.floor(ttl / 86400)}d ${Math.floor((ttl % 86400) / 3600)}h`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RotateCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Redis Cache Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchOverview();
              fetchKeys(searchPattern);
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="destructive" size="sm" onClick={handleFlushAll} className="gap-2">
            <Trash2 className="h-4 w-4" /> Flush All
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{overview.total_keys}</p>
              <p className="text-xs text-muted-foreground">Total Keys</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{overview.connected_clients}</p>
              <p className="text-xs text-muted-foreground">Connected Clients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{overview.used_memory}</p>
              <p className="text-xs text-muted-foreground">Used Memory</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{overview.hit_rate}</p>
              <p className="text-xs text-muted-foreground">Hit Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-600">{overview.expired_keys}</p>
              <p className="text-xs text-muted-foreground">Expired Keys</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Server Info */}
      {overview && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="h-4 w-4" /> Redis Server Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  className="ml-2"
                  variant={overview.status === "connected" ? "default" : "destructive"}
                >
                  {overview.status}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Version:</span>
                <span className="ml-2 font-medium">{overview.version}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Uptime:</span>
                <span className="ml-2 font-medium">{overview.uptime}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Peak Memory:</span>
                <span className="ml-2 font-medium">{overview.used_memory_peak}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Commands Processed:</span>
                <span className="ml-2 font-medium">{overview.total_commands_processed}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Keyspace Hits:</span>
                <span className="ml-2 font-medium text-green-600">{overview.keyspace_hits}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Keyspace Misses:</span>
                <span className="ml-2 font-medium text-red-600">{overview.keyspace_misses}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Connections:</span>
                <span className="ml-2 font-medium">{overview.total_connections_received}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keys Browser */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Keys Browser
          </CardTitle>
          <CardDescription>
            Search and manage cache keys (use * for wildcard, prefix:* for prefix match)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <Input
              placeholder="Pattern (e.g., user:*, session:*, *)"
              value={searchPattern}
              onChange={(e) => setSearchPattern(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="gap-2">
              <Activity className="h-4 w-4" /> Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNewKeyForm(!showNewKeyForm)}
              className="gap-2"
            >
              <Send className="h-4 w-4" /> {showNewKeyForm ? "Cancel" : "New Key"}
            </Button>
          </div>

          {/* New Key Form */}
          {showNewKeyForm && (
            <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
              <h4 className="font-medium">Create New Cache Key</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Key name"
                  value={newKeyData.key}
                  onChange={(e) => setNewKeyData({ ...newKeyData, key: e.target.value })}
                />
                <Input
                  placeholder="Value (JSON or string)"
                  value={newKeyData.value}
                  onChange={(e) => setNewKeyData({ ...newKeyData, value: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="TTL (seconds)"
                    value={newKeyData.ttl}
                    onChange={(e) =>
                      setNewKeyData({ ...newKeyData, ttl: parseInt(e.target.value) || 3600 })
                    }
                  />
                  <Button onClick={handleSaveNewKey} disabled={savingKey}>
                    {savingKey ? <RotateCw className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Keys Actions Bar */}
          {keysData && keysData.keys?.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedKeys.size === keysData.keys.length}
                  onChange={toggleSelectAll}
                  className="rounded"
                />
                <span className="text-muted-foreground">
                  {selectedKeys.size > 0
                    ? `${selectedKeys.size} selected`
                    : `${keysData.total_count} keys found`}
                </span>
              </div>
              {selectedKeys.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelectedKeys}
                  className="gap-2"
                >
                  <Trash2 className="h-3 w-3" /> Delete Selected
                </Button>
              )}
            </div>
          )}

          {/* Keys List & Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Keys List */}
            <div className="border rounded-lg">
              <ScrollArea className="h-96">
                {keysLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RotateCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : !keysData || keysData.keys?.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground p-8">
                    No keys found for pattern "{searchPattern}"
                  </div>
                ) : (
                  <div className="divide-y">
                    {keysData.keys?.map((keyItem) => (
                      <div
                        key={keyItem.key}
                        className={`p-3 hover:bg-muted/50 transition-colors ${
                          selectedKeyDetail?.key === keyItem.key ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedKeys.has(keyItem.key)}
                            onChange={() => toggleKeySelection(keyItem.key)}
                            className="rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => handleViewKeyDetail(keyItem.key)}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className="font-mono text-sm truncate max-w-xs"
                                title={keyItem.key}
                              >
                                {keyItem.key}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {keyItem.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              TTL: {formatTTL(keyItem.ttl)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Key Detail */}
            <div className="border rounded-lg p-4">
              {detailLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RotateCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : selectedKeyDetail ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Key Details</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(selectedKeyDetail.value)}
                      className="gap-1"
                    >
                      Copy Value
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Key:</span>
                      <p className="font-mono text-xs break-all mt-1 p-2 bg-muted rounded">
                        {selectedKeyDetail.key}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Value:</span>
                      <pre className="mt-1 p-3 bg-muted rounded text-xs overflow-auto max-h-64 font-mono">
                        {(() => {
                          try {
                            return JSON.stringify(JSON.parse(selectedKeyDetail.value), null, 2);
                          } catch {
                            return selectedKeyDetail.value;
                          }
                        })()}
                      </pre>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await deleteCacheKey([selectedKeyDetail.key]);
                        toast.success("Key deleted");
                        setSelectedKeyDetail(null);
                        fetchKeys(searchPattern);
                        fetchOverview();
                      }}
                      className="gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Delete Key
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a key to view its value
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const JobTab = () => {
  const [jobs, setJobs] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggeringJob, setTriggeringJob] = useState<string | null>(null);
  const [triggeringAll, setTriggeringAll] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const data = await getAllRegisteredJobs();
      setJobs(data);
    } catch {
      toast.error("Failed to fetch registered jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleTriggerJob = async (jobName: string) => {
    setTriggeringJob(jobName);
    try {
      await triggerJobByName(jobName);
      toast.success(`Job "${jobName}" triggered successfully`);
      // Refresh to get updated last_run time
      fetchJobs();
    } catch {
      toast.error(`Failed to trigger job "${jobName}"`);
    } finally {
      setTriggeringJob(null);
    }
  };

  const handleTriggerAll = async () => {
    if (!confirm("Are you sure you want to trigger ALL jobs?")) return;

    setTriggeringAll(true);
    try {
      await triggerAllJob();
      toast.success("All jobs triggered successfully");
      fetchJobs();
    } catch {
      toast.error("Failed to trigger all jobs");
    } finally {
      setTriggeringAll(false);
    }
  };

  const formatLastRun = (lastRun: string): string => {
    if (!lastRun || lastRun === "0001-01-01T00:00:00Z") return "Never";
    const date = new Date(lastRun);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RotateCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const jobEntries = jobs ? Object.entries(jobs) : [];
  const enabledJobs = jobEntries.filter(([, job]) => job.enabled);
  const disabledJobs = jobEntries.filter(([, job]) => !job.enabled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Background Jobs Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchJobs} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleTriggerAll}
            disabled={triggeringAll}
            className="gap-2"
          >
            {triggeringAll ? (
              <RotateCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Trigger All
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{jobEntries.length}</p>
            <p className="text-xs text-muted-foreground">Total Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{enabledJobs.length}</p>
            <p className="text-xs text-muted-foreground">Enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{disabledJobs.length}</p>
            <p className="text-xs text-muted-foreground">Disabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" /> Registered Jobs
          </CardTitle>
          <CardDescription>View and trigger background jobs manually</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Job Name</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Last Run</th>
                  <th className="text-center p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobEntries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-muted-foreground">
                      No registered jobs found
                    </td>
                  </tr>
                ) : (
                  jobEntries.map(([key, job]) => (
                    <tr key={key} className="border-b hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{job.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{key}</span>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant={job.enabled ? "default" : "secondary"}>
                          {job.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-sm ${
                              job.last_run && job.last_run !== "0001-01-01T00:00:00Z"
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatLastRun(job.last_run)}
                          </span>
                          {job.last_run && job.last_run !== "0001-01-01T00:00:00Z" && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(job.last_run).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTriggerJob(key)}
                          disabled={triggeringJob === key || !job.enabled}
                          className="gap-1"
                        >
                          {triggeringJob === key ? (
                            <RotateCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                          Trigger
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Job Categories */}
      {(enabledJobs.length > 0 || disabledJobs.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enabled Jobs Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Active Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {enabledJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No active jobs
                  </div>
                ) : (
                  <div className="space-y-2">
                    {enabledJobs.map(([key, job]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{job.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Last: {formatLastRun(job.last_run)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTriggerJob(key)}
                          disabled={triggeringJob === key}
                          className="gap-1"
                        >
                          {triggeringJob === key ? (
                            <RotateCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Disabled Jobs Card */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="h-4 w-4" /> Disabled Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {disabledJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No disabled jobs
                  </div>
                ) : (
                  <div className="space-y-2">
                    {disabledJobs.map(([key, job]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 border border-dashed rounded-lg opacity-60"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{job.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Last: {formatLastRun(job.last_run)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Disabled
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// ==========================================
// PUBLISH MESSAGE DIALOG
// ==========================================
const PublishMessageDialog = ({ onPublish }: { onPublish: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exchange: "",
    routing_key: "",
    payload: JSON.stringify({ test: "message" }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publishMessage(formData);
      toast.success("Message published successfully");
      setOpen(false);
      onPublish();
      // Reset form slightly but keep exchange for convenience
      setFormData((prev) => ({ ...prev, payload: JSON.stringify({ test: "message" }) }));
    } catch {
      toast.error("Failed to publish message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Send className="h-4 w-4" /> Publish Msg
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Publish Debug Message</DialogTitle>
          <DialogDescription>Send a message manually to an exchange.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label>Exchange Name</Label>
            <Input
              id="exchange"
              placeholder="e.g. orders.direct"
              value={formData.exchange}
              onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Routing Key</Label>
            <Input
              id="routing_key"
              placeholder="e.g. order.created"
              value={formData.routing_key}
              onChange={(e) => setFormData({ ...formData, routing_key: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Payload (JSON)</Label>
            <Textarea
              id="payload"
              className="font-mono text-xs h-32"
              value={formData.payload}
              onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Publish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// HELPER COMPONENTS
// ==========================================

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium truncate max-w-[150px]" title={String(value)}>
      {value}
    </span>
  </div>
);

const StatCard = ({ title, value, sub, icon, highlight }: any) => (
  <Card className={highlight ? "border-red-200 bg-red-50 dark:bg-red-900/10" : ""}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon || <Activity className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </CardContent>
  </Card>
);

const QueueStatusBox = ({ label, count, color, onPurge }: any) => (
  <div className={`p-3 rounded border flex justify-between items-center ${color}`}>
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="font-mono font-bold text-lg">{count}</div>
    </div>
    {count > 0 && (
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground hover:text-red-600"
        onClick={onPurge}
        title="Purge Queue"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    )}
  </div>
);

const EmptyBox = ({ label }: { label: string }) => (
  <div className="p-3 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground h-full min-h-[70px]">
    {label}
  </div>
);

const LoadingSpinner = () => (
  <div className="p-12 flex justify-center items-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <Server className="h-8 w-8 text-primary" />
    </motion.div>
  </div>
);

export default SystemDashboard;
