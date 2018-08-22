<template>
  <div class="file-tool">
    <h2>打开文件</h2>
    <br>
    <Form inline @submit.native.prevent>
      <FormItem prop="user">
        <i-input v-model.trim="path"
                 icon="ios-plus-empty"
                 @on-click="handleInputClick"
                 @keypress.enter.native="openPath(path)"
                 placeholder="输入路径例如：192.168.1.7/hfx" style="width: 450px">
          <Icon type="android-folder" slot="prepend"></Icon>
        </i-input>

      </FormItem>
      <FormItem>
        <Button type="primary" @click="openPath(path)">打开</Button>
      </FormItem>
    </Form>

    <small>for *nux only</small>

    <ul>
      <li v-for="(sc, key) in shortcutsHistory"
          style="cursor: pointer"
          @click="openPath(path = sc)"
          :key="key">{{sc}}</li>
    </ul>

    <div>
      <br>
      <h3>快捷路径：</h3>
      <br>
      <tag v-for="(shortcut, key) in shortcuts"
           type="dot"
           :key="key"
           @click.native="openPath(shortcut.path)"
           closable
           @on-close="handleRemoveShortcut(key)"
           color="blue">{{shortcut.label}}</tag>
      <i-button type="dashed" @click="handleInputClick">+</i-button>
    </div>
    <modal v-model="createModal.show"
           @on-visible-change="handleCreateModalVisibleChange"
           class-name="modal-wrap">
      <div slot="header">
        <strong>
          <icon type="plus-round"></icon>
          添加快捷方式</strong>
      </div>

      <i-form :label-width="80"
              ref="create-form">
        <form-item label="路径">
          <i-input v-model="createModal.form.path"></i-input>
        </form-item>
        <form-item label="名称">
          <i-input v-model="createModal.form.label"></i-input>
        </form-item>
      </i-form>

      <div slot="footer">
        <i-button size="small"
                  @click="createModal.show = false"
                  type="text">取消
        </i-button>
        <i-button size="small"
                  @click="handleCreateShortcut"
                  type="primary">确定
        </i-button>
      </div>
    </modal>
  </div>
</template>
<style lang="less">
  .file-tool {
    display: flex;
    padding-top: 25vh;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
  }
</style>
<script>
  import {exec} from 'child_process'

  export default {
    data () {
      let shortcuts = this.$localStore.getItem(this.$localStore.Keys.DIR_SHORTCUT)
      let shortcutsHistory = this.$localStore.getItem(this.$localStore.Keys.DIR_HISTORY)

      return {
        path: '',
        createModal: {
          show: false,
          form: {
            label: '',
            path: ''
          }
        },
        shortcuts: Array.isArray(shortcuts) ? shortcuts : [],
        shortcutsHistory: Array.isArray(shortcutsHistory) ? shortcutsHistory : []
        /* shortcuts: [
          {
            label: '工作日志',
            path: '\\\\192.168.1.7\\乐思工作日志\\开发部\\HFX\\2018\\'
          },
          {
            label: '日常工作管理目录 my_project',
            path: '/home/hfx/Desktop/my_project'
          },
          {
            label: 'KWM2017 项目',
            path: '\\\\192.168.1.7\\乐思重要项目中心\\KWM2017项目\\'
          },
          {
            label: 'KIS 更新包',
            path: '\\\\192.168.1.7\\乐思重要项目中心\\WM2期项目\\更新包'
          },
          {
            label: '日常评分',
            path: '\\\\192.168.1.7\\开发部平台\\_奖罚制度\\'
          }
        ] */
      }
    },
    methods: {
      openPath (path) {
        let platform = process.platform
        if (path === '') return

        switch (platform) {
          case 'win32':
            if (path.startsWith('smb:')) {
              path = path.replace('smb:', '')
            }
            path = path.replace(/\//g, '\\')
            break
          case 'linux':
            let cmd = 'nautilus'
            // 1. `//` 或者 `\\` 开头的表示一个远程地址，使用 smb 协议打开
            // 并且支持 Windows 格式的 `\\`
            // 这个要放在步骤 2 之前，保证先执行
            if (path.startsWith('//') || path.startsWith('\\\\')) {
              path = 'smb:' + path
              path = path.replace(/\\/g, '/')
              path = encodeURI(path)
              exec(`${cmd} ${path}`, this.execCallback)
              return
            }

            // 2. 类似于 /home/hfx/Desktop 的
            if (path.startsWith('/')) {
              exec(`${cmd} ${path}`, this.execCallback)
              return
            }

            // 3. 直接用全协议的，例如：http://, smb://
            let schemaRegex = /^\w+:\/\//
            if (schemaRegex.test(path)) {
              exec(`${cmd} ${path}`, this.execCallback)
              return
            }

            // 4. 直接 IP 开始的
            let ipRegExp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
            if (ipRegExp.test(path)) {
              path = 'smb://' + path
              path = path.replace(/\\/g, '/')
              exec(`${cmd} ${path}`, this.execCallback)
              return
            }
            alert('无法打开地址！')
            break
          default:
            break
        }
      },
      execCallback (err, stdout, stderr) {
        if (err) {
          this.$Message.error(err)
          return
        }
        let s = new Set(this.shortcutsHistory)
        s.add(this.path)
        this.shortcutsHistory = Array.from(s).reverse()
        if (this.shortcutsHistory.length > 10) {
          // 移除最后一个
          this.shortcutsHistory.splice(-1, 1)
        }
      },
      handleInputClick () {
        this.createModal.show = true
        this.createModal.form.path = this.path
      },
      handleCreateShortcut () {
        this.createModal.show = false
        this.doAddShortcut()
      },
      doAddShortcut () {
        let shortcuts = this.$localStore.getItem(this.$localStore.Keys.DIR_SHORTCUT)
        shortcuts = Array.isArray(shortcuts) ? shortcuts : []
        shortcuts.push(this.createModal.form)
        this.shortcuts = shortcuts
        this.$localStore.setItem(this.$localStore.Keys.DIR_SHORTCUT, shortcuts)
      },
      handleCreateModalVisibleChange (visible) {
        console.log(visible)
        if (!visible) {
          this.$refs['create-form'].resetFields()
        }
      },
      handleRemoveShortcut (index) {
        this.shortcuts.splice(index, 1)
        this.$localStore.setItem(this.$localStore.Keys.DIR_SHORTCUT, this.shortcuts)
      }
    },
    components: {}
  }
</script>