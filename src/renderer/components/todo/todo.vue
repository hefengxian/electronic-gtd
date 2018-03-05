<template>
  <div class="todo">
    <div class="list">
      <div class="search-box">
        <i-input placeholder="Search"
                 class="search"
                 icon="search"
                 size="small"></i-input>
        <i-button size="small"
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
        <Button size="small" type="text" icon="edit"></Button>
        <Button size="small" type="text" icon="trash-a"></Button>
        <Button size="small" type="text" icon="ios-color-filter-outline"></Button>
      </div>
      <ul class="items">
        <li v-for="i in 10">
          <div class="item">
            <div class="title-box">
              <div class="title">{{i}} - 你好啊，Hello World 叮叮咚咚</div>
              <div class="time">今天 13:15</div>
            </div>
            <div class="desc">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos enim error incidunt iure, maxime sed sequi. A, ab aspernatur dolor dolorum expedita fugiat magnam nihil officia, officiis, placeat quidem sunt.
            </div>
          </div>
        </li>
      </ul>
      <div class="message"></div>
    </div>
    <div class="detail">
      <div class="meta">

      </div>
      <div class="steps"></div>
      <div class="step-form"></div>
      <div class="message"></div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
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

        & .item {
          padding: 8px 16px;
          display: flex;
          cursor: pointer;
          flex-direction: column;
          
          &:hover {
            background-color: #c7c6c6;
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
              width: 70px;
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
    }

    & .message {

    }
  }
</style>