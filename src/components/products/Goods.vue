<template>
  <div class="goods">
    <el-button type="success" plain @click="$router.push('goods-add')"
      >添加商品</el-button
    >
    <!-- 表格部分 -->
    <el-table :data="goodsList" style="width: 100%">
      <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
      <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.add_time | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
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
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[20, 40, 60, 80, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagenum: 1,
      pagesize: 20,
      total: 0,
      goodsList: []
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.getGoodsList()
    },
    async getGoodsList() {
      let res = await this.axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.total = data.total
        this.goodsList = data.goods
      }
    }
  },
  async created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped></style>
