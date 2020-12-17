<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="字典类型">
        <el-input v-model="form.dictType" />
      </el-form-item>
      <el-form-item label="数据标签">
        <el-input v-model="form.dictLabel" />
      </el-form-item>
      <el-form-item label="数据键值">
        <el-input v-model="form.dictValue" />
      </el-form-item>
      <el-form-item label="排序显示">
        <el-input v-model="form.dictSort" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
            :value="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入字典的备注" clearable size="small" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dataApi from '@/api/system/dict/data'
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
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          dataApi.addDictType(this.form).then(res => {
            this.$message.success(res.msg)
            // 添加成功后，刷新数据，关闭弹窗
            this.$emit('getTypeList')
            this.$emit('closeAddDialog')
          })
        }
      })
    }
  }

}
</script>

<style>

</style>
