import { C3D, Model, Event, Animate, Weather, Photog } from '@zkqh/c3d'
import sunny from '@zkqh/c3d/assets/sunny.hdr?url'

export default class {
  constructor (el) {
    this.c3d = new C3D(el)
    this.c3d.addPlugin(Animate)
    this.c3d.addPlugin(Event)
    this.c3d.addPlugin(Model)
    this.c3d.addPlugin(Weather)
    this.c3d.addPlugin(Photog)
  }
  init(){
    this.c3d.init({
      sky: sunny,
      camera: {
        position: [80, 140, 185],
        near: 0.1,
        far: 1000000,
      },
      control: {
        maxDistance: 150000,
        minDistance: 0.1,
        maxPolarAngle: 180
      }
    })
  }
}