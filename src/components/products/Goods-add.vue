<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tabs栏 -->
    <el-tabs tab-position="left" @tab-click="change" v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <!-- 基本信息内容 -->
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              :options="options"
              :props="props"
              v-model="form.goods_cat"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <template>
              <el-radio v-model="form.is_promote" :label="true">是</el-radio>
              <el-radio v-model="form.is_promote" :label="false">否</el-radio>
            </template>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <!-- 图片上传部分 -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="form.headers"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <!-- 富文本编辑器部分 -->
        <quill-editor class="myEditor" v-model="form.goods_introduce">
        </quill-editor>
        <el-button type="primary" @click="addGood">下一步</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'basic',
      form: {
        goods_cat: [], // 商品分类
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        is_promote: false,
        pics: [],
        headers: { Authorization: localStorage.getItem('myToken') },
        goods_introduce: ''
      },
      options: [],

      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    change(val) {
      let { index } = val
      this.active = +index
    },
    async getClass() {
      let res = await this.axios.get('categories?type=3')
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
      }
    },
    next(index, activeName) {
      this.active = index
      console.log(activeName)
      this.activeName = activeName
    },
    // 图片移除时的钩子
    handleRemove(response) {
      let tmpPath = response.response.data.tmp_path
      // 去数组中找到tmpPath对应的下标
      let idx = this.form.pics.findIndex(item => item.pic === tmpPath)
      this.form.pics.splice(idx, 1)
    },
    // 图片上传成功时的钩子
    handleSuccess(response, file, fileList) {
      this.form.pics.push({ pic: response.data.tmp_path })
    },
    // 添加商品
    async addGood() {
      let res = await this.axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      let {
        meta: { status }
      } = res.data
      if (status === 201) {
        this.$message.success('添加商品成功')
        this.$router.push('goods')
      }
    }
  },
  created() {
    this.getClass()
  }
}
</script>

<style lang="less" scoped>
.myEditor {
  background-color: #fff;
}
</style>
