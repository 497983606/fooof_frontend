import { C3D, Model, Event, Animate, Weather, Photog, Vector3, Raycaster} from '@zkqh/c3d'

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
    this.me = null
    this.direction = new Vector3(0, -1, 0)
  }

  init(options){
    this.c3d.init(options)
    return this.c3d
  }

  removeMe(){
    if(this.me){
      this.me.visible = false
      this.me = null
    }
  }

  async setMe(x, z){
    let y = 0
    const origin = new Vector3(x, 10000, z );
    const raycaster = new Raycaster(origin, this.direction)
    const intersects = raycaster.intersectObject(this.c3d.photog.model)
    if (intersects.length) y = intersects[0].point.y;
    else return this.removeMe()
    if(this.me){
      this.me.visible = true
      this.me.position.set(x, y, z)
    }else{
      this.me = await this.c3d.model.loadModel({
        type: "html",
        shape: {
          css3d: false,
          el: `<span style='padding: 2px 5px; background: #00f; color: #fff; font-size: 14px'>  I'm Here </span>`
        },
        style: {
          color: 0xff000
        }
      }, this.c3d.photog.model)
    }
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
  load(src, height = 0){
    this.c3d.photog.init({
      src,
      position: [0, height, 0],
      decoder: { },
      native: {
        preloadTilesCount: 5000
      }
    }) 
  }
}