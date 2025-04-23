export class ModelPositionChecker {
  // WGS84椭球体参数
  static WGS84 = {
      a: 6378137.0,  // 长半轴
      f: 1/298.257223563,  // 扁率
      get b() { return this.a * (1 - this.f); },  // 短半轴
      get e2() { return 2*this.f - this.f*this.f; }  // 第一偏心率平方
  };

  constructor() {
      this.transform = null;
      this.boundingBox = null;
      this.modelOrigin = null;
      this.rotationMatrix = null;
      this.invRotationMatrix = null;
  }

  // 加载和初始化tileset数据
  async initialize(tilesetUrl) {
      try {
          const response = await fetch(tilesetUrl);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const tilesetData = await response.json();
          
          this.transform = tilesetData.root.transform;
          this.boundingBox = this.extractBoundingBox(tilesetData.root.boundingVolume.box);
          this.modelOrigin = [this.transform[12], this.transform[13], this.transform[14]];
          this.rotationMatrix = this.extractRotationMatrix(this.transform);
          this.invRotationMatrix = this.transposeMatrix(this.rotationMatrix);
          
          return true;
      } catch (error) {
          console.error('加载tileset.json失败:', error);
          return false;
      }
  }

  // 提取包围盒信息
  extractBoundingBox(boxData) {
      return {
          center: [boxData[0], boxData[1], boxData[2]],
          halfExtents: [boxData[3], boxData[7], boxData[11]]
      };
  }

  // 提取旋转矩阵
  extractRotationMatrix(transform) {
      return [
          [transform[0], transform[1], transform[2]],
          [transform[4], transform[5], transform[6]],
          [transform[8], transform[9], transform[10]]
      ];
  }

  // 矩阵转置
  transposeMatrix(matrix) {
      return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  // 矩阵与向量相乘
  multiplyMatrixVector(matrix, vector) {
      return matrix.map(row => 
          row.reduce((sum, value, index) => sum + value * vector[index], 0)
      );
  }

  // 经纬度转ECEF坐标
  latLonHeightToECEF(lat, lon, height) {
      const latRad = lat * Math.PI / 180;
      const lonRad = lon * Math.PI / 180;
      
      const N = ModelPositionChecker.WGS84.a / Math.sqrt(1 - ModelPositionChecker.WGS84.e2 * Math.sin(latRad) * Math.sin(latRad));
      
      const X = (N + height) * Math.cos(latRad) * Math.cos(lonRad);
      const Y = (N + height) * Math.cos(latRad) * Math.sin(lonRad);
      const Z = (N * (1 - ModelPositionChecker.WGS84.e2) + height) * Math.sin(latRad);
      
      return [X, Y, Z];
  }

  // 计算相对位置
  calculateRelativePosition(lat, lon, height) {
      if (!this.transform) {
          throw new Error('请先调用initialize方法初始化tileset数据');
      }

      // 计算目标点ECEF坐标
      const targetECEF = this.latLonHeightToECEF(lat, lon, height);
      
      // 计算相对偏移
      const deltaX = targetECEF[0] - this.modelOrigin[0];
      const deltaY = targetECEF[1] - this.modelOrigin[1];
      const deltaZ = targetECEF[2] - this.modelOrigin[2];
      
      // 计算局部坐标
      return this.multiplyMatrixVector(this.invRotationMatrix, [deltaX, deltaY, deltaZ]);
  }

  // 检查点是否在包围盒内
  isPointInBoundingBox(point) {
      if (!this.boundingBox) {
          throw new Error('请先调用initialize方法初始化tileset数据');
      }

      return point.every((coord, i) => 
          Math.abs(coord - this.boundingBox.center[i]) <= this.boundingBox.halfExtents[i]
      );
  }

  // 检查经纬度坐标是否在模型范围内
  checkPosition(lat, lon, height) {
      if (!this.transform || !this.boundingBox) {
          throw new Error('请先调用initialize方法初始化tileset数据');
      }

      const relativePos = this.calculateRelativePosition(lat, lon, height);
      const isInside = this.isPointInBoundingBox(relativePos);
      
      return {
          relativePosition: relativePos,
          isInBoundingBox: isInside
      };
  }
}

export class LocationChecker {
  constructor() {
      this.modelChecker = null;
  }

  // 初始化模型检查器
  async initialize(tilesetUrl) {
      this.modelChecker = new ModelPositionChecker();
      return await this.modelChecker.initialize(tilesetUrl);
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
          const position = await this.getCurrentPosition();
          
          if (!this.modelChecker) {
              throw new Error('请先调用initialize方法初始化模型数据');
          }

          const result = this.modelChecker.checkPosition(
              position.latitude,
              position.longitude,
              position.altitude
          );

          return {
              position: position,
              relativePosition: result.relativePosition,
              isInBoundingBox: result.isInBoundingBox
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
                      position: {
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude,
                          altitude: position.coords.altitude || 0,
                          accuracy: position.coords.accuracy,
                          altitudeAccuracy: position.coords.altitudeAccuracy,
                          timestamp: position.timestamp
                      },
                      relativePosition: result.relativePosition,
                      isInBoundingBox: result.isInBoundingBox
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
