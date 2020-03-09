<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain @click="showRoles">添加角色</el-button>
    <!-- 添加角色弹出对话框 -->
    <el-dialog title="添加角色" :visible.sync="showRolesDialog" width="30%">
      <!-- 添加用户表单 -->
      <el-form
        :model="rolesForm"
        ref="rolesForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 表格部分 -->
    <el-table :data="rolesLists" style="width: 100%">
      <!-- 表格拓展行 -->

      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- level1权限框 -->
          <el-row
            v-for="level1 in scope.row.children"
            :key="level1.id"
            class="level1"
          >
            <!-- level1权限内容 -->
            <el-col :span="4">
              <el-tag closable @close="dellevel(scope.row, level1.id)">{{
                level1.authName
              }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- level2权限框 -->
            <el-col :span="20">
              <el-col
                v-for="level2 in level1.children"
                :key="level2.id"
                class="level2"
              >
                <!-- level2权限内容 -->
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    @close="dellevel(scope.row, level2.id)"
                    >{{ level2.authName }}</el-tag
                  >
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- level3权限框 -->
                <el-col :span="20">
                  <!-- level3权限内容 -->
                  <el-tag
                    type="danger"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    closable
                    class="level3"
                    @close="dellevel(scope.row, level3.id)"
                    >{{ level3.authName }}</el-tag
                  >
                </el-col>
              </el-col>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改用户按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small "
            @click="showeEitRoles(scope.row)"
          ></el-button>
          <!-- 修改用户弹出对话框 -->
          <el-dialog
            title="修改用户"
            :visible.sync="showeditRolesDialog"
            width="30%"
          >
            <!-- 修改用户信的表单 -->
            <el-form
              :model="editRolesForm"
              :rules="rules"
              ref="editRolesForm"
              label-width="100px"
              class="demo-ruleForm"
              status-icon
            >
              <el-form-item label="角色名称">
                <el-input v-model="editRolesForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input v-model="editRolesForm.roleDesc"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="showeditRolesDialog = false">取 消</el-button>
              <el-button type="primary" @click="editRoles">添加</el-button>
            </span>
          </el-dialog>

          <!-- 删除用户按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small "
            @click="delRoles(scope.row)"
          ></el-button>

          <!-- 分配权限按钮 -->
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="small "
            @click="showDialog(scope.row)"
            >分配权限</el-button
          >
          <!-- 分配权限弹出对话框 -->
          <el-dialog
            title="分配权限"
            :visible.sync="showAssignDialog"
            width="30%"
            @closed="clearRight"
          >
            <!-- 分配权限的树状列表 -->
            <el-tree
              :data="assignList"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps"
            >
            </el-tree>

            <span slot="footer" class="dialog-footer">
              <el-button @click="showAssignDialog = false">取 消</el-button>
              <el-button type="primary" @click="assignRoles(scope.row)"
                >添加</el-button
              >
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesLists: [],
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      showRolesDialog: false,
      showeditRolesDialog: false,
      showAssignDialog: false,
      assignList: [], // 权限树状图的数据
      roleId: '',
      rules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ]
      },
      // 分配权限选项
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    showRoles() {
      this.showRolesDialog = true
    },
    showeEitRoles(row) {
      this.showeditRolesDialog = true
      this.editRolesForm.roleName = row.roleName
      this.editRolesForm.roleDesc = row.roleDesc
      this.editRolesForm.id = row.id
    },
    // 添加用户
    addRolesUser() {
      this.$refs.rolesForm.validate(async valie => {
        if (valie) {
          let res = await this.axios.post('roles', this.rolesForm)
          let {
            meta: { status }
          } = res.data
          if (status === 201) {
            this.showRolesDialog = false
            this.$refs.rolesForm.resetFields()
            this.getRoles()
          }
        } else {
          return false
        }
      })
    },
    // 修改用户
    async editRoles() {
      let res = await this.axios.put(
        `roles/${this.editRolesForm.id}}`,
        this.editRolesForm
      )
      let {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.showeditRolesDialog = false
        this.getRoles()
      } else {
        console.log('渲染失败')
      }
    },
    // 重新渲染roles
    async getRoles() {
      let res = await this.axios.get('roles')
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.rolesLists = data
      } else {
        console.log('渲染失败')
      }
    },
    // 删除角色
    async delRoles(row) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${row.id}`)
        console.log(res)
        let {
          meta: { status }
        } = res.data
        if (status === 200) {
          this.$message({
            type: 'success',
            message: '删除角色成功'
          })
          this.getRoles()
          console.log(res)
        } else {
          this.$message({
            type: 'danger',
            message: '删除失败'
          })
        }
      } catch (e) {}
    },
    // 删除角色指定权限
    async dellevel(row, rolesid) {
      let res = await this.axios.delete(`roles/${row.id}/rights/${rolesid}`)
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        row.children = data
      }
    },
    // 点击编辑权限按钮时的方法
    async showDialog(row) {
      this.showAssignDialog = true
      this.roleId = row.id
      let res = await this.axios.get('rights/tree')
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.assignList = data
      }

      // 用来接收角色已有的三级权限id
      let temp = []
      row.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            temp.push(level3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(temp)
    },
    // 分配权限
    async assignRoles(row) {
      let keys = this.$refs.tree.getCheckedKeys()
      let helfkeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = keys.concat(helfkeys).join(',')
      let res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      let {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.showAssignDialog = false
        this.$message.success('恭喜你，权限分配成功')
      } else {
        this.$message.info('权限分配失败')
      }
      this.getRoles()
    },
    // 退出编辑权限框时清空选择的
    clearRight() {
      this.$refs.tree.setCheckedKeys([])
    }
  },
  created() {
    this.getRoles()
  }
}
</script>

<style lang="less" scoped>
.level1 {
  border-bottom: 1px dashed #ccc;
  margin-top: 15px;
}
.level2 {
  margin-bottom: 15px;
}
.level3 {
  margin-right: 5px;
}
</style>
