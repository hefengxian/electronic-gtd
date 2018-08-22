/**
 * Copyright © 2017-present, Knowlesys, Inc.
 * All rights reserved.
 *
 * 把存储在 LocalStorage 的数据进行压缩，做成一个 Vue 的插件
 *
 * @author: HFX 2017-09-18 14-49
 * @version 1.0
 */

import LZString from 'lz-string'
import * as Keys from './store-keys'

/**
 * 该方法接受一个键名作为参数，返回键名对应的值。
 *
 * @param key
 * @returns {*}
 */
const getItem = function (key) {
  let value = window.localStorage.getItem(key)
  if (value !== null) {
    value = LZString.decompressFromUTF16(value)
    value = JSON.parse(value)
  }
  return value
}

const localStore = {
  Keys,

  // 返回一个整数，表示存储在 Storage 对象中的数据项数量。
  length () {
    return window.localStorage.length
  },

  // 该方法接受一个数值 n 作为参数，并返回存储中的第 n 个键名。
  key (index) {
    return window.localStorage.key(index)
  },

  getItem,

  /**
   * 该方法接受一个键名和值作为参数，将会把键值对添加到存储中，如果键名存在，则更新其对应的值。
   *
   * @param key
   * @param value
   */
  setItem (key, value) {
    if (typeof value !== 'undefined') {
      value = JSON.stringify(value)
      value = LZString.compressToUTF16(value)
      window.localStorage.setItem(key, value)
    }
  },

  /**
   * 该方法接受一个键名作为参数，返回键名对应的值是否存在
   *
   * @param key
   * @returns {boolean}
   */
  exist (key) {
    let value = getItem(key)
    return value !== null && value !== ''
  },

  // 该方法接受一个键名作为参数，并把该键名从存储中删除。
  removeItem (key) {
    window.localStorage.removeItem(key)
  },

  // 调用该方法会清空存储中的所有键名
  clear () {
    window.localStorage.clear()
  }
}

export default {
  install (Vue, options) {
    // 全局方法
    Vue.localStore = localStore

    // Vue 实例方法
    Vue.prototype.$localStore = localStore
  }
}
