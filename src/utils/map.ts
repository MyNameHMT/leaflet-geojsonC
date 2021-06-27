import * as L from 'leaflet'

class Map {
  mapid: string
  map: any
  constructor(id: string) {
    this.mapid = id
  }
  initmap():void {
    this.map = L.map(this.mapid, {
      crs: L.CRS.EPSG4326,
      renderer: L.canvas(),
      center: [19.2, 109.8],
      zoom: 6,
      minZoom: 2,
      zoomControl: false,
      attributionControl: false
    })
    L.tileLayer('http://t2.tianditu.gov.cn/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=8d721b456cd3d12801c3599635b97769').addTo(this.map)
  }
  static createmap(id):any {
    const map = new Map(id)
    map.initmap()
    return map
  }
}

export default Map