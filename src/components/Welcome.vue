<template>
  <div class="wel">
    <div class="title">欢迎使用码鱼公司后台管理系统</div>
    <div class="info">
       <a href="https://github.com/coder-chin" target="blank">Contact me: coder-chin</a>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.wel{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  .title{
    font-size: 50px;
  }
  .info{
    margin-top: 30px;
    font-size: 30px;
  }
}
</style>