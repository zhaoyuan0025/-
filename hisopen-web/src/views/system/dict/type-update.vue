<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="字典名称">
        <el-input v-model="form.dictName" placeholder="请输入字典名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="字典类型">
        <el-input v-model="form.dictType" placeholder="请输入字典类型" clearable size="small" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="form.status" :label="0">正常</el-radio>
        <el-radio v-model="form.status" :label="1">停用</el-radio>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入字典备注" clearable size="small" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即修改</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import typeApi from '@/api/system/dict/type'
export default {
  props: {
    form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      typeApi.updateDictType(this.form).then(res => {
        this.$message.success(res.msg)
        this.$emit('getTypeList')
        this.$emit('closeUpdateDialog')
      })
    },
    close() {
      this.$emit('closeUpdateDialog')
    }
  }

}
</script>

<style>

</style>
