export const dateFormat = (fmt, date) => {
  if (date) {
    let ret;
    let opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString(),         // 秒
      "s+": (date.getTime() / 1000).toString().split('.')[1],         // 豪秒
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k]?.padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  } else {
    return '-';
  }
}

export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
* 图片转base64
*/
export const toBase64 = (file) => {
  let reader = new FileReader();
  let AllowImgFileSize = 2100000; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
  if (file) {
    //将文件以Data URL形式读入页面  
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      if (AllowImgFileSize != 0 && AllowImgFileSize < reader.result.length) {
        return {
          flag: false,
          msg: '上传失败，请上传不大于2M的图片！'
        };
      } else {
        //执行上传操作
        return {
          flag: true,
          msg: reader.result
        };
      }
    }
  }
}

/**
 * 节流
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const throttle = (fn, delay = 500) => {
  if (_throttleRunning) {
    return
  }
  _throttleRunning = true
  fn()
  setTimeout(() => {
    _throttleRunning = false
  }, delay)
}

/**
 * clone对象
 * @param obj
 * @returns
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
// 获取assets静态资源
export const getAssetsFile = url => {
  return new URL(`../assets/img/${url}`, import.meta.url).href
}


// 加法运算
export function add(a, b) {
  return parseFloat((a + b).toFixed(10));
}

// 减法运算
export function subtract(a, b) {
  return parseFloat((a - b).toFixed(10));
}

// 乘法运算
export function multiply(a, b) {
  return parseFloat((a * b).toFixed(10));
}

// 除法运算
export function divide(a, b) {
  return parseFloat((a / b).toFixed(10));
}

// 截取小数
export function tofixed(number, slice, donot) {

  if( !number && number != 0) return null
  let numberString = number.toString();

  if (numberString.indexOf('.') !== -1 && !donot) {
    let decimalPart = numberString.split('.')[1];
    if(slice) return decimalPart.length > slice ? number.toFixed(slice) : number;
  }

  // 如果没有小数点，则直接返回
  return number;
}