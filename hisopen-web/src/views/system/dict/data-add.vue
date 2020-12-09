<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="字典标签">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="字典键值">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="字典排序">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}, // 表单对象
      // 表单校验
      rules: {
        name: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  methods: {

  }

}
</script>

<style>

</style>
