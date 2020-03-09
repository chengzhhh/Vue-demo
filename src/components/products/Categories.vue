<template>
  <div class="categories">
    <el-button type="success" plain @click="showClass">添加分类</el-button>
    <el-table
      :data="categoryList"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="亲，等会，玩命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <!-- 下拉框 -->
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        :indent-size="20"
      >
      </el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否删除">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改用户按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small "
          ></el-button>

          <!-- 删除用户按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small "
            @click="delCate(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>

    <!-- 添加分类弹出框 -->
    <el-dialog title="添加商品分类" :visible.sync="showClassDialog" width="30%">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- 选择框 -->
        <el-form-item label="父级名称">
          <el-cascader
            clearable
            :options="options"
            :props="props"
            v-model="addForm.cat_pid"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showClassDialog = false">取 消</el-button>
        <el-button type="primary" @click="addClass">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var ElTreeGrid = require('element-tree-grid')
export default {
  data() {
    return {
      current: 1,
      pagesize: 10,
      categoryList: [],
      total: 0,
      pid: 0,
      loading: true,
      showClassDialog: false,
      addForm: {
        cat_name: '',
        cat_pid: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async getcategories() {
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      let {
        meta: { status },
        data: { result, total }
      } = res.data
      if (status === 200) {
        this.categoryList = result
        this.total = total
        setTimeout(() => {
          this.loading = false
        }, 809)
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.current = 1
      this.loading = true
      this.getcategories()
    },
    handleCurrentChange(val) {
      this.current = val
      this.loading = true
      this.getcategories()
    },
    async showClass() {
      this.showClassDialog = true
      let res = await this.axios.get('categories?type=2')
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
      }
    },
    addClass() {
      this.$refs.addForm.validate(async vaile => {
        if (vaile) {
          let { cat_pid: catPid, cat_name: catName } = this.addForm
          let res = await this.axios.post('categories', {
            cat_pid: catPid[catPid.length - 1] || 0,
            cat_name: catName,
            cat_level: catPid.length
          })
          let {
            meta: { status }
          } = res.data
          console.log(status)
          if (status === 201) {
            this.$message.success('添加成功')
            this.showClassDialog = false
            this.addForm.cat_name = ''
            this.$refs.addForm.resetFields()
            this.getcategories()
          }
        } else {
          console.log('表单验证失败')
        }
      })
    },
    async delCate(row) {
      try {
        await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${row.cat_id}`)
        let {
          meta: { status }
        } = res.data
        if (status === 200) {
          this.getcategories()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    }
  },
  components: {
    'el-table-tree-column': ElTreeGrid
  },
  async created() {
    this.getcategories()
  }
}
</script>

<style lang="less" scoped>
.categories {
  width: 100%;
  height: 100%;
}
</style>
