import axios from "../utils/request"

export const getgeojson = () => {
  return axios({
    method: 'GET',
    url: '/temp.geojson'
  })
}