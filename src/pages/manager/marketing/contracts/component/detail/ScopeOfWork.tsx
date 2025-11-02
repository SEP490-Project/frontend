import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Briefcase,
  Calendar,
  MapPin,
  Hash,
  Image,
  Package,
  Lightbulb,
  Link as LinkIcon,
  Clock,
  Target,
  Users,
  ExternalLink,
  Play,
} from "lucide-react";

export const ScopeOfWork: React.FC<{ type: string; data: any }> = ({ type, data }) => {
  if (!data) return null;

  const { deliverables, general_requirements } = data;

  const getTypeColor = (type: string) => {
    const colors = {
      BRAND_AMBASSADOR: "purple",
      ADVERTISING: "blue",
      CO_PRODUCING: "indigo",
      AFFILIATE: "pink",
    };
    return colors[type as keyof typeof colors] || "gray";
  };

  const typeColor = getTypeColor(type);

  return (
    <div className="space-y-6">
      {/* Header với type color */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${typeColor}-100`}>
          <Briefcase className={`w-7 h-7 text-${typeColor}-600`} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Scope of Work & Deliverables</h2>
          <Badge className={`bg-${typeColor}-100 text-${typeColor}-800 mt-1`}>
            {type.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      {/* General Requirements với type color */}
      {general_requirements && general_requirements.length > 0 && (
        <Card className={`border-l-4 border-l-${typeColor}-500`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 text-${typeColor}-700`}>
              <Target className="w-5 h-5" />
              General Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {general_requirements.map((req: string, i: number) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-2 rounded hover:bg-${typeColor}-50 transition-colors`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-${typeColor}-100 flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <span className={`text-xs font-semibold text-${typeColor}-700`}>{i + 1}</span>
                  </div>
                  <p className="text-gray-700">{req}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* BRAND AMBASSADOR - Events */}
      {type === "BRAND_AMBASSADOR" &&
        deliverables?.events?.map((e: any, i: number) => (
          <Card key={i} className={`border-l-4 border-l-${typeColor}-500 overflow-hidden`}>
            <CardHeader className={`bg-gradient-to-r from-${typeColor}-50 to-${typeColor}-100`}>
              <CardTitle className={`flex items-center gap-2 text-${typeColor}-700`}>
                <Calendar className="w-5 h-5" />
                {e.name}
                <Badge variant="outline" className="ml-auto bg-white">
                  Event #{i + 1}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className={`border border-${typeColor}-200`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`w-4 h-4 text-${typeColor}-600`} />
                      <span className="font-medium text-gray-700">Event Date & Time</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {new Date(e.date).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      Duration: {e.expected_duration}
                    </div>
                  </CardContent>
                </Card>
                <Card className={`border border-${typeColor}-200`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className={`w-4 h-4 text-${typeColor}-600`} />
                      <span className="font-medium text-gray-700">Location</span>
                    </div>
                    <p className="font-semibold text-gray-900">{e.location}</p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Activities */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Play className={`w-4 h-4 text-${typeColor}-600`} />
                  Activities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {e.activities.map((act: string, j: number) => (
                    <Badge
                      key={j}
                      variant="secondary"
                      className={`bg-${typeColor}-100 text-${typeColor}-800 hover:bg-${typeColor}-200`}
                    >
                      {act}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Representation Rules */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className={`w-4 h-4 text-${typeColor}-600`} />
                  Representation Rules
                </h4>
                <div className="space-y-2">
                  {e.representation_rules.map((rule: string, j: number) => (
                    <div
                      key={j}
                      className={`flex items-start gap-2 p-2 bg-${typeColor}-50 rounded`}
                    >
                      <span
                        className={`w-1.5 h-1.5 bg-${typeColor}-600 rounded-full mt-2 flex-shrink-0`}
                      ></span>
                      <span className="text-sm text-gray-700">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              {e.kpis && e.kpis.length > 0 && (
                <Card className={`bg-${typeColor}-50 border-${typeColor}-200`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className={`w-4 h-4 text-${typeColor}-600`} />
                      Target KPIs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {e.kpis.map((kpi: any, j: number) => (
                        <div
                          key={j}
                          className="flex justify-between items-center p-2 bg-white rounded border"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {kpi.metric.replace(/_/g, " ").toUpperCase()}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-${typeColor}-700 border-${typeColor}-300`}
                          >
                            {kpi.target}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        ))}

      {/* ADVERTISING - Advertised Items với type color được áp dụng tương tự */}
      {type === "ADVERTISING" &&
        deliverables?.advertised_items?.map((a: any, i: number) => (
          <Card key={i} className={`border-l-4 border-l-${typeColor}-500 overflow-hidden`}>
            <CardHeader className={`bg-gradient-to-r from-${typeColor}-50 to-${typeColor}-100`}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  {a.name}
                </div>
                <Badge variant="outline" className="bg-white">
                  Item #{i + 1}
                </Badge>
              </CardTitle>
              {a.tagline && <p className="text-blue-700 text-sm font-medium">{a.tagline}</p>}
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={`border border-${typeColor}-200`}>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Platform</p>
                    <Badge className="bg-blue-100 text-blue-800">{a.platform}</Badge>
                  </CardContent>
                </Card>
                <Card className={`border border-${typeColor}-200`}>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="font-semibold text-gray-900">{a.duration_in_days} days</p>
                  </CardContent>
                </Card>
                <Card className={`border border-${typeColor}-200`}>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <Badge variant="secondary">Active</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              {a.description && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{a.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Hashtags */}
              {a.hash_tag && a.hash_tag.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-600" />
                    Hashtags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {a.hash_tag.map((tag: string, j: number) => (
                      <Badge
                        key={j}
                        variant="outline"
                        className="text-blue-700 border-blue-300 hover:bg-blue-50"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Requirements */}
              {a.content_requirements && a.content_requirements.length > 0 && (
                <Card className={`border border-${typeColor}-200`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Content Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {a.content_requirements.map((req: string, j: number) => (
                        <div key={j} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">{j + 1}</span>
                          </div>
                          <span className="text-sm text-gray-700">{req}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Creative Notes */}
              {a.creative_notes && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      Creative Notes
                    </h4>
                    <p className="text-sm text-gray-700 italic">{a.creative_notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Materials */}
              {a.material_url && a.material_url.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Image className="w-4 h-4 text-blue-600" />
                    Materials
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {a.material_url.map((url: string, j: number) => (
                      <Button key={j} variant="outline" size="sm" asChild>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Material {j + 1}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

      {/* CO_PRODUCING - Products & Concepts */}
      {type === "CO_PRODUCING" && (
        <>
          {/* Products */}
          {deliverables?.products?.map((p: any, i: number) => (
            <Card key={i} className={"border-l-4 border-l-indigo-500 overflow-hidden"}>
              <CardHeader className={"bg-gradient-to-r from-indigo-50 to-indigo-100"}>
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <Package className="w-5 h-5" />
                  {p.name}
                  <Badge variant="outline" className="ml-auto bg-white">
                    Product #{i + 1}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {p.description && (
                  <Card className="bg-indigo-50 border-indigo-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-700">{p.description}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {p.quantity && (
                    <Card className={"border border-indigo-200"}>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">Target Quantity</p>
                        <p className="text-3xl font-bold text-indigo-600">{p.quantity}</p>
                      </CardContent>
                    </Card>
                  )}
                  {p.revenue_target && (
                    <Card className={"border border-green-200"}>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">Revenue Target</p>
                        <p className="text-2xl font-bold text-green-600">
                          {new Intl.NumberFormat("vi-VN").format(p.revenue_target)} VND
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {p.kpis && p.kpis.length > 0 && (
                  <Card className={"border border-gray-200"}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-600" />
                        KPIs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {p.kpis.map((kpi: any, j: number) => (
                          <div
                            key={j}
                            className="flex justify-between items-center p-2 border rounded"
                          >
                            <span className="text-sm font-medium text-gray-700">{kpi.metric}</span>
                            <Badge variant="outline" className="text-indigo-700">
                              {kpi.target || "TBD"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Concepts */}
          {deliverables?.concepts?.map((c: any, i: number) => (
            <Card key={i} className={"border-l-4 border-l-purple-500 overflow-hidden"}>
              <CardHeader className={"bg-gradient-to-r from-purple-50 to-purple-100"}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-700">
                    <Lightbulb className="w-5 h-5" />
                    {c.name}
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Concept #{i + 1}
                  </Badge>
                </CardTitle>
                {c.tagline && <p className="text-purple-700 text-sm font-medium">{c.tagline}</p>}
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Platform</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium inline-block">
                      {c.platform}
                    </span>
                  </div>
                  {c.product_id && (
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">Product ID</span>
                      <span className="font-semibold text-gray-900">{c.product_id}</span>
                    </div>
                  )}
                </div>

                {c.description && (
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Description</span>
                    <p className="text-gray-700">{c.description}</p>
                  </div>
                )}

                {c.creative_notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Creative Notes</h4>
                    <p className="text-gray-700 italic">{c.creative_notes}</p>
                  </div>
                )}

                {c.hash_tag && c.hash_tag.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-purple-600" />
                      Hashtags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {c.hash_tag.map((tag: string, j: number) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-purple-50 text-purple-700 rounded text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {c.content_requirements && c.content_requirements.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Content Requirements</h4>
                    <div className="space-y-2">
                      {c.content_requirements.map((req: string, j: number) => (
                        <div key={j} className="text-gray-700 whitespace-pre-line">
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {c.material_url && c.material_url.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Image className="w-4 h-4 text-purple-600" />
                      Materials
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {c.material_url.map((url: string, j: number) => (
                        <a
                          key={j}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          View Material {j + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* AFFILIATE */}
      {type === "AFFILIATE" && (
        <>
          {deliverables?.tracking_link && (
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-700">
                  <LinkIcon className="w-5 h-5" />
                  Tracking Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-3 bg-pink-50 rounded border border-pink-200">
                  <Avatar className="h-8 w-8 bg-pink-100">
                    <AvatarFallback className="text-pink-700 text-xs">🔗</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="link"
                    asChild
                    className="text-pink-600 hover:text-pink-800 p-0 h-auto"
                  >
                    <a
                      href={deliverables.tracking_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all"
                    >
                      {deliverables.tracking_link}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affiliate Items - similar pattern as advertising items but with pink theme */}
          {deliverables?.advertised_items?.map((item: any, i: number) => (
            <Card key={i} className="border-l-4 border-l-pink-500 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-pink-700">
                    <Package className="w-5 h-5" />
                    {item.name}
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Item #{i + 1}
                  </Badge>
                </CardTitle>
                {item.tagline && (
                  <p className="text-pink-700 text-sm font-medium">{item.tagline}</p>
                )}
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Similar content structure as advertising items but with pink theme */}
                {/* ... rest of the content with pink styling */}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default ScopeOfWork;
