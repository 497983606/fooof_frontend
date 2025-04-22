import { C3D, Model, Event, Animate, Weather, Photog } from '@zkqh/c3d'


export default class {
  controlChange = null
  constructor (el) {
    this.c3d = new C3D(el)
    this.c3d.addPlugin(Animate)
    this.c3d.addPlugin(Event)
    this.c3d.addPlugin(Model)
    this.c3d.addPlugin(Weather)
    this.c3d.addPlugin(Photog)
    this.c3d.onControlChange = this.onControlChange.bind(this)
  }

  init(options){
    this.c3d.init(options)
    return this.c3d
  }
  destroy(){
    this.c3d && this.c3d.dispose()
  }
  onControlChange(){
    if(this.controlChange){
      const { x, y, z } = this.c3d.camera.position
      const { x: _x, y: _y, z: _z  } = this.c3d.control.target
      this.controlChange({ camera: [ x, y, z ], control: [ _x, _y, _z ] })
    }
  }
  load(src){
    this.c3d.photog.init({
      src,
      position: [0, 5, 0],
      decoder: { },
      native: {
        preloadTilesCount: 5000
      }
    }) 
  }
}