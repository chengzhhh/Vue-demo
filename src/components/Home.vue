<template>
  <el-container class="home">
    <!-- 头部部分 -->
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        <span>欢迎光临</span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>
      <div class="title">
        <h3>电商后台管理系统</h3>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-col :span="12">
          <el-menu
            :default-active="$route.path.slice(1).split('-')[0]"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            router
          >
            <el-submenu
              :index="level1.path"
              v-for="level1 in menusList"
              :key="level1.id"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ level1.authName }}</span>
              </template>
              <el-menu-item
                v-for="level2 in level1.children"
                :key="level2.id"
                :index="level2.path"
              >
                <i class="el-icon-menu"></i>
                <span slot="title">{{ level2.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <!-- 主体部分 -->
      <el-main>
        <!-- 其他组件显示在这里面 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList: []
    }
  },
  methods: {
    async logout() {
      try {
        await this.$confirm('即将推出登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('myToken')
        this.$router.push('/login')
        this.$message({
          type: 'info',
          message: '退出登录成功'
        })
      } catch (e) {}
    }
  },
  async created() {
    // 获取侧边栏菜单，根据登录时传的token，服务器端就会返回相对应的数据
    let res = await this.axios.get('menus')
    let {
      meta: { status },
      data
    } = res.data
    if (status === 200) {
      this.menusList = data
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    .logo {
      float: left;
      height: 60px;
      width: 180px;
      background: url(../assets/logo.png) center center no-repeat;
      background-size: contain;
    }
    .logout {
      float: right;
      width: 180px;
      height: 60px;
      text-align: left;
      line-height: 60px;
      font-weight: 700;
      a {
        font-weight: 700;
        color: #b07a17;
        text-decoration: none;
      }
    }
    .title {
      overflow: hidden;
      height: 60px;
      color: #fff;
      text-align: center;
      line-height: 60px;
      font-size: 30px;
    }
  }
  .el-container {
    height: 100%;
    .el-aside {
      background-color: rgb(84, 92, 100);
      .el-submenu {
        //侧边栏样式
        width: 200px;
      }
    }
    .el-main {
      background-color: #eaeef1;
    }
  }
}
</style>
