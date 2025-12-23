declare module "@goongmaps/goong-js" {
  export interface LngLat {
    lng: number;
    lat: number;
  }

  export class Map {
    constructor(options: any);
    on(event: string, handler: (e: any) => void): void;
    setCenter(center: [number, number]): void;
    remove(): void;
  }

  export class Marker {
    constructor(options?: any);
    setLngLat(lngLat: [number, number]): this;
    addTo(map: Map): this;
  }

  const goongjs: {
    Map: typeof Map;
    Marker: typeof Marker;
    accessToken: string;
    LngLatBounds: typeof LngLatBounds;
  };

  export default goongjs;
}
