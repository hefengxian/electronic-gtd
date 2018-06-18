<template>
  <div class="todo">
    <div class="list">
      <div class="search-box">
        <i-input placeholder="Search"
                 class="search"
                 icon="search"
                 size="small"></i-input>
        <i-button size="small"
                  @click="createStuffModal = true"
                  type="primary">
          <icon type="plus-round"></icon>
        </i-button>
      </div>
      <div class="filter">
        <tabs v-model="conditions.status"
              @on-click="loadStuffList()"
              :animated="false"
              size="small">
          <tab-pane label="所有" name="all"></tab-pane>
          <tab-pane label="待办" name="todo"></tab-pane>
          <tab-pane label="进行中" name="running"></tab-pane>
          <tab-pane label="完成" name="done"></tab-pane>
        </tabs>
      </div>
      <div class="actions">
        <button-group size="small">
          <i-button :disabled="!hasStuffSelect"
                    @click="changeStuffStat('running')"
                    title="将任务状态设置为正在运行"
                    type="text"
                    icon="play"></i-button>
          <i-button :disabled="!hasStuffSelect"
                    title="将任务状态设置为完成"
                    @click="changeStuffStat('done')"
                    type="text"
                    icon="android-checkmark-circle"></i-button>
          <i-button :disabled="!hasStuffSelect"
                    title="编辑当前任务"
                    @click="editStuffModal = true"
                    type="text"
                    icon="edit"></i-button>
          <i-button :disabled="!hasStuffSelect"
                    title="删除当前任务"
                    @click="removeStuff"
                    type="text"
                    icon="trash-a"></i-button>
        </button-group>
      </div>
      <ul class="items">
        <li v-for="(stuff, index) in todoList"
            class="item"
            :class="{'active': currentStuff._id === stuff._id, [`item-${stuff.status}`]: true}"
            @click="currentStuff = stuff"
            :key="index">
          <div class="title-box">
            <div class="title">{{stuff.title}}</div>
            <div class="time">{{formatDate(stuff.createdAt)}}</div>
          </div>
          <div class="desc">{{stuff.desc}}</div>
          <!--<div class="item"
               :class="`item-${stuff.status}`">

          </div>-->
        </li>
      </ul>
    </div>
    <div v-if="hasStuffSelect" class="detail">
      <div class="meta">
        <div class="title">{{currentStuff.title}}</div>
        <div class="desc">{{currentStuff.desc}}</div>
      </div>
      <div class="steps"
           ref="steps"
           id="steps">
        <steps direction="vertical"
               v-if="!isStepEmpty">
          <step v-for="(step, idx) in currentStuff.steps"
                :key="idx"
                @mouseenter.native="$set(step, '_showAction', true)"
                @mouseleave.native="$set(step, '_showAction', false)"
                :status="step.status"
                :title="step.title">
            <button-group size="small"
                          v-if="step._showAction"
                          class="step-actions">
              <i-button type="ghost"
                        title="开始处理此步骤"
                        @click="changeStepStatus(idx, 'process')">
                <icon type="play"></icon>
              </i-button>
              <i-button type="ghost"
                        title="步骤完成"
                        @click="changeStepStatus(idx, 'finish')">
                <icon type="android-checkmark-circle"></icon>
              </i-button>
              <i-button type="ghost"
                        @click="showEditStepRemark(idx)"
                        title="编写备注">
                <icon type="compose"></icon>
              </i-button>
              <i-button type="ghost"
                        title="删除此步骤"
                        @click="removeStep(idx)">
                <icon type="trash-b"></icon>
              </i-button>
            </button-group>
            <div class="step-detail">
              <div class="step-detail-desc markdown-body"
                   v-html="markdown.render(step.desc)"></div>
              <div class="step-detail-extra">{{formatDate(step.createdAt)}}</div>
            </div>
          </step>
        </steps>
      </div>

      <!-- 添加新步骤表单 -->
      <div class="step-form">
        <i-input v-model="newStep"
                 @keypress.enter.native="addStep"
                 placeholder="创建新的步骤"></i-input>
      </div>
    </div>

    <!-- 添加待办事项表单 -->
    <modal v-model="createStuffModal"
           class-name="modal-wrap">
      <div slot="header">
        <strong>
          <icon type="plus-round"></icon>
          添加待办事项</strong>
      </div>

      <i-form :label-width="80">
        <form-item label="事项">
          <i-input v-model="createStuffForm.title" placeholder="简要的说明待办事项"></i-input>
        </form-item>
        <form-item label="备注">
          <i-input v-model="createStuffForm.desc"
                   type="textarea"
                   placeholder="待办事项额外信息"></i-input>
        </form-item>
      </i-form>

      <div slot="footer">
        <i-button size="small"
                  @click="createStuffModal = false"
                  type="text">取消
        </i-button>
        <i-button size="small"
                  @click="createStuff"
                  type="primary">确定
        </i-button>
      </div>
    </modal>

    <modal v-model="editStuffModal"
           class-name="modal-wrap">
      <div slot="header">
        <strong>
          <icon type="edit"></icon>
          修改待办事项</strong>
      </div>

      <i-form :label-width="80">
        <form-item label="事项">
          <i-input v-model="currentStuff.title" placeholder="简要的说明待办事项"></i-input>
        </form-item>
        <form-item label="备注">
          <i-input v-model="currentStuff.desc"
                   type="textarea"
                   placeholder="待办事项额外信息"></i-input>
        </form-item>
      </i-form>

      <div slot="footer">
        <i-button size="small"
                  @click="editStuffModal = false"
                  type="text">取消
        </i-button>
        <i-button size="small"
                  @click="updateStuff(currentStuff)"
                  type="primary">确定
        </i-button>
      </div>
    </modal>

    <modal v-model="stepRemarkModal"
           class-name="modal-wrap"
           width="80"
           :mask-closable="false">
      <div slot="header">
        <strong>
          <icon type="plus-round"></icon>
          备注</strong>
      </div>
      <mavon-editor
        :font-size="'12px'"
        :value="stepRemark"
        style="height: 70vh; max-height: 100vh"
        :external_link="false"
        :toolbars="mavonToolbars"
        @change="handleSaveStepRemark"
        @save="handleSaveStepRemark"
        :ishljs="true"></mavon-editor>
      <div slot="footer">
        <i-button size="small"
                  @click="stepRemarkModal = false"
                  type="text">取消
        </i-button>
        <i-button size="small"
                  @click="stepRemarkModal = false"
                  type="primary">确定
        </i-button>
      </div>
    </modal>
  </div>
</template>
<script>
  import moment from 'moment'
  import MavonEditor from 'mavon-editor'

  moment.locale('zh-CN')

  export default {
    data () {
      let markdown = MavonEditor.markdownIt
      return {
        createStuffModal: false,
        markdown,
        createStuffForm: {
          title: '',
          desc: '',
          status: 'todo',
          steps: []
        },
        editStuffModal: false,
        conditions: {
          status: 'all'
        },
        stepRemarkModal: false,
        stepRemark: '',
        newStep: '',
        currentStepIndex: -1,
        todoList: [],
        currentStuff: {},
        deleteModal: false,
        mavonToolbars: {
          bold: true, // 粗体
          // italic: true, // 斜体
          // header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          // superscript: true, // 上角标
          // subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          // link: true, // 链接
          // imagelink: true, // 图片链接
          // code: true, // code
          table: true, // 表格
          // fullscreen: true, // 全屏编辑
          // readmodel: true, // 沉浸式阅读
          // htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          // undo: true, // 上一步
          // redo: true, // 下一步
          // trash: true, // 清空
          // save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          // alignleft: true, // 左对齐
          // aligncenter: true, // 居中
          // alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true // 单双栏模式
          // preview: true // 预览
        }
      }
    },
    created () {
      this.loadStuffList()
    },
    computed: {
      hasStuffSelect () {
        return Array.isArray(this.currentStuff.steps)
      },
      isStepEmpty () {
        if (this.hasStuffSelect) {
          return this.currentStuff.steps.length < 1
        }
        return true
      }
    },
    mounted () {
    },
    methods: {
      // 加载所有的代办事件
      loadStuffList (find = {}, sort = {}, skip = 0, limit = -1) {
        let params = {
          find: {
            ...this.conditions,
            ...find
          },
          sort: {
            createdAt: -1,
            ...sort
          },
          skip,
          limit
        }

        if (params.find.status && params.find.status === 'all') {
          delete params.find.status
        }
        // console.log(params, this.conditions)

        this.$db.find(params.find)
          .sort(params.sort)
          .exec((e, docs) => {
            this.todoList = docs
          })
      },

      // 创建新的代办事项
      createStuff () {
        this.$db.insert(this.createStuffForm, (err, newDoc) => {
          if (err !== null) {
            this.$Message.error(err)
          }
          this.loadStuffList()
        })
        this.createStuffModal = false
      },

      // 格式化日期
      formatDate (date) {
        return moment(date).fromNow()
      },

      // 删除一个待办事项
      removeStuff () {
        this.$db.remove({_id: this.currentStuff._id}, {}, (err, numRemoved) => {
          if (err !== null) {
            this.$Message.error(err)
          }
          this.currentStuff = {}
          this.loadStuffList()
        })
      },

      // 改变一个事项的状态
      changeStuffStat (status) {
        this.currentStuff.status = status
        this.updateStuff(this.currentStuff)
      },

      // 持久化事项的更新
      updateStuff (stuff) {
        let query = {_id: this.currentStuff._id}
        this.$db.update(query, stuff, {}, (err, numRepalced) => {
          if (err !== null) {
            // this.$Message.error(err)
            console.log(err)
          } else {
            this.loadStuffList()
          }
        })
        this.editStuffModal = false
      },

      // 添加一个步骤
      addStep () {
        if (this.newStep.trim() !== '') {
          let query = {_id: this.currentStuff._id}
          let step = {
            title: this.newStep,
            desc: '',
            status: 'wait',
            createdAt: new Date()
          }
          let update = {$push: {steps: step}}

          this.$db.update(query, update, {}, (err, numReplaced) => {
            if (err !== null) {
              this.$Message.error(err)
            } else {
              this.currentStuff.steps.push(step)
              this.newStep = ''
              this.loadStuffList()
              this.$nextTick(() => {
                // 滚动到底部
                this.$refs.steps.scrollTop = this.$refs.steps.scrollHeight
              })
            }
          })
        }
      },

      // 显示步骤的描述编辑
      showEditStepRemark (index) {
        this.currentStepIndex = index
        let step = this.currentStuff.steps[index]
        // 设置 stepRemark 的值
        this.stepRemark = step.desc
        // 显示模态框
        this.stepRemarkModal = true
      },

      handleSaveStepRemark (val, renderVal) {
        if (this.currentStuff.steps) {
          this.currentStuff.steps[this.currentStepIndex].desc = val
          this.updateStep()
        }
      },

      // 更改步骤的状态
      changeStepStatus (index, status) {
        // 更新
        this.currentStuff.steps[index].status = status
        this.updateStep()
      },

      updateStep () {
        let query = {_id: this.currentStuff._id}
        let steps = this.currentStuff.steps
        let update = {$set: {steps}}
        this.$db.update(query, update, {}, (err, numReplaced) => {
          if (err !== null) {
            this.$Message.error(err)
          } else {
            this.loadStuffList()
          }
        })
      },

      // Remove Step
      removeStep (index) {
        this.currentStuff.steps.splice(index, 1)
        this.updateSteps(this.currentStuff.steps)
      },

      // 更新 Steps 到 db
      updateSteps (steps) {
        let query = {_id: this.currentStuff._id}
        let update = {$set: {steps}}
        this.$db.update(query, update, {}, (err, numReplaced) => {
          if (err !== null) {
            this.$Message.error(err)
          } else {
            this.loadStuffList()
          }
        })
      }
    },
    components: {}
  }
</script>
<style lang="less">
  @muted-text-color: #999;

  .lineEllipsis(@line: 2) {
    display: -webkit-box;
    /* chrome 支持，文本超过 2 行显示 ... */
    -webkit-line-clamp: @line;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .base-font {
    font-size: 12px;
  }

  .message {
    flex: 1;
    width: 100%;
    text-align: center;

    & .icon {
      font-size: 24px;
    }
    & .content {
      color: fade(@muted-text-color, 50%);
    }
  }

  .todo {
    height: 100vh;
    overflow: hidden;
    display: flex;

    & .list {
      width: 250px;
      background-color: #f9f9f9;
      padding: 16px;
      height: 100vh;
      display: flex;
      flex-direction: column;

      & .search-box {
        & .search {
          width: calc(100% - 32px);
        }
      }
      & .filter {
        margin: 0 -16px;
        margin-top: 8px;
      }
      & .actions {
        margin: 0 -16px;
        display: flex;
        padding-bottom: 8px;
        border-bottom: 1px #dddee1 solid;
        justify-content: flex-end;
      }
      & .items {
        margin: 0 -16px;
        overflow: auto;
        flex: 1;
        & .active {
          background-color: #c7c6c6;
        }

        & .item-done {
          & .title-box .title, & .desc {
            color: @muted-text-color !important;
            text-decoration: line-through;
          }
        }

        & .item {
          padding: 8px 16px;
          display: flex;
          cursor: pointer;
          flex-direction: column;

          &:hover {
            background-color: #d7d6d6;
          }

          & .title-box {
            flex: 1;
            display: flex;
            padding-bottom: 8px;

            // 待办标题
            & .title {
              flex: 1;
              color: #2D8cF0;
              font-size: 14px;
              font-weight: bold;
              .lineEllipsis(1);
            }

            // 创建时间
            & .time {
              padding-left: 16px;
              color: @muted-text-color;
              text-align: right;
              .lineEllipsis(1);
            }
          }

          // 描述
          & .desc {
            flex: 1;
            color: @muted-text-color;
            .lineEllipsis(2);
          }
        }
      }
    }

    & .detail {
      flex: 1;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      & .meta {
        padding: 16px;
        border-bottom: 1px #dddee1 solid;

        & .title {
          font-size: 1.2em;
          .lineEllipsis(1);
        }

        & .desc {
          color: @muted-text-color;
          .lineEllipsis(2);
        }
      }

      & .steps {
        flex: 1;
        display: flex;
        padding: 16px 24px;
        overflow: auto;

        & .step-actions {
          position: absolute;
          right: 0;
          background-color: #fff;
          z-index: 5;
        }

        & .step-detail {
          display: flex;
          font-size: 12px;
          color: @muted-text-color;
          margin-bottom: 8px;
          &-desc {
            flex: 1;
          }
          &-extra {
            width: 100px;
            text-align: right;
          }
        }
      }

      & .step-form {
        border-top: 1px #dddee1 solid;
        padding: 16px;
      }
    }

    & .message {

    }
  }

  .markdown-body {
    & ul {
      list-style: initial !important;
    }
    & ol {
      list-style: decimal !important;
    }
  }

</style>