<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="字典类型" prop="dictType">
        <el-select
          v-model="queryParams.dictType"
          placeholder="请选择字典类型"
          clearable
          size="small"
          style="width:240px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictType"
            :label="dict.dictName"
            :value="dict.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="queryParams.dictLabel"
          placeholder="请输入字典标签"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="字典状态"
          clearable
          size="small"
          style="width:240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->

    <!-- 表头按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <!-- 测试 -->
      <!-- <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="test">点击</el-button>
      </el-col> -->
    </el-row>
    <!-- 表头按钮结束 -->

    <!-- 表格数据开始 -->
    <el-table v-loading="loading" border :data="dictDataTableList" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编码" prop="dictCode" align="center" />
      <el-table-column label="字典标签" prop="dictLabel" align="center" />
      <el-table-column label="字典键值" prop="dictValue" align="center" />
      <el-table-column label="字典排序" prop="dictSort" align="center" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="备注" prop="remark" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格数据结束 -->

    <!-- 分页 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 分页组件结束 -->

    <!-- 添加弹窗的开始 -->
    <el-drawer
      title="添加"
      :visible.sync="AddDrawer"
      :direction="direction"
    >
      <data-add />
    </el-drawer>
    <!-- 添加弹窗的结束 -->

    <!-- 修改的弹窗的开始 -->
    <!-- 修改的弹窗的结束 -->

    <!-- 添加修改的弹窗的开始 -->
    <!-- 添加修改的弹窗的结束 -->
  </div>
</template>

<script>
import dataApi from '@/api/system/dict/data'
import typeApi from '@/api/system/dict/type'
import dataAdd from './data-add'
export default {
  components: {
    dataAdd
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 字典数据表格数据
      dictDataTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 默认查询的类型
      defaultDictType: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictLabel: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          { required: true, message: '数据标签不能为空', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '数据键值不能为空', trigger: 'blur' }
        ]
      },
      AddDrawer: false // 控制添加的弹窗的显示
    }
  },
  created() {
    this.getDataList()
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据 一进入页面加载状态
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 取路由路径上的参数
    const dictId = this.$route.params && this.$route.params.dictId // 路由传参
    typeApi.getDictTypeById(dictId).then(res => {
      // 给查询条件的下拉框给默认值
      this.queryParams.dictType = res.data.dictType
      this.defaultDictType = res.data.dictType
      // 加载数据
    })
    this.getType()
  },
  methods: {
    getDataList() {
      this.loading = true
      dataApi.listForPage(this.queryParams).then(res => {
        this.dictDataTableList = res.data
        this.loading = false
        this.total = res.total
      })
    },
    // 加载字典类型数据
    getType() {
      typeApi.selectAllDictType().then(res => {
        console.log(res.data)
        this.typeOptions = res.data
      })
    },
    // 点击分页的时候触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getDataList()
    },
    // 状态翻译
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 查询
    handleQuery() {
      this.getDataList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.dictType = this.defaultDictType
      this.getDataList()
    },
    // 重置表单
    reset() {
      this.form = {
        dictCode: undefined,
        dictLable: undefined,
        dictValue: undefined,
        dictType: undefined,
        status: '0',
        dictSort: 0,
        remark: undefined
      }
      this.resetForm('form')
    },
    handleAdd() {
      this.AddDrawer = true
    }
  }

}
</script>

<style>

</style>
