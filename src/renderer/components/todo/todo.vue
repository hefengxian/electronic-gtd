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
        <tabs value="todo" size="small">
          <tab-pane label="待办" name="todo"></tab-pane>
          <tab-pane label="进行中" name="running"></tab-pane>
          <tab-pane label="完成" name="finish"></tab-pane>
        </tabs>
      </div>
      <div class="actions">
        <button-group size="small">
          <i-button :disabled="!hasStuffSelect" type="text" icon="android-checkmark-circle"></i-button>
          <i-button :disabled="!hasStuffSelect" type="text" icon="edit"></i-button>
          <i-button :disabled="!hasStuffSelect"
                    @click="showDeleteModal"
                    type="text"
                    icon="trash-a"></i-button>
        </button-group>
      </div>
      <ul class="items">
        <li v-for="(stuff, index) in todoList"
            :class="{'active': currentStuff._id === stuff._id}"
            @click="currentStuff = stuff"
            :key="index">
          <div class="item">
            <div class="title-box">
              <div class="title">{{stuff.title}}</div>
              <div class="time">{{formatDate(stuff.createdAt)}}</div>
            </div>
            <div class="desc">{{stuff.desc}}</div>
          </div>
        </li>
      </ul>
      <div class="message"></div>
    </div>
    <div class="detail">
      <div class="meta">
        <div class="title">你好啊，Hello World 叮叮咚咚</div>
        <div class="desc">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos enim error incidunt iure, maxime sed
          sequi. A, ab aspernatur dolor dolorum expedita fugiat magnam nihil officia, officiis, placeat quidem sunt.
        </div>
      </div>
      <div class="steps" v-if="">
        <steps :current="15" direction="vertical">
          <step v-for="i in 10"
                :key="i"
                title="已完成">
            <button-group size="small"
                          v-if="false"
                          style="position: absolute; right: 0">
              <i-button type="ghost">
                <Icon type="android-checkmark-circle"></Icon>
              </i-button>
              <i-button type="ghost">
                <icon type="play"></icon>
              </i-button>
              <i-button type="ghost">
                <icon type="compose"></icon>
              </i-button>
              <i-button type="ghost">
                <icon type="trash-b"></icon>
              </i-button>
            </button-group>
            <div class="step-desc"></div>

          </step>
        </steps>
      </div>
      <div class="step-form">
        <i-input v-model="newStep" placeholder="创建新的步骤"></i-input>
      </div>
      <div v-if="false" class="message"></div>
    </div>

    <!-- 添加待办事项表单 -->
    <modal v-model="createStuffModal">
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
                  type="primary">添加
        </i-button>
      </div>
    </modal>
  </div>
</template>
<script>
  import moment from 'moment'

  moment.locale('zh-CN')

  export default {
    data () {
      return {
        createStuffModal: false,
        createStuffForm: {
          title: '',
          desc: '',
          status: 0,
          steps: []
        },
        newStep: '',
        todoList: [],
        currentStuff: {}
      }
    },
    created () {
      this.$db.find({}, (e, docs) => {
        this.todoList = docs
      })
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
      loadStuffList () {
        this.$db.find({}, (e, docs) => {
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
      formatDate (date) {
        return moment(date).calendar()
      },
      showDeleteModal () {
        this.$Modal.warning({
          title: '删除代办事项',
          content: `你确定要删除选择的代办事项`
          /* onOk () {
            console.log(this)
            this.$db.remove({_id: this.currentStuff._id}, {}, (err, numRemoved) => {
              if (err !== null) {
                this.$Message.error(err)
              }
              this.loadStuffList()
            })
          } */
        })
      }
    },
    components: {}
  }
</script>
<style lang="less">
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

  @muted-text-color: #666;

  .todo {
    height: 100vh;
    overflow: hidden;
    display: flex;

    & .list {
      width: 250px;
      background-color: #f5f5f5;
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

            // 待办标题
            & .title {
              flex: 1;
              color: #000;
              font-size: 1.2em;
              font-weight: normal;
              .lineEllipsis(1);
            }

            // 创建时间
            & .time {
              width: 80px;
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
        padding: 16px 24px;
        overflow: auto;

        & .step-desc {
          font-size: 12px;
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
</style>