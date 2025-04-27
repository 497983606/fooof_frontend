export class ModelPositionChecker {

  constructor(center) {
      this.latKMDeg = 111320
      this.lonKMDeg = 110940
      this.center = center || []
  }
  checkPosition(lat, lon, height = 0, center) {
      center = center || this.center
      if(this.center.length === 0) return false
      let latdif = lon - center[0]
      let londif = center[1] - lat
      return {
          position: [
            latdif * this.latKMDeg * Math.cos((center[1] + lat) / 2 * Math.PI / 180),
            londif * this.lonKMDeg,
            height
          ],
      };
  }
}

export class LocationChecker {
  constructor(center) {
      this.modelChecker = null;
      this.initialize(center);
  }

  // 初始化模型检查器
  async initialize(center) {
      this.modelChecker = new ModelPositionChecker(center);
      return true
  }

  // 获取用户当前位置
  async getCurrentPosition() {
      return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
              reject(new Error('浏览器不支持地理位置服务'));
              return;
          }

          navigator.geolocation.getCurrentPosition(
              (position) => {
                  resolve({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      altitude: position.coords.altitude || 0,
                      accuracy: position.coords.accuracy,
                      altitudeAccuracy: position.coords.altitudeAccuracy,
                      timestamp: position.timestamp
                  });
              },
              (error) => {
                  let errorMessage = '获取位置失败: ';
                  switch(error.code) {
                      case error.PERMISSION_DENIED:
                          errorMessage += '用户拒绝了位置请求';
                          break;
                      case error.POSITION_UNAVAILABLE:
                          errorMessage += '位置信息不可用';
                          break;
                      case error.TIMEOUT:
                          errorMessage += '请求超时';
                          break;
                      default:
                          errorMessage += '未知错误';
                  }
                  reject(errorMessage);
              },
              {
                  enableHighAccuracy: true, // 启用高精度
                  timeout: 5000,           // 超时时间：5秒
                  maximumAge: 0            // 不使用缓存的位置信息
              }
          );
      });
  }

  // 检查位置是否在模型范围内
  async checkUserPosition() {
      try {
          const position = await this.getCurrentPosition()
          const result = this.modelChecker.checkPosition(
              position.latitude,
              position.longitude,
              position.altitude
          );
          
          return {
              position: position,
              relativePosition: result.position
          };
      } catch (error) {
          throw error;
      }
  }

  // 持续监听位置变化
  watchPosition(callback, errorCallback) {
      if (!navigator.geolocation) {
          errorCallback(new Error('浏览器不支持地理位置服务'));
          return null;
      }

      return navigator.geolocation.watchPosition(
          async (position) => {
              try {
                  const result = this.modelChecker.checkPosition(
                      position.coords.latitude,
                      position.coords.longitude,
                      position.coords.altitude || 0
                  );
                  callback({
                    position: position,
                    relativePosition: result.position
                  });
              } catch (error) {
                  errorCallback(error);
              }
          },
          (error) => {
              errorCallback(error);
          },
          {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
          }
      );
  }

  // 停止位置监听
  stopWatching(watchId) {
      if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
      }
  }
}
