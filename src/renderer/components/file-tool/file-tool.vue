<template>
  <div class="file-tool">
    <h2>打开文件</h2>
    <br>
    <Form inline @submit.native.prevent>
      <FormItem prop="user">
        <i-input v-model.trim="path"
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

    <div>
      <br>
      <h3>快捷路径：</h3>
      <br>
      <tag v-for="(shortcut, key) in shortcuts"
           type="dot"
           :key="key"
           @click.native="openPath(shortcut.path)"
           color="blue">{{shortcut.label}}</tag>
    </div>
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
      return {
        path: '',
        shortcuts: [
          {
            label: '工作日志',
            path: '\\\\192.168.1.7\\乐思工作日志\\开发部\\HFX\\2018\\'
          },
          {
            label: '日常工作管理目录 my_project',
            path: '/home/hfx/Desktop/my_project'
          },
          {
            label: 'KWM2017项目',
            path: '\\\\192.168.1.7\\乐思重要项目中心\\KWM2017项目\\'
          }
        ]
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
        console.log(err, stdout, stderr)
      }
    },
    components: {}
  }
</script>