import React from "react";
import {
  Briefcase,
  Calendar,
  MapPin,
  Hash,
  Image,
  Package,
  Lightbulb,
  Link as LinkIcon,
} from "lucide-react";

export const ScopeOfWork: React.FC<{ type: string; data: any }> = ({ type, data }) => {
  if (!data) return null;

  const { deliverables, general_requirements } = data;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-blue-600" />
        Scope of Work
      </h2>

      {/* General Requirements */}
      {general_requirements && general_requirements.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">General Requirements</h3>
          <ul className="space-y-2">
            {general_requirements.map((req: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-600 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* BRAND AMBASSADOR - Events */}
      {type === "BRAND_AMBASSADOR" &&
        deliverables?.events?.map((e: any, i: number) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {e.name}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <span className="text-sm text-gray-500 block">Event Date</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(e.date).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600 block">
                      Duration: {e.expected_duration}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <span className="text-sm text-gray-500 block">Location</span>
                    <span className="font-semibold text-gray-900">{e.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  Activities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {e.activities.map((act: string, j: number) => (
                    <span
                      key={j}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Representation Rules</h4>
                <ul className="space-y-1">
                  {e.representation_rules.map((rule: string, j: number) => (
                    <li key={j} className="flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {e.kpis && e.kpis.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Target KPIs</h4>
                  {e.kpis.map((kpi: any, j: number) => (
                    <div key={j} className="flex justify-between items-center">
                      <span className="text-gray-700">{kpi.metric.replace(/_/g, " ")}</span>
                      <span className="font-bold text-purple-700">{kpi.target}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

      {/* ADVERTISING - Advertised Items */}
      {type === "ADVERTISING" &&
        deliverables?.advertised_items?.map((a: any, i: number) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <h3 className="text-xl font-bold">{a.name}</h3>
              <p className="text-blue-100 text-sm">{a.tagline}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Platform</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium inline-block">
                    {a.platform}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Duration</span>
                  <span className="font-semibold text-gray-900">{a.duration_in_days} days</span>
                </div>
              </div>

              {a.description && (
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Description</span>
                  <p className="text-gray-700">{a.description}</p>
                </div>
              )}

              {a.hash_tag && a.hash_tag.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-600" />
                    Hashtags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {a.hash_tag.map((tag: string, j: number) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {a.content_requirements && a.content_requirements.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Content Requirements</h4>
                  <ul className="space-y-1">
                    {a.content_requirements.map((req: string, j: number) => (
                      <li key={j} className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {a.creative_notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Creative Notes</h4>
                  <p className="text-gray-700 italic">{a.creative_notes}</p>
                </div>
              )}

              {a.material_url && a.material_url.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4 text-blue-600" />
                    Materials
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {a.material_url.map((url: string, j: number) => (
                      <a
                        key={j}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Material {j + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

      {/* CO_PRODUCING - Products & Concepts */}
      {type === "CO_PRODUCING" && (
        <>
          {deliverables?.products?.map((p: any, i: number) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {p.name}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Description</span>
                  <p className="text-gray-700">{p.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {p.quantity && (
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <span className="text-sm text-gray-600">Quantity</span>
                      <p className="text-2xl font-bold text-indigo-700">{p.quantity}</p>
                    </div>
                  )}
                  {p.revenue_target && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <span className="text-sm text-gray-600">Revenue Target</span>
                      <p className="text-2xl font-bold text-green-700">
                        {new Intl.NumberFormat("vi-VN").format(p.revenue_target)} VND
                      </p>
                    </div>
                  )}
                </div>
                {p.kpis && p.kpis.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">KPIs</h4>
                    {p.kpis.map((kpi: any, j: number) => (
                      <div key={j} className="flex justify-between items-center">
                        <span className="text-gray-700">{kpi.metric}</span>
                        <span className="font-bold text-indigo-700">{kpi.target || "TBD"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {deliverables?.concepts?.map((c: any, i: number) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  {c.name}
                </h3>
                <p className="text-purple-100 text-sm">{c.tagline}</p>
              </div>
              <div className="p-6 space-y-4">
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
              </div>
            </div>
          ))}
        </>
      )}

      {/* AFFILIATE */}
      {type === "AFFILIATE" && (
        <>
          {deliverables?.tracking_link && (
            <div className="bg-gradient-to-r from-pink-50 to-white p-6 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-pink-600" />
                Tracking Link
              </h3>
              <a
                href={deliverables.tracking_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800 underline break-all font-medium"
              >
                {deliverables.tracking_link}
              </a>
            </div>
          )}

          {deliverables?.advertised_items?.map((item: any, i: number) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-4 text-white">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-pink-100 text-sm">{item.tagline}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Platform</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium inline-block">
                      {item.platform}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Duration</span>
                    <span className="font-semibold text-gray-900">
                      {item.duration_in_days} days
                    </span>
                  </div>
                </div>

                {item.description && (
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Description</span>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                )}

                {item.hash_tag && item.hash_tag.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-pink-600" />
                      Hashtags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.hash_tag.map((tag: string, j: number) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-pink-50 text-pink-700 rounded text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.content_requirements && item.content_requirements.length > 0 && (
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Content Requirements</h4>
                    <ul className="space-y-1">
                      {item.content_requirements.map((req: string, j: number) => (
                        <li key={j} className="flex items-center gap-2 text-gray-700">
                          <span className="w-1.5 h-1.5 bg-pink-600 rounded-full"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.creative_notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Creative Notes</h4>
                    <p className="text-gray-700 italic">{item.creative_notes}</p>
                  </div>
                )}

                {item.material_url && item.material_url.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Image className="w-4 h-4 text-pink-600" />
                      Materials
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.material_url.map((url: string, j: number) => (
                        <a
                          key={j}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-pink-600 hover:text-pink-800 transition-colors"
                        >
                          View Material {j + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
};

export default ScopeOfWork;
