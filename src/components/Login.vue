<template>
  <div class="login">
    <el-form
      status-icon
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
    >
      <img src="../assets/user.jpg" alt />
      <el-form-item label="账号" prop="username">
        <el-input placeholder="请输入账号" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          placeholder="请输入密码"
          type="password"
          v-model="form.password"
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    /* //提交登录信息时的方法 */
    login() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let e = await this.axios({
            url: 'login',
            method: 'post',
            data: this.form
          })
          /*  //当返回的状态码为200时进行锚点跳转 */
          if (e.data.meta.status === 200) {
            /* //登录成功 */
            this.$message.success('恭喜你登陆成功')
            // 存储token到本地存储中
            localStorage.setItem('myToken', e.data.data.token)
            /*  //采用编程式路由形式，锚点地址跳转到home */
            this.$router.push('home')
          } else {
            /* //登录失败 */
            this.$message.error('密码输入错误')
          }
        } else {
          // 表单规则验证失败的时候提示
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  background: url('../assets/cat-1285634_1280.png') center center no-repeat;
  background-size: 100%;
  height: 100%;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
  }
  img {
    position: absolute;
    z-index: 99;
    width: 100px;
    height: 100px;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    border: 10px solid #fff;
  }
  //选择第一个兄弟
  .el-button + .el-button {
    margin-left: 80px;
  }
}
</style>
