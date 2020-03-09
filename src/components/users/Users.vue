<template>
  <div class="login">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input
      placeholder="请输入内容"
      v-model="query"
      class="input-with-select"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="search"
      ></el-button>
    </el-input>
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="addDialogVisible = true"
      >用户添加</el-button
    >
    <!-- 表格部分 -->
    <el-table :data="userlists" style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="200"
      ></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <el-table-column prop="email" label="用户状态" width="200">
        <!-- 开关 -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="操作">
        <template slot-scope="scope">
          <!-- 修改用户按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small "
            @click="editDialog(scope.row)"
          ></el-button>
          <!-- 删除用户按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small "
            @click="delUser(scope.row)"
          ></el-button>
          <!-- 分配用户权限 -->
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="small "
            @click="showAssign(scope.row)"
            >点击修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>

    <!-- 添加用户弹出框 -->
    <el-dialog title="用户添加" :visible.sync="addDialogVisible" width="30%">
      <!-- 添加用户的表单 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">添加</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息弹出框 -->
    <el-dialog title="用户修改" :visible.sync="editDialogVisible" width="30%">
      <!-- 修改用户信的表单 -->
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="用户名">
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">添加</el-button>
      </span>
    </el-dialog>

    <!-- 分配用户弹出对话框 -->
    <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="30%">
      <!-- 分配用户的表单 -->
      <el-form
        :model="assignForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="用户名">
          <el-tag type="info">{{ assignForm.username }}</el-tag>
        </el-form-item>
        <el-form-item>
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignUser">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //
      query: '', // 查询的关键字
      current: 1, // 当前页
      pageSize: 2, // 每页显示的条数
      userlists: [],
      total: 0,
      addDialogVisible: false, // 添加用户弹出框状态
      editDialogVisible: false, // 编辑用户弹出框状态
      assignDialogVisible: false, // 分配权限弹出框状态
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      assignForm: {
        username: '',
        rid: '',
        id: ''
      },
      options: [],
      // 表单校验规则
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '用户名长度为3-9位', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { min: 6, max: 12, message: '密码长度为6-12位', trigger: 'change' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 當選擇每頁顯示的條數發生改變時觸發的事件
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getuser()
    },
    // 當當前頁發生改變時觸發的事件
    handleCurrentChange(val) {
      this.current = val
      this.getuser()
    },
    // 关键字搜索框方法
    search() {
      this.current = 1
      this.getuser()
    },
    // 重新渲染userlist
    getuser() {
      this.axios({
        url: 'users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      }).then(res => {
        this.userlists = res.data.data.users
        this.total = res.data.data.total
      })
    },
    // 用户状态修改方法
    async changeStatus(row) {
      let res = await this.axios({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: 'put'
      })
      let status = res.data.meta.status
      if (status === 200) {
        this.$message({
          message: '状态修改成功了',
          type: 'success'
        })
      } else {
        this.$message({
          message: '状态修改失败',
          type: 'warning'
        })
      }
    },
    // 添加用户模块
    addUser() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let res = await this.axios({
            method: 'post',
            url: 'users',
            data: this.addForm
          })
          if (res.data.meta.status === 201) {
            this.addDialogVisible = false
            this.$message({
              message: '恭喜你，用户创建成功',
              type: 'success'
            })
            // 清空表单的内容
            this.$refs.addForm.resetFields()
            // 求最大的页码
            this.total++
            this.current = Math.ceil(this.total / this.pageSize)
            this.getuser()
          } else if (res.data.meta.status === 400) {
            this.$message('用户名已存在')
          } else {
            this.$message({
              message: '添加用户失败',
              type: 'danger'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除用户
    async delUser(user) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`users/${user.id}`)
        let {
          meta: { status }
        } = res.data
        if (status === 200) {
          this.$message.success('恭喜你，删除用户成功了')
          if (this.userlists.length === 1 && this.current > 1) {
            this.current = this.current - 1
          }
          this.getuser()
        } else {
          this.$message.danger('删除用户失败')
        }
      } catch (e) {}
    },
    // 显示修改对话框
    editDialog(row) {
      this.editDialogVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 修改用户信息
    editUser() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let e = await this.axios.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (e.data.meta.status === 200) {
            this.$message({
              message: '恭喜你，修改用户成功',
              type: 'success'
            })
            this.getuser()
            this.editDialogVisible = false
          } else {
            this.$message({
              message: '修改用户失败',
              type: 'danger'
            })
            return false
          }
        } else {
          return false
        }
      })
    },
    // 显示分配权限框
    async showAssign(row) {
      this.assignDialogVisible = true
      this.assignForm.username = row.username
      this.assignForm.id = row.id
      let res = await this.axios.get(`users/${row.id}`)
      let {
        meta: { status },
        data
      } = res.data
      console.log(data)
      if (status === 200) {
        if (data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = data.rid
        }
      }
      this.getRoleList()
    },
    // 显示用户列表数据
    async getRoleList() {
      // 获取角色的列表信息
      let res = await this.axios.get('roles')
      let {
        meta: { status },
        data
      } = res.data
      console.log('123', data)
      if (status === 200) {
        this.options = data
      }
    },
    // 给用户分配权限
    async assignUser() {
      if (!this.assignForm.rid) {
        this.$message.error('选项不能为空')
        return
      }
      let res = await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })
      let {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.assignDialogVisible = false
      }
    }
  },

  // 当users组件一创建的时候就渲染userlist
  created() {
    this.getuser()
  }
}
</script>

<style lang="less" scoped>
.el-input {
  margin-bottom: 15px;
  width: 300px;
}

.el-table__body {
  width: 100px;
}
</style>
