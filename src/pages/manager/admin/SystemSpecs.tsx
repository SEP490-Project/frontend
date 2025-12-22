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
} from "../../../libs/services/manageSystem";
import type {
  SystemSpecsResponse,
  RabbitMQHealth,
  RabbitMQOverview,
  RabbitMQQueueGroup,
  RabbitMQShovel,
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
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="system">System Resources</TabsTrigger>
          <TabsTrigger value="rabbitmq">RabbitMQ Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <SystemSpecsTab />
        </TabsContent>

        <TabsContent value="rabbitmq">
          <RabbitMQTab />
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
                  {groups.map((group) => (
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
                    {shovels.map((shovel) => (
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
// PUBLISH MESSAGE DIALOG
// ==========================================
const PublishMessageDialog = ({ onPublish }: { onPublish: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exchange: "",
    routing_key: "",
    payload: '{"test": "message"}',
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
      setFormData((prev) => ({ ...prev, payload: '{"test": "message"}' }));
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
