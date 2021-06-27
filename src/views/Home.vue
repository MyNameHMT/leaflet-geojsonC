<template>
   <div id="map"></div>
</template>

<script lang='ts'>
import imitMap from '../utils/map'
import { defineComponent, onMounted } from 'vue'
import { getgeojson } from '../services/api'
import { GeojsonLayer } from '../utils/L.geojsonLayer'
export default defineComponent({
  name: 'Home',
  setup() {
    onMounted(() => {
      initmap()
      getmap()
    })
    let map = null
    const initmap = () => {
      map = imitMap.createmap("map")
    }
    const getmap = async () => {
      const { data: { features } } = await getgeojson ()
      console.log(map.map)
      GeojsonLayer({data:features}).addTo(map.map)
    }
  }
})
</script>
