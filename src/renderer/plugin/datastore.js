/**
 * Copyright © 2018-present, Knowlesys, Inc.
 * All rights reserved.
 *
 * @author: HFX 2018-03-06 15-10
 * @version 1.0
 */

import DataStore from 'nedb'
import path from 'path'
import {remote} from 'electron'

/**
 * neDB 实例
 * @type {*|Datastore}
 */
const db = new DataStore({
  autoload: true,
  timestampData: true,
  filename: path.join(remote.app.getPath('userData'), '/data.db')
})
export default {
  install (Vue, options) {
    // 全局方法
    Vue.db = db

    // 实例方法
    Vue.prototype.$db = db
  }
}
